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
import { revalidatePath } from "next/cache";

const handler = async (
  user: User,
  params: {
    values: z.infer<typeof invoiceSchema>;
    logo: imageObjectType;
  }
) => {
  const { logo, values } = params;
  const { ...rest } = values;

  try {
    const businessObj = await db.query.businesses.findFirst({
      where: eq(businesses.id, user.business_id!),
    });

    if (true) {
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

    const invoice = await db
      .insert(invoices)
      .values({
        ...rest,
        status: "draft",
        business_id: user.business_id!,
        business_logo: logo,
      })
      .returning();

    revalidatePath("/business/invoices");

    return { success: true, data: invoice[0] };
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
