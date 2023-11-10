import { useEffect, useState } from "react";
import { Container, Form } from "react-bootstrap";
import { useLocation, useSearchParams } from "react-router-dom";
import CatLoading from "src/components/Loading/CatLoading";
import ProductList from "src/components/ProductList";
import CustomPagination from "src/components/customComponents/CustomPagination";
import { DEFAULT_ITEMS_PER_PAGE } from "src/constants";
import {
  getAllProductCategories,
  getAllProductMethod,
} from "src/services/product/productThunkActions";
import { AppDispatch, RootState } from "src/stores/rootReducer";
import {
  EIProductCategoryType,
  IProduct,
  IProductCategory,
} from "src/types/productTypes";
import { handleError } from "src/utils/handleError";
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
  isSpecial?: boolean;
}

const ProductsPage = ({ isSpecial }: ProductsPageProps) => {
  const dispatch: AppDispatch = useAppDispatch();
  const { themeState } = useAppSelector((state: RootState) => state);

  const { style } = themeState;
  const [searchParams] = useSearchParams();
  const [currentPetFilter, setCurrentPetFilter] = useState<string | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(false);

  const location = useLocation();

  const [currentUsesFilter, setCurrentUsesFilter] = useState<
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
      try {
        setIsLoading(true);
        const params: Record<string, any> = {
          page: currentPage - 1,
          limit: DEFAULT_ITEMS_PER_PAGE,
          keyword: searchParams.get("search") || undefined,
          isSpecial,
        };

        if (currentPetFilter && currentPetFilter !== "-1") {
          params.petType = currentPetFilter;
        }
        if (currentUsesFilter && currentUsesFilter !== "-1") {
          params.usesTypes = currentUsesFilter;
        }

        const response = await dispatch(
          getAllProductMethod({ params })
        ).unwrap();

        setTotalItems(response?.totalRecords);
        setFilteredProductList(response?.dataList);
      } catch (error) {
        handleError(error);
      } finally {
        setIsLoading(false);
      }
    };

    getDataList();
  }, [
    dispatch,
    currentPage,
    searchParams,
    currentPetFilter,
    currentUsesFilter,
    isSpecial,
  ]);

  useEffect(() => {
    const getAllCategories = async () => {
      try {
        const response = await dispatch(getAllProductCategories({})).unwrap();
        setProductCategories(response);
      } catch (error) {
        handleError(error);
      }
    };

    getAllCategories();
  }, [dispatch]);

  useEffect(() => {
    setCurrentPetFilter("-1");
    setCurrentUsesFilter("-1");
  }, [location]);

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
                {isSpecial ? "Premium" : "Danh sách sản phẩm"}
              </div>
            )}

            {!isSpecial && (
              <div className="ms-auto d-flex flex-wrap flex-grow-1 flex-shrink-1 flex-lg-grow-0 flex-lg-shrink-0">
                <Form.Group
                  className="filter-select-gr flex-grow-1 flex-shrink-1 flex-lg-grow-0 flex-lg-shrink-0 me-3"
                  style={{ width: "180px" }}>
                  <Form.Label className="label mb-1" htmlFor="filter-pets-type">
                    Pets Type:
                  </Form.Label>
                  <Form.Select
                    value={currentPetFilter}
                    onChange={(event) =>
                      setCurrentPetFilter(event.target.value)
                    }
                    id="filter-pets-type"
                    style={{
                      backgroundColor: style.backgroundColor,
                      color: style.color,
                      cursor: "pointer",
                    }}>
                    {[
                      {
                        _id: "-1",
                        name: "All",
                      } as IProductCategory,
                      ...productCategories?.filter(
                        (item) => item.type === EIProductCategoryType.BY_PET
                      ),
                    ].map((sortItem) => (
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
                    value={currentUsesFilter}
                    onChange={(event) =>
                      setCurrentUsesFilter(event.target.value)
                    }
                    id="filter-product-type"
                    style={{
                      backgroundColor: style.backgroundColor,
                      color: style.color,
                      cursor: "pointer",
                    }}>
                    {[
                      {
                        _id: "-1",
                        name: "All",
                      },
                      ...productCategories?.filter(
                        (item) => item.type === EIProductCategoryType.BY_USAGE
                      ),
                    ].map((sortItem) => (
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
            )}
          </div>
        </div>

        {isLoading ? (
          <CatLoading />
        ) : (
          <>
            <ProductList
              isLoading={isLoading}
              productList={filteredProductList}
            />

            {filteredProductList.length > 0 && (
              <CustomPagination
                totalItems={totalItems}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
            )}
          </>
        )}
      </Container>
    </div>
  );
};

export default ProductsPage;
