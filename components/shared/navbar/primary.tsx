import Image from "next/image";
import Link from "next/link";

import { assets } from "@/components/assets";
import { Button } from "@/components/ui/button";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { logout } from "@/actions/(public)/(auth)/logout";
import { useAppDispatch } from "@/provider/store";
import { setAuthData } from "@/provider/store/authentication";
import { Separator } from "@/components/ui/separator";
import { PiBuildings } from "react-icons/pi";
import { ScrollArea } from "@/components/ui/scroll-area";

const Primary = () => {
  const dispatch = useAppDispatch();

  const handleSignOut = async () => {
    await logout();
    dispatch(
      setAuthData({
        authenticated: false,
      })
    );
  };

  return (
    <div className="flex flex-col justify-between bg-primary-gray w-[60px] md:w-[72px] py-[10px] md:py-[10px] px-[10px]">
      <div className="flex flex-col gap-1">
        <Link
          href={DEFAULT_LOGIN_REDIRECT}
          style={{ borderRadius: "5px", overflow: "hidden", aspectRatio: 1 }}
        >
          <div className="relative w-full">
            <Image src={assets.png.TRANSPARENT_LOGO} alt="logo" />
          </div>
        </Link>
        <Separator className="bg-zinc-400 my-1" />
        <Link
          href={DEFAULT_LOGIN_REDIRECT}
          className="border border-white p-[2px]"
          style={{ borderRadius: "5px", overflow: "hidden", aspectRatio: 1 }}
        >
          <PiBuildings />
        </Link>
        <Separator className="bg-zinc-400 my-1" />
        <ScrollArea className="w-full">
          <Link
            href={DEFAULT_LOGIN_REDIRECT}
            className="border border-white p-[2px]"
            style={{ borderRadius: "5px", overflow: "hidden", aspectRatio: 1 }}
          >
            <PiBuildings />
          </Link>
        </ScrollArea>
      </div>
      <div className="flex flex-col">
        <Separator className="bg-zinc-400 my-1" />
        <Button
          variant={"link"}
          className="text-white p-0 h-[52px]"
          onClick={handleSignOut}
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Primary;
