"use server";

import { package_groups } from "@/db/schema";
import { db } from "@/lib/db";
import { validateBusinessToken } from "@/actions/_utils/validateToken";
import { User } from "lucia";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { stringifyBigint } from "@/actions/_utils/stringifyBigint";

const handler = async (user: User, name: string) => {
  try {
    const data = await db
      .insert(package_groups)
      .values({
        business_id: user.business_id!,
        name: name.trim(),
      })
      .returning();

    return {
      success: true as true,
      data: stringifyBigint(data[0]),
    };
  } catch (err) {
    return errorHandler(err);
  }
};

export const createPackageGroup: () => Promise<
  Awaited<ReturnType<typeof handler>>
> = validateBusinessToken(handler);
