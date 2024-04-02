"use server";

import { User } from "lucia";
import { businesses, users } from "@/db/schema";
import { db } from "@/lib/db";
import { validateBusinessToken } from "@/actions/_utils/validateToken";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { eq } from "drizzle-orm";
import { errorType } from "@/actions/_utils/types.type";

const handler = async (user: User) => {
  try {
    const userDetail = await db.query.users.findFirst({
      where: eq(users.id, user.id),
    });

    if (userDetail) {
      await Promise.all([
        await db
          .update(businesses)
          .set({
            deleted: true,
            user_id: BigInt(user.id),
            updated_at: new Date(),
          })
          .where(eq(businesses.id, userDetail.business_id!)),
        await db
          .update(users)
          .set({
            updated_at: new Date(),
            business_id: null,
          })
          .where(eq(users.id, userDetail.id)),
      ]);
      return {
        success: true as true,
        data: "Business deleted successfully.",
      };
    } else {
      return {
        success: false,
        error: "Error fetching user details.",
      } as errorType;
    }
  } catch (err) {
    return errorHandler(err);
  }
};

export const deleteBusiness: () => Promise<
  Awaited<ReturnType<typeof handler>>
> = validateBusinessToken(handler);
