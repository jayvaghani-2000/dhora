"use client";
import clsx from "clsx";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { HiOutlineBuildingOffice } from "react-icons/hi2";
import { profileType } from "@/actions/_utils/types.type";
import {
  DEFAULT_BUSINESS_LOGIN_REDIRECT,
  DEFAULT_USER_LOGIN_REDIRECT,
} from "@/routes";

export const staticOptions = [
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

type propType = {
  user: profileType;
};

const SettingsNavbar = (prop: propType) => {
  const { user } = prop;
  const path = usePathname();
  const route = useRouter();

  const navigateTo = user?.business_id
    ? DEFAULT_BUSINESS_LOGIN_REDIRECT
    : DEFAULT_USER_LOGIN_REDIRECT;

  useEffect(() => {
    const handleKeyPress = async (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        route.push(navigateTo);
      }
    };
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  return (
    <nav className="hidden md:block ">
      <div className="text-base md:text-lg font-semibold uppercase mb-4">
        Settings
      </div>

      {staticOptions.map(i => (
        <Link key={i.key} href={i.path}>
          <button
            className={clsx({
              "py-3 rounded-md flex items-center gap-x-2 w-full  transition-all duration-300 text-secondary-light-gray hover:text-white uppercase text-xs md:text-sm font-semibold":
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
