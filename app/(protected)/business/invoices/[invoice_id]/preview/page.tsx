import { getInvoiceDetail } from "@/actions/(protected)/invoices/getInvoiceDetail";
import React from "react";
import InvoicePreview from "../../_components/invoice-preview";

type propType = {
  params: {
    invoice_id: string;
  };
};

export default async function InvoicePreviewPage(props: propType) {
  const result = await getInvoiceDetail({ id: props.params.invoice_id });

  return <InvoicePreview invoice={result.data} />;
}
