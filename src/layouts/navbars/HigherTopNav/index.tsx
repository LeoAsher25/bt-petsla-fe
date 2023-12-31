import { Container } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import StyledLink from "src/components/customComponents/StyledLink";
import { authActions } from "src/services/auth/authSlice";
import { setLoginModalIsOpen } from "src/services/modal/modalSlice";
import { toggleTheme } from "src/services/theme/ThemeSlice";
import { setCurrentCustomerInfo } from "src/services/user/userSlice";
import { RootState } from "src/stores/rootReducer";
import { ERouterPath } from "src/types/route";
import Media from "src/utils/Media";
import {
  useAppDispatch,
  useAppSelector,
} from "src/utils/hook.ts/customReduxHook";
import "./HigherTopNav.scss";

const HigherTopNav = () => {
  const { themeState, authState } = useAppSelector((state: RootState) => state);

  const { t } = useTranslation();

  const { style } = themeState;
  const { currentUser } = authState;

  const dispatch = useAppDispatch();

  const handleToggleThemeClick = () => {
    dispatch(toggleTheme());
  };

  const handleLoginClick = () => {
    // setShowLoginModal(true);
    dispatch(setLoginModalIsOpen(true));
  };

  const handleLogoutClick = () => {
    dispatch(setCurrentCustomerInfo(null));

    dispatch(authActions.logoutMethod());
    toast.success("Đăng xuất thành công");
  };

  return (
    <div
      className="higher-top-nav"
      style={{
        backgroundColor: style.backgroundColor,
        borderBottomColor: style.borderColor,
      }}>
      <Container>
        <div className="higher-top-nav-wrap">
          <div className="info-wrap d-none d-md-flex ">
            <div className="info-item">
              <i className="bi bi-envelope"></i>
              <div className="text">petsla.vn@gmail.com</div>
            </div>

            <div
              className="info-item-divider"
              style={{ backgroundColor: style.borderColor }}></div>

            <div className="info-item">
              <i className="bi bi-telephone"></i>
              <div className="text">0123 456 789</div>
            </div>
          </div>

          <div className="top-nav__branch d-flex d-md-none ">
            <StyledLink to={ERouterPath.HOME}>
              <img src={Media.fullLogo} alt="" />
            </StyledLink>
          </div>

          <div className="btn-wrap">
            {/* <div className="higher-top-nav-item language-wrap">
              <ChangeLangPopOver />
              <div
                className="higher-top-nav-item__title"
                style={{
                  backgroundColor: style.colorBlur,
                  color: style.backgroundColor,
                }}>
                {t("title.toggleTheme")}
              </div>
            </div>

            <div
              className="higher-top-nav__theme higher-top-nav-item "
              onClick={() => handleToggleThemeClick()}>
              {isLightTheme ? (
                <i className="bi bi-moon toggle-theme-icon"></i>
              ) : (
                <i className="bi bi-brightness-high-fill"></i>
              )}
              <div
                className="higher-top-nav-item__title"
                style={{
                  backgroundColor: style.colorBlur,
                  color: style.backgroundColor,
                }}>
                {t("title.toggleTheme")}
              </div>
            </div> */}

            {currentUser ? (
              <div className="d-flex align-items-center gap-2">
                <span>{currentUser.fullName}</span>
                <div className="auth-btn__wrap higher-top-nav-item mx-0">
                  <i
                    onClick={handleLogoutClick}
                    className="bi bi-box-arrow-right"></i>
                  <div
                    className="higher-top-nav-item__title"
                    style={{
                      backgroundColor: style.colorBlur,
                      color: style.backgroundColor,
                    }}>
                    {t("title.logout")}
                  </div>
                </div>
              </div>
            ) : (
              <div
                onClick={handleLoginClick}
                className="auth-btn__wrap higher-top-nav-item d-flex align-items-center mx-0 gap-2">
                <span>Đăng nhập</span>
                <i className="bi bi-box-arrow-in-left"></i>
                {/* <div
                  className="higher-top-nav-item__title"
                  style={{
                    backgroundColor: style.colorBlur,
                    color: style.backgroundColor,
                  }}>
                  {t("title.login")}
                </div> */}
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default HigherTopNav;
