import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback, useEffect, useState } from "react";
import { Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import AuthFormModal from "src/layouts/modals/AuthFormModal";
import { loginMethod } from "src/services/auth/authThunkActions";
import {
  setLoginModalIsOpen,
  setRegisterModalIsOpen,
} from "src/services/modal/modalSlice";
import { AppDispatch, RootState } from "src/stores/rootReducer";
import { ILoginRequestData } from "src/types/authTypes";
import { EModalType } from "src/types/commonType";
import {
  useAppDispatch,
  useAppSelector,
} from "src/utils/hook.ts/customReduxHook";
import REGEX from "src/utils/validateRegex";
import * as yup from "yup";
import "./LoginModal.scss";
import { handleError } from "src/utils/handleError";

const LoginModal = () => {
  const defaultValues: ILoginRequestData = {
    email: "test@gmail.com",
    password: "Test123@",
  };

  const { t } = useTranslation();
  const { accessToken } = useAppSelector((state: RootState) => state.authState);
  const [isLoading, setIsLoading] = useState(false);

  const loginSchema = yup.object().shape({
    email: yup
      .string()
      .email(
        t("validate.message.inValidItem", {
          item: "Email",
        })
      )
      .required(
        t("validate.message.requiredItem", {
          item: "Email",
        })
      ),
    password: yup
      .string()
      .required(
        t("validate.message.requiredItem", {
          item: t("label.password"),
        })
      )
      .matches(REGEX.password, t("validate.message.passwordMatch")),
  });

  const form = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues,
  });

  const dispatch: AppDispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loginModalIsOpen } = useAppSelector(
    (state: RootState) => state.modalState
  );

  const handleLogin = async (data: ILoginRequestData) => {
    try {
      setIsLoading(true);
      await dispatch(loginMethod(data));
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = useCallback(() => {
    dispatch(setLoginModalIsOpen(false));
    form.reset();
    navigate(-1);
  }, [dispatch, navigate, form]);

  const handleChangeToRegister = () => {
    form.reset();
    dispatch(setLoginModalIsOpen(false));
    dispatch(setRegisterModalIsOpen(true));
  };

  useEffect(() => {
    if (accessToken) {
      form.reset();
      dispatch(setLoginModalIsOpen(false));
    }
  }, [accessToken, form, dispatch]);

  return (
    <Modal
      className="login-modal"
      show={loginModalIsOpen}
      onHide={handleClose}
      centered>
      <AuthFormModal
        modalTitle={t("title.login")}
        form={form}
        isLoading={isLoading}
        handleLogin={handleLogin}
        handleClose={handleClose}
        handleChangeModal={handleChangeToRegister}
        modalType={EModalType.LOGIN}>
        <Form.Group className="mt-3" controlId="email">
          <Form.Control
            type="text"
            {...form.register("email")}
            name="email"
            placeholder={t("label.email")}
          />
          <Form.Text className="text-danger">
            {form.formState.errors.email?.message}
          </Form.Text>
        </Form.Group>

        <Form.Group className="mt-3" controlId="password">
          {/* <Form.Label> {t('label.password')} </Form.Label> */}
          <Form.Control
            type="password"
            {...form.register("password")}
            name="password"
            placeholder={t("label.password")}
          />
          <Form.Text className="text-danger">
            {form.formState.errors.password?.message}
          </Form.Text>
        </Form.Group>

        {/* <Form.Group className="mt-2" controlId="formBasicCheckbox">
          <Form.Check type="checkbox" label={t("label.rememberPassword")} />
        </Form.Group> */}
      </AuthFormModal>
    </Modal>
  );
};

export default LoginModal;
