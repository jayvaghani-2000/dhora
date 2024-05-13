"use server";

import { User } from "lucia";
import { users } from "@/db/schema";
import { db } from "@/lib/db";
import { validateToken } from "@/actions/_utils/validateToken";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { editProfileSchemaType } from "@/lib/schema";
import { createPublicProfileImgUrl } from "@/lib/minio";
import { eq } from "drizzle-orm";

type parmaTypes = {
  profileDetail: editProfileSchemaType;
  logo: FormData;
};

const handler = async (user: User, params: parmaTypes) => {
  const { profileDetail, logo } = params;

  const logoUrl: { image?: string } = {};

  const image = logo.get("image") as File;

  if (image) {
    const uploadedImageUrl = await createPublicProfileImgUrl(user.id, image);

    logoUrl.image = uploadedImageUrl;
  }

  try {
    await db
      .update(users)
      .set({
        ...profileDetail,
        ...logoUrl,
      })
      .where(eq(users.id, user.id));

    return {
      success: true as true,
      data: "Profile detail updated successfully.",
    };
  } catch (err) {
    return errorHandler(err);
  }
};

export const updateProfileDetail: (
  params: parmaTypes
) => Promise<Awaited<ReturnType<typeof handler>>> = validateToken(handler);
