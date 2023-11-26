import React from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { setLoginModalIsOpen } from "src/services/modal/modalSlice";
import { addToCart, setItem } from "src/services/product/productSlice";
import { RootState } from "src/stores/rootReducer";
import { ICartProduct, IProduct } from "src/types/productTypes";
import { ERouterPath } from "src/types/route";
import Media from "src/utils/Media";
import getFullPathMedia from "src/utils/Media/getFullPathMedia";
import {
  useAppDispatch,
  useAppSelector,
} from "src/utils/hook.ts/customReduxHook";
import "./ProductItem.scss";
import { setLocalStorage } from "src/utils/localStorage";

const ProductItem = (props: { product: IProduct }) => {
  const { product } = props;
  const productUrlImg = `url('${
    getFullPathMedia(product.image) || Media.errorLoading
  }')`;

  const { t } = useTranslation();

  const { authState, themeState } = useAppSelector((state: RootState) => state);
  const { accessToken } = authState;
  const { style } = themeState;

  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  function handleAddToCartClick(product: IProduct) {
    const newCartProduct: ICartProduct = {
      _id: product._id,
      name: product.name,
      image: product.image,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      price: product.price,
      quantity: 1,
    };
    dispatch(addToCart(newCartProduct));
    toast.success(t("message.success.addToCart"));
  }

  const handleBuyNowOnClick = (product: IProduct) => {
    if (accessToken) {
      // toast.success(t("message.success.checkout"));
      dispatch(
        setItem({
          currentProduct: product,
        })
      );
      setLocalStorage("currentProduct", product);
      navigate(ERouterPath.CUSTOMER_INFO);
    } else {
      toast.warn(t("message.warning.loginFirst"));
      dispatch(setLoginModalIsOpen(true));
    }
  };

  const formatPrice = (price: number) => {
    let priceStr = new Intl.NumberFormat("de-DE").format(price);
    return priceStr;
  };

  return (
    <>
      <div
        className="product-item mt-3 shadow-sm flex-fill d-flex flex-column"
        style={{ backgroundColor: style.backgroundColor }}>
        <Link
          to={`${ERouterPath.PRODUCTS}/${product._id}`}
          state={{ product: product }}>
          <div
            className="ava"
            style={{
              paddingTop: "100%",
              backgroundImage: productUrlImg,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}></div>
        </Link>

        <div
          className="content p-2 p-lg-3 flex-fill"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
          }}>
          <div className="desc">
            <Link to={`${ERouterPath.PRODUCTS}/${product._id}`}>
              <span className="title">{product.name}</span>
            </Link>
            {product.rating ? (
              <div className="d-flex gap-1" style={{ margin: "-4px 0" }}>
                {[1, 2, 3, 4, 5].map((value) => (
                  <div key={value} style={{ cursor: "pointer" }}>
                    <i
                      className={`bi ${
                        !product.rating || value > product.rating
                          ? "bi-star"
                          : "bi-star-fill"
                      }`}
                      style={{ fontSize: 14, color: "#e69646" }}></i>
                  </div>
                ))}
              </div>
            ) : (
              <></>
            )}
            <div className="price"> {formatPrice(product.price)}</div>
          </div>
          <div className="buy-cart-wrap w-100 mt-auto">
            <div
              className="buy button-wrap"
              onClick={() => handleBuyNowOnClick(product)}>
              <i className="bi bi-bag  d-none d-md-block"></i>
              <span>Mua ngay</span>
            </div>

            <div
              className="cart button-wrap"
              onClick={() => handleAddToCartClick(product)}>
              <i className="bi bi-cart3"></i>
              <span className=" d-none d-xl-block">Thêm vào giỏ</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductItem;
