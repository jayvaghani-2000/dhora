import { AxiosError } from "axios";
import { DatabaseError } from "pg";
import { ZodError } from "zod";

const handleErrorMsg = (error: unknown) => {
  if (error instanceof ZodError) {
    const errorMessage = error.errors
      .map(e => `${e.path[0]}: ${e.message}`)
      .join("\n");
    return { success: false, message: errorMessage };
  } else if (error instanceof DatabaseError) {
    if (error.routine === "_bt_check_unique") {
      return {
        success: false,
        message: error.routine,
        constraint: error.constraint,
      };
    } else {
      return {
        success: false,
        message: "An error occurred while interacting with DB.",
      };
    }
  } else {
    return { success: false, message: "An unexpected error occurred." };
  }
};

export const errorHandler = (err: unknown) => {
  if (err instanceof ZodError) {
    const errorObj = handleErrorMsg(err);
    return { error: errorObj.message, success: false };
  } else if (err instanceof DatabaseError) {
    const errorObj = handleErrorMsg(err);

    if (
      errorObj.message === "_bt_check_unique" &&
      errorObj.constraint === "users_email_unique"
    ) {
      return { error: "The email is already registered", success: false };
    } else if (
      errorObj.message === "_bt_check_unique" &&
      errorObj.constraint === "users_username_unique"
    ) {
      return { error: "Username already taken", success: false };
    } else {
      return { error: errorObj.message, success: false };
    }
  } else if (err instanceof AxiosError) {
    return { error: err.message, success: false };
  } else if (err instanceof Error) {
    if (err.message === "User not found") {
      return { error: "User not found", success: false };
    }
    return { error: err.message, success: false };
  }
  return { error: "Something went wrong", success: false };
};
