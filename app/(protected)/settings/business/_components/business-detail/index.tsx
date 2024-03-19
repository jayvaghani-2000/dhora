"use client";
import React, { useState } from "react";
import BusinessLogo from "./business-logo";
import { profileType } from "@/actions/_utils/types.type";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { businessDetailSchema } from "@/app/(protected)/business/invoices/_utils/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import PlacesAutocompleteInput from "@/components/shared/place-autocomplete";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type propType = {
  user: profileType;
};

const BusinessDetail = (prop: propType) => {
  const { user } = prop;
  const [file, setFile] = useState<File | null>(null);
  const [address, setAddress] = useState("");

  const form = useForm<z.infer<typeof businessDetailSchema>>({
    resolver: zodResolver(businessDetailSchema),
    defaultValues: {
      business_name: user?.business?.name ?? "",
      business_address: user?.business?.address ?? "",
      business_email: user?.email ?? "",
      business_contact: user?.business?.contact ?? "",
    },
  });

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
              onSubmit={async e => {
                e.preventDefault();
                e.stopPropagation();
                await form.trigger();
                if (form.formState.isValid) {
                }
              }}
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
                  <div className="col-span-2 relative">
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
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
      <div className="mt-5">
        {user!.business ? (
          <Button variant="destructive">Delete Business</Button>
        ) : (
          <Button>Create Business</Button>
        )}
      </div>
    </div>
  );
};

export default BusinessDetail;
