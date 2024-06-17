"use server";

import { User } from "lucia";
import { events } from "@/db/schema";
import { db } from "@/lib/db";
import { validateToken } from "@/actions/_utils/validateToken";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { and, eq } from "drizzle-orm";
import { errorType } from "@/actions/_utils/types.type";

const handler = async (user: User, eventId: string) => {
  try {
    const eventDetail = await db.query.events.findFirst({
      where: and(eq(events.deleted, false), eq(events.id, eventId)),
    });

    if (!eventDetail) {
      return { success: false, error: "Event not found" } as errorType;
    }
    return {
      success: true as true,
      data: eventDetail,
    };
  } catch (err) {
    return errorHandler(err);
  }
};

export const getEventDetails: (
  eventId: string
) => Promise<Awaited<ReturnType<typeof handler>>> = validateToken(handler);
