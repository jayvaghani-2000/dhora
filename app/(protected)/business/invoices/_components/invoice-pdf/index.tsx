"use client";

import React from "react";
import "./invoice-pdf.css";
import { generateInvoicePdf } from "@/actions/(protected)/invoices/generateInvoicePdf";
import { getInvoicesDetailResponseType } from "@/actions/_utils/types.type";

const InvoicePdf = ({
  invoice,
}: {
  invoice: getInvoicesDetailResponseType["data"];
}) => {
  return (
    <>
      <button onClick={async () => {}}>Save</button>
    </>
  );
};

export default InvoicePdf;
