"use server";

import { validateToken } from "@/actions/_utils/validateToken";
import { bookings } from "@/db/schema";
import { db } from "@/lib/db";
import dayjs from "@/lib/dayjs";
import { eq, or } from "drizzle-orm";
import { User } from "lucia";
import { errorHandler } from "@/actions/_utils/errorHandler";

const getBooking = async (user: User) => {
  if (user.business_id) {
    return await db.query.bookings.findMany({
      where: or(
        eq(bookings.customer_id, user.id),
        eq(bookings.business_id, user.business_id)
      ),
      with: {
        business: true,
        event: true,
      },
    });
  }
  return await db.query.bookings.findMany({
    where: eq(bookings.customer_id, user.id),
    with: {
      business: true,
      event: true,
    },
  });
};

const handler = async (user: User) => {
  try {
    const allBookings = await getBooking(user);

    const pastBookings = allBookings.filter(booking => {
      const nowUtc = dayjs.utc();
      const endsAt = dayjs.utc(booking.end);
      return endsAt.isBefore(nowUtc);
    });
    const upcomingBookings = allBookings.filter(booking => {
      const nowUtc = dayjs.utc();
      const endsAt = dayjs.utc(booking.end);
      return endsAt.isAfter(nowUtc);
    });

    return {
      success: true as true,
      data: {
        pastBookings: pastBookings,
        upcomingBookings: upcomingBookings,
      },
    };
  } catch (err) {
    return {
      ...errorHandler(err),
      data: {} as {
        pastBookings: Awaited<ReturnType<typeof getBooking>>;
        upcomingBookings: Awaited<ReturnType<typeof getBooking>>;
      },
    };
  }
};

export const getBookings: () => Promise<Awaited<ReturnType<typeof handler>>> =
  validateToken(handler);
