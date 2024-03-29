import React from "react";
import { z } from "zod";
import { editBookingTypeSchema } from "../../_utils/schema";
import { UseFormReturn } from "react-hook-form";
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

type propType = {
  form: UseFormReturn<z.infer<typeof editBookingTypeSchema>>;
};

const Event = (props: propType) => {
  const { form } = props;

  return (
    <Form {...form}>
      <div className="border border-input rounded-md p-4 flex gap-2 flex-col mt-4">
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
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration</FormLabel>
              <FormControl>
                <div className="flex items-center">
                  <Input
                    placeholder="Duration"
                    className="rounded-r-none"
                    type="number"
                    {...field}
                    onChange={e => {
                      const value = parseFloat(e.target.value);
                      if (isNaN(value)) {
                        field.onChange(0);
                      } else {
                        field.onChange(value);
                      }
                    }}
                  />
                  <div className="h-8 lg:h-10 p-1 lg:p-2  border border-input border-l-0 rounded-r-md text-sm bg-divider">
                    Minutes
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </Form>
  );
};

export default Event;
