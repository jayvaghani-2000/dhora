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
  DEFAULT_LOGIN_REDIRECT,
} from "@/routes";

export const login = async (values: z.infer<typeof loginSchema>) => {
  const validatedFields = loginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const user = await db.query.users.findFirst({
    where: eq(users.email, validatedFields.data.email),
  });

  if (!user) {
    return { error: "Invalid username or password" };
  }

  const validPassword = await new Argon2id().verify(
    user.password,
    validatedFields.data.password
  );

  if (!validPassword) {
    return { error: "Invalid username or password" };
  }

  const session = await lucia.createSession(user.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);

  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  return redirect(
    user.business_id ? DEFAULT_BUSINESS_LOGIN_REDIRECT : DEFAULT_LOGIN_REDIRECT
  );
};
