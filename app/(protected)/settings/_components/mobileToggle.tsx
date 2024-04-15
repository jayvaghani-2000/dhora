"use client";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { RiMenu5Fill } from "react-icons/ri";
import { staticOptions } from "./navbar";
import Link from "next/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";

export const MobileToggle = () => {
  const path = usePathname();

  return (
    <Sheet>
      <SheetTrigger className="md:hidden mr-2">
        <RiMenu5Fill />
      </SheetTrigger>
      <SheetContent side="left" className="p-0 flex gap-0">
        <div className="space-y-2 flex flex-col h-full text-primary w-full dark:bg-[#1E1F22] bg-[#E3E5E8] py-5  px-3">
          {staticOptions.map(i => (
            <Link key={i.key} href={i.path}>
              <button
                className={clsx({
                  "py-2 rounded-md flex items-center gap-x-2 w-full  transition-all duration-300 text-secondary-light-gray hover:text-white uppercase text-xs md:text-sm font-semibold":
                    true,
                  "text-white": path === i.path,
                })}
              >
                {i.icon}
                <p>{i.title}</p>
              </button>
            </Link>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};
