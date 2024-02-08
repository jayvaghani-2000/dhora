import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { handleConfirmEmail } from "../../helper/authenticate";
import { handleErrorMsg } from "../../utils/handleErrorMsg";

async function handler(req: Request) {
  const session = await getServerSession();

  let email = "";

  if (session) {
    const { user } = session;
    email = user!.email ?? "";
  }
  try {
    const body = await req.json();
    switch (req.method) {
      case "POST": {
        const user = await handleConfirmEmail({ email: email, ...body });
        return NextResponse.json(
          {
            success: true,
            data: user[0],
          },
          { status: 200 }
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
      return NextResponse.json(
        { error: errorObj.message, success: false },
        { status: 400 }
      );
    }
    if (err instanceof Error) {
      return NextResponse.json(
        { error: err.message, success: false },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Something went wrong", success: false },
      { status: 500 }
    );
  }
}

export { handler as POST };
