"use server";

import { z } from "zod";
import { User } from "lucia";
import { editInvoiceSchema, invoices } from "@/db/schema";
import { db } from "@/lib/db";
import { validateBusinessToken } from "@/actions/_utils/validateToken";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { errorType } from "@/actions/_utils/types.type";
import { stringifyBigint } from "@/actions/_utils/stringifyBigint";

const handler = async (
  user: User,
  values: z.infer<typeof editInvoiceSchema>
) => {
  const { id, ...rest } = values;

  const validatedFields = editInvoiceSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!", success: false } as errorType;
  }

  try {
    const invoice = await db
      .update(invoices)
      .set({
        ...rest,
        due_date: values.due_date,
        updated_at: new Date(),
      })
      .where(
        and(
          eq(invoices.id, BigInt(id)),
          eq(invoices.business_id, user.business_id!)
        )
      )
      .returning();

    return { success: true as true, data: stringifyBigint(invoice[0]) };
  } catch (err) {
    console.log("err", err);
    return errorHandler(err);
  }
};

export const updateInvoiceDetail: (
  values: z.infer<typeof editInvoiceSchema>
) => Promise<Awaited<ReturnType<typeof handler>>> =
  validateBusinessToken(handler);
