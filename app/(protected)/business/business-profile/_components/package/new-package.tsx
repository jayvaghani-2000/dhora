import CustomDialog from "@/components/shared/custom-dialog";
import { createPackageSchema } from "@/db/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import RichEditor from "@/components/shared/rich-editor";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { depositTypeEnum, packageUnitTypeEnum } from "@/db/schema";
import { AiOutlinePercentage } from "react-icons/ai";
import {
  SelectItem,
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CgDollar } from "react-icons/cg";
import { IconInput } from "@/components/shared/icon-input";
import { stringCasting } from "@/lib/common";
import { capitalize } from "lodash";
import { Label } from "@/components/ui/label";
import { createPackage } from "@/actions/(protected)/business/packages/createPackage";
import { useToast } from "@/components/ui/use-toast";
import { getPackageGroupsType } from "@/actions/_utils/types.type";
import { CiCircleRemove } from "react-icons/ci";
import { Button } from "@/components/ui/button";
import NewPackageGroup from "./new-group";

const NewPackage = (
  props: Partial<React.ComponentProps<typeof CustomDialog>> & {
    setOpen: Dispatch<SetStateAction<boolean>>;
  } & {
    packagesGroups: getPackageGroupsType["data"];
  }
) => {
  const { open = false, setOpen, packagesGroups } = props;
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [openNewGroup, setOpenNewGroup] = useState(false);
  const form = useForm<z.infer<typeof createPackageSchema>>({
    resolver: zodResolver(createPackageSchema),
    defaultValues: {
      description: "",
      name: "",
      package_group_id: undefined,
      fixed_priced: false,
      unit: "hours",
      unit_rate: undefined,
      max_unit: undefined,
      min_unit: undefined,
      deposit_type: "fixed",
      unit_qty: 1,
      deposit: undefined,
    },
    reValidateMode: "onChange",
  });

  const unitTypeOptions = packageUnitTypeEnum.enumValues;
  const depositTypeOptions = depositTypeEnum.enumValues;

  const handleCloseCreateEvent = () => {
    setOpen(false);
    form.reset();
  };

  const handleSubmit = async (value: z.infer<typeof createPackageSchema>) => {
    setLoading(true);
    const res = await createPackage(value);
    if (res && !res.success) {
      toast({
        title: res.error,
      });
    } else {
      toast({
        title: "Package create successfully",
      });
      handleCloseCreateEvent();
    }
    setLoading(false);
  };

  return (
    <>
      <CustomDialog
        open={open}
        title="Create Package"
        className="w-[800px]"
        saveText="Create"
        onClose={handleCloseCreateEvent}
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
                name="package_group_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Group in</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={value => {
                          if (value === "create") {
                            field.onChange(null);
                            setOpenNewGroup(true);
                          } else {
                            field.onChange(value);
                          }
                        }}
                        value={field.value as string}
                      >
                        <div className="flex gap-1 items-center">
                          <FormControl className="flex-1">
                            <SelectTrigger>
                              <SelectValue
                                placeholder={
                                  <span className="text-muted-foreground ">
                                    Select Group
                                  </span>
                                }
                              />
                            </SelectTrigger>
                          </FormControl>
                          <Button
                            type="button"
                            variant="destructive"
                            className="p-1 h-[32px] lg:h-[40px]  w-[32px] lg:w-[40px]"
                            onClick={() => {
                              field.onChange(null);
                            }}
                          >
                            <div className="h-6 w-6">
                              <CiCircleRemove className="h-full w-full" />
                            </div>
                          </Button>
                        </div>
                        <SelectContent>
                          {packagesGroups?.map(i => (
                            <SelectItem key={i.id} value={i.id}>
                              {i.name}
                            </SelectItem>
                          ))}
                          <SelectItem key={"create"} value={"create"}>
                            + Create new group
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Title"
                        autoComplete="off"
                        {...field}
                      />
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
                      <RichEditor
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <Label>Pricing</Label>

                <div className="grid  grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 ">
                  <div className="md:col-span-2 flex gap-2 items-center">
                    <FormField
                      control={form.control}
                      name={`unit_rate`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
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
                    <p>/</p>
                    <FormField
                      control={form.control}
                      name={`unit_qty`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              placeholder="Unit Quantity"
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
                      name="unit"
                      render={({ field }) => (
                        <FormItem className="flex-1">
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
                                  {i}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

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
                                    deposit_field.onChange(null);
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
        </div>
      </CustomDialog>
      <NewPackageGroup open={openNewGroup} setOpen={setOpenNewGroup} />
    </>
  );
};

export default NewPackage;
