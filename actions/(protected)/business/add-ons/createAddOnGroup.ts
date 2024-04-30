"use server";

import { addOnsGroups } from "@/db/schema";
import { db } from "@/lib/db";
import { validateBusinessToken } from "@/actions/_utils/validateToken";
import { User } from "lucia";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { stringifyBigint } from "@/actions/_utils/stringifyBigint";
import { createAddOnGroupSchema } from "@/lib/schema";
import { z } from "zod";
import { revalidate } from "@/actions/(public)/revalidate";

type paramsType = z.infer<typeof createAddOnGroupSchema>;

const handler = async (user: User, value: paramsType) => {
  const { name } = value;
  try {
    const data = await db
      .insert(addOnsGroups)
      .values({
        business_id: user.business_id!,
        name: name.trim(),
      })
      .returning();

    await revalidate("/business/business-profile/add-ons");

    return {
      success: true as true,
      data: stringifyBigint(data[0]),
    };
  } catch (err) {
    return errorHandler(err);
  }
};

export const createAddOnGroup: (
  value: paramsType
) => Promise<Awaited<ReturnType<typeof handler>>> =
  validateBusinessToken(handler);
