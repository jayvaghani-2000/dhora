"use server";

import { businesses, invoices } from "@/db/schema";
import { db } from "@/lib/db";
import { and, eq } from "drizzle-orm";
import { validateBusinessToken } from "@/actions/_utils/validateToken";
import { User } from "lucia";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { stripe } from "@/lib/stripe";
import {
  createInvoiceSchemaType,
  errorType,
} from "@/actions/_utils/types.type";
import { generateInvoicePdf } from "../invoices/generateInvoicePdf";
import {
  amountToFixed,
  generateBreakdownPrice,
  itemRateWithFeeAndTaxes,
} from "@/lib/common";

export const getInvoiceInfo = async (invoiceId: string, businessId: bigint) => {
  return await db.query.invoices.findFirst({
    where: and(
      eq(invoices.id, BigInt(invoiceId)),
      eq(invoices.business_id, businessId)
    ),
    with: {
      business: true,
    },
  });
};

type paramsType = { invoiceId: string; file: FormData };

const handler = async (user: User, params: paramsType) => {
  const { invoiceId, file } = params;
  try {
    const [data, business] = await Promise.all([
      await getInvoiceInfo(invoiceId, user.business_id!),
      await db.query.businesses.findFirst({
        where: and(eq(businesses.id, user.business_id!)),
      }),
    ]);

    const items = data?.items as createInvoiceSchemaType["items"];

    const priceBreakdown = generateBreakdownPrice(
      items,
      data?.tax ?? 0,
      data?.platform_fee
    );

    if (data?.status !== "draft") {
      return {
        success: false,
        error: "Invoice already generated!",
      } as errorType;
    }

    const products = await Promise.all(
      items.map(async item => {
        return await stripe.products.create(
          {
            name: item.name,
            description: item.description,
          },
          { stripeAccount: business?.stripe_id! }
        );
      })
    );
    const prices = await Promise.all(
      products.map(async (product, index) => {
        const itemPrice = itemRateWithFeeAndTaxes(
          items[index],
          data.tax,
          data.platform_fee
        );
        return await stripe.prices.create(
          {
            currency: "usd",
            unit_amount: parseInt(String(amountToFixed(itemPrice.total) * 100)),
            product: product.id,
            tax_behavior: "inclusive",
          },
          { stripeAccount: business?.stripe_id! }
        );
      })
    );

    const session = await stripe.paymentLinks.create(
      {
        payment_method_types: [
          "card",
          "affirm",
          "klarna",
          "afterpay_clearpay",
          "us_bank_account",
        ],
        line_items: prices.map((price, index) => {
          return {
            price: price.id,
            quantity: items[index].quantity,
          };
        }),
        application_fee_amount: parseInt(
          String(amountToFixed(priceBreakdown.platformFee) * 100)
        ),
        metadata: {
          invoice_id: invoiceId,
        },
      },
      { stripeAccount: business?.stripe_id! }
    );

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

    return await generateInvoicePdf({
      invoice: data!,
      paymentLink: session.url,
      file: file,
    });
  } catch (err) {
    console.log("AAAAAAAAAAAAA", err);
    return errorHandler(err);
  }
};

export const checkout: (
  params: paramsType
) => Promise<Awaited<ReturnType<typeof handler>>> =
  validateBusinessToken(handler);
