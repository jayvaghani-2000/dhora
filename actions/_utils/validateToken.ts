import { TOKEN } from "@/cookie";
import { lucia } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { logout } from "../(auth)/logout";
import { User } from "lucia";

export function validateToken(handler: any) {
  return async (values?: unknown) => {
    const token = cookies().get(TOKEN);

    if (token) {
      const { session, user } = await lucia.validateSession(token.value);

      if (session) {
        return handler(user, values);
      } else {
        return { success: false, error: "Unauthenticated" };
      }
    } else {
      return { success: false, error: "Unauthenticated" };
    }
  };
}

export function validateBusinessToken(handler: any) {
  return async (values?: unknown) => {
    const token = cookies().get(TOKEN);
    if (token) {
      const { session, user } = await lucia.validateSession(token.value);
      if (session) {
        if (user.business_id) {
          return await handler(user, values);
        } else {
          return { success: false, error: "unauthorized" };
        }
      } else {
        return { success: false, error: "Unauthenticated" };
      }
    } else {
      return { success: false, error: "Unauthenticated" };
    }
  };
}
export async function redirectDisableUser(user: User) {
  await logout();
  return redirect("/");
}
