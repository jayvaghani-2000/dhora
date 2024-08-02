"use server";

import { z } from "zod";
import { User } from "lucia";
import { createRecipientSchema, recipients } from "@/db/schema";
import { db } from "@/lib/db";
import { validateBusinessToken } from "@/actions/_utils/validateToken";
import { errorHandler } from "@/actions/_utils/errorHandler";

const handler = async (
  user: User,
  values: z.infer<typeof createRecipientSchema>
) => {
  try {
    const recipient = await db
      .insert(recipients)
      .values({
        name: values.name,
        email: values.email,
        role: values.role,
        template_id: values.template_id,
      })
      .returning();

    return { success: true, data: recipient[0] };
  } catch (err) {
    return errorHandler(err);
  }
};

export const createRecipient: (
  values: z.infer<typeof createRecipientSchema>
) => Promise<Awaited<ReturnType<typeof handler>>> =
  validateBusinessToken(handler);
