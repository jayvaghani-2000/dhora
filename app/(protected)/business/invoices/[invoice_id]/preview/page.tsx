import { getInvoiceDetail } from "@/actions/(protected)/invoices/getInvoiceDetail";
import React from "react";
import InvoicePdf from "../../_components/invoice-pdf";
type propType = {
  params: {
    invoice_id: string;
  };
};
export default async function InvoicePreview(props: propType) {
  const result = await getInvoiceDetail(props.params.invoice_id);

  return <InvoicePdf />;
}
