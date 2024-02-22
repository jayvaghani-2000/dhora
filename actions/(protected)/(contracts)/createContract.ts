"use server";

import { z } from "zod";
import { User } from "lucia";
import { contracts, createContractSchema } from "@/db/schema";
import { db } from "@/lib/db";
import { validateBusinessToken } from "@/actions/_utils/validateToken";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { revalidatePath } from "next/cache";

const handler = async (
  user: User,
  values: z.infer<typeof createContractSchema>
) => {
  try {
    const contract = await db
      .insert(contracts)
      .values({
        business_id: user.business_id!,
        template_id: values.template_id,
        name: values.name,
      })
      .returning();

    return { success: true, data: contract[0] };
  } catch (err) {
    return errorHandler(err);
  }
};

export const createContract = validateBusinessToken(handler);
