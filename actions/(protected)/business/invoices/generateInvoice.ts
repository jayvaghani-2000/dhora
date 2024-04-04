"use server";

import { z } from "zod";
import { User } from "lucia";
import { createInvoiceSchema, invoices } from "@/db/schema";
import { db } from "@/lib/db";
import { validateBusinessToken } from "@/actions/_utils/validateToken";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { invoiceSchema } from "@/lib/schema";
import { stringifyBigint } from "@/actions/_utils/stringifyBigint";

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

    return { success: true as true, data: stringifyBigint(invoice[0]) };
  } catch (err) {
    return errorHandler(err);
  }
};

export const generateInvoice: (params: {
  values: z.infer<typeof invoiceSchema>;
}) => Promise<Awaited<ReturnType<typeof handler>>> =
  validateBusinessToken(handler);
