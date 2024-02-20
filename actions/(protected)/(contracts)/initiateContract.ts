"use server";

import jwt from "jsonwebtoken";
import { User } from "lucia";
import { validateBusinessToken } from "@/actions/_utils/validateToken";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { config } from "@/config";
import { db } from "@/lib/db";
import { contracts } from "@/db/schema";
import { eq } from "drizzle-orm";

const handler = async (user: User, templateId: string) => {
  try {
    if (templateId) {
      const contract = await db.query.contracts.findFirst({
        where: eq(contracts.template_id, Number(templateId)),
      });

      if (contract?.business_id === user.business_id) {
        const token = jwt.sign(
          {
            user_email: "jay.vaghani@propelius.tech",
            name: "New Contract",
            folder_name: user.email,
            template_id: templateId,
          },
          config.env.DOCU_SEAL
        );
        return { success: true, data: token };
      }
    }

    const token = jwt.sign(
      {
        user_email: "jay.vaghani@propelius.tech",
        name: "New Contract",
        folder_name: user.email,
      },
      config.env.DOCU_SEAL
    );

    return { success: true, data: token };
  } catch (err) {
    return errorHandler(err);
  }
};

export const initiateContract = validateBusinessToken(handler);
