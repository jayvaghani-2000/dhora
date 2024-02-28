"use client";

import Primary from "./primary";
import Secondary from "./secondary";

const Navbar = ({ children }: { children: React.ReactNode }) => {
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
          <main className="h-full md:pl-[248px]">{children}</main>
        </div>
      </main>
    </div>
  );
};

export default Navbar;
