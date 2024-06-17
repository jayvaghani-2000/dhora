"use server";

import jwt from "jsonwebtoken";
import { User } from "lucia";
import { validateBusinessToken } from "@/actions/_utils/validateToken";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { config } from "@/config";
import { db } from "@/lib/db";
import { contracts } from "@/db/schema";
import { and, eq } from "drizzle-orm";

const handler = async (user: User, templateId?: string) => {
  try {
    if (templateId) {
      const contract = await db.query.contracts.findFirst({
        where: and(
          eq(contracts.template_id, Number(templateId)),
          eq(contracts.business_id, user.business_id!)
        ),
      });

      if (contract?.business_id === user.business_id) {
        const token = jwt.sign(
          {
            user_email: config.env.DOCU_SEAL_EMAIL,
            name: "New Contract",
            folder_name: String(user.business_id),
            template_id: templateId,
          },
          config.env.DOCU_SEAL
        );

        return {
          success: true as true,
          data: { token, contract: contract },
        };
      }
    }

    const token = jwt.sign(
      {
        user_email: config.env.DOCU_SEAL_EMAIL,
        name: "New Contract",
        folder_name: String(user.business_id),
      },
      config.env.DOCU_SEAL
    );

    return { success: true as true, data: { token } };
  } catch (err) {
    return errorHandler(err);
  }
};

export const initiateContract: (
  templateId?: string
) => Promise<Awaited<ReturnType<typeof handler>>> =
  validateBusinessToken(handler);
