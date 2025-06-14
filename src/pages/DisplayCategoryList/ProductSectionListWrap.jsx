import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';
import useLayoutChanger from '../../hooks/useLayoutChanger';

import {
  usePageScriptsActionContext,
  useProductSectionListActionContext,
  useProductSectionListStateContext,
} from '@shopby/react-components';

import GalleryList from '../../components/GalleryList/GalleryList';

const PER_PAGE_COUNT = 10;
const SORT_BY = [
  { value: 'SALE', label: '판매량순' },
  { value: 'LOW_PRICE', label: '낮은가격순' },
  { value: 'HIGH_PRICE', label: '높은가격순' },
  { value: 'REVIEW', label: '상품리뷰순' },
  { value: 'REGISTER', label: '등록일순' },
];

const ProductSectionListWrap = () => {
  const { sectionsId } = useParams();
  const { sortType, label, productTotalCount, pageNumber, accumulationProducts, displaySectionResponse, isLoading } =
    useProductSectionListStateContext();
  const { fetchProductSectionList, updateSortType } = useProductSectionListActionContext();
  const { applyPageScripts } = usePageScriptsActionContext();
  const [queryString, setQueryString] = useState({
    pageNumber,
    sectionsId,
    pageSize: PER_PAGE_COUNT,
    by: sortType,
    soldOut: true,
  });
  const [disabled, setDisabled] = useState(false);

  const handleIntersect = () => {
    setDisabled(true);
    if (accumulationProducts.length >= productTotalCount) return;

    setQueryString((prev) => ({ ...prev, pageNumber: prev.pageNumber + 1 }));
  };

  const { t } = useTranslation('title');

  useLayoutChanger({
    hasBackBtnOnHeader: true,
    hasBottomNav: true,
    hasCartBtnOnHeader: true,
    title: t(label),
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    setQueryString((prev) => ({ ...prev, pageNumber: 1, by: sortType }));
  }, [sortType]);

  useEffect(() => {
    fetchProductSectionList(queryString);
    setDisabled(false);
  }, [queryString]);

  useEffect(() => {
    if (!displaySectionResponse) return;

    applyPageScripts('DISPLAY_SECTION', { displaySection: displaySectionResponse });
  }, [displaySectionResponse]);

  return (
    <GalleryList
      totalCount={productTotalCount}
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

export default ProductSectionListWrap;
