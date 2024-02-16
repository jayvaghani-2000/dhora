"use server";

import { users } from "@/db/schema";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { lucia } from "@/lib/auth";
import { cookies } from "next/headers";
import { stringifyBigint } from "./_utils/stringifyBigint";

export const me = async () => {
  const token = cookies().get("auth_session");

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
      return { success: false, error: "Unauthorized" };
    }
  } else {
    return { success: false, error: "Unauthorized" };
  }
};

export type profileType = Awaited<ReturnType<typeof getUser>>;

const getUser = async (email: string) => {
  return db.query.users.findFirst({
    where: eq(users.email, email),
  });
};
