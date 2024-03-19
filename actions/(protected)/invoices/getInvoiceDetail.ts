"use server";

import { invoices } from "@/db/schema";
import { db } from "@/lib/db";
import { and, eq } from "drizzle-orm";
import { validateBusinessToken } from "@/actions/_utils/validateToken";
import { User } from "lucia";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { stringifyBigint } from "@/actions/_utils/stringifyBigint";
import { redirect } from "next/navigation";
import { DEFAULT_BUSINESS_LOGIN_REDIRECT } from "@/routes";
import { errorType } from "@/actions/_utils/types.type";

type mode = "view" | "edit";

type paramsType = { id: string; mode?: mode };

const handler = async (user: User, { id, mode = "view" }: paramsType) => {
  try {
    const data = await db.query.invoices.findFirst({
      where: and(
        eq(invoices.id, BigInt(id)),
        eq(invoices.business_id, user.business_id!)
      ),
      with: {
        business: true,
      },
    });

    if (mode === "edit" && data?.status !== "draft") {
      return { success: false, error: "Unable to update invoice" } as errorType;
    } else {
      return { success: true as true, data: stringifyBigint(data) };
    }
  } catch (err) {
    return errorHandler(err);
  }
};

const getInvoiceDetailHandler = async (
  user: User,
  { id, mode = "view" }: paramsType
) => {
  const res = await handler(user, { id, mode });

  if (mode === "edit" && !res.success) {
    redirect("/business/invoices");
  }
  return res;
};

export const getInvoiceDetail: (
  params: paramsType
) => Promise<Awaited<ReturnType<typeof getInvoiceDetailHandler>>> =
  validateBusinessToken(getInvoiceDetailHandler);
