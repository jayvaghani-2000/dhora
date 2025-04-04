"use server";

import { User } from "lucia";
import { businesses } from "@/db/schema";
import { db } from "@/lib/db";
import { validateBusinessToken } from "@/actions/_utils/validateToken";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { eq } from "drizzle-orm";
import { businessDetailSchemaType } from "@/lib/schema";

const handler = async (
  user: User,
  params: {
    businessDetail: businessDetailSchemaType;
  }
) => {
  const { businessDetail } = params;

  try {
    const { address, contact } = businessDetail;
    await db
      .update(businesses)
      .set({
        address: address,
        contact: contact,
      })
      .where(eq(businesses.id, user.business_id!))
      .returning();

    return {
      success: true as true,
      data: "Business detail updated successfully.",
    };
  } catch (err) {
    return errorHandler(err);
  }
};

export const updateBusinessDetail: (params: {
  businessDetail: businessDetailSchemaType;
}) => Promise<Awaited<ReturnType<typeof handler>>> =
  validateBusinessToken(handler);
