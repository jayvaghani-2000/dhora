"use server";

import { z } from "zod";
import { User } from "lucia";
import { editInvoiceSchema, invoices, payViaTypeEnum } from "@/db/schema";
import { db } from "@/lib/db";
import { validateBusinessToken } from "@/actions/_utils/validateToken";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { and, eq } from "drizzle-orm";
import { errorType } from "@/actions/_utils/types.type";
import { revalidate } from "@/actions/(public)/revalidate";

type paramsType = {
  id: string;
  value: "stripe" | "cash" | "cheque";
};

const handler = async (user: User, params: paramsType) => {
  const { id, value } = params;
  try {
    const invoice = await db
      .update(invoices)
      .set({
        pay_via: value,
      })
      .where(
        and(eq(invoices.id, id), eq(invoices.business_id, user.business_id!))
      )
      .returning();

    if (invoice && invoice[0]) {
      return {
        success: true as true,
        data: invoice[0],
      };
    } else {
      return {
        success: false,
        error: "Unable to update invoice!",
      } as errorType;
    }
  } catch (err) {
    console.log("err", err);
    return errorHandler(err);
  }
};

const updateInvoicePayModeHandler = async (user: User, params: paramsType) => {
  const res = await handler(user, params);

  if (res.success) {
    await revalidate(`/business/invoices`);
  }
  return res;
};

export const updateInvoicePayMode: (
  params: paramsType
) => Promise<Awaited<ReturnType<typeof updateInvoicePayModeHandler>>> =
  validateBusinessToken(updateInvoicePayModeHandler);
