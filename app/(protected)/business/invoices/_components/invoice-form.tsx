"use client";

import React, { useEffect } from "react";
import { v4 as uuid } from "uuid";
import UploadLogo from "./upload-logo";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/provider/store/authentication";
import { invoiceSchema } from "../_utils/schema";
import { LiaPlusSolid } from "react-icons/lia";
import { generateInvoice } from "@/actions/(protected)/invoices/generateInvoice";

const InvoiceForm = () => {
  const { profile, authenticated } = useAuthStore();

  const form = useForm<z.infer<typeof invoiceSchema>>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      business_name: "",
      business_contact: "",
      business_address: "",
      customer_name: "",
      customer_email: "",
      items: [
        { id: uuid(), name: "", rate: "", description: "", quantity: "" },
      ],
      tax: "",
    },
  });

  useEffect(() => {
    if (authenticated) {
      form.setValue("business_name", profile?.business?.name ?? "");
      form.setValue("business_address", profile?.business?.address ?? "");
    }
  }, [authenticated, form, profile]);

  async function onSubmit(values: z.infer<typeof invoiceSchema>) {
    console.log(values);
    await generateInvoice(values);
  }

  console.log(form.formState.errors);

  return (
    <div className="flex flex-col md:grid grid-cols-[200px_1fr] gap-5 justify-center max-w-[1000px] m-auto">
      <UploadLogo />
      <div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            <div>
              <span>Business Details</span>
            </div>
            <FormField
              control={form.control}
              name="business_name"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormControl>
                    <Input placeholder="Business Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="business_contact"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormControl>
                    <Input placeholder="Business Contact" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="business_address"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormControl>
                    <Textarea
                      placeholder="Business Address"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <span>Customer Details</span>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="customer_name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Customer's Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="customer_email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Customer's Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-between items-center">
              <span>Item Details</span>
              <Button
                type="button"
                className="flex px-2 py-1 h-8"
                onClick={() => {
                  const items = form.getValues("items");
                  const newItem = {
                    id: uuid(),
                    name: "",
                    rate: "",
                    description: "",
                    quantity: "",
                  };
                  form.setValue("items", [...items, newItem], {
                    shouldTouch: true,
                  });
                }}
              >
                <LiaPlusSolid size={18} className="text-black" />
              </Button>
            </div>

            {form.getValues("items").map((i, index) => (
              <div
                key={i.id}
                className="grid grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-2 p-2 bg-primary-light-gray rounded-sm"
              >
                <FormField
                  control={form.control}
                  name={`items.${index}.name`}
                  render={({ field }) => (
                    <FormItem className="col-span-2 md:col-span-1">
                      <FormControl>
                        <Input placeholder="Item Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`items.${index}.rate`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Item Rate" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`items.${index}.quantity`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Item Quantity" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`items.${index}.description`}
                  render={({ field }) => (
                    <FormItem className="col-span-2 md:col-span-3">
                      <FormControl>
                        <Textarea
                          placeholder="Item Description"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}

            <FormField
              control={form.control}
              name="tax"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Tax" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-5">
              <Button className="w-fit md:col-span-2" type="submit">
                SAVE
              </Button>
              <Button
                variant="outline"
                className="w-fit md:col-span-2"
                type="submit"
              >
                CANCEL
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default InvoiceForm;
