import { GoBell } from "react-icons/go";
import { MobileToggle } from "../navbar/mobileToggle";
import { usePathname } from "next/navigation";
import { StaticOptions } from "../navbar/secondary";
import { profileType } from "@/actions/_utils/types.type";

type propType = {
  user: profileType;
};

export default function Toolbar(props: propType) {
  const { user } = props;
  const path = usePathname();
  const key = StaticOptions.map(o => o.options)
    .reduce((e1, e2) => e1.concat(e2))
    .find(o => path.startsWith(o.path));

  return (
    <div className="text-md bg-primary-light-gray font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2">
      <MobileToggle user={user} />
      <button className="relative after:content-[''] after:absolute after:h-2 after:w-2 after:rounded-full after:bg-[#FF0000] after:top-0 mr-1">
        <GoBell color="#b8b8b8" size={24} />
      </button>
      <div className="w-0.5 bg-divider h-8 ml-2" />
      {key && (
        <div className="flex items-center gap-1 font-semibold ml-2">
          {key.icon} {key.title}
        </div>
      )}
    </div>
  );
}
