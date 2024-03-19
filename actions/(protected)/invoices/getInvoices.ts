"use server";

import { invoices } from "@/db/schema";
import { db } from "@/lib/db";
import { desc, eq } from "drizzle-orm";
import { validateBusinessToken } from "@/actions/_utils/validateToken";
import { User } from "lucia";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { stringifyBigint } from "@/actions/_utils/stringifyBigint";

const handler = async (user: User) => {
  try {
    const data = await db.query.invoices.findMany({
      where: eq(invoices.business_id, user.business_id!),
      orderBy: [desc(invoices.updated_at)],
    });

    return { success: true as true, data: data.map(i => stringifyBigint(i)) };
  } catch (err) {
    return errorHandler(err);
  }
};

export const getInvoices: () => Promise<Awaited<ReturnType<typeof handler>>> =
  validateBusinessToken(handler);
