"use client";

import { usePathname, useRouter } from "next/navigation";
import React, { useCallback, useEffect } from "react";

import { useAppDispatch } from "@/provider/store";
import { setAuthData, useAuthStore } from "@/provider/store/authentication";
import { ConfirmAccount } from "@/components/confirm-account";
import { me } from "@/actions/(auth)/me";
import { profileType } from "@/actions/_utils/types.type";
import { authRoutes, publicRoutes } from "@/routes";
import Spinner from "../shared/spinner";

const publicRouteList = [...publicRoutes, ...authRoutes];

type propType = {
  children: React.ReactNode;
};

const WithAuth = ({ children }: propType) => {
  const path = usePathname();
  const router = useRouter();
  const { authCheck, profile, authenticated } = useAuthStore();
  const dispatch = useAppDispatch();

  const isPublicRoute = publicRouteList.includes(path);

  useEffect(() => {
    const handleVerifySession = async () => {
      const user = await me();

      const profile = user.data as profileType;

      if (user.success) {
        dispatch(
          setAuthData({
            profile: profile,
            authenticated: true,
            isBusinessUser: !!profile?.business_id,
            authCheck: true,
          })
        );
      } else {
        dispatch(
          setAuthData({
            authCheck: true,
            authenticated: false,
            profile: {} as profileType,
            isBusinessUser: false,
          })
        );

        if (!publicRouteList.includes(path)) {
          router.replace(authRoutes[0]);
        }
      }
    };
    handleVerifySession();
  }, [authenticated, router, dispatch, path]);

  const body =
    authenticated && !profile?.email_verified ? <ConfirmAccount /> : children;

  return !authCheck && authRoutes.includes(path) ? (
    <div className="h-screen flex justify-center items-center">
      <div className="flex flex-col items-center justify-center">
        <div>
          <Spinner />
        </div>
      </div>
    </div>
  ) : (
    <>{isPublicRoute ? children : body}</>
  );
};

export default WithAuth;
