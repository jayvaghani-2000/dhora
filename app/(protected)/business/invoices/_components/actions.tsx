import { Button } from "@/components/ui/button";
import { Row } from "@tanstack/react-table";
import React, { useEffect, useState } from "react";
import { recordType } from "./invoices";
import { RiShareForwardFill } from "react-icons/ri";
import { MdEdit } from "react-icons/md";
import { useRouter } from "next/navigation";
import { checkout } from "@/actions/(protected)/business/stripe/checkout";
import { IoEyeOutline } from "react-icons/io5";
import { useToast } from "@/components/ui/use-toast";
import CustomDialog from "@/components/shared/custom-dialog";
import { ActionTooltip } from "@/components/shared/action-tooltip";
import { getInvoiceDetail } from "@/actions/(protected)/business/invoices/getInvoiceDetail";
import { getInvoicesDetailResponseType } from "@/actions/_utils/types.type";
import InvoicePdf from "./invoice-pdf";

const Actions = ({ row }: { row: Row<recordType> }) => {
  const rowObj = row.original;
  const navigate = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [savePdf, setSavePdf] = useState({
    invoiceId: rowObj.id,
    trigger: false,
  });
  const [invoice, setInvoice] = useState({} as getInvoicesDetailResponseType);

  const handleGetInvoiceDetail = async () => {
    const result = await getInvoiceDetail({ id: rowObj.id, mode: "edit" });
    if (result.success) {
      setInvoice(result);
    }
  };

  useEffect(() => {
    if (open) {
      handleGetInvoiceDetail();
    }
  }, [open]);

  const isNotDraft = rowObj.status !== "draft";

  return (
    <div className="flex gap-1">
      <ActionTooltip side="top" align="center" label={"View"}>
        <Button
          variant="outline"
          className="p-1 h-[28px]"
          onClick={() => {
            navigate.push(`/business/invoices/${rowObj.id}/preview`);
          }}
        >
          <IoEyeOutline size={18} color="#b6b6b6" />
        </Button>
      </ActionTooltip>
      <ActionTooltip side="top" align="center" label={"Edit"}>
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
      </ActionTooltip>

      <ActionTooltip side="top" align="center" label={"Send"}>
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
      </ActionTooltip>

      <CustomDialog
        title="Send Invoice"
        className="w-[720px]"
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        disableAction={Object.keys(invoice).length === 0 || loading}
        saveText={"Send"}
        onSubmit={async () => {
          setLoading(true);
          setSavePdf(prev => ({ ...prev, trigger: true }));
        }}
      >
        Send invoice to {rowObj.email}?
        <InvoicePdf
          invoice={invoice.data}
          savePdf={savePdf}
          loading={loading}
          setLoading={setLoading}
        />
      </CustomDialog>
    </div>
  );
};

export default Actions;
