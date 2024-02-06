import { db } from "@/db";
import { users } from "@/db/schema";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { LoginUserSchema, RegisterUserSchema } from "./schema";

export async function registerUser(data: unknown) {
  const payload = RegisterUserSchema.parse(data);

  const hashedPassword = await bcrypt.hash(payload.password, 10);

  return db
    .insert(users)
    .values({
      ...payload,
      password: hashedPassword,
    })
    .returning();
}

export async function authenticateUser(data: unknown) {
  const payload = LoginUserSchema.parse(data);

  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, payload.email));

  if (
    user.length > 0 &&
    (await bcrypt.compare(payload.password, user[0].password!))
  ) {
    return user[0];
  }
  return false;
}
