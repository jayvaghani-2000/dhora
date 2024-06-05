import { getSubmittedContractsEvent } from "@/actions/(protected)/business/contracts/getSubmittedContractEvent";
import SubmittedContract from "@/app/(protected)/business/contracts/template/_components/submittedContract";
import Invoices from "@/app/(protected)/business/invoices/_components/invoices";
import React from "react";

type propType = { params: { slug: string }; };

const Contracts = async (prop: propType) => {

  const data = await getSubmittedContractsEvent({ event_id: prop.params.slug })

  console.log("data ::", data.data);

  return data.success ? <SubmittedContract templates={data.data!} showAction={false}/> : null
}

export default Contracts;
