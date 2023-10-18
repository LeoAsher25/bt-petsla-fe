import axiosInstance from "src/api/axiosInstance";
import { IRequestedOrder } from "src/types/productTypes";
import { getLocalStorage } from "src/utils/localStorage";

const userApiMethod = {
  getUserInfo: () => {
    const url = "/profile";
    return axiosInstance.get(url, {
      headers: {
        Authorization: "Bearer " + getLocalStorage("accessToken"),
      },
    });
  },

  addOrder: (order: IRequestedOrder) => {
    const url = `/add-order/`;
    return axiosInstance.post(url, order, {
      headers: {
        Authorization: "Bearer " + getLocalStorage("accessToken"),
      },
    });
  },

  getAllOrder: () => {
    const url = "/get-order";
    return axiosInstance.get(url, {
      headers: {
        Authorization: "Bearer " + getLocalStorage("accessToken"),
      },
    });
  },

  getOneOrder: (id: number | string) => {
    const url = `order/${id}`;
    return axiosInstance.get(url, {
      headers: {
        Authorization: "Bearer " + getLocalStorage("accessToken"),
      },
    });
  },
};

export default userApiMethod;
