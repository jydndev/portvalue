import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  usePageScriptsActionContext,
  useProductSearchActionContext,
  useProductSearchStateContext,
} from '@shopby/react-components';
import GalleryList from '../../components/GalleryList/GalleryList';
import useLayoutChanger from '../../hooks/useLayoutChanger';
import useProductList from '../../hooks/useProductList';

const PER_PAGE_COUNT = 10;
const PARAM_TYPE = {
  KEYWORD: 'keyword',
  CATEGORY_NO: 'categoryNo',
};
const SORT_BY = [
  { value: 'POPULAR', label: '인기순' },
  { value: 'LOW_PRICE', label: '낮은가격순' },
  { value: 'HIGH_PRICE', label: '높은가격순' },
  { value: 'REVIEW', label: '상품리뷰순' },
  { value: 'RECENT_PRODUCT', label: '등록일순' },
];

const ProductListWrapCategory = () => {
  const { t } = useTranslation('title');
  const { pageNumber, totalCount, sortType, accumulationProducts, productSearchResponse, isLoading } =
    useProductSearchStateContext();
  const { searchProductsBy, updateSortType } = useProductSearchActionContext();
  const { applyPageScripts } = usePageScriptsActionContext();
  const [searchParams] = useSearchParams();
  const keywords = useMemo(() => searchParams.get(PARAM_TYPE.KEYWORD), [searchParams]);
  const categoryNos = useMemo(() => searchParams.get(PARAM_TYPE.CATEGORY_NO), [searchParams]);

  const { queryString, setQueryString, disabled, handleIntersect } = useProductList(
    searchProductsBy,
    applyPageScripts,
    keywords ? 'PRODUCT_SEARCH' : 'PRODUCT_LIST',
    { keywords, categoryNos, sortType, pageNumber }
  );

  useLayoutChanger({
    hasBackBtnOnHeader: !keywords,
    hasBottomNav: true,
    hasCartBtnOnHeader: !keywords,
    title: keywords || t('상품 목록'),
    hasSearchKeywordHeader: !!keywords,
  });

  useEffect(() => {
    if (!productSearchResponse) return;
    applyPageScripts(keywords ? 'PRODUCT_SEARCH' : 'PRODUCT_LIST', { searchedProduct: productSearchResponse });
  }, [productSearchResponse, keywords, applyPageScripts]);

  return (
    <GalleryList
      totalCount={totalCount}
      products={accumulationProducts}
      sortType={sortType}
      sortBy={SORT_BY}
      updateSortType={updateSortType}
      handleIntersect={handleIntersect}
      disabled={disabled}
      isLoading={isLoading}
    />
  );
};

export default ProductListWrapCategory;
