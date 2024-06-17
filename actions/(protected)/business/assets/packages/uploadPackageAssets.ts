"use server";

import { validateBusinessToken } from "@/actions/_utils/validateToken";
import { User } from "lucia";
import { errorHandler } from "@/actions/_utils/errorHandler";
import {
  createPublicPackageAssetsImageUrl,
  createPublicPackageAssetsVideoUrl,
} from "@/lib/minio";
import { db } from "@/lib/db";
import { assets } from "@/db/schema";

type paramsType = { file: FormData; metadata?: unknown; packageId: string };

const handler = async (
  user: User,
  { file, metadata = {}, packageId }: paramsType
) => {
  try {
    const image = file.get("image") as File;

    if (image) {
      const uploadedImage = await createPublicPackageAssetsImageUrl(
        {
          business_id: user.business_id as string,
          user_id: user.id,
          package_id: packageId,
        },
        image
      );

      await db
        .insert(assets)
        .values({
          ...uploadedImage,
          type: image.type,
          business_id: user.business_id,
          user_id: user.id,
          asset_type: "package_assets",
          package_id: packageId,
        })
        .returning();
    }

    const video = file.get("video") as File;

    if (video) {
      const uploadedVideo = await createPublicPackageAssetsVideoUrl(
        {
          business_id: user.business_id as string,
          user_id: user.id,
          package_id: packageId,
        },
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
          asset_type: "package_assets",
          package_id: packageId,
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

export const uploadPackageAssets: (
  params: paramsType
) => Promise<Awaited<ReturnType<typeof handler>>> =
  validateBusinessToken(handler);
