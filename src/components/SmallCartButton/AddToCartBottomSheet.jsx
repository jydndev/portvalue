import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

import { bool } from 'prop-types';

import {
  AddToCartBtn,
  useModalActionContext,
  VisibleComponent,
  Button,
  useProductOptionStateContext,
  useProductDetailStateContext,
  IconBtn,
  useProductDetailActionContext,
  useAuthActionContext,
  IconSVG,
  useNaverPayActionContext,
  useProductOptionActionContext,
} from '@shopby/react-components';
import { convertToKoreanCurrency } from '@shopby/shared';

import { useErrorBoundaryActionContext } from '../ErrorBoundary';

import OptionQuantity from '../../pages/ProductDetail/Purchase/OptionQuantity';
import OptionSelector from '../../pages/ProductDetail/Purchase/OptionSelector';
import CloseIcon from './CloseIcon';

// import OptionQuantity from './OptionQuantity';
// import OptionSelector from './OptionSelector';

const UNPURCHASABLE_STATUS = ['READY', 'FINISHED', 'STOP', 'PROHIBITION'];

const AddToCartBottomSheet = ({ customProductNo, onClose }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const productNo = customProductNo;
  const channelType = searchParams.get('channelType');

  const {
    productDetail: { isSoldOut, likeStatus, limitations },
    originProductDetail,
  } = useProductDetailStateContext();
  const { fetchOptionToMakeOrder } = useProductOptionActionContext();
  const { openConfirm } = useModalActionContext();
  const { totalPrice } = useProductOptionStateContext();
  const { isSignedIn } = useAuthActionContext();
  const [visible, setVisible] = useState(false);
  const { catchError } = useErrorBoundaryActionContext();

  const unpurchasable = useMemo(
    () => UNPURCHASABLE_STATUS.includes(originProductDetail?.status.saleStatusType) || isSoldOut,
    [originProductDetail?.status]
  );

  const handleMakeOrderBtnClick = ({ orderSheetNo }) => {
    isSignedIn() ? navigate(`/order/${orderSheetNo}`) : navigate('/sign-in', { state: { orderSheetNo } });
  };

  const handleCartBtnClick = () => {
    openConfirm({
      message: '장바구니에 담았습니다.',
      confirmLabel: '장바구니 가기',
      onConfirm: () => {
        navigate('/cart');
      },
      cancelLabel: '닫기',
      onCancel: () => {
        window.location.reload();
      },
    });
  };

  const handleError = (error) => {
    catchError(error, () => navigate(0));
  };

  return (
    <div className="cart-bottom-sheet product-detail">
      <VisibleComponent
        shows={!unpurchasable}
        TruthyComponent={
          <div className="add-to-cart-opener" onClick={onClose}>
            <CloseIcon size={16} />
          </div>
        }
      />

      <VisibleComponent
        shows={unpurchasable}
        TruthyComponent={
          <Button
            className="purchase__buy-btn purchase__buy-btn--unpurchasable"
            disabled={isSoldOut}
            theme="dark"
            label="구매불가"
          />
        }
      />

      {/* <VisibleComponent
        shows={!isSoldOut && !visible && !unpurchasable}
        TruthyComponent={
          <div className="purchase__button-wrap">
            <LikeBtn
              className="purchase__like-btn"
              productNo={productNo}
              isActive={likeStatus.isLiked}
              count={likeStatus.count}
              onClick={({ count, isActive }) =>
                updateLikeStatus({
                  count,
                  isLiked: isActive,
                })
              }
            >
              <IconSVG
                fill={likeStatus.isLiked ? 'var(--point-color)' : 'var(--default-color)'}
                strokeWidth={0}
                size={40}
                name="fill-heart"
              />
            </LikeBtn>
            <Button className="purchase__buy-btn" theme="caution" label="구매하기" onClick={() => setVisible(true)} />
          </div>
        }
      /> */}

      <div className="purchase__option">
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
          <AddToCartBtn onClick={handleCartBtnClick} onError={(e) => handleError(e)} channelType={channelType} />
        </div>
      </div>
    </div>
  );
};

export default AddToCartBottomSheet;

AddToCartBottomSheet.propTypes = {
  isSoldOut: bool,
};
