"use server";

import { z } from "zod";
import { User } from "lucia";
import { businesses, invoices } from "@/db/schema";
import { db } from "@/lib/db";
import { validateBusinessToken } from "@/actions/_utils/validateToken";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { eq } from "drizzle-orm";
import { invoiceSchema } from "@/app/(protected)/business/invoices/_utils/schema";
import { imageObjectType } from "@/actions/_utils/types.type";

const handler = async (
  user: User,
  params: {
    values: z.infer<typeof invoiceSchema>;
    logo: imageObjectType;
  }
) => {
  const { logo, values } = params;
  const { tax, ...rest } = values;
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
          logo: logo,
          updated_at: new Date(),
        })
        .where(eq(businesses.id, user.business_id!))
        .returning();
    }

    const contract = await db
      .insert(invoices)
      .values({
        ...rest,
        tax: 5,
        business_id: user.business_id!,
        business_logo: logo,
        total: 120.12,
      })
      .returning();

    return { success: true, data: contract[0] };
  } catch (err) {
    console.log(err);
    return errorHandler(err);
  }
};

export const generateInvoice: (params: {
  values: z.infer<typeof invoiceSchema>;
  logo: imageObjectType;
}) => Promise<Awaited<ReturnType<typeof handler>>> =
  validateBusinessToken(handler);
