"use server";

import { User } from "lucia";
import { events } from "@/db/schema";
import { db } from "@/lib/db";
import { validateToken } from "@/actions/_utils/validateToken";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { and, asc, eq } from "drizzle-orm";

const handler = async (user: User) => {
  try {
    const eventsList = await db.query.events.findMany({
      where: and(eq(events.deleted, false), eq(events.user_id, user.id)),
      orderBy: [asc(events.updated_at)],
    });

    return {
      success: true as true,
      data: eventsList,
    };
  } catch (err) {
    return errorHandler(err);
  }
};

export const getEvents: () => Promise<Awaited<ReturnType<typeof handler>>> =
  validateToken(handler);
