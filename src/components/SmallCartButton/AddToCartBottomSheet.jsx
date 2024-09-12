import { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

import {
  AddToCartBtn,
  VisibleComponent,
  Button,
  useProductOptionStateContext,
  useProductDetailStateContext,
  useProductOptionActionContext,
} from '@shopby/react-components';
import { convertToKoreanCurrency } from '@shopby/shared';

import { useErrorBoundaryActionContext } from '../ErrorBoundary';

import OptionQuantity from '../../pages/ProductDetail/Purchase/OptionQuantity';
import OptionSelector from '../../pages/ProductDetail/Purchase/OptionSelector';
import CloseIcon from './CloseIcon';

const UNPURCHASABLE_STATUS = ['READY', 'FINISHED', 'STOP', 'PROHIBITION'];

const AddToCartBottomSheet = ({ customProductNo, onClose }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const productNo = customProductNo;
  const channelType = searchParams.get('channelType');

  const {
    productDetail: { isSoldOut },
    originProductDetail,
  } = useProductDetailStateContext();
  const { fetchOptionToMakeOrder } = useProductOptionActionContext();
  const { totalPrice } = useProductOptionStateContext();
  const { catchError } = useErrorBoundaryActionContext();

  const unpurchasable = useMemo(
    () => UNPURCHASABLE_STATUS.includes(originProductDetail?.status.saleStatusType) || isSoldOut,
    [originProductDetail?.status, isSoldOut]
  );

  const handleCartBtnClick = () => {
    window.location.reload();
  };

  const handleError = (error) => {
    catchError(error, () => navigate(0));
  };

  const handleCloseClick = () => {
    if (onClose && typeof onClose === 'function') {
      onClose();
    }
  };

  return (
    <div className="cart-bottom-sheet product-detail">
      <div className="add-to-cart-opener" onClick={handleCloseClick}>
        <CloseIcon size={16} />
      </div>

      {/* TODO: override 장바구니담기 with this one for unpurchasable products */}

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
        {unpurchasable ? (
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
        ) : (
          <div className="purchase__btns">
            <AddToCartBtn onClick={handleCartBtnClick} onError={(e) => handleError(e)} channelType={channelType} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AddToCartBottomSheet;

AddToCartBottomSheet.propTypes = {
  customProductNo: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onClose: PropTypes.func,
};
