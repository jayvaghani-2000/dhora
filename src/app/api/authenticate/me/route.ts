import { errorHandler } from "@/common/api/error";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { getProfile } from ".";
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

      const user = await getProfile(payload.email);

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
