"use client";

import { SessionProvider } from "next-auth/react";
import React from "react";
import { Provider } from "react-redux";
import store from "../store";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <Provider store={store}>{children}</Provider>
    </SessionProvider>
  );
}
