import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SecondaryNavbarItemProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  path: string;
  submenu?: {
    title: string;
    key: string;
    icon: React.ReactNode;
    path: string;
  }[];
}

export default function SecondaryNavbarItem(props: SecondaryNavbarItemProps) {
  const currentPath = usePathname();
  const { id, title, icon, path, submenu = [] } = props;

  return (
    <div className="mb-1">
      <Link href={path}>
        <button
          className={cn(
            "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
            currentPath.includes(id) && "bg-zinc-700/20 dark:bg-zinc-700"
          )}
        >
          {icon}
          <p
            className={cn(
              "line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
              currentPath.includes(id) &&
                "text-primary dark:text-zinc-200 dark:group-hover:text-white"
            )}
          >
            {title}
          </p>
        </button>
      </Link>
      {currentPath.includes(id) ? (
        <div className="pl-4">
          {submenu?.map(o => {
            return (
              <SecondaryNavbarItem
                key={o.key}
                id={o.key}
                title={o.title}
                icon={o.icon}
                path={o.path}
              />
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
