"use server";

import { z } from "zod";
import { User } from "lucia";
import { packages } from "@/db/schema";
import { db } from "@/lib/db";
import { validateBusinessToken } from "@/actions/_utils/validateToken";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { stringifyBigint } from "@/actions/_utils/stringifyBigint";
import { createPackageSchema } from "@/lib/schema";
import { revalidate } from "@/actions/(public)/revalidate";
import { redirect } from "next/navigation";
import { trimRichEditor } from "@/lib/common";

const handler = async (
  user: User,
  values: z.infer<typeof createPackageSchema>
) => {
  const { description, fixed_priced, max_unit, min_unit, unit, ...rest } =
    values;
  try {
    const data = await db
      .insert(packages)
      .values({
        business_id: user.business_id!,
        fixed_priced: fixed_priced,
        unit: fixed_priced ? null : unit,
        min_unit: fixed_priced ? null : min_unit,
        max_unit: fixed_priced ? null : max_unit,
        ...rest,
        description: trimRichEditor(description),
      })
      .returning();

    return { success: true as true, data: stringifyBigint(data[0]) };
  } catch (err) {
    return errorHandler(err);
  }
};

const createPackageHandler = async (
  user: User,
  values: z.infer<typeof createPackageSchema>
) => {
  const res = await handler(user, values);

  if (res.success) {
    await revalidate("/business/business-profile");
    redirect(`/business/business-profile/package/${res.data.id}`);
  }
  return res;
};

export const createPackage: (
  values: z.infer<typeof createPackageSchema>
) => Promise<Awaited<ReturnType<typeof createPackageHandler>>> =
  validateBusinessToken(createPackageHandler);
