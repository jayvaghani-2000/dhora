"use server";

import { User } from "lucia";
import { users } from "@/db/schema";
import { db } from "@/lib/db";
import { validateToken } from "@/actions/_utils/validateToken";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { eq } from "drizzle-orm";
import { lucia } from "@/lib/auth";
import { cookies } from "next/headers";

const handler = async (user: User) => {
  try {
    await db
      .update(users)
      .set({
        deleted: true,
      })
      .where(eq(users.id, user.id));
    await lucia.invalidateUserSessions(user.id);
    await lucia.deleteExpiredSessions();
    const sessionCookie = lucia.createBlankSessionCookie();
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
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
