import { AxiosInstance } from "axios";
import factories from "src/api/repositories/factories";
const resource = "/orders";

const productRepository = (axios: AxiosInstance) => factories(axios)(resource);
export default productRepository;
