import { createSlice } from "@reduxjs/toolkit";
import {
  getProfileMethod,
  handleRefreshToken,
  loginMethod,
} from "src/services/auth/authThunkActions";
import { ILoginResponseData, IUser } from "src/types/authTypes";
import {
  getLocalStorage,
  removeLocalStorage,
  setLocalStorage,
} from "src/utils/localStorage";

interface IInitialState {
  accessToken?: string;
  refreshToken?: string;
  currentUser: IUser | null;
}

const initialState: IInitialState = {
  accessToken: getLocalStorage("accessToken"),
  refreshToken: getLocalStorage("refreshToken"),
  currentUser: null,
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
    builder.addCase(loginMethod.fulfilled, (state, action) => {
      const payload = action.payload as ILoginResponseData;
      state.accessToken = payload.accessToken!;
      state.refreshToken = payload.refreshToken!;
      setLocalStorage("refreshToken", state.refreshToken);
      setLocalStorage("accessToken", state.accessToken);
    });

    builder.addCase(getProfileMethod.fulfilled, (state, action) => {
      const payload = action.payload;
      state.currentUser = payload;
    });

    builder.addCase(handleRefreshToken.fulfilled, (state, action) => {
      const payload = action.payload;
      console.log("payload: ", payload);
      // state.accessToken = payload.accessToken!;
      // state.refreshToken = payload.refreshToken!;
      // setLocalStorage("refreshToken", state.refreshToken);
      // setLocalStorage("accessToken", state.accessToken);
    });
  },
});

export const authReducer = authSlice.reducer;

export const authActions = authSlice.actions;
