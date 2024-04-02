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

type propType = {
  user: profileType;
};

const BusinessDetail = (prop: propType) => {
  const { user } = prop;
  const [file, setFile] = useState<File | null>(null);
  const [address, setAddress] = useState("");
  const { toast } = useToast();

  const businessTypeOptions = businessTypeEnum.enumValues;

  const form = useForm<z.infer<typeof settingsBusinessDetailSchema>>({
    resolver: zodResolver(settingsBusinessDetailSchema),
    defaultValues: {
      business_name: user?.business?.name ?? "",
      business_address: user?.business?.address ?? "",
      business_email: user?.email ?? "",
      business_contact: user?.business?.contact ?? "",
      business_type: user?.business?.type,
    },
  });

  async function onSubmit(
    values: z.infer<typeof settingsBusinessDetailSchema>
  ) {
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
  }

  return (
    <div>
      <div className="text-secondary-light-gray font-semibold text-base">
        Business Details
      </div>
      <div className=" border rounded-md border-divider  p-4 mt-2 flex gap-6">
        <BusinessLogo file={file} setFile={setFile} user={prop.user} />
        <div className="flex-1">
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
                    name="business_name"
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
                    name="business_email"
                    render={({ field }) => (
                      <FormItem>
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
                    name="business_contact"
                    render={({ field }) => (
                      <FormItem>
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
                  <div className="col-span-2 flex flex-col gap-2 relative">
                    <FormLabel>Business Address</FormLabel>
                    <PlacesAutocompleteInput
                      value={address}
                      onChange={e => {
                        setAddress(e);
                      }}
                      form={form}
                      fieldName="business_address"
                      placeholder="Business Address"
                      defaultValue={form.getValues("business_address")}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="business_type"
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
                      >
                        Reset
                      </Button>
                      <Button variant="outline" type="submit">
                        Save
                      </Button>
                    </div>
                  ) : (
                    <div className="col-span-2 flex justify-end gap-2">
                      <Button variant="outline" type="submit">
                        Create Business
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
      <div className="mt-5">
        {user!.business ? (
          <Button variant="destructive">Delete Business</Button>
        ) : null}
      </div>
    </div>
  );
};

export default BusinessDetail;
