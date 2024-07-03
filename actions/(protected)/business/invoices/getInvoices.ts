"use server";

import { invoices } from "@/db/schema";
import { db } from "@/lib/db";
import { desc, eq } from "drizzle-orm";
import { validateBusinessToken } from "@/actions/_utils/validateToken";
import { User } from "lucia";
import { errorHandler } from "@/actions/_utils/errorHandler";

const handler = async (user: User) => {
  try {
    const data = await db.query.invoices.findMany({
      where: eq(invoices.business_id, user.business_id!),
      orderBy: [desc(invoices.updated_at)],
      with: {
        event: true
      }
    });

    return { success: true as true, data: data };
  } catch (err) {
    return errorHandler(err);
  }
};

export const getInvoices: () => Promise<Awaited<ReturnType<typeof handler>>> =
  validateBusinessToken(handler);
