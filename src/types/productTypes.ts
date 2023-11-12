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
  usesTypes: IProductCategory[];
  petType: IProductCategory;
  isSpecial: boolean;
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
  _id: string;
  idReadable: string;
  fullName: string;
  address: string;
  phoneNumber: string;
  note: string;
  totalCost: number;
  paymentMethod: EPaymentMethod;
  customerId: string;
  orderStatus: EOrderStatus;
  paymentStatus: EPaymentStatus;
  orderItems: IOrderItem[];
  createdAt: string;
}

export interface IOrderItem {
  productId?: string;
  _id: string;
  name?: string;
  image?: string;
  price?: number;
  quantity?: number;
}

export enum EOrderStatus {
  PENDING,
  SHIPPING,
  DELIVERED,
  CANCELLED,
}

export enum EPaymentStatus {
  UNPAID,
  PAID,
  REFUNDING,
  REFUNDED,
}

export enum EIProductCategoryType {
  BY_PET,
  BY_USES,
}

export interface IProductCategory {
  _id?: string;
  name?: string;
  type?: EIProductCategoryType;
}
