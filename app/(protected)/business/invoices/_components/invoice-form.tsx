"use client";

import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import UploadLogo from "./upload-logo";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CgDollar } from "react-icons/cg";
import { AiOutlinePercentage } from "react-icons/ai";
import { Input } from "@/components/ui/input";
import { useFieldArray, useForm } from "react-hook-form";
import { RiDeleteBin6Line } from "react-icons/ri";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { invoiceSchema, invoiceSchemaType } from "@/lib/schema";
import { LiaPlusSolid } from "react-icons/lia";
import { generateInvoice } from "@/actions/(protected)/business/invoices/generateInvoice";
import { IconInput } from "@/components/shared/icon-input";
import {
  formatAmount,
  generateBreakdownPrice,
  stringCasting,
} from "@/lib/common";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import {
  getUserDetailsType,
  profileType,
} from "@/actions/_utils/types.type";
import { updateInvoiceDetail } from "@/actions/(protected)/business/invoices/updateInvoiceDetail";
import PlacesAutocompleteInput from "@/components/shared/place-autocomplete";
import { revalidate } from "@/actions/(public)/revalidate";
import InvoicePdf from "./../_components/invoice-pdf/index";
import { DatePicker } from "@/components/shared/date-picker";

type propType =
  | {
      user: profileType;
      invoiceData?: never;
      mode?: "CREATE";
      bookings: getUserDetailsType["data"];
    }
  | {
      user: profileType;
      invoiceData: invoiceSchemaType;
      bookings: getUserDetailsType["data"];
      mode?: "EDIT";
    };

