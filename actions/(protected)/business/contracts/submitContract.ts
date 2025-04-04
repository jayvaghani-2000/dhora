"use server";

import { validateBusinessToken } from "@/actions/_utils/validateToken";
import { User } from "lucia";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { config } from "@/config";
import axios from "axios";
import { db } from "@/lib/db";
import { and, eq } from "drizzle-orm";
import { contracts } from "@/db/schema";

type paramsType = { id: string; email: string; event_id?: string };

const handler = async (user: User, data: paramsType) => {
  // check is template deleted

  const contract = await db.query.contracts.findFirst({
    where: and(eq(contracts.id, data.id), eq(contracts.deleted, false)),
  });

  if (!contract) {
    throw new Error("Contract not found");
  }

  let options = {
    method: "POST",
    url: "https://api.docuseal.co/submissions",
    headers: {
      "X-Auth-Token": config.env.DOCU_SEAL,
      "content-type": "application/json",
    },
    data: {
      id: data.id,
      send_email: true,
      submitters: [
        {
          email: data.email,
          external_id: data.event_id!.toString() ?? "", // event_id
        },
      ],
    },
  };

  try {
    await axios.request(options);
    return { success: true as true, data: "Contract sent successfully." };
  } catch (err) {
    return errorHandler(err);
  }
};

export const submitContract: (
  params: paramsType
) => Promise<Awaited<ReturnType<typeof handler>>> =
  validateBusinessToken(handler);
