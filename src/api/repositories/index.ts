import { AxiosInstance } from "axios";
import authRepository from "./auth";
import productRepository from "./product";
import axiosInstance from "src/api/axisInstance";
const repositories = (axios: AxiosInstance) => ({
  auth: authRepository(axios),
  product: productRepository(axios),
});

export default repositories(axiosInstance);
