"use server";

import { addOnsGroups } from "@/db/schema";
import { db } from "@/lib/db";
import { validateBusinessToken } from "@/actions/_utils/validateToken";
import { User } from "lucia";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { stringifyBigint } from "@/actions/_utils/stringifyBigint";
import { and, eq } from "drizzle-orm";

const handler = async (user: User) => {
  try {
    const data = await db.query.addOnsGroups.findMany({
      where: and(
        eq(addOnsGroups.business_id, user.business_id!),
        eq(addOnsGroups.deleted, false)
      ),
    });

    return {
      success: true as true,
      data: data.map(i => stringifyBigint(i)),
    };
  } catch (err) {
    return errorHandler(err);
  }
};

export const getAddOnGroups: () => Promise<
  Awaited<ReturnType<typeof handler>>
> = validateBusinessToken(handler);
