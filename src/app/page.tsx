"use client";

import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";

export default function Home() {
  const { data, status } = useSession();

  if (status === "unauthenticated") {
    return <p>Access Denied</p>;
  }

  const handleSignOut = () => {
    signOut();
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {status === "loading" ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="text-center">
          <p>{`Authenticated as ${data?.user?.email}`}</p>
          <Button type="button" className="mt-4" onClick={handleSignOut}>
            Log out
          </Button>
        </div>
      )}
    </main>
  );
}
