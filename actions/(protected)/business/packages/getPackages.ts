"use server";

import { packages } from "@/db/schema";
import { db } from "@/lib/db";
import { validateBusinessToken } from "@/actions/_utils/validateToken";
import { User } from "lucia";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { stringifyBigint } from "@/actions/_utils/stringifyBigint";
import { and, desc, eq } from "drizzle-orm";

const handler = async (user: User) => {
  try {
    const data = await db.query.packages.findMany({
      where: and(
        eq(packages.business_id, user.business_id!),
        eq(packages.deleted, false)
      ),
      orderBy: [desc(packages.updated_at)],
    });

    return {
      success: true as true,
      data: stringifyBigint(data),
    };
  } catch (err) {
    return errorHandler(err);
  }
};

export const getPackages: () => Promise<Awaited<ReturnType<typeof handler>>> =
  validateBusinessToken(handler);
