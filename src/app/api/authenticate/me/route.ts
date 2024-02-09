import { errorHandler } from "@/common/api/error";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { GetUserSchema } from "../schema";

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

      const user = await db.query.users.findFirst({
        where: eq(users.email, payload.email),
        columns: {
          email: true,
          first_name: true,
          last_name: true,
          username: true,
          id: true,
          verified: true,
        },
      });

      if (user) {
        return NextResponse.json(
          {
            success: true,
            data: { ...user, id: BigInt(user!.id).toString() },
          },
          { status: 200 }
        );
      }
      throw new Error("User not found");
    }
  } catch (err) {
    return errorHandler(err);
  }
}

export { handler as GET };
