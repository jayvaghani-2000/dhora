"use client";

import React, { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import UploadLogo from "./upload-logo";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { CgDollar } from "react-icons/cg";
import { AiOutlinePercentage } from "react-icons/ai";
import { Input } from "@/components/ui/input";
import { useFieldArray, useForm } from "react-hook-form";
import { RiDeleteBin6Line } from "react-icons/ri";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/provider/store/authentication";
import { invoiceSchema, invoiceSchemaType } from "../_utils/schema";
import { LiaPlusSolid } from "react-icons/lia";
import { generateInvoice } from "@/actions/(protected)/invoices/generateInvoice";
import { uploadBusinessLogo } from "@/actions/(protected)/invoices/uploadBusinessLogo";
import { IconInput } from "@/components/shared/icon-input";
import { stringCasting } from "@/lib/common";
import { PLATFORM_FEE } from "@/lib/constant";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const generateSubtotal = (items: invoiceSchemaType["items"], tax: number) => {
  const subtotal = items.reduce((prev, curr) => {
    prev += (curr.price ?? 0) * (curr.quantity ?? 0);
    return prev;
  }, 0);

  let total = subtotal;

  total += (total / 100) * tax;
  total += (total / 100) * PLATFORM_FEE;
  return { subtotal, total };
};

const InvoiceForm = () => {
  const { profile, authenticated } = useAuthStore();
  const [file, setFile] = useState<File | null>(null);
  const form = useForm<z.infer<typeof invoiceSchema>>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      business_name: "",
      business_contact: "",
      business_address: "",
      business_email: "",
      customer_name: "",
      customer_email: "",
      customer_contact: "",
      customer_address: "",
      items: [
        {
          id: uuid(),
          name: "",
          price: undefined,
          description: "",
          quantity: undefined,
        },
      ],
      tax: undefined,
      due_date: undefined,
      subtotal: 0,
      total: 0,
    },
  });
  const navigate = useRouter();

  const { setValue, control } = form;

  const { fields, remove, append } = useFieldArray({
    control,
    name: "items",
  });

  const items = form.getValues("items");
  const tax = form.getValues("tax");
  const due_date = form.getValues("due_date");

  useEffect(() => {
    const { subtotal, total } = generateSubtotal(items, tax ?? 0);
    setValue("total", total);
    setValue("subtotal", subtotal);
  }, [items, tax, setValue, form]);

  useEffect(() => {
    if (authenticated) {
      form.setValue("business_name", profile?.business?.name ?? "");
      form.setValue("business_address", profile?.business?.address ?? "");
      form.setValue("business_email", profile?.email ?? "");
      form.setValue("business_contact", profile?.business?.contact ?? "");
    }
  }, [authenticated, form, profile]);

  async function onSubmit(values: z.infer<typeof invoiceSchema>) {
    const imageForm = new FormData();
    imageForm.append("image", file!);
    const res = await uploadBusinessLogo(imageForm);

    if (res.success) {
      const data = await generateInvoice({ values: values, logo: res.data });
      if (data.success) {
        navigate.replace("/business/invoices");
      }
    }
  }

  return (
    <div className="text-zinc-600 dark:text-zinc-200 flex flex-col md:grid grid-cols-[200px_1fr] gap-5 justify-center max-w-[1000px] m-auto">
      <UploadLogo file={file} setFile={setFile} />
      <div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
            autoComplete="off"
          >
            <div>
              <div className="text-md font-semibold col-span-2 mb-2">
                <span>Business Details</span>
              </div>
              <div className="border border-input px-4 py-3 rounded-md grid grid-cols-2 gap-x-4 gap-y-3">
                <FormField
                  control={form.control}
                  name="business_name"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormControl>
                        <Input
                          className="h-9"
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
                          className="h-9"
                          placeholder="Business Email"
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
                          className="h-9"
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
                  name="business_address"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
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
              </div>
            </div>

            <div>
              <div className="text-md font-semibold col-span-2 mb-2">
                <span>Customer Details</span>
              </div>
              <div className="border border-input px-4 py-3 rounded-md grid grid-cols-2 gap-x-4 gap-y-3">
                <FormField
                  control={form.control}
                  name="customer_name"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormControl>
                        <Input
                          className="h-9"
                          placeholder="Customer Name"
                          {...field}
                        />
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
                        <Input
                          className="h-9"
                          placeholder="Customer Email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="customer_contact"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          className="h-9"
                          placeholder="Customer Contact"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="customer_address"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormControl>
                        <Textarea
                          placeholder="Customer Address"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div>
              <div className="flex mb-2 justify-between items-center">
                <div className="text-md font-semibold col-span-2 mb-2">
                  <span>Item Details</span>
                </div>
                <Button
                  type="button"
                  className="flex px-2 py-1 h-9"
                  onClick={() => {
                    append({
                      id: uuid(),
                      name: "",
                      description: "",
                      price: undefined as unknown as number,
                      quantity: undefined as unknown as number,
                    });
                  }}
                >
                  <LiaPlusSolid size={18} className="text-black" />
                </Button>
              </div>
              <div className="flex flex-col gap-3">
                {fields.map((i, index) => (
                  <div
                    key={i.id}
                    className="border border-input px-4 py-3 rounded-md grid grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-2"
                  >
                    <FormField
                      control={form.control}
                      name={`items.${index}.name`}
                      render={({ field }) => (
                        <FormItem className="col-span-2 md:col-span-1">
                          <FormControl>
                            <Input
                              className="h-9"
                              placeholder="Item Name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`items.${index}.price`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <IconInput
                              type="number"
                              placeholder="Item Price"
                              {...field}
                              prefix={
                                <div className="h-4 w-4">
                                  <CgDollar className="h-full w-full" />
                                </div>
                              }
                              onChange={e => {
                                const value = parseFloat(e.target.value);
                                field.onChange(value);
                              }}
                              value={stringCasting(
                                form.getValues(
                                  `items.${index}.price`
                                ) as unknown as number
                              )}
                            />
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
                            <Input
                              type="number"
                              className="h-9"
                              placeholder="Item Quantity"
                              {...field}
                              onChange={e => {
                                const value = parseFloat(e.target.value);
                                field.onChange(value);
                              }}
                              value={stringCasting(
                                form.getValues(
                                  `items.${index}.quantity`
                                ) as unknown as number
                              )}
                            />
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
                    {fields.length > 0 ? (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="text-[#7f1d1d] text-sm font-semibold flex gap-1 justify-end items-center col-span-2 md:col-span-3"
                      >
                        <RiDeleteBin6Line /> <span>Remove</span>
                      </button>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="tax"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <IconInput
                        placeholder="Taxes"
                        {...field}
                        suffix={
                          <div className="h-4 w-4">
                            <AiOutlinePercentage className="h-full w-full" />
                          </div>
                        }
                        onChange={e => {
                          const value = parseFloat(e.target.value);
                          field.onChange(value);
                        }}
                        value={stringCasting(
                          form.getValues(`tax`) as unknown as number
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="due_date"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full h-9 justify-start text-left font-normal",
                              !due_date && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {due_date ? (
                              format(due_date, "PPP")
                            ) : (
                              <span>Pick a due date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={due_date}
                            onSelect={date => {
                              field.onChange(date);
                            }}
                            disabled={date => date < new Date()}
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end gap-5">
              <Button className="w-fit md:col-span-2" type="submit">
                SAVE
              </Button>
              <Button
                variant="outline"
                type="button"
                className="w-fit md:col-span-2"
                onClick={() => {
                  navigate.replace("/business/invoices");
                }}
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
