"use client";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { HiOutlineBuildingOffice } from "react-icons/hi2";

const staticOptions = [
  {
    key: "personal-detail",
    title: "Personal Details",
    icon: <FaRegUserCircle size={20} />,
    path: "/settings/details",
  },
  {
    key: "business-detail",
    title: "Business Details",
    icon: <HiOutlineBuildingOffice size={20} />,
    path: "/settings/business",
  },
];

const SettingsNavbar = () => {
  const path = usePathname();
  return (
    <nav className="">
      <div className="text-lg font-semibold uppercase mb-4">Settings</div>

      {staticOptions.map(i => (
        <Link key={i.key} href={i.path}>
          <button
            className={clsx({
              "py-2 rounded-md flex items-center gap-x-2 w-full  transition-all duration-300 text-secondary-light-gray hover:text-white uppercase text-sm font-semibold":
                true,
              "text-white": path === i.path,
            })}
          >
            {i.icon}
            <p>{i.title}</p>
          </button>
        </Link>
      ))}
    </nav>
  );
};

export default SettingsNavbar;
