import { Skeleton } from "@/components/ui/skeleton";
import { BUSINESS_MENU_ITEMS, USER_MENU_ITEMS } from "@/lib/nav-item";
import { useAuthStore } from "@/provider/store/authentication";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RxCross1 } from "react-icons/rx";

const Secondary = (props: { handleClose: () => void }) => {
  const { handleClose } = props;
  const location = usePathname();
  const { isBusinessUser, authenticated } = useAuthStore();

  const MENU_ITEMS = isBusinessUser ? BUSINESS_MENU_ITEMS : USER_MENU_ITEMS;

  return (
    <div className="bg-secondary-gray w-[248px] flex flex-col gap-1 text-white">
      {authenticated ? (
        <>
          <div className="pl-5 pr-2 py-2 font-bold flex justify-between items-center text-base md:h-12 border-b-2 border-secondary-black mb-2">
            {isBusinessUser ? <span>Business</span> : <span>User</span>}
            <button className="inline-block md:hidden" onClick={handleClose}>
              <RxCross1 />
            </button>
          </div>

          {MENU_ITEMS.map(i => (
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
          ))}
        </>
      ) : (
        <div className="px-2  flex flex-col py-2 space-y-2">
          <Skeleton className="h-6 w-full bg-primary-gray" />
          <Skeleton className="h-6 w-full bg-primary-gray" />
        </div>
      )}
    </div>
  );
};

export default Secondary;
