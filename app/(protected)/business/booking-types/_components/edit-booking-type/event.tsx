import React from "react";
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
import { Switch } from "@/components/ui/switch";
import CustomSelect from "@/components/shared/custom-select";
import { Button } from "@/components/ui/button";
import { LiaPlusSolid } from "react-icons/lia";
import { cloneDeep } from "lodash";
import { RiDeleteBin6Line } from "react-icons/ri";
import { editBookingTypeSchemaType } from "@/lib/schema";
import { stringCasting } from "@/lib/common";

type propType = {
  form: UseFormReturn<editBookingTypeSchemaType>;
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
                    min="0"
                    onChange={e => {
                      const value = parseFloat(e.target.value);
                      if (isNaN(value) || Number(value) < 0) {
                        field.onChange(null);
                      } else {
                        field.onChange(value);
                      }
                    }}
                    value={stringCasting(field.value)}
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
        <FormField
          control={form.control}
          name="booking_frequency"
          render={({ field }) => {
            const { value } = field;

            const getFrequencyOption = (current: string) => {
              const options = [{ label: `Per ${current}`, value: current }];

              const possibleOption = ["day", "week", "month", "year"];

              possibleOption.forEach(i => {
                if (!Object.keys(value || {}).includes(i) && i !== current) {
                  options.push({ label: `Per ${i}`, value: i });
                }
              });

              return options;
            };

            return (
              <FormItem>
                <div className="flex justify-between items-center mt-4">
                  <FormLabel>Limit booking frequency</FormLabel>
                  <FormControl>
                    <Switch
                      checked={!!field.value}
                      onCheckedChange={checked => {
                        if (checked) {
                          field.onChange({ day: 1 });
                        } else {
                          field.onChange(null);
                        }
                      }}
                    />
                  </FormControl>
                </div>

                <div className="flex flex-col gap-1">
                  {Object.keys(value || {}).includes("day") && (
                    <div className="flex gap-2 items-center">
                      <Input
                        placeholder="1"
                        type="number"
                        value={value?.day}
                        onChange={e => {
                          const count = parseFloat(e.target.value);
                          if (isNaN(count)) {
                            field.onChange({ ...value, day: 0 });
                          } else {
                            field.onChange({ ...value, day: count });
                          }
                        }}
                        className="w-16"
                      />
                      <div className="w-32">
                        <CustomSelect
                          options={getFrequencyOption("day")}
                          value="day"
                          onChange={option => {
                            const count = value?.day;
                            const updatedValue = cloneDeep(value || {});
                            delete updatedValue.day;
                            field.onChange({
                              ...updatedValue,
                              [option]: count,
                            });
                          }}
                        />
                      </div>
                      {Object.keys(value || {}).length > 1 ? (
                        <Button
                          variant="outline"
                          className="p-1 h-[28px]"
                          onClick={() => {
                            const updatedValue = cloneDeep(value || {});
                            delete updatedValue.day;
                            field.onChange({
                              ...updatedValue,
                            });
                          }}
                        >
                          <RiDeleteBin6Line size={18} color="#b6b6b6" />
                        </Button>
                      ) : null}
                    </div>
                  )}
                  {Object.keys(value || {}).includes("week") && (
                    <div className="flex gap-2 items-center">
                      <Input
                        placeholder="1"
                        type="number"
                        value={value?.week}
                        onChange={e => {
                          const count = parseFloat(e.target.value);
                          if (isNaN(count)) {
                            field.onChange({ ...value, week: 0 });
                          } else {
                            field.onChange({ ...value, week: count });
                          }
                        }}
                        className="w-16"
                      />
                      <div className="w-32">
                        <CustomSelect
                          options={getFrequencyOption("week")}
                          value="week"
                          onChange={option => {
                            const count = value?.week;
                            const updatedValue = cloneDeep(value || {});
                            delete updatedValue.week;
                            field.onChange({
                              ...updatedValue,
                              [option]: count,
                            });
                          }}
                        />
                      </div>
                      {Object.keys(value || {}).length > 1 ? (
                        <Button
                          variant="outline"
                          className="p-1 h-[28px]"
                          onClick={() => {
                            const updatedValue = cloneDeep(value || {});
                            delete updatedValue.week;
                            field.onChange({
                              ...updatedValue,
                            });
                          }}
                        >
                          <RiDeleteBin6Line size={18} color="#b6b6b6" />
                        </Button>
                      ) : null}
                    </div>
                  )}
                  {Object.keys(value || {}).includes("month") && (
                    <div className="flex gap-2 items-center">
                      <Input
                        placeholder="1"
                        type="number"
                        value={value?.month}
                        onChange={e => {
                          const count = parseFloat(e.target.value);
                          if (isNaN(count)) {
                            field.onChange({ ...value, month: 0 });
                          } else {
                            field.onChange({ ...value, month: count });
                          }
                        }}
                        className="w-16"
                      />
                      <div className="w-32">
                        <CustomSelect
                          options={getFrequencyOption("month")}
                          value="month"
                          onChange={option => {
                            const count = value?.month;
                            const updatedValue = cloneDeep(value || {});
                            delete updatedValue.month;
                            field.onChange({
                              ...updatedValue,
                              [option]: count,
                            });
                          }}
                        />
                      </div>
                      {Object.keys(value || {}).length > 1 ? (
                        <Button
                          variant="outline"
                          className="p-1 h-[28px]"
                          onClick={() => {
                            const updatedValue = cloneDeep(value || {});
                            delete updatedValue.month;
                            field.onChange({
                              ...updatedValue,
                            });
                          }}
                        >
                          <RiDeleteBin6Line size={18} color="#b6b6b6" />
                        </Button>
                      ) : null}
                    </div>
                  )}
                  {Object.keys(value || {}).includes("year") && (
                    <div className="flex gap-2 items-center">
                      <Input
                        placeholder="1"
                        type="number"
                        value={value?.year}
                        className="w-16"
                        onChange={e => {
                          const count = parseFloat(e.target.value);
                          if (isNaN(count)) {
                            field.onChange({ ...value, year: 0 });
                          } else {
                            field.onChange({ ...value, year: count });
                          }
                        }}
                      />
                      <div className="w-32">
                        <CustomSelect
                          options={getFrequencyOption("year")}
                          value="year"
                          onChange={option => {
                            const count = value?.year;
                            const updatedValue = cloneDeep(value || {});
                            delete updatedValue.year;
                            field.onChange({
                              ...updatedValue,
                              [option]: count,
                            });
                          }}
                        />
                      </div>
                      {Object.keys(value || {}).length > 1 ? (
                        <Button
                          variant="outline"
                          className="p-1 h-[28px]"
                          onClick={() => {
                            const updatedValue = cloneDeep(value || {});
                            delete updatedValue.year;
                            field.onChange({
                              ...updatedValue,
                            });
                          }}
                        >
                          <RiDeleteBin6Line size={18} color="#b6b6b6" />
                        </Button>
                      ) : null}
                    </div>
                  )}
                </div>

                {!!field.value && Object.keys(value || {}).length !== 4 ? (
                  <Button
                    variant="link"
                    className="flex gap-1 items-center p-2 h-fit lg:px-2"
                    onClick={() => {
                      const addedFrequency = Object.keys(value || {});
                      if (!addedFrequency.includes("day")) {
                        field.onChange({ ...value, day: 1 });
                      } else if (!addedFrequency.includes("week")) {
                        field.onChange({ ...value, week: 1 });
                      } else if (!addedFrequency.includes("month")) {
                        field.onChange({ ...value, month: 1 });
                      } else {
                        field.onChange({ ...value, year: 1 });
                      }
                    }}
                  >
                    <LiaPlusSolid size={14} className=" text-white" /> Add Limit
                  </Button>
                ) : null}
              </FormItem>
            );
          }}
        ></FormField>
      </div>
    </Form>
  );
};

export default Event;
