import { PayloadAction } from "@reduxjs/toolkit";
import { useEffect, useState } from "react";
import { Container, Form } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import ProductList from "src/components/ProductList";
import CustomPagination from "src/components/customComponents/CustomPagination";
import { DEFAULT_ITEMS_PER_PAGE } from "src/constants";
import {
  getAllProductCategories,
  getAllProductMethod,
} from "src/services/product/productThunkActions";
import { AppDispatch, RootState } from "src/stores/rootReducer";
import { IGetListResponse } from "src/types/commonType";
import {
  EIProductCategoryType,
  IProduct,
  IProductCategory,
} from "src/types/productTypes";
import {
  useAppDispatch,
  useAppSelector,
} from "src/utils/hook.ts/customReduxHook";
import "./ProductsPage.scss";

const sortList = [
  {
    value: 0,
    name: "Relevance",
  },
  {
    value: 1,
    name: "Name: A-Z",
  },
  {
    value: 2,
    name: "Name: Z-A",
  },
  {
    value: 3,
    name: "Price: Low to High",
  },
  {
    value: 4,
    name: "Price: High to Low",
  },
];

interface ProductsPageProps {
  isGift?: boolean;
}

const ProductsPage = ({ isGift }: ProductsPageProps) => {
  const dispatch: AppDispatch = useAppDispatch();
  const { themeState } = useAppSelector((state: RootState) => state);

  const { style } = themeState;
  const [searchParams] = useSearchParams();
  const [currentPetFilter, setCurrentPetFilter] = useState<string | undefined>(
    undefined
  );
  const [currentUsageFilter, setCurrentUsageFilter] = useState<
    string | undefined
  >(undefined);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [productCategories, setProductCategories] = useState<
    IProductCategory[]
  >([]);

  const [filteredProductList, setFilteredProductList] = useState<IProduct[]>(
    []
  );

  useEffect(() => {
    const getDataList = async () => {
      const params: Record<string, any> = {
        page: currentPage - 1,
        limit: DEFAULT_ITEMS_PER_PAGE,
        keyword: searchParams.get("search"),
      };
      const categories = [];
      if (currentPetFilter) {
        categories.push(currentPetFilter);
      }
      if (currentUsageFilter) {
        categories.push(currentUsageFilter);
      }

      params.categories = categories.join(",");

      const response = (await dispatch(
        getAllProductMethod({ params })
      )) as PayloadAction<IGetListResponse<IProduct>>;
      setTotalItems(response.payload.totalRecords);
      setFilteredProductList(response.payload.dataList);
    };

    getDataList();
  }, [
    dispatch,
    currentPage,
    searchParams,
    currentPetFilter,
    currentUsageFilter,
    isGift,
  ]);

  useEffect(() => {
    const getAllCategories = async () => {
      const response = (await dispatch(
        getAllProductCategories({})
      )) as PayloadAction<IProductCategory[]>;

      setProductCategories(response.payload);
    };
    getAllCategories();
  }, [dispatch]);

  return (
    <div className="product-page">
      <Container>
        <div
          className="product-page-header shadow-sm rounded"
          style={{ backgroundColor: style.backgroundColor }}>
          <div className="header-wrap justify-content-between">
            {searchParams.get("search") ? (
              <div className="search-results-wrap">
                <div className="title">{`Search for "${searchParams.get(
                  "search"
                )}"`}</div>
                <div className="value">{`${totalItems} results found`}</div>
              </div>
            ) : (
              <div className="home-section__title">
                {isGift ? "Danh sách combo" : "Danh sách sản phẩm"}
              </div>
            )}

            <div className="ms-auto d-flex flex-wrap flex-grow-1 flex-shrink-1 flex-lg-grow-0 flex-lg-shrink-0">
              <Form.Group
                className="filter-select-gr flex-grow-1 flex-shrink-1 flex-lg-grow-0 flex-lg-shrink-0 me-3"
                style={{ width: "180px" }}>
                <Form.Label className="label mb-1" htmlFor="filter-pets-type">
                  Pets Type:
                </Form.Label>
                <Form.Select
                  value={currentPetFilter}
                  onChange={(event) => setCurrentPetFilter(event.target.value)}
                  id="filter-pets-type"
                  style={{
                    backgroundColor: style.backgroundColor,
                    color: style.color,
                    cursor: "pointer",
                  }}>
                  {productCategories
                    ?.filter(
                      (item) => item.type === EIProductCategoryType.BY_PET
                    )
                    .map((sortItem) => (
                      <option key={sortItem._id} value={sortItem._id}>
                        {sortItem.name}
                      </option>
                    ))}
                </Form.Select>
              </Form.Group>

              <Form.Group
                className="filter-select-gr flex-grow-1 flex-shrink-1 flex-lg-grow-0 flex-lg-shrink-0 me-3"
                style={{ width: "180px" }}>
                <Form.Label
                  className="label mb-1"
                  htmlFor="filter-product-type">
                  Product Type:
                </Form.Label>
                <Form.Select
                  value={currentUsageFilter}
                  onChange={(event) =>
                    setCurrentUsageFilter(event.target.value)
                  }
                  id="filter-product-type"
                  style={{
                    backgroundColor: style.backgroundColor,
                    color: style.color,
                    cursor: "pointer",
                  }}>
                  {productCategories
                    ?.filter(
                      (item) => item.type === EIProductCategoryType.BY_USAGE
                    )
                    .map((sortItem) => (
                      <option key={sortItem._id} value={sortItem._id}>
                        {sortItem.name}
                      </option>
                    ))}
                </Form.Select>
              </Form.Group>

              {/* <Form.Group
                className="sort-select-gr flex-grow-1 flex-shrink-1 flex-lg-grow-0 flex-lg-shrink-0 "
                style={{ width: "180px" }}>
                <Form.Label className="label mb-1" htmlFor="sort-by">
                  Sort by:{" "}
                </Form.Label>
                <Form.Select
                  value={currentSort}
                  onChange={handleSortSelectChange}
                  id="sort-by"
                  style={{
                    backgroundColor: style.backgroundColor,
                    color: style.color,
                    cursor: "pointer",
                  }}>
                  {sortList.map((sortItem) => (
                    <option key={sortItem.value} value={sortItem.value}>
                      {sortItem.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group> */}
            </div>
          </div>
        </div>

        <ProductList productList={filteredProductList} />

        <CustomPagination
          totalItems={totalItems}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </Container>
    </div>
  );
};

export default ProductsPage;
