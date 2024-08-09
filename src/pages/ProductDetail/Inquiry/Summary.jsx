import { useState, useMemo } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import { func } from 'prop-types';

import {
  Button,
  useModalActionContext,
  useAuthActionContext,
  useProductDetailStateContext,
  VisibleComponent,
  useProductInquiryFormActionContext,
  useProductInquiryStateContext,
} from '@shopby/react-components';

import { useErrorBoundaryActionContext } from '../../../components/ErrorBoundary';
import FullModal from '../../../components/FullModal/FullModal';
import ProductInquiryForm from '../../../components/ProductInquiryForm/ProductInquiryForm';

const Summary = ({ onSubmit }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [searchParams] = useSearchParams();
  const productNo = Number(searchParams.get('productNo'));

  const pathState = useMemo(
    () => ({
      from: `${location.pathname}${location.search}`,
    }),
    [location]
  );

  // action context
  const { openAlert } = useModalActionContext();
  const { isSignedIn } = useAuthActionContext();
  const { postProductInquiryBy } = useProductInquiryFormActionContext();
  const { catchError } = useErrorBoundaryActionContext();

  // state context
  const {
    productDetail: {
      summary: { productName },
      images,
    },
  } = useProductDetailStateContext();
  const { inquiryConfig } = useProductInquiryStateContext();

  const mainImageUrl = useMemo(() => images.at(0)?.src ?? '', [images]);

  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);

  const handleWriteBtnClick = () => {
    if (!isSignedIn()) {
      openAlert({
        message: '먼저 로그인을 해주세요.',
        onClose: () => {
          navigate('/sign-in', {
            state: pathState,
            replace: true,
          });
        },
      });

      return;
    }

    setIsRegistrationModalOpen(true);
  };

  const handleProductInquiryFormSubmit = async (productInquiryForm) => {
    try {
      await postProductInquiryBy({
        productNo,
        ...productInquiryForm,
      });

      await openAlert({
        message: '상품문의가 등록됐습니다.',
        onClose: async () => {
          await onSubmit();

          setIsRegistrationModalOpen(false);
        },
      });
    } catch (e) {
      catchError(e);
    }
  };

  return (
    <div className="product-inquiry-summary">
      <div className="product-inquiry-summary__description" />
      <Button
        label="상품문의 작성하기"
        theme="dark"
        className="product-inquiry-summary__write-btn"
        onClick={handleWriteBtnClick}
      />
      <VisibleComponent
        shows={isRegistrationModalOpen}
        TruthyComponent={
          <FullModal title={inquiryConfig.name}>
            <ProductInquiryForm
              productName={productName}
              productImageUrl={mainImageUrl}
              ButtonGroup={(props) => (
                <div className="board-form__button-group">
                  <Button
                    className="review-form__submit-btn review-form__btn inquiry-form__btn--cancel"
                    theme="dark"
                    label="취소"
                    onClick={() => setIsRegistrationModalOpen(false)}
                  />
                  <Button
                    className="review-form__submit-btn review-form__btn inquiry-form__btn--register"
                    theme="caution"
                    label="등록"
                    onClick={() => handleProductInquiryFormSubmit(props)}
                  />
                </div>
              )}
            />
          </FullModal>
        }
      />
    </div>
  );
};

Summary.propTypes = {
  onSubmit: func.isRequired,
};

export default Summary;
