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

type propType = Partial<React.ComponentProps<typeof CustomDialog>> & {
  setOpen: Dispatch<SetStateAction<boolean>>;
  bookingTypes: getBookingTypesType["data"];
};

const Schedular = (props: propType) => {
  const { open = false, setOpen, bookingTypes } = props;
  const [timezone, setTimeZone] = useState<string | null>(null);
  const [meetDate, setMeetDate] = useState<Date | undefined>(undefined);
  const [activeDays, setActiveDays] = useState<number[]>([]);
  const [availability, setAvailability] = useState<
    getAvailabilityDetailType["data"] | null
  >(null);

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
      setAvailability(res.data);
      setTimeZone(res.data.timezone);
      setActiveDays(res.data.days ?? []);
    }
  };

  const handleChangeTimezone = async (value: string) => {
    setTimeZone(value);
    const res = await getActiveDays({
      timezone: value,
      availabilityId: availability!.id as unknown as string,
    });

    if (res.success) {
      setActiveDays(res.data!);
    } else {
      setActiveDays([]);
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

                        {availability ? (
                          <div className="flex flex-col  text-secondary-light-gray mt-3">
                            {availabilityAsString(availability, {
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
                                value={timezone!}
                                onChange={handleChangeTimezone}
                              />
                            </div>
                          </div>
                        ) : null}
                      </div>
                    ) : (
                      <Skeleton className="h-4 w-[250px]" />
                    )}
                  </div>
                  <Calendar
                    mode="single"
                    disabled={date => {
                      if (date < subDays(new Date(), 1)) {
                        return true;
                      } else {
                        return !activeDays.includes(getDay(date));
                      }
                    }}
                    onSelect={date => {
                      setMeetDate(date);
                    }}
                    selected={meetDate}
                    className="flex-1"
                  />
                  <div className="flex-1"></div>
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
