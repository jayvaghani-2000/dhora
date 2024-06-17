"use server";

import { User } from "lucia";
import { validateToken } from "@/actions/_utils/validateToken";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { db } from "@/lib/db";
import dayjs from "@/lib/dayjs";
import { and, eq, or } from "drizzle-orm";
import { bookings, bookingTypes, users } from "@/db/schema";
import { dateWithoutTime } from "@/lib/common";
import { timeSlotsUtc } from "@/lib/schedule";
import { createAvailabilitySchemaType } from "@/actions/_utils/types.type";

type parmaTypes = {
  timezone: string;
  bookingTypeId: string;
  date: Date;
  businessId: string;
};

const handler = async (user: User, params: parmaTypes) => {
  const { timezone, bookingTypeId, date, businessId } = params;

  const getBusinessUser = await db.query.users.findFirst({
    where: eq(users.business_id, businessId),
  });

  if (!getBusinessUser) {
    throw new Error("Error fetching available slots");
  }
  const usersBookings = await db.query.bookings.findMany({
    where: or(
      eq(bookings.customer_id, user.id),
      eq(bookings.business_id, user.business_id ?? businessId),
      eq(bookings.business_id, businessId),
      eq(bookings.customer_id, getBusinessUser.id)
    ),
  });

  const bookingType = await db.query.bookingTypes.findFirst({
    where: and(
      eq(bookingTypes.deleted, false),
      eq(bookingTypes.id, bookingTypeId)
    ),
    with: {
      availability: true,
    },
  });

  const bookingTypeDetail = bookingType!;

  const availability = bookingTypeDetail.availability
    .availability as createAvailabilitySchemaType["availability"];

  const duration = bookingTypeDetail.duration;
  const yyyymmdd = dateWithoutTime(date);

  const range = getTheBookingAvailabilitySlot(
    yyyymmdd,
    timezone,
    availability,
    bookingTypeDetail.availability.timezone!
  );

  const daysTimeSlot = timeSlotsUtc(duration, range, yyyymmdd, timezone);

  const availableDaySlots = isFallInGivenTimeSlot(
    availability,
    daysTimeSlot,
    bookingTypeDetail.availability.timezone!
  );

  const filteredAvailableSlots = filterOutOccupiedSlots(
    availableDaySlots,
    usersBookings.map(i => ({ end_time: i.end!, start_time: i.time! })),
    duration
  );

  try {
    return {
      success: true,
      data: filteredAvailableSlots,
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

const filterOutOccupiedSlots = (
  slots: string[],
  bookings: { start_time: string; end_time: string }[],
  duration: number
) => {
  return slots.filter(slot => {
    const slotStart = dayjs.utc(slot);
    const slotEnd = slotStart.add(duration, "minutes");

    return !bookings.some(period => {
      const startTime = dayjs.utc(period.start_time);
      const endTime = dayjs.utc(period.end_time);

      return (
        ((slotStart.isSame(startTime) || slotStart.isAfter(startTime)) &&
          slotStart.isBefore(endTime)) ||
        ((slotEnd.isSame(startTime) || slotEnd.isAfter(startTime)) &&
          slotEnd.isBefore(endTime))
      );
    });
  });
};

const getTheBookingAvailabilitySlot = (
  date: string,
  timezone: string,
  availability: createAvailabilitySchemaType["availability"],
  bookingTimezone: string
) => {
  const dayStart = dayjs.tz(date, timezone).startOf("day");
  const dayEnd = dayjs.tz(date, timezone).endOf("day");

  const dateStartBookingTimezone = dayStart.tz(bookingTimezone).day();
  const dateEndBookingTimezone = dayEnd.tz(bookingTimezone).day();

  const dayAvailability = availability[dateStartBookingTimezone];

  const startOfDay = dayStart.tz(bookingTimezone).format("YYYY-MM-DD");

  let timeSlots = dayAvailability.map(i => {
    const startTime = dayjs(`${startOfDay} ${i.start_time}`).tz(
      bookingTimezone
    );
    const endTime = dayjs(`${startOfDay} ${i.end_time}`).tz(bookingTimezone);
    return {
      start_time: startTime.utc().format(),
      end_time: endTime.utc().format(),
    };
  });

  if (dateStartBookingTimezone !== dateEndBookingTimezone) {
    const nextDayAvailability = availability[dateEndBookingTimezone];
    const nextDayStart = dayStart
      .add(1, "day")
      .tz(bookingTimezone)
      .format("YYYY-MM-DD");
    nextDayAvailability.forEach(i => {
      const startTime = dayjs(`${nextDayStart} ${i.start_time}`).tz(
        bookingTimezone
      );

      const endTime = dayjs(`${nextDayStart} ${i.end_time}`).tz(
        bookingTimezone
      );

      timeSlots.push({
        start_time: startTime.utc().format(),
        end_time: endTime.utc().format(),
      });
    });
  }

  return timeSlots;
};
