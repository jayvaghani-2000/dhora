import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  depositTypeEnum,
  editPackageSchema,
  packageUnitTypeEnum,
} from "@/db/schema";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import EditPackage from ".";
import { Label } from "@/components/ui/label";
import { IconInput } from "@/components/shared/icon-input";
import { Checkbox } from "@/components/ui/checkbox";
import { CgDollar } from "react-icons/cg";
import { stringCasting } from "@/lib/common";
import { AiOutlinePercentage } from "react-icons/ai";
import { capitalize } from "lodash";

type propType = {
  form: UseFormReturn<z.infer<typeof editPackageSchema>>;
} & React.ComponentProps<typeof EditPackage>;

const Pricing = (prop: propType) => {
  const { form, packagesGroups, packageDetail } = prop;
  const unitTypeOptions = packageUnitTypeEnum.enumValues;
  const depositTypeOptions = depositTypeEnum.enumValues;

  return (
    <Form {...form}>
      <div className="flex gap-2 flex-col mt-4">
        <div>
          <Label>Pricing</Label>

          <FormField
            control={form.control}
            name="fixed_priced"
            render={({ field }) => (
              <div className="flex gap-2 flex-col">
                <FormItem className="flex items-center gap-2">
                  <FormLabel className="mt-2">Fixed rates</FormLabel>
                  <FormControl className="mt-2">
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>

                {!field.value ? (
                  <div className="grid  grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 ">
                    <FormField
                      control={form.control}
                      name="unit"
                      render={({ field }) => (
                        <FormItem className="">
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value!}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={
                                    <span className="text-muted-foreground ">
                                      Select Unit
                                    </span>
                                  }
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {unitTypeOptions.map(i => (
                                <SelectItem key={i} value={i}>
                                  {capitalize(i)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`unit_rate`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <IconInput
                              type="number"
                              placeholder="Unit Rate"
                              {...field}
                              prefix={
                                <div className="h-4 w-4">
                                  <CgDollar className="h-full w-full" />
                                </div>
                              }
                              onChange={e => {
                                const value = parseFloat(e.target.value);
                                if (isNaN(value)) {
                                  field.onChange(undefined);
                                } else {
                                  field.onChange(value);
                                }
                              }}
                              value={stringCasting(
                                form.getValues(`unit_rate`) as unknown as number
                              )}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="min_unit"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="Minimum units"
                              type="number"
                              {...field}
                              value={field.value!}
                              onChange={e => {
                                const value = parseFloat(e.target.value);
                                if (isNaN(value)) {
                                  field.onChange(null);
                                } else {
                                  field.onChange(value);
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
                      name="max_unit"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="Maximum units"
                              type="number"
                              {...field}
                              value={field.value!}
                              onChange={e => {
                                const value = parseFloat(e.target.value);
                                if (isNaN(value)) {
                                  field.onChange(null);
                                } else {
                                  field.onChange(value);
                                }
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ) : (
                  <div className="grid  grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 ">
                    <FormField
                      control={form.control}
                      name={`unit_rate`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <IconInput
                              type="number"
                              placeholder="Rates"
                              {...field}
                              prefix={
                                <div className="h-4 w-4">
                                  <CgDollar className="h-full w-full" />
                                </div>
                              }
                              onChange={e => {
                                const value = parseFloat(e.target.value);
                                if (isNaN(value)) {
                                  field.onChange(null);
                                } else {
                                  field.onChange(value);
                                }
                              }}
                              value={stringCasting(
                                form.getValues(`unit_rate`) as unknown as number
                              )}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="deposit_type"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Deposit</FormLabel>
              <div className="flex gap-2">
                <FormField
                  control={form.control}
                  name={`deposit`}
                  render={({ field: deposit_field }) => (
                    <FormItem>
                      <FormControl>
                        <IconInput
                          type="number"
                          placeholder="Deposit"
                          {...deposit_field}
                          prefix={
                            field.value === "fixed" ? (
                              <div className="h-4 w-4">
                                <CgDollar className="h-full w-full" />
                              </div>
                            ) : null
                          }
                          suffix={
                            field.value === "percentage" ? (
                              <div className="h-4 w-4">
                                <AiOutlinePercentage className="h-full w-full" />
                              </div>
                            ) : null
                          }
                          onChange={e => {
                            const value = parseFloat(e.target.value);
                            if (isNaN(value)) {
                              deposit_field.onChange(undefined);
                            } else {
                              deposit_field.onChange(value);
                            }
                          }}
                          value={stringCasting(
                            form.getValues(`deposit`) as unknown as number
                          )}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value!}
                >
                  <FormControl>
                    <SelectTrigger className="w-fit">
                      <SelectValue
                        placeholder={
                          <span className="text-muted-foreground ">
                            Select deposit unit
                          </span>
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {depositTypeOptions.map(i => (
                      <SelectItem key={i} value={i}>
                        {capitalize(i)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </FormItem>
          )}
        />
      </div>
    </Form>
  );
};

export default Pricing;
