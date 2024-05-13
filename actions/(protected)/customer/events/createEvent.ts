"use server";

import { User } from "lucia";
import { events } from "@/db/schema";
import { db } from "@/lib/db";
import { validateToken } from "@/actions/_utils/validateToken";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { createEventSchemaType } from "@/lib/schema";
import { createPublicEventImgUrl } from "@/lib/minio";
import { dateWithoutTime, trimRichEditor } from "@/lib/common";

type parmaTypes = {
  eventDetail: createEventSchemaType;
  logo: FormData;
};

const handler = async (user: User, params: parmaTypes) => {
  const { eventDetail, logo } = params;

  const { date, single_day_event, description, ...rest } = eventDetail;
  const { from, to } = date;

  const logoUrl: { logo?: string } = {};

  const image = logo.get("image") as File;

  if (image) {
    const uploadedImageUrl = await createPublicEventImgUrl(user.id, image);

    logoUrl.logo = uploadedImageUrl;
  }

  try {
    await db
      .insert(events)
      .values({
        to_date: single_day_event ? null : dateWithoutTime(to!),
        from_date: dateWithoutTime(from),
        user_id: user.id,
        single_day_event: single_day_event,
        description: trimRichEditor(description),
        ...rest,
        ...logoUrl,
      })
      .returning();

    return {
      success: true as true,
      data: "Event created successfully.",
    };
  } catch (err) {
    return errorHandler(err);
  }
};

export const createEvent: (
  params: parmaTypes
) => Promise<Awaited<ReturnType<typeof handler>>> = validateToken(handler);
