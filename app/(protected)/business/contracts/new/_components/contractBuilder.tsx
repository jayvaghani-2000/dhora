"use client";

import React from "react";
import { DocusealBuilder } from "@docuseal/react";
import { useRouter, useSearchParams } from "next/navigation";
import { createContract } from "@/actions/(protected)/(contracts)/createContract";

export enum PARAMS {
  CONTRACT_ID = "c_id",
}

type propType = {
  token: string;
};

const ContractBuilder = (props: propType) => {
  const params = useSearchParams();
  const { token } = props;
  const navigate = useRouter();

  const handleLoadNerContract = async (data: any) => {
    const contractId = params.get(PARAMS.CONTRACT_ID);

    if (contractId && data.id === Number(contractId)) return;

    const response = await createContract({
      template_id: data.id,
      name: data.name,
    });

    if (response.success) {
      navigate.replace(
        `/business/contracts/new?${PARAMS.CONTRACT_ID}=${response.data.template_id}`
      );
    }
  };

  return (
    <div className="bg-white">
      <DocusealBuilder
        token={token}
        onLoad={handleLoadNerContract}
        onSave={data => {
          console.log("data", data);
        }}
        fieldTypes={["text", "signature", "date"]}
        withSignYourselfButton={false}
        autosave={false}
      />
    </div>
  );
};

export default ContractBuilder;
