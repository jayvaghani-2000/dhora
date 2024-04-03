"use server";

import { z } from "zod";
import { loginSchema, users } from "@/db/schema";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { Argon2id } from "oslo/password";
import { lucia } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  DEFAULT_BUSINESS_LOGIN_REDIRECT,
  DEFAULT_USER_LOGIN_REDIRECT,
} from "@/routes";

export const login = async (values: z.infer<typeof loginSchema>) => {
  const validatedFields = loginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!", success: false };
  }

  const user = await db.query.users.findFirst({
    where: eq(users.email, validatedFields.data.email),
  });

  if (!user) {
    return { error: "Invalid username or password", success: false };
  } else {
    if (user.deleted) {
      return {
        error:
          "Your account is permanently closed, contact admin to enable account",
        success: false,
      };
    }
  }

  const validPassword = await new Argon2id().verify(
    user.password,
    validatedFields.data.password
  );

  if (!validPassword) {
    return { error: "Invalid username or password", success: false };
  }

  const session = await lucia.createSession(user.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);

  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  await db
    .update(users)
    .set({
      disabled: false,
      updated_at: new Date(),
    })
    .where(eq(users.email, validatedFields.data.email));

  return redirect(
    user.business_id
      ? DEFAULT_BUSINESS_LOGIN_REDIRECT
      : DEFAULT_USER_LOGIN_REDIRECT
  );
};
