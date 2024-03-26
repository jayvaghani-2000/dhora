"use server";

import { availability } from "@/db/schema";
import { db } from "@/lib/db";
import { and, eq, ne } from "drizzle-orm";
import { validateBusinessToken } from "@/actions/_utils/validateToken";
import { User } from "lucia";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { stringifyBigint } from "@/actions/_utils/stringifyBigint";
import { errorType } from "@/actions/_utils/types.type";

const handler = async (user: User, availabilityId: string) => {
  try {
    const data = await db.query.availability.findFirst({
      where: and(
        eq(availability.business_id, user.business_id!),
        eq(availability.id, BigInt(availabilityId)),
        ne(availability.deleted, true)
      ),
    });

    if (!data) {
      return {
        success: false,
        error: "Availability not found",
      } as errorType;
    }
    return {
      success: true as true,
      data: stringifyBigint(data),
    };
  } catch (err) {
    return errorHandler(err);
  }
};

export const getAvailabilityDetail: (
  availabilityId: string
) => Promise<Awaited<ReturnType<typeof handler>>> =
  validateBusinessToken(handler);
