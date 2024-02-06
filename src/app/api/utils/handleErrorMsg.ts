import { ZodError } from "zod";

export const handleErrorMsg = (error: unknown) => {
  if (error instanceof ZodError) {
    const errorMessage = error.errors
      .map(e => `${e.path[0]}: ${e.message}`)
      .join("\n");
    return { success: false, message: errorMessage };
  } else {
    // Handle other types of errors
    return { success: false, message: "An unexpected error occurred." };
  }
};
