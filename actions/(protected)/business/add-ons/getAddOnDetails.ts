"use server";

import { addOns } from "@/db/schema";
import { db } from "@/lib/db";
import { validateBusinessToken } from "@/actions/_utils/validateToken";
import { User } from "lucia";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { and, eq } from "drizzle-orm";
import { errorType } from "@/actions/_utils/types.type";

const handler = async (user: User, addOnId: string) => {
  try {
    const data = await db.query.addOns.findFirst({
      where: and(eq(addOns.id, addOnId), eq(addOns.deleted, false)),
    });

    if (!data) {
      return {
        success: false,
        error: "Add on not found",
      } as errorType;
    }

    return {
      success: true as true,
      data: data,
    };
  } catch (err) {
    return errorHandler(err);
  }
};

export const getAddOnDetails: (
  addOnId: string
) => Promise<Awaited<ReturnType<typeof handler>>> =
  validateBusinessToken(handler);
