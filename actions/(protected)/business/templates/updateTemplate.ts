"use server";

import { z } from "zod";
import { User } from "lucia";
import { templates, createTemplateSchema } from "@/db/schema";
import { db } from "@/lib/db";
import { validateBusinessToken } from "@/actions/_utils/validateToken";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { and, eq } from "drizzle-orm";

const updateTemplateSchema = createTemplateSchema.pick({
  id: true,
  name: true,
  globalAccessAuth: true,
  externalId: true,
});
const handler = async (
  user: User,
  values: z.infer<typeof updateTemplateSchema>
) => {
  try {
    const template = await db
      .update(templates)
      .set({
        name: values.name,
        globalAccessAuth: values.globalAccessAuth,
        externalId: values.externalId,
      })
      .where(
        and(
          eq(templates.business_id, user.business_id!),
          eq(templates.id, values.id)
        )
      )
      .returning();
    return { success: true as true, data: template[0] };
  } catch (err) {
    return errorHandler(err);
  }
};

export const updateTemplate: (
  values: z.infer<typeof updateTemplateSchema>
) => Promise<Awaited<ReturnType<typeof handler>>> =
  validateBusinessToken(handler);
