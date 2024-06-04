"use server";

import { invoices } from "@/db/schema";
import { db } from "@/lib/db";
import { desc, eq, or } from "drizzle-orm";
import { validateBusinessToken } from "@/actions/_utils/validateToken";
import { User } from "lucia";
import { errorHandler } from "@/actions/_utils/errorHandler";


type paramTypes = {
  event_id: string;
};

const handler = async (user: User, params: paramTypes) => {
  const { event_id } = params;
  try {
    const data = await db.query.invoices.findMany({
      where: eq(invoices.event_id, event_id),
      orderBy: [desc(invoices.updated_at)],
    });
    
    return { success: true as true, data: data };
  } catch (err) {
    return errorHandler(err);
  }
};

export const getInvoicesByEvent: (
  params: paramTypes
) => Promise<Awaited<ReturnType<typeof handler>>> =
  validateBusinessToken(handler);
