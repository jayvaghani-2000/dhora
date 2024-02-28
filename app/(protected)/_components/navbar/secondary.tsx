import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuthStore } from "@/provider/store/authentication";
import { usePathname } from "next/navigation";
import SecondaryNavbarHeader from "./components/secondaryNavbarHeader";
import SecondaryNavbarSearch from "./components/secondaryNavbarSearch";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const Secondary = () => {
  const location = usePathname();
  const { isBusinessUser } = useAuthStore();

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <SecondaryNavbarHeader title="business" />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <SecondaryNavbarSearch data={[]} />
        </div>
        <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
        <div className="mb-2">
          <div className="space-y-[2px]">
            <button
              className={cn(
                "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
                // params?.channelId === channel.id &&
                "bg-zinc-700/20 dark:bg-zinc-700"
              )}
            >
              {/* <Icon className="flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400" /> */}
              <p
                className={cn(
                  "line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
                  // params?.channelId === channel.id &&
                  "text-primary dark:text-zinc-200 dark:group-hover:text-white"
                )}
              >
                Test
              </p>
              {/* <Lock className="ml-auto w-4 h-4 text-zinc-500 dark:text-zinc-400" /> */}
            </button>
          </div>
        </div>
      </ScrollArea>

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
