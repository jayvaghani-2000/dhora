"use server";

import { availability, createAvailabilitySchema } from "@/db/schema";
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

type paramsType = {
  availabilityId: string;
  values: Partial<z.infer<typeof createAvailabilitySchema>>;
};

const handler = async (user: User, params: paramsType) => {
  const { availabilityId, values } = params;

  if (values.default) {
    await db
      .update(availability)
      .set({
        default: false,
        updated_at: new Date(),
      })
      .where(
        and(
          eq(availability.business_id, user.business_id!),
          eq(availability.default, true)
        )
      );
  }

  try {
    const data = await db
      .update(availability)
      .set({
        ...values,
        updated_at: new Date(),
      })
      .where(
        and(
          eq(availability.business_id, user.business_id!),
          eq(availability.id, BigInt(availabilityId)),
          ne(availability.deleted, true)
        )
      );

    if (!data) {
      return {
        success: false,
        error: "Availability not found",
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

const updateAvailabilityDetailHandler = async (
  user: User,
  params: paramsType
) => {
  const res = await handler(user, params);

  if (res.success) {
    await revalidate("/business/availability");
    redirect("/business/availability");
  }
  return res;
};

export const updateAvailability: (
  params: paramsType
) => Promise<Awaited<ReturnType<typeof updateAvailabilityDetailHandler>>> =
  validateBusinessToken(updateAvailabilityDetailHandler);
