import { getBookings } from "@/actions/(protected)/customer/booking/getBookings";
import UserBookings from "../../_components/user-bookings";

export default async function BookingsPage() {
  const res = await getBookings();

  return res.success ? (
    <UserBookings bookings={res.data} />
  ) : (
    <span>{res.error}</span>
  );
}
