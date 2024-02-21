import Image from "next/image";
import { assets } from "@/components/assets";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <header className="sticky top-0 left-0 right-0 z-10">
        <div className={`w-full flex justify-between p-2 ${cn}`}>
          <a
            href="/"
            className="flex items-center text-2xl font-semibold text-gray-900 dark:text-white"
          >
            <div
              className="mr-4"
              style={{ borderRadius: "5px", overflow: "hidden" }}
            >
              <Image src={assets.png.LOGO} alt="logo" width={64} height={64} />
            </div>
            Dhora
          </a>
          <div className="flex md:order-2 gap-4 p-2">
            <a href="/login">
              <Button className="w-[100px]">Login</Button>
            </a>
          </div>
        </div>
      </header>
      {children}
      <footer className={`flex justify-between p-4 items-center w-full ${cn}`}>
        <div className="ml-10">
          <span className="text-sm sm:text-center">
            © 2023
            <a href="/" className="hover:underline">
              {" "}
              Dhora.
            </a>
            <span> All Rights Reserved.</span>
          </span>
        </div>
        <div className="mr-10">
          <ul className="mt-3 flex flex-wrap items-center text-sm font-medium sm:mt-0">
            <li>
              <a href="/privacy" className="mr-4 hover:underline md:mr-6">
                Privacy
              </a>
            </li>
            <li>
              <a href="/terms" className="mr-4 hover:underline md:mr-6">
                Terms
              </a>
            </li>
            <li>
              <a href="/forum" className="hover:underline">
                {" "}
                Forum
              </a>
            </li>
          </ul>
        </div>
      </footer>
    </>
  );
}
