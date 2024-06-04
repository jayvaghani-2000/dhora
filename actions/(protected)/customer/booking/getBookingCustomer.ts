"use server";
import { bookings, events, users } from "@/db/schema";
import { db } from "@/lib/db";
import { eq, or } from "drizzle-orm";
import { validateToken } from "@/actions/_utils/validateToken";
import { User } from "lucia";
import { errorHandler } from "@/actions/_utils/errorHandler";

const handler = async (user: User, bookingId: string) => {
  try {
    const booking = await db.query.bookings.findFirst({
      where: or(eq(bookings.id, bookingId)),
      with: {
        customer: true,
        event: { columns: {id:true, title: true } },
      },
    });
    return {
      success: true as true,
      data: {
        customer: booking?.customer,
        event: booking?.event,
      },
    };
  } catch (err) {
    return errorHandler(err);
  }
};

export const getBookingCustomer: (bookingId: string) => Promise<Awaited<ReturnType<typeof handler>>> =
  validateToken(handler);
