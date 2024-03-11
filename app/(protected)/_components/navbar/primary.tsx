import Image from "next/image";
import Link from "next/link";

import { assets } from "@/components/assets";
import { Button } from "@/components/ui/button";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { logout } from "@/actions/(auth)/logout";
import { useAppDispatch } from "@/provider/store";
import { setAuthData, useAuthStore } from "@/provider/store/authentication";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PiPlus } from "react-icons/pi";
import { HiOutlineBuildingOffice } from "react-icons/hi2";
import PrimaryNavbarItem from "./components/primaryNavbarItem";
import { usePathname } from "next/navigation";

const Primary = () => {
  const dispatch = useAppDispatch();
  const { isBusinessUser } = useAuthStore();
  const path = usePathname();

  const handleSignOut = async () => {
    await logout();
    dispatch(
      setAuthData({
        authenticated: false,
      })
    );
  };

  return (
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
        <div className="flex flex-col gap-1 overflow-hidden"></div>
      </ScrollArea>
      <div className="flex items-center flex-col gap-y-2">
        <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />
        <Link href={DEFAULT_LOGIN_REDIRECT}>
          <Button variant="ghost" className="h-[48px] w-[48px] p-0">
            <PiPlus size={32} />
          </Button>
        </Link>
        <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />
        <Button
          variant="ghost"
          className="text-white p-2 h-[48px] w-[48px]"
          onClick={handleSignOut}
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Primary;
