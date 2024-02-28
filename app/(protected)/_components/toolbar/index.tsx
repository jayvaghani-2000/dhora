import { GoBell } from "react-icons/go";
import { MobileToggle } from "../navbar/mobileToggle";

export default function Toolbar() {
  return (
    <>
      <div className="text-md bg-primary-light-gray font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2">
        <MobileToggle />
        <button className="relative after:content-[''] after:absolute after:h-2 after:w-2 after:rounded-full after:bg-[#FF0000] after:top-0 mr-1">
          <GoBell color="#b8b8b8" size={24} />
        </button>
        <div className="w-0.5 bg-divider h-8 ml-2" />
        {/* {activePage ? (
          <div className="flex items-center gap-1 font-semibold">
            {activePage.icon} {activePage.title}
          </div>
        ) : null} */}
      </div>
    </>
  );
}
