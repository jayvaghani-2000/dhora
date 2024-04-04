import React from "react";
import ProtectedNavbarLayout from "./_components/navbar";
import { me } from "@/actions/(auth)/me";

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await me();

  if (!user) {
    return <div className="text-center">Unable to fetch user details</div>;
  }

  return (
    <ProtectedNavbarLayout user={user.data}>{children}</ProtectedNavbarLayout>
  );
}
