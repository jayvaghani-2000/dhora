"use client";

import React, { useEffect, useState } from "react";
import Navbar from "./_components/navbar";
import Toolbar from "./_components/toolbar";

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
    <>
      <Navbar>
        <div className="flex-1 relative bg-background min-h-svh md:ml-[320px] md:w-[calc(100dvw-320px)]">
          <Toolbar open={open} handleToggleNav={handleToggleNav} />
          <div className="p-4 md:p-6">{children}</div>
        </div>
      </Navbar>
    </>
  );
}
