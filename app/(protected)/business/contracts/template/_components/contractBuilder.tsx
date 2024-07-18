"use client";

import React, { useState } from "react";
import { DocusealBuilder } from "@docuseal/react";
import { useRouter, useSearchParams } from "next/navigation";
import { createContract } from "@/actions/(protected)/business/contracts/createContract";
import {
  getEmailAndEventType,
  initiateContractResponseType,
} from "@/actions/_utils/types.type";
import { updateContract } from "@/actions/(protected)/business/contracts/updateContract";
import { Button } from "@/components/ui/button";
import SendTemplate from "./sendTemplate";
import { IoIosSend } from "react-icons/io";
import BackButton from "@/components/shared/back-button";
import clsx from "clsx";
import { revalidate } from "@/actions/(public)/revalidate";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Separator } from "@/components/ui/separator";
import { deleteContract } from "@/actions/(protected)/business/contracts/deleteContract";
import { useToast } from "@/components/ui/use-toast";
import { ActionTooltip } from "@/components/shared/action-tooltip";

export enum PARAMS {
  CONTRACT_ID = "c_id",
}

type propType = {
  data: initiateContractResponseType["data"];
  bookings: getEmailAndEventType["data"];
};

const ContractBuilder = (props: propType) => {
  const [sendContract, setSendContract] = useState(false);
  const params = useSearchParams();
  const [loading, setLoading] = useState(false);
  const contractId = params.get(PARAMS.CONTRACT_ID);
  const { toast } = useToast();
  const { data } = props;
  const { token, contract } = data!;

  const navigate = useRouter();

  const handleLoadNewContract = async (data: any) => {
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
      await revalidate("/business/contracts");
    }
  };

  const handleToggleSendContract = () => {
    setSendContract(prev => !prev);
  };

  return (
    <>
      <div
        className={clsx({
          "bg-zinc-700 flex flex-col md:gap-2 py-2 md:py-5 ": true,
          "opacity-0": !contractId,
        })}
      >
        <div className="flex justify-between px-4">
          <BackButton to="/business/contracts" />
          <div className="flex items-center gap-2">
            <ActionTooltip
              side="top"
              align="center"
              label={
                contract?.deleted
                  ? "Contract is already deleted"
                  : "Contract will be permanently deleted"
              }
            >
              <Button
                variant="outline"
                className="p-1"
                onClick={async () => {
                  setLoading(true);
                  const res = await deleteContract(Number(contractId));
                  if (res && !res.success) {
                    toast({
                      title: res.error,
                    });
                  } else {
                    toast({
                      title: "Contract deleted successfully!",
                    });
                  }
                  setLoading(false);
                }}
                disabled={loading || (contract?.deleted as boolean)}
              >
                <RiDeleteBin6Line size={18} color="#b6b6b6" />
              </Button>
            </ActionTooltip>
            <Separator orientation="vertical" />
            <Button
              onClick={handleToggleSendContract}
              className=" font-bold flex justify-center gap-2 w-fit text-base self-end"
              disabled={loading || (contract?.deleted as boolean)}
            >
              <span className="hidden md:inline">Send</span>{" "}
              <IoIosSend size={22} />
            </Button>
          </div>
        </div>
        <DocusealBuilder
          token={token}
          onLoad={handleLoadNewContract}
          onSave={handleUpdateContract}
          withSignYourselfButton={false}
          withSendButton={false}
          customCss={`label {color: white} .contenteditable-container > .group {color: white} #title_container {color: white} button[draggable="true"] { color: white } .btn-outline {
            color: white
          }`}
        />
      </div>

      <SendTemplate
        open={sendContract}
        onClose={handleToggleSendContract}
        bookings={props.bookings}
      />
    </>
  );
};

export default ContractBuilder;
