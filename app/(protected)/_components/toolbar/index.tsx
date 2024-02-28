import clsx from "clsx";
import { GoBell } from "react-icons/go";
import { RiMenu5Fill } from "react-icons/ri";
import { MdOutlineSearch } from "react-icons/md";

export interface Props {
  open: boolean;
  handleToggleNav: () => void;
}

export default function Toolbar({ open, handleToggleNav }: Props) {
  return (
    <>
      <button
        className={clsx({
          "block absolute inset-0 top-[48px] backdrop-blur-sm	z-[75]": open,
          hidden: !open,
          "md:hidden": true,
        })}
        onClick={handleToggleNav}
      />
      <div className="hidden md:flex h-12 bg-primary-light-gray sticky top-0 z-20 px-2 items-center border-b-2 border-secondary-black gap-2">
        <button className="relative after:content-[''] after:absolute after:h-2 after:w-2 after:rounded-full after:bg-[#FF0000] after:top-0">
          <GoBell color="#b8b8b8" size={24} />
        </button>
        <div className="w-0.5 bg-divider h-8" />
        {/* {activePage ? (
          <div className="flex items-center gap-1 font-semibold">
            {activePage.icon} {activePage.title}
          </div>
        ) : null} */}
      </div>

      <div className="md:hidden bg-primary-light-gray p-2.5 flex sticky top-0 justify-between items-center z-[100] h-12">
        <button onClick={handleToggleNav}>
          <RiMenu5Fill size={24} color="#b8b8b8" />
        </button>
        <button className="absolute after:content-[''] after:absolute after:h-2 after:w-2 after:rounded-full after:bg-[#FF0000] after:top-0">
          <GoBell color="#b8b8b8" size={24} />
        </button>

        <div className="flex items-center gap-1 font-semibold">
          {/* {activePage ? (
            <>
              <span>{activePage.icon}</span> <span>{activePage.title}</span>
            </>
          ) : null} */}
        </div>

        <div className="w-9">
          <MdOutlineSearch size={24} color="#b8b8b8" />
        </div>
      </div>
    </>
  );
}
