import { NextResponse } from "next/server";
import { errorHandler } from "@/common/api/error";
import { RegisterUserSchema } from "../schema";
import { generateOtp } from "../../utils/generateOtp";
import bcrypt from "bcrypt";
import { db } from "@/db";
import { users } from "@/db/schema";
import { sendEmail } from "../../utils/sendEmail";
async function handler(req: Request) {
  try {
    const body = await req.json();
    if (req.method === "POST") {
      const payload = RegisterUserSchema.parse(body);

      const { user_type, ...rest } = payload;
      const verification_code = generateOtp();

      const hashedPassword = await bcrypt.hash(payload.password, 10);
      const hashedVerificationCode = await bcrypt.hash(verification_code, 10);

      const user = await db
        .insert(users)
        .values({
          ...rest,
          password: hashedPassword,
          verification_code: hashedVerificationCode,
          user_type: user_type,
        })
        .returning();

      await sendEmail("Email Verification", {
        email: payload.email,
        verification_code: verification_code,
      });

      return NextResponse.json(
        {
          success: true,
          data: user[0],
        },
        { status: 201 }
      );
    }
  } catch (err) {
    return errorHandler(err);
  }
}

export { handler as POST };
