"use server";

import { z } from "zod";
import { User } from "lucia";
import { recipients, deleteRecipientSchema } from "@/db/schema";
import { db } from "@/lib/db";
import { validateBusinessToken } from "@/actions/_utils/validateToken";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { and, eq } from "drizzle-orm";

const handler = async (
  user: User,
  values: z.infer<typeof deleteRecipientSchema>
) => {
  try {
    const recipient = await db
      .delete(recipients)
      .where(and(eq(recipients.id, values.id)));
    return { success: true as true, data: recipient[0] };
  } catch (err) {
    return errorHandler(err);
  }
};

export const deleteRecipient: (
  values: z.infer<typeof deleteRecipientSchema>
) => Promise<Awaited<ReturnType<typeof handler>>> =
  validateBusinessToken(handler);
