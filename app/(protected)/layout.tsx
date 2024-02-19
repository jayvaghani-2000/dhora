"use client";
import Navbar from "@/components/shared/navbar";
import clsx from "clsx";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { assets } from "@/components/assets";

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
      <Navbar open={open} />
      <div className="flex-1 relative bg-body-background min-h-svh text-white md:ml-[275px]">
        <button
          className={clsx({
            "block absolute inset-0 top-[48px] backdrop-blur-sm	z-[75]": open,
            hidden: !open,
          })}
          onClick={handleToggleNav}
        ></button>
        <div
          className="hidden md:flex h-12 bg-primary-light-gray sticky top-0 z-[100] px-10 items-center justify-between
        "
        >
          <button className="relative  after:content-[''] after:absolute after:h-2 after:w-2 after:rounded-full after:bg-[#FF0000] after:top-0">
            <Image src={assets.svg.BELL} alt="bell" width={18} height={18} />
          </button>
          <div>
            <Input
              placeholder="Search"
              className="bg-transparent border-2 border-r-0 border-t-0 border-l-0 rounded-none"
            />
          </div>
          <div></div>
        </div>
        <div className="md:hidden bg-primary-light-gray p-2.5 flex sticky top-0 justify-between items-center z-[100] h-12">
          <button onClick={handleToggleNav}>
            <Image src={assets.svg.MENU} alt="menu" height={18} width={18} />
          </button>
          <button className="absolute left-16 after:content-[''] after:absolute after:h-2 after:w-2 after:rounded-full after:bg-[#FF0000] after:top-0">
            <Image src={assets.svg.BELL} alt="bell" height={18} width={18} />
          </button>

          <h1 className="text-white font-bold text-2xl">DHORA</h1>
          <div className="w-9">
            <Image
              src={assets.svg.SEARCH}
              alt="search"
              width={18}
              height={18}
            />
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
