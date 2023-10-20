export enum ERouterPath {
  LOGIN = "/login",
  REGISTER = "/register",

  // nav bar
  SHOP = "/shop",
  PRODUCTS = "/products",
  HOME = "/",
  CONTACT = "/contact",
  ACCOUNT = "/account",
  SHOP_COMBO = "/shop-combo",

  // personal detail. Route: ERouterPath.ACCOUNT/pathName
  PROFILE = "profile",
  WISH_LIST = "wish_list",
  ORDERS = "orders",
  DETAIL_ORDER = "order",

  // checkout steps
  CART = "/cart",
  CUSTOMER_INFO = "/customer-info",
  PAYMENT = "/payment",
  REVIEW = "/review",

  DETAIL_PRODUCT = `/products`,
  NOT_FOUND = "/not_found",
}
