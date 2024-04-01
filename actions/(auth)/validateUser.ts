"use server";

import { TOKEN } from "@/cookie";
import { lucia } from "@/lib/auth";
import { authRoutes } from "@/routes";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function validateUserToken() {
  const token = cookies().get(TOKEN);

  if (token) {
    const { session, user } = await lucia.validateSession(token.value);
    if (!session) {
      return redirect(authRoutes[0]);
    }
  } else {
    return redirect(authRoutes[0]);
  }
}
