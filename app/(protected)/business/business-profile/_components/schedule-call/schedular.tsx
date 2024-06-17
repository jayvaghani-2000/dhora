import { getAvailabilityDetail } from "@/actions/(protected)/business/availability/getAvailabilityDetail";
import {
  getAvailabilityDetailType,
  getSubEventsType,
} from "@/actions/_utils/types.type";
import CustomDialog from "@/components/shared/custom-dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { createCallSchema, scheduleCallSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { getDay, subDays } from "date-fns";
import { capitalize } from "lodash";
import React, { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FaRegClock } from "react-icons/fa";
import { graySubtitleFonts, titlesFonts } from "@/lib/typography";
import RichEditor from "@/components/shared/rich-editor";
import { availabilityAsString } from "../../../availability/_utils/initializeAvailability";
import TimezoneSelect from "@/components/shared/timezone-select";
import { Label } from "@/components/ui/label";
import { getActiveDays } from "@/actions/(protected)/customer/booking/getActiveDays";
import { utcToHhMm } from "@/lib/schedule";
import { formatDate, timeZone } from "@/lib/common";
import { getTimeSlots } from "@/actions/(protected)/customer/booking/getTimeSlot";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { getSubEvents } from "@/actions/(protected)/customer/sub-events/getSubEvents";
import clsx from "clsx";
import { useToast } from "@/components/ui/use-toast";
import { createBooking } from "@/actions/(protected)/customer/booking/createBooking";
import { useAuthStore } from "@/provider/store/authentication";
import ScheduleCall from ".";
import MultiSelect from "@/components/shared/multi-select";
import { useParams } from "next/navigation";

type propType = Partial<React.ComponentProps<typeof CustomDialog>> &
  React.ComponentProps<typeof ScheduleCall> & {
    setOpen: Dispatch<SetStateAction<boolean>>;
  };

type valueType = {
  timezone: string | null;
  meetDate: Date | undefined;
  activeDays: number[];
  availability: getAvailabilityDetailType["data"] | null;
  dayAvailableSlot: string[];
  selectedSlot: string | null;
  loading: boolean;
};

const defaultValue = {
  timezone: timeZone,
  meetDate: undefined,
  activeDays: [],
  availability: null,
  dayAvailableSlot: [],
  selectedSlot: null,
  loading: false,
} as valueType;

