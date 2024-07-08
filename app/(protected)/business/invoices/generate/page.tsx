import React from "react";
import InvoiceForm from "../_components/invoice-form";
import { me } from "@/actions/(auth)/me";
import ConnectToStripe from "../_components/connect-to-stripe";
import { getBookingCustomer } from "@/actions/(protected)/customer/booking/getBookingCustomer";

export default async function GenerateInvoice() {
  const user = await me();
  const bookingCustomer = await getBookingCustomer();

  if (!user.success) {
    return <div className="text-center">Unable to fetch user details</div>;
  }
  return user.data?.business?.stripe_account_verified ? (
    <InvoiceForm user={user.data}  bookings={bookingCustomer.data!}/>
  ) : (
    <ConnectToStripe user={user.data} />
  );
}
