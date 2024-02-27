import Link from "next/link";
import Image from "next/image";
import { LuMoveUpRight } from "react-icons/lu";
import { assets } from "@/components/assets";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { me } from "@/actions/(public)/(auth)/me";
import { getInitial } from "@/lib/common";
import {
  DEFAULT_BUSINESS_LOGIN_REDIRECT,
  DEFAULT_USER_LOGIN_REDIRECT,
} from "@/routes";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await me();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 left-0 right-0 z-10 bg-primary-background md:bg-transparent">
        <div className={`w-full flex justify-between p-2 ${cn}`}>
          <Link
            href="/"
            className="flex items-center text-2xl font-semibold text-gray-900 dark:text-white p-2"
          >
            <div
              className="mr-4"
              style={{ borderRadius: "5px", overflow: "hidden" }}
            >
              <Image src={assets.png.LOGO} alt="logo" width={48} height={48} />
            </div>
            Dhora
          </Link>
          <div className="flex md:order-2 gap-4 p-2">
            {user.success ? (
              <div className="flex items-center gap-2">
                <Link
                  className="flex items-center gap-1"
                  href={
                    user.data.business_id
                      ? DEFAULT_BUSINESS_LOGIN_REDIRECT
                      : DEFAULT_USER_LOGIN_REDIRECT
                  }
                >
                  Dashboard <LuMoveUpRight />
                </Link>
                <Avatar>
                  <AvatarFallback>{getInitial(user.data.name)}</AvatarFallback>
                </Avatar>
                <span className="hidden md:inline">{user.data.name}</span>
              </div>
            ) : (
              <Link href="/login">
                <Button className="w-[100px]">Login</Button>
              </Link>
            )}
          </div>
        </div>
      </header>
      {children}
      <footer className={`flex justify-between p-4 items-center w-full ${cn}`}>
        <div className="md:ml-10 flex-1">
          <span className="text-sm sm:text-center">
            © 2023
            <a href="/" className="hover:underline">
              {" "}
              Dhora.
            </a>
            <span> All Rights Reserved.</span>
          </span>
        </div>
        <div className="md:mr-10  flex-1">
          <ul className="mt-3 flex flex-wrap items-center text-sm font-medium sm:mt-0 justify-end">
            <li>
              <Link href="/privacy" className="mr-4 hover:underline md:mr-6">
                Privacy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="mr-4 hover:underline md:mr-6">
                Terms
              </Link>
            </li>
            <li>
              <Link href="/forum" className="hover:underline">
                {" "}
                Forum
              </Link>
            </li>
          </ul>
        </div>
      </footer>
    </div>
  );
}
