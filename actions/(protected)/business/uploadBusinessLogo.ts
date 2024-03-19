"use server";

import { validateBusinessToken } from "@/actions/_utils/validateToken";
import { User } from "lucia";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { createPublicBusinessImgUrl, removeImage } from "../../../lib/minio";
import { db } from "@/lib/db";
import { businesses } from "@/db/schema";
import { and, eq } from "drizzle-orm";

const handler = async (user: User, file: FormData) => {
  try {
    const business = await db.query.businesses.findFirst({
      where: and(eq(businesses.id, user.business_id!)),
    });

    if (business?.logo) {
      await removeImage(business.logo);
    }

    const image = file.get("image") as File;
    const uploadedImageUrl = await createPublicBusinessImgUrl(
      user.business_id as bigint,
      image
    );

    await db
      .update(businesses)
      .set({
        logo: uploadedImageUrl,
        updated_at: new Date(),
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
