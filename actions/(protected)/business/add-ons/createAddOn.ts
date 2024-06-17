"use server";

import { z } from "zod";
import { User } from "lucia";
import { addOns, createAddOnSchema } from "@/db/schema";
import { db } from "@/lib/db";
import { validateBusinessToken } from "@/actions/_utils/validateToken";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { revalidate } from "@/actions/(public)/revalidate";
import { redirect } from "next/navigation";
import { trimRichEditor } from "@/lib/common";

const handler = async (
  user: User,
  values: z.infer<typeof createAddOnSchema>
) => {
  const { description, max_unit, add_on_group_id, name, ...rest } = values;
  try {
    const data = await db
      .insert(addOns)
      .values({
        business_id: user.business_id!,
        max_unit: max_unit,
        add_on_group_id: add_on_group_id ? add_on_group_id : null,
        name: name.trim(),
        description: trimRichEditor(description),
        ...rest,
      })
      .returning();

    return { success: true as true, data: data[0] };
  } catch (err) {
    return errorHandler(err);
  }
};

const createAddOnHandler = async (
  user: User,
  values: z.infer<typeof createAddOnSchema>
) => {
  const res = await handler(user, values);

  if (res.success) {
    await revalidate("/business/business-profile");
    redirect(`/business/business-profile/add-ons/${res.data.id}`);
  }
  return res;
};

export const createAddOn: (
  values: z.infer<typeof createAddOnSchema>
) => Promise<Awaited<ReturnType<typeof createAddOnHandler>>> =
  validateBusinessToken(createAddOnHandler);
