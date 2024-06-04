"use server";

import { validateBusinessToken } from "@/actions/_utils/validateToken";
import { User } from "lucia";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { config } from "@/config";
import axios from "axios";
import { SubmittedTemplateType } from "./_utils/submittedContract.type";

type paramsType = { event_id: string };

const handler = async (user: User, data: paramsType) => {
  const { event_id } = data;

  console.log("event id::",event_id)
  try {
    const data = [] as SubmittedTemplateType["data"];
    let dataThisTime = [] as SubmittedTemplateType["data"];
    let next = 0;
    do {
      const options = {
        method: "GET",
        url: next
          ? `https://api.docuseal.co/submissions?q=${user.email!.toString()}&after=${next}&limit=100`
          : `https://api.docuseal.co/submissions?q=${user.email!.toString()}&limit=100`,
        headers: { "X-Auth-Token": config.env.DOCU_SEAL },
      };

      const res: { data: SubmittedTemplateType } = await axios.request(options);

      next = res.data.pagination.next;
      data.push(...res.data.data);
      dataThisTime = res.data.data;
      console.log("data :: ",dataThisTime[0].submitters)
    } while (dataThisTime.length > 0);

    return { success: true as true, data: data.filter(i => !i.archived_at) };
  } catch (err) {
    return errorHandler(err);
  }
};

export const getSubmittedContractsEvent: (
  params: paramsType
) => Promise<
  Awaited<ReturnType<typeof handler>>
> = validateBusinessToken(handler);
