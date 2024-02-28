import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/provider/store/authentication";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RxCross1 } from "react-icons/rx";

const Secondary = () => {
  const location = usePathname();
  const { isBusinessUser } = useAuthStore();

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <div className="pl-5 pr-2 py-2 font-bold flex justify-between items-center text-base md:h-12 border-b-2 border-secondary-black mb-2">
        {isBusinessUser ? <span>Business</span> : <span>User</span>}
        <button className="inline-block md:hidden">
          <RxCross1 />
        </button>
      </div>
      <ScrollArea className="flex-1 px-3"></ScrollArea>

      {/* {MENU_ITEMS.map(i => (
            <Link
              href={i.path}
              key={i.path}
              className={clsx({
                "px-5 py-2.5 relative whitespace-nowrap uppercase font-semibold text-xs text-secondary-light-gray hover:bg-active hover:text-white transition-all duration-500 flex gap-1 items-center":
                  true,
                "bg-active before:content-[''] before:absolute before:w-[5px] before:bg-white before:left-0 before:top-0 before:bottom-0":
                  location.startsWith(i.path),
              })}
            >
              {i.icon} {i.title}
            </Link>
          ))} */}
    </div>
  );
};

export default Secondary;
