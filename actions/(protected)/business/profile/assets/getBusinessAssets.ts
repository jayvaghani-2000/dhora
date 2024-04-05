"use server";

import { validateBusinessToken } from "@/actions/_utils/validateToken";
import { User } from "lucia";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { db } from "@/lib/db";
import { and, desc, eq } from "drizzle-orm";
import { assets } from "@/db/schema";
import { stringifyBigint } from "@/actions/_utils/stringifyBigint";

const handler = async (user: User) => {
  try {
    const data = await db.query.assets.findMany({
      where: and(
        eq(assets.business_id, user.business_id!),
        eq(assets.asset_type, "business_assets")
      ),
      orderBy: [desc(assets.created_at)],
    });

    return { success: true as true, data: data.map(i => stringifyBigint(i)) };
  } catch (err) {
    return errorHandler(err);
  }
};

export const getBusinessAssets: () => Promise<
  Awaited<ReturnType<typeof handler>>
> = validateBusinessToken(handler);
