import { AxiosInstance } from "axios";
import authRepository from "./auth";
import productRepository from "./product";
import orderRepository from "./order";
import productCategoriesRepository from "./productCategories";
import axiosInstance from "src/api/axiosInstance";
import productFeedbackRepository from "./productFeedback";

const repositories = (axios: AxiosInstance) => ({
  auth: authRepository(axios),
  product: productRepository(axios),
  order: orderRepository(axios),
  productCategories: productCategoriesRepository(axios),
  productFeedback: productFeedbackRepository(axios),
});

export default repositories(axiosInstance);
