export interface IProduct {
  _id: number | string;
  idReadable?: string;
  name: string;
  description: string;
  price: number;
  image: string;
  stock: number;
  created_at: string;
  updated_at: string;
  categories: Object[];
}

export interface ICartProduct {
  _id: number | string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  created_at: string;
  updated_at: string;
}

export interface IOrderProduct {
  product_id: number | string;
  quantity: number;
  price: number;
}

// type of order requested
export interface IRequestedOrder {
  orderItems: IOrderProduct[];
  number_phone: string;
  address: string;
  total_price: number;
  note?: string;
}

// type of order server send
export interface IOrder {
  address: string;
  created_at: string | null;
  delivered_at: string | null;
  id: number | string;
  is_delivered: boolean;
  is_paid: boolean;
  note?: string;
  number_phone: string;
  orderItems: IOrderItem[];
  paid_at: string | null;
  total_price: number;
  user: number;
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
  _id: string;
  name: string;
  type: EIProductCategoryType;
}
