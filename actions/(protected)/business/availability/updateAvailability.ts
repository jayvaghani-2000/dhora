"use server";

import { availability, createAvailabilitySchema } from "@/db/schema";
import { db } from "@/lib/db";
import { and, asc, eq, ne } from "drizzle-orm";
import { validateBusinessToken } from "@/actions/_utils/validateToken";
import { User } from "lucia";
import { errorHandler } from "@/actions/_utils/errorHandler";
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
      })
      .where(
        and(
          eq(availability.business_id, user.business_id!),
          eq(availability.default, true),
          ne(availability.id, availabilityId)
        )
      );
  } else {
    const [isAlreadyDefault, unDefaultAvailability] = await Promise.all([
      await db.query.availability.findMany({
        where: and(
          eq(availability.business_id, user.business_id!),
          eq(availability.default, true),
          ne(availability.deleted, true)
        ),
        orderBy: [asc(availability.created_at)],
        limit: 1,
      }),
      await db.query.availability.findMany({
        where: and(
          eq(availability.business_id, user.business_id!),
          eq(availability.default, false),
          ne(availability.deleted, true),
          ne(availability.id, availabilityId)
        ),
        orderBy: [asc(availability.created_at)],
        limit: 1,
      }),
    ]);

    if (
      isAlreadyDefault.length &&
      unDefaultAvailability &&
      unDefaultAvailability.length > 0
    ) {
      await db
        .update(availability)
        .set({
          default: true,
        })
        .where(
          and(
            eq(availability.business_id, user.business_id!),
            eq(availability.id, unDefaultAvailability[0].id)
          )
        );
    } else {
      return {
        success: false,
        error: "Availability needs to be default as is only one availability.",
      };
    }
  }

  try {
    const data = await db
      .update(availability)
      .set({
        ...values,
      })
      .where(
        and(
          eq(availability.business_id, user.business_id!),
          eq(availability.id, availabilityId),
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
      data: data,
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
