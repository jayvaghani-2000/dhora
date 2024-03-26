"use server";

import { availability } from "@/db/schema";
import { db } from "@/lib/db";
import { and, desc, eq, ne } from "drizzle-orm";
import { validateBusinessToken } from "@/actions/_utils/validateToken";
import { User } from "lucia";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { revalidate } from "@/actions/(public)/revalidate";

const handler = async (user: User, availabilityId: string) => {
  try {
    const [currentAvailability, firstAvailability] = await Promise.all([
      await db.query.availability.findFirst({
        where: eq(availability.id, BigInt(availabilityId)),
      }),
      await db.query.availability.findFirst({
        where: ne(availability.deleted, true),
        orderBy: [desc(availability.created_at)],
      }),
    ]);

    if (currentAvailability?.default && firstAvailability?.id) {
      await db
        .update(availability)
        .set({
          default: true,
          updated_at: new Date(),
        })
        .where(and(eq(availability.id, firstAvailability.id)));
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

    await revalidate("/business/availability");

    return {
      success: true as true,
      data: "Availability deleted successfully!",
    };
  } catch (err) {
    return errorHandler(err);
  }
};

export const deleteAvailability: (
  availabilityId: string
) => Promise<Awaited<ReturnType<typeof handler>>> =
  validateBusinessToken(handler);
