"use server";

import { invoices } from "@/db/schema";
import { db } from "@/lib/db";
import { and, eq } from "drizzle-orm";
import { validateBusinessToken } from "@/actions/_utils/validateToken";
import { User } from "lucia";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { stringifyBigint } from "@/actions/_utils/stringifyBigint";

const handler = async (user: User, id: string) => {
  try {
    const data = await db.query.invoices.findFirst({
      where: and(
        eq(invoices.id, BigInt(id)),
        eq(invoices.business_id, user.business_id!)
      ),
    });

    if (data?.status !== "draft") {
      return { success: false, error: "Unable to update invoice" };
    } else {
      return { success: true as true, data: stringifyBigint(data) };
    }
  } catch (err) {
    return errorHandler(err);
  }
};

export const getInvoiceDetail: (
  id: string
) => Promise<Awaited<ReturnType<typeof handler>>> =
  validateBusinessToken(handler);
