import { yupResolver } from "@hookform/resolvers/yup";
import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";
import { updateProfileMethod } from "src/services/auth/authThunkActions";
import { RootState } from "src/stores/rootReducer";
import { EGender, IUser } from "src/types/authTypes";
import Media from "src/utils/Media";
import { handleError } from "src/utils/handleError";
import {
  useAppDispatch,
  useAppSelector,
} from "src/utils/hook.ts/customReduxHook";
import REGEX from "src/utils/validateRegex";
import * as Yup from "yup";
import "./ProfilePage.scss";
import { toast } from "react-toastify";

const ProfilePage = () => {
  const { setShowDashboard } = useOutletContext<{
    setShowDashboard: React.Dispatch<React.SetStateAction<boolean>>;
  }>();

  const { themeState, authState } = useAppSelector((state: RootState) => state);

  const { currentUser } = authState;
  const { accessToken } = authState;

  const { style } = themeState;
  const { t } = useTranslation();

  const userInfoSchema = Yup.object().shape({
    firstName: Yup.string().required(
      t("validate.message.requiredItem", {
        item: t("label.firstName"),
      })
    ),
    lastName: Yup.string().required(
      t("validate.message.requiredItem", {
        item: t("label.lastName"),
      })
    ),
    gender: Yup.string(),
    email: Yup.string().required("Email is required!"),
    phoneNumber: Yup.string()
      .matches(
        REGEX.phoneNumber,
        t("validate.message.inValidItem", {
          item: t("label.phoneNumber"),
        })
      )
      .required(
        t("validate.message.requiredItem", {
          item: t("label.phoneNumber"),
        })
      ),
  });

  const [isEdit, setIsEdit] = useState(false);

  const defaultValues = useMemo(
    () =>
      ({
        firstName: currentUser?.firstName || "",
        lastName: currentUser?.lastName || "",
        email: currentUser?.email || "",
        phoneNumber: currentUser?.phoneNumber || "",
        gender: currentUser?.gender,
        address: currentUser?.address || "",
      } as Partial<IUser>),
    [currentUser]
  );

  const dispatch = useAppDispatch();

  const form = useForm({
    resolver: yupResolver(userInfoSchema),
    mode: "onChange",
    defaultValues,
  });

  const handleEditSaveBtnClick = async () => {
    const isValid = await form.trigger();
    if (isValid) {
      try {
        const payload = form.getValues();
        payload.gender = Number(payload.gender);

        await dispatch(updateProfileMethod(payload)).unwrap();
        form.reset({
          ...payload,
          gender: payload?.gender,
        });
        setIsEdit(false);
        toast.success("Cập nhật thông tin thành công");
      } catch (error) {
        handleError(error);
      }
    }
  };

  const handleEditCancel = () => {
    form.reset(defaultValues);
    setIsEdit(false);
  };

  const handleGenderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue("gender", Number(event.target.value) as EGender);
  };

  const handleChangeInputAvatar = (event: ChangeEvent<HTMLInputElement>) => {};

  const getGender = (value: any) => {
    switch (Number(value)) {
      case 0:
        return "Nam";
      case 1:
        return "Nữ";
      case 2:
        return "Khác";
      default:
        return "";
    }
  };

  useEffect(() => {
    form.reset(defaultValues);
  }, [currentUser, form, defaultValues]);

  return (
    <>
      <div className="profile-page">
        <div className="account-page-header">
          <div className="title-wrap">
            <div className="title">
              <span className="text">Profile</span>
            </div>
            <div
              className="show-dashboard-btn"
              onClick={() => setShowDashboard(true)}>
              <i className="bi bi-list"></i>
            </div>
          </div>

          <div className="btn-wrap">
            {isEdit ? (
              <div className="d-flex gap-2">
                <Button
                  className="custom-btn account-page-header-btn"
                  onClick={handleEditCancel}>
                  Hủy
                </Button>

                <Button
                  className="custom-btn account-page-header-btn"
                  onClick={handleEditSaveBtnClick}>
                  Lưu
                </Button>
              </div>
            ) : (
              <Button
                className="custom-btn account-page-header-btn"
                onClick={() => setIsEdit(true)}>
                Chỉnh sửa
              </Button>
            )}
          </div>
        </div>
        <div className="profile-page-body">
          <div className="common-info">
            <Row>
              <Col xs={12} md={12} className="mt-4">
                <div
                  className="user-ava-card shadow-sm rounded"
                  style={{ backgroundColor: style.backgroundColor }}>
                  <div className="user-ava-wrap">
                    <div className="user-ava">
                      <img
                        src={accessToken ? Media.cuteCat : Media.noUser}
                        alt="User avatar"
                      />
                      {isEdit && (
                        <div className="avatar-edit-layer">
                          <input
                            type="file"
                            name="upload-avatar"
                            id="upload-avatar"
                            hidden
                            onChange={handleChangeInputAvatar}
                          />
                          <label htmlFor="upload-avatar">
                            <i className="bi bi-pencil-square"></i>
                          </label>
                        </div>
                      )}
                    </div>
                    <div className="name-wrap">
                      <span className="full-name">{currentUser?.fullName}</span>
                      <span className="username">{currentUser?.email}</span>
                    </div>
                  </div>
                  {/* <div className="member-type">Diamond User</div> */}
                </div>
              </Col>

              {/* <Col xs={12} md={6} className="mt-4">
                <div className="order-type-card-wrap">
                  <div
                    className="order-card-item shadow-sm rounded"
                    style={{ backgroundColor: style.backgroundColor }}>
                    <span className="quantity">10</span>
                    <span className="title">Pending</span>
                  </div>

                  <div
                    className="order-card-item shadow-sm rounded"
                    style={{ backgroundColor: style.backgroundColor }}>
                    <span className="quantity">3</span>
                    <span className="title">Shipping</span>
                  </div>

                  <div
                    className="order-card-item shadow-sm rounded"
                    style={{ backgroundColor: style.backgroundColor }}>
                    <span className="quantity">99</span>
                    <span className="title">Delivered</span>
                  </div>

                  <div
                    className="order-card-item shadow-sm rounded"
                    style={{ backgroundColor: style.backgroundColor }}>
                    <span className="quantity">0</span>
                    <span className="title">Cancelled</span>
                  </div>
                </div>
              </Col> */}
            </Row>
          </div>

          <div
            className="personal-info mt-4 shadow-sm rounded p-4"
            style={{ backgroundColor: style.backgroundColor }}>
            <Form>
              <Form.Group className="mt-3 form-gr">
                <Form.Label htmlFor="first-name">
                  {t("label.firstName")}:{" "}
                </Form.Label>
                <Form.Control
                  id="first-name"
                  disabled={!isEdit}
                  type="text"
                  {...form.register("firstName")}
                />
                <Form.Text className="text-danger">
                  {form.formState.errors.firstName?.message}
                </Form.Text>
              </Form.Group>

              <Form.Group className="mt-3 form-gr">
                <Form.Label htmlFor="last-name">
                  {t("label.lastName")}:
                </Form.Label>
                <Form.Control
                  id="last-name"
                  disabled={!isEdit}
                  type="text"
                  {...form.register("lastName")}
                />
                <Form.Text className="text-danger">
                  {form.formState.errors.lastName?.message}
                </Form.Text>
              </Form.Group>

              <Form.Group className="mt-3 form-gr">
                <Form.Label htmlFor="email">Email:</Form.Label>
                <Form.Control
                  id="email"
                  disabled={true}
                  type="text"
                  {...form.register("email")}
                />
                <Form.Text className="text-danger">
                  {form.formState.errors.email?.message}
                </Form.Text>
              </Form.Group>

              <Form.Group className="mt-3 form-gr">
                <Form.Label htmlFor="phone-number">Số điện thoại: </Form.Label>
                <Form.Control
                  id="phone-number"
                  disabled={!isEdit}
                  type="text"
                  {...form.register("phoneNumber")}
                />
                <Form.Text className="text-danger">
                  {form.formState.errors.phoneNumber?.message}
                </Form.Text>
              </Form.Group>

              <Form.Group className="mt-3 form-gr">
                <Form.Label>{t("label.gender.title")}: </Form.Label>
                {!isEdit ? (
                  <Form.Control
                    id="gender"
                    disabled={!isEdit}
                    type="text"
                    value={getGender(form.getValues("gender"))}
                  />
                ) : (
                  Object.keys(EGender).map(
                    (item) =>
                      !isNaN(Number(item)) && (
                        <Form.Check key={item}>
                          <Form.Check.Input
                            disabled={!isEdit}
                            onChange={handleGenderChange}
                            defaultChecked={
                              form.getValues("gender") === Number(item)
                            }
                            value={Number(item)}
                            name="gender"
                            type="radio"
                            id={`gender-${item}`}
                          />
                          <Form.Check.Label
                            className="gender-item"
                            htmlFor={`gender-${item}`}>
                            {getGender(item)}
                          </Form.Check.Label>
                        </Form.Check>
                      )
                  )
                )}
              </Form.Group>

              <Form.Group className="mt-3 form-gr">
                <Form.Label htmlFor="address">Địa chỉ: </Form.Label>
                <Form.Control
                  id="address"
                  disabled={!isEdit}
                  type="text"
                  {...form.register("address")}
                />
                <Form.Text className="text-danger">
                  {form.formState.errors.address?.message}
                </Form.Text>
              </Form.Group>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
