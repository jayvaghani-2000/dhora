"use server";

import { z } from "zod";
import { User } from "lucia";
import { createInvoiceSchema, invoices } from "@/db/schema";
import { db } from "@/lib/db";
import { validateBusinessToken } from "@/actions/_utils/validateToken";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { invoiceSchema } from "@/app/(protected)/business/invoices/_utils/schema";
import { revalidatePath } from "next/cache";

const handler = async (
  user: User,
  params: {
    values: z.infer<typeof createInvoiceSchema>;
  }
) => {
  const { values } = params;

  try {
    const invoice = await db
      .insert(invoices)
      .values({ ...values, business_id: user.business_id!, status: "draft" })
      .returning();

    revalidatePath("/business/invoices");

    return { success: true as true, data: invoice[0] };
  } catch (err) {
    return errorHandler(err);
  }
};

export const generateInvoice: (params: {
  values: z.infer<typeof invoiceSchema>;
}) => Promise<Awaited<ReturnType<typeof handler>>> =
  validateBusinessToken(handler);
