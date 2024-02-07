import { NextResponse } from "next/server";
import { DatabaseError } from "pg";
import { ZodError } from "zod";
import { handleRegisterUser } from "../../helper/authenticate";
import { DB_ERROR_ROUTINE, handleErrorMsg } from "../../utils/handleErrorMsg";

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
      return NextResponse.json(
        { error: errorObj.message, success: false },
        { status: 400 }
      );
    } else if (err instanceof DatabaseError) {
      const errorObj = handleErrorMsg(err);
      if (
        errorObj.message === DB_ERROR_ROUTINE._bt_check_unique &&
        errorObj.constraint === "users_email_unique"
      ) {
        return NextResponse.json(
          { error: "The email is already registered", success: false },
          { status: 404 }
        );
      } else {
        return NextResponse.json(
          { error: errorObj.message, success: false },
          { status: 404 }
        );
      }
    }
    return NextResponse.json(
      { error: "Something went wrong", success: false },
      { status: 500 }
    );
  }
}

export { handler as POST };
