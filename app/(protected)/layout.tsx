"use client";
import Navbar from "@/components/shared/navbar";
import clsx from "clsx";
import { GoBell } from "react-icons/go";
import { RiMenu5Fill } from "react-icons/ri";
import { MdOutlineSearch } from "react-icons/md";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/provider/store/authentication";
import { BUSINESS_MENU_ITEMS, USER_MENU_ITEMS } from "@/lib/nav-item";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isBusinessUser } = useAuthStore();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const handleToggleNav = () => {
    setOpen(prev => !prev);
  };

  const getActivePage = () => {
    const menuItem = isBusinessUser ? BUSINESS_MENU_ITEMS : USER_MENU_ITEMS;

    return menuItem.find(i => pathname.startsWith(i.path));
  };

  const activePage = getActivePage();

  return (
    <div className="flex">
      <Navbar open={open} handleClose={handleToggleNav} />
      <div className="flex-1 relative bg-background min-h-svh md:ml-[320px] md:w-[calc(100dvw-320px)]">
        <button
          className={clsx({
            "block absolute inset-0 top-[48px] backdrop-blur-sm	z-[75]": open,
            hidden: !open,
            "md:hidden": true,
          })}
          onClick={handleToggleNav}
        ></button>
        <div className="hidden md:flex h-12 bg-primary-light-gray sticky top-0 z-[100] px-5 items-center gap-4 border-b-2 border-secondary-black">
          <button className="relative  after:content-[''] after:absolute after:h-2 after:w-2 after:rounded-full after:bg-[#FF0000] after:top-0">
            <GoBell color="#b8b8b8" size={24} />
          </button>
          <div className="w-0.5 bg-divider h-8" />
          {activePage ? (
            <div className="flex items-center gap-1 font-semibold">
              {activePage.icon} {activePage.title}
            </div>
          ) : null}
        </div>

        <div className="md:hidden bg-primary-light-gray p-2.5 flex sticky top-0 justify-between items-center z-[100] h-12">
          <button onClick={handleToggleNav}>
            <RiMenu5Fill size={24} color="#b8b8b8" />
          </button>
          <button className="absolute left-12 after:content-[''] after:absolute after:h-2 after:w-2 after:rounded-full after:bg-[#FF0000] after:top-0">
            <GoBell color="#b8b8b8" size={24} />
          </button>

          <div className="flex items-center gap-1 font-semibold">
            {activePage ? (
              <>
                <span>{activePage.icon}</span> <span>{activePage.title}</span>
              </>
            ) : null}
          </div>

          <div className="w-9">
            <MdOutlineSearch size={24} color="#b8b8b8" />
          </div>
        </div>
        <div className="p-4 md:p-6">{children}</div>
      </div>
    </div>
  );
}
