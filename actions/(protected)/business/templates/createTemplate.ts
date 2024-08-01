"use server";

import { z } from "zod";
import { User } from "lucia";
import { templates, createTemplateSchema, templateMeta } from "@/db/schema";
import { db } from "@/lib/db";
import { validateBusinessToken } from "@/actions/_utils/validateToken";
import { errorHandler } from "@/actions/_utils/errorHandler";

const handler = async (
  user: User,
  values: z.infer<typeof createTemplateSchema>
) => {
  try {
    const template = await db
      .insert(templates)
      .values({
        business_id: user.business_id!,
        name: values.name,
        data: values.data,
      })
      .returning();

    await db.insert(templateMeta).values({
      template_id: template[0].id,
    });

    return { success: true, data: template[0] };
  } catch (err) {
    return errorHandler(err);
  }
};

export const createTemplate = validateBusinessToken(handler);
