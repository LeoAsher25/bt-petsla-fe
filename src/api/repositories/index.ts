import { AxiosInstance } from "axios";
import authRepository from "./auth";
import productRepository from "./product";
import productCategoriesRepository from "./productCategories";
import axiosInstance from "src/api/axiosInstance";
const repositories = (axios: AxiosInstance) => ({
  auth: authRepository(axios),
  product: productRepository(axios),
  productCategories: productCategoriesRepository(axios),
});

export default repositories(axiosInstance);
