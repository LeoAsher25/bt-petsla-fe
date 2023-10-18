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
import { ERequestStatus } from "src/types/commonType";
import {
  getLocalStorage,
  removeLocalStorage,
  setLocalStorage,
} from "src/utils/localStorage";

interface IInitialState {
  accessToken: string;
  requestStatus: ERequestStatus;
}

const initialState: IInitialState = {
  accessToken: getLocalStorage("accessToken"),
  requestStatus: ERequestStatus.FULFILLED,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutMethod: (state) => {
      state.accessToken = "";
      removeLocalStorage("accessToken");
      removeLocalStorage("currentOrderInfo");
      toast.success(t("message.success.logout"));
    },
    setItem(state, action) {
      Object.assign(state, action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginMethod.pending, (state, action) => {
        state.requestStatus = ERequestStatus.PENDING;
      })

      .addCase(loginMethod.fulfilled, (state, action) => {
        state.requestStatus = ERequestStatus.FULFILLED;
        const payload = action.payload as AxiosResponse<
          ILoginResponseData,
          ILoginRequestData
        >;
        state.accessToken = payload.data.accessToken!;
        setLocalStorage("accessToken", state.accessToken);
        toast.success(t("message.success.login"));
      })
      .addCase(loginMethod.rejected, (state, action) => {
        state.requestStatus = ERequestStatus.REJECTED;
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
