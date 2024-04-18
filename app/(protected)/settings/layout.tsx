import Link from "next/link";
import SettingsNavbar from "./_components/navbar";
import { RxCross2 } from "react-icons/rx";
import { me } from "@/actions/(auth)/me";
import {
  DEFAULT_BUSINESS_LOGIN_REDIRECT,
  DEFAULT_USER_LOGIN_REDIRECT,
} from "@/routes";
import { MobileToggle } from "./_components/mobileToggle";
import { Separator } from "@/components/ui/separator";

export default async function SettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await me();

  return (
    <div className="flex flex-col w-screen">
      <div className="flex bg-primary-light-gray px-3 py-2 md:hidden justify-between">
        <div className="flex items-center gap-1">
          <MobileToggle />
          <Separator orientation="vertical" className="w-0.5 h-6 bg-divider " />
          <div className="flex items-center gap-1 font-semibold ml-2">
            Settings
          </div>
        </div>
        <Link
          href={
            user.data?.business_id
              ? DEFAULT_BUSINESS_LOGIN_REDIRECT
              : DEFAULT_USER_LOGIN_REDIRECT
          }
          className=" text-secondary-light-gray"
        >
          <RxCross2 size={24} />
        </Link>
      </div>
      <div className="relative flex gap-5 md:gap-18 p-4 md:p-16 h-full">
        <SettingsNavbar user={user.data} />
        <Link
          href={
            user.data?.business_id
              ? DEFAULT_BUSINESS_LOGIN_REDIRECT
              : DEFAULT_USER_LOGIN_REDIRECT
          }
          className="hidden md:inline absolute right-16 top-6 text-secondary-light-gray"
        >
          <RxCross2 size={32} />
        </Link>
        <div className="flex-1 h-full border rounded-md border-divider p-4 lg:p-6 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
