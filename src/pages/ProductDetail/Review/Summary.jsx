import PropTypes from 'prop-types';
import { useProductReviewStateContext } from '@shopby/react-components';
import ReviewAccumulation from '../../../components/ReviewAccumulation';
import { RATING_STAR } from '../../../constants/rate';
import { StarIcon } from '../../../components/Icon/StarIcon';

const Summary = ({ totalCount }) => {
  const { rate } = useProductReviewStateContext();

const renderStars = () => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    const fillPercentage = Math.max(0, Math.min(100, (rate - (i - 1)) * 100));
    stars.push(<StarIcon key={i} className="star-icon" fillPercentage={rate > 0 ? fillPercentage : 0} />);
  }
  return stars;
};

  return (
    <div className="product-review-summary">
      <h2 className="product-review-summary__title">
        리뷰
        <span className="product-review-summary__total-count">{totalCount}</span>
      </h2>
      <span className="product-review-summary__rating">
        <span className="star-rating">{renderStars()}</span>
        <span className="product-review-summary__score">{rate}</span>
      </span>
      <ReviewAccumulation />
    </div>
  );
};

Summary.propTypes = {
  totalCount: PropTypes.number,
};

Summary.defaultProps = {
  totalCount: 0,
};

export default Summary;
