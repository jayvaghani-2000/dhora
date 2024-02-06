import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { handleRegisterUser } from "../../helper/authenticate";
import { handleErrorMsg } from "../../utils/handleErrorMsg";

async function handler(req: Request) {
  try {
    const body = await req.json();

    switch (req.method) {
      case "POST": {
        const user = await handleRegisterUser(body);
        return NextResponse.json(
          {
            success: true,
            data: user[0],
          },
          { status: 201 }
        );
      }
      default: {
        return NextResponse.json(
          { message: "Method not allowed." },
          {
            headers: {
              Allow: "POST",
            },
            status: 405,
          }
        );
      }
    }
  } catch (err) {
    if (err instanceof ZodError) {
      const errorObj = handleErrorMsg(err);
      return NextResponse.json({ error: errorObj }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export { handler as POST };
