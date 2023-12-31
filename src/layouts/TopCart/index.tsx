import React from "react";
import { Button, Offcanvas } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import NoItems from "src/components/NoItems";
import TopCartItem from "src/components/TopCartItem";
import {
  handleMinus,
  handlePlus,
  removeFromCart,
  resetCurrentProduct,
} from "src/services/product/productSlice";
import { RootState } from "src/stores/rootReducer";
import { ERouterPath } from "src/types/route";
import {
  useAppDispatch,
  useAppSelector,
} from "src/utils/hook.ts/customReduxHook";
import "./TopCart.scss";

interface ITopCartProps {
  showCart: boolean;
  handleCloseTopCart: () => void;
}

const TopCart = ({ showCart, handleCloseTopCart }: ITopCartProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { productState, themeState, authState } = useAppSelector(
    (state: RootState) => state
  );
  const { cartList, totalInCart } = productState;
  const { style, isLightTheme } = themeState;
  const { accessToken } = authState;

  const dispatch = useAppDispatch();
  const handlePlusToCart = (id: number | string) => {
    dispatch(handlePlus(id));
  };

  const handleMinusToCart = (id: number | string) => {
    dispatch(handleMinus(id));
  };

  const handleRemoveFromCart = (id: number | string) => {
    dispatch(removeFromCart(id));
  };

  const handleViewCartClick = () => {
    handleCloseTopCart();
    navigate(ERouterPath.CART);
  };

  const handleCheckoutClick = () => {
    if (!accessToken) {
      toast.warning(t("message.warning.loginFirst"));
    } else if (cartList.length <= 0) {
      toast.warning(t("message.warning.noProductInCart"));
    } else {
      handleCloseTopCart();
      dispatch(resetCurrentProduct());
      navigate(ERouterPath.CUSTOMER_INFO);
    }
  };

  return (
    <Offcanvas
      className="top-cart"
      show={showCart}
      onHide={handleCloseTopCart}
      placement="end"
      style={{ backgroundColor: style.backgroundColor, color: style.color }}>
      <Offcanvas.Header
        className="top-cart-header"
        closeButton
        closeVariant={isLightTheme ? undefined : "white"}>
        <Offcanvas.Title className="top-cart-title">
          {`${t("title.cart")}: ${totalInCart?.quantity} ${t("title.item")}`}
        </Offcanvas.Title>
      </Offcanvas.Header>

      <Offcanvas.Body style={{ padding: 0 }}>
        {cartList.length === 0 ? (
          <NoItems message={t("message.warning.noProductInCart")} />
        ) : (
          cartList.map((product) => (
            <TopCartItem
              key={product._id}
              isLightTheme={isLightTheme}
              product={product}
              handlePlusToCart={handlePlusToCart}
              handleMinusToCart={handleMinusToCart}
              handleRemoveFromCart={handleRemoveFromCart}
            />
          ))
        )}
      </Offcanvas.Body>

      <div className="top-cart-footer">
        <Button
          className="top-cart-btn custom-btn"
          onClick={handleCheckoutClick}>
          {`${t("title.checkout")} (${totalInCart?.price?.toLocaleString()}đ)`}
        </Button>
        <Button
          className="top-cart-btn custom-btn bg-fill"
          onClick={handleViewCartClick}>
          {`${t("title.view")} ${t("title.cart")}`}
        </Button>
      </div>
    </Offcanvas>
  );
};

export default TopCart;
