import { errorHandler } from "@/common/api/error";
import { db } from "@/db";
import {
  businesses,
  insertBusinessSchema,
  insertUserSchema,
  users,
} from "@/db/schema";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { stripe } from "../../../../lib/stripe";
import { generateOtp } from "../../utils/generateOtp";
import { sendEmail } from "../../utils/sendEmail";
async function handler(req: Request) {
  try {
    const body = await req.json();
    if (req.method === "POST") {
      const userPayload = insertUserSchema.parse(body);
      const businessPayload = body.business
        ? insertBusinessSchema.parse(body.business)
        : null;
      const payload = insertUserSchema.parse(body);
      const verification_code = generateOtp();

      const hashedPassword = await bcrypt.hash(payload.password, 10);
      const hashedVerificationCode = await bcrypt.hash(verification_code, 10);

      const stripeAccount = await stripe.customers.create({
        email: userPayload.email,
        name: `${userPayload.first_name} ${userPayload.last_name}`,
      });

      const business = businessPayload
        ? await db.insert(businesses).values(businessPayload).returning()
        : null;

      const user = await db
        .insert(users)
        .values({
          ...userPayload,
          password: hashedPassword,
          verification_code: hashedVerificationCode,
          business_id: business ? business[0].id : null,
          stripe_id: stripeAccount.id,
        })
        .returning();

      await sendEmail("Email Verification", {
        email: payload.email,
        verification_code: verification_code,
      });

      return NextResponse.json(
        {
          success: true,
          data: { ...user[0], id: BigInt(user[0].id).toString() },
        },
        { status: 201 }
      );
    }
  } catch (err) {
    return errorHandler(err);
  }
}

export { handler as POST };
