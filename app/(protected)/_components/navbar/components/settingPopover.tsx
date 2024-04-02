import { logout } from "@/actions/(auth)/logout";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/provider/store";
import { setAuthData, useAuthStore } from "@/provider/store/authentication";
import Link from "next/link";
import React from "react";
import { IoSettingsOutline } from "react-icons/io5";

const SettingsPopover = () => {
  const dispatch = useAppDispatch();
  const { profile, isBusinessUser } = useAuthStore();

  const { name, created_at, business } = profile! ?? {};
  const { name: businessName } = business! ?? {};

  const handleSignOut = async () => {
    await logout();
    dispatch(
      setAuthData({
        authenticated: false,
      })
    );
  };

  const yearOfJoining = new Date(created_at).getFullYear();

  return (
    <div>
      <div className="text-base font-medium text-secondary-light-gray">
        {name}
      </div>
      <div className="text-xs font-normal uppercase text-secondary-light-gray">
        Member since {yearOfJoining}
      </div>

      {isBusinessUser ? (
        <div className="my-2 py-1 border-y border-body-background">
          <div className="text-sm font-normal text-secondary-light-gray">
            Business:
          </div>
          <div className="text-base font-medium"> {businessName}</div>
        </div>
      ) : null}

      <div className="flex justify-between items-center">
        <Button
          onClick={handleSignOut}
          variant="link"
          className="text-sm font-normal text-secondary-light-gray p-0"
        >
          Logout
        </Button>

        <Link href="/settings/details">
          <Button
            variant="ghost"
            className="text-sm font-normal text-secondary-light-gray"
          >
            <IoSettingsOutline size={24} />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default SettingsPopover;
