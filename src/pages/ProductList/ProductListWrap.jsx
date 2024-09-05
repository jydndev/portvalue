import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import {
  usePageScriptsActionContext,
  useProductSearchActionContext,
  useProductSearchStateContext,
  useProductSectionListActionContext,
  useProductSectionListStateContext,
} from '@shopby/react-components';
import GalleryList from '../../components/GalleryList/GalleryList';

const PER_PAGE_COUNT = 10;
const PARAM_TYPE = {
  KEYWORD: 'keyword',
  CATEGORY_NO: 'categoryNo',
};

const SORT_BY = {
  SECTION: [
    { value: 'SALE', label: '판매량순' },
    { value: 'LOW_PRICE', label: '낮은가격순' },
    { value: 'HIGH_PRICE', label: '높은가격순' },
    { value: 'REVIEW', label: '상품리뷰순' },
    { value: 'REGISTER', label: '등록일순' },
  ],
  CATEGORY: [
    { value: 'POPULAR', label: '인기순' },
    { value: 'LOW_PRICE', label: '낮은가격순' },
    { value: 'HIGH_PRICE', label: '높은가격순' },
    { value: 'REVIEW', label: '상품리뷰순' },
    { value: 'RECENT_PRODUCT', label: '등록일순' },
  ],
};

const ProductListWrap = ({ isSection }) => {
  const [searchParams] = useSearchParams();
  const { sectionsId } = useParams();

  const sectionContext = useProductSectionListStateContext();
  const categoryContext = useProductSearchStateContext();
  const { fetchProductSectionList, updateSortType: updateSectionSortType } = useProductSectionListActionContext();
  const { searchProductsBy, updateSortType: updateCategorySortType } = useProductSearchActionContext();

  const context = isSection ? sectionContext : categoryContext;
  const fetchProducts = isSection ? fetchProductSectionList : searchProductsBy;
  const updateSortType = isSection ? updateSectionSortType : updateCategorySortType;

  const { applyPageScripts } = usePageScriptsActionContext();
  const [disabled, setDisabled] = useState(false);

  const keywords = useMemo(() => searchParams.get(PARAM_TYPE.KEYWORD), [searchParams]);
  const categoryNos = useMemo(() => searchParams.get(PARAM_TYPE.CATEGORY_NO), [searchParams]);

  const [queryString, setQueryString] = useState({
    pageNumber: context.pageNumber,
    pageSize: PER_PAGE_COUNT,
    sortType: context.sortType,
    ...(isSection ? { sectionsId } : { categoryNos: categoryNos ?? '', keywords }),
    soldOut: true,
    saleStatus: 'ONSALE',
  });

  const handleIntersect = () => {
    setDisabled(true);
    if (context.accumulationProducts.length >= context.totalCount) return;
    setQueryString((prev) => ({ ...prev, pageNumber: prev.pageNumber + 1 }));
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setQueryString((prev) => ({
      ...prev,
      sortType: context.sortType,
      pageNumber: 1,
      ...(isSection ? {} : { categoryNos }),
    }));
  }, [context.sortType, categoryNos, isSection]);

  useEffect(() => {
    fetchProducts(queryString);
    setDisabled(false);
  }, [queryString, fetchProducts]);

  useEffect(() => {
    if (!context.productSearchResponse) return;

    if (isSection) {
      applyPageScripts('DISPLAY_SECTION', { displaySection: context.productSearchResponse });
    } else if (searchParams.get('keyword')) {
      applyPageScripts('PRODUCT_SEARCH', { searchedProduct: context.productSearchResponse });
    } else {
      applyPageScripts('PRODUCT_LIST', { searchedProduct: context.productSearchResponse });
    }
  }, [context.productSearchResponse, searchParams, isSection, applyPageScripts]);

  return (
    <GalleryList
      totalCount={context.totalCount}
      products={context.accumulationProducts}
      sortType={context.sortType}
      sortBy={isSection ? SORT_BY.SECTION : SORT_BY.CATEGORY}
      updateSortType={updateSortType}
      handleIntersect={handleIntersect}
      disabled={disabled}
      isLoading={context.isLoading}
    />
  );
};

export default ProductListWrap;
