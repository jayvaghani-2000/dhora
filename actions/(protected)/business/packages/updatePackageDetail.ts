"use server";

import { z } from "zod";
import { User } from "lucia";
import { editInvoiceSchema, invoices, packages } from "@/db/schema";
import { db } from "@/lib/db";
import { validateBusinessToken } from "@/actions/_utils/validateToken";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { and, eq } from "drizzle-orm";
import { errorType } from "@/actions/_utils/types.type";
import { editPackageSchema } from "@/db/schema";
import { trimRichEditor } from "@/lib/common";
import { revalidate } from "@/actions/(public)/revalidate";
import { redirect } from "next/navigation";

type paramType = z.infer<typeof editPackageSchema>;

const handler = async (user: User, values: paramType) => {
  const {
    id,
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

  const validatedFields = editPackageSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!", success: false } as errorType;
  }

  try {
    const updatedPackage = await db
      .update(packages)
      .set({
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
      .where(
        and(
          eq(packages.id, id),
          eq(packages.business_id, user.business_id!),
          eq(packages.deleted, false)
        )
      )
      .returning();

    if (updatedPackage && updatedPackage[0]) {
      return {
        success: true as true,
        data: updatedPackage[0],
      };
    } else {
      return {
        success: false,
        error: "Unable to update package!",
      } as errorType;
    }
  } catch (err) {
    console.log("err", err);
    return errorHandler(err);
  }
};

const updatePackageDetailHandler = async (user: User, values: paramType) => {
  const res = await handler(user, values);

  if (res.success) {
    await revalidate("/business/business-profile/packages");
    redirect("/business/business-profile/packages");
  }
  return res;
};

export const updatePackageDetail: (
  values: paramType
) => Promise<Awaited<ReturnType<typeof updatePackageDetailHandler>>> =
  validateBusinessToken(updatePackageDetailHandler);
