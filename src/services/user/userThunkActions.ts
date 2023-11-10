import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError, AxiosRequestConfig } from "axios";
import repositories from "src/api/repositories";
import { ILoginResponseError } from "src/types/authTypes";
import { IRequestedOrder } from "src/types/productTypes";

export const getUserInfoMethod = createAsyncThunk(
  "user/getUserInfoMethod",
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

export const addOrderMethod = createAsyncThunk(
  "user/addOrderMethod",
  async (order: IRequestedOrder, thunkApi) => {
    try {
      const response = await repositories.order.create(order);
      return response.data;
    } catch (err) {
      const error = err as AxiosError<ILoginResponseError>;
      return thunkApi.rejectWithValue(error.response);
      // throw error.response;
    }
  }
);

export const getAllOrderMethod = createAsyncThunk(
  "user/getAllOrderMethod",
  async (query: AxiosRequestConfig, thunkApi) => {
    try {
      const response = await repositories.order.getMany(query);
      return response.data;
    } catch (err) {
      const error = err as AxiosError<ILoginResponseError>;
      return thunkApi.rejectWithValue(error.response);
    }
  }
);

export const getOneOrderMethod = createAsyncThunk(
  "user/getOneOrderMethod",
  async (id: string, thunkApi) => {
    try {
      const response = await repositories.order.getOne(id);

      return response.data;
    } catch (err) {
      const error = err as AxiosError<ILoginResponseError>;
      return thunkApi.rejectWithValue(error.response);
    }
  }
);
