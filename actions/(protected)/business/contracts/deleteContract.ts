"use server";

import { User } from "lucia";
import { contracts } from "@/db/schema";
import { db } from "@/lib/db";
import { validateBusinessToken } from "@/actions/_utils/validateToken";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { and, eq } from "drizzle-orm";
import { revalidate } from "@/actions/(public)/revalidate";
import { redirect } from "next/navigation";

const handler = async (user: User, id: string) => {
  try {
    await db
      .update(contracts)
      .set({
        deleted: true,
      })
      .where(
        and(eq(contracts.id, id), eq(contracts.business_id, user.business_id!))
      );

    return { success: true as true, data: "Contract deleted successfully!" };
  } catch (err) {
    return errorHandler(err);
  }
};

const deleteContractHandler = async (user: User, id: string) => {
  const res = await handler(user, id);

  if (res.success) {
    await revalidate("/business/contracts/template");
    redirect("/business/contracts");
  }
  return res;
};

export const deleteContract: (
  id: string
) => Promise<Awaited<ReturnType<typeof deleteContractHandler>>> =
  validateBusinessToken(deleteContractHandler);
