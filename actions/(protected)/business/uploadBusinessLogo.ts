"use server";

import { validateBusinessToken } from "@/actions/_utils/validateToken";
import { User } from "lucia";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { createPublicBusinessImgUrl, removeAsset } from "../../../lib/minio";
import { db } from "@/lib/db";
import { businesses } from "@/db/schema";
import { and, eq } from "drizzle-orm";

const handler = async (user: User, file: FormData) => {
  try {
    const business = await db.query.businesses.findFirst({
      where: and(eq(businesses.id, user.business_id!)),
    });

    if (business?.logo) {
      await removeAsset([business.logo]);
    }

    const image = file.get("image") as File;
    const uploadedImageUrl = await createPublicBusinessImgUrl(
      user.business_id as bigint,
      BigInt(user.id),
      image
    );

    await db
      .update(businesses)
      .set({
        logo: uploadedImageUrl,
      })
      .where(eq(businesses.id, user.business_id!))
      .returning();

    return { success: true as true, data: { url: uploadedImageUrl } };
  } catch (err) {
    return errorHandler(err);
  }
};

export const uploadBusinessLogo: (
  file: FormData
) => Promise<Awaited<ReturnType<typeof handler>>> =
  validateBusinessToken(handler);
