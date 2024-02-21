"use server";

import jwt from "jsonwebtoken";
import { User } from "lucia";
import { validateBusinessToken } from "@/actions/_utils/validateToken";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { config } from "@/config";
import { db } from "@/lib/db";
import { contracts } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { stringifyBigint } from "@/actions/_utils/stringifyBigint";

const handler = async (user: User, templateId: string) => {
  try {
    if (templateId) {
      const contract = await getContractTemplate(templateId, user);

      if (contract?.business_id === user.business_id) {
        const token = jwt.sign(
          {
            user_email: "jay.vaghani@propelius.tech",
            name: "New Contract",
            folder_name: user.email,
            template_id: templateId,
            external_id: user.business_id.toString(),
          },
          config.env.DOCU_SEAL
        );
        return {
          success: true,
          data: { token, contract: stringifyBigint(contract) },
        };
      }
    }

    const token = jwt.sign(
      {
        user_email: "jay.vaghani@propelius.tech",
        name: "New Contract",
        folder_name: user.email,
        external_id: user.business_id!.toString(),
      },
      config.env.DOCU_SEAL
    );

    return { success: true, data: { token } };
  } catch (err) {
    return errorHandler(err);
  }
};

export const getContractTemplate = async (templateId: string, user: User) => {
  return db.query.contracts.findFirst({
    where: and(
      eq(contracts.template_id, Number(templateId)),
      eq(contracts.business_id, user.business_id!)
    ),
  });
};

export const initiateContract = validateBusinessToken(handler);
