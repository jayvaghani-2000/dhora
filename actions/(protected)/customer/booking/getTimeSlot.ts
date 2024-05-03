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

  const availableDaySlots = isFallInGivenTimeSlot(
    availability,
    daysTimeSlot,
    bookingTypeDetail.availability.timezone!
  );

  try {
    return {
      success: true,
      data: availableDaySlots,
    };
  } catch (err) {
    return errorHandler(err);
  }
};

export const getTimeSlots: (
  params: parmaTypes
) => Promise<Awaited<ReturnType<typeof handler>>> = validateToken(handler);

const isFallInGivenTimeSlot = (
  weeklyAvailability: createAvailabilitySchemaType["availability"],
  slots: string[],
  timezone: string
) => {
  return slots.filter(slot => {
    const localTime = dayjs.tz(slot, timezone);
    const dayOfWeek = localTime.day();

    const dailyAvailability = weeklyAvailability[dayOfWeek];
    if (dailyAvailability.length === 0) {
      return false;
    }

    return dailyAvailability.some(period => {
      const startOfDay = localTime.startOf("day").format("YYYY-MM-DD");
      const startTime = dayjs.tz(
        `${startOfDay} ${period.start_time}`,
        timezone
      );
      const endTime = dayjs.tz(`${startOfDay} ${period.end_time}`, timezone);
      return (
        (localTime.isSame(startTime) || localTime.isAfter(startTime)) &&
        localTime.isBefore(endTime)
      );
    });
  });
};