const InvoiceForm = (props: propType) => {
  const { user, mode = "CREATE", invoiceData, bookings } = props;
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const { toast } = useToast();
  const [file, setFile] = useState(user?.business?.logo ?? "");
  const [updatedItem, setUpdatedItem] = useState(0);
  const [savePdf, setSavePdf] = useState({
    invoiceId: params.invoice_id as string,
    trigger: false,
  });

  const defaultSelectedEvent = bookings!.find(item => item.id === bookingId);

  const handleSelectChange = (value: string) => {
    const selectedEvent = bookings!.find(item => item.id === value);
    if (selectedEvent) {
      form.setValue("customer_name", selectedEvent.customer!.name);
      form.setValue("customer_email", selectedEvent.customer!.email);
      form.setValue("event_id", selectedEvent.event.id!);
    }
  };

  const form = useForm<z.infer<typeof invoiceSchema>>({
    resolver: zodResolver(invoiceSchema),
    defaultValues:
      mode === "EDIT"
        ? { ...invoiceData, due_date: new Date(invoiceData!.due_date) }
        : {
            name: user?.business?.name ?? "",
            address: user?.business?.address ?? "",
            email: user?.email ?? "",
            contact: user?.business?.contact ?? "",
            event_id: defaultSelectedEvent?.event.id! || "",
            customer_name: defaultSelectedEvent?.customer!.name || "",
            customer_email: defaultSelectedEvent?.customer!.email || "",
            customer_contact: "",
            customer_address: "",
            items: [
              {
                name: "",
                price: undefined as unknown as number,
                quantity: undefined as unknown as number,
                description: "",
                id: uuid(),
              },
            ],
            tax: undefined,
            due_date: undefined,
            subtotal: 0,
            total: 0,
          },
  });

  const [address, setAddress] = useState("");

  const navigate = useRouter();

  const { setValue, control } = form;

  const { fields, remove, append } = useFieldArray({
    control,
    name: "items",
  });

  const items = form.getValues("items");
  const tax = form.getValues("tax");

  const breakdown = generateBreakdownPrice(items, tax ?? 0);

  useEffect(() => {
    const { subtotal, total } = breakdown;
    setValue("total", total);
    setValue("subtotal", subtotal);
  }, [updatedItem, items, tax, setValue, form]);

  async function onSubmit(
    values: z.infer<typeof invoiceSchema>,
    handleCheckout?: boolean
  ) {
    const { address, contact, email, name, ...rest } = values;

    if (values.items.length === 0) {
      toast({
        title: "Please add atleast one item.",
      });
      return;
    }
    setLoading(true);
    if (mode === "EDIT") {
      const data = await updateInvoiceDetail({
        ...rest,
        id: params.invoice_id as string,
      });
      if (data.success) {
        toast({
          title: "Invoice updated successfully",
        });

        if (handleCheckout) {
          setSavePdf({
            invoiceId: data.data.id,
            trigger: true,
          });
        } else {
          await revalidate(`/business/invoices`);
          navigate.replace(`/business/invoices`);
          setLoading(false);
        }
      } else {
        toast({
          title: data.error,
        });
        setLoading(false);
      }
    } else {
      const data = await generateInvoice({
        values: values,
      });
      if (data.success) {
        if (handleCheckout) {
          setSavePdf({
            invoiceId: data.data.id,
            trigger: true,
          });
        } else {
          await revalidate(`/business/invoices`);
          navigate.replace(`/business/invoices`);
          setLoading(false);
        }
      } else {
        toast({
          title: data.error,
        });
        setLoading(false);
      }
    }
  }

  async function saveAndSendInvoice() {
    await form.trigger();
    if (form.formState.isValid) {
      await onSubmit(form.getValues(), true);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={async e => {
          e.preventDefault();
          e.stopPropagation();
          await form.trigger();
          if (form.formState.isValid) {
            await onSubmit(form.getValues());
          }
        }}
        className="text-zinc-600 dark:text-zinc-200 flex flex-col xl:grid grid-cols-12 gap-5 justify-center relative"
        autoComplete="off"
      >
        <div className="flex flex-col gap-5 col-span-8 overflow-auto">
          <div>
            <div className="text-md font-semibold col-span-2 mb-2">
              <span>Business Details</span>
            </div>
            <div className="border border-input px-4 py-3 rounded-md  flex flex-col gap-5 xl:grid grid-cols-[200px_1fr]">
              <UploadLogo file={file} setFile={setFile} />
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormControl>
                        <Input
                          className="h-9 disabled:opacity-100"
                          disabled
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
                  name="contact"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          className="h-9 disabled:opacity-100"
                          placeholder="Business Phone Number"
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
                  name="address"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormControl>
                        <Textarea
                          placeholder="Business Address"
                          className="resize-none disabled:opacity-100"
                          disabled
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <div>
            <div className="text-md font-semibold col-span-2 mb-2">
              <span>Customer Details</span>
            </div>
            <div className="border border-input px-4 py-3 rounded-md grid grid-cols-2 gap-x-4 gap-y-3">
              <div>
                <div className="text-base font-normal mb-2">
                  Please select the event
                </div>
                <FormField
                  control={form.control}
                  name="event_id"
                  render={({ field }) => {
                    const booking = bookings!.find(
                      i => i.event.id === field.value
                    );
                    return (
                      <FormItem>
                        <FormControl>
                          <Select
                            onValueChange={value => {
                              field.onChange(value);
                              handleSelectChange(value);
                            }}
                            value={booking?.id ?? undefined}
                          >
                            <SelectTrigger>
                              <SelectValue
                                placeholder={
                                  <span className="text-muted-foreground">
                                    Select Event
                                  </span>
                                }
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {bookings!.map(items => (
                                <SelectItem
                                  key={items.id}
                                  value={items!.id as string}
                                >
                                  {items.customer?.email}({items.event?.title})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
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
                        placeholder="Customer Phone Number"
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
                  fieldName="customer_address"
                  placeholder="Customer Address"
                  defaultValue={invoiceData?.customer_address}
                />
              </div>
            </div>
          </div>

          <div>
            <div className="flex mb-2 justify-between items-center">
              <div className="text-md font-semibold col-span-2 mb-2">
                <span>Item Details</span>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              {fields.map((i, index) => (
                <div
                  key={i.id}
                  className="grid grid-cols-2 border border-input px-4 py-3 rounded-md gap-x-5 gap-y-2"
                >
                  <FormField
                    control={form.control}
                    name={`items.${index}.name`}
                    render={({ field }) => (
                      <FormItem className="col-span-2 ">
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
                    name={`items.${index}.description`}
                    render={({ field }) => (
                      <FormItem className="col-span-2">
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
                              setUpdatedItem(prev => prev + 1);
                              if (isNaN(value)) {
                                field.onChange(0);
                              } else {
                                field.onChange(value);
                              }
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
                            placeholder="Item Quantity"
                            {...field}
                            onChange={e => {
                              const value = parseFloat(e.target.value);
                              setUpdatedItem(prev => prev + 1);
                              if (isNaN(value)) {
                                field.onChange(0);
                              } else {
                                field.onChange(value);
                              }
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
                  {fields.length > 0 ? (
                    <button
                      type="button"
                      onClick={() => {
                        remove(index);
                        setUpdatedItem(prev => prev + 1);
                      }}
                      className="text-[#7f1d1d] text-sm font-semibold flex gap-1 justify-end items-center col-span-2"
                    >
                      <RiDeleteBin6Line /> <span>Remove</span>
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="secondary"
              className="ml-auto mt-3 flex px-2 py-1 h-9 text-sm gap-1"
              onClick={() => {
                append({
                  name: "",
                  price: 0,
                  quantity: 0,
                  description: "",
                  id: uuid(),
                });
                setUpdatedItem(prev => prev + 1);
              }}
            >
              <LiaPlusSolid size={16} className="text-white" />{" "}
              <span>Add Item</span>
            </Button>
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
                        setUpdatedItem(prev => prev + 1);
                        if (isNaN(value)) {
                          field.onChange(0);
                        } else {
                          field.onChange(value);
                        }
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
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormControl>
                      <DatePicker
                        placeholder="Select due date"
                        value={field.value}
                        onChange={field.onChange}
                        disabled={date => date < new Date()}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="Notes"
                    className="resize-none"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="col-span-4 sticky top-5 h-fit ">
          <div className="border border-input rounded-md">
            <div className="flex items-center justify-between text-lg font-semibold border-b  px-5 py-2  border-input">
              <span>Sub-Total</span>
              <span>{formatAmount(breakdown.subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-lg font-light  border-b  px-5 py-2  border-input">
              <span>Taxes</span>
              <span>{formatAmount(breakdown.tax)}</span>
            </div>
            <div className="flex items-center justify-between text-lg font-light  border-b  px-5 py-2  border-input">
              <span>{`Application Fees`}</span>
              <span>{formatAmount(breakdown.platformFee)}</span>
            </div>
            <div className="flex items-center justify-between text-lg font-extrabold px-5 py-2">
              <span>Total</span>
              <span>{formatAmount(breakdown.total)}</span>
            </div>
          </div>
          <div className="flex justify-end gap-5 mt-4">
            <Button className="w-fit" type="submit" disabled={loading}>
              SAVE
            </Button>
            <Button
              variant="secondary"
              type="button"
              className="w-fit"
              onClick={async () => {
                await saveAndSendInvoice();
              }}
              disabled={loading}
            >
              SEND
            </Button>
            <Button
              variant="outline"
              type="button"
              className="w-fit"
              onClick={() => {
                navigate.replace("/business/invoices");
              }}
              disabled={loading}
            >
              CANCEL
            </Button>
          </div>
        </div>
      </form>
      <InvoicePdf
        invoice={form.getValues()}
        savePdf={savePdf}
        loading={loading}
        setLoading={setLoading}
      />
    </Form>
  );
};

export default InvoiceForm;
