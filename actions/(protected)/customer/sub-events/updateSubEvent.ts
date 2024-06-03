"use server";

import { z } from "zod";
import { User } from "lucia";
import { subEvents, updateSubEventSchema } from "@/db/schema";
import { db } from "@/lib/db";
import { validateBusinessToken } from "@/actions/_utils/validateToken";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { and, eq } from "drizzle-orm";
import { revalidate } from "@/actions/(public)/revalidate";
import { dateWithoutTime, trimRichEditor } from "@/lib/common";

type parmaTypes = {
  eventDetail: z.infer<typeof updateSubEventSchema>;
  subEventId: string;
};

const handler = async (user: User, params: parmaTypes) => {
  const { eventDetail, subEventId } = params;
  const { description, event_date, ...rest } = eventDetail;
  try {
    const subEventsDetail = await db
      .update(subEvents)
      .set({
        description: trimRichEditor(description),
        event_date: dateWithoutTime(event_date),
        ...rest,
      })
      .where(and(eq(subEvents.id, subEventId), eq(subEvents.deleted, false)))
      .returning();
    return { success: true as true, data: subEventsDetail[0] };
  } catch (err) {
    return errorHandler(err);
  }
};

const updateSubEventHandler = async (user: User, values: parmaTypes) => {
  const res = await handler(user, values);

  if (res.success) {
    await revalidate(`/event/${res.data.event_id}/itinerary`);
  }
  return res;
};

export const updateSubEvent: (
  params: parmaTypes
) => Promise<Awaited<ReturnType<typeof updateSubEventHandler>>> =
  validateBusinessToken(updateSubEventHandler);
