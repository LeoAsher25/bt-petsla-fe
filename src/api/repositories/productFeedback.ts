import { AxiosInstance } from "axios";
import factories from "src/api/repositories/factories";
const resource = "/product-feedback";

const productFeedbackRepository = (axios: AxiosInstance) =>
  factories(axios)(resource);
export default productFeedbackRepository;
