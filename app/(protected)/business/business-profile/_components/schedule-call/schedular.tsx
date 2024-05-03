import { getAvailabilityDetail } from "@/actions/(protected)/business/availability/getAvailabilityDetail";
import {
  getAvailabilityDetailType,
  getBookingTypesType,
} from "@/actions/_utils/types.type";
import CustomDialog from "@/components/shared/custom-dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
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
import { scheduleCallSchema } from "@/lib/schema";
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
import { formatDate } from "@/lib/common";
import { getTimeSlots } from "@/actions/(protected)/customer/booking/getTimeSlot";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";

type propType = Partial<React.ComponentProps<typeof CustomDialog>> & {
  setOpen: Dispatch<SetStateAction<boolean>>;
  bookingTypes: getBookingTypesType["data"];
};

type valueType = {
  timezone: string | null;
  meetDate: Date | undefined;
  activeDays: number[];
  availability: getAvailabilityDetailType["data"] | null;
  dayAvailableSlot: string[];
};

const Schedular = (props: propType) => {
  const { open = false, setOpen, bookingTypes } = props;
  const [values, setValues] = useState({
    timezone: null,
    meetDate: undefined,
    activeDays: [],
    availability: null,
    dayAvailableSlot: [],
  } as valueType);

  const form = useForm<z.infer<typeof scheduleCallSchema>>({
    resolver: zodResolver(scheduleCallSchema),
    defaultValues: {},
    reValidateMode: "onChange",
  });

  const getAvailability = async (bookingId: string) => {
    const bookingType = bookingTypes!.find(
      i => (i.id as unknown as string) === bookingId
    );

    const res = await getAvailabilityDetail(
      bookingType!.availability_id as unknown as string
    );

    if (res.success) {
      setValues(prev => ({
        ...prev,
        timezone: res.data.timezone,
        activeDays: res.data.days ?? [],
        availability: res.data,
      }));
    }
  };

  const handleChangeTimezone = async (value: string, bookingId: string) => {
    setValues(prev => ({
      ...prev,
      timezone: value,
    }));
    if (values.meetDate) {
      await handleGetAvailabilitySlot(value, bookingId, values.meetDate);
    }
    const res = await getActiveDays({
      timezone: value,
      availabilityId: values.availability!.id as unknown as string,
    });

    if (res.success) {
      setValues(prev => ({
        ...prev,
        activeDays: res.data!,
      }));
    } else {
      setValues(prev => ({
        ...prev,
        activeDays: [],
      }));
    }
  };

  const handleGetAvailabilitySlot = async (
    timezone: string,
    bookingId: string,
    date: Date
  ) => {
    const res = await getTimeSlots({
      date: date as Date,
      timezone: timezone,
      bookingTypeId: bookingId,
    });
    if (res.success) {
      setValues(prev => ({ ...prev, dayAvailableSlot: res.data ?? [] }));
    } else {
      setValues(prev => ({ ...prev, dayAvailableSlot: [] }));
    }
  };

  return (
    <CustomDialog
      open={open}
      title="Schedule A Call"
      className="w-[1200px]"
      onClose={() => {
        setOpen(false);
      }}
      onSubmit={async () => {}}
    >
      <Form {...form}>
        <FormField
          control={form.control}
          name="booking_type_id"
          render={({ field }) => {
            const selectedBookingType = bookingTypes!.find(
              i => (i.id as unknown as string) === field.value
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
                        <SelectItem
                          key={i.id}
                          value={i.id as unknown as string}
                        >
                          {capitalize(i.title)} ({i.duration} mins)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
                <Separator className="my-2" />
                <div className="flex-1 justify-between flex gap-2 flex-row w-full">
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
                                    selectedBookingType!.id as unknown as string
                                  );
                                }}
                              />
                            </div>
                          </div>
                        ) : null}
                      </div>
                    ) : (
                      <Skeleton className="h-4 w-[250px]" />
                    )}
                  </div>
                  <Separator orientation="vertical" className="h-auto" />
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
                        setValues(prev => ({ ...prev, meetDate: date }));
                        await handleGetAvailabilitySlot(
                          values.timezone as string,
                          selectedBookingType!.id as unknown as string,
                          date
                        );
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
                  <Separator orientation="vertical" className="h-auto" />
                  <ScrollArea className="flex-1 max-h-[300px] px-5">
                    <div className="sticky top-0 bg-background text-sm md:text-base font-semibold ">
                      {formatDate(values.meetDate ?? new Date())}
                    </div>
                    {values.dayAvailableSlot.map(i => {
                      return (
                        <Button
                          key={i}
                          variant={"outline"}
                          className="flex items-center py-0.5 space-x-2"
                        >
                          {utcToHhMm(i, values.timezone!)}
                        </Button>
                      );
                    })}
                  </ScrollArea>
                </div>
              </div>
            );
          }}
        />
      </Form>
    </CustomDialog>
  );
};

export default Schedular;
