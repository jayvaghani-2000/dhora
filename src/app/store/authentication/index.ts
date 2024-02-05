import { createSlice } from "@reduxjs/toolkit";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../index";
import { AuthType, profileType } from "./authentication.types";

export const initialState = {
  loading: false,
  authenticated: false,
  token: "",
  profile: {} as profileType,
  authCheck: false,
  redirectTo: "/",
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
