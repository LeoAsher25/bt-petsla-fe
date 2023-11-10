export enum ERequestStatus {
  PENDING,
  FULFILLED,
  REJECTED,
}

export enum ELanguage {
  ENGLISH = "en-US",
  VIETNAMESE = "vi",
}

export enum EModalType {
  LOGIN,
  REGISTER,
}

export enum ESortType {
  NAME,
  PRICE,
}

export enum ESortDirect {
  DESCENDING,
  ASCENDING,
}

export interface IErrorResponse {
  code?: string;
  message: string;
}

export interface IGetListResponse<T> {
  totalRecords: number;
  dataList: T[];
}

export type EnumObjectType = Record<string, EnumObject>;

export interface EnumObject {
  text?: string;
  value?: any;
  key?: string;
  color?: string;
}
