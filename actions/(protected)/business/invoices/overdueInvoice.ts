"use server";

import { invoices } from "@/db/schema";
import { db } from "@/lib/db";
import { and, eq, lte } from "drizzle-orm";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { stripe } from "@/lib/stripe";

type mode = "view" | "edit";

export const overdueInvoice = async () => {
  try {
    const data = await db.query.invoices.findMany({
      where: and(
        eq(invoices.status, "pending"),
        lte(invoices.due_date, new Date())
      ),
    });

    await Promise.all(
      data.map(async invoice => {
        if (invoice.stripe_ref) {
          await stripe.paymentLinks.update(invoice.stripe_ref, {
            active: false,
          });
        }
        await db
          .update(invoices)
          .set({
            status: "overdue",
          })
          .where(eq(invoices.id, invoice.id));
      })
    );

    return { success: true as true, data: "Invoice overdue successfully!" };
  } catch (err) {
    console.log(err);
    return errorHandler(err);
  }
};
