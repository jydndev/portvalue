import { useMemo, useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

///////////// shopping cart logic imports ///////
import { useNavigate } from 'react-router-dom';
import ShoppingCartButton from '../ShoppingCartButton/ShoppingCartButton';
import {
  MakeOrderBtn,
  AddToCartBtn,
  useModalActionContext,
  useProductOptionActionContext,
  useProductOptionStateContext,
  useNaverPayActionContext,
  useProductDetailActionContext,
  useAuthActionContext,
} from '@shopby/react-components';

import OptionQuantity from '../../pages/ProductDetail/Purchase/OptionQuantity';
import OptionSelector from '../../pages/ProductDetail/Purchase/OptionSelector';

import { convertToKoreanCurrency } from '@shopby/shared';
import { IconBtn } from '@shopby/react-components';
import { useErrorBoundaryActionContext } from '../ErrorBoundary';

import { useProductDetailStateContext } from '@shopby/react-components';
/////////////////////////////////////

import { object, bool, func, array, number, string } from 'prop-types';

import { Icon, InfiniteScrollLoader, ThumbItem, ThumbList, VisibleComponent } from '@shopby/react-components';
import { calculateDiscountedPrice, THUMB_LIST_TYPE } from '@shopby/shared';

import GallerySkeleton from '../GallerySkeleton';
import ProductThumbBadge from '../ProductThumbBadge';
import ProductThumbInfo from '../ProductThumbInfo';
import TotalCountAndSort from '../TotalCountAndSort';
import useLayoutChanger from '../../hooks/useLayoutChanger';

const calculateDiscountRate = (originalPrice, discountedPrice) => {
  if (originalPrice === discountedPrice) return 0;
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
};

const SkeletonComponent = ({ isLoading }) => <GallerySkeleton rowCount={3} colCount={2} isLoading={isLoading} />;
const NoSearchProduct = () => {
  const [searchParams] = useSearchParams();
  const keyword = useMemo(() => searchParams.get('keyword'), []);

  return (
    <>
      {keyword ? (
        <div className="no-search">
          <h3 className="no-search__title">&apos;{keyword}&apos; 에 대한 검색결과가 없습니다.</h3>
          <Icon name="no-items" />
          <p className="no-search__description">
            정확한 검색어를 확인하시고 다시 검색해주세요.
            <br />
            일시적으로 상품이 품절 되었을 수 있습니다.
            <br />
            단어의 철자나 띄어쓰기를 다르게 해보세요.
          </p>
        </div>
      ) : (
        <p className="not-found-product">준비 중인 카테고리입니다.</p>
      )}
    </>
  );
};

const GalleryListPage = ({
  style,
  totalCount,
  products,
  sortType,
  sortBy,
  updateSortType,
  handleIntersect,
  disabled,
  className,
  isLoading = false,
}) => {
  const [selectedProductNo, setSelectedProductNo] = useState(null);
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productNo = Number(searchParams.get('productNo'));
  const channelType = searchParams.get('channelType');

  const { openConfirm } = useModalActionContext();
  const { totalPrice } = useProductOptionStateContext();
  const { fetchOptionToMakeOrder } = useProductOptionActionContext();
  const { catchError } = useErrorBoundaryActionContext();
  const { isSignedIn } = useAuthActionContext();

  // naver pay button
  const { showNaverPayButton, prepareNaverPay, checkUsesNaverPayOrder } = useNaverPayActionContext();

  const {
    productDetail: { isSoldOut, likeStatus, limitations },
    originProductDetail,
  } = useProductDetailStateContext();

  // small cart icon button
  const handleCartButtonClick = async (e, productNo) => {
    e.preventDefault();
    e.stopPropagation();
    setVisible((prevVisible) => !prevVisible);
    setSelectedProductNo(productNo);
    await fetchProductDetails(selectedProductNo);
  };

  // add to cart button
  const handleCartBtnClick = () => {
    openConfirm({
      message: '장바구니에 담았습니다.',
      confirmLabel: '장바구니 가기',
      onConfirm: () => {
        navigate('/cart');
      },
      cancelLabel: '닫기',
    });
    setVisible(false);
  };

  const handleMakeOrderBtnClick = ({ orderSheetNo }) => {
    isSignedIn() ? navigate(`/order/${orderSheetNo}`) : navigate('/sign-in', { state: { orderSheetNo } });
    setVisible(false);
  };

  const handleError = (error) => {
    catchError(error, () => navigate(0));
  };

  useEffect(() => {
    (async () => {
      const usesNaverPayOrder = await checkUsesNaverPayOrder();

      if (usesNaverPayOrder && limitations?.naverPayHandling) {
        showNaverPayButton({
          containerElementId: 'naver-pay',
          usesWishListButton: true,
          redirectUrlAfterBuying: location.href, // backUrl
          redirectUrlAfterWishing: location.href, // backUrl
          onBeforeBuyButtonClick: async () => {
            const {
              data: { products },
            } = await fetchOptionToMakeOrder({ channelType });

            const naverPayItems = products.map(({ orderCnt, channelType, optionInputs, optionNo, productNo }) => ({
              orderCnt,
              channelType,
              optionInputs,
              optionNo,
              productNo,
            }));

            prepareNaverPay({ items: naverPayItems });
          },
          onBeforeWishListButtonClick: () => {
            prepareNaverPay({ productNo });
          },
        });
      }
    })();
  }, [limitations?.naverPayHandling, productNo]);

  return (
    <div className="l-panel">
      <TotalCountAndSort totalCount={totalCount} sortType={sortType} sortBy={sortBy} updateSortType={updateSortType} />

      <VisibleComponent
        shows={products.length > 0}
        TruthyComponent={
          <>
            <ThumbList style={style} displayType={THUMB_LIST_TYPE.GALLERY} className={className}>
              {products.map(
                ({
                  productNo,
                  adult,
                  listImageUrls,
                  isSoldOut,
                  saleStatusType,
                  salePrice,
                  promotionText,
                  productName,
                  immediateDiscountAmt,
                  additionDiscountAmt,
                  frontDisplayYn,
                  brandName,
                }) =>
                  frontDisplayYn && (
                    <ThumbItem
                      key={productNo}
                      resize="220x220"
                      href={`/product-detail?productNo=${productNo}`}
                      src={listImageUrls[0]}
                      adult={adult}
                      alt={productName}
                      productNo={productNo}
                    >
                      <div className="thumb-item-wrapper" style={{ position: 'relative' }}>
                        <ShoppingCartButton onClick={(e) => handleCartButtonClick(e, productNo)} />
                        <ProductThumbBadge isSoldOut={isSoldOut} saleStatusType={saleStatusType} />
                      </div>
                      <Link to={`/product-detail?productNo=${productNo}`}>
                        <ProductThumbInfo
                          salePrice={calculateDiscountedPrice({
                            salePrice,
                            immediateDiscountAmt,
                            additionDiscountAmt,
                          })}
                          brandName={brandName}
                          promotionText={promotionText}
                          productName={productName}
                          discountRate={calculateDiscountRate(
                            salePrice,
                            calculateDiscountedPrice({
                              salePrice,
                              immediateDiscountAmt,
                              additionDiscountAmt,
                            })
                          )}
                        />
                      </Link>
                    </ThumbItem>
                  )
              )}
            </ThumbList>

            <div className="purchase-nav" hidden={!visible}>
              <IconBtn className="purchase__close-btn" iconType="close" onClick={() => setVisible(false)} />
              <OptionSelector />
              <div className="purchase__quantity-box">
                <OptionQuantity />
              </div>
              <p className="purchase__total">
                <span>총 상품 금액</span>
                <em>
                  <span className="highlight bold">{convertToKoreanCurrency(totalPrice)}</span>원
                </em>
              </p>
              <div id="naver-pay" className="purchase__naver-pay-btn" />
              <div className="purchase__btns">
                <AddToCartBtn
                  onClick={handleCartBtnClick}
                  onError={(e) => handleError(e)}
                  channelType={channelType}
                  productNo={selectedProductNo}
                />
                <MakeOrderBtn
                  onClick={handleMakeOrderBtnClick}
                  onError={(e) => handleError(e)}
                  channelType={channelType}
                  productNo={selectedProductNo}
                />
              </div>
            </div>

            <SkeletonComponent isLoading={isLoading} />
            <InfiniteScrollLoader onIntersect={handleIntersect} disabled={disabled} />
          </>
        }
        FalsyComponent={isLoading ? <SkeletonComponent isLoading={isLoading} /> : <NoSearchProduct />}
      />
    </div>
  );
};

export default GalleryListPage;

SkeletonComponent.propTypes = {
  isLoading: bool,
};
GalleryListPage.propTypes = {
  style: object,
  totalCount: number,
  products: array,
  sortType: string,
  sortBy: array,
  updateSortType: func,
  handleIntersect: func,
  disabled: bool,
  className: string,
  isLoading: bool,
};
