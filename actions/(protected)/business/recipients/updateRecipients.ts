"use server";

import { z } from "zod";
import { User } from "lucia";
import { recipients, updateRecipientSchema } from "@/db/schema";
import { db } from "@/lib/db";
import { validateBusinessToken } from "@/actions/_utils/validateToken";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { and, eq } from "drizzle-orm";

const handler = async (
  user: User,
  values: z.infer<typeof updateRecipientSchema>
) => {
  try {
    const recipient = await db
      .update(recipients)
      .set({
        name: values.name,
        email: values.email,
        role: values.role,
        id: values.id,
      })
      .where(and(eq(recipients.id, values.id)))
      .returning();
    return { success: true as true, data: recipient[0] };
  } catch (err) {
    return errorHandler(err);
  }
};

export const updateRecipient: (
  values: z.infer<typeof updateRecipientSchema>
) => Promise<Awaited<ReturnType<typeof handler>>> =
  validateBusinessToken(handler);
