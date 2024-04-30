"use server";

import { addOns } from "@/db/schema";
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
      .update(addOns)
      .set({
        deleted: true,
      })
      .where(
        and(
          eq(addOns.id, BigInt(packageId)),
          eq(addOns.business_id, user.business_id!)
        )
      );

    return {
      success: true as true,
      data: "Add on deleted successfully!",
    };
  } catch (err) {
    return errorHandler(err);
  }
};

const deleteAddOnHandler = async (user: User, addOnId: string) => {
  const res = await handler(user, addOnId);

  if (res.success) {
    await revalidate("/business/business-profile/add-ons");
    redirect("/business/business-profile/add-ons");
  }
  return res;
};

export const deleteAddOn: (
  addOnId: string
) => Promise<Awaited<ReturnType<typeof deleteAddOnHandler>>> =
  validateBusinessToken(deleteAddOnHandler);
