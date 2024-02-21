"use server";

import { validateBusinessToken } from "@/actions/_utils/validateToken";
import { User } from "lucia";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { config } from "@/config";
import axios from "axios";

const handler = async (user: User) => {
  const options = {
    method: "GET",
    url: `https://api.docuseal.co/submitters?external_id=${user.business_id!.toString()}`,
    headers: { "X-Auth-Token": config.env.DOCU_SEAL },
  };

  try {
    const res = await axios.request(options);
    return { success: true, data: res.data };
  } catch (err) {
    return errorHandler(err);
  }
};

export const getSubmittedContracts = validateBusinessToken(handler);
