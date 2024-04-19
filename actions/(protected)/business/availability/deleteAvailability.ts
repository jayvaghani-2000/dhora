"use server";

import { availability, bookingTypes } from "@/db/schema";
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
        where: and(
          eq(availability.id, BigInt(availabilityId)),
          eq(availability.business_id, user.business_id!)
        ),
      }),
      await db.query.availability.findMany({
        where: and(
          eq(availability.business_id, user.business_id!),
          ne(availability.deleted, true),
          ne(availability.id, BigInt(availabilityId))
        ),
        orderBy: [asc(availability.created_at)],
        limit: 1,
      }),
    ]);

    if (firstAvailability.length === 0) {
      return {
        success: false,
        error: "You are required to have atleast one availability",
      } as errorType;
    }

    if (currentAvailability?.default && firstAvailability[0]?.id) {
      await Promise.all([
        await db
          .update(availability)
          .set({
            default: true,
          })
          .where(and(eq(availability.id, firstAvailability[0].id))),
        await db
          .update(bookingTypes)
          .set({
            availability_id: firstAvailability[0].id,
          })
          .where(and(eq(bookingTypes.availability_id, BigInt(availabilityId)))),
      ]);
    }

    await db
      .update(availability)
      .set({
        deleted: true,
        default: false,
      })
      .where(
        and(
          eq(availability.id, BigInt(availabilityId)),
          eq(availability.business_id, user.business_id!)
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
