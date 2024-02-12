import WithAuth from "@/components/HOC/withAuth";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import React from "react";
import AuthProvider from "./context/AuthProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dhora",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <WithAuth>{children}</WithAuth>
        </AuthProvider>
      </body>
    </html>
  );
}
