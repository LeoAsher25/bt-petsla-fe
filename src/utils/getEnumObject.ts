import { EnumObject, EnumObjectType } from "src/types/commonType";
import { EOrderStatus, EPaymentStatus } from "src/types/productTypes";

const getEnumObject = {
  getOrderStatus(value: number): EnumObject {
    const orderStatus: EnumObjectType = {
      PENDING: {
        text: "Chờ xác nhận",
        value: 0,
        key: "UNPAID",
        color: "#d46b08",
      },
      SHIPPING: {
        text: "Đang giao",
        value: 1,
        key: "PAID",
        color: "#0958d9",
      },
      DELIVERED: {
        text: "Đã giao",
        value: 2,
        key: "REFUNDING",
        color: "#389e0d",
      },
      CANCELLED: {
        text: "Đã hủy",
        value: 3,
        key: "REFUNDED",
        color: "#cf1322",
      },
    };

    return orderStatus[EOrderStatus[value]];
  },

  getPaymentStatus(value: number): EnumObject {
    const paymentStatus: EnumObjectType = {
      UNPAID: {
        text: "Chưa thanh toán",
        value: 0,
        key: "UNPAID",
        color: "#d48806",
      },
      PAID: {
        text: "Đã thanh toán",
        value: 1,
        key: "PAID",
        color: "#389e0d",
      },
      REFUNDING: {
        text: "Đang hoàn tiền",
        value: 2,
        key: "REFUNDING",
        color: "#13c2c2",
      },
      REFUNDED: {
        text: "Đã thanh toán",
        value: 3,
        key: "REFUNDED",
        color: "#722ed1",
      },
    };

    return paymentStatus[EPaymentStatus[value]];
  },
};
export default getEnumObject;
