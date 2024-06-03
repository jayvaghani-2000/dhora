"use server";

import { z } from "zod";
import { User } from "lucia";
import { packages } from "@/db/schema";
import { db } from "@/lib/db";
import { validateBusinessToken } from "@/actions/_utils/validateToken";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { createPackageSchema } from "@/db/schema";
import { revalidate } from "@/actions/(public)/revalidate";
import { redirect } from "next/navigation";
import { trimRichEditor } from "@/lib/common";

const handler = async (
  user: User,
  values: z.infer<typeof createPackageSchema>
) => {
  const {
    description,
    fixed_priced,
    max_unit,
    min_unit,
    unit,
    package_group_id,
    deposit,
    deposit_type,
    name,
    ...rest
  } = values;
  try {
    const data = await db
      .insert(packages)
      .values({
        business_id: user.business_id!,
        fixed_priced: fixed_priced,
        unit: fixed_priced ? null : unit,
        min_unit: fixed_priced ? null : min_unit,
        max_unit: fixed_priced ? null : max_unit,
        package_group_id: package_group_id ? package_group_id : null,
        deposit: deposit,
        deposit_type: deposit ? deposit_type : null,
        name: name.trim(),
        ...rest,
        description: trimRichEditor(description),
      })
      .returning();

    return { success: true as true, data: data[0] };
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
    redirect(`/business/business-profile/packages/${res.data.id}`);
  }
  return res;
};

export const createPackage: (
  values: z.infer<typeof createPackageSchema>
) => Promise<Awaited<ReturnType<typeof createPackageHandler>>> =
  validateBusinessToken(createPackageHandler);
