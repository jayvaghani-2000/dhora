"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { useAuthStore } from "./store/authentication";

export default function Home() {
  const { profile } = useAuthStore();

  const handleSignOut = () => {
    signOut();
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="text-center">
        <p>{`Authenticated as ${profile?.email}`}</p>
        <Button type="button" className="mt-4" onClick={handleSignOut}>
          Log out
        </Button>
      </div>
    </main>
  );
}
