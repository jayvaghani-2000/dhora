import { Button } from "@/components/ui/button";
import { Row } from "@tanstack/react-table";
import React, { useState } from "react";
import { recordType } from "./invoices";
import { RiShareForwardFill } from "react-icons/ri";
import { MdEdit } from "react-icons/md";
import { useRouter } from "next/navigation";
import { checkout } from "@/actions/(protected)/stripe/checkout";
import { IoEyeOutline } from "react-icons/io5";
import { useToast } from "@/components/ui/use-toast";
import CustomDialog from "@/components/shared/custom-dialog";

const Actions = ({ row }: { row: Row<recordType> }) => {
  const rowObj = row.original;
  const navigate = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const isNotDraft = rowObj.status !== "draft";

  return (
    <div className="flex gap-1">
      <Button
        variant="outline"
        className="p-1 h-[28px]"
        disabled={isNotDraft}
        onClick={() => {
          setOpen(true);
        }}
      >
        <RiShareForwardFill size={18} color="#b6b6b6" />
      </Button>
      <Button
        variant="outline"
        className="p-1 h-[28px]"
        onClick={() => {
          navigate.push(`/business/invoices/${rowObj.id}/preview`);
        }}
      >
        <IoEyeOutline size={18} color="#b6b6b6" />
      </Button>
      <Button
        variant="outline"
        className="p-1 h-[28px]"
        disabled={isNotDraft}
        onClick={() => {
          navigate.push(`/business/invoices/${rowObj.id}`);
        }}
      >
        <MdEdit size={18} color="#b6b6b6" />
      </Button>

      <CustomDialog
        title="Send Invoice"
        className="w-[720px]"
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        saveText={"Send"}
        onSubmit={async () => {
          const res = await checkout(rowObj.id);
          if (res.success) {
            toast({
              title: res.data,
            });
          } else {
            toast({
              title: res.error,
            });
          }
        }}
      >
        Confirm! Want to send invoice to {rowObj.email}
      </CustomDialog>
    </div>
  );
};

export default Actions;
