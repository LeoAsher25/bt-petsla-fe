import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { authApiMethod } from "src/api/apiMethods";
import repositories from "src/api/repositories";
import {
  ILoginRequestData,
  ILoginResponseError,
  IRegisterRequestData,
} from "src/types/authTypes";

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
