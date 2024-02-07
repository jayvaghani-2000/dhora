import { DatabaseError } from "pg";
import { ZodError } from "zod";

export enum DB_ERROR_ROUTINE {
  _bt_check_unique = "_bt_check_unique",
}

export const handleErrorMsg = (error: unknown) => {
  if (error instanceof ZodError) {
    const errorMessage = error.errors
      .map(e => `${e.path[0]}: ${e.message}`)
      .join("\n");
    return { success: false, message: errorMessage };
  } else if (error instanceof DatabaseError) {
    switch (error.routine) {
      case DB_ERROR_ROUTINE._bt_check_unique:
        return {
          success: false,
          message: "_bt_check_unique",
          constraint: error.constraint,
        };
      default:
        return {
          success: false,
          message: "An error occurred while interacting with DB.",
        };
    }
  } else {
    return { success: false, message: "An unexpected error occurred." };
  }
};
