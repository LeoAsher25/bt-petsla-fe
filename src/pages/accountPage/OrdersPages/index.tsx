import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";
import CustomPagination from "src/components/customComponents/CustomPagination";
import NoItems from "src/components/NoItems";

import CatLoading from "src/components/Loading/CatLoading";
import { DEFAULT_ITEMS_PER_PAGE } from "src/constants";
import AccountPageHeader from "src/pages/accountPage/components/AccountPageHeader";
import OrderItem from "src/pages/accountPage/components/OrderItem";
import { getAllOrderMethod } from "src/services/user/userThunkActions";
import { IOrder } from "src/types/productTypes";
import { handleError } from "src/utils/handleError";
import { useAppDispatch } from "src/utils/hook.ts/customReduxHook";
import "./OrdersPages.scss";

const OrdersPages = () => {
  const { setShowDashboard } = useOutletContext<{
    setShowDashboard: React.Dispatch<React.SetStateAction<boolean>>;
  }>();

  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [filteredProductList, setFilteredProductList] = useState<IOrder[]>([]);

  useEffect(() => {
    const getDataList = async () => {
      try {
        setIsLoading(true);
        const params: Record<string, any> = {
          page: currentPage - 1,
          limit: DEFAULT_ITEMS_PER_PAGE,
        };

        const response = await dispatch(getAllOrderMethod({ params })).unwrap();

        setTotalItems(response?.totalRecords);
        setFilteredProductList(response?.dataList);
      } catch (error) {
        handleError(error);
      } finally {
        setIsLoading(false);
      }
    };

    getDataList();
  }, [dispatch, currentPage]);

  return (
    <div className="orders-page">
      <AccountPageHeader
        titleIcon={<i className="bi bi-bag-fill"></i>}
        headerTitle="Danh sách đơn hàng"
        setShowDashboard={setShowDashboard}
      />

      {isLoading ? (
        <CatLoading />
      ) : (
        <>
          <div className="orders-table">
            <div className="orders-header order-row">
              {/* <div className="order-cell order-index">#</div> */}
              <div className="order-cell order-id">ID</div>
              <div className="order-cell order-time">Ngày đặt hàng</div>
              <div className="order-cell order-price">Tổng tiền</div>
              <div className="order-cell order-address">Địa chỉ</div>
              <div className="order-cell order-status">TT đơn hàng</div>
              <div className="order-cell order-status">TT thanh toán</div>
            </div>

            <div className="orders-list">
              {filteredProductList.length <= 0 ? (
                <NoItems message={t("message.warning.noOrder")} />
              ) : (
                filteredProductList.map((order: IOrder, index) => (
                  <OrderItem key={order._id} order={order} index={index} />
                ))
              )}
            </div>

            <CustomPagination
              totalItems={totalItems}
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default OrdersPages;
