"use server";

import { db } from "@/lib/db";
import { getSubmittedContractsEvent } from "../../business/contracts/getSubmittedContractEvent";
import { getInvoicesByEvent } from "../../business/invoices/getInvoiceByEvent";
import { businesses } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { errorHandler } from "@/actions/_utils/errorHandler";

type paramType = { event_id: string };

export const getEventBusiness = async (params: paramType) => {
  const { event_id } = params;
  try {
    const contractData = await getSubmittedContractsEvent({
      event_id: event_id,
    });
    const invoiceData = await getInvoicesByEvent({ event_id: event_id });

    let uniqueFolderNames = Array.from(
      new Set(contractData.data!.map(item => item.template.folder_name))
    );
    const uniqueBusinessId = Array.from(
      new Set(invoiceData.data!.map(item => item.business_id))
    );

    const mergedUniqueValues = Array.from(
      new Set([...uniqueFolderNames, ...uniqueBusinessId])
    );

    if (mergedUniqueValues.length > 0) {
      const businessDetails = await db.query.businesses.findMany({
        where: inArray(businesses.id, mergedUniqueValues),
        columns: {
          name: true,
          id: true,
        },
      });
      return {
        success: true as true,
        data: businessDetails,
      };
    }

    return {
      success: true as true,
      data: [] as {
        name: string;
        id: string;
      }[],
    };
  } catch (error) {
    return errorHandler(error);
  }
};
