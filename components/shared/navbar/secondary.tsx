import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MENU_ITEMS = [
  { title: "Contracts", path: "/business/contracts" },
  { title: "Invoices", path: "/business/invoices" },
  { title: "Availability", path: "/business/availability" },
  { title: "Booking Types", path: "/business/booking-types" },
  { title: "Bookings", path: "/business/bookings" },
];

const Secondary = () => {
  const location = usePathname();

  return (
    <div className="bg-secondary-gray w-[200px]  py-[20px] flex flex-col text-white">
      {MENU_ITEMS.map(i => (
        <Link
          href={i.path}
          key={i.path}
          className={clsx({
            "px-5 py-2 relative whitespace-nowrap": true,
            "bg-gray-950 before:content-[''] before:absolute before:w-[5px] before:bg-primary-blue before:left-0 before:top-0 before:bottom-0":
              location === i.path,
          })}
        >
          {i.title}
        </Link>
      ))}
    </div>
  );
};

export default Secondary;
