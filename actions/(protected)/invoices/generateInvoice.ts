"use server";

import { z } from "zod";
import { User } from "lucia";
import { businesses, createInvoiceSchema, invoices } from "@/db/schema";
import { db } from "@/lib/db";
import { validateBusinessToken } from "@/actions/_utils/validateToken";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { eq } from "drizzle-orm";
import {
  businessDetailSchemaType,
  invoiceSchema,
} from "@/app/(protected)/business/invoices/_utils/schema";
import { revalidatePath } from "next/cache";

const handler = async (
  user: User,
  params: {
    values: z.infer<typeof createInvoiceSchema>;
    businessDetail?: businessDetailSchemaType;
  }
) => {
  const { businessDetail, values } = params;

  try {
    if (businessDetail) {
      const { business_address, business_contact, logo } = businessDetail;
      await db
        .update(businesses)
        .set({
          address: business_address,
          contact: business_contact,
          logo: logo,
          updated_at: new Date(),
        })
        .where(eq(businesses.id, user.business_id!))
        .returning();
    }

    const invoice = await db
      .insert(invoices)
      .values({ ...values, business_id: user.business_id!, status: "draft" })
      .returning();

    revalidatePath("/business/invoices");

    return { success: true, data: invoice[0] };
  } catch (err) {
    return errorHandler(err);
  }
};

export const generateInvoice: (params: {
  values: z.infer<typeof invoiceSchema>;
  businessDetail?: businessDetailSchemaType;
}) => Promise<Awaited<ReturnType<typeof handler>>> =
  validateBusinessToken(handler);
