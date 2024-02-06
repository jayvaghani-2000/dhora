"use client";

import { useSession } from "next-auth/react";

export default function Home() {
  const { data, status } = useSession();

  if (status === "unauthenticated") {
    return <p>Access Denied</p>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {status === "loading" ? (
        <p className="text-center">Loading...</p>
      ) : (
        <p className="text-center">{`Authenticated as ${data?.user?.email}`}</p>
      )}
    </main>
  );
}
