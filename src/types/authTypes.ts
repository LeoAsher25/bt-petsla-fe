export interface ILoginRequestData {
  email: string;
  password: string;
}

export interface IRegisterRequestData {
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  password: string;
}

export interface IRegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
}

export enum EUserRole {
  CUSTOMER,
  ADMIN,
}

export interface ILoginResponseData {
  refresh?: string;
  access?: string;
  _id?: number | string;
  username?: string;
  email?: string;
  name?: string;
  role?: EUserRole;
  accessToken?: string;
}

export interface ILoginResponseError {
  detail: string;
}

export interface IUser {
  firstName: string;
  lastName: string;
  username: string;
  name: string;
  email: string;

  _id?: string | number;
  gender?: EGender;
  role?: EUserRole;
  address?: string;
  phoneNumber?: string;
}

export interface IOrderInfo {
  _id?: number | string;
  name: string;

  address: string;
  phoneNumber: string;
  note?: string;
}

export enum EGender {
  MALE,
  FEMALE,
  OTHER,
  UNKNOWN,
}
