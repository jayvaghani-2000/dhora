import { getBookingTypes } from "@/actions/(protected)/business/booking-types/getBookingTypes";
import CreateBookingType from "./_components/create-booking-type";
import BookingTypes from "./_components/booking-types";

export default async function BookingTypePage() {
  const res = await getBookingTypes();
  return res.success ? (
    <div>
      <CreateBookingType />
      <BookingTypes data={res.data} />
    </div>
  ) : (
    <span>{res.error}</span>
  );
}
