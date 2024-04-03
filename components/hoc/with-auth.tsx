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
import Script from "next/script";
import { setGlobalData } from "@/provider/store/global";

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
      const user = await me(true);

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

  return (
    <>
      {!authCheck && authRoutes.includes(path) ? (
        <div className="h-screen flex justify-center items-center">
          <div className="flex flex-col items-center justify-center">
            <div>
              <Spinner />
            </div>
          </div>
        </div>
      ) : (
        <>{isPublicRoute ? children : body}</>
      )}
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}&libraries=places`}
        onLoad={e => {
          dispatch(
            setGlobalData({
              mapScriptLoaded: true,
            })
          );
        }}
      ></Script>
    </>
  );
};

export default WithAuth;
