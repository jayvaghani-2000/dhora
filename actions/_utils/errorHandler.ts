import { AxiosError } from "axios";
import { ZodError } from "zod";
import { errorType } from "./types.type";

class PostgresError extends Error {
  severity_local: string | undefined;
  severity: string | undefined;
  code: string | undefined;
  detail: string | undefined;
  schema_name: string | undefined;
  table_name: string | undefined;
  constraint_name: string | undefined;
  file: string | undefined;
  line: string | undefined;
  routine: string | undefined;
}

export const errorHandler: (err: unknown) => errorType = (err: unknown) => {
  if (err instanceof ZodError) {
    console.log(err, Object.keys(err));
    const errorMessage = err.errors
      .map(e => `${e.path[0]}: ${e.message}`)
      .join("\n");
    return { error: errorMessage, success: false };
  } else if (err instanceof Error) {
    const error = err as PostgresError;
    if (
      error.routine === "_bt_check_unique" &&
      error.constraint_name === "unique_package_name"
    ) {
      return { error: "Package with same name already exist", success: false };
    }
    if (
      error.routine === "_bt_check_unique" &&
      error.constraint_name === "unique_grouped_name"
    ) {
      return {
        error: "Package group with same name already exist",
        success: false,
      };
    }
    if (
      error.routine === "_bt_check_unique" &&
      error.constraint_name === "users_email_unique"
    ) {
      return {
        error: "Email is already registered",
        success: false,
      };
    }

    return { error: err.message, success: false };
  } else if (err instanceof AxiosError) {
    return { error: err.response?.data?.error ?? "", success: false };
  }
  return { error: "Something went wrong", success: false };
};
