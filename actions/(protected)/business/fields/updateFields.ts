"use server";

import { z } from "zod";
import { User } from "lucia";
import { createFieldSchema, fields } from "@/db/schema";
import { db } from "@/lib/db";
import { validateBusinessToken } from "@/actions/_utils/validateToken";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { eq } from "drizzle-orm";

const updateFieldSchema = createFieldSchema.omit({
  template_id: true,
  signerEmail: true,
  recipient_id: true,
});

const handler = async (
  user: User,
  values: z.infer<typeof updateFieldSchema>
) => {
  try {
    const field = await db
      .update(fields)
      .set({
        type: values.type,
        pageHeight: values.pageHeight,
        pageWidth: values.pageWidth,
        pageX: values.pageX,
        pageY: values.pageY,
        pageNumber: values.pageNumber,
        fieldMeta: values.fieldMeta,
      })
      .where(eq(fields.id, values.id))
      .returning();

    return { success: true, data: field[0] };
  } catch (err) {
    return errorHandler(err);
  }
};

export const updateField: (
  values: z.infer<typeof updateFieldSchema>
) => Promise<Awaited<ReturnType<typeof handler>>> =
  validateBusinessToken(handler);
