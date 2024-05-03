"use server";
import { User } from "lucia";
import { bookings } from "@/db/schema";
import { db } from "@/lib/db";
import dayjs from "@/lib/dayjs";
import { validateToken } from "@/actions/_utils/validateToken";
import { errorHandler } from "@/actions/_utils/errorHandler";

type parmaTypes = {
  businessId: string;
  time: string;
  duration: number;
};

const handler = async (user: User, params: parmaTypes) => {
  const { businessId, time, duration } = params;

  try {
    await db
      .insert(bookings)
      .values({
        business_id: BigInt(businessId),
        time: time,
        duration: duration,
        end: dayjs(time).utc().add(duration, "minutes").utc().format(),
        customer_id: user.id,
      })
      .returning();

    return {
      success: true as true,
      data: "Booking created successfully.",
    };
  } catch (err) {
    return errorHandler(err);
  }
};

export const createBooking: (
  params: parmaTypes
) => Promise<Awaited<ReturnType<typeof handler>>> = validateToken(handler);
