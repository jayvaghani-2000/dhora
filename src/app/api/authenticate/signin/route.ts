import { errorHandler } from "@/common/api/error";
import { db } from "@/db";
import { users } from "@/db/schema";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

async function handler(req: Request) {
  try {
    const body = await req.json();
    if (req.method === "POST") {
      const user = await db
        .select()
        .from(users)
        .where(eq(users.username, body.username));

      if (user.length === 0) {
        throw new Error("Invalid Username");
      }

      if (
        user.length > 0 &&
        (await bcrypt.compare(body.password, user[0].password!))
      ) {
        return NextResponse.json(
          {
            success: true,
            data: { ...user[0], id: BigInt(user[0].id).toString() },
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

export { handler as POST };
