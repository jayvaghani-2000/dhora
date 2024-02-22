"use client";

import React, { useState } from "react";
import { DocusealBuilder } from "@docuseal/react";
import { useRouter, useSearchParams } from "next/navigation";
import { createContract } from "@/actions/(protected)/(contracts)/createContract";
import { contractTemplateType } from "@/actions/_utils/types.type";
import { updateContract } from "@/actions/(protected)/(contracts)/updateContract";
import { Button } from "@/components/ui/button";
import SendTemplate from "./sendTemplate";
import { IoIosSend } from "react-icons/io";

export enum PARAMS {
  CONTRACT_ID = "c_id",
}

type propType = {
  token: string;
  contract: contractTemplateType;
};

const ContractBuilder = (props: propType) => {
  const [sendContract, setSendContract] = useState(false);
  const params = useSearchParams();
  const { token, contract } = props;
  const navigate = useRouter();

  const handleLoadNewContract = async (data: any) => {
    const contractId = params.get(PARAMS.CONTRACT_ID);

    if (contractId && data.id === Number(contractId)) return;

    const response = await createContract({
      template_id: data.id,
      name: data.name,
    });

    if (response.success) {
      navigate.replace(
        `/business/contracts/template?${PARAMS.CONTRACT_ID}=${response.data.template_id}`
      );
    }
  };

  const handleUpdateContract = async (data: any) => {
    if (contract && data.name !== contract.name) {
      await updateContract({
        template_id: data.id,
        name: data.name,
      });
    }
  };

  const handleToggleSendContract = () => {
    setSendContract(prev => !prev);
  };

  return (
    <>
      <div className="bg-zinc-700 flex flex-col md:gap-2 py-2 md:py-5 ">
        <Button
          variant="destructive"
          onClick={handleToggleSendContract}
          className="h-12 font-bold flex justify-center gap-2 rounded-full w-fit mr-4 ml-auto text-base self-end"
        >
          <IoIosSend color="#fff" size={22} />
          <span className="hidden md:inline">SEND</span>{" "}
        </Button>
        <DocusealBuilder
          token={token}
          onLoad={handleLoadNewContract}
          onSave={handleUpdateContract}
          fieldTypes={["text", "signature", "date"]}
          withSignYourselfButton={false}
          autosave={false}
          withSendButton={false}
          customCss={`label {color: white} .contenteditable-container > .group {color: white} #title_container {color: white} button[draggable="true"] { color: white } .btn-outline {
            color: white
          }`}
        />
      </div>

      <SendTemplate open={sendContract} onClose={handleToggleSendContract} />
    </>
  );
};

export default ContractBuilder;
