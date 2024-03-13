"use client";

import React, { useState } from "react";
import "./invoice-pdf.css";
import {
  createInvoiceSchemaType,
  getInvoicesDetailResponseType,
} from "@/actions/_utils/types.type";
import Image from "next/image";
import { formatAmount } from "@/lib/common";

const InvoicePdf = ({
  invoice,
}: {
  invoice: getInvoicesDetailResponseType["data"];
}) => {
  const [loading, setLoading] = useState(false);

  const items = invoice?.items as createInvoiceSchemaType["items"];
  return (
    <div
      id="element-to-print"
      style={{
        border: "1px solid #707070",
        padding: "24px",
        borderRadius: "5px",
        backgroundColor: "#192229",
        color: "white",
        margin: "24px",
      }}
    >
      <div style={{ marginBottom: "24px" }}>
        <Image
          src={invoice?.business.logo ?? ""}
          alt={invoice?.business.name ?? ""}
          height={72}
          width={72}
          className="rounded-sm border border-[#707070]"
        />
      </div>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          border: "1px solid #707070",
          borderRadius: "5px",
        }}
      >
        <thead>
          <tr
            style={{
              backgroundColor: "#313238",
              color: "#cecece",
              borderRadius: "5px 5px 0px 0px",
              fontWeight: 400,
              margin: 0,
              display: "flex",
            }}
          >
            <th className="table-header-item index">#</th>
            <th className="table-header-item item-name">Item</th>
            <th className="table-header-item item">Quantity</th>
            <th className="table-header-item item">Unit Price</th>
            <th className="table-header-item item">Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((i, index) => (
            <tr
              key={i.id}
              style={{
                color: "#fff",
                fontWeight: 400,
                margin: 0,
                display: "flex",
                borderTop: "1px solid #707070",
              }}
            >
              <td className="table-item index">{index + 1}</td>
              <td className="table-item item-name">{i.name}</td>
              <td className="table-item item">{i.quantity}</td>
              <td className="table-item item">{formatAmount(i.price)}</td>
              <td className="table-item item">
                {formatAmount(i.price * i.quantity)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvoicePdf;
