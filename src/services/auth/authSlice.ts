import { createSlice } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { t } from "i18next";
import { toast } from "react-toastify";
import { loginMethod } from "src/services/auth/authThunkActions";
import {
  ILoginRequestData,
  ILoginResponseData,
  ILoginResponseError,
} from "src/types/authTypes";
import {
  getLocalStorage,
  removeLocalStorage,
  setLocalStorage,
} from "src/utils/localStorage";

interface IInitialState {
  accessToken?: string;
  refreshToken?: string;
}

const initialState: IInitialState = {
  accessToken: getLocalStorage("accessToken"),
  refreshToken: getLocalStorage("refreshToken"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutMethod: (state) => {
      state.accessToken = "";
      removeLocalStorage("accessToken");
      removeLocalStorage("refreshToken");
    },
    setItem(state, action) {
      Object.assign(state, action.payload);
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(loginMethod.fulfilled, (state, action) => {
        const payload = action.payload as AxiosResponse<
          ILoginResponseData,
          ILoginRequestData
        >;
        state.accessToken = payload.data.accessToken!;
        setLocalStorage("accessToken", state.accessToken);
        toast.success(t("message.success.login"));
      })
      .addCase(loginMethod.rejected, (state, action) => {
        const payload = action.payload as AxiosResponse<
          ILoginResponseError,
          ILoginRequestData
        >;
        toast.error(payload.data.detail);
      });
  },
});

export const authReducer = authSlice.reducer;

export const authActions = authSlice.actions;
