import React, { useState } from "react";
import { Pagination } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { RootState } from "src/stores/rootReducer";
import { useAppSelector } from "src/utils/hook.ts/customReduxHook";
import "./CustomPagination.scss";
import { DEFAULT_ITEMS_PER_PAGE } from "src/constants";
import { useEffect } from "react";

interface IPaginationProps {
  totalItems: number;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

const CustomPagination = ({
  totalItems,
  currentPage,
  setCurrentPage,
}: IPaginationProps) => {
  const { t } = useTranslation();

  const [totalPage, setTotalPage] = useState(
    Math.ceil(totalItems / DEFAULT_ITEMS_PER_PAGE)
  );

  useEffect(() => {
    setTotalPage(Math.ceil(totalItems / DEFAULT_ITEMS_PER_PAGE));
  }, [totalItems]);

  const handleChangePage = (page: number) => {
    window.scrollTo(0, 0);
    setCurrentPage(page);
  };

  const { style } = useAppSelector((state: RootState) => state.themeState);

  return (
    <div className="custom-pagination">
      <Pagination className="pagination-wrap">
        <Pagination.Item
          style={{ backgroundColor: style.backgroundColor }}
          disabled={currentPage === 1}
          onClick={() => handleChangePage(currentPage - 1)}>
          <i className="fas fa-chevron-left"></i>
        </Pagination.Item>

        {Array.from(Array(totalPage).keys()).map((number) => (
          <Pagination.Item
            style={{ backgroundColor: style.backgroundColor }}
            key={number + 1}
            active={number + 1 === currentPage}
            onClick={() => handleChangePage(number + 1)}>
            {number + 1}
          </Pagination.Item>
        ))}

        <Pagination.Item
          style={{ backgroundColor: style.backgroundColor }}
          disabled={currentPage === totalPage}
          onClick={() => handleChangePage(currentPage + 1)}>
          <i className="fas fa-chevron-right"></i>
        </Pagination.Item>
      </Pagination>
    </div>
  );
};

export default CustomPagination;
