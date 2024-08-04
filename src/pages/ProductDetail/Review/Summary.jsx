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
      stars.push(<StarIcon key={i} className={`star-icon ${i <= Math.round(rate) ? 'filled' : ''}`} />);
    }
    return stars;
  };

  return (
    <div className="product-review-summary">
      <p className="product-review-summary__title">
        리뷰 <span className="product-review-summary__total-count">{totalCount}</span>
      </p>
      <span className="product-review-summary__rating">
        <span className="star-rating">{renderStars()}</span>
        <span className="product-review-summary__score">
          {rate}
        </span>
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
