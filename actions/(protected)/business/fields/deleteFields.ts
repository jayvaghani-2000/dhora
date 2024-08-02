"use server";

import { z } from "zod";
import { User } from "lucia";
import { fields, deleteFieldSchema } from "@/db/schema";
import { db } from "@/lib/db";
import { validateBusinessToken } from "@/actions/_utils/validateToken";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { and, eq } from "drizzle-orm";

const handler = async (
  user: User,
  values: z.infer<typeof deleteFieldSchema>
) => {
  try {
    const field = await db.delete(fields).where(and(eq(fields.id, values.id)));
    return { success: true as true, data: field[0] };
  } catch (err) {
    return errorHandler(err);
  }
};

export const deleteField: (
  values: z.infer<typeof deleteFieldSchema>
) => Promise<Awaited<ReturnType<typeof handler>>> =
  validateBusinessToken(handler);
