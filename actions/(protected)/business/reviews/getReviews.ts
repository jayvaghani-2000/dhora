"use server";

import { ratings } from "@/db/schema";
import { db } from "@/lib/db";
import { desc, eq } from "drizzle-orm";
import { validateToken } from "@/actions/_utils/validateToken";
import { User } from "lucia";
import { errorHandler } from "@/actions/_utils/errorHandler";

const handler = async (user: User, eventId: string) => {
  try {
    const data = await db.query.ratings.findMany({
      where: eq(ratings.event_id, eventId!),
      orderBy: [desc(ratings.created_at)],
      with: {
        customer: {
          columns: {
            name: true,
            image: true,
          },
        },
      },
    });

    return { success: true as true, data: data };
  } catch (err) {
    return { data: [], ...errorHandler(err) };
  }
};

export const getReviews: (
  eventId?: string
) => Promise<Awaited<ReturnType<typeof handler>>> = validateToken(handler);
