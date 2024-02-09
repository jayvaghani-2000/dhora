import {
  DB_ERROR_ROUTINE,
  handleErrorMsg,
} from "@/app/api/utils/handleErrorMsg";
import { NextResponse } from "next/server";
import { DatabaseError } from "pg";
import { ZodError } from "zod";

export const errorHandler = (err: unknown) => {
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
    } else if (
      errorObj.message === DB_ERROR_ROUTINE._bt_check_unique &&
      errorObj.constraint === "users_username_unique"
    ) {
      return NextResponse.json(
        { error: "Username already taken", success: false },
        { status: 404 }
      );
    } else {
      return NextResponse.json(
        { error: errorObj.message, success: false },
        { status: 404 }
      );
    }
  } else if (err instanceof Error) {
    return NextResponse.json(
      { error: err.message, success: false },
      { status: 500 }
    );
  }
  return NextResponse.json(
    { error: "Something went wrong", success: false },
    { status: 500 }
  );
};
