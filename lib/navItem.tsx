import { LiaFileContractSolid } from "react-icons/lia";
import { MdCorporateFare } from "react-icons/md";

export const BUSINESS_MENU_ITEMS = [
  {
    title: "Contracts",
    path: "/business/contracts",
    icon: <LiaFileContractSolid size={18} />,
  },
  // { title: "Invoices", path: "/business/invoices" },
  // { title: "Availability", path: "/business/availability" },
  // { title: "Booking Types", path: "/business/booking-types" },
  // { title: "Bookings", path: "/business/bookings" },
];

export const USER_MENU_ITEMS = [
  {
    title: "Marketplace",
    path: "/app/marketplace",
    icon: <MdCorporateFare size={18} />,
  },
];
