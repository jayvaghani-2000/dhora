import Image from "next/image";
import { assets } from "@/components/assets";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PiPlus } from "react-icons/pi";
import { HiOutlineBuildingOffice } from "react-icons/hi2";
import PrimaryNavbarItem from "./components/primaryNavbarItem";
import { usePathname } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import SettingsPopover from "./components/settingPopover";
import CreateEvent from "../create-event";
import { useState } from "react";
import { profileType } from "@/actions/_utils/types.type";
import { getInitial } from "@/lib/common";
import { useAuthStore } from "@/provider/store/authentication";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type propType = {
  user: profileType;
};

const Primary = (props: propType) => {
  const { user } = props;
  const isBusinessUser = !!user?.business_id;
  const path = usePathname();
  const { profile } = useAuthStore();
  const [createEvent, setCreateEvent] = useState(false);

  const userEvents = profile?.events ? profile?.events : user?.events;

  return (
    <>
      <div className="space-y-2 flex flex-col items-center h-full text-primary w-full dark:bg-[#1E1F22] bg-[#E3E5E8] py-3">
        <PrimaryNavbarItem
          path="/@me"
          key="/@me"
          tooltip="@me"
          active={path.startsWith("/@me")}
        >
          <Image
            src={assets.png.TRANSPARENT_LOGO}
            alt="logo"
            height={36}
            width={36}
            className="rounded-md"
          />
        </PrimaryNavbarItem>
        <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />
        <div className="flex flex-col gap-2">
          {isBusinessUser && (
            <>
              <PrimaryNavbarItem
                path="/business/contracts"
                key="/business"
                tooltip="Business"
                active={path.startsWith("/business")}
              >
                <HiOutlineBuildingOffice size={32} />
              </PrimaryNavbarItem>
              <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />
            </>
          )}
        </div>
        <ScrollArea className="flex-1">
          <div className="flex flex-col gap-1 overflow-hidden">
            {userEvents?.map(i => (
              <PrimaryNavbarItem
                path={`/event/${i.id}/contracts`}
                key={i.id}
                tooltip={i.title}
                active={path.startsWith(`/event/${i.id}`)}
              >
                {i.logo ? (
                  <Image
                    src={i.logo}
                    alt="logo"
                    height={36}
                    width={36}
                    className="h-9 rounded-md object-cover"
                    sizes="100px"
                  />
                ) : (
                  getInitial(i.title)
                )}
              </PrimaryNavbarItem>
            ))}
          </div>
        </ScrollArea>
        <div className="flex items-center flex-col gap-y-2">
          <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />
          <Button
            variant="ghost"
            className="h-[48px] w-[48px] p-0"
            onClick={() => {
              setCreateEvent(true);
            }}
          >
            <PiPlus size={32} />
          </Button>
          <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className="text-white p-2 h-[48px] w-[48px]"
              >
                <Avatar>
                  <AvatarImage
                    src={user?.image ?? undefined}
                    alt="name"
                    className="object-cover"
                  />
                  <AvatarFallback>
                    {getInitial(user?.name ?? "")}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="max-w-[calc(100vw-20px)] w-72">
              <SettingsPopover />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <CreateEvent open={createEvent} setOpen={setCreateEvent} />
    </>
  );
};

export default Primary;
