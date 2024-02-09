import { errorHandler } from "@/common/api/error";
import { db } from "@/db";
import { users } from "@/db/schema";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { generateOtp } from "../../utils/generateOtp";
import { sendEmail } from "../../utils/sendEmail";

async function handler(req: Request) {
  const session = await getServerSession();

  let email = "";

  if (session) {
    const { user } = session;
    email = user!.email ?? "";
  }

  try {
    if (req.method === "POST") {
      const verification_code = generateOtp();

      const hashedVerificationCode = await bcrypt.hash(verification_code, 10);

      await db
        .update(users)
        .set({ verification_code: hashedVerificationCode })
        .where(eq(users.email, email));

      await sendEmail("Email Verification", {
        email: email,
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
