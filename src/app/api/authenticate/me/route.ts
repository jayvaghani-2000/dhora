import { errorHandler } from "@/common/api/error";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getProfile } from ".";

async function handler(req: Request) {
  try {
    if (req.method === "GET") {
      const username = cookies().get("username");
      const user = await getProfile(username?.value ?? "");
      if (user) {
        return NextResponse.json(
          {
            success: true,
            data: {
              username: user.username,
              email: user.email,
              first_name: user.first_name,
              last_name: user.last_name,
              verified: user.verified,
            },
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
