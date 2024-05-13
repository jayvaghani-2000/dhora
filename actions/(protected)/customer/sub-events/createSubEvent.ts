"use server";

import { User } from "lucia";
import { createSubEventSchema, subEvents } from "@/db/schema";
import { db } from "@/lib/db";
import { validateToken } from "@/actions/_utils/validateToken";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { dateWithoutTime, trimRichEditor } from "@/lib/common";
import { z } from "zod";
import { revalidate } from "@/actions/(public)/revalidate";

type parmaTypes = {
  eventDetail: z.infer<typeof createSubEventSchema>;
  eventId: string;
};

const handler = async (user: User, params: parmaTypes) => {
  const { eventDetail, eventId } = params;

  const { description, event_date, ...rest } = eventDetail;

  try {
    await db
      .insert(subEvents)
      .values({
        description: trimRichEditor(description),
        event_date: dateWithoutTime(event_date),
        event_id: eventId,
        ...rest,
      })
      .returning();

    return {
      success: true as true,
      data: "Event created successfully.",
    };
  } catch (err) {
    console.log("err", err);
    return errorHandler(err);
  }
};

const createSubEventHandler = async (user: User, values: parmaTypes) => {
  const res = await handler(user, values);

  if (res.success) {
    await revalidate(`/event/${values.eventId}/itinerary`);
  }
  return res;
};

export const createSubEvent: (
  params: parmaTypes
) => Promise<Awaited<ReturnType<typeof createSubEventHandler>>> = validateToken(
  createSubEventHandler
);
