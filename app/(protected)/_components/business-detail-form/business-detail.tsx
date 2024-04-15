"use client";
import React, { useState } from "react";
import BusinessLogo from "./business-logo";
import { profileType } from "@/actions/_utils/types.type";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import PlacesAutocompleteInput from "@/components/shared/place-autocomplete";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  SelectItem,
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { businessTypeEnum } from "@/db/schema";
import { settingsBusinessDetailSchema } from "@/lib/schema";
import { updateBusinessDetail } from "@/actions/(protected)/profile/updateBusiness";
import { createBusiness } from "@/actions/(protected)/profile/createBusiness";
import { useToast } from "@/components/ui/use-toast";
import { revalidate } from "@/actions/(public)/revalidate";
import { getAvailabilityData } from "@/app/(protected)/business/availability/_utils/initializeAvailability";
import Spinner from "@/components/shared/spinner";
import CustomDialog from "@/components/shared/custom-dialog";
import { deleteBusiness } from "@/actions/(protected)/profile/deleteBusiness";
import RichEditor from "@/components/shared/rich-editor";

type propType = {
  user: profileType;
  deletable?: boolean;
};

const BusinessDetailForm = (prop: propType) => {
  const { user, deletable = true } = prop;
  const [file, setFile] = useState<File | null>(null);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDeleteBusiness, setConfirmDeleteBusiness] = useState(false);
  const { toast } = useToast();

  const businessTypeOptions = businessTypeEnum.enumValues;

  const form = useForm<z.infer<typeof settingsBusinessDetailSchema>>({
    resolver: zodResolver(settingsBusinessDetailSchema),
    defaultValues: {
      name: user?.business?.name ?? "",
      address: user?.business?.address ?? "",
      email: user?.email ?? "",
      contact: user?.business?.contact ?? "",
      type: user?.business?.type,
      description: user?.business?.description ?? "",
    },
  });

  async function onSubmit(
    values: z.infer<typeof settingsBusinessDetailSchema>
  ) {
    setLoading(true);
    const logo = new FormData();
    if (file) {
      logo.append("image", file);
    }

    if (user!.business) {
      const res = await updateBusinessDetail({
        businessDetail: values,
        logo,
      });

      if (res.success) {
        toast({
          title: res.data,
        });
        await revalidate("/settings/business");
      } else {
        toast({
          title: res.error,
        });
      }
    } else {
      const res = await createBusiness({
        businessDetail: values,
        logo,
        availability: getAvailabilityData(),
      });

      if (res.success) {
        toast({
          title: res.data,
        });
        await revalidate("/settings/business");
      } else {
        toast({
          title: res.error,
        });
      }
    }
    setLoading(false);
  }

  async function handleDeleteBusiness() {
    setDeleting(true);
    const res = await deleteBusiness();
    if (res.success) {
      await revalidate("/settings/business");
      toast({
        title: res.data,
      });
      setConfirmDeleteBusiness(false);
    } else {
      toast({
        title: res.error,
      });
    }
    setDeleting(false);
  }

  return (
    <>
      <div className=" border rounded-md border-divider  p-4 mt-2 flex flex-col lg:flex-row items-center lg:items-start gap-6">
        <BusinessLogo file={file} setFile={setFile} user={prop.user} />
        <div className="flex-1 w-full">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="text-zinc-600 dark:text-zinc-200 flex flex-col xl:grid grid-cols-1 gap-5 justify-center relative"
              autoComplete="off"
            >
              <div className="rounded-md  flex flex-col gap-5 xl:grid grid-cols-1">
                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Business Name</FormLabel>
                        <FormControl>
                          <Input
                            className="h-9 disabled:opacity-100"
                            placeholder="Business Name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="col-span-2 lg:col-span-1 ">
                        <FormLabel>Business Email</FormLabel>
                        <FormControl>
                          <Input
                            className="h-9 disabled:opacity-100"
                            placeholder="Business Email"
                            disabled
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contact"
                    render={({ field }) => (
                      <FormItem className="col-span-2 lg:col-span-1 ">
                        <FormLabel>Business Contact</FormLabel>
                        <FormControl>
                          <Input
                            className="h-9 disabled:opacity-100"
                            placeholder="Business Contact"
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
                      <FormItem className="col-span-2 ">
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
                  <div className="col-span-2 flex flex-col gap-2 relative">
                    <FormLabel>Business Address</FormLabel>
                    <PlacesAutocompleteInput
                      value={address}
                      onChange={e => {
                        setAddress(e);
                      }}
                      form={form}
                      fieldName="address"
                      placeholder="Business Address"
                      defaultValue={form.getValues("address")}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem className="col-span-2 ">
                        <FormLabel>Business Category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={
                                  <span className="text-muted-foreground ">
                                    Select Category
                                  </span>
                                }
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {businessTypeOptions.map(i => (
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

                  {user!.business ? (
                    <div className="col-span-2 flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        type="reset"
                        onClick={() => {
                          form.reset();
                        }}
                        disabled={loading}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={loading}>
                        Save {loading && <Spinner type="inline" />}
                      </Button>
                    </div>
                  ) : (
                    <div className="col-span-2 flex justify-end gap-2">
                      <Button type="submit" disabled={loading}>
                        Create Business {loading && <Spinner type="inline" />}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
      {deletable ? (
        <div className="mt-5">
          {user!.business ? (
            <Button
              variant="destructive"
              onClick={() => {
                setConfirmDeleteBusiness(true);
              }}
            >
              Delete Business
            </Button>
          ) : null}
        </div>
      ) : null}

      <CustomDialog
        open={confirmDeleteBusiness}
        title="Delete Business"
        className="w-[500px]"
        onClose={() => {
          setConfirmDeleteBusiness(false);
        }}
        saveText="Confirm!"
        onSubmit={async () => {
          await handleDeleteBusiness();
        }}
        saveVariant="destructive"
        disableAction={deleting}
      >
        Are you sure, want to delete this business. This action is not
        reversible.
      </CustomDialog>
    </>
  );
};

export default BusinessDetailForm;
