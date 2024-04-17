"use server";

import { events, users } from "@/db/schema";
import { db } from "@/lib/db";
import { and, asc, eq } from "drizzle-orm";
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
      const userInfo = await getUser(user.email);

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

export const getUser = async (email: string) => {
  return db.query.users.findFirst({
    where: and(eq(users.email, email), eq(users.deleted, false)),
    with: {
      business: true,
      events: {
        columns: { id: true, title: true, logo: true },
        where: eq(events.deleted, false),
        orderBy: [asc(events.updated_at)],
      },
    },
  });
};
