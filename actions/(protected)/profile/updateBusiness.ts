"use server";

import { User } from "lucia";
import { businesses } from "@/db/schema";
import { db } from "@/lib/db";
import { validateBusinessToken } from "@/actions/_utils/validateToken";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { eq } from "drizzle-orm";
import { settingsBusinessDetailSchemaType } from "@/lib/schema";
import { createPublicBusinessImgUrl } from "@/lib/minio";
import { trimRichEditor } from "@/lib/common";

type parmaTypes = {
  businessDetail: settingsBusinessDetailSchemaType;
  logo: FormData;
};

const handler = async (user: User, params: parmaTypes) => {
  const { businessDetail, logo } = params;

  const logoUrl: { logo?: string } = {};

  const image = logo.get("image") as File;

  if (image) {
    const uploadedImageUrl = await createPublicBusinessImgUrl(
      user.business_id!,
      BigInt(user.id),
      image
    );

    logoUrl.logo = uploadedImageUrl;
  }

  try {
    const { email, description, ...rest } = businessDetail;
    await db
      .update(businesses)
      .set({
        ...rest,
        description: trimRichEditor(description),
        ...logoUrl,
      })
      .where(eq(businesses.id, user.business_id!));

    return {
      success: true as true,
      data: "Business detail updated successfully.",
    };
  } catch (err) {
    return errorHandler(err);
  }
};

export const updateBusinessDetail: (
  params: parmaTypes
) => Promise<Awaited<ReturnType<typeof handler>>> =
  validateBusinessToken(handler);
