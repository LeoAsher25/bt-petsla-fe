import { Col, Row } from "react-bootstrap";
import NoItems from "src/components/NoItems";

import ProductItem from "src/components/ProductItem";
import { IProduct } from "src/types/productTypes";
import "./ProductList.scss";

interface IProductListProps {
  productList: IProduct[];
  isLoading?: boolean;
}

const ProductList = ({ productList, isLoading }: IProductListProps) => {
  return (
    <div className="product-list ">
      {productList.length === 0 ? (
        <NoItems />
      ) : (
        <Row className="">
          {productList.map((product: IProduct) => (
            <Col
              xs="6"
              md="4"
              lg="3"
              className="px-2 px-xl-3 py-xl-2 d-flex"
              key={product._id}>
              <ProductItem product={product} />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default ProductList;
