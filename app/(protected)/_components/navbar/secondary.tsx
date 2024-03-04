"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { usePathname } from "next/navigation";
import SecondaryNavbarHeader from "./components/secondaryNavbarHeader";
import SecondaryNavbarSearch from "./components/secondaryNavbarSearch";
import { Separator } from "@/components/ui/separator";
import { BsShop } from "react-icons/bs";
import { LiaFileContractSolid } from "react-icons/lia";
import SecondaryNavbarItem from "./components/secondaryNavbarItem";

export const StaticOptions = [
  {
    key: "me",
    options: [
      {
        key: "marketplace",
        title: "Marketplace",
        icon: <BsShop />,
        path: "/marketplace",
      },
    ],
  },
  {
    key: "@me",
    options: [
      {
        key: "marketplace",
        title: "Marketplace",
        icon: <BsShop />,
        path: "/marketplace",
      },
    ],
  },
  {
    key: "business",
    options: [
      {
        key: "contracts",
        title: "Contracts",
        icon: <LiaFileContractSolid />,
        path: "/business/contracts",
      },
    ],
  },
];

const Secondary = () => {
  const path = usePathname();
  const key = StaticOptions.findIndex(o => path.startsWith(`/${o.key}`));
  const route = StaticOptions[key];
  const options = route.options;

  if (!options) return null;

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <SecondaryNavbarHeader title={route.key} />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <SecondaryNavbarSearch data={[]} />
        </div>
        <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
        {options &&
          options.map(o => {
            return (
              <SecondaryNavbarItem
                key={o.key}
                id={o.key}
                title={o.title}
                icon={o.icon}
                path={o.path}
                currentPath={path}
              />
            );
          })}
      </ScrollArea>
    </div>
  );
};

export default Secondary;
