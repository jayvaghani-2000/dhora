"use client";

import React, { useState } from "react";
import "./invoice-pdf.css";
import { generateInvoicePdf } from "@/actions/(protected)/invoices/generateInvoicePdf";
import { getInvoicesDetailResponseType } from "@/actions/_utils/types.type";
import Spinner from "@/components/shared/spinner";

const InvoicePdf = ({
  invoice,
}: {
  invoice: getInvoicesDetailResponseType["data"];
}) => {
  const [loading, setLoading] = useState(false);

  return (
    <button
      onClick={async () => {
        setLoading(true);
        await generateInvoicePdf({
          invoiceId: invoice?.id as unknown as string,
          paymentLink: "https://somelink.com",
        });
        setLoading(false);
      }}
      disabled={loading}
    >
      Save {loading && <Spinner type="inline" />}
    </button>
  );
};

export default InvoicePdf;
