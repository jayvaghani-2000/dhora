"use server";

import { z } from "zod";
import { User } from "lucia";
import { editInvoiceSchema, invoices } from "@/db/schema";
import { db } from "@/lib/db";
import { validateBusinessToken } from "@/actions/_utils/validateToken";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const handler = async (
  user: User,
  values: z.infer<typeof editInvoiceSchema>
) => {
  const { id, ...rest } = values;

  try {
    const invoice = await db
      .update(invoices)
      .set({
        ...rest,
        updated_at: new Date(),
      })
      .where(and(eq(invoices.id, BigInt(id))))
      .returning();

    revalidatePath("/business/invoices");

    return { success: true as true, data: invoice[0] };
  } catch (err) {
    return errorHandler(err);
  }
};

export const updateInvoiceDetail: (
  values: z.infer<typeof editInvoiceSchema>
) => Promise<Awaited<ReturnType<typeof handler>>> =
  validateBusinessToken(handler);
