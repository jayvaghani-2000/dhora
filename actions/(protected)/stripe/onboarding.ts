"use server";

import { businesses } from "@/db/schema";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { validateBusinessToken } from "@/actions/_utils/validateToken";
import { User } from "lucia";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { stripe } from "@/lib/stripe";
import { config } from "@/config";

const handler = async (user: User) => {
  try {
    const businessObj = await db.query.businesses.findFirst({
      where: eq(businesses.id, user.business_id!),
    });

    let stripe_id = businessObj?.stripe_id ?? "";

    if (!stripe_id) {
      const account = await stripe.accounts.create({
        type: "standard",
        business_type: "individual",
        email: user.email,
        business_profile: {
          name: businessObj?.name,
        },
      });
      await db
        .update(businesses)
        .set({
          stripe_id: account.id,
          updated_at: new Date(),
        })
        .where(eq(businesses.id, user.business_id!));

      stripe_id = account.id;
    }

    const accountLink = await stripe.accountLinks.create({
      account: stripe_id,
      refresh_url: `${config.env.HOST_URL}/business/invoices`,
      return_url: `${config.env.HOST_URL}/business/invoices/generate`,
      type: "account_onboarding",
    });

    return { success: true as true, data: accountLink.url };
  } catch (err) {
    return errorHandler(err);
  }
};

export const onBoarding: () => Promise<Awaited<ReturnType<typeof handler>>> =
  validateBusinessToken(handler);
