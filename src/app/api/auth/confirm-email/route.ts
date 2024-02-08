import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { errorHandler } from "@/common/api/error";
import { ConfirmEmailSchema } from "../schema";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

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
      const payload = ConfirmEmailSchema.parse({ email, ...body });

      const user = await db
        .select()
        .from(users)
        .where(eq(users.email, payload.email));

      const isValidCode = await bcrypt.compare(
        payload.verification_code,
        user[0].verification_code!
      );

      if (isValidCode) {
        const response = await db
          .update(users)
          .set({ verified: true, verification_code: null })
          .where(eq(users.email, payload.email))
          .returning();

        return NextResponse.json(
          {
            success: true,
            data: response[0],
          },
          { status: 200 }
        );
      }
    }
  } catch (err) {
    return errorHandler(err);
  }
}

export { handler as POST };
