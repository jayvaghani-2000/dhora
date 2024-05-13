"use server";

import { User } from "lucia";
import { subEvents } from "@/db/schema";
import { db } from "@/lib/db";
import { validateBusinessToken } from "@/actions/_utils/validateToken";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { and, eq } from "drizzle-orm";
import { revalidate } from "@/actions/(public)/revalidate";

import { stringifyBigint } from "@/actions/_utils/stringifyBigint";

type parmaTypes = {
  subEventId: string;
};

const handler = async (user: User, params: parmaTypes) => {
  const { subEventId } = params;

  try {
    const subEventsDetail = await db
      .update(subEvents)
      .set({
        deleted: true,
      })
      .where(and(eq(subEvents.id, subEventId), eq(subEvents.deleted, false)))
      .returning();

    return { success: true as true, data: stringifyBigint(subEventsDetail[0]) };
  } catch (err) {
    return errorHandler(err);
  }
};

const deleteSubEventHandler = async (user: User, values: parmaTypes) => {
  const res = await handler(user, values);

  if (res.success) {
    await revalidate(`/event/${res.data.event_id}/itinerary`);
  }
  return res;
};

export const deleteSubEvent: (
  params: parmaTypes
) => Promise<Awaited<ReturnType<typeof deleteSubEventHandler>>> =
  validateBusinessToken(deleteSubEventHandler);
