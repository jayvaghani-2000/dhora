import { userTypeEnum } from "@/db/schema";
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
  user_type: z.enum(Object.values(userTypeEnum)[1]),
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

export const GetUserSchema = z.object({
  email: z.string().email({
    message: "Provide valid email.",
  }),
});

export type GetUser = z.infer<typeof GetUserSchema>;

export const ConfirmEmailSchema = z.object({
  email: z.string().email({
    message: "Provide valid email.",
  }),
  verification_code: z
    .string()
    .min(6, {
      message: "Code must be of 6 characters.",
    })
    .max(6, {
      message: "Code must be of 6 characters.",
    }),
});

export type ConfirmEmail = z.infer<typeof ConfirmEmailSchema>;
