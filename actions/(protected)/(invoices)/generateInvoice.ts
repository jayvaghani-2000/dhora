"use server";

import { z } from "zod";
import { User } from "lucia";
import { businesses, invoices } from "@/db/schema";
import { db } from "@/lib/db";
import { validateBusinessToken } from "@/actions/_utils/validateToken";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { eq } from "drizzle-orm";
import { invoiceSchema } from "@/app/(protected)/business/invoices/_utils/schema";

const handler = async (user: User, values: z.infer<typeof invoiceSchema>) => {
  const { tax } = values;
  try {
    const businessObj = await db.query.businesses.findFirst({
      where: eq(businesses.id, user.business_id!),
    });

    if (!businessObj?.address) {
      await db
        .update(businesses)
        .set({
          address: values.business_address,
          contact: values.business_contact,
          updated_at: new Date(),
        })
        .where(eq(businesses.id, user.business_id!))
        .returning();
    }

    const contract = await db
      .insert(invoices)
      .values({
        ...values,
        tax: Number(tax),
        business_id: user.business_id!,
        total: 120.12,
      })
      .returning();

    return { success: true, data: contract[0] };
  } catch (err) {
    return errorHandler(err);
  }
};

export const generateInvoice: (
  values: z.infer<typeof invoiceSchema>
) => Promise<Awaited<ReturnType<typeof handler>>> =
  validateBusinessToken(handler);
