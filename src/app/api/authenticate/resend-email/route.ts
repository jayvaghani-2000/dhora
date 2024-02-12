import { errorHandler } from "@/common/api/error";
import { db } from "@/db";
import { users } from "@/db/schema";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { generateOtp } from "../../utils/generateOtp";
import { sendEmail } from "../../utils/sendEmail";
import { cookies } from "next/headers";

async function handler(req: Request) {
  try {
    const body = await req.json();
    if (req.method === "POST") {
      const username = cookies().get("username");
      const verification_code = generateOtp();

      const hashedVerificationCode = await bcrypt.hash(verification_code, 10);

      await db
        .update(users)
        .set({ verification_code: hashedVerificationCode })
        .where(eq(users.username, username?.value ?? ""));

      await sendEmail("Email Verification", {
        email: body.email,
        verification_code: verification_code,
      });

      return NextResponse.json(
        {
          success: true,
          data: { message: "Email sent successfully" },
        },
        { status: 200 }
      );
    }
  } catch (err) {
    return errorHandler(err);
  }
}

export { handler as POST };
