"use server";

import { validateToken } from "@/actions/_utils/validateToken";
import { User } from "lucia";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { db } from "@/lib/db";
import { inArray } from "drizzle-orm";
import { assets } from "@/db/schema";
import { removeAsset } from "@/lib/minio";

const handler = async (user: User, assetId: string[]) => {
  try {
    const deletedAssets = await db
      .delete(assets)
      .where(
        inArray(
          assets.id,
          assetId.map(i => BigInt(i))
        )
      )
      .returning();

    await removeAsset(deletedAssets.map(i => i.url as string));

    return {
      success: true as true,
      data: "Asset deleted successfully.",
    };
  } catch (err) {
    console.log("err", err);
    return errorHandler(err);
  }
};

export const deleteAssets: () => Promise<Awaited<ReturnType<typeof handler>>> =
  validateToken(handler);
