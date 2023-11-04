import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Footer from "src/layouts/Footer";
import BottomNav from "src/layouts/navbars/BottomNav";
import HigherTopNav from "src/layouts/navbars/HigherTopNav";
import LowerTopNav from "src/layouts/navbars/LowerTopNav";
import TopNav from "src/layouts/navbars/TopNav";
import { getProfileMethod } from "src/services/auth/authThunkActions";
import { RootState } from "src/stores/rootReducer";
import {
  useAppDispatch,
  useAppSelector,
} from "src/utils/hook.ts/customReduxHook";

const PageWrap = () => {
  const { currentUser } = useAppSelector((state: RootState) => state.authState);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!currentUser) {
      dispatch(getProfileMethod());
    }
  }, [currentUser, dispatch]);

  return (
    <div>
      <HigherTopNav />
      <TopNav />
      <LowerTopNav />
      <Outlet />
      <Footer />
      <BottomNav />
    </div>
  );
};

export default PageWrap;
