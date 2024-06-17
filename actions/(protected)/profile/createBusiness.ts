"use server";

import { User } from "lucia";
import { businesses, users } from "@/db/schema";
import { db, getBigIntId } from "@/lib/db";
import { validateToken } from "@/actions/_utils/validateToken";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { settingsBusinessDetailSchemaType } from "@/lib/schema";
import { createPublicBusinessImgUrl } from "@/lib/minio";
import { eq } from "drizzle-orm";
import { trimRichEditor } from "@/lib/common";

type parmaTypes = {
  businessDetail: settingsBusinessDetailSchemaType;
  logo: FormData;
};

const handler = async (user: User, params: parmaTypes) => {
  const { businessDetail, logo } = params;

  const id = String((await getBigIntId)[0].id_generator);

  const logoUrl: { logo?: string } = {};

  const image = logo.get("image") as File;

  if (image) {
    const uploadedImageUrl = await createPublicBusinessImgUrl(
      id,
      user.id,
      image
    );

    logoUrl.logo = uploadedImageUrl;
  }

  try {
    const { email, description, ...rest } = businessDetail;
    await db.insert(businesses).values({
      ...rest,
      description: trimRichEditor(description),
      id: id,
      user_id: user.id,
      ...logoUrl,
    });

    await db
      .update(users)
      .set({
        business_id: id,
      })
      .where(eq(users.id, user.id));

    return {
      success: true as true,
      data: "Business created successfully.",
    };
  } catch (err) {
    return errorHandler(err);
  }
};

export const createBusiness: (
  params: parmaTypes
) => Promise<Awaited<ReturnType<typeof handler>>> = validateToken(handler);
