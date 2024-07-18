"use client";

import React, { HTMLProps, useRef, useState } from "react";
import {
  createInvoiceSchemaType,
  getInvoicesDetailResponseType,
} from "@/actions/_utils/types.type";
import Image from "next/image";
import {
  formatAmount,
  generateBreakdownPrice,
  invoiceStatusColor,
} from "@/lib/common";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import { IoPrintOutline } from "react-icons/io5";
import { FiDownload } from "react-icons/fi";
import { useReactToPrint } from "react-to-print";
import BackButton from "@/components/shared/back-button";
import { Label } from "@/components/ui/label";
import { payViaTypeEnum } from "@/db/schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateInvoicePayMode } from "@/actions/(protected)/business/invoices/updateInvoicePaymentMode";
import { useToast } from "@/components/ui/use-toast";
import Spinner from "@/components/shared/spinner";

const InvoicePreview = ({
  invoice,
}: {
  invoice: getInvoicesDetailResponseType["data"];
}) => {
  const items = invoice!.items as createInvoiceSchemaType["items"];
  const priceBreakdown = generateBreakdownPrice(
    items,
    invoice?.tax ?? 0,
    invoice?.platform_fee
  );
  const invoiceId = invoice?.id;
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const preview = useRef<HTMLDivElement>(null!);
  const handlePrint = useReactToPrint({
    content: () => preview.current,
  });

  const payViaTypeOptions = payViaTypeEnum.enumValues;

  const isDraft = invoice?.status === "draft";

  const handleSaveInvoice = async () => {
    if (invoice?.invoice) {
      fetch(invoice?.invoice)
        .then(response => response.blob())
        .then(blob => {
          const reader = new FileReader();
          reader.onload = function () {
            const dataURL = reader.result;
            const a = document.createElement("a");
            a.href = dataURL as string;
            a.download = "invoice.pdf"; // Set the desired file name
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          };
          reader.readAsDataURL(blob);
        })
        .catch(error => {
          console.error("Error fetching PDF:", error);
        });
    }
  };

  const handlePrintFile = async () => {
    handlePrint();
  };

  const headerItem =
    "py-1 px-1 lg:px-1 lg:py-2 flex items-center w-fit break-all text-xs lg:text-base font-normal whitespace-nowrap	" as HTMLProps<HTMLElement>["className"];

  const tableItem =
    "py-1 px-1 lg:px-1 py-2 flex items-center w-fit break-all text-xs lg:text-base" as HTMLProps<HTMLElement>["className"];

  return (
    <div className="absolute left-0 right-0">
      <div className="flex justify-between items-center  px-4 md:px-6  mb-2 lg:mb-4">
        <BackButton to="/business/invoices" />
        <div className="flex justify-end gap-4">
          <Button
            variant="outline"
            className="p-2 h-fit lg:px-2 gap-1"
            onClick={handlePrintFile}
            disabled={isDraft}
          >
            <IoPrintOutline className="w-4 h-4 lg:w-[18px] lg:h-[18px]" />{" "}
            <span>Print</span>
          </Button>
          <Button
            className="p-2 h-fit lg:px-2 gap-1"
            onClick={handleSaveInvoice}
            disabled={isDraft}
          >
            <FiDownload className="w-4 h-4 lg:w-[18px] lg:h-[18px]" />{" "}
            <span>Download</span>
          </Button>
        </div>
      </div>
      <div className="  px-4 md:px-6  mb-2 lg:mb-4 flex  items-center gap-2">
        <Label className="whitespace-nowrap">Pay via:</Label>

        <Select
          onValueChange={async (value: "stripe" | "cash" | "cheque") => {
            setLoading(true);
            const res = await updateInvoicePayMode({
              value: value,
              id: invoice!.id,
            });
            if (res.success) {
              toast({ title: "Payment mode updated successfully!" });
            } else {
              toast({ title: "Error updating payment mode!" });
            }
            setLoading(false);
          }}
          value={invoice?.pay_via as string}
        >
          <SelectTrigger className="w-40">
            <SelectValue
              className="capitalize"
              placeholder={
                <span className="text-muted-foreground ">Pay via...</span>
              }
            />
          </SelectTrigger>
          <SelectContent>
            {payViaTypeOptions.map(i => (
              <SelectItem className="capitalize" key={i} value={i}>
                {i}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {loading ? <Spinner type="inline" /> : null}
      </div>
      <div className="relative bg-background border border-gray1 p-2 lg:p-6 rounded-md bg my-4 mx-4 md:mx-6">
        <div
          ref={preview}
          className="absolute -z-50 left-0 right-0 border border-gray1 p-4 rounded-md bg my-4 mx-4 md:mx-6"
        >
          <div className="mb-3 lg:mb-6 flex gap-4">
            <div className="flex-1 flex flex-col  gap-4 ">
              <div className="relative h-[60px] w-[60px] lg:h-[72px] lg:w-[72px] rounded-sm border border-gray1">
                <Image
                  src={invoice?.business.logo ?? ""}
                  alt={invoice?.business.name ?? ""}
                  fill
                />
              </div>
              <div className="flex flex-col">
                <span className="text-sm lg:text-base font-semibold  break-all">
                  {invoice?.business.name}
                </span>
                <span className="mb-1 text-xs lg:text-sm text-gray-600 font-normal  break-all">
                  {invoice?.business.address}
                </span>
                <span className="text-xs lg:text-sm text-gray-600 font-normal  break-all">
                  ({invoice?.business.contact})
                </span>
              </div>
            </div>
            <div className="flex-1  flex flex-col  gap-4">
              <div className="w-fit ml-auto">
                <div className="flex flex-col min-h-[60px] lg:min-h-[72px] w-fit">
                  <span
                    className={`text-xs lg:text-base ${invoiceStatusColor(invoice?.status ?? "draft")}`}
                  >
                    {invoice?.status}
                  </span>
                  <span className="text-xs lg:text-base">
                    INV - #{invoiceId}
                  </span>
                  <span className="text-xs text-gray-600">Invoice Number</span>
                </div>

                <div className="flex flex-col w-fit mt-4">
                  <span className="text-sm lg:text-base font-semibold  break-all">
                    Bill To
                  </span>
                  <span className="mb-1 text-xs lg:text-sm text-gray-600 font-normal  break-all">
                    {invoice?.customer_name}
                  </span>
                  <span className="mb-1 text-xs lg:text-sm text-gray-600 font-normal  break-all">
                    {invoice?.customer_address}
                  </span>

                  <span className="text-xs lg:text-sm text-gray-600 font-normal  break-all">
                    ({invoice?.customer_contact})
                  </span>
                </div>
              </div>
            </div>
          </div>

          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-300 text-gray-800 font-normal rounded-t-md flex border border-gray1">
                <th className={`${headerItem} flex-[0.3] justify-center`}>#</th>
                <th className={`${headerItem} flex-[2] justify-start`}>Item</th>
                <th className={`${headerItem} flex-1 justify-center`}>
                  Quantity
                </th>
                <th className={`${headerItem} flex-1 justify-center`}>
                  Unit Price
                </th>
                <th className={`${headerItem} flex-1 justify-center`}>Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((i, index) => (
                <tr
                  key={i.id}
                  className={clsx({
                    "text-gray-900 font-normal flex  border border-gray1 border-t-0 ":
                      true,
                    "rounded-b-md": items.length === index + 1,
                  })}
                >
                  <td className={`${tableItem} flex-[0.3] justify-center`}>
                    {index + 1}
                  </td>
                  <td className={`${tableItem} flex-[2] justify-start`}>
                    {i.name}
                  </td>
                  <td className={`${tableItem} flex-1 justify-center`}>
                    {i.quantity}
                  </td>
                  <td className={`${tableItem} flex-1 justify-center`}>
                    {formatAmount(i.price)}
                  </td>
                  <td className={`${tableItem} flex-1 justify-center`}>
                    {formatAmount(i.price * i.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex mt-3 lg:mt-6 gap-2">
            <div className="flex-[0.4] flex flex-col gap-1">
              <span className="text-sm lg:text-base font-semibold ">Notes</span>
              <span className="text-xs lg:text-sm font-normal ">
                {invoice?.notes}
              </span>
            </div>
            <div className="ml-auto flex-[0.6] max-w-[400px] text-gray-800 border rounded-lg border-gray1">
              <div className="text-xs lg:text-base flex items-center justify-between px-1 py-1 lg:px-2 lg:py-2 border-b border-gray1 font-semibold">
                <span>Sub-Total</span>
                <span>{formatAmount(priceBreakdown.subtotal)}</span>
              </div>
              <div className="text-xs lg:text-base flex items-center justify-between px-1 py-0.5  lg:px-2 lg:py-1.5 border-b border-gray1">
                <span>Taxes</span>
                <span>{formatAmount(priceBreakdown.tax)}</span>
              </div>
              <div className="text-xs lg:text-base flex items-center justify-between px-1 py-0.5 lg:px-2 lg:py-1.5 border-b border-gray1">
                <span>Application Fees</span>
                <span>{formatAmount(priceBreakdown.platformFee)}</span>
              </div>
              <div className="text-xs lg:text-base flex items-center justify-between px-1 py-1 lg:px-2 lg:py-2 text-gray-900 font-bold">
                <span>Total</span>
                <span>{formatAmount(priceBreakdown.total)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-3 lg:mb-6 flex gap-4">
          <div className="flex-1 flex flex-col  gap-4 ">
            <div className="relative h-[60px] w-[60px] lg:h-[72px] lg:w-[72px] rounded-sm border border-gray1">
              <Image
                src={invoice?.business.logo ?? ""}
                alt={invoice?.business.name ?? ""}
                fill
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm lg:text-base font-semibold  break-all">
                {invoice?.business.name}
              </span>
              <span className="mb-1 text-xs lg:text-sm text-[#cecece] font-normal  break-all">
                {invoice?.business.address}
              </span>
              <span className="text-xs lg:text-sm text-[#cecece] font-normal  break-all">
                ({invoice?.business.contact})
              </span>
            </div>
          </div>
          <div className="flex-1  flex flex-col  gap-4">
            <div className="w-fit ml-auto">
              <div className="flex flex-col min-h-[60px] lg:min-h-[72px] w-fit">
                <span
                  className={`text-xs lg:text-base ${invoiceStatusColor(invoice?.status ?? "draft")}`}
                >
                  {invoice?.status}
                </span>
                <span className="text-xs lg:text-base">INV - #{invoiceId}</span>
                <span className="text-xs text-[#cecece]">Invoice Number</span>
              </div>

              <div className="flex flex-col w-fit mt-4">
                <span className="text-sm lg:text-base font-semibold  break-all">
                  Bill To
                </span>
                <span className="mb-1 text-xs lg:text-sm text-[#cecece] font-normal  break-all">
                  {invoice?.customer_name}
                </span>
                <span className="mb-1 text-xs lg:text-sm text-[#cecece] font-normal  break-all">
                  {invoice?.customer_address}
                </span>

                <span className="text-xs lg:text-sm text-[#cecece] font-normal  break-all">
                  ({invoice?.customer_contact})
                </span>
              </div>
            </div>
          </div>
        </div>

        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-active text-[#a29fab] font-normal rounded-t-md flex border border-gray1">
              <th className={`${headerItem} flex-[0.3] justify-center`}>#</th>
              <th className={`${headerItem} flex-[2] justify-start`}>Item</th>
              <th className={`${headerItem} flex-1 justify-center`}>
                Quantity
              </th>
              <th className={`${headerItem} flex-1 justify-center`}>
                Unit Price
              </th>
              <th className={`${headerItem} flex-1 justify-center`}>Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((i, index) => (
              <tr
                key={i.id}
                className={clsx({
                  "text-white font-normal flex  border border-gray1 border-t-0 ":
                    true,
                  "rounded-b-md": items.length === index + 1,
                })}
              >
                <td className={`${tableItem} flex-[0.3] justify-center`}>
                  {index + 1}
                </td>
                <td className={`${tableItem} flex-[2] justify-start`}>
                  {i.name}
                </td>
                <td className={`${tableItem} flex-1 justify-center`}>
                  {i.quantity}
                </td>
                <td className={`${tableItem} flex-1 justify-center`}>
                  {formatAmount(i.price)}
                </td>
                <td className={`${tableItem} flex-1 justify-center`}>
                  {formatAmount(i.price * i.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex mt-3 lg:mt-6 gap-2">
          <div className="flex-[0.4] flex flex-col gap-1">
            <span className="text-sm lg:text-base font-semibold ">Notes</span>
            <span className="text-xs lg:text-sm font-normal ">
              {invoice?.notes}
            </span>
          </div>
          <div className="ml-auto flex-[0.6] max-w-[400px] text-[#b8b8b8] border rounded-lg border-gray1">
            <div className="text-xs lg:text-base flex items-center justify-between px-1 py-1 lg:px-2 lg:py-2 border-b border-gray1 font-semibold">
              <span>Sub-Total</span>
              <span>{formatAmount(priceBreakdown.subtotal)}</span>
            </div>
            <div className="text-xs lg:text-base flex items-center justify-between px-1 py-0.5  lg:px-2 lg:py-1.5 border-b border-gray1">
              <span>Taxes</span>
              <span>{formatAmount(priceBreakdown.tax)}</span>
            </div>
            <div className="text-xs lg:text-base flex items-center justify-between px-1 py-0.5 lg:px-2 lg:py-1.5 border-b border-gray1">
              <span>Application Fees</span>
              <span>{formatAmount(priceBreakdown.platformFee)}</span>
            </div>
            <div className="text-xs lg:text-base flex items-center justify-between px-1 py-1 lg:px-2 lg:py-2 text-white font-bold">
              <span>Total</span>
              <span>{formatAmount(priceBreakdown.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;
