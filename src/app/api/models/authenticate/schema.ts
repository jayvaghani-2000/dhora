import { z } from "zod";

export const RegisterUserSchema = z.object({
  first_name: z.string().min(3, {
    message: "First name must be at least 3 characters.",
  }),
  last_name: z.string().min(3, {
    message: "Last name must be at least 3 characters.",
  }),
  email: z.string().email({
    message: "Provide valid email.",
  }),
  username: z.string().min(6, {
    message: "User name must be at least 6 characters.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

export type RegisterUser = z.infer<typeof RegisterUserSchema>;

export const LoginUserSchema = z.object({
  email: z.string().email({
    message: "Provide valid email.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

export type LoginUser = z.infer<typeof LoginUserSchema>;
