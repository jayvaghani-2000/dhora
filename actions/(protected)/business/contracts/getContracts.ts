"use server";

import { contracts } from "@/db/schema";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { validateBusinessToken } from "@/actions/_utils/validateToken";
import { User } from "lucia";
import { errorHandler } from "@/actions/_utils/errorHandler";

const handler = async (user: User) => {
  try {
    const data = await db.query.contracts.findMany({
      where: eq(contracts.business_id, user.business_id!)
    });

    return { success: true as true, data: data };
  } catch (err) {
    return errorHandler(err);
  }
};

export const getContracts: () => Promise<Awaited<ReturnType<typeof handler>>> =
  validateBusinessToken(handler);
