"use server";

import { addOns } from "@/db/schema";
import { db } from "@/lib/db";
import { validateToken } from "@/actions/_utils/validateToken";
import { User } from "lucia";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { and, desc, eq } from "drizzle-orm";

const handler = async (user: User, businessId?: string) => {
  try {
    const data = await db.query.addOns.findMany({
      where: and(
        eq(
          addOns.business_id,
          businessId ? businessId : (user.business_id as string)
        ),
        eq(addOns.deleted, false)
      ),
      orderBy: [desc(addOns.updated_at)],
    });

    return {
      success: true as true,
      data: data,
    };
  } catch (err) {
    return errorHandler(err);
  }
};

export const getAddOns: (
  businessId?: string
) => Promise<Awaited<ReturnType<typeof handler>>> = validateToken(handler);
