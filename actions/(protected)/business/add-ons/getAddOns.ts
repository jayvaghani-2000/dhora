"use server";

import { addOns } from "@/db/schema";
import { db } from "@/lib/db";
import { validateBusinessToken } from "@/actions/_utils/validateToken";
import { User } from "lucia";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { stringifyBigint } from "@/actions/_utils/stringifyBigint";
import { and, desc, eq } from "drizzle-orm";

const handler = async (user: User) => {
  try {
    const data = await db.query.addOns.findMany({
      where: and(
        eq(addOns.business_id, user.business_id!),
        eq(addOns.deleted, false)
      ),
      orderBy: [desc(addOns.updated_at)],
    });

    return {
      success: true as true,
      data: data.map(i => stringifyBigint(i)),
    };
  } catch (err) {
    return errorHandler(err);
  }
};

export const getAddOns: () => Promise<Awaited<ReturnType<typeof handler>>> =
  validateBusinessToken(handler);
