"use server";

import { User } from "lucia";
import { users } from "@/db/schema";
import { db } from "@/lib/db";
import { validateToken } from "@/actions/_utils/validateToken";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { eq } from "drizzle-orm";
import { lucia } from "@/lib/auth";

const handler = async (user: User) => {
  try {
    await db
      .update(users)
      .set({
        deleted: true,
        updated_at: new Date(),
      })
      .where(eq(users.id, user.id));
    await lucia.invalidateUserSessions(user.id);
    await lucia.deleteExpiredSessions();

    return {
      success: true as true,
      data: "Account deleted successfully.",
    };
  } catch (err) {
    return errorHandler(err);
  }
};

export const deleteAccount: () => Promise<Awaited<ReturnType<typeof handler>>> =
  validateToken(handler);
