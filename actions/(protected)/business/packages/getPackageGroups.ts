"use server";

import { package_groups } from "@/db/schema";
import { db } from "@/lib/db";
import { validateBusinessToken } from "@/actions/_utils/validateToken";
import { User } from "lucia";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { stringifyBigint } from "@/actions/_utils/stringifyBigint";
import { and, eq } from "drizzle-orm";

const handler = async (user: User) => {
  try {
    const data = await db.query.package_groups.findMany({
      where: and(eq(package_groups.business_id, user.business_id!)),
    });

    return {
      success: true as true,
      data: stringifyBigint(data),
    };
  } catch (err) {
    return errorHandler(err);
  }
};

export const getPackageGroups: () => Promise<
  Awaited<ReturnType<typeof handler>>
> = validateBusinessToken(handler);
