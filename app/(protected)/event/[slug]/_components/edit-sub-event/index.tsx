import CustomDialog from "@/components/shared/custom-dialog";
import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import RichEditor from "@/components/shared/rich-editor";
import { DatePicker } from "@/components/shared/date-picker";
import { useToast } from "@/components/ui/use-toast";
import { updateSubEventSchema } from "@/db/schema";
import PlacesAutocompleteInput from "@/components/shared/place-autocomplete";
import TimePicker from "@/app/(protected)/business/availability/_components/time-slot/time-picker";
import {
  getTimeFromDate,
  localTime,
  localTimeValue,
} from "@/app/(protected)/business/availability/_utils/initializeAvailability";
import dayjs from "dayjs";
import { useParams } from "next/navigation";
import {
  getEventDetailsType,
  getSubEventsType,
} from "@/actions/_utils/types.type";
import { isSameDay, subDays } from "date-fns";
import { updateSubEvent } from "@/actions/(protected)/customer/sub-events/updateSubEvent";

const EditSubEvent = (
  props: Partial<React.ComponentProps<typeof CustomDialog>> & {
    handleClose: () => void;
    event: getEventDetailsType["data"];
    subEvent: getSubEventsType["data"];
  }
) => {
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState("");
  const { open = false, handleClose, event, subEvent } = props;
  const { toast } = useToast();

  const { description, title, end_time, start_time, id, location, event_date } =
    subEvent?.[0] ?? {};

  const { single_day_event, to_date, from_date } = event!;

  const form = useForm<z.infer<typeof updateSubEventSchema>>({
    resolver: zodResolver(updateSubEventSchema),
    defaultValues: {
      description: description,
      title: title,
      location: location,
      event_date: new Date(event_date!),
      end_time: localTimeValue(end_time),
      start_time: localTimeValue(start_time),
    },
    reValidateMode: "onChange",
  });

  const handleCloseUpdateEvent = () => {
    handleClose();
    form.reset();
  };

  const handleSubmit = async (value: z.infer<typeof updateSubEventSchema>) => {
    setLoading(true);
    const res = await updateSubEvent({
      eventDetail: {
        ...value,
        start_time: getTimeFromDate(value.start_time),
        end_time: getTimeFromDate(value.end_time),
      },
      subEventId: id as unknown as string,
    });
    if (res.success) {
      toast({
        title: "Event updated successfully!",
      });

      handleCloseUpdateEvent();
    } else {
      toast({
        title: res.error,
      });
    }
    setLoading(false);
  };

  return (
    <CustomDialog
      open={open}
      title="Update Event"
      className="w-[800px]"
      saveText="Save"
      onClose={handleCloseUpdateEvent}
      onSubmit={async () => {
        await form.trigger();
        if (form.formState.isValid) {
          await handleSubmit(form.getValues());
        }
      }}
      disableAction={loading}
    >
      <div className="flex gap-5 flex-col md:flex-row items-center md:items-start">
        <Form {...form}>
          <div className="flex-1 flex gap-2 flex-col w-full">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Title" autoComplete="off" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <RichEditor value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="event_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Date</FormLabel>
                  <FormControl>
                    <DatePicker
                      placeholder="Select event date"
                      value={field.value ?? undefined}
                      onChange={field.onChange}
                      disabled={date => {
                        if (single_day_event) {
                          return !isSameDay(date, new Date(from_date!));
                        } else {
                          return (
                            date < new Date(subDays(from_date!, 1)) ||
                            date > new Date(to_date!)
                          );
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Location</FormLabel>
                  <PlacesAutocompleteInput
                    value={address}
                    onChange={e => {
                      setAddress(e);
                    }}
                    form={form}
                    fieldName="location"
                    placeholder="Select your location"
                    defaultValue={form.getValues("location") ?? undefined}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="start_time"
              render={({ field }) => {
                const start_time_value = field.value
                  ? dayjs(field.value)
                  : undefined;

                return (
                  <FormField
                    control={form.control}
                    name="end_time"
                    render={({ field: end_time_field }) => {
                      const end_time_value = end_time_field.value
                        ? dayjs(end_time_field.value)
                        : undefined;
                      return (
                        <div className="flex">
                          <FormItem>
                            <FormLabel>Start Time</FormLabel>
                            <FormControl>
                              <TimePicker
                                value={start_time_value}
                                max={end_time_value}
                                onChange={value => {
                                  field.onChange(localTime(value));
                                }}
                                optionIncrement={60}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                          <div className="flex flex-col justify-between px-2">
                            <div></div>
                            <div className="h-7 lg:h-8">-</div>
                          </div>
                          <FormItem>
                            <FormLabel>End Time</FormLabel>
                            <FormControl>
                              <TimePicker
                                value={end_time_value}
                                min={start_time_value}
                                onChange={value => {
                                  end_time_field.onChange(localTime(value));
                                }}
                                optionIncrement={60}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        </div>
                      );
                    }}
                  />
                );
              }}
            />
          </div>
        </Form>
      </div>
    </CustomDialog>
  );
};

export default EditSubEvent;
