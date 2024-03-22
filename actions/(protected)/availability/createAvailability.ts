"use server";

import { z } from "zod";
import { User } from "lucia";
import { availability, createAvailabilitySchema } from "@/db/schema";
import { db } from "@/lib/db";
import { validateBusinessToken } from "@/actions/_utils/validateToken";
import { errorHandler } from "@/actions/_utils/errorHandler";

const handler = async (
  user: User,
  values: z.infer<typeof createAvailabilitySchema>
) => {
  try {
    const data = await db
      .insert(availability)
      .values({
        business_id: user.business_id!,
        ...values,
      })
      .returning();

    return { success: true, data: data };
  } catch (err) {
    return errorHandler(err);
  }
};

export const createAvailability = validateBusinessToken(handler);
