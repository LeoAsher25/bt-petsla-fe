export interface IProduct {
  _id: number | string;
  idReadable?: string;
  name: string;
  description: string;
  price: number;
  image: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
  categories: Object[];
}

export interface ICartProduct {
  _id: number | string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface IOrderProduct {
  productId: number | string;
  quantity: number;
  price: number;
  name: string;
  image: string;
}

// type of order requested
export interface IRequestedOrder {
  orderItems: IOrderProduct[];
  fullName: string;
  phoneNumber: string;
  address: string;
  note: string;
  paymentMethod: EPaymentMethod;
}

export enum EPaymentMethod {
  COD,
  MOMO,
}

// type of order server send
export interface IOrder {
  address: string;
  createdAt: string | null;
  deliveredAt: string | null;
  id: number | string;
  isDelivered: boolean;
  isPaid: boolean;
  note?: string;
  phoneNumber: string;
  orderItems: IOrderItem[];
  paidAt: string | null;
  totalCost: number;
  fullName: string;
  paymentMethod: EPaymentMethod;
}

export interface IOrderItem {
  _id: number | string;
  name: string;
  quantity: number;
  price: string;
  image: string;
  product: number;
  order: number;
}

export enum EOrderStatus {
  PENDING,
  SHIPPING,
  DELIVERED,
  CANCELLEDf,
}

export enum EIProductCategoryType {
  BY_PET,
  BY_USAGE,
}

export interface IProductCategory {
  _id?: string;
  name?: string;
  type?: EIProductCategoryType;
}
