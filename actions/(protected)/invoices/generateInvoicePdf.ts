"use server";

import { invoices } from "@/db/schema";
import { db } from "@/lib/db";
import { and, eq } from "drizzle-orm";
import { validateBusinessToken } from "@/actions/_utils/validateToken";
import { User } from "lucia";
import puppeteer from "puppeteer";
import { createPublicInvoicePdfUrl } from "@/lib/minio";
import { sendInvoiceEmail } from "@/actions/(auth)/_utils/sendInvoice";
import { revalidatePath } from "next/cache";
import { invoicePdf } from "./pdf/invoicePdf";
import { getInvoiceInfoType } from "@/actions/_utils/types.type";

type paramsType = {
  invoice: getInvoiceInfoType;
  paymentLink: string;
};

const handler = async (user: User, params: paramsType) => {
  const { invoice, paymentLink } = params;

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const pdfHtml = await invoicePdf(invoice);

    await page.setContent(pdfHtml);

    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
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
      .where(and(eq(invoices.id, BigInt(invoice.id))));

    revalidatePath("/business/invoices");
    return {
      success: true as true,
      data: "Invoice sent to customer successfully!",
    };
  } catch (err) {
    throw err;
  }
};

export const generateInvoicePdf: (
  params: paramsType
) => Promise<Awaited<ReturnType<typeof handler>>> =
  validateBusinessToken(handler);
