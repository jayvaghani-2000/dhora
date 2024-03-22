"use server";

import { availability } from "@/db/schema";
import { db } from "@/lib/db";
import { and, eq } from "drizzle-orm";
import { validateBusinessToken } from "@/actions/_utils/validateToken";
import { User } from "lucia";
import { errorHandler } from "@/actions/_utils/errorHandler";

const handler = async (user: User, availabilityId: string) => {
  try {
    await db
      .update(availability)
      .set({
        deleted: true,
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

export const deleteAvailability: (
  availabilityId: string
) => Promise<Awaited<ReturnType<typeof handler>>> =
  validateBusinessToken(handler);
