"use server";

import { validateBusinessToken } from "@/actions/_utils/validateToken";
import { User } from "lucia";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { createPublicBusinessImgUrl } from "../../../lib/minio";

const handler = async (user: User, file: FormData) => {
  try {
    const image = file.get("image") as File;
    const uploadedImageUrl = await createPublicBusinessImgUrl(
      user.business_id as bigint,
      image
    );

    return { success: true as true, data: { url: uploadedImageUrl } };
  } catch (err) {
    return errorHandler(err);
  }
};

export const uploadBusinessLogo: (
  file: FormData
) => Promise<Awaited<ReturnType<typeof handler>>> =
  validateBusinessToken(handler);
