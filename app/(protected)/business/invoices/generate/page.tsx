import React from "react";
import InvoiceForm from "../_components/invoice-form";
import { me } from "@/actions/(auth)/me";

export default async function GenerateInvoice() {
  const user = await me();
  return <InvoiceForm user={user.data} />;
}
