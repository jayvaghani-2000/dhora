import { deleteSubmittedContracts } from "@/actions/(protected)/business/contracts/deleteSubmittedContract";
import { Button } from "@/components/ui/button";
import { Row } from "@tanstack/react-table";
import React, { useState } from "react";
import { recordType } from "./submittedContract";
import { RiDeleteBin6Line } from "react-icons/ri";
import { ActionTooltip } from "@/components/shared/action-tooltip";

const Actions = ({ row }: { row: Row<recordType> }) => {
  const [loading, setLoading] = useState(false);

  const handleDeleteTemplate = async () => {
    setLoading(true);
    const res = await deleteSubmittedContracts(row.original.id);
    if (!res.success) {
      setLoading(false);
    }
  };

  return (
    <ActionTooltip side="top" align="center" label={"Delete"}>
      <Button
        variant="outline"
        className="p-1 h-[28px]"
        disabled={loading}
        onClick={() => {
          handleDeleteTemplate();
        }}
      >
        <RiDeleteBin6Line size={18} color="#b6b6b6" />
      </Button>
    </ActionTooltip>
  );
};

export default Actions;
