"use server";

import { availability, createAvailabilitySchema } from "@/db/schema";
import { db } from "@/lib/db";
import { and, desc, eq, ne } from "drizzle-orm";
import { validateBusinessToken } from "@/actions/_utils/validateToken";
import { User } from "lucia";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { stringifyBigint } from "@/actions/_utils/stringifyBigint";
import { z } from "zod";

type paramsType = {
  defaultAvailability?: z.infer<typeof createAvailabilitySchema>;
};

const handler = async (user: User, params: paramsType) => {
  const { defaultAvailability } = params;
  try {
    const data = await db.query.availability.findMany({
      where: and(
        eq(availability.business_id, user.business_id!),
        ne(availability.deleted, true)
      ),
      orderBy: [desc(availability.updated_at)],
    });

    if (data.length === 0 && defaultAvailability) {
      const data = await db
        .insert(availability)
        .values({
          business_id: user.business_id!,
          ...defaultAvailability,
        })
        .returning();

      return {
        success: true as true,
        data: data.map(i => stringifyBigint(i)),
      };
    }

    return { success: true as true, data: data.map(i => stringifyBigint(i)) };
  } catch (err) {
    return errorHandler(err);
  }
};

export const getAvailability: (
  params?: paramsType
) => Promise<Awaited<ReturnType<typeof handler>>> =
  validateBusinessToken(handler);
