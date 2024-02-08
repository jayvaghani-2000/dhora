import { NextResponse } from "next/server";
import { errorHandler } from "@/common/api/error";
import { LoginUserSchema } from "../schema";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

async function handler(req: Request) {
  try {
    const body = await req.json();
    if (req.method === "POST") {
      const payload = LoginUserSchema.parse(body);

      const user = await db
        .select()
        .from(users)
        .where(eq(users.email, payload.email));

      if (user.length === 0) {
        throw new Error("Invalid email");
      }

      if (
        user.length > 0 &&
        (await bcrypt.compare(payload.password, user[0].password!))
      ) {
        return NextResponse.json(
          {
            success: true,
            data: user[0],
          },
          {
            status: 200,
          }
        );
      }
      throw new Error("Invalid password");
    }
  } catch (err) {
    return errorHandler(err);
  }
}

export { handler as DELETE, handler as GET, handler as POST };
