"use server";

import { packages } from "@/db/schema";
import { db } from "@/lib/db";
import { and, eq } from "drizzle-orm";
import { validateBusinessToken } from "@/actions/_utils/validateToken";
import { User } from "lucia";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { revalidate } from "@/actions/(public)/revalidate";
import { redirect } from "next/navigation";

const handler = async (user: User, packageId: string) => {
  try {
    await db
      .update(packages)
      .set({
        deleted: true,
      })
      .where(
        and(
          eq(packages.id, BigInt(packageId)),
          eq(packages.business_id, user.business_id!)
        )
      );

    return {
      success: true as true,
      data: "Package deleted successfully!",
    };
  } catch (err) {
    return errorHandler(err);
  }
};

const deletePackageHandler = async (user: User, packageId: string) => {
  const res = await handler(user, packageId);

  if (res.success) {
    await revalidate("/business/business-profile/packages");
    redirect("/business/business-profile/packages");
  }
  return res;
};

export const deletePackage: (
  packageId: string
) => Promise<Awaited<ReturnType<typeof deletePackageHandler>>> =
  validateBusinessToken(deletePackageHandler);
