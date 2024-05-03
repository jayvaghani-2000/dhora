"use server";

import { User } from "lucia";
import { validateToken } from "@/actions/_utils/validateToken";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { db } from "@/lib/db";
import dayjs from "@/lib/dayjs";
import { and, eq } from "drizzle-orm";
import { bookingTypes } from "@/db/schema";
import { dateWithoutTime, timeZone } from "@/lib/common";
import { timeSlotsUtc } from "@/lib/schedule";
import {
  createAvailabilitySchemaType,
  errorType,
} from "@/actions/_utils/types.type";

type parmaTypes = {
  timezone: string;
  bookingTypeId: string;
  date: Date;
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

  const availability = bookingTypeDetail.availability
    .availability as createAvailabilitySchemaType["availability"];

  const duration = bookingTypeDetail.duration;
  const yyyymmddUtcStart = dateWithoutTime(date);

  const daysTimeSlot = timeSlotsUtc(duration, yyyymmddUtcStart, timezone).map(
    i => dayjs(i).utc().format()
  );

  // const slotsInBusinessRange = daysTimeSlot.map(i => {
  //   const businessDayIndex = dayjs(i)
  //     .utc()
  //     .tz(bookingTypeDetail.availability.timezone!)
  //     .day();

  //   return i;
  // });

  const availableDaySlots = isFallInGivenTimeSlot(
    availability,
    daysTimeSlot,
    bookingTypeDetail.availability.timezone!
  );

  try {
    return {
      success: true,
      data: daysTimeSlot,
    };
  } catch (err) {
    return errorHandler(err);
  }
};

export const getTimeSlots: (
  params: parmaTypes
) => Promise<Awaited<ReturnType<typeof handler>>> = validateToken(handler);

const isFallInGivenTimeSlot = (
  availability: createAvailabilitySchemaType["availability"],
  daysTimeSlot: string[],
  availabilityTimezone: string
) => {};
