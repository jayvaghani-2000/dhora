"use client";
import clsx from "clsx";

import Primary from "./primary";
import Secondary from "./secondary";

const Navbar = ({
  open,
  handleClose,
}: {
  open: boolean;
  handleClose: () => void;
}) => {
  return (
    <div
      className={clsx({
        "flex overflow-hidden transition-all md:transition-none fixed h-[calc(100dvh-48px)] md:h-[100dvh] z-[100]  top-[48px] md:top-0 bottom-0":
          true,
        "w-[260px] md:w-[272px]": open,
        "w-0 md:w-[272px]": !open,
      })}
    >
      <Primary />
      <Secondary handleClose={handleClose} />
    </div>
  );
};

export default Navbar;
