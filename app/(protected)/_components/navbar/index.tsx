"use client";
import { usePathname } from "next/navigation";
import React from "react";
import Primary from "./primary";
import Secondary from "./secondary";
import Toolbar from "../toolbar";
import { profileType } from "@/actions/_utils/types.type";

const routesWithoutNavbar = [
  "/settings/details",
  "/settings/business",
  "/settings",
];

type propType = {
  children: React.ReactNode;
  user: profileType;
};

const ProtectedNavbarLayout = (props: propType) => {
  const { children, user } = props;
  const path = usePathname();

  return routesWithoutNavbar.includes(path) ? (
    <div className="h-screen">
      <main className="h-full flex">
        <div className="flex-1 h-full relative bg-body-background">
          {children}
        </div>
      </main>
    </div>
  ) : (
    <div className="h-full">
      <div className="hidden md:flex h-full w-[72px] z-30 flex-col fixed inset-y-0">
        <Primary user={user} />
      </div>
      <main className="md:pl-[72px] h-full">
        <div className="h-full">
          <div className="hidden md:flex h-full w-[248px] z-20 flex-col fixed inset-y-0">
            <Secondary user={user} />
          </div>
          <main className="h-full md:pl-[248px]">
            <div className="flex-1 relative bg-background min-h-svh">
              <Toolbar user={user} />
              <div className="relative p-4 md:p-6">{children}</div>
            </div>
          </main>
        </div>
      </main>
    </div>
  );
};

export default ProtectedNavbarLayout;
