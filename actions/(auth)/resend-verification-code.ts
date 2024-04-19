"use server";

import { users } from "@/db/schema";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { Argon2id } from "oslo/password";
import { lucia } from "@/lib/auth";
import { cookies } from "next/headers";
import { generateOtp } from "./_utils/generateOtp";
import { sendEmail } from "./_utils/sendEmail";
import { TOKEN } from "@/cookie";

export const resendVerificationCode = async () => {
  const token = cookies().get(TOKEN);

  if (token) {
    const { session, user } = await lucia.validateSession(token.value);

    if (session) {
      const verification_code = generateOtp();

      const hashedVerificationCode = await new Argon2id().hash(
        verification_code
      );

      const userInfo = await db
        .update(users)
        .set({
          verification_code: hashedVerificationCode,
          email_verified: null,
        })
        .where(eq(users.email, user.email))
        .returning();

      const sent = await sendEmail("Email Verification", {
        email: userInfo[0].email,
        verification_code: verification_code,
      });

      if (sent) {
        return { success: true, data: "Email sent successfully." };
      } else {
        return { success: false, error: "Error while sending email." };
      }
    }
  }
  return { success: false, error: "Unauthenticated" };
};
