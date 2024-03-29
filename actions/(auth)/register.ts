"use server";

import { z } from "zod";
import {
  availability,
  businesses,
  createAvailabilitySchema,
  createBusinessSchema,
  registerSchema,
  users,
} from "@/db/schema";
import { Argon2id } from "oslo/password";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { generateOtp } from "./_utils/generateOtp";
import { sendEmail } from "./_utils/sendEmail";
import { redirect } from "next/navigation";
import { lucia } from "@/lib/auth";
import { cookies } from "next/headers";
import {
  DEFAULT_BUSINESS_LOGIN_REDIRECT,
  DEFAULT_USER_LOGIN_REDIRECT,
} from "@/routes";

export const register = async ({
  values,
  availability: newAvailabilityData,
}: {
  values: z.infer<typeof registerSchema>;
  availability?: z.infer<typeof createAvailabilitySchema>;
}) => {
  const validatedFields = registerSchema.safeParse(values);
  const businessPayload = values.is_business
    ? createBusinessSchema.safeParse({
        name: values.business_name,
        type: values.business_type,
      })
    : null;
  const verification_code = generateOtp();

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  if (businessPayload && !businessPayload.success) {
    return { error: "Invalid fields" };
  }

  const hashedPassword = await new Argon2id().hash(
    validatedFields.data.password
  );
  const hashedVerificationCode = await new Argon2id().hash(verification_code);

  const stripeAccount = await stripe.customers.create({
    email: validatedFields.data.email,
    name: validatedFields.data.name,
  });

  const business = businessPayload
    ? await db.insert(businesses).values(businessPayload.data).returning()
    : null;

  const createAvailability = async () => {
    // create default availability
    if (newAvailabilityData && business) {
      await db.insert(availability).values({
        business_id: business[0].id,
        ...newAvailabilityData,
      });
    }
  };

  const [user] = await Promise.all([
    await db
      .insert(users)
      .values({
        name: validatedFields.data.name,
        email: validatedFields.data.email,
        password: hashedPassword,
        verification_code: hashedVerificationCode,
        business_id: business ? business[0].id : null,
        stripe_id: stripeAccount.id,
      })
      .returning(),
    await createAvailability(),
  ]);

  await sendEmail("Email Verification", {
    email: user[0].email,
    verification_code: verification_code,
  });

  const session = await lucia.createSession(user[0].id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  return redirect(
    business ? DEFAULT_BUSINESS_LOGIN_REDIRECT : DEFAULT_USER_LOGIN_REDIRECT
  );
};
