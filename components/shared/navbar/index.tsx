"use client";
import clsx from "clsx";

import Primary from "./primary";
import Secondary from "./secondary";

const Navbar = ({ open }: { open: boolean }) => {
  return (
    <div
      className={clsx({
        "overflow-hidden transition-width md:transition-none fixed h-[calc(100vh-48px)] md:h-[100vh] z-[100]  top-[48px] md:top-0 bottom-0":
          true,
        "flex w-[275px]": open,
        "w-0 md:w-[275px] md:flex": !open,
      })}
    >
      <Primary />
      <Secondary />
    </div>
  );
};

export default Navbar;
