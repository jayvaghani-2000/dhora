import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import { Inter } from "next/font/google";
import "./globals.css";
import "./fields.css";
import StoreProvider from "@/provider";
import WithAuth from "@/components/hoc/with-auth";
import { me } from "@/actions/(auth)/me";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dhora",
  description: "",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await me();
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.className} bg-fixed min-h-screen overscroll-none`}
      >
        <StoreProvider>
          <WithAuth user={user}>
            <>{children}</>
          </WithAuth>
        </StoreProvider>
        <Toaster />
      </body>
    </html>
  );
}
