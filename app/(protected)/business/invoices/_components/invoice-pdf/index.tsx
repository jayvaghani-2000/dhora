"use client";

import React, { HTMLProps } from "react";
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

const InvoicePdf = ({
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
  const invoiceId = invoice?.id as unknown as string;

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

  const blobToBase64 = async (blob: Blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
    });
  };

  const handlePrintFile = async () => {
    if (invoice?.invoice) {
      fetch(invoice.invoice)
        .then(response => response.blob()) // Get the response as a blob
        .then(async blob => {
          const base64Data = await blobToBase64(blob);
          window.open(base64Data as string, "_blank");
        })
        .catch(error => {
          console.error("Error fetching PDF:", error);
        });
    }
  };

  const headerItem =
    "py-1 px-1 lg:px-1 lg:py-2 flex items-center w-fit break-all text-xs lg:text-base font-normal whitespace-nowrap	" as HTMLProps<HTMLElement>["className"];

  const tableItem =
    "py-1 px-1 lg:px-1 py-2 flex items-center w-fit break-all text-xs lg:text-base" as HTMLProps<HTMLElement>["className"];

  return (
    <>
      <div className="flex justify-end gap-4 mb-2 lg:mb-4">
        <Button
          variant="outline"
          className="py-1 px-2 gap-1"
          onClick={handlePrintFile}
          disabled={isDraft}
        >
          <IoPrintOutline className="w-4 h-4 lg:w-[18px] lg:h-[18px]" />{" "}
          <span className="text-sm lg:text-base">Print</span>
        </Button>
        <Button
          className="py-1 px-2 gap-1"
          onClick={handleSaveInvoice}
          disabled={isDraft}
        >
          <FiDownload className="w-4 h-4 lg:w-[18px] lg:h-[18px]" />{" "}
          <span className="text-sm lg:text-base">Download</span>
        </Button>
      </div>
      <div className="border border-gray1 p-2 lg:p-6 rounded-md bg">
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
                  className={`text-xs lg:text-base ${invoiceStatusColor(invoice?.status ?? "")}`}
                >
                  {invoice?.status}
                </span>
                <span className="text-xs lg:text-base">
                  INV - #{invoiceId.substring(invoiceId.length - 5)}
                </span>
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
    </>
  );
};

export default InvoicePdf;
