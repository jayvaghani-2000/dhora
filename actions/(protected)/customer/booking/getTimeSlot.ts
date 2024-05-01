"use server";

import { User } from "lucia";
import { validateToken } from "@/actions/_utils/validateToken";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { db } from "@/lib/db";
import { and, eq } from "drizzle-orm";
import { bookingTypes } from "@/db/schema";

type parmaTypes = {
  timezone: string;
  bookingTypeId: string;
  date: string;
};

const handler = async (user: User, params: parmaTypes) => {
  const { timezone, bookingTypeId, date } = params;

  const bookingType = await db.query.bookingTypes.findFirst({
    where: and(
      eq(bookingTypes.deleted, false),
      eq(bookingTypes.id, BigInt(bookingTypeId))
    ),
    with: {
      availability: true,
    },
  });

  const bookingTypeDetail = bookingType!;

  const duration = bookingTypeDetail.duration;

  try {
  } catch (err) {
    return errorHandler(err);
  }
};

export const getTimeSlots: (
  params: parmaTypes
) => Promise<Awaited<ReturnType<typeof handler>>> = validateToken(handler);
