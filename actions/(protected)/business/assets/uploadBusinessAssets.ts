"use server";

import { validateBusinessToken } from "@/actions/_utils/validateToken";
import { User } from "lucia";
import { errorHandler } from "@/actions/_utils/errorHandler";
import {
  createPublicBusinessAssetsImageUrl,
  createPublicBusinessAssetsVideoUrl,
} from "@/lib/minio";
import { db } from "@/lib/db";
import { assets } from "@/db/schema";
import { revalidate } from "@/actions/(public)/revalidate";

type paramsType = { file: FormData; metadata?: unknown };

const handler = async (user: User, { file, metadata = {} }: paramsType) => {
  try {
    const image = file.get("image") as File;

    if (image) {
      const uploadedImage = await createPublicBusinessAssetsImageUrl(
        user.business_id!,
        user.id,
        image
      );

      await db
        .insert(assets)
        .values({
          ...uploadedImage,
          type: image.type,
          business_id: user.business_id,
          user_id: user.id,
          asset_type: "business_assets",
        })
        .returning();
    }

    const video = file.get("video") as File;

    if (video) {
      const uploadedVideo = await createPublicBusinessAssetsVideoUrl(
        user.business_id!,
        user.id,
        video
      );
      const videoMetaData = metadata as { height: number; width: number };

      await db
        .insert(assets)
        .values({
          url: uploadedVideo,
          blur_url: "",
          type: video.type,
          business_id: user.business_id,
          user_id: user.id,
          asset_type: "business_assets",
          ...videoMetaData,
        })
        .returning();
    }

    return { success: true as true, data: "Image uploaded successfully!" };
  } catch (err) {
    console.log(err);

    return errorHandler(err);
  }
};

const uploadBusinessAssetsHandler = async (user: User, params: paramsType) => {
  const res = await handler(user, params);
  if (res.success) {
    await revalidate("/business/business-profile/assets");
  }
  return res;
};

export const uploadBusinessAssets: (
  params: paramsType
) => Promise<Awaited<ReturnType<typeof uploadBusinessAssetsHandler>>> =
  validateBusinessToken(uploadBusinessAssetsHandler);
