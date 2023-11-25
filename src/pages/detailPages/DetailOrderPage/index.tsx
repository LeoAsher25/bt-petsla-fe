import moment from "moment";
import React, { useState } from "react";
import { Badge, Button, Card, Col, Form, Modal, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import {
  Link,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router-dom";
import { toast } from "react-toastify";
import repositories from "src/api/repositories";
import AccountPageHeader from "src/pages/accountPage/components/AccountPageHeader";
import { getOneOrderMethod } from "src/services/user/userThunkActions";
import { RootState } from "src/stores/rootReducer";
import { EOrderStatus, IFeedback, IOrderItem } from "src/types/productTypes";
import { ERouterPath } from "src/types/route";
import getFullPathMedia from "src/utils/Media/getFullPathMedia";
import getEnumObject from "src/utils/getEnumObject";
import { handleError } from "src/utils/handleError";
import {
  useAppDispatch,
  useAppSelector,
} from "src/utils/hook.ts/customReduxHook";
import "./DetailOrderPage.scss";

const DetailOrderPage = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();

  const { setShowDashboard } = useOutletContext<{
    setShowDashboard: React.Dispatch<React.SetStateAction<boolean>>;
  }>();

  const { userState, themeState } = useAppSelector((state: RootState) => state);
  const { currentOrder } = userState;
  const [showFeedback, setShowFeedback] = useState(false);
  const { style } = themeState;

  const [feedbackList, setFeedbackList] = useState<IFeedback[]>([]);

  const { t } = useTranslation();
  const navigate = useNavigate();

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

  const handleFeedbackClick = () => {
    setShowFeedback(true);
  };

  const handleFeedbackCancel = () => {
    setShowFeedback(false);
  };

  const handleFeedbackSave = async () => {
    try {
      const isSentfeedback = Number(currentOrder?.feedbackList?.length) > 0;
      await Promise.all(
        feedbackList.map((item) => {
          if (!isSentfeedback) {
            return repositories.productFeedback.create({
              product: item.product?._id,
              order: currentOrder?._id,
              rating: item.rating,
              comment: item.comment,
            });
          } else {
            return repositories.productFeedback.update(
              {
                rating: item.rating,
                comment: item.comment,
              },
              item._id!
            );
          }
        })
      );
      handleFeedbackCancel();
    } catch (error) {
      handleError(error);
    }
  };

  const handleChangeRating = (feedbackId: string, value: number) => {
    const feedbackIndex = feedbackList.findIndex(
      (item) => item._id === feedbackId
    );
    if (feedbackIndex >= 0) {
      setFeedbackList(
        feedbackList.map((item, index) => ({
          ...item,
          rating: index === feedbackIndex ? value : item.rating,
        }))
      );
    }
  };

  const handleChangeFeedback = (
    feedbackId: string,
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const feedbackIndex = feedbackList.findIndex(
      (item) => item._id === feedbackId
    );
    if (feedbackIndex >= 0) {
      setFeedbackList(
        feedbackList.map((item, index) => ({
          ...item,
          comment: index === feedbackIndex ? event.target.value : item.comment,
        }))
      );
    }
  };

  React.useEffect(() => {
    if (!id) {
      // navigate(ERouterPath.NOT_FOUND);
    } else dispatch(getOneOrderMethod(id));
  }, [id, dispatch, navigate]);

  React.useEffect(() => {
    setFeedbackList(
      currentOrder?.feedbackList && currentOrder?.feedbackList.length > 0
        ? currentOrder?.feedbackList
        : currentOrder?.orderItems.map(
            (item) =>
              ({
                rating: undefined,
                comment: undefined,
                product: item,
                order: currentOrder._id,
              } as IFeedback)
          ) || []
    );
  }, [currentOrder]);

  return (
    <div className="detail-order-page">
      <AccountPageHeader
        titleIcon={<i className="bi bi-bag-fill"></i>}
        headerTitle="Chi tiết đơn hàng"
        setShowDashboard={setShowDashboard}>
        {currentOrder?.orderStatus === EOrderStatus.PENDING ? (
          <Button
            variant="outline-danger"
            disabled={currentOrder?.orderStatus !== EOrderStatus.PENDING}
            onClick={handleCancelOrder}>
            Hủy đơn
          </Button>
        ) : currentOrder?.orderStatus === EOrderStatus.DELIVERED ? (
          <Button
            className="cart-page-btn checkout-btn custom-btn bg-fill"
            onClick={handleFeedbackClick}>
            {currentOrder?.feedbackList?.length > 0
              ? "Xem đánh giá"
              : "Đánh giá"}
          </Button>
        ) : (
          <></>
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

      <Modal
        show={showFeedback}
        centered
        onHide={handleFeedbackCancel}
        size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Đánh giá</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {feedbackList.map((feedbackItem: IFeedback) => (
            <div
              key={feedbackItem._id}
              className="detail-order-item mb-4"
              style={
                {
                  // borderBottom: "1px solid #eee",
                }
              }>
              <div className="d-flex product-info">
                <div
                  className="product-img"
                  style={{
                    width: 80,
                    height: 80,
                    backgroundImage: `url('${getFullPathMedia(
                      feedbackItem.product?.image!
                    )}')`,
                    backgroundSize: "cover",
                  }}></div>
                <div className="product-description px-2 flex-fill">
                  <div
                    className="product-name"
                    style={{
                      marginTop: "-4px",
                    }}>
                    {feedbackItem.product?.name}
                  </div>
                  <div className="d-flex gap-1">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <div
                        key={value}
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          handleChangeRating(feedbackItem._id!, value)
                        }>
                        <i
                          className={`bi ${
                            !feedbackItem.rating || value > feedbackItem.rating
                              ? "bi-star"
                              : "bi-star-fill"
                          }`}
                          style={{ fontSize: 20, color: "#e69646" }}></i>
                      </div>
                    ))}
                  </div>

                  <Form.Control
                    style={{
                      backgroundColor: style.backgroundColor1,
                      color: style.color,
                    }}
                    value={feedbackItem.comment}
                    as="textarea"
                    type="text"
                    rows={2}
                    placeholder="Nội dung"
                    onChange={(e) => handleChangeFeedback(feedbackItem._id!, e)}
                  />
                </div>
              </div>
            </div>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-danger" onClick={handleFeedbackCancel}>
            Đóng
          </Button>
          <Button
            className="cart-page-btn checkout-btn custom-btn bg-fill"
            onClick={handleFeedbackSave}>
            {Number(currentOrder?.feedbackList?.length) > 0
              ? "Cập nhật đánh giá"
              : "Gửi đánh giá"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DetailOrderPage;
