import moment from "moment";
import React from "react";
import { Badge, Button, Card, Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import {
  Link,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router-dom";
import AccountPageHeader from "src/pages/accountPage/components/AccountPageHeader";
import {
  addOrderMethod,
  getOneOrderMethod,
} from "src/services/user/userThunkActions";
import { RootState } from "src/stores/rootReducer";
import {
  EOrderStatus,
  IOrderItem,
  IRequestedOrder,
} from "src/types/productTypes";
import { ERouterPath } from "src/types/route";
import getFullPathMedia from "src/utils/Media/getFullPathMedia";
import getEnumObject from "src/utils/getEnumObject";
import {
  useAppDispatch,
  useAppSelector,
} from "src/utils/hook.ts/customReduxHook";
import "./DetailOrderPage.scss";
import repositories from "src/api/repositories";
import { handleError } from "src/utils/handleError";
import { toast } from "react-toastify";

const DetailOrderPage = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();

  const { setShowDashboard } = useOutletContext<{
    setShowDashboard: React.Dispatch<React.SetStateAction<boolean>>;
  }>();

  const { userState, themeState } = useAppSelector((state: RootState) => state);
  const { requestStatus, currentOrder } = userState;
  const { style } = themeState;

  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleBuyAgainClick = () => {
    if (currentOrder) {
      const order: IRequestedOrder = {
        orderItems: currentOrder?.orderItems.map((product: IOrderItem) => ({
          productId: product._id,
          quantity: product.quantity!,
          name: product.name!,
          image: product.image!,
          price: Number(product.price),
        })),
        phoneNumber: currentOrder?.phoneNumber || "",
        address: currentOrder?.address || "",
        note: currentOrder?.note!,
        fullName: currentOrder?.fullName!,
        paymentMethod: currentOrder?.paymentMethod!,
      };

      dispatch(addOrderMethod(order));
    }
  };

  const handleCancelOrder = async () => {
    if (currentOrder?.orderStatus === EOrderStatus.PENDING) {
      try {
        await repositories.order.patch(
          {
            orderStatus: EOrderStatus.CANCELLED,
            paymentStatus: currentOrder.paymentStatus,
          },
          currentOrder._id
        );
        toast.success("Hủy đơn hàng thành công");
        dispatch(getOneOrderMethod(id!));
      } catch (error) {
        handleError(error);
      }
    }
  };

  React.useEffect(() => {
    if (!id) {
      // navigate(ERouterPath.NOT_FOUND);
    } else dispatch(getOneOrderMethod(id));
  }, [id, dispatch, navigate]);

  return (
    <div className="detail-order-page">
      <AccountPageHeader
        titleIcon={<i className="bi bi-bag-fill"></i>}
        headerTitle="Chi tiết đơn hàng"
        setShowDashboard={setShowDashboard}>
        {currentOrder?.orderStatus !== EOrderStatus.CANCELLED && (
          <Button
            variant="danger"
            disabled={currentOrder?.orderStatus !== EOrderStatus.PENDING}
            onClick={handleCancelOrder}>
            Hủy đơn
          </Button>
        )}
      </AccountPageHeader>

      <div className="detail-order-info ">
        <Row>
          <Col xs="12">
            <div
              className="info-col shadow-sm rounded"
              style={{ backgroundColor: style.backgroundColor }}>
              <h5 className="info-header">Thông tin đơn hàng: </h5>

              <div className="header-item order-id">
                <span className="title">ID: </span>
                <span className="value">{currentOrder?.idReadable}</span>
              </div>
              <div className="header-item order-placed">
                <span className="title">Ngày đăt hàng: </span>
                <span className="value">
                  {moment(currentOrder?.createdAt || "").format("DD-MM-YYYY")}
                </span>
              </div>
              <div className="header-item order-status">
                <span className="title">Trạng thái đơn hàng: </span>
                <span className="value">
                  <Badge
                    pill
                    bg={
                      getEnumObject.getOrderStatus(currentOrder?.orderStatus!)
                        ?.color
                    }
                    style={{
                      backgroundColor:
                        getEnumObject.getOrderStatus(currentOrder?.orderStatus!)
                          ?.color + "22",
                      color: getEnumObject.getOrderStatus(
                        currentOrder?.orderStatus!
                      )?.color,
                    }}>
                    {
                      getEnumObject.getOrderStatus(currentOrder?.orderStatus!)
                        ?.text
                    }
                  </Badge>
                </span>
              </div>
              <div className="header-item order-status">
                <span className="title">Trạng thái thanh toán: </span>
                <span className="value">
                  <Badge
                    pill
                    bg={
                      getEnumObject.getPaymentStatus(
                        currentOrder?.paymentStatus!
                      )?.color
                    }
                    style={{
                      backgroundColor:
                        getEnumObject.getPaymentStatus(
                          currentOrder?.paymentStatus!
                        )?.color + "22",
                      color: getEnumObject.getPaymentStatus(
                        currentOrder?.paymentStatus!
                      )?.color,
                    }}>
                    {
                      getEnumObject.getPaymentStatus(
                        currentOrder?.paymentStatus!
                      )?.text
                    }
                  </Badge>
                </span>
              </div>
            </div>
          </Col>
        </Row>

        <Row>
          <Col xs="12">
            <div
              className="info-col shadow-sm rounded"
              style={{ backgroundColor: style.backgroundColor }}>
              <div className="shipping-info">
                <h5 className="info-header">Thông tin giao hàng</h5>

                <div className="shipping-info-body">
                  <div className="info-item">
                    <span className="title">Họ tên: </span>
                    <span className="value">{currentOrder?.fullName}</span>
                  </div>

                  <div className="info-item">
                    <span className="title">Số điện thoại: </span>
                    <span className="value">{currentOrder?.phoneNumber}</span>
                  </div>

                  <div className="info-item">
                    <span className="title">Địa chỉ: </span>
                    <span className="value">{currentOrder?.address}</span>
                  </div>

                  {currentOrder?.note && (
                    <div className="info-item">
                      <span className="title">Ghi chú: </span>
                      <span className="value">{currentOrder?.note}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>

      <div className="detail-order-body mt-4">
        <Card style={{ backgroundColor: style.backgroundColor }}>
          <Card.Header>
            <div className="detail-card-header">
              <div className="header-wrap info-item">
                <span className="total-title">{`${t(
                  "title.quantity"
                )}: `}</span>
                <span className="total-value">
                  {`${currentOrder?.orderItems.length} ${t("title.item")}`}
                </span>
              </div>
              <div className="header-wrap info-item">
                <span className="total-title">{`${t(
                  "title.totalPrice"
                )}: `}</span>
                <span className="total-value">
                  {`${Number(currentOrder?.totalCost).toLocaleString()}đ`}
                </span>
              </div>
            </div>
          </Card.Header>

          <Card.Body className="p-0">
            {currentOrder?.orderItems.map((product: IOrderItem) => (
              <div key={product._id} className="detail-order-item">
                <Link
                  className="detail-order-item-link"
                  target="_blank"
                  to={`${ERouterPath.PRODUCTS}/${product.productId}`}>
                  <div className="product-info">
                    <div
                      className="product-img"
                      style={{
                        backgroundImage: `url('${getFullPathMedia(
                          product.image!
                        )}')`,
                      }}></div>
                    <div className="product-description">
                      <div className="product-name">{product.name}</div>
                      <div className="product-price">
                        {`${Number(product.price).toLocaleString()}đ x ${
                          product.quantity
                        }`}
                      </div>
                      <div className="product-total-price">
                        {`${(
                          Number(product.price) * product.quantity!
                        ).toLocaleString()}đ`}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default DetailOrderPage;
