import { yupResolver } from "@hookform/resolvers/yup";
import React, { useCallback, useState } from "react";
import { Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import AuthFormModal from "src/layouts/modals/AuthFormModal";
import { registerMethod } from "src/services/auth/authThunkActions";
import {
  setLoginModalIsOpen,
  setRegisterModalIsOpen,
} from "src/services/modal/modalSlice";
import { RootState } from "src/stores/rootReducer";
import { IRegisterFormData } from "src/types/authTypes";
import { EModalType } from "src/types/commonType";
import {
  useAppDispatch,
  useAppSelector,
} from "src/utils/hook.ts/customReduxHook";
import { registerSchema } from "src/utils/yup";
import "./RegisterModal.scss";
import { handleError } from "src/utils/handleError";
import { toast } from "react-toastify";

const RegisterModal = () => {
  const defaultValues: IRegisterFormData = {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
  };

  const { registerModalIsOpen } = useAppSelector(
    (state: RootState) => state.modalState
  );
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues,
  });

  const handleClose = useCallback(() => {
    form.reset();
    navigate(-1);
    dispatch(setRegisterModalIsOpen(false));
  }, [dispatch, form, navigate]);

  const handleChangeToLogin = () => {
    form.reset();
    dispatch(setRegisterModalIsOpen(false));
    dispatch(setLoginModalIsOpen(true));
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      await dispatch(registerMethod(form.getValues())).unwrap();
      toast.success("Đăng ký tài khoản thành công");
      dispatch(setRegisterModalIsOpen(false));
      dispatch(setLoginModalIsOpen(true));
      setLoading(false);
    } catch (error) {
      setLoading(false);
      handleError(error);
    }
  };

  return (
    <Modal
      className="register-modal"
      show={registerModalIsOpen}
      onHide={handleClose}
      centered>
      <AuthFormModal
        modalTitle={t("title.register")}
        form={form}
        isLoading={loading}
        handleLogin={handleLogin}
        handleClose={handleClose}
        handleChangeModal={handleChangeToLogin}
        modalType={EModalType.REGISTER}>
        <Form.Group className="mt-3" controlId="firstName">
          <Form.Control
            type="text"
            {...form.register("firstName")}
            name="firstName"
            placeholder={t("label.firstName")}
          />
          <Form.Text className="text-danger">
            {form.formState.errors.firstName?.message}
          </Form.Text>
        </Form.Group>

        <Form.Group className="mt-3" controlId="lastName">
          <Form.Control
            type="text"
            {...form.register("lastName")}
            name="lastName"
            placeholder={t("label.lastName")}
          />
          <Form.Text className="text-danger">
            {form.formState.errors.lastName?.message}
          </Form.Text>
        </Form.Group>

        <Form.Group className="mt-3" controlId="email">
          <Form.Control
            type="email"
            {...form.register("email")}
            name="email"
            placeholder="Email"
          />
          <Form.Text className="text-danger">
            {form.formState.errors.email?.message}
          </Form.Text>
        </Form.Group>

        <Form.Group className="mt-3" controlId="phoneNumber">
          <Form.Control
            type="text"
            {...form.register("phoneNumber")}
            name="phoneNumber"
            placeholder={t("label.phoneNumber")}
          />
          <Form.Text className="text-danger">
            {form.formState.errors.phoneNumber?.message}
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
      </AuthFormModal>
    </Modal>
  );
};

export default RegisterModal;
