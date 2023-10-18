import axiosInstance from "src/api/axiosInstance";
import { ILoginRequestData, IRegisterRequestData } from "src/types/authTypes";

const authApiMethod = {
  login: (data: ILoginRequestData) => {
    const url = "/login/";
    return axiosInstance.post(url, data);
  },

  register: (data: IRegisterRequestData) => {
    const url = "/register/";
    return axiosInstance.post(url, data);
  },
};

export default authApiMethod;
