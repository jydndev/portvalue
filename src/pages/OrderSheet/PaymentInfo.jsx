import { useMemo } from 'react';

import { useOrderSheetStateContext } from '@shopby/react-components';
import { convertToKoreanCurrency } from '@shopby/shared';

import PriceTag from '../../components/PriceTag';

const PaymentInfo = () => {
  const {
    orderSheet,
    paymentInfo: {
      paymentAmt,
      totalStandardAmt,
      productCouponAmt,
      cartCouponAmt,
      deliveryAmt,
      usedAccumulationAmt,
      remoteDeliveryAmt,
      totalAdditionalDiscountAmt,
      totalImmediateDiscountAmt,
    },
  } = useOrderSheetStateContext();
  const totalDiscountAmt = useMemo(
    () => productCouponAmt + cartCouponAmt + totalAdditionalDiscountAmt + totalImmediateDiscountAmt,
    [productCouponAmt, cartCouponAmt, totalAdditionalDiscountAmt, totalImmediateDiscountAmt]
  );
  const totalDeliveryAmt = useMemo(() => deliveryAmt + remoteDeliveryAmt, [deliveryAmt, remoteDeliveryAmt]);

  const finalAmount = useMemo(
    () => ({
      name: '총 결제 금액',
      amountLabel: convertToKoreanCurrency(paymentAmt),
    }),
    [paymentAmt]
  );

  const details = useMemo(
    () => [
      {
        name: '총 상품 금액',
        amountLabel: convertToKoreanCurrency(totalStandardAmt),
      },
      {
        name: '총 할인 금액',
        amountLabel: `- ${convertToKoreanCurrency(totalDiscountAmt)}`,
      },
      {
        name: '적립금 사용 금액',
        amountLabel: `- ${convertToKoreanCurrency(usedAccumulationAmt)}`,
      },
      {
        name: '배송비',
        amountLabel: `+ ${convertToKoreanCurrency(totalDeliveryAmt)}`,
      },
    ],
    [totalStandardAmt, totalDiscountAmt, usedAccumulationAmt, totalDeliveryAmt]
  );

  const numberOfCOD = useMemo(
    () =>
      orderSheet?.deliveryGroups.reduce(
        (acc, { deliveryPayType }) => (deliveryPayType === 'PAY_ON_DELIVERY' ? acc + 1 : acc),
        0
      ) ?? 0,
    [orderSheet]
  );

  return (
    <section className="l-panel order-sheet__payment-info">
      <PriceTag finalAmount={finalAmount} details={details} isUpsideDown={true}>
        {numberOfCOD !== 0 && (
          <dl className="order-sheet__number-of-COD">
            <dt>- 착불 배송</dt>
            <dd>{numberOfCOD} 건</dd>
          </dl>
        )}
      </PriceTag>
    </section>
  );
};

export default PaymentInfo;
