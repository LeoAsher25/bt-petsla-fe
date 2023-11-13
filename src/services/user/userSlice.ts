import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  addOrderMethod,
  getAllOrderMethod,
  getOneOrderMethod,
  getUserInfoMethod,
} from "src/services/user/userThunkActions";
import { IOrderInfo, IUser } from "src/types/authTypes";
import { ERequestStatus } from "src/types/commonType";
import { IOrder } from "src/types/productTypes";
import {
  getLocalStorage,
  removeLocalStorage,
  setLocalStorage,
} from "src/utils/localStorage";

interface IUserSliceState {
  currentOrderInfo: IOrderInfo | null;
  currentUser: IUser | null;
  orders: IOrder[];
  currentOrder: IOrder | null;
  requestStatus: ERequestStatus;
}

const initialState: IUserSliceState = {
  currentOrderInfo: getLocalStorage("currentOrderInfo"),
  orders: [],
  currentOrder: null,
  currentUser: getLocalStorage("currentUser"),
  requestStatus: ERequestStatus.FULFILLED,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCurrentCustomerInfo: (
      state,
      action: PayloadAction<IOrderInfo | null>
    ) => {
      state.currentOrderInfo = action.payload;
      action.payload === null
        ? removeLocalStorage("currentOrderInfo")
        : setLocalStorage("currentOrderInfo", action.payload);
    },

    setCurrentUser: (state, action: PayloadAction<IUser | null>) => {
      state.currentUser = JSON.parse(JSON.stringify(action.payload));

      if (action.payload === null) {
        removeLocalStorage("currentUser");
        removeLocalStorage("currentOrderInfo");
      } else {
        setLocalStorage("currentUser", action.payload);
      }
    },

    setItem(state, action) {
      Object.assign(state, action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addOrderMethod.pending, (state) => {
        state.requestStatus = ERequestStatus.PENDING;
      })

      .addCase(addOrderMethod.fulfilled, (state) => {
        state.requestStatus = ERequestStatus.FULFILLED;
      })

      .addCase(addOrderMethod.rejected, (state) => {
        state.requestStatus = ERequestStatus.REJECTED;
      })

      .addCase(getUserInfoMethod.pending, (state) => {
        state.requestStatus = ERequestStatus.PENDING;
      })
      .addCase(getUserInfoMethod.fulfilled, (state, action) => {
        state.currentUser = {
          _id: action.payload._id,
          firstName: action.payload.firstName,
          lastName: action.payload.lastName,
          role: action.payload.role,
          email: action.payload.email,
          name: action.payload.firstName + action.payload.lastName,
          username: action.payload.email,
        };
        setLocalStorage("currentUser", action.payload);
        state.requestStatus = ERequestStatus.FULFILLED;
      })
      .addCase(getUserInfoMethod.rejected, (state) => {
        state.requestStatus = ERequestStatus.REJECTED;
      })

      .addCase(getAllOrderMethod.pending, (state) => {
        state.requestStatus = ERequestStatus.PENDING;
      })

      .addCase(getAllOrderMethod.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.requestStatus = ERequestStatus.FULFILLED;
      })

      .addCase(getAllOrderMethod.rejected, (state) => {
        state.requestStatus = ERequestStatus.REJECTED;
      })

      .addCase(getOneOrderMethod.fulfilled, (state, action) => {
        state.requestStatus = ERequestStatus.FULFILLED;

        state.currentOrder = action.payload;
      })

      .addCase(getOneOrderMethod.rejected, (state) => {
        state.requestStatus = ERequestStatus.REJECTED;
      });
  },
});

export const userReducer = userSlice.reducer;
export const { setCurrentCustomerInfo, setCurrentUser, setItem } =
  userSlice.actions;
