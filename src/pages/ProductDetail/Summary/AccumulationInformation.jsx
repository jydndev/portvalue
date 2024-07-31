import { useMemo } from 'react';
import { number, bool } from 'prop-types';
import { Link } from 'react-router-dom';

import { useMallStateContext, VisibleComponent } from '@shopby/react-components';
import { convertToKoreanCurrency, isSignedIn } from '@shopby/shared';

const AccumulationInformation = ({ accumulatedAmount, canAccumulate }) => {
  const { accumulationConfig } = useMallStateContext();
  const signUpAccumulationLabel = useMemo(() => {
    if (!accumulationConfig.useMemberAccumulation) return '';

    if (isSignedIn()) return '';

    return (
      <span>
        (
        <Link to="/sign-in" style={{ textDecoration: 'underline' }}>
          로그인
        </Link>{' '}
        시 적립 가능)
      </span>
    );
  }, [accumulationConfig.useMemberAccumulation, isSignedIn]);

  return (
    <VisibleComponent
      shows={canAccumulate && accumulatedAmount > 0}
      TruthyComponent={
        <dl className="product-summary__point">
          <dt>
            <span className="summary__point">적립금</span>
          </dt>
          <dd>
            {convertToKoreanCurrency(accumulatedAmount)}
            {accumulationConfig.unit ?? 'p'} 적립 {signUpAccumulationLabel}
          </dd>
        </dl>
      }
    />
  );
};

AccumulationInformation.propTypes = {
  accumulatedAmount: number,
  canAccumulate: bool,
};

export default AccumulationInformation;
