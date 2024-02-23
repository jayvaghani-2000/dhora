import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/provider/store/authentication";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RxCross1 } from "react-icons/rx";

const BUSINESS_MENU_ITEMS = [
  { title: "Contracts", path: "/business/contracts" },
  // { title: "Invoices", path: "/business/invoices" },
  // { title: "Availability", path: "/business/availability" },
  // { title: "Booking Types", path: "/business/booking-types" },
  // { title: "Bookings", path: "/business/bookings" },
];

const USER_MENU_ITEMS = [{ title: "Marketplace", path: "/app/marketplace" }];

const Secondary = (props: { handleClose: () => void }) => {
  const { handleClose } = props;
  const location = usePathname();
  const { isBusinessUser, authenticated } = useAuthStore();

  const MENU_ITEMS = isBusinessUser ? BUSINESS_MENU_ITEMS : USER_MENU_ITEMS;

  return (
    <div className="bg-secondary-gray w-[200px] flex flex-col text-white">
      {authenticated ? (
        <>
          <div className="pl-5 pr-2 py-2 font-bold flex justify-between items-center text-base">
            {isBusinessUser ? <span>Business</span> : <span>User</span>}
            <button className="inline-block md:hidden" onClick={handleClose}>
              <RxCross1 />
            </button>
          </div>
          <div className=" border-b-2 border-divider mb-3" />
          {MENU_ITEMS.map(i => (
            <Link
              href={i.path}
              key={i.path}
              className={clsx({
                "px-5 py-2 relative whitespace-nowrap uppercase font-semibold text-xs":
                  true,
                "bg-gray-950 before:content-[''] before:absolute before:w-[5px] before:bg-white before:left-0 before:top-0 before:bottom-0":
                  location.startsWith(i.path),
              })}
            >
              {i.title}
            </Link>
          ))}
        </>
      ) : (
        <div className="px-2  flex flex-col py-2 space-y-2">
          <Skeleton className="h-6 w-full bg-primary-gray" />
          <Skeleton className="h-6 w-full bg-primary-gray" />
        </div>
      )}
    </div>
  );
};

export default Secondary;
