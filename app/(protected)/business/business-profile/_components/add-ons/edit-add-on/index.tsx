"use client";
import {
  getAddOnGroupsType,
  getAddOnsDetailsType,
} from "@/actions/_utils/types.type";
import BackButton from "@/components/shared/back-button";
import RichEditor from "@/components/shared/rich-editor";
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
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateAddOnSchema } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Separator } from "@/components/ui/separator";
import Spinner from "@/components/shared/spinner";
import { useToast } from "@/components/ui/use-toast";
import { useParams } from "next/navigation";
import { deleteAddOn } from "@/actions/(protected)/business/add-ons/deleteAddOn";
import { updateAddOnDetail } from "@/actions/(protected)/business/add-ons/updateAddOnDetail";
import { CiCircleRemove } from "react-icons/ci";
import { Label } from "@/components/ui/label";
import { IconInput } from "@/components/shared/icon-input";
import { CgDollar } from "react-icons/cg";
import { stringCasting } from "@/lib/common";
import CustomDialog from "@/components/shared/custom-dialog";

type propType = {
  addOnDetail: getAddOnsDetailsType["data"];
  addOnGroups: getAddOnGroupsType["data"];
};

const EditAddOn = (props: propType) => {
  const params = useParams();
  const { addOnDetail, addOnGroups } = props;
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmDeleteAddOn, setConfirmDeleteAddOn] = useState(false);
  const { toast } = useToast();
  const { id, created_at, deleted, updated_at, ...addOnInfo } = addOnDetail!;

  const form = useForm<z.infer<typeof updateAddOnSchema>>({
    resolver: zodResolver(updateAddOnSchema),
    defaultValues: {
      ...addOnInfo,
      id: id,
      name: addOnInfo.name as string,
      description: addOnInfo.description as string,
      add_on_group_id: addOnInfo.add_on_group_id as unknown as string,
      unit_qty: 1,
      max_unit: addOnInfo.max_unit as number,
      unit_rate: addOnInfo.unit_rate as number,
    },
  });

  const handleDeleteAddOn = async () => {
    setDeleting(true);
    const res = await deleteAddOn(params.slug as string);
    if (res && !res.success) {
      toast({ title: res.error });
    } else {
      toast({ title: "Add on deleted successfully!" });
    }
    setDeleting(false);
  };

  const handleUpdateAddOn = async () => {
    await form.trigger();
    if (form.formState.isValid) {
      setLoading(true);
      const res = await updateAddOnDetail(form.getValues());

      if (res && !res.success) {
        toast({ title: res.error });
      } else {
        toast({ title: "Add on updated successfully!" });
      }

      setLoading(false);
    } else {
      const error = form.formState.errors;

      console.log("error", error);

      const errorMsg = Object.values(error);
      const errorMsgKey = Object.keys(error);
      if (errorMsg[0]) {
        toast({
          title:
            errorMsg[0].message ??
            `Error in ${errorMsgKey[0].replace(/_/g, " ")}`,
        });
      }
    }
  };

  return (
    <div>
      <BackButton to="/business/business-profile/packages" />
      <div className="flex justify-between flex-col gap-2 md:flex-row ">
        <div className="flex relative gap-4 items-center mt-2 flex-col md:flex-row">
          <div className="text-white font-medium text-base">
            {addOnInfo.name}
          </div>
        </div>
        <div className="flex gap-2 justify-center items-center">
          <Button
            variant="outline"
            className="p-1 h-[28px]"
            disabled={loading || deleting}
            onClick={() => {
              setConfirmDeleteAddOn(true);
            }}
          >
            <RiDeleteBin6Line size={18} color="#b6b6b6" />
          </Button>
          <Separator orientation="vertical" className="w-0.5 h-8" />
          <Button
            onClick={handleUpdateAddOn}
            disabled={loading || deleting}
            className="h-fit lg:h-auto"
          >
            Save {loading && <Spinner type="inline" />}
          </Button>
        </div>
      </div>
      <Form {...form}>
        <div className="flex gap-2 flex-col mt-4">
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
                            field.value as unknown as number
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
                          value={stringCasting(
                            field.value as unknown as number
                          )}
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
                        value={stringCasting(field.value as unknown as number)}
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

      <CustomDialog
        open={confirmDeleteAddOn}
        title="Delete add on"
        className="w-[500px]"
        onClose={() => {
          setConfirmDeleteAddOn(false);
        }}
        saveText="Confirm!"
        onSubmit={async () => {
          await handleDeleteAddOn();
        }}
        saveVariant="destructive"
        disableAction={deleting}
      >
        Are you sure, want to delete the add on{" "}
        <span className="font-bold">{addOnDetail!.name}</span>?
      </CustomDialog>
    </div>
  );
};

export default EditAddOn;
