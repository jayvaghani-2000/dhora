"use client";
import Navbar from "@/components/shared/navbar";
import clsx from "clsx";
import { GoBell } from "react-icons/go";
import { RiMenu5Fill } from "react-icons/ri";
import { MdOutlineSearch } from "react-icons/md";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const handleToggleNav = () => {
    setOpen(prev => !prev);
  };

  return (
    <div className="flex">
      <Navbar open={open} handleClose={handleToggleNav} />
      <div className="flex-1 relative bg-background min-h-svh md:ml-[272px] md:w-[calc(100dvw-272px)]">
        <button
          className={clsx({
            "block absolute inset-0 top-[48px] backdrop-blur-sm	z-[75]": open,
            hidden: !open,
            "md:hidden": true,
          })}
          onClick={handleToggleNav}
        ></button>
        <div className="hidden md:flex h-12 bg-primary-light-gray sticky top-0 z-[100] px-10 items-center justify-between border-b-2 border-secondary-black">
          <button className="relative  after:content-[''] after:absolute after:h-2 after:w-2 after:rounded-full after:bg-[#FF0000] after:top-0">
            <GoBell color="#b8b8b8" size={24} />
          </button>
        </div>
        <div className="md:hidden bg-primary-light-gray p-2.5 flex sticky top-0 justify-between items-center z-[100] h-12">
          <button onClick={handleToggleNav}>
            <RiMenu5Fill size={24} color="#b8b8b8" />
          </button>
          <button className="absolute left-12 after:content-[''] after:absolute after:h-2 after:w-2 after:rounded-full after:bg-[#FF0000] after:top-0">
            <GoBell color="#b8b8b8" size={24} />
          </button>

          <h1 className="text-white font-bold text-2xl">DHORA</h1>
          <div className="w-9">
            <MdOutlineSearch size={24} color="#b8b8b8" />
          </div>
        </div>
        <div className="p-4 md:p-6">{children}</div>
      </div>
    </div>
  );
}
