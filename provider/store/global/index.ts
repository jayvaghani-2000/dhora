import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useMemo } from "react";
import { useSelector } from "react-redux";

import { RootState } from "../index";
import { GlobalState } from "./global.types";

const initialState: GlobalState = {
  errors: [],
  errorMessage: "",
  success: false,
  successMessage: "",
  maintenance: false,
  mapScriptLoaded: false,
};
export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setGlobalData: (state, action: { payload: Partial<GlobalState> }) => {
      Object.assign(state, action.payload);
    },
    toggleMaintenanceMode: (
      state: GlobalState,
      { payload }: PayloadAction<boolean>
    ) => {
      state.maintenance = payload;
    },
    setErrors: (state: GlobalState, { payload }: PayloadAction<any[]>) => {
      state.errors = payload;
      state.errorMessage = "";
    },
    clearErrors: (state: GlobalState) => {
      state.errors = [];
      state.errorMessage = "";
    },

    setSuccess: (state: GlobalState, { payload }: PayloadAction<string>) => {
      state.success = true;
      state.successMessage = payload;
    },
    clearSuccess: (state: GlobalState) => {
      state.success = false;
      state.successMessage = "";
    },
  },
});

const selectGlobal = (state: RootState) => state.global;
export const useGlobalStore = () => {
  const global = useSelector(selectGlobal);
  return useMemo(() => global, [global]);
};
export const {
  setGlobalData,
  clearErrors,
  clearSuccess,
  setErrors,
  setSuccess,
  toggleMaintenanceMode,
} = globalSlice.actions;
export default globalSlice.reducer;
