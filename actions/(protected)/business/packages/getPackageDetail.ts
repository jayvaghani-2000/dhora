"use server";

import { packages } from "@/db/schema";
import { db } from "@/lib/db";
import { validateBusinessToken } from "@/actions/_utils/validateToken";
import { User } from "lucia";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { stringifyBigint } from "@/actions/_utils/stringifyBigint";
import { and, eq } from "drizzle-orm";
import { errorType } from "@/actions/_utils/types.type";

const handler = async (user: User, packageId: string) => {
  try {
    const data = await db.query.packages.findFirst({
      where: and(
        eq(packages.id, BigInt(packageId)),
        eq(packages.deleted, false)
      ),
      with: {
        assets: true,
      },
    });

    if (!data) {
      return {
        success: false,
        error: "Package not found",
      } as errorType;
    }

    return {
      success: true as true,
      data: stringifyBigint(data),
    };
  } catch (err) {
    return errorHandler(err);
  }
};

export const getPackageDetails: (
  packageId: string
) => Promise<Awaited<ReturnType<typeof handler>>> =
  validateBusinessToken(handler);
