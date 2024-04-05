"use server";

import { User } from "lucia";
import {
  availability,
  businesses,
  createAvailabilitySchema,
  users,
} from "@/db/schema";
import { db, getBigIntId } from "@/lib/db";
import { validateToken } from "@/actions/_utils/validateToken";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { settingsBusinessDetailSchemaType } from "@/lib/schema";
import { createPublicBusinessImgUrl } from "@/lib/minio";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { trimRichEditor } from "@/lib/common";

type parmaTypes = {
  businessDetail: settingsBusinessDetailSchemaType;
  logo: FormData;
  availability: z.infer<typeof createAvailabilitySchema>;
};

const handler = async (user: User, params: parmaTypes) => {
  const { businessDetail, logo, availability: newAvailability } = params;

  const id = (await getBigIntId)[0].id_generator as bigint;

  const logoUrl: { logo?: string } = {};

  const image = logo.get("image") as File;

  if (image) {
    const uploadedImageUrl = await createPublicBusinessImgUrl(
      id,
      BigInt(user.id),
      image
    );

    logoUrl.logo = uploadedImageUrl;
  }

  try {
    const { email,description,  ...rest } = businessDetail;
    await db.insert(businesses).values({
      ...rest,
      description: trimRichEditor(description),
      id: id,
      user_id: user.id,
      ...logoUrl,
    });

    await Promise.all([
      await db.insert(availability).values({
        business_id: id,
        ...newAvailability,
      }),
      await db
        .update(users)
        .set({
          business_id: id,
          updated_at: new Date(),
        })
        .where(eq(users.id, user.id)),
    ]);

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
