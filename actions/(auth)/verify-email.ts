"use server";

import { mailVerificationUserSchema, users } from "@/db/schema";
import { db } from "@/lib/db";
import { and, eq } from "drizzle-orm";
import { Argon2id } from "oslo/password";
import { lucia } from "@/lib/auth";
import { cookies } from "next/headers";
import { z } from "zod";
import { stringifyBigint } from "../_utils/stringifyBigint";
import { TOKEN } from "@/cookie";

export const verifyEmail = async (
  values: z.infer<typeof mailVerificationUserSchema>
) => {
  const validatedFields = mailVerificationUserSchema.safeParse(values);

  if (!validatedFields.success) {
    return { success: false, error: "Invalid fields!" };
  }

  const token = cookies().get(TOKEN);

  if (token) {
    const { session, user } = await lucia.validateSession(token.value);

    if (session) {
      const userInfo = await db.query.users.findFirst({
        where: and(eq(users.email, user.email), eq(users.deleted, false)),
      });

      if (userInfo) {
        const validCode = await new Argon2id().verify(
          userInfo.verification_code as string,
          validatedFields.data.verification_code as string
        );

        if (validCode) {
          const userInfo = await db
            .update(users)
            .set({
              verification_code: null,
              email_verified: new Date(),
              updated_at: new Date(),
            })
            .where(and(eq(users.email, user.email), eq(users.deleted, false)))
            .returning();

          return { success: true, data: stringifyBigint(userInfo[0]) };
        }
      } else {
        return { success: false, error: "Something went wrong!" };
      }
    }
  }

  return { success: false, error: "Unauthenticated" };
};
