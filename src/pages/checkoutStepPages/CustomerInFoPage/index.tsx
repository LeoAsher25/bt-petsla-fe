import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useMemo } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  FloatingLabel,
  Form,
  Row,
} from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import TopCartItem from "src/components/TopCartItem";
import { clearCart } from "src/services/product/productSlice";
import { addOrderMethod } from "src/services/user/userThunkActions";
import { RootState } from "src/stores/rootReducer";
import { IOrderInfo } from "src/types/authTypes";
import {
  EPaymentMethod,
  ICartProduct,
  IRequestedOrder,
} from "src/types/productTypes";
import { ERouterPath } from "src/types/route";
import { handleError } from "src/utils/handleError";
import {
  useAppDispatch,
  useAppSelector,
} from "src/utils/hook.ts/customReduxHook";
import { customerInfoPageSchema } from "src/utils/yup";
import { resetCurrentProduct } from "src/services/product/productSlice";
import "./CustomerInFoPage.scss";
const CustomerInFoPage = () => {
  const { themeState, productState, authState } = useAppSelector(
    (state: RootState) => state
  );
  const { style } = themeState;
  const { totalInCart, cartList, currentProduct } = productState;
  const { currentUser } = authState;

  const defaultValues: IOrderInfo = useMemo(
    () => ({
      fullName: currentUser?.fullName,
      phoneNumber: currentUser?.phoneNumber || "",
      address: currentUser?.address || "",
      note: "",
    }),
    [currentUser]
  );
  const { t } = useTranslation();
  const form = useForm({
    resolver: yupResolver(customerInfoPageSchema),
    defaultValues,
  });

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleBack = () => {
    navigate(ERouterPath.CART);
  };

  const handleNext = async () => {
    try {
      const order: IRequestedOrder = {
        orderItems: currentProduct
          ? [
              {
                productId: currentProduct._id,
                quantity: 1,
                price: currentProduct.price,
                name: currentProduct.name,
                image: currentProduct.image,
              },
            ]
          : cartList.map((product: ICartProduct) => ({
              productId: product._id,
              quantity: product.quantity,
              price: product.price,
              name: product.name,
              image: product.image,
            })),
        phoneNumber: form.getValues("phoneNumber")!,
        address: form.getValues("address")!,
        note: form.getValues("note")!,
        fullName: form.getValues("fullName")!,

        paymentMethod: EPaymentMethod.COD,
      };
      if (!currentProduct && (totalInCart?.quantity as number) <= 0) {
        toast.warning(t("message.noProductInCart"));
      } else {
        await dispatch(addOrderMethod(order)).unwrap();
        toast.success("Đặt hàng thành công");
        dispatch(clearCart());
        navigate(`${ERouterPath.ACCOUNT}/${ERouterPath.ORDERS}`);
      }
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    form.reset(defaultValues);
  }, [form, defaultValues]);

  useEffect(() => {
    return () => {
      dispatch(resetCurrentProduct());
    };
  }, [dispatch, currentProduct]);

  return (
    <div className="cart-page">
      <Container className="cart-page-container">
        {/* <Row>
          <CheckoutSteps pathname={ERouterPath.CUSTOMER_INFO} />
        </Row> */}

        <Form className="my-5" onSubmit={form.handleSubmit(handleNext)}>
          <Row>
            <Col xs="12" md="7" lg="8">
              <Card
                style={{
                  backgroundColor: style.backgroundColor,
                  color: style.color,
                }}>
                <Card.Header className="cart-page-header">
                  Thông tin giao hàng
                </Card.Header>

                <Card.Body>
                  <Form.Group className="my-3">
                    <Form.Label> {t("label.fullname")} </Form.Label>
                    <Form.Control
                      style={{
                        backgroundColor: style.backgroundColor1,
                        color: style.color,
                      }}
                      type="text"
                      placeholder="Họ tên"
                      {...form.register("fullName")}
                    />
                    <Form.Text className="text-danger">
                      {form.formState.errors.fullName?.message}
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="my-3">
                    <Form.Label> {t("label.phoneNumber")} </Form.Label>
                    <Form.Control
                      style={{
                        backgroundColor: style.backgroundColor1,
                        color: style.color,
                      }}
                      type="text"
                      placeholder="Số điện thoại"
                      {...form.register("phoneNumber")}
                    />
                    <Form.Text className="text-danger">
                      {form.formState.errors.phoneNumber?.message}
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="my-3">
                    <Form.Label> {t("label.address")} </Form.Label>
                    <Form.Control
                      style={{
                        backgroundColor: style.backgroundColor1,
                        color: style.color,
                      }}
                      type="text"
                      placeholder="Địa chỉ"
                      {...form.register("address")}
                    />
                    <Form.Text className="text-danger">
                      {form.formState.errors.address?.message}
                    </Form.Text>
                  </Form.Group>

                  <Form.Label> {t("label.note")} </Form.Label>
                  <FloatingLabel label={t("label.note")}>
                    <Form.Control
                      style={{
                        backgroundColor: style.backgroundColor1,
                        color: style.color,
                        height: "100px",
                      }}
                      {...form.register("note")}
                      className="cart-page-note"
                      as="textarea"
                      type="text"
                      placeholder="Brief Note"
                    />
                  </FloatingLabel>
                </Card.Body>
              </Card>
            </Col>
            <Col xs="12" md="5" lg="4">
              <Card
                style={{
                  backgroundColor: style.backgroundColor,
                }}>
                <div className="cart-page-content">
                  <div className="header" style={{ marginBottom: 0 }}>
                    <div className="header-wrap">
                      <span className="total-title">{`${t(
                        "title.quantity"
                      )}:`}</span>
                      <span className="total-value">
                        {`${currentProduct ? 1 : totalInCart?.quantity} ${t(
                          "title.item"
                        )}`}
                      </span>
                    </div>

                    <div className="header-wrap">
                      <span className="total-title">{`${t(
                        "title.totalPrice"
                      )}:`}</span>
                      <span className="total-value">
                        {`${
                          currentProduct
                            ? Number(currentProduct.price)?.toLocaleString()
                            : totalInCart?.price?.toLocaleString()
                        }đ`}
                      </span>
                    </div>
                  </div>

                  <div className="cart-page-list">
                    {currentProduct ? (
                      <TopCartItem
                        product={
                          { ...currentProduct, quantity: 1 } as ICartProduct
                        }
                        isReviewing={true}
                      />
                    ) : (
                      cartList.map((product: ICartProduct) => (
                        <TopCartItem
                          key={product._id}
                          product={product}
                          isReviewing={true}
                        />
                      ))
                    )}
                  </div>

                  <div className="shop-note-wrap">
                    <span className="note-title">Chú ý: </span>

                    <span className="note-content">
                      Hiện tại chúng tôi chỉ hỗ trợ thanh toán trực tiếp khi
                      nhận hàng.
                    </span>
                  </div>

                  <div className="cart-page-btn-wrap">
                    <Row>
                      <Col>
                        <Button
                          className="cart-page-btn custom-btn"
                          onClick={handleBack}>
                          Quay lại
                        </Button>
                      </Col>
                      <Col>
                        <Button
                          type="submit"
                          className="cart-page-btn checkout-btn custom-btn bg-fill"
                          onClick={handleNext}>
                          Tiếp tục
                        </Button>
                      </Col>
                    </Row>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </Form>
      </Container>
    </div>
  );
};

export default CustomerInFoPage;
