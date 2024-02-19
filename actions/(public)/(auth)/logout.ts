"use server";

import { lucia } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const logout = async () => {
  const token = cookies().get("auth_session");
  if (token) {
    await lucia.invalidateSession(token.value);
    const sessionCookie = lucia.createBlankSessionCookie();
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
    return { success: true, data: "Logout successfully" };
  } else {
    return { success: false, error: "Unauthorized" };
  }
};
