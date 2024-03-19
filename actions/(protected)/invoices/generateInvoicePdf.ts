"use server";

import { invoices } from "@/db/schema";
import { db } from "@/lib/db";
import { and, eq } from "drizzle-orm";
import { validateBusinessToken } from "@/actions/_utils/validateToken";
import { User } from "lucia";
import { createPublicInvoicePdfUrl } from "@/lib/minio";
import { sendInvoiceEmail } from "@/actions/(auth)/_utils/sendInvoice";
import { revalidatePath } from "next/cache";
import { getInvoiceInfoType } from "@/actions/_utils/types.type";

type paramsType = {
  invoice: getInvoiceInfoType;
  paymentLink: string;
  file: FormData;
};

const handler = async (user: User, params: paramsType) => {
  const { invoice, paymentLink, file } = params;

  const pdf = file.get("pdf") as File;

  const buffer = Buffer.from(await pdf.arrayBuffer());
  const base64String = buffer.toString("base64");

  try {
    const uploadedPdfImage = await createPublicInvoicePdfUrl(
      user.business_id!,
      pdf
    );

    await sendInvoiceEmail("Invoice", {
      paymentLink: paymentLink,
      to: invoice?.customer_email ?? "",
      pdf: base64String,
    });

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
