import { config } from "@/config";
import { businesses } from "@/db/schema";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import Stripe from "stripe";

async function handler(req: Request) {
  try {
    switch (req.method) {
      case "POST": {
        const { body, headers } = req;
        const rawBody = await getRawBody(req);
        const signature = headers.get("stripe-signature");

        if (!body || !signature) {
          console.error("Bad request from stripe");
          return NextResponse.json(
            {
              success: false,
            },
            {
              status: 400,
            }
          );
        }

        let event: Stripe.Event = JSON.parse(rawBody.toString());

        try {
          event = stripe.webhooks.constructEvent(
            rawBody,
            signature,
            config.env.STRIPE_WEBHOOK_SECRET
          );
        } catch (err) {
          console.log(`⚠️  Webhook signature verification failed.`, err);
          return NextResponse.json(
            {
              success: false,
            },
            {
              status: 400,
            }
          );
        }

        switch (event.type) {
          case "account.updated":
            const account = event.data.object;
            if (account.charges_enabled) {
              console.log(
                `Account enabled updated received for account id: ${account.id}`
              );
              await db
                .update(businesses)
                .set({
                  stripe_account_verified: new Date(),
                })
                .where(eq(businesses.stripe_id, account.id));
            }
            break;
          default:
            console.log(`Unhandled event type ${event.type}.`);
        }

        return NextResponse.json(
          {
            success: true,
          },
          {
            status: 200,
          }
        );
      }
      default: {
        return NextResponse.json(
          { message: "Method not allowed." },
          {
            headers: {
              Allow: "POST",
            },
            status: 405,
          }
        );
      }
    }
  } catch (err) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export { handler as POST };

async function getRawBody(request: Request) {
  let chunks = [];
  let done = false;
  const reader = (request.body as ReadableStream<Uint8Array>).getReader();
  while (!done) {
    const { value, done: isDone } = await reader.read();
    if (value) {
      chunks.push(value);
    }
    done = isDone;
  }
  const bodyData = new Uint8Array(
    chunks.reduce((acc, chunk) => acc + chunk.length, 0)
  );
  let offset = 0;
  for (const chunk of chunks) {
    bodyData.set(chunk, offset);
    offset += chunk.length;
  }
  return Buffer.from(bodyData);
}
