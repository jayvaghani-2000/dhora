import { errorHandler } from "@/common/api/error";
import { db } from "@/db";
import { mailVerificationUserSchema, users } from "@/db/schema";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

async function handler(req: Request) {
  const session = await getServerSession();
  let email = "";
  if (session) {
    const { user } = session;
    email = user!.email ?? "";
  }
  try {
    if (req.method === "POST") {
      const body = await req.json();

      const payload = mailVerificationUserSchema.parse(body);

      const user = await db.select().from(users).where(eq(users.email, email));

      const isValidCode = await bcrypt.compare(
        payload.verification_code ? payload.verification_code : "",
        user[0].verification_code!
      );

      if (!isValidCode) {
        throw new Error("Invalid code");
      }

      const updatedUser = await db
        .update(users)
        .set({ verified: true, verification_code: null })
        .where(eq(users.email, email))
        .returning();
      return NextResponse.json(
        {
          success: true,
          data: updatedUser[0],
        },
        { status: 200 }
      );
    }
  } catch (err) {
    return errorHandler(err);
  }
}

export { handler as POST };
