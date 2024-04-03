import Link from "next/link";
import SettingsNavbar from "./_components/navbar";
import { RxCross2 } from "react-icons/rx";
import { me } from "@/actions/(auth)/me";
import {
  DEFAULT_BUSINESS_LOGIN_REDIRECT,
  DEFAULT_USER_LOGIN_REDIRECT,
} from "@/routes";

export default async function SettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await me();
  return (
    <div className="relative flex gap-24 p-16 h-full">
      <SettingsNavbar />
      <Link
        href={
          user.data?.business_id
            ? DEFAULT_BUSINESS_LOGIN_REDIRECT
            : DEFAULT_USER_LOGIN_REDIRECT
        } 
        className="absolute right-16 top-6 text-secondary-light-gray"
      >
        <RxCross2 size={32} />
      </Link>
      <div className="flex-1 h-full border rounded-md border-divider p-6 overflow-auto">
        {children}
      </div>
    </div>
  );
}
