import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import { Inter } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/provider";
import WithAuth from "@/components/hoc/with-auth";
import Script from "next/script";

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
      <body
        className={`${inter.className} bg-fixed min-h-screen overscroll-none`}
      >
        <StoreProvider>
          <WithAuth>
            <>{children}</>
          </WithAuth>
        </StoreProvider>
        <Toaster />
      </body>
      <Script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCsO4xC-C0rhBFeJmhtO3j-x2MDM-GYprA&libraries=places"></Script>
    </html>
  );
}
