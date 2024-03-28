"use server";

import { availability } from "@/db/schema";
import { db } from "@/lib/db";
import { and, asc, eq, ne } from "drizzle-orm";
import { validateBusinessToken } from "@/actions/_utils/validateToken";
import { User } from "lucia";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { revalidate } from "@/actions/(public)/revalidate";
import { redirect } from "next/navigation";
import { errorType } from "@/actions/_utils/types.type";

const handler = async (user: User, availabilityId: string) => {
  try {
    const [currentAvailability, firstAvailability] = await Promise.all([
      await db.query.availability.findFirst({
        where: eq(availability.id, BigInt(availabilityId)),
      }),
      await db.query.availability.findMany({
        where: eq(availability.deleted, false),
        orderBy: [asc(availability.created_at)],
        limit: 2,
      }),
    ]);

    if (firstAvailability.length === 1) {
      return {
        success: false,
        error: "You are required to have atleast one availability",
      } as errorType;
    }

    if (currentAvailability?.default && firstAvailability[0]?.id) {
      await db
        .update(availability)
        .set({
          default: true,
          updated_at: new Date(),
        })
        .where(and(eq(availability.id, firstAvailability[0].id)));
    }

    await db
      .update(availability)
      .set({
        deleted: true,
        default: false,
        updated_at: new Date(),
      })
      .where(
        and(
          eq(availability.business_id, user.business_id!),
          eq(availability.id, BigInt(availabilityId))
        )
      );

    return {
      success: true as true,
      data: "Availability deleted successfully!",
    };
  } catch (err) {
    return errorHandler(err);
  }
};

const deleteAvailabilityHandler = async (
  user: User,
  availabilityId: string
) => {
  const res = await handler(user, availabilityId);

  if (res.success) {
    await revalidate("/business/availability");
    redirect("/business/availability");
  }
  return res;
};

export const deleteAvailability: (
  availabilityId: string
) => Promise<Awaited<ReturnType<typeof deleteAvailabilityHandler>>> =
  validateBusinessToken(deleteAvailabilityHandler);
