export interface ILoginRequestData {
  email: string;
  password: string;
}

export interface IRegisterRequestData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
}

export interface IRegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
}

export enum EUserRole {
  CUSTOMER,
  ADMIN,
}

export interface ILoginResponseData {
  accessToken?: string;
  refreshToken?: string;
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

  fullName?: string;

  _id?: string | number;
  gender?: EGender;
  role?: EUserRole;
  address?: string;
  phoneNumber?: string;
}

export interface IOrderInfo {
  _id?: number | string;
  fullName?: string;

  address?: string;
  phoneNumber?: string;
  note?: string;
}

export enum EGender {
  MALE,
  FEMALE,
  OTHER,
}
