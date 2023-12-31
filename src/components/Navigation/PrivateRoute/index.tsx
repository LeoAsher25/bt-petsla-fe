import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Outlet } from "react-router-dom";
import { toast } from "react-toastify";
import { setLoginModalIsOpen } from "src/services/modal/modalSlice";
import { RootState } from "src/stores/rootReducer";
import {
  useAppDispatch,
  useAppSelector,
} from "src/utils/hook.ts/customReduxHook";

const PrivateRoute = () => {
  const { accessToken } = useAppSelector((state: RootState) => state.authState);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    if (!accessToken) {
      dispatch(setLoginModalIsOpen(true));
      toast.warn(t("message.warning.loginFirst"));
    }
  }, [accessToken, dispatch, t]);

  return <>{!!accessToken && <Outlet />}</>;
};

export default PrivateRoute;
