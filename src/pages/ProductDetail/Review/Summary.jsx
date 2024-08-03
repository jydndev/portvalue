import { useProductReviewStateContext } from '@shopby/react-components';
import ReviewAccumulation from '../../../components/ReviewAccumulation';
import { RATING_STAR } from '../../../constants/rate';
import { StarIcon } from '../../../components/Icon/StarIcon';

const Summary = () => {
  // state context
  const { rate } = useProductReviewStateContext();

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(<StarIcon key={i} className={`star-icon ${i <= Math.round(rate) ? 'filled' : ''}`} />);
    }
    return stars;
  };

  return (
    <div className="product-review-summary">
      <p className="product-review-summary__title">상품후기</p>
      <span className="product-review-summary__rating">
        <span className="star-rating">{renderStars()}</span>
        <span className="product-review-summary__score">
          {rate} <span>/{RATING_STAR.LIMIT_SCORE}</span>
        </span>
      </span>
      <ReviewAccumulation />
    </div>
  );
};

export default Summary;
