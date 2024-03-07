import { Button } from "@/components/ui/button";
import { Row } from "@tanstack/react-table";
import React, { useState } from "react";
import { recordType } from "./invoices";
import { RiShareForwardFill } from "react-icons/ri";
import { MdEdit } from "react-icons/md";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { checkout } from "@/actions/(protected)/stripe/checkout";
import { IoEyeOutline } from "react-icons/io5";

const Actions = ({ row }: { row: Row<recordType> }) => {
  const rowObj = row.original;
  const [loading, setLoading] = useState(false);
  const navigate = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex gap-1">
      <Button
        variant="outline"
        className="p-1 h-[28px]"
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
        onClick={() => {
          navigate.push(`/business/invoices/${rowObj.id}`);
        }}
      >
        <MdEdit size={18} color="#b6b6b6" />
      </Button>
      <Dialog
        open={open}
        onOpenChange={value => {
          if (!value) {
            setOpen(false);
          }
        }}
      >
        <DialogContent className="max-w-[calc(100dvw-40px)] w-[425px]">
          <DialogHeader>
            <DialogTitle>Send invoice to {rowObj.email}</DialogTitle>
          </DialogHeader>

          <Button
            type="submit"
            onClick={async () => {
              const res = await checkout(rowObj.id);
              console.log(res);
            }}
          >
            Send Invoice
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Actions;
