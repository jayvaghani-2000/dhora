"use server";

import { User } from "lucia";
import { subEvents } from "@/db/schema";
import { db } from "@/lib/db";
import { validateToken } from "@/actions/_utils/validateToken";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { and, eq } from "drizzle-orm";
import { stringifyBigint } from "@/actions/_utils/stringifyBigint";

const handler = async (user: User, eventId: string) => {
  try {
    const eventsList = await db.query.subEvents.findMany({
      where: and(eq(subEvents.event_id, eventId), eq(subEvents.deleted, false)),
    });

    return {
      success: true as true,
      data: stringifyBigint(eventsList),
    };
  } catch (err) {
    return errorHandler(err);
  }
};

export const getSubEvents: (
  eventId: string
) => Promise<Awaited<ReturnType<typeof handler>>> = validateToken(handler);
