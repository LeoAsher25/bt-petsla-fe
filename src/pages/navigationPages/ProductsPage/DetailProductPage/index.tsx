import { useEffect } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "src/components/Loading";
import { setLoginModalIsOpen } from "src/services/modal/modalSlice";
import { getOneProductMethod } from "src/services/product/productThunkActions";
import {
  addToCart,
  resetCurrentProduct,
} from "src/services/product/productSlice";
import { RootState } from "src/stores/rootReducer";
import { ERequestStatus } from "src/types/commonType";
import { ICartProduct } from "src/types/productTypes";
import { ERouterPath } from "src/types/route";
import Media from "src/utils/Media";
import getFullPathMedia from "src/utils/Media/getFullPathMedia";
import {
  useAppDispatch,
  useAppSelector,
} from "src/utils/hook.ts/customReduxHook";
import "./DetailProductPage.scss";

const DetailProductPage = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { currentProduct, requestStatus } = useAppSelector(
    (state: RootState) => state.productState
  );

  const { t } = useTranslation();
  const navigate = useNavigate();

  const { style } = useSelector((state: RootState) => state.themeState);
  const { accessToken } = useSelector((state: RootState) => state.authState);

  // handle add to cart click
  function handleAddToCartClick() {
    const newCartProduct: ICartProduct = {
      _id: currentProduct?._id!,
      name: currentProduct?.name!,
      image: currentProduct?.image!,
      createdAt: currentProduct?.createdAt!,
      updatedAt: currentProduct?.updatedAt!,
      price: currentProduct?.price!,
      quantity: 1,
    };
    dispatch(addToCart(newCartProduct));
    toast.success(t("message.success.addToCart"));
  }

  const handleBuyNowOnClick = () => {
    if (accessToken) {
      toast.success(t("message.success.checkout"));
    } else {
      toast.warn(t("message.warning.loginFirst"));
      dispatch(setLoginModalIsOpen(true));
    }
  };

  useEffect(() => {
    if (!id) {
      navigate(ERouterPath.NOT_FOUND);
    } else dispatch(getOneProductMethod(id));

    return () => {
      dispatch(resetCurrentProduct());
    };
  }, [dispatch, id, navigate]);

  return (
    <div
      className="product-detail-page"
      style={{ backgroundColor: style.backgroundColor, color: style.color }}>
      {requestStatus === ERequestStatus.PENDING && <Loading />}
      <Container className="product-detail">
        <Row>
          <Col md="6">
            <div className="product-img__wrap">
              <img
                src={
                  getFullPathMedia(currentProduct?.image) || Media.errorLoading
                }
                alt=""
              />
            </div>
          </Col>

          <Col md="6">
            <div className="product-detail-infor">
              <h2 className="product-title">{currentProduct?.name}</h2>
              <div className="product-price">
                <span>{currentProduct?.price}đ</span>
              </div>

              <div className="btn-wrap">
                <Button
                  className="btn-item custom-btn "
                  onClick={() => handleBuyNowOnClick()}>
                  <span className="">Mua ngay</span>
                </Button>
                <Button
                  className="btn-item custom-btn bg-fill"
                  onClick={() => handleAddToCartClick()}>
                  <span className="">Thêm vào giỏ</span>
                </Button>
              </div>

              <div
                className="product-desc"
                style={{ borderColor: style.borderColor }}>
                <h3 className="product-desc-title">Thông tin sản phẩm</h3>
                {/* <span className="detail">{currentProduct?.description}</span> */}
                <div
                  className="detail"
                  dangerouslySetInnerHTML={{
                    __html: currentProduct?.description!,
                  }}></div>
              </div>
            </div>
            {/* end of product-detail-infor  */}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default DetailProductPage;
