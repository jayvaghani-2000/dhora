"use server";

import { availability, bookingTypes } from "@/db/schema";
import { db } from "@/lib/db";
import { and, eq, ne } from "drizzle-orm";
import { validateBusinessToken } from "@/actions/_utils/validateToken";
import { User } from "lucia";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { stringifyBigint } from "@/actions/_utils/stringifyBigint";
import { errorType } from "@/actions/_utils/types.type";
import { z } from "zod";
import { revalidate } from "@/actions/(public)/revalidate";
import { redirect } from "next/navigation";
import { editBookingTypeSchema } from "@/lib/schema";

type paramsType = {
  bookingTypeId: string;
  values: z.infer<typeof editBookingTypeSchema>;
};

const handler = async (user: User, params: paramsType) => {
  const { bookingTypeId, values } = params;

  const { availability_id, ...rest } = values;

  try {
    const data = await db
      .update(bookingTypes)
      .set({
        ...rest,
        availability_id: BigInt(availability_id),
        updated_at: new Date(),
      })
      .where(
        and(
          eq(bookingTypes.business_id, user.business_id!),
          eq(bookingTypes.id, BigInt(bookingTypeId)),
          ne(bookingTypes.deleted, true)
        )
      );

    if (!data) {
      return {
        success: false,
        error: "Booking type not found",
      } as errorType;
    }

    return {
      success: true as true,
      data: stringifyBigint(data),
    };
  } catch (err) {
    return errorHandler(err);
  }
};

const updateBookingTypeDetailHandler = async (
  user: User,
  params: paramsType
) => {
  const res = await handler(user, params);

  if (res.success) {
    await revalidate("/business/booking-types");
    redirect("/business/booking-types");
  }
  return res;
};

export const updateBookingType: (
  params: paramsType
) => Promise<Awaited<ReturnType<typeof updateBookingTypeDetailHandler>>> =
  validateBusinessToken(updateBookingTypeDetailHandler);
