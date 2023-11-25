import { AxiosInstance } from "axios";
import factories from "src/api/repositories/factories";
const resource = "/product-categories";

const productCategoryRepository = (axios: AxiosInstance) =>
  factories(axios)(resource);
export default productCategoryRepository;
