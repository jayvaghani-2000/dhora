"use client";

import React from "react";
import Primary from "./_components/navbar/primary";
import Secondary from "./_components/navbar/secondary";
import Toolbar from "./_components/toolbar";

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-full">
      <div className="hidden md:flex h-full w-[72px] z-30 flex-col fixed inset-y-0">
        <Primary />
      </div>
      <main className="md:pl-[72px] h-full">
        <div className="h-full">
          <div className="hidden md:flex h-full w-[248px] z-20 flex-col fixed inset-y-0">
            <Secondary />
          </div>
          <main className="h-full md:pl-[248px]">
            <div className="flex-1 relative bg-background min-h-svh">
              <Toolbar />
              <div className="relative p-4 md:p-6">{children}</div>
            </div>
          </main>
        </div>
      </main>
    </div>
  );
}
