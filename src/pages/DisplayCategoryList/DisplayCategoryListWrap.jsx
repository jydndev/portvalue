import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { isMobile } from 'react-device-detect';

import {
  CartProvider,
  OrderSheetProvider,
  usePageScriptsActionContext,
  useProductSearchActionContext,
  useProductSearchStateContext,
  useMallStateContext,
} from '@shopby/react-components';

import GalleryListPage from '../../components/GalleryListPage';

////// providers imports
import { ProductOptionProvider, NaverPayProvider } from '@shopby/react-components';

//////

const PER_PAGE_COUNT = 10;
const PARAM_TYPE = {
  KEYWORD: 'keyword',
  CATEGORY_NO: 'categoryNo',
};
const SORT_BY = [
  { value: 'POPULAR', label: '인기순' },
  { value: 'LOW_PRICE', label: '낮은가격순' },
  { value: 'HIGH_PRICE', label: '높은가격순' },
  { value: 'REVIEW', label: '상품후기순' },
  { value: 'RECENT_PRODUCT', label: '등록일순' },
];

const DisplayCategoryListWrap = () => {
  const { pageNumber, totalCount, sortType, accumulationProducts, productSearchResponse, isLoading } =
    useProductSearchStateContext();
  const { searchProductsBy, updateSortType } = useProductSearchActionContext();
  const { applyPageScripts } = usePageScriptsActionContext();
  const [disabled, setDisabled] = useState(false);
  const [searchParams] = useSearchParams();
  const productNo = Number(searchParams.get('productNo'));
  const { clientId, mallProfile } = useMallStateContext();

  const keywords = useMemo(() => searchParams.get(PARAM_TYPE.KEYWORD), [searchParams]);
  const categoryNos = useMemo(() => searchParams.get(PARAM_TYPE.CATEGORY_NO), [searchParams]);
  const [queryString, setQueryString] = useState({
    categoryNos: categoryNos ?? '',
    keywords,
    pageNumber,
    sortType,
    pageSize: PER_PAGE_COUNT,
    soldOut: true,
    saleStatus: 'ONSALE',
  });

  const handleIntersect = () => {
    setDisabled(true);
    if (accumulationProducts.length >= totalCount) return;
    setQueryString((prev) => ({ ...prev, pageNumber: prev.pageNumber + 1 }));
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    setQueryString((prev) => ({
      ...prev,
      sortType,
      pageNumber: 1,
      categoryNos,
    }));
  }, [sortType, categoryNos]);

  useEffect(() => {
    searchProductsBy(queryString);
    setDisabled(false);
  }, [queryString]);

  useEffect(() => {
    if (!productSearchResponse) return;

    if (searchParams.get('keyword')) {
      applyPageScripts('PRODUCT_SEARCH', { searchedProduct: productSearchResponse });

      return;
    }
    applyPageScripts('PRODUCT_LIST', { searchedProduct: productSearchResponse });
  }, [productSearchResponse, searchParams]);

  return (
    <OrderSheetProvider>
      <NaverPayProvider clientId={clientId} mallProfile={mallProfile} platform={isMobile ? 'MOBILE_WEB' : 'PC'}>
        <CartProvider>
          <ProductOptionProvider productNo={productNo}>
            <GalleryListPage
              totalCount={totalCount}
              products={accumulationProducts}
              sortType={sortType}
              sortBy={SORT_BY}
              updateSortType={updateSortType}
              handleIntersect={handleIntersect}
              disabled={disabled}
              isLoading={isLoading}
            />
          </ProductOptionProvider>
        </CartProvider>
      </NaverPayProvider>
    </OrderSheetProvider>
  );
};

export default DisplayCategoryListWrap;
