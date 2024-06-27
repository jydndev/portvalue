import { useCartStateContext } from '@shopby/react-components';
import { convertToKoreanCurrency } from '@shopby/shared';

import PriceTag from '../../components/PriceTag';

const CartPriceTag = () => {
  const { paymentInfo } = useCartStateContext();

  const paymentDetails = [
    {
      name: '총 상품 금액',
      amountLabel: convertToKoreanCurrency(paymentInfo.standardAmt),
    },
    {
      name: '총 할인 금액',
      amountLabel: `- ${convertToKoreanCurrency(paymentInfo.discountAmt)}`,
    },
    {
      name: '배송비',
      amountLabel: `+ ${convertToKoreanCurrency(paymentInfo.totalPrePaidDeliveryAmt)}`,
    },
  ];

  return (
    <>
      <PriceTag
        finalAmount={{
          name: '총 결제 금액',
          amountLabel: convertToKoreanCurrency(paymentInfo.totalAmt),
        }}
        details={paymentDetails}
      >
        <span className="cart__mileage">
          예상 적립 포인트&nbsp;<em>{convertToKoreanCurrency(paymentInfo.accumulationAmtWhenBuyConfirm)}</em>&nbsp;
        </span>
      </PriceTag>
    </>
  );
};

export default CartPriceTag;
