"use server";

import { z } from "zod";
import { User } from "lucia";
import { templateMeta, createTemplateMetaSchema } from "@/db/schema";
import { db } from "@/lib/db";
import { validateBusinessToken } from "@/actions/_utils/validateToken";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { and, eq } from "drizzle-orm";

const handler = async (
  user: User,
  values: z.infer<typeof createTemplateMetaSchema>
) => {
  try {
    const results = await db
      .update(templateMeta)
      .set({
        subject: values.subject,
        message: values.message,
        timezone: values.timezone,
        dateFormat: values.dateFormat,
        redirectUrl: values.redirectUrl,
      })
      .where(and(eq(templateMeta.id, values.id)))
      .returning();
    return { success: true as true, data: results[0] };
  } catch (err) {
    return errorHandler(err);
  }
};

export const updateTemplateMeta: (
  values: z.infer<typeof createTemplateMetaSchema>
) => Promise<Awaited<ReturnType<typeof handler>>> =
  validateBusinessToken(handler);
