import moment from "moment";
import { HTMLProps } from "react";
import { Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { RootState } from "src/stores/rootReducer";
import { IOrder } from "src/types/productTypes";
import getEnumObject from "src/utils/getEnumObject";
import { useAppSelector } from "src/utils/hook.ts/customReduxHook";
import "./OrderItem.scss";

interface IOrderItemProp extends HTMLProps<HTMLDivElement> {
  order: IOrder;
  index: number;
}

const OrderItem = ({ order, index, ...props }: IOrderItemProp) => {
  const { themeState } = useAppSelector((state: RootState) => state);
  const { style } = themeState;

  return (
    <div
      className="order-item shadow-sm rounded"
      {...props}
      style={{ backgroundColor: style.backgroundColor }}>
      <Link to={`${order._id}`} className="order-item-link">
        <div className="order-row">
          {/* <div className="order-cell order-index">{index}</div> */}

          <div className="order-cell order-id">#{order.idReadable}</div>

          <div className="order-cell order-time">
            {moment(order.createdAt || "").format("DD-MM-YYYY")}
          </div>

          <div className="order-cell order-price">
            {`${Intl.NumberFormat("vi-VN").format(order.totalCost)}đ`}
          </div>

          <div className="order-cell order-address">{order.address}</div>

          <div className="order-cell order-status">
            <Badge
              pill
              bg={getEnumObject.getOrderStatus(order.orderStatus)?.color}
              style={{
                backgroundColor:
                  getEnumObject.getOrderStatus(order.orderStatus)?.color + "22",
                color: getEnumObject.getOrderStatus(order.orderStatus)?.color,
              }}>
              {getEnumObject.getOrderStatus(order.orderStatus)?.text}
            </Badge>
          </div>

          <div className="order-cell order-status">
            <Badge
              pill
              bg={getEnumObject.getPaymentStatus(order.paymentStatus)?.color}
              style={{
                backgroundColor:
                  getEnumObject.getPaymentStatus(order.paymentStatus)?.color +
                  "22",
                color: getEnumObject.getPaymentStatus(order.paymentStatus)
                  ?.color,
              }}>
              {getEnumObject.getPaymentStatus(order.paymentStatus)?.text}
            </Badge>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default OrderItem;
