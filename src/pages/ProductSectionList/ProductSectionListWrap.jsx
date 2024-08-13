import { useState, useEffect, useMemo } from 'react';
import { isMobile } from 'react-device-detect';
import { useTranslation } from 'react-i18next';
import { useParams, useSearchParams } from 'react-router-dom';

import {
  CartProvider,
  CouponByProductProvider,
  NaverPayProvider,
  OrderSheetProvider,
  ProductOptionProvider,
  usePageScriptsActionContext,
  useProductSectionListActionContext,
  useProductSectionListStateContext,
  TabsProvider,
  useProductDetailActionContext,
  useProductOptionActionContext,
  useTabsActiveContext,
  useProductReviewStateContext,
  useProductInquiryStateContext,
  useProductInquiryActionContext,
  useProductDetailStateContext,
  useMallStateContext,
} from '@shopby/react-components';

import GalleryListPage from '../../components/GalleryListPage';
import useLayoutChanger from '../../hooks/useLayoutChanger';
import Purchase from '../ProductDetail/Purchase';

// Migrate Providers and their logic from ProductDetail.jsx for small shopping cart feature.
// TODO clean up code duplication.
const makeTabs = ({ reviewCount = 0, inquiryCount = 0, hasGuide = false } = {}) => {
  const tabs = [
    {
      value: 'DETAIL',
      label: '상세정보',
    },
    {
      value: 'REVIEW',
      label: `리뷰(${reviewCount})`,
    },
    /* {
      value: 'INQUIRY',
      label: `Q&A (${inquiryCount})`,
    }, */
  ];

  /* if (hasGuide) {
    tabs.push({
      value: 'SHIPPING_CLAIM',
      label: '배송/반품',
    });
  } */

  return tabs;
};

const ProductDetailContent = () => {
  const [searchParams] = useSearchParams();
  const productNo = Number(searchParams.get('productNo'));
  const channelType = searchParams.get('channelType');

  const {
    productDetail: { productName, guide },
    originProductDetail,
  } = useProductDetailStateContext();

  const { applyPageScripts } = usePageScriptsActionContext();
  const { fetchProductDetail, fetchRelatedProducts } = useProductDetailActionContext();
  const { fetchSelectorOptions } = useProductOptionActionContext();
  const { updateTabs } = useTabsActiveContext();
  const { totalCount: reviewCount } = useProductReviewStateContext();
  const { totalCount: inquiryCount } = useProductInquiryStateContext();
  const { searchInquiries } = useProductInquiryActionContext();
  const { relatedProducts } = useProductDetailStateContext();

  useLayoutChanger({ hasBackBtnOnHeader: true, title: productName, hasBottomNav: false });

  useEffect(() => {
    if (!originProductDetail) return;

    applyPageScripts('PRODUCT', { product: originProductDetail }, true);
  }, [originProductDetail]);

  useEffect(() => {
    searchInquiries();

    if (productNo > 0) {
      fetchProductDetail({
        productNo,
        channelType,
      });

      fetchRelatedProducts({
        productNo,
      });

      fetchSelectorOptions({
        productNo,
      });
    }
  }, [productNo]);

  const hasGuide = useMemo(() => Object.entries(guide).some(([, content]) => Boolean(content)), [guide]);

  useEffect(
    () =>
      updateTabs(
        makeTabs({
          reviewCount,
          inquiryCount,
          hasGuide,
        })
      ),
    [reviewCount, inquiryCount, hasGuide]
  );

  return (
    <div className="product-detail">
      <ImageSlider />
      <Summary />
      <div className="divider" />
      {relatedProducts?.length > 0 && <RelatedProduct />}
      <AdminBanner bannerId="BNDETAIL" />
      <Content />
    </div>
  );
};

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

  const { t } = useTranslation('title');

  /////////////
  const { clientId, mallProfile } = useMallStateContext();
  const [searchParams] = useSearchParams();
  const productNo = Number(searchParams.get('productNo'));
  const { delayPageScriptLoading } = usePageScriptsActionContext();

  const initialTabs = useMemo(() => makeTabs(), []);

  useEffect(() => {
    delayPageScriptLoading();
  }, []);

  const [selectedProductNo, setSelectedProductNo] = useState(null);

  const handleCartClick = (productNo) => {
    setSelectedProductNo(productNo);
  };

  //////////

  const handleIntersect = () => {
    setDisabled(true);
    if (accumulationProducts.length >= productTotalCount) return;

    setQueryString((prev) => ({ ...prev, pageNumber: prev.pageNumber + 1 }));
  };

  useLayoutChanger({
    hasBackBtnOnHeader: true,
    hasBottomNav: false,
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
    <TabsProvider
      initialState={{
        currentTab: 'DETAIL',
        tabs: initialTabs,
      }}
    >
      <OrderSheetProvider>
        <NaverPayProvider clientId={clientId} mallProfile={mallProfile} platform={isMobile ? 'MOBILE_WEB' : 'PC'}>
          <CartProvider>
            <ProductOptionProvider productNo={productNo}>
              <CouponByProductProvider productNo={productNo}>
                <GalleryListPage
                  totalCount={productTotalCount}
                  products={accumulationProducts}
                  sortType={sortType}
                  sortBy={SORT_BY}
                  updateSortType={updateSortType}
                  handleIntersect={handleIntersect}
                  disabled={disabled}
                  isLoading={isLoading}
                  productNo={productNo}
                  onCartClick={handleCartClick}
                />
              </CouponByProductProvider>
              {selectedProductNo && <Purchase productNo={selectedProductNo} />}
            </ProductOptionProvider>
          </CartProvider>
        </NaverPayProvider>
      </OrderSheetProvider>
    </TabsProvider>
  );
};

export default ProductSectionListWrap;
