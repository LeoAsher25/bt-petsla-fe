import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { authApiMethod } from "src/api/apiMethods";
import repositories from "src/api/repositories";
import {
  ILoginRequestData,
  ILoginResponseError,
  IRegisterRequestData,
} from "src/types/authTypes";
import { getLocalStorage } from "src/utils/localStorage";

export const loginMethod = createAsyncThunk(
  "auth/loginMethod",
  async (data: ILoginRequestData, thunkApi) => {
    try {
      const response = await repositories.auth.post(data, "login");
      return response.data;
    } catch (err) {
      const error = err as AxiosError<ILoginResponseError, ILoginRequestData>;
      return thunkApi.rejectWithValue(error.response);
    }
  }
);

export const registerMethod = createAsyncThunk(
  "auth/registerMethod",
  async (data: IRegisterRequestData, thunkApi) => {
    try {
      const response = await authApiMethod.register(data);
      return response;
    } catch (err) {
      const error = err as AxiosError<
        ILoginResponseError,
        IRegisterRequestData
      >;
      return thunkApi.rejectWithValue(error.response);
    }
  }
);

export const getProfileMethod = createAsyncThunk(
  "auth/getProfileMethod",
  async (_, thunkApi) => {
    try {
      const response = await repositories.auth.get("profile");
      return response.data;
    } catch (err) {
      const error = err as AxiosError<ILoginResponseError>;
      return thunkApi.rejectWithValue(error.response);
    }
  }
);

export const updateProfileMethod = createAsyncThunk(
  "auth/updateProfileMethod",
  async (data: any, thunkApi) => {
    try {
      const response = await repositories.auth.patch(data, "profile");
      console.log("response profile", response);
      return response.data;
    } catch (err) {
      const error = err as AxiosError<ILoginResponseError>;
      return thunkApi.rejectWithValue(error.response);
    }
  }
);

export const handleRefreshToken = createAsyncThunk(
  "auth/handleRefreshToken",
  async (_, thunkApi) => {
    try {
      const response = await repositories.auth.post(
        getLocalStorage("refreshToken"),
        "refresh-token"
      );
      return response.data;
    } catch (err) {
      const error = err as AxiosError<ILoginResponseError>;
      return thunkApi.rejectWithValue(error.response);
    }
  }
);
