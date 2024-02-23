"use server";

import { validateBusinessToken } from "@/actions/_utils/validateToken";
import { User } from "lucia";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { config } from "@/config";
import axios from "axios";
import { SubmittedTemplateType } from "./_utils/submittedContract.type";
import { errorType } from "@/actions/_utils/types.type";

const handler = async (user: User) => {
  try {
    const data = [] as SubmittedTemplateType["data"];
    let dataThisTime = [] as SubmittedTemplateType["data"];
    let next = 0;
    do {
      const options = {
        method: "GET",
        url: next
          ? `https://api.docuseal.co/submitters?external_id=${user.business_id!.toString()}&after=${next}&limit=100`
          : `https://api.docuseal.co/submitters?external_id=${user.business_id!.toString()}&limit=100`,
        headers: { "X-Auth-Token": config.env.DOCU_SEAL },
      };

      const res: { data: SubmittedTemplateType } = await axios.request(options);

      next = res.data.pagination.next;
      data.push(...res.data.data);
      dataThisTime = res.data.data;
    } while (dataThisTime.length > 0);

    return { success: true as true, data: data };
  } catch (err) {
    return errorHandler(err);
  }
};

export const getSubmittedContracts: () => Promise<
  | {
      success: true;
      data: SubmittedTemplateType["data"];
      error?: never;
    }
  | errorType
> = validateBusinessToken(handler);
