import { db } from "@/db";
import { users } from "@/db/schema";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { generateOtp } from "../../utils/generateOtp";
import { sendEmail } from "../../utils/sendEmail";
import {
  ConfirmEmailSchema,
  GetUserSchema,
  LoginUserSchema,
  RegisterUserSchema,
} from "./schema";

export async function registerUser(data: unknown) {
  const payload = RegisterUserSchema.parse(data);

  const { user_type, ...rest } = payload;
  const verification_code = generateOtp();

  const hashedPassword = await bcrypt.hash(payload.password, 10);
  const hashedVerificationCode = await bcrypt.hash(verification_code, 10);

  const user = await db
    .insert(users)
    .values({
      ...rest,
      password: hashedPassword,
      verification_code: hashedVerificationCode,
      user_type: user_type,
    })
    .returning();

  await sendEmail("Email Verification", {
    email: payload.email,
    verification_code: verification_code,
  });

  return user;
}

export async function authenticateUser(data: unknown) {
  const payload = LoginUserSchema.parse(data);

  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, payload.email));

  if (user.length === 0) {
    throw new Error("Invalid email");
  }

  if (
    user.length > 0 &&
    (await bcrypt.compare(payload.password, user[0].password!))
  ) {
    return user[0];
  }
  throw new Error("Invalid password");
}

export async function getUserInfo(data: unknown) {
  const payload = GetUserSchema.parse(data);

  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, payload.email));

  return user;
}

export async function confirmEmail(data: unknown) {
  const payload = ConfirmEmailSchema.parse(data);

  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, payload.email));

  const isValidCode = await bcrypt.compare(
    payload.verification_code,
    user[0].verification_code!
  );

  if (isValidCode) {
    const user = await db
      .update(users)
      .set({ verified: true, verification_code: null })
      .where(eq(users.email, payload.email))
      .returning();

    return user;
  }
  throw new Error("Invalid code");
}
