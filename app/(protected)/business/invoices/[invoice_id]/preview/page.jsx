import { getInvoiceDetail } from "@/actions/(protected)/invoices/getInvoiceDetail";
import React from "react";
import InvoicePdf from "../../_components/invoice-pdf";

export default async function InvoicePreview(props) {
  const result = await getInvoiceDetail(
    props.params.invoice_id
  );

  return <InvoicePdf invoice={result.data} />;
}
