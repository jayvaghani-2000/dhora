"use server";

import { invoices } from "@/db/schema";
import { db } from "@/lib/db";
import { and, desc, eq } from "drizzle-orm";
import { validateBusinessToken } from "@/actions/_utils/validateToken";
import { User } from "lucia";
import { errorHandler } from "@/actions/_utils/errorHandler";
import puppeteer from "puppeteer";
import { createInvoiceSchemaType } from "@/actions/_utils/types.type";
import { createPublicInvoicePdfUrl } from "@/lib/minio";
import { sendInvoiceEmail } from "@/actions/(auth)/_utils/sendInvoice";

type paramsType = {
  invoiceId: string;
  paymentLink: string;
};

const handler = async (user: User, params: paramsType) => {
  const { invoiceId, paymentLink } = params;
  const invoice = await db.query.invoices.findFirst({
    where: and(
      eq(invoices.id, BigInt(invoiceId)),
      eq(invoices.business_id, user.business_id!)
    ),
    with: {
      business: true,
    },
  });

  const items = invoice?.items as createInvoiceSchemaType["items"];

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const styleTableHeader = `margin: 0; padding: 8px;display: flex;justify-content: center;align-items: center;width: fit-content;word-break: break-all;font-weight: 400;font-size: 12px;`;
    const styleTableItem = `margin: 0; padding: 6px;display: flex;justify-content: center;align-items: center;width: fit-content;word-break: break-all;font-weight: 400;font-size: 12px;`;

    const table = `<table style="width:100%; border-collapse:collapse; border:1px solid #707070; border-radius: 5px;">
          <thead >
            <tr style="background-color: #313238; color:#cecece; border-radius: 5px 5px 0px 0px; font-weight: 400, margin: 0px;display:flex;">
              <th style="${styleTableHeader} flex: 0.3;">#</th>
              <th style="${styleTableHeader} flex: 2;justify-content: flex-start;">Item</th>
              <th style="${styleTableHeader} flex: 1;">Quantity</th>
              <th style="${styleTableHeader} flex: 1;">Unit Price</th>
              <th style="${styleTableHeader} flex: 1;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${items.map(
              (
                i,
                index
              ) => `<tr style="color: #fff; font-weight: 400;margin: 0;display: flex; border-top: 1px solid #707070;" >
              <td style="${styleTableItem} flex: 0.3;">${index + 1}</td>
              <td style="${styleTableItem} flex: 2; justify-content: flex-start;">${i.name}</td>
              <td style="${styleTableItem} flex: 1;">${i.quantity}</td>
              <td style="${styleTableItem} flex: 1;">${i.price}</td>
              <td style="${styleTableItem} flex: 1;">${i.price * i.quantity}</td>
            </tr>`
            )}
          </tbody>
         
        </table>`;

    // Set the content of the page to your HTML
    await page.setContent(
      `<html>
      <head>
      <style>
      *, body{
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
        background-color: #192229;
      }
      </style>
      </head>
      <body style="background-color: #192229;">
      <div style="margin:20px; border: 1px solid #707070;padding: 16px; border-radius: 5px; background-color: #192229;">
      <img src="${invoice?.business.logo}" style="height: 72px; width: 72px; border-radius: 5px; border: 1px solid #707070;" />
        ${table}
      </div>
      </body>
      </html>`
    );

    const pdfBuffer = await page.pdf({ format: "A4" });
    const uploadedPdfImage = await createPublicInvoicePdfUrl(
      user.business_id!,
      pdfBuffer
    );

    const result = pdfBuffer.toString("base64");

    await sendInvoiceEmail("Invoice", {
      paymentLink: paymentLink,
      to: invoice?.customer_email ?? "",
      pdf: result,
    });

    await browser.close();

    await db
      .update(invoices)
      .set({
        invoice: uploadedPdfImage,
        updated_at: new Date(),
      })
      .where(and(eq(invoices.id, BigInt(invoiceId))));

    return { success: true as true };
  } catch (err) {
    throw err;
  }
};

export const generateInvoicePdf: (
  params: paramsType
) => Promise<Awaited<ReturnType<typeof handler>>> =
  validateBusinessToken(handler);
