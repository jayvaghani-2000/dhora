"use server";

import { validateToken } from "@/actions/_utils/validateToken";
import { User } from "lucia";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { db } from "@/lib/db";
import { and, eq } from "drizzle-orm";
import { assets } from "@/db/schema";
import { removeAsset } from "@/lib/minio";
import { revalidate } from "@/actions/(public)/revalidate";

type ParamsType = {
  assetId: string;
  path: string;
};

const handler = async (user: User, assetId: string) => {
  try {
    const deletedAssets = await db
      .delete(assets)
      .where(and(eq(assets.id, assetId), eq(assets.user_id, user.id)))
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

const deleteAssetHandler = async (user: User, params: ParamsType) => {
  const res = await handler(user, params.assetId);
  if (res.success) {
    await revalidate(params.path);
  }
  return res;
};

export const deleteAssets: (
  params: ParamsType
) => Promise<Awaited<ReturnType<typeof deleteAssetHandler>>> =
  validateToken(deleteAssetHandler);
