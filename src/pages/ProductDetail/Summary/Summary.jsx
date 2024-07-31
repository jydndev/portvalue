import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useProductDetailStateContext,
  useAuthStateContext,
  useAuthActionContext,
  useProductReviewStateContext,
  RatingStar,
} from '@shopby/react-components';
import { isSignedIn } from '@shopby/shared';

import AccumulationInformation from './AccumulationInformation';
import DownloadCouponButton from './DownloadCouponButton';
import FreightInformation from './FreightInformation';
import PriceInformation from './PriceInformation';
import { RightIcon } from '../../../components/Icon/RightIcon';
import { StarIcon } from '../../../components/Icon/StarIcon';
import { RATING_STAR } from '../../../constants/rate';

const Summary = () => {
  const {
    productDetail: { summary },
  } = useProductDetailStateContext();
  const navigate = useNavigate();
  const { profile } = useAuthStateContext();
  const { fetchProfile } = useAuthActionContext();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { rate } = useProductReviewStateContext();

  useEffect(() => {
    const checkLoginStatus = async () => {
      if (isSignedIn()) {
        if (!profile) {
          await fetchProfile();
        }
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
  }, [isSignedIn(), profile]);

  const handleNewUserDiscountClick = () => {
    navigate('/sign-in');
  };

  return (
    <div className="product-summary">
      <div className="product-summary__brand-info">{summary.brandName}</div>
      <h1 className="product-summary__combined">
        {summary.brandName} {summary.productName}
      </h1>
      <div className="product-summary__rating">
        <StarIcon className="product-summary__star" />
        <span className="product-summary__score"> {rate} </span>
      </div>
      <div className="product-summary__price-info">
        <PriceInformation {...summary} />
        <DownloadCouponButton />
      </div>
      <div className="new-user-discount">
        {!isLoggedIn && (
          <button className="new-user-discount-button" onClick={handleNewUserDiscountClick}>
            <div className="button-text">
              <span className="black-text">신규가입 시 </span>
              <span className="blue-text">최대 3,000원 </span>
              <span className="black-text">할인</span>
            </div>
            <RightIcon className="right-icon" />
          </button>
        )}
      </div>
      <div className="product-summary__accumulation-line">
        <AccumulationInformation {...summary.accumulation} />
      </div>
      <div className="product-summary__freight-line">
        <FreightInformation {...summary.freight} />
      </div>
    </div>
  );
};

export default Summary;