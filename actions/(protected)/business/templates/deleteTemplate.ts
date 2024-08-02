"use server";

import { z } from "zod";
import { User } from "lucia";
import { templates, deleteTemplateSchema } from "@/db/schema";
import { db } from "@/lib/db";
import { validateBusinessToken } from "@/actions/_utils/validateToken";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { eq } from "drizzle-orm";

const handler = async (
  user: User,
  values: z.infer<typeof deleteTemplateSchema>
) => {
  try {
    const template = await db
      .delete(templates)
      .where(eq(templates.id, values.id));
    return { success: true as true, data: template[0] };
  } catch (err) {
    return errorHandler(err);
  }
};

export const deleteTemplate: (
  values: z.infer<typeof deleteTemplateSchema>
) => Promise<Awaited<ReturnType<typeof handler>>> =
  validateBusinessToken(handler);
