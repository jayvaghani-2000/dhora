"use server";

import { z } from "zod";
import { User } from "lucia";
import { createFieldSchema, fields } from "@/db/schema";
import { db } from "@/lib/db";
import { validateBusinessToken } from "@/actions/_utils/validateToken";
import { errorHandler } from "@/actions/_utils/errorHandler";

const handler = async (
  user: User,
  values: z.infer<typeof createFieldSchema>
) => {
  try {
    const field = await db
      .insert(fields)
      .values({
        template_id: values.template_id,
        recipient_id: values.recipient_id,
        type: values.type,
        signerEmail: values.signerEmail,
        pageHeight: values.pageHeight,
        pageWidth: values.pageWidth,
        pageX: values.pageX,
        pageY: values.pageY,
        pageNumber: values.pageNumber,
        fieldMeta: values.fieldMeta,
      })
      .returning();

    return { success: true, data: field[0] };
  } catch (err) {
    return errorHandler(err);
  }
};

export const createField = validateBusinessToken(handler);
