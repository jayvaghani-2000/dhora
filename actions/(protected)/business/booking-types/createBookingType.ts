"use server";

import { z } from "zod";
import { User } from "lucia";
import { availability, bookingTypes } from "@/db/schema";
import { db } from "@/lib/db";
import { validateBusinessToken } from "@/actions/_utils/validateToken";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { stringifyBigint } from "@/actions/_utils/stringifyBigint";
import { and, eq } from "drizzle-orm";
import { createBookingTypeSchema } from "@/lib/schema";
import { revalidate } from "@/actions/(public)/revalidate";
import { redirect } from "next/navigation";

const handler = async (
  user: User,
  values: z.infer<typeof createBookingTypeSchema>
) => {
  const defaultAvailability = await db.query.availability.findFirst({
    where: and(
      eq(availability.business_id, user.business_id!),
      eq(availability.default, true)
    ),
  });
  try {
    const data = await db
      .insert(bookingTypes)
      .values({
        business_id: user.business_id!,
        availability_id: defaultAvailability!.id,
        ...values,
      })
      .returning();

    return { success: true as true, data: stringifyBigint(data[0]) };
  } catch (err) {
    return errorHandler(err);
  }
};

const createBookingTypeHandler = async (
  user: User,
  values: z.infer<typeof createBookingTypeSchema>
) => {
  const res = await handler(user, values);

  if (res.success) {
    await revalidate("/business/booking-types");
    redirect(`/business/booking-types/${res.data.id}`);
  }
  return res;
};

export const createBookingType: (
  values: z.infer<typeof createBookingTypeSchema>
) => Promise<Awaited<ReturnType<typeof createBookingTypeHandler>>> =
  validateBusinessToken(createBookingTypeHandler);
