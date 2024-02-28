"use client";

import React, { useEffect, useState } from "react";
import Primary from "./_components/navbar/primary";

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [setOpen]);

  const handleToggleNav = () => {
    setOpen(open => !open);
  };

  return (
    <div className="h-full">
      <div className="hidden md:flex h-full w-[72px] z-30 flex-col fixed inset-y-0">
        <Primary />
      </div>
      <main className="md:pl-[72px] h-full">{children}</main>
    </div>
  );
}
