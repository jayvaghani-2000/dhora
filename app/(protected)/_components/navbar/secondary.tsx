"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { usePathname } from "next/navigation";
import SecondaryNavbarHeader from "./components/secondaryNavbarHeader";
import SecondaryNavbarSearch from "./components/secondaryNavbarSearch";
import { Separator } from "@/components/ui/separator";
import { BsShop } from "react-icons/bs";
import {
  LiaFileContractSolid,
  LiaFileInvoiceDollarSolid,
} from "react-icons/lia";
import { IoIosArrowDropdown } from "react-icons/io";
import { FaLink } from "react-icons/fa6";
import { FaRegClock } from "react-icons/fa";
import SecondaryNavbarItem from "./components/secondaryNavbarItem";
import { profileType } from "@/actions/_utils/types.type";
import { CgProfile } from "react-icons/cg";
import { IoIosImage } from "react-icons/io";
import { GoPackage } from "react-icons/go";
import { IoMdAddCircleOutline } from "react-icons/io";
import { LuCalendar } from "react-icons/lu";

export const StaticOptions = [
  {
    key: "@me",
    options: [
      {
        key: "marketplace",
        title: "Marketplace",
        icon: <BsShop />,
        path: "/@me/marketplace",
      },
      {
        key: "bookings",
        title: "Bookings",
        icon: <LuCalendar />,
        path: "/@me/bookings",
      },
    ],
  },
  {
    key: "business",
    options: [
      {
        key: "contracts",
        title: "Contracts",
        icon: <LiaFileContractSolid />,
        path: "/business/contracts",
      },
      {
        key: "invoices",
        title: "Invoices",
        icon: <LiaFileInvoiceDollarSolid />,
        path: "/business/invoices",
      },
      {
        key: "bookings",
        title: "Bookings",
        icon: <LuCalendar />,
        path: "/business/bookings",
      },
      {
        key: "availability",
        title: "Availability",
        icon: <FaRegClock />,
        path: "/business/availability",
      },
      {
        key: "booking-types",
        title: "Booking Types",
        icon: <FaLink />,
        path: "/business/booking-types",
      },
      {
        key: "business-profile",
        title: "Market Profile",
        icon: <CgProfile />,
        path: "/business/business-profile",
        submenu: [
          {
            key: "business-profile/assets",
            title: "Assets management",
            icon: <IoIosImage />,
            path: "/business/business-profile/assets",
          },
          {
            key: "business-profile/packages",
            title: "Packages",
            icon: <GoPackage />,
            path: "/business/business-profile/packages",
          },
          {
            key: "business-profile/add-ons",
            title: "Add on",
            icon: <IoMdAddCircleOutline />,
            path: "/business/business-profile/add-ons",
          },
        ],
      },
    ],
  },
  {
    key: "event",
    options: [
      {
        key: "contracts",
        title: "Contracts",
        icon: <LiaFileContractSolid />,
        path: "contracts",
      },
      {
        key: "invoices",
        title: "Invoices",
        icon: <LiaFileInvoiceDollarSolid />,
        path: "invoices",
      },
      {
        key: "itinerary",
        title: "Itinerary",
        icon: <IoIosArrowDropdown />,
        path: "itinerary",
      },
    ],
  },
];

type propType = {
  user: profileType;
};

const Secondary = (prop: propType) => {
  const path = usePathname();
  const key = StaticOptions.findIndex(o => path.startsWith(`/${o.key}`));
  const route = StaticOptions[key];
  const options = route?.options;

  if (!options) return null;

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <SecondaryNavbarHeader title={route.key} />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <SecondaryNavbarSearch data={[]} />
        </div>
        <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
        {options?.map(o => {
          return (
            <SecondaryNavbarItem
              key={o.key}
              id={o.key}
              title={o.title}
              icon={o.icon}
              path={o.path}
              submenu={o.submenu}
            />
          );
        })}
      </ScrollArea>
    </div>
  );
};

export default Secondary;
