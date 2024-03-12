"use server";

import { businesses, invoices, users } from "@/db/schema";
import { db } from "@/lib/db";
import { and, eq } from "drizzle-orm";
import { validateBusinessToken } from "@/actions/_utils/validateToken";
import { User } from "lucia";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { stripe } from "@/lib/stripe";
import { createInvoiceSchemaType } from "@/actions/_utils/types.type";
import { revalidatePath } from "next/cache";
import { generateInvoicePdf } from "../invoices/generateInvoicePdf";

const handler = async (user: User, invoiceId: string) => {
  try {
    const [data, business] = await Promise.all([
      await db.query.invoices.findFirst({
        where: and(
          eq(invoices.id, BigInt(invoiceId)),
          eq(invoices.business_id, user.business_id!)
        ),
      }),
      await db.query.businesses.findFirst({
        where: and(eq(businesses.id, user.business_id!)),
      }),
    ]);

    const items = data?.items as createInvoiceSchemaType["items"];

    const products = await Promise.all(
      items.map(async item => {
        return await stripe.products.create({
          name: item.name,
          description: item.description,
        });
      })
    );
    const prices = await Promise.all(
      products.map(async (product, index) => {
        return await stripe.prices.create({
          currency: "usd",
          unit_amount: items[index].price * 100,
          product: product.id,
          tax_behavior: "exclusive",
        });
      })
    );

    const session = await stripe.paymentLinks.create({
      payment_method_types: ["card"],
      line_items: prices.map((price, index) => {
        return {
          price: price.id,
          quantity: items[index].quantity,
        };
      }),
      application_fee_amount: 2000,
      transfer_data: {
        destination: business?.stripe_id!,
      },
      metadata: {
        invoice_id: invoiceId,
      },
    });

    await db
      .update(invoices)
      .set({
        stripe_ref: session.id,
        updated_at: new Date(),
        status: "pending",
      })
      .where(
        and(
          eq(invoices.id, BigInt(invoiceId)),
          eq(invoices.business_id, user.business_id!)
        )
      );

    await generateInvoicePdf({
      invoiceId: invoiceId,
      paymentLink: session.url,
    });

    revalidatePath("/business/invoices");
    return { success: true as true, data: session.url };
  } catch (err) {
    console.log(err);
    return errorHandler(err);
  }
};

export const checkout: (
  invoiceId: string
) => Promise<Awaited<ReturnType<typeof handler>>> =
  validateBusinessToken(handler);
