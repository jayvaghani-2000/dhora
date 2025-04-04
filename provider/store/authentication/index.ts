import { createSlice } from "@reduxjs/toolkit";
import { useMemo } from "react";
import { useSelector } from "react-redux";

import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

import { RootState } from "../index";
import { AuthType } from "./authentication.types";
import { profileType } from "@/actions/_utils/types.type";

export const initialState = {
  loading: false,
  authenticated: false,
  profile: {
    email_verified: new Date(),
    business: {
      stripe_id: `${Date.now()}`,
    },
  } as profileType,
  authCheck: false,
  redirectTo: DEFAULT_LOGIN_REDIRECT,
  isBusinessUser: false,
} as AuthType;

export const authenticationSlice = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    setAuthData: (state, action: { payload: Partial<AuthType> }) => {
      Object.assign(state, action.payload);
    },
    resetAuthData: state => {
      Object.assign(state, initialState);
    },
  },
});

const selectAuthentication = (state: RootState) => state.authentication;
export const useAuthStore = () => {
  const authentication = useSelector(selectAuthentication);
  return useMemo(() => authentication, [authentication]);
};
export const { setAuthData, resetAuthData } = authenticationSlice.actions;
export default authenticationSlice.reducer;
