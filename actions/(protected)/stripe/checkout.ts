"use server";

import { invoices, users } from "@/db/schema";
import { db } from "@/lib/db";
import { and, eq } from "drizzle-orm";
import { validateBusinessToken } from "@/actions/_utils/validateToken";
import { User } from "lucia";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { stripe } from "@/lib/stripe";
import { createInvoiceSchemaType } from "@/actions/_utils/types.type";
import { config } from "@/config";

const handler = async (user: User, invoiceId: string) => {
  try {
    const [data, userDetail] = await Promise.all([
      await db.query.invoices.findFirst({
        where: and(
          eq(invoices.id, BigInt(invoiceId)),
          eq(invoices.business_id, user.business_id!)
        ),
      }),
      await db.query.users.findFirst({
        where: and(eq(users.id, user.id)),
      }),
    ]);

    const items = data?.items as createInvoiceSchemaType["items"];

    const line_items = items.map(item => {
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            description: item.description,
            metadata: {
              id: item.id,
            },
          },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      };
    });

    const product = await stripe.products.create({
      name: items[0].name,
      description: items[0].description,
    });

    const price = await stripe.prices.create({
      currency: "usd",
      unit_amount: 1000,
      product: product.id,
    });

    const session = await stripe.paymentLinks.create({
      payment_method_types: ["card"],
      shipping_address_collection: {
        allowed_countries: ["US", "IN"],
      },

      phone_number_collection: {
        enabled: true,
      },
      line_items: items.map(item => {
        return {
          price: "price_1OrbFzCbtf4F2IroxWi76CJU",
          quantity: item.quantity,
        };
      }),
      application_fee_amount: 500,
      transfer_data: {
        destination: "acct_1OrLzOE971bx1CXx",
      },
    });

    //acct_1OrLzOE971bx1CXx
    await db
      .update(invoices)
      .set({ stripe_ref: session.url, updated_at: new Date() })
      .where(
        and(
          eq(invoices.id, BigInt(invoiceId)),
          eq(invoices.business_id, user.business_id!)
        )
      );

    return { success: true, data: session.url };
  } catch (err) {
    console.log(err);
    return errorHandler(err);
  }
};

export const checkout: (
  invoiceId: string
) => Promise<Awaited<ReturnType<typeof handler>>> =
  validateBusinessToken(handler);
