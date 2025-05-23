"use server";

import { contracts } from "@/db/schema";
import { db } from "@/lib/db";
import { and, eq } from "drizzle-orm";
import { validateBusinessToken } from "@/actions/_utils/validateToken";
import { User } from "lucia";
import { errorHandler } from "@/actions/_utils/errorHandler";

const handler = async (user: User) => {
  try {
    const data = await db.query.contracts.findMany({
      where: and(
        eq(contracts.business_id, user.business_id!),
        eq(contracts.deleted, false)
      ),
    });

    return { success: true as true, data: data };
  } catch (err) {
    return errorHandler(err);
  }
};

export const getContracts: () => Promise<Awaited<ReturnType<typeof handler>>> =
  validateBusinessToken(handler);
