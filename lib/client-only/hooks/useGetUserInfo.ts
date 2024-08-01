"use client";

import { useEffect, useState } from "react";
import { getUser, me } from "@/actions/(auth)/me";

export const useGetUserInfo = () => {
  const [user, setUser] =
    useState<NonNullable<Awaited<ReturnType<typeof getUser>>>>();

  useEffect(() => {
    async function getUser() {
      const user = await me();
      setUser(user.data);
    }
    getUser();
  }, []);

  return user;
};
