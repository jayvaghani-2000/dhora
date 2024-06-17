import { getBookingTypes } from "@/actions/(protected)/business/booking-types/getBookingTypes";
import CreateBookingType from "./_components/create-booking-type";
import BookingTypes from "./_components/booking-types";
import { getAvailability } from "@/actions/(protected)/business/availability/getAvailability";
import { getAvailabilityData } from "../availability/_utils/initializeAvailability";

export default async function BookingTypePage() {
  const [res] = await Promise.all([
    await getBookingTypes(),
    await getAvailability({
      defaultAvailability: getAvailabilityData(),
    }),
  ]);

  return res.success ? (
    <div>
      <CreateBookingType />
      <BookingTypes data={res.data} />
    </div>
  ) : (
    <span>{res.error}</span>
  );
}
