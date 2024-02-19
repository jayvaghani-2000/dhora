import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { me } from "@/actions/(public)/(auth)/me";
import StoreProvider from "@/provider";
import WithAuth from "@/components/hoc/with-auth";

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
          <WithAuth>{children}</WithAuth>
        </StoreProvider>
      </body>
    </html>
  );
}
