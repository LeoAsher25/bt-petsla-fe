import React, { FormEvent } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  FormGroup,
  Row,
} from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CheckoutSteps from "src/pages/checkoutStepPages/components/CheckoutSteps";
import NoItems from "src/components/NoItems";
import TopCartItem from "src/components/TopCartItem";
import {
  handleMinus,
  handlePlus,
  removeFromCart,
} from "src/services/product/productSlice";
import { RootState } from "src/stores/rootReducer";
import { ICartProduct } from "src/types/productTypes";
import { ERouterPath } from "src/types/route";
import {
  useAppDispatch,
  useAppSelector,
} from "src/utils/hook.ts/customReduxHook";
import "./CartPage.scss";

const CartPage = () => {
  const { productState, themeState, authState } = useAppSelector(
    (state: RootState) => state
  );

  const { t } = useTranslation();
  const { cartList, totalInCart } = productState;
  const { isLightTheme, style } = themeState;
  const { accessToken } = authState;

  const navigate = useNavigate();

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

  const handleApplyVoucherClick = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const handleCheckoutClick = () => {
    if (!accessToken) {
      toast.warning(t("message.warning.loginFirst"));
    } else if (cartList.length <= 0) {
      toast.warning(t("message.warning.noProductInCart"));
    } else {
      // dispatch(setCheckoutModalIsOpen(true));
      navigate(ERouterPath.CUSTOMER_INFO);
    }
  };

  return (
    <div className="cart-page">
      <Container className="cart-page-container">
        {/* <Row>
          <CheckoutSteps pathname={ERouterPath.CART} />
        </Row> */}

        <Row className="my-5">
          <Col xs="12" md="7" lg="8">
            <Card style={{ backgroundColor: style.backgroundColor }}>
              <Card.Header className="cart-page-header">Giỏ hàng</Card.Header>
              <Card.Body>
                {cartList.length === 0 ? (
                  <NoItems message={t("message.warning.noProductInCart")} />
                ) : (
                  <Card
                    style={{
                      backgroundColor: style.backgroundColor,
                      // color: style.color,
                    }}>
                    <div className="cart-page-list">
                      {cartList.map((product: ICartProduct) => (
                        <TopCartItem
                          key={product._id}
                          isLightTheme={isLightTheme}
                          product={product}
                          handlePlusToCart={handlePlusToCart}
                          handleMinusToCart={handleMinusToCart}
                          handleRemoveFromCart={handleRemoveFromCart}
                        />
                      ))}
                    </div>
                  </Card>
                )}
              </Card.Body>
            </Card>
          </Col>
          <Col xs="12" md="5" lg="4">
            <Card
              style={{
                backgroundColor: style.backgroundColor,
                // color: style.color,
              }}>
              <div className="cart-page-content">
                <div className="header">
                  <div className="header-wrap">
                    <span className="total-title">{`${t(
                      "title.quantity"
                    )}:`}</span>
                    <span className="total-value">
                      {`${totalInCart?.quantity} ${t("title.item")}`}
                    </span>
                  </div>

                  <div className="header-wrap">
                    <span className="total-title">{`${t(
                      "title.totalPrice"
                    )}:`}</span>
                    <span className="total-value">
                      {`${totalInCart?.price?.toLocaleString()}đ`}
                    </span>
                  </div>
                </div>

                <div className="body">
                  <div className="voucher-wrap">
                    <Form onSubmit={handleApplyVoucherClick}>
                      <FormGroup>
                        <Form.Control
                          style={{
                            backgroundColor: style.backgroundColor1,
                            color: style.color,
                          }}
                          type="text"
                          placeholder={`${t("label.voucher")}`}
                          id="cart-page-voucher"
                        />
                      </FormGroup>
                      <Button className="cart-page-btn custom-btn">
                        {`${t("title.apply")} ${t(
                          "label.voucher"
                        ).toLowerCase()}`}
                      </Button>
                    </Form>
                  </div>
                </div>

                <Button
                  className="cart-page-btn checkout-btn custom-btn bg-fill"
                  onClick={handleCheckoutClick}>
                  {t("title.checkout")}
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CartPage;
