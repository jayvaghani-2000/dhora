"use server";

import { TOKEN } from "@/cookie";
import { lucia } from "@/lib/auth";
import { DEFAULT_USER_LOGIN_REDIRECT, authRoutes } from "@/routes";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function validateBusinessToken() {
  const token = cookies().get(TOKEN);

  if (token) {
    const { session, user } = await lucia.validateSession(token.value);
    if (session && !user.business_id) {
      return redirect(DEFAULT_USER_LOGIN_REDIRECT);
    }
  } else {
    return redirect(authRoutes[0]);
  }
}
