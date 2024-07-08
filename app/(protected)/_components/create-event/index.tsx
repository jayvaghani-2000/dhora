import CustomDialog from "@/components/shared/custom-dialog";
import React, { Dispatch, SetStateAction, useState } from "react";
import UploadEventLogo from "./upload-event-logo";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createEventSchema } from "@/lib/schema";
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
import { DateRangePicker } from "@/components/shared/range-picker";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/shared/date-picker";
import { createEvent } from "@/actions/(protected)/customer/events/createEvent";
import { useToast } from "@/components/ui/use-toast";
import { useAppDispatch } from "@/provider/store";
import { setAuthData } from "@/provider/store/authentication";
import { me } from "@/actions/(auth)/me";
import { setGlobalData, useGlobalStore } from "@/provider/store/global";

const CreateEvent = (
  props: Partial<React.ComponentProps<typeof CustomDialog>>
) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);
  const {createEvent: open} = useGlobalStore()
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof createEventSchema>>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      single_day_event: false,
      description: "",
      title: "",
      date: {
        from: undefined,
        to: undefined,
      },
    },
    reValidateMode: "onChange",
  });

  const handleCloseCreateEvent = () => {
    dispatch(setGlobalData({createEvent: false}));
    setFile(null);
    form.reset();
  };

  const handleSubmit = async (value: z.infer<typeof createEventSchema>) => {
    setLoading(true);
    const logo = new FormData();
    if (file) {
      logo.append("image", file);
    }
    const res = await createEvent({
      eventDetail: value,
      logo,
    });
    if (res.success) {
      toast({
        title: res.data,
      });

      const userData = await me();

      if (userData.success) {
        dispatch(
          setAuthData({
            profile: userData.data,
          })
        );
      }

      handleCloseCreateEvent();
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
      title="Create Itinerary"
      className="w-[800px]"
      saveText="Create"
      onClose={handleCloseCreateEvent}
      onSubmit={async () => {
        await form.trigger();
        if (form.formState.isValid) {
          await handleSubmit(form.getValues());
        } else {
          setSubmitCount(prev => prev + 1);
        }
      }}
      disableAction={loading}
    >
      <div className="flex gap-5 flex-col md:flex-row items-center md:items-start">
        <UploadEventLogo setFile={setFile} file={file} />
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
              name="single_day_event"
              render={({ field }) => (
                <div className="flex gap-3 flex-col">
                  <FormItem className="flex items-center gap-2">
                    <FormControl className="mt-2">
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Single Day Event</FormLabel>
                    <FormMessage />
                  </FormItem>

                  {field.value ? (
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="max-w-[300px]">
                          <FormControl>
                            <DatePicker
                              placeholder="Select event date"
                              value={field.value.from}
                              onChange={date => {
                                field.onChange({
                                  from: date,
                                  to: undefined,
                                });
                              }}
                              disabled={date => date < new Date()}
                            />
                          </FormControl>
                          {!field.value.from && submitCount > 0 ? (
                            <p
                              className={"text-sm font-medium text-destructive"}
                            >
                              Select a date
                            </p>
                          ) : null}
                        </FormItem>
                      )}
                    />
                  ) : (
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <DateRangePicker
                              onChange={range => {
                                if (range?.from && range.to) {
                                  field.onChange({
                                    from: range.from,
                                    to: range.to,
                                  });
                                } else {
                                  field.onChange({
                                    from: undefined,
                                    to: undefined,
                                  });
                                }
                              }}
                              value={field.value}
                              placeholder="Pick a event date range"
                              disabled={date => date < new Date()}
                            />
                          </FormControl>
                          {!field.value.from &&
                            !field.value.to &&
                            submitCount > 0 && (
                              <p
                                className={
                                  "text-sm font-medium text-destructive"
                                }
                              >
                                Select a date
                              </p>
                            )}
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              )}
            />
          </div>
        </Form>
      </div>
    </CustomDialog>
  );
};

export default CreateEvent;
