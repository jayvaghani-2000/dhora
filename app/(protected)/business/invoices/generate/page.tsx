import React from "react";
import InvoiceForm from "../_components/invoice-form";
import { me } from "@/actions/(auth)/me";
import ConnectToStripe from "../_components/connect-to-stripe";

export default async function GenerateInvoice() {
  const user = await me();

  return !user.data?.business?.stripe_account_verified ? (
    <InvoiceForm user={user.data} />
  ) : (
    <ConnectToStripe user={user.data} />
  );
}
