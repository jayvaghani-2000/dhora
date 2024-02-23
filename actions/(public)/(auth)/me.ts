"use server";

import { users } from "@/db/schema";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { lucia } from "@/lib/auth";
import { cookies } from "next/headers";
import { stringifyBigint } from "../../_utils/stringifyBigint";
import { TOKEN } from "@/cookie";
import { errorType } from "@/actions/_utils/types.type";

export const me: () => Promise<
  | {
      success: true;
      data: NonNullable<Awaited<ReturnType<typeof getUser>>>;
      error?: never;
    }
  | errorType
> = async () => {
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
      return { success: false, error: "Unauthenticated" };
    }
  } else {
    return { success: false, error: "Unauthenticated" };
  }
};

export const getUser = async (email: string) => {
  return db.query.users.findFirst({
    where: eq(users.email, email),
  });
};
