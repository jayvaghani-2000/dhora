"use server";

import { validateBusinessToken } from "@/actions/_utils/validateToken";
import { User } from "lucia";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { updatePasswordSchemaType } from "@/app/(protected)/settings/details/_utils/schema";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema";
import { Argon2id } from "oslo/password";
import { errorType } from "../_utils/types.type";

const handler = async (user: User, data: updatePasswordSchemaType) => {
  try {
    const userData = await db.query.users.findFirst({
      where: eq(users.id, user.id),
    });

    if (userData) {
      const validPassword = await new Argon2id().verify(
        userData.password,
        data.old_password
      );
      if (validPassword) {
        const hashedPassword = await new Argon2id().hash(data.new_password);
        await db
          .update(users)
          .set({
            password: hashedPassword,
          })
          .where(eq(users.id, user.id));
        return {
          data: "Password updated successfully.",
          success: true as true,
        };
      } else {
        return {
          error: "Old password doesn't match.",
          success: false,
        } as errorType;
      }
    } else {
      return { error: "User not found", success: false } as errorType;
    }
  } catch (err) {
    return errorHandler(err);
  }
};

export const updatePassword: (
  data: updatePasswordSchemaType
) => Promise<Awaited<ReturnType<typeof handler>>> =
  validateBusinessToken(handler);
