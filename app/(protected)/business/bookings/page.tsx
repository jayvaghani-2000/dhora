import { getBookings } from "@/actions/(protected)/customer/booking/getBookings";
import UserBookings from "../../_components/user-bookings";

export default async function BookingsPage() {
  const res = await getBookings(true);

  return res.success ? (
    <UserBookings bookings={res.data} isButtonVisible={true} />
  ) : (
    <span>{res.error}</span>
  );
}
