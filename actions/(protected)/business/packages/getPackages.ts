"use server";

import { packages } from "@/db/schema";
import { db } from "@/lib/db";
import { validateToken } from "@/actions/_utils/validateToken";
import { User } from "lucia";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { and, desc, eq } from "drizzle-orm";

const handler = async (user: User, businessId?: string) => {
  try {
    const data = await db.query.packages.findMany({
      where: and(
        eq(
          packages.business_id,
          businessId ? businessId : (user.business_id as string)
        ),
        eq(packages.deleted, false)
      ),
      with: {
        assets: true,
      },
      orderBy: [desc(packages.updated_at)],
    });

    return {
      success: true as true,
      data: data,
    };
  } catch (err) {
    return errorHandler(err);
  }
};

export const getPackages: (
  businessId?: string
) => Promise<Awaited<ReturnType<typeof handler>>> = validateToken(handler);
