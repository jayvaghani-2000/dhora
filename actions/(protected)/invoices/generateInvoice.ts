"use server";

import { z } from "zod";
import { User } from "lucia";
import { businesses, createInvoiceSchema, invoices } from "@/db/schema";
import { db } from "@/lib/db";
import { validateBusinessToken } from "@/actions/_utils/validateToken";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { eq } from "drizzle-orm";
import { invoiceSchema } from "@/app/(protected)/business/invoices/_utils/schema";
import { revalidatePath } from "next/cache";

const handler = async (
  user: User,
  params: {
    values: z.infer<typeof createInvoiceSchema>;
    logo: string;
  }
) => {
  const { logo, values } = params;

  try {
    const businessObj = await db.query.businesses.findFirst({
      where: eq(businesses.id, user.business_id!),
    });

    const invoice = await db.insert(invoices).values(values).returning();

    revalidatePath("/business/invoices");

    return { success: true, data: invoice[0] };
  } catch (err) {
    console.log(err);
    return errorHandler(err);
  }
};

export const generateInvoice: (params: {
  values: z.infer<typeof invoiceSchema>;
  logo: string;
}) => Promise<Awaited<ReturnType<typeof handler>>> =
  validateBusinessToken(handler);
