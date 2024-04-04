"use server";

import { bookingTypes } from "@/db/schema";
import { db } from "@/lib/db";
import { and, eq, ne } from "drizzle-orm";
import { validateBusinessToken } from "@/actions/_utils/validateToken";
import { User } from "lucia";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { stringifyBigint } from "@/actions/_utils/stringifyBigint";
import { errorType } from "@/actions/_utils/types.type";

const handler = async (user: User, bookingTypeId: string) => {
  try {
    const data = await db.query.bookingTypes.findFirst({
      where: and(
        eq(bookingTypes.business_id, user.business_id!),
        eq(bookingTypes.id, BigInt(bookingTypeId)),
        ne(bookingTypes.deleted, true)
      ),
    });

    if (!data) {
      return {
        success: false,
        error: "Booking type not found",
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

export const getBookingTypeDetails: (
  bookingTypeId: string
) => Promise<Awaited<ReturnType<typeof handler>>> =
  validateBusinessToken(handler);
