import { assets } from "@/components/assets";
import Image from "next/image";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="after:content-[''] after:absolute after:inset-0 after:bg-body-bg after:-z-10 relative min-h-screen min-w-screen flex justify-center items-center bg-mix-gradient">
      <section className="max-w-[100%] p-4 w-[600px] text-white">
        <div className="flex flex-col text-center justify-center items-center mb-8">
          <a
            href="/"
            className="flex items-center text-2xl font-semibold text-gray-900 dark:text-white
            bg-primary text-primary-foreground hover:bg-primary/90
            "
          >
            <div
              className="mr-4"
              style={{ borderRadius: "5px", overflow: "hidden" }}
            >
              <Image src={assets.png.LOGO} alt="logo" width={48} height={48} />
            </div>
            <h1>Dhora</h1>
          </a>
        </div>
        {children}
      </section>
    </main>
  );
}
