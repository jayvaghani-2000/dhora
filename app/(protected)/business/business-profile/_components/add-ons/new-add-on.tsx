import CustomDialog from "@/components/shared/custom-dialog";
import { createAddOnSchema } from "@/db/schema";
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
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { getAddOnGroupsType } from "@/actions/_utils/types.type";
import { CiCircleRemove } from "react-icons/ci";
import { Button } from "@/components/ui/button";
import { createAddOn } from "@/actions/(protected)/business/add-ons/createAddOn";

const NewAddOn = (
  props: Partial<React.ComponentProps<typeof CustomDialog>> & {
    setOpen: Dispatch<SetStateAction<boolean>>;
  } & {
    addOnGroups: getAddOnGroupsType["data"];
  }
) => {
  const { open = false, setOpen, addOnGroups } = props;
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof createAddOnSchema>>({
    resolver: zodResolver(createAddOnSchema),
    defaultValues: {
      description: "",
      name: "",
      add_on_group_id: undefined,
      unit_rate: undefined,
      max_unit: undefined,
      unit_qty: 1,
    },
    reValidateMode: "onChange",
  });

  const handleCloseCreateEvent = () => {
    setOpen(false);
    form.reset();
  };

  const handleSubmit = async (value: z.infer<typeof createAddOnSchema>) => {
    setLoading(true);
    const res = await createAddOn(value);
    if (res && !res.success) {
      toast({
        title: res.error,
      });
    } else {
      toast({
        title: "Add on create successfully",
      });
      handleCloseCreateEvent();
    }
    setLoading(false);
  };

  return (
    <CustomDialog
      open={open}
      title="Create Add On"
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
              name="add_on_group_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group in</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
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
                        {addOnGroups?.map(i => (
                          <SelectItem key={i.id} value={i.id}>
                            {i.name}
                          </SelectItem>
                        ))}
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

            <div>
              <Label>Pricing</Label>
              <div className="grid  grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 mt-2">
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
                          <IconInput
                            placeholder="Unit Quantity"
                            type="number"
                            {...field}
                            value={field.value!}
                            suffix={<div className="mr-1">Unit</div>}
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
          </div>
        </Form>
      </div>
    </CustomDialog>
  );
};

export default NewAddOn;
