"use server";

import { User } from "lucia";
import { validateBusinessToken } from "@/actions/_utils/validateToken";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { db } from "@/lib/db";
import { recipients, templates } from "@/db/schema";
import { and, asc, eq } from "drizzle-orm";

const handler = async (user: User) => {
  try {
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
    });
    return {
      success: true as true,
      data: { templates: getTemplates },
    };
  } catch (err) {
    return errorHandler(err);
  }
};

export const getTemplates: () => Promise<Awaited<ReturnType<typeof handler>>> =
  validateBusinessToken(handler);