const Schedular = (props: propType) => {
  const { open = false, setOpen, user, addOns, packages, bookingTypes } = props;
  const { toast } = useToast();
  const { profile } = useAuthStore();
  const params = useParams();
  const [activeStep, setActiveStep] = useState(1);
  const [subEvents, setSubEvents] = useState([] as getSubEventsType["data"]);
  const [values, setValues] = useState(defaultValue);

  const handleCloseModal = () => {
    setOpen(false);
  };

  const events = user?.events || [];

  const collectPackageInfo = useForm<z.infer<typeof createCallSchema>>({
    resolver: zodResolver(createCallSchema),
    defaultValues: {
      package_id: [],
      event_id: undefined,
      add_on_id: [],
      sub_event_id: [],
    },
    reValidateMode: "onChange",
  });

  const form = useForm<z.infer<typeof scheduleCallSchema>>({
    resolver: zodResolver(scheduleCallSchema),
    defaultValues: {},
    reValidateMode: "onChange",
  });

  const getAvailability = async (bookingId: string) => {
    const bookingType = bookingTypes!.find(i => i.id === bookingId);

    const res = await getAvailabilityDetail(bookingType!.availability_id);

    if (res.success) {
      const activeDays = await getActiveDays({
        timezone: values.timezone!,
        availabilityId: res.data.id,
      });
      setValues(prev => ({
        ...prev,
        activeDays: activeDays.data ?? [],
        availability: res.data,
      }));
    }
  };

  const handleChangeTimezone = async (value: string, bookingId: string) => {
    setValues(prev => ({
      ...prev,
      timezone: value,
      selectedSlot: null,
      loading: true,
    }));
    if (values.meetDate) {
      await handleGetAvailabilitySlot(value, bookingId, values.meetDate);
    }
    const res = await getActiveDays({
      timezone: value,
      availabilityId: values.availability!.id,
    });

    if (res.success) {
      setValues(prev => ({
        ...prev,
        activeDays: res.data!,
        loading: false,
      }));
    } else {
      setValues(prev => ({
        ...prev,
        activeDays: [],
        loading: false,
      }));
    }
  };

  const handleGetAvailabilitySlot = async (
    timezone: string,
    bookingId: string,
    date: Date
  ) => {
    const res = await getTimeSlots({
      date: date,
      timezone: timezone,
      bookingTypeId: bookingId,
      businessId: (params.slug as string) ?? (profile!.business_id as string),
    });
    if (res.success) {
      setValues(prev => ({ ...prev, dayAvailableSlot: res.data ?? [] }));
    } else {
      setValues(prev => ({ ...prev, dayAvailableSlot: [] }));
    }
  };

  const handleCreateBookingType = async () => {
    if (!params.slug) {
      return toast({
        title: "You can't create booking with yourself",
      });
    }
    if (!values.selectedSlot) {
      return toast({
        title: "Please select time slot",
      });
    } else {
      await form.trigger();
      const value = form.getValues();
      const event = collectPackageInfo.getValues();

      const selectedBookingType = bookingTypes!.find(
        i => i.id === value.booking_type_id
      );

      const res = await createBooking({
        businessId: params.slug as string,
        time: values.selectedSlot,
        duration: selectedBookingType!.duration as number,
        event: event,
        availability_id: selectedBookingType?.availability_id!,
        customer_timezone: values.timezone!,
      });

      if (res.success) {
        handleCloseModal();
        return toast({
          title: "Booking created successfully",
        });
      } else {
        return toast({
          title: res.error,
        });
      }
    }
  };

  const getSlots = () => {
    if (values.meetDate && values.loading) {
      return (
        <>
          <Skeleton className="h-[34px] lg:h-[38px] w-full" />
          <Skeleton className="h-[34px] lg:h-[38px] w-full" />
          <Skeleton className="h-[34px] lg:h-[38px] w-full" />
        </>
      );
    } else if (!values.meetDate) {
      return (
        <div className="text-secondary-light-gray font-medium text-base">
          Select date
        </div>
      );
    } else if (values.meetDate && values.dayAvailableSlot.length === 0) {
      return (
        <div className="text-secondary-light-gray font-medium text-base">
          No slots available
        </div>
      );
    }
    return values.dayAvailableSlot.map(i => {
      return (
        <Button
          key={i}
          variant={"outline"}
          className={clsx({
            "flex items-center  space-x-2": true,
            "bg-accent": i === values.selectedSlot,
          })}
          onClick={() => {
            setValues(prev => ({ ...prev, selectedSlot: i }));
          }}
        >
          {utcToHhMm(i, values.timezone!)}
        </Button>
      );
    });
  };

  return (
    <CustomDialog
      open={open}
      title={activeStep === 1 ? "Select Event and Packages" : "Schedule A Call"}
      className="w-[1200px]"
      onClose={() => {
        handleCloseModal();
      }}
      onSubmit={async () => {
        if (activeStep === 1) {
          await collectPackageInfo.trigger();
          if (collectPackageInfo.formState.isValid) {
            setActiveStep(2);
          }
        } else {
          await handleCreateBookingType();
        }
      }}
      saveText={activeStep === 1 ? "Next" : "Save"}
    >
      <ScrollArea>
        {activeStep === 1 ? (
          <Form {...collectPackageInfo}>
            <div className="flex-1 flex gap-2 flex-col w-full max-w-[600px] m-auto">
              <FormLabel>Events Detail</FormLabel>
              <FormField
                control={collectPackageInfo.control}
                name="event_id"
                render={({ field }) => (
                  <FormField
                    control={collectPackageInfo.control}
                    name="sub_event_id"
                    render={({ field: sub_event_field }) => (
                      <div className=" flex gap-2 flex-col lg:flex-row ">
                        <FormItem className="flex-1">
                          <Select
                            onValueChange={async value => {
                              field.onChange(value);
                              sub_event_field.onChange([]);
                              const res = await getSubEvents(value);
                              if (res.success) {
                                setSubEvents(res.data!);
                              }
                            }}
                            defaultValue={field.value!}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={
                                    <span className="text-muted-foreground ">
                                      Select event
                                    </span>
                                  }
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {events.map(i => (
                                <SelectItem key={i.id} value={i.id}>
                                  {capitalize(i.title)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                        <FormItem className="flex-1">
                          {subEvents!.length > 0 ? (
                            <MultiSelect
                              options={subEvents!.map(i => ({
                                label: capitalize(i.title!),
                                value: i.id,
                              }))}
                              onChange={values => {
                                sub_event_field.onChange(values);
                              }}
                              value={sub_event_field.value}
                              placeholder="sub events"
                            />
                          ) : null}
                        </FormItem>
                      </div>
                    )}
                  />
                )}
              />
              <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-full mx-auto my-5" />
              <FormLabel>Packages and Add-ons</FormLabel>
              <div className=" flex gap-x-2 gap-y-2 flex-col lg:flex-row ">
                <FormField
                  control={collectPackageInfo.control}
                  name="package_id"
                  render={({ field }) => (
                    <FormItem className="flex-1 h-fit">
                      <MultiSelect
                        options={packages!.map(i => ({
                          label: capitalize(i.name!),
                          value: i.id,
                        }))}
                        onChange={values => {
                          field.onChange(values);
                        }}
                        value={field.value}
                        placeholder="packages"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={collectPackageInfo.control}
                  name="add_on_id"
                  render={({ field }) => (
                    <FormItem className="flex-1 h-fit">
                      <MultiSelect
                        options={addOns!.map(i => ({
                          label: capitalize(i.name!),
                          value: i.id,
                        }))}
                        onChange={values => {
                          field.onChange(values);
                        }}
                        value={field.value}
                        placeholder="add-ons"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </Form>
        ) : null}
      </ScrollArea>
      {activeStep === 2 ? (
        <Form {...form}>
          <FormField
            control={form.control}
            name="booking_type_id"
            render={({ field }) => {
              const selectedBookingType = bookingTypes!.find(
                i => i.id === field.value
              );

              return (
                <div>
                  <FormItem className="max-w-[300px]">
                    <FormLabel>Booking type</FormLabel>
                    <Select
                      onValueChange={e => {
                        field.onChange(e);
                        getAvailability(e);
                      }}
                      defaultValue={field.value!}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              <span className="text-muted-foreground ">
                                Select booking type
                              </span>
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {bookingTypes!.map(i => (
                          <SelectItem key={i.id} value={i.id}>
                            {capitalize(i.title)} ({i.duration} mins)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                  <Separator className="my-2" />
                  <div className="flex-1 justify-between flex gap-2 flex-col lg:flex-row w-full">
                    <div className="flex-1">
                      {selectedBookingType ? (
                        <div className="flex flex-col gap-1">
                          <div className={titlesFonts}>
                            {selectedBookingType.title}
                          </div>

                          <RichEditor
                            value={selectedBookingType.description}
                            readOnly
                          />

                          <div className="flex items-center gap-1 md:text-xs text-white bg-primary-light-gray w-fit px-1 font-semibold py-0.5 rounded-sm">
                            <FaRegClock className="h-3 w-3" />
                            <span>{selectedBookingType.duration} mins</span>
                          </div>

                          {values.availability ? (
                            <div className="flex flex-col  text-secondary-light-gray mt-3">
                              {availabilityAsString(values.availability, {
                                locale: "en",
                                hour12: true,
                              }).map(i => (
                                <span className={graySubtitleFonts} key={i}>
                                  {i}
                                </span>
                              ))}
                              <div className="max-w-full lg:max-w-[300px] mr-auto mt-4">
                                <Label>Timezone</Label>
                                <TimezoneSelect
                                  value={values.timezone!}
                                  onChange={value => {
                                    handleChangeTimezone(
                                      value,
                                      selectedBookingType!.id
                                    );
                                  }}
                                />
                              </div>
                            </div>
                          ) : null}
                        </div>
                      ) : (
                        <Skeleton className="h-[34px] lg:h-[38px] w-full" />
                      )}
                    </div>
                    <Separator
                      orientation="vertical"
                      className="h-auto hidden lg:block"
                    />
                    <Separator
                      orientation="horizontal"
                      className="w-auto block lg:hidden"
                    />
                    <Calendar
                      mode="single"
                      disabled={date => {
                        if (date < subDays(new Date(), 1)) {
                          return true;
                        } else {
                          return !values.activeDays.includes(getDay(date));
                        }
                      }}
                      onSelect={async date => {
                        if (date) {
                          setValues(prev => ({
                            ...prev,
                            meetDate: date,
                            selectedSlot: null,
                            loading: true,
                          }));
                          await handleGetAvailabilitySlot(
                            values.timezone as string,
                            selectedBookingType!.id,
                            date
                          );
                          setValues(prev => ({
                            ...prev,
                            loading: false,
                          }));
                        } else {
                          setValues(prev => ({
                            ...prev,
                            meetDate: date,
                            dayAvailableSlot: [],
                          }));
                        }
                      }}
                      selected={values.meetDate}
                      className="flex-1 flex justify-center"
                    />
                    <Separator
                      orientation="vertical"
                      className="h-auto hidden lg:block"
                    />
                    <Separator
                      orientation="horizontal"
                      className="w-auto block lg:hidden"
                    />
                    <ScrollArea className="flex-1 max-h-[360px] px-5">
                      <div className="sticky top-0 bg-background text-sm md:text-base font-semibold ">
                        {formatDate(values.meetDate ?? new Date())}
                      </div>
                      <div className="flex flex-col gap-1 mt-2">
                        {getSlots()}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              );
            }}
          />
        </Form>
      ) : null}
    </CustomDialog>
  );
};

export default Schedular;
