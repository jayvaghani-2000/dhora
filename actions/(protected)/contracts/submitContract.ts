"use server";

import { validateBusinessToken } from "@/actions/_utils/validateToken";
import { User } from "lucia";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { config } from "@/config";
import axios from "axios";

type paramsType = { templateId: string; email: string };

const handler = async (user: User, data: paramsType) => {
  let options = {
    method: "POST",
    url: "https://api.docuseal.co/submissions",
    headers: {
      "X-Auth-Token": config.env.DOCU_SEAL,
      "content-type": "application/json",
    },
    data: {
      template_id: Number(data.templateId),
      send_email: true,
      submitters: [
        {
          email: data.email,
          external_id: user.business_id?.toString(),
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
