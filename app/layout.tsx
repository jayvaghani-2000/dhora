import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/provider";
import WithAuth from "@/components/hoc/with-auth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen`}>
        <StoreProvider>
          <WithAuth>
            <div className="flex flex-col min-h-screen">{children}</div>
          </WithAuth>
        </StoreProvider>
      </body>
    </html>
  );
}
