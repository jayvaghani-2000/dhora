"use client";
import RichEditor from "@/components/shared/rich-editor/index";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { PiPlus } from "react-icons/pi";
import { createBookingTypeSchema } from "@/lib/schema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomDialog from "@/components/shared/custom-dialog";
import { createBookingType } from "@/actions/(protected)/business/booking-types/createBookingType";

const CreateBookingTypeModel = () => {
  const [openCreateBookingType, setOpenCreateBookingType] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof createBookingTypeSchema>>({
    resolver: zodResolver(createBookingTypeSchema),
    defaultValues: {
      title: "",
      description: "",
      duration: 15,
    },
  });

  const handleClose = () => {
    setOpenCreateBookingType(false);
    form.reset();
  };

  const handleSubmit = async (
    value: z.infer<typeof createBookingTypeSchema>
  ) => {
    setLoading(true);
    await createBookingType({
      ...value,
      description: value.description,
    });
    setLoading(false);
  };

  return (
    <div>
      <div className="flex justify-between gap-5 items-center">
        <div className="text-xs md:text-sm">
          Create bookings type book event on your calendar.
        </div>
        <Button
          onClick={() => {
            setOpenCreateBookingType(true);
          }}
          className="text-xs lg:text-sm p-2 h-fit lg:px-4 "
        >
          <PiPlus size={16} className="mr-2" />
          New
        </Button>
      </div>
      <CustomDialog
        open={openCreateBookingType}
        title="Add a Booking Type"
        className="w-[600px]"
        onClose={handleClose}
        onSubmit={async () => {
          await form.trigger();
          if (form.formState.isValid) {
            await handleSubmit(form.getValues());
          }
        }}
        disableAction={loading}
      >
        <Form {...form}>
          <div className="flex gap-2 flex-col">
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
      </CustomDialog>
    </div>
  );
};

export default CreateBookingTypeModel;
