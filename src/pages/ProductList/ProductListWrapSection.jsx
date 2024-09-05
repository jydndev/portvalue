import React, { useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import {
  usePageScriptsActionContext,
  useProductSectionListActionContext,
  useProductSectionListStateContext,
} from '@shopby/react-components';
import GalleryList from '../../components/GalleryList';
import useLayoutChanger from '../../hooks/useLayoutChanger';
import useProductList from '../../hooks/useProductList';

const PER_PAGE_COUNT = 10;
const SORT_BY = [
  { value: 'SALE', label: '판매량순' },
  { value: 'LOW_PRICE', label: '낮은가격순' },
  { value: 'HIGH_PRICE', label: '높은가격순' },
  { value: 'REVIEW', label: '상품리뷰순' },
  { value: 'REGISTER', label: '등록일순' },
];

const ProductListWrapSection = () => {
  const { t } = useTranslation('title');
  const { sectionsId } = useParams();
  const { sortType, label, productTotalCount, pageNumber, accumulationProducts, displaySectionResponse, isLoading } =
    useProductSectionListStateContext();
  const { fetchProductSectionList, updateSortType } = useProductSectionListActionContext();
  const { applyPageScripts } = usePageScriptsActionContext();

  const memoizedInitialState = useMemo(
    () => ({
      sectionsId,
      sortType,
      pageNumber,
    }),
    [sectionsId, sortType, pageNumber]
  );

  const { queryString, setQueryString, disabled, handleIntersect } = useProductList(
    fetchProductSectionList,
    applyPageScripts,
    'DISPLAY_SECTION',
    memoizedInitialState
  );

  useLayoutChanger({
    hasBackBtnOnHeader: true,
    hasBottomNav: true,
    hasCartBtnOnHeader: true,
    title: t(label),
  });

  useEffect(() => {
    if (!displaySectionResponse) return;
    applyPageScripts('DISPLAY_SECTION', { displaySection: displaySectionResponse });
  }, [displaySectionResponse, applyPageScripts]);

  const memoizedUpdateSortType = useCallback(updateSortType, [updateSortType]);

  return (
    <GalleryList
      totalCount={productTotalCount}
      products={accumulationProducts}
      sortType={sortType}
      sortBy={SORT_BY}
      updateSortType={memoizedUpdateSortType}
      handleIntersect={handleIntersect}
      disabled={disabled}
      isLoading={isLoading}
    />
  );
};

export default React.memo(ProductListWrapSection);
