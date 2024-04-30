"use server";

import { z } from "zod";
import { User } from "lucia";
import { addOns, updateAddOnSchema } from "@/db/schema";
import { db } from "@/lib/db";
import { validateBusinessToken } from "@/actions/_utils/validateToken";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { and, eq } from "drizzle-orm";
import { errorType } from "@/actions/_utils/types.type";
import { stringifyBigint } from "@/actions/_utils/stringifyBigint";
import { trimRichEditor } from "@/lib/common";
import { revalidate } from "@/actions/(public)/revalidate";
import { redirect } from "next/navigation";

type paramType = z.infer<typeof updateAddOnSchema>;

const handler = async (user: User, values: paramType) => {
  const { id, description, max_unit, add_on_group_id, name, ...rest } = values;

  const validatedFields = updateAddOnSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!", success: false } as errorType;
  }

  try {
    const updatedAddOn = await db
      .update(addOns)
      .set({
        business_id: user.business_id!,
        max_unit: max_unit,
        add_on_group_id: add_on_group_id ? BigInt(add_on_group_id) : null,
        name: name.trim(),
        description: trimRichEditor(description),
        ...rest,
      })
      .where(
        and(
          eq(addOns.id, BigInt(id)),
          eq(addOns.business_id, user.business_id!),
          eq(addOns.deleted, false)
        )
      )
      .returning();

    if (updatedAddOn && updatedAddOn[0]) {
      return {
        success: true as true,
        data: stringifyBigint(updatedAddOn[0]),
      };
    } else {
      return {
        success: false,
        error: "Unable to update add on!",
      } as errorType;
    }
  } catch (err) {
    console.log("err", err);
    return errorHandler(err);
  }
};

const updateAddOnDetailHandler = async (user: User, values: paramType) => {
  const res = await handler(user, values);

  if (res.success) {
    await revalidate("/business/business-profile/add-ons");
    redirect("/business/business-profile/add-ons");
  }
  return res;
};

export const updateAddOnDetail: (
  values: paramType
) => Promise<Awaited<ReturnType<typeof updateAddOnDetailHandler>>> =
  validateBusinessToken(updateAddOnDetailHandler);
