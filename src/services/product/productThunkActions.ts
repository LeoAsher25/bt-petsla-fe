import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError, AxiosRequestConfig } from "axios";
import repositories from "src/api/repositories";
import { ILoginResponseError } from "src/types/authTypes";
import { IProduct } from "src/types/productTypes";

export const getAllProductMethod = createAsyncThunk(
  "product/getAllProductMethod",
  async (config: AxiosRequestConfig, thunkApi) => {
    try {
      const response = await repositories.product.getMany(config);
      return response.data;
    } catch (err) {
      const error = err as AxiosError<ILoginResponseError>;
      return thunkApi.rejectWithValue(error.response);
    }
  }
);

export const getOneProductMethod = createAsyncThunk(
  "product/getOneProductMethod",
  async (id: string | string, thunkApi) => {
    try {
      const response = await repositories.product.getOne(id);
      return response.data as IProduct;
    } catch (err) {
      const error = err as AxiosError<ILoginResponseError>;
      return thunkApi.rejectWithValue(error.response);
    }
  }
);

export const getAllProductCategories = createAsyncThunk(
  "product/getAllProductCategories",
  async (config: AxiosRequestConfig, thunkApi) => {
    try {
      const response = await repositories.productCategories.getMany(config);
      return response.data;
    } catch (err) {
      const error = err as AxiosError<ILoginResponseError>;
      return thunkApi.rejectWithValue(error.response);
    }
  }
);
