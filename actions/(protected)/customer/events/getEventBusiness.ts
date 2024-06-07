"use server";

import { db } from "@/lib/db";
import { getSubmittedContractsEvent } from "../../business/contracts/getSubmittedContractEvent";
import { getInvoicesByEvent } from "../../business/invoices/getInvoiceByEvent";
import { businesses } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";

type paramType = { event_id: string };

export const getEventBusiness = async (params:paramType) => {
    const {event_id} = params
    try {
        const contractData = await getSubmittedContractsEvent({ event_id: event_id})
        const invoiceData = await getInvoicesByEvent({event_id: event_id})

        let uniqueFolderNames = Array.from(new Set(contractData.data!.map(item => item.template.folder_name)));
        const uniqueBusinessId =  Array.from(new Set(invoiceData.data!.map(item => item.business_id)))

        const mergedUniqueValues = Array.from(new Set([...uniqueFolderNames, ...uniqueBusinessId]));

        const businessDetails = await db.query.businesses.findMany({
            where: inArray(businesses.id, mergedUniqueValues),
            columns:{
                name:true,
                id:true
            }
        });
        return businessDetails

    } catch(error) { 
        console.log(error); 
    }
}

