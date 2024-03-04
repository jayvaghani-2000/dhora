import { deleteSubmittedContracts } from "@/actions/(protected)/contracts/deleteSubmittedContract";
import { Button } from "@/components/ui/button";
import { Row } from "@tanstack/react-table";
import React, { useState } from "react";
import { recordType } from "./submittedContract";
import { RiDeleteBin6Line } from "react-icons/ri";

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
    <Button
      variant="outline"
      className="p-2"
      disabled={loading}
      onClick={() => {
        handleDeleteTemplate();
      }}
    >
      <RiDeleteBin6Line size={24} color="#b6b6b6" />
    </Button>
  );
};

export default Actions;
