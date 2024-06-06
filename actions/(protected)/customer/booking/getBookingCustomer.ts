"use server";
import { bookings, events, users } from "@/db/schema";
import { db } from "@/lib/db";
import { eq, or } from "drizzle-orm";
import { validateToken } from "@/actions/_utils/validateToken";
import { User } from "lucia";
import { errorHandler } from "@/actions/_utils/errorHandler";

const handler = async (user: User) => {
  try {
    const data = await db.query.bookings.findMany({
      where: eq(bookings.business_id, user.business_id!),
      with: {
        event: {
          columns: {
            title: true,
            id: true
          },

        },
        customer: true
      }
    });
  
    return {
      success: true as true,
      data:data,
    };
  } catch (err) {
    return errorHandler(err);
  }
};

export const getBookingCustomer: () => Promise<Awaited<ReturnType<typeof handler>>> =
  validateToken(handler);
