"use server";

import { validateBusinessToken } from "@/actions/_utils/validateToken";
import { User } from "lucia";
import { errorHandler } from "@/actions/_utils/errorHandler";
import { config } from "@/config";
import axios from "axios";
import { SubmittedEventTemplateType } from "./_utils/submittedContractEvent.type";

type paramsType = { event_id: string };

const handler = async (user: User, data: paramsType) => {
  const { event_id } = data;
  try {
    const data = [] as SubmittedEventTemplateType["data"];
    let dataThisTime = [] as SubmittedEventTemplateType["data"];
    let next = 0;
    do {
      const options = {
        method: "GET",
        url: next
          ? `https://api.docuseal.co/submissions?q=${user.email!.toString()}&after=${next}&limit=100`
          : `https://api.docuseal.co/submissions?q=${user.email!.toString()}&limit=100`,
        headers: { "X-Auth-Token": config.env.DOCU_SEAL },
      };

      const res: { data: SubmittedEventTemplateType } =
        await axios.request(options);

      next = res.data.pagination.next;
      data.push(...res.data.data);
      dataThisTime = res.data.data;
    } while (dataThisTime.length > 0);

    const filteredData = data.filter(item => {
      return item.submitters.some(submitter => {
        return submitter.external_id === event_id;
      });
    });
    return {
      success: true as true,
      data: filteredData,
    };
  } catch (err) {
    console.log("error ::", err);
    return errorHandler(err);
  }
};

export const getSubmittedContractsEvent: (
  params: paramsType
) => Promise<Awaited<ReturnType<typeof handler>>> =
  validateBusinessToken(handler);
