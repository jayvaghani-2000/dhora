"use server";

import { User } from "lucia";
import { validateBusinessToken } from "@/actions/_utils/validateToken";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { db } from "@/lib/db";
import { recipients, templates } from "@/db/schema";
import { and, asc, count, eq } from "drizzle-orm";

const handler = async (
  user: User,
  values: {
    perPage: number;
    page: number;
  }
) => {
  try {
    const totalTemplates = await db.query.templates.findMany({
      where: and(eq(templates.business_id, user.business_id!)),
    });

    const getTemplates = await db.query.templates.findMany({
      where: and(eq(templates.business_id, user.business_id!)),
      with: {
        fields: true,
        contracts: true,
        signatures: true,
        templateMeta: true,
        recipients: {
          orderBy: [asc(recipients.created_at)],
        },
      },
      orderBy: [asc(templates.created_at)],
      limit: values?.perPage ?? 10,
      offset: (values?.page - 1) * (values?.perPage ?? 10),
    });

    return {
      success: true as true,
      data: {
        templates: getTemplates,
        totalPages: Math.ceil(totalTemplates.length / (values?.perPage ?? 10)),
      },
    };
  } catch (err) {
    return errorHandler(err);
  }
};

export const getTemplates: (values: {
  perPage: number;
  page: number;
}) => Promise<Awaited<ReturnType<typeof handler>>> =
  validateBusinessToken(handler);
