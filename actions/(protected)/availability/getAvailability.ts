"use server";

import { availability } from "@/db/schema";
import { db } from "@/lib/db";
import { and, eq, ne } from "drizzle-orm";
import { validateBusinessToken } from "@/actions/_utils/validateToken";
import { User } from "lucia";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { stringifyBigint } from "@/actions/_utils/stringifyBigint";

const handler = async (user: User) => {
  try {
    const data = await db.query.availability.findMany({
      where: and(
        eq(availability.business_id, user.business_id!),
        ne(availability.deleted, true)
      ),
    });

    return { success: true as true, data: data.map(i => stringifyBigint(i)) };
  } catch (err) {
    return errorHandler(err);
  }
};

export const getAvailability: () => Promise<
  Awaited<ReturnType<typeof handler>>
> = validateBusinessToken(handler);
