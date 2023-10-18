import { axiosInstance } from "src/api/axiosInstance";

const productApiMethod = {
  getAll: () => {
    const url = "/products/";
    return axiosInstance.get(url);
  },

  getOne: (id: number | string) => {
    const url = `product/${id}`;
    return axiosInstance.get(url);
  },
};

export default productApiMethod;
