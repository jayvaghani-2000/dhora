"use server";

import { packageGroups } from "@/db/schema";
import { db } from "@/lib/db";
import {
  validateBusinessToken,
  validateToken,
} from "@/actions/_utils/validateToken";
import { User } from "lucia";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { and, eq } from "drizzle-orm";

const handler = async (user: User, businessId?: string) => {
  try {
    const data = await db.query.packageGroups.findMany({
      where: and(
        eq(
          packageGroups.business_id,
          businessId ? businessId : (user.business_id as string)
        ),
        eq(packageGroups.deleted, false)
      ),
    });

    return {
      success: true as true,
      data: data,
    };
  } catch (err) {
    return errorHandler(err);
  }
};

export const getPackageGroups: (
  businessId?: string
) => Promise<Awaited<ReturnType<typeof handler>>> = validateToken(handler);
