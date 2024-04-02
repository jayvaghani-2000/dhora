import {
  createAvailabilitySchemaType,
  getAvailabilityType,
  getBookingTypeDetailType,
} from "@/actions/_utils/types.type";
import React from "react";
import { z } from "zod";
import { editBookingTypeSchema } from "@/lib/schema";
import { UseFormReturn } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import CustomSelect from "@/components/shared/custom-select";
import { Badge } from "@/components/ui/badge";
import { weekDays } from "@/lib/constant";
import { RxOpenInNewWindow } from "react-icons/rx";
import clsx from "clsx";
import Link from "next/link";

type propType = {
  bookingType: getBookingTypeDetailType["data"];
  availability: getAvailabilityType["data"];
  form: UseFormReturn<z.infer<typeof editBookingTypeSchema>>;
};

const Availability = (props: propType) => {
  const { form, availability } = props;

  const selectedAvailability = availability?.find(
    i => (i.id as unknown as string) === form.getValues("availability_id")
  );

  const availableSlots =
    (selectedAvailability?.availability as createAvailabilitySchemaType["availability"]) ??
    [];

  return (
    <div className="border border-input rounded-md mt-4">
      <Form {...form}>
        <div className="p-4 flex gap-4 flex-col">
          <FormField
            control={form.control}
            name="availability_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Availability</FormLabel>
                <FormControl>
                  <CustomSelect
                    onChange={value => {
                      field.onChange(value);
                    }}
                    value={field.value}
                    options={
                      availability?.map(i => ({
                        label: (
                          <div>
                            {i.name!}{" "}
                            {i.default ? (
                              <Badge className="bg-green-800 hover:bg-green-900 text-white text-xs rounded-sm px-1">
                                Default
                              </Badge>
                            ) : null}
                          </div>
                        ),
                        value: String(i.id),
                      })) ?? []
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="p-4 flex gap-4 flex-col border-t border-input">
          {availableSlots.map((slots, index) => (
            <div
              key={weekDays[index]}
              className="flex text-secondary-light-gray text-sm"
            >
              <span
                className={clsx({
                  "capitalize w-24 lg:w-[180px]": true,
                  "line-through	": slots.length === 0,
                })}
              >
                {weekDays[index]}
              </span>
              {slots.length === 0 ? (
                <div>Unavailable</div>
              ) : (
                <div className="flex flex-1 flex-col gap-2">
                  {slots.map((slot, index) => (
                    <div
                      className="max-w-[160px] lg:max-w-[200px] flex justify-between  gap-5"
                      key={`${slot.start_time}-${slot.end_time}${index}`}
                    >
                      <div>{slot.start_time}</div>
                      <div>-</div>
                      <div>{slot.end_time}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </Form>
      <div className="p-4 border-t border-input text-secondary-light-gray text-sm flex justify-between">
        <div>{selectedAvailability?.timezone}</div>
        <Link
          className="flex gap-1 items-center"
          target="_blank"
          href={`/business/availability/${selectedAvailability?.id}`}
        >
          Edit Availability
          <RxOpenInNewWindow />
        </Link>
      </div>
    </div>
  );
};

export default Availability;
