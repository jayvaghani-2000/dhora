"use server";

import { validateToken } from "@/actions/_utils/validateToken";
import { User } from "lucia";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { db } from "@/lib/db";
import { and, desc, eq } from "drizzle-orm";
import { assets } from "@/db/schema";
import { stringifyBigint } from "@/actions/_utils/stringifyBigint";

const handler = async (user: User, packageId: string) => {
  try {
    const data = await db.query.assets.findMany({
      where: and(
        eq(assets.package_id, packageId),
        eq(assets.asset_type, "package_assets")
      ),
      orderBy: [desc(assets.created_at)],
    });

    return { success: true as true, data: data.map(i => stringifyBigint(i)) };
  } catch (err) {
    return errorHandler(err);
  }
};

export const getPackageAssets: (
  packageId: string
) => Promise<Awaited<ReturnType<typeof handler>>> = validateToken(handler);
