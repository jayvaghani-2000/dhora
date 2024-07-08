"use server";
import { bookings, events, users } from "@/db/schema";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { validateToken } from "@/actions/_utils/validateToken";
import { User } from "lucia";
import { errorHandler } from "@/actions/_utils/errorHandler";

const handler = async (user: User) => {
  try {
    const data = await db
      .select({
        id: bookings.id,
        event: {
          id: events.id,
          title: events.title,
        },
        customer: {
          email: users.email,
          name: users.name,
        },
      })
      .from(bookings)
      .leftJoin(users, eq(bookings.customer_id, users.id))
      .rightJoin(events, eq(bookings.event_id, events.id))
      .where(eq(bookings.business_id, user.business_id!));

    console.log(data);

    return {
      success: true as true,
      data: data,
    };
  } catch (err) {
    return { ...errorHandler(err) };
  }
};

export const getBookingCustomer: () => Promise<
  Awaited<ReturnType<typeof handler>>
> = validateToken(handler);
