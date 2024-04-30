"use server";

import { events, subEvents, users } from "@/db/schema";
import { db } from "@/lib/db";
import { and, eq } from "drizzle-orm";
import { lucia } from "@/lib/auth";
import { cookies } from "next/headers";
import { stringifyBigint } from "../_utils/stringifyBigint";
import { TOKEN } from "@/cookie";
import { errorType } from "@/actions/_utils/types.type";

export const me: (clientSide?: boolean) => Promise<
  | {
      success: true;
      data: NonNullable<Awaited<ReturnType<typeof getUser>>>;
      error?: never;
    }
  | errorType
> = async (clientSide = false) => {
  const token = cookies().get(TOKEN);

  if (token) {
    const { session, user } = await lucia.validateSession(token.value);

    if (session) {
      const userInfo = await getUser(user.id);

      if (userInfo) {
        return { success: true, data: stringifyBigint(userInfo) };
      } else {
        return { success: false, error: "Something went wrong!" };
      }
    } else {
      if (clientSide) {
        const sessionCookie = lucia.createBlankSessionCookie();
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        );
      }

      return { success: false, error: "Unauthenticated" };
    }
  } else {
    if (clientSide) {
      const sessionCookie = lucia.createBlankSessionCookie();
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }

    return { success: false, error: "Unauthenticated" };
  }
};

export const getUser = async (id: string) => {
  const [userEvents, user] = await Promise.all([
    await db.query.events.findMany({
      where: and(eq(events.deleted, false), eq(events.user_id, id)),
    }),
    await db.query.users.findFirst({
      where: and(eq(users.id, id)),
      with: {
        business: true,
      },
    }),
  ]);

  return user ? { ...user, events: userEvents } : undefined;
};
