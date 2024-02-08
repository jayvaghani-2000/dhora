import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { errorHandler } from "@/common/api/error";
import { db } from "@/db";
import { users } from "@/db/schema";
import { GetUserSchema } from "../schema";
import { eq } from "drizzle-orm";

async function handler(req: Request) {
  const session = await getServerSession();

  let email = "";

  if (session) {
    const { user } = session;
    email = user!.email ?? "";
  }
  try {
    if (req.method === "GET") {
      const payload = GetUserSchema.parse({ email });

      const user = await db
        .select()
        .from(users)
        .where(eq(users.email, payload.email));

      return NextResponse.json(
        {
          success: true,
          data: user[0],
        },
        { status: 200 }
      );
    }
  } catch (err) {
    return errorHandler(err);
  }
}

export { handler as GET };
