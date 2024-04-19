"use server";

import { z } from "zod";
import { User } from "lucia";
import { contracts, createContractSchema } from "@/db/schema";
import { db } from "@/lib/db";
import { validateBusinessToken } from "@/actions/_utils/validateToken";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { and, eq } from "drizzle-orm";

const handler = async (
  user: User,
  values: z.infer<typeof createContractSchema>
) => {
  try {
    const contract = await db
      .update(contracts)
      .set({
        name: values.name,
      })
      .where(
        and(
          eq(contracts.business_id, user.business_id!),
          eq(contracts.template_id, values.template_id)
        )
      )
      .returning();
    return { success: true as true, data: contract[0] };
  } catch (err) {
    return errorHandler(err);
  }
};

export const updateContract: (
  values: z.infer<typeof createContractSchema>
) => Promise<Awaited<ReturnType<typeof handler>>> =
  validateBusinessToken(handler);
