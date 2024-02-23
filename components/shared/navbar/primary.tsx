import Image from "next/image";
import Link from "next/link";

import { assets } from "@/components/assets";
import { Button } from "@/components/ui/button";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { logout } from "@/actions/(public)/(auth)/logout";
import { useAppDispatch } from "@/provider/store";
import { setAuthData } from "@/provider/store/authentication";

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
    <div className="flex flex-col justify-between bg-primary-gray w-[60px] md:w-[72px] py-[10px]  md:py-[20px] px-[10px]">
      <div className="flex flex-col gap-4">
        <Link
          href={DEFAULT_LOGIN_REDIRECT}
          className="relative w-full"
          style={{ borderRadius: "5px", overflow: "hidden", aspectRatio: 1 }}
        >
          <Image src={assets.png.LOGO} alt="logo" fill />
        </Link>
      </div>
      <div className="flex flex-col gap-4 mb-2">
        <Button
          variant={"link"}
          className="text-white p-0"
          onClick={handleSignOut}
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Primary;
