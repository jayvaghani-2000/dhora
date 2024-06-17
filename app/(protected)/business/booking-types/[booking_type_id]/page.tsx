import { getAvailability } from "@/actions/(protected)/business/availability/getAvailability";
import { getBookingTypeDetails } from "@/actions/(protected)/business/booking-types/getBookingTypeDetails";
import React from "react";
import EditBookingType from "../_components/edit-booking-type";

type propType = {
  params: {
    booking_type_id: string;
  };
};
export default async function EditBookingTypePage(props: propType) {
  const res = await getBookingTypeDetails(props.params.booking_type_id);
  const availability = await getAvailability();

  return res.success ? (
    <EditBookingType bookingType={res.data} availability={availability.data} />
  ) : (
    <span className="text-center">{res.error}</span>
  );
}
