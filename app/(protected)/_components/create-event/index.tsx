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

const CreateEvent = (
  props: Partial<React.ComponentProps<typeof CustomDialog>> & {
    setOpen: Dispatch<SetStateAction<boolean>>;
  }
) => {
  const [file, setFile] = useState<File | null>(null);
  const { open = false, setOpen } = props;

  const form = useForm<z.infer<typeof createEventSchema>>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {},
  });

  const handleCloseCreateEvent = () => {
    setOpen(false);
    setFile(null);
    form.reset();
  };

  return (
    <CustomDialog
      open={open}
      title="Create Event"
      className="w-[800px]"
      saveText="Create"
      onClose={handleCloseCreateEvent}
    >
      <div className="flex gap-5 flex-col md:flex-row items-center md:items-start">
        <UploadEventLogo setFile={setFile} file={file} />
        <Form {...form}>
          <div className="flex-1 flex gap-2 flex-col w-full">
            <FormField
              control={form.control}
              name="name"
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
                              value={field.value?.from}
                              onChange={date => {
                                field.onChange({
                                  from: date,
                                  to: undefined,
                                });
                              }}
                              disabled={date => date < new Date()}
                            />
                          </FormControl>
                          <FormMessage />
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
                          <FormMessage />
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
