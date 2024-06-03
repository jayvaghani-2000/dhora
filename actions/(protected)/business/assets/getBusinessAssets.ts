"use server";

import { validateToken } from "@/actions/_utils/validateToken";
import { User } from "lucia";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { db } from "@/lib/db";
import { and, desc, eq, inArray } from "drizzle-orm";
import { assets } from "@/db/schema";

const handler = async (user: User, businessId?: string) => {
  try {
    const data = await getAssets(
      user,
      businessId ? businessId : (user.business_id as string)
    );

    return { success: true as true, data: data };
  } catch (err) {
    return errorHandler(err);
  }
};

export const getAssets = async (user: User, businessId: string) => {
  const data = await db.query.assets.findMany({
    where: and(
      eq(assets.business_id, businessId!),
      inArray(assets.asset_type, ["business_assets", "package_assets"])
    ),
    orderBy: [desc(assets.created_at)],
  });
  return data;
};

export const getBusinessAssets: (
  businessId?: string
) => Promise<Awaited<ReturnType<typeof handler>>> = validateToken(handler);
