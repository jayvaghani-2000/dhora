import { z } from "zod";

export type updatePasswordSchemaType = z.infer<typeof updatePasswordSchema>;

export const updatePasswordSchema = z
  .object({
    old_password: z.string().min(6, { message: "Password is required" }),
    new_password: z.string().min(6, { message: "Password is required" }),
    confirm_new_password: z.string().min(6, {
      message: "Password must match.",
    }),
  })
  .refine(
    data => data.new_password.trim() === data.confirm_new_password.trim(),
    {
      message: "Passwords do not match.",
      path: ["confirm_new_password"],
    }
  )
  .refine(data => data.new_password.trim() !== data.old_password.trim(), {
    message: "New password can't be same",
    path: ["new_password"],
  });
