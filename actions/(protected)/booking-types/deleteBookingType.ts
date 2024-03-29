"use server";

import { bookingTypes } from "@/db/schema";
import { db } from "@/lib/db";
import { and, eq } from "drizzle-orm";
import { validateBusinessToken } from "@/actions/_utils/validateToken";
import { User } from "lucia";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { revalidate } from "@/actions/(public)/revalidate";
import { redirect } from "next/navigation";

const handler = async (user: User, bookingTypeId: string) => {
  try {
    await db
      .update(bookingTypes)
      .set({
        deleted: true,
        updated_at: new Date(),
      })
      .where(
        and(
          eq(bookingTypes.id, BigInt(bookingTypeId)),
          eq(bookingTypes.business_id, user.business_id!)
        )
      );

    return {
      success: true as true,
      data: "Booking type deleted successfully!",
    };
  } catch (err) {
    return errorHandler(err);
  }
};

const deleteBookingTypeHandler = async (user: User, bookingTypeId: string) => {
  const res = await handler(user, bookingTypeId);

  if (res.success) {
    await revalidate("/business/booking-types");
    redirect("/business/booking-types");
  }
  return res;
};

export const deleteBookingType: (
  bookingTypeId: string
) => Promise<Awaited<ReturnType<typeof deleteBookingTypeHandler>>> =
  validateBusinessToken(deleteBookingTypeHandler);
