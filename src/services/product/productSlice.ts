import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import {
  getAllProductMethod,
  getOneProductMethod,
} from "src/services/product/productThunkActions";
import { ERequestStatus } from "src/types/commonType";
import { ICartProduct, IProduct } from "src/types/productTypes";
import { getLocalStorage, removeLocalStorage } from "src/utils/localStorage";
import { setLocalStorage } from "./../../utils/localStorage";

interface IInitialState {
  productList: IProduct[];
  currentProduct?: IProduct;
  cartList: ICartProduct[];
  totalInCart?: ITotalInCart;
  requestStatus?: ERequestStatus;
}

interface ITotalInCart {
  quantity: number;
  price: number;
}

const calculateTotalInCart = (cartList: ICartProduct[]): ITotalInCart => {
  const totalQuantity = cartList.reduce(
    (prevValue, currProduct: ICartProduct) => prevValue + currProduct.quantity,
    0
  );

  const totalPrice = cartList.reduce(
    (prevValue, currProduct: ICartProduct) =>
      prevValue + currProduct.quantity * currProduct.price,
    0
  );

  return {
    quantity: totalQuantity,
    price: totalPrice,
  };
};

const initialState: IInitialState = {
  productList: [],
  currentProduct: getLocalStorage("currentProduct"),
  cartList: getLocalStorage("cartList") || [],
  totalInCart: {
    quantity: calculateTotalInCart(getLocalStorage("cartList") || []).quantity,
    price: calculateTotalInCart(getLocalStorage("cartList") || []).price,
  },
  requestStatus: ERequestStatus.FULFILLED,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product: ICartProduct = action.payload;
      if (product._id) {
        const index = state.cartList.findIndex(
          (item: ICartProduct) => item._id === product._id
        );
        index >= 0
          ? (state.cartList[index].quantity += product.quantity)
          : state.cartList.unshift(product);

        state.totalInCart = calculateTotalInCart(state.cartList);
        setLocalStorage("cartList", state.cartList);
      }
    },
    setItem(state, action) {
      Object.assign(state, action.payload);
    },

    removeFromCart: (state, action) => {
      const id: number | string = action.payload;
      if (id) {
        state.cartList = state.cartList.filter((item) => item._id !== id);
        state.totalInCart = calculateTotalInCart(state.cartList);
        setLocalStorage("cartList", state.cartList);
      }
    },

    handlePlus: (state, action) => {
      const id: number | string = action.payload;
      if (id) {
        const index = state.cartList.findIndex(
          (item: ICartProduct) => item._id === id
        );

        if (index >= 0) state.cartList[index].quantity += 1;
        state.totalInCart = calculateTotalInCart(state.cartList);
        setLocalStorage("cartList", state.cartList);
      }
    },

    handleMinus: (state, action) => {
      const id: number | string = action.payload;
      if (id) {
        const index = state.cartList.findIndex(
          (item: ICartProduct) => item._id === id
        );

        index >= 0 && state.cartList[index].quantity > 1
          ? (state.cartList[index].quantity -= 1)
          : (state.cartList[index].quantity -= 0);

        state.totalInCart = calculateTotalInCart(state.cartList);
        setLocalStorage("cartList", state.cartList);
      }
    },

    clearCart: (state) => {
      state.cartList = [];
      state.totalInCart = {
        price: 0,
        quantity: 0,
      };
      setLocalStorage("cartList", []);
    },

    resetCurrentProduct: (state) => {
      state.currentProduct = undefined;
      removeLocalStorage("currentProduct");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllProductMethod.pending, (state, action) => {
        state.requestStatus = ERequestStatus.PENDING;
      })

      .addCase(getAllProductMethod.fulfilled, (state, action) => {
        state.productList = action.payload.data;
        state.requestStatus = ERequestStatus.FULFILLED;
      })

      .addCase(getAllProductMethod.rejected, (state, action) => {
        state.requestStatus = ERequestStatus.REJECTED;
      });
  },
});

export const productReducer = productSlice.reducer;
export const {
  addToCart,
  handlePlus,
  handleMinus,
  removeFromCart,
  resetCurrentProduct,
  setItem,
  clearCart,
} = productSlice.actions;
