import { getSubmittedContractsEvent } from "@/actions/(protected)/business/contracts/getSubmittedContractEvent";
import React from "react";

type propType = { params: { slug: string }; };

const Contracts =async (prop: propType) => {

  const data = await getSubmittedContractsEvent({ event_id: prop.params.slug })

  return <div>Contracts</div>;
};

export default Contracts;
