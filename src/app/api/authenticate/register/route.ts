import { errorHandler } from "@/common/api/error";
import { db } from "@/db";
import { business, users } from "@/db/schema";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { generateOtp } from "../../utils/generateOtp";
import { sendEmail } from "../../utils/sendEmail";
import { stripeInstance } from "../../utils/stripe";
import { RegisterUserSchema } from "../schema";
async function handler(req: Request) {
  try {
    const body = await req.json();
    if (req.method === "POST") {
      const payload = RegisterUserSchema.parse(body);
      const { business_name, business_type, user_type, ...rest } = payload;
      const verification_code = generateOtp();

      const hashedPassword = await bcrypt.hash(payload.password, 10);
      const hashedVerificationCode = await bcrypt.hash(verification_code, 10);

      const customer = await stripeInstance.customers.create({
        email: payload.email,
        name: `${payload.first_name} ${payload.last_name}`,
      });

      const user = await db
        .insert(users)
        .values({
          ...rest,
          password: hashedPassword,
          verification_code: hashedVerificationCode,
          stripe_id: customer.id,
        })
        .returning();

      await sendEmail("Email Verification", {
        email: payload.email,
        verification_code: verification_code,
      });

      if (user_type === "business_user") {
        await db.insert(business).values({
          name: business_name,
          business_type: business_type,
          user_id: user[0].id,
        });
      }

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
