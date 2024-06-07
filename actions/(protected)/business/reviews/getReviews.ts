"use server";

import { ratings } from "@/db/schema";
import { db } from "@/lib/db";
import { desc, eq } from "drizzle-orm";
import { validateToken } from "@/actions/_utils/validateToken";
import { User } from "lucia";
import { errorHandler } from "@/actions/_utils/errorHandler";

const handler = async (user: User) => {
  try {
    const data = await db.query.ratings.findMany({
      where: eq(ratings.event_id, user.business_id!),
      orderBy: [desc(ratings.updated_at)],
    });
    
    return { success: true as true, data: data };
  } catch (err) {
    return errorHandler(err);
  }
};

export const getReviews: () => Promise<Awaited<ReturnType<typeof handler>>> =
  validateToken(handler);
