import axios, { AxiosResponse } from "axios";
import queryString from "query-string";
import { authActions } from "src/services/auth/authSlice";
import { store } from "src/stores/rootReducer";
import { IErrorResponse } from "src/types/commonType";
import { getLocalStorage } from "src/utils/localStorage";

export const axiosInstance = axios.create({
  withCredentials: false,
  baseURL: process.env.REACT_APP_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  paramsSerializer: (params) => queryString.stringify(params),
});

axiosInstance.interceptors.request.use(
  async (config) => {
    let accessToken = getLocalStorage("accessToken");
    if (accessToken && config.headers) {
      config.headers["Authorization"] = "Bearer " + accessToken.slice(0, -1);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error.response);
  }
);

axiosInstance.interceptors.response.use((res) => res, handleRepositoryError);

export default axiosInstance;

async function handleRepositoryError(error: any) {
  const originalConfig = error.config;
  if (error.response) {
    console.log("error.response: ", error.response);
    // Access token was expired
    if (
      !originalConfig.url.includes("/auth/") &&
      error.response.status === 401 &&
      !originalConfig._retry
    ) {
      originalConfig._retry = true;
      try {
        const response = await axiosInstance.post("auth/refresh-token", {
          refreshToken: getLocalStorage("refreshToken"),
        });
        const { accessToken, refreshToken } = response.data;
        store?.dispatch(
          authActions.setItem({
            accessToken,
            refreshToken,
          })
        );

        return axiosInstance(originalConfig);
      } catch (error) {
        return Promise.reject(error);
      }
    } else if (error.response.data.statusCode === 404) {
    }
    return Promise.reject(error.response as AxiosResponse<IErrorResponse>);
  }
  return Promise.reject(error);
  // return Promise.resolve(err);
}
