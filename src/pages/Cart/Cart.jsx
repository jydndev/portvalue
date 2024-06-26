import { useEffect, useMemo, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { useNavigate } from 'react-router-dom';

import {
  Button,
  CartProvider,
  NaverPayProvider,
  OrderSheetProvider,
  useCartActionContext,
  useCartStateContext,
  useMallStateContext,
  useNaverPayActionContext,
  useOrderSheetActionContext,
  usePageScriptsActionContext,
} from '@shopby/react-components';

import { useErrorBoundaryActionContext } from '../../components/ErrorBoundary';
import useLayoutChanger from '../../hooks/useLayoutChanger';

import CartPriceTag from './CartPriceTag';
import CartTopSelectManager from './CartTopSelectManager';
import DeliverySection from './DeliverySection';
import FixedOrderBtn from './FixedOrderBtn';

const CartContent = () => {
  const navigate = useNavigate();
  const { fetchCartDetail } = useCartActionContext();
  const { applyPageScripts } = usePageScriptsActionContext();
  const { checkedProducts, checkedCartNos, cartDetail, checkingStatusPerCartNo } = useCartStateContext();
  const { showNaverPayButton, prepareNaverPay, checkUsesNaverPayOrder } = useNaverPayActionContext();
  const { makeOrderSheet } = useOrderSheetActionContext();
  const { catchError } = useErrorBoundaryActionContext();

  const [usesNaverPayOrder, setUsesNaverPayOrder] = useState(false);
  const allCartNosLength = useMemo(() => Object.keys(checkingStatusPerCartNo).length, [checkingStatusPerCartNo]);

  useLayoutChanger({
    hasBackBtnOnHeader: true,
    title: '장바구니',
  });

  useEffect(() => {
    fetchCartDetail();
  }, []);

  useEffect(() => {
    if (cartDetail) {
      applyPageScripts('CART', { cart: cartDetail });
    }
  }, [cartDetail]);

  const handleOrderBtnClick = async () => {
    try {
      const {
        data: { orderSheetNo },
      } = await makeOrderSheet({
        cartNos: checkedCartNos,
        products: checkedProducts,
      });

      navigate(`/order/${orderSheetNo}`, {
        state: {
          orderSheetNo,
        },
      });
    } catch (e) {
      catchError(e);
    }
  };

  useEffect(() => {
    (async () => {
      const usesNaverPayOrder = await checkUsesNaverPayOrder();
      setUsesNaverPayOrder(usesNaverPayOrder);
    })();
  }, []);

  useEffect(() => {
    if (allCartNosLength > 0 && usesNaverPayOrder) {
      showNaverPayButton({
        containerElementId: 'naver-pay',
        isCartPage: true,
        redirectUrlAfterBuying: location.href, // backUrl
        redirectUrlAfterWishing: location.href, // backUrl
      });
    }
  }, [allCartNosLength, usesNaverPayOrder]);

  useEffect(() => {
    if (!checkedProducts) return;

    const items = checkedProducts.map(({ productNo, optionNo, orderCnt, optionInputs, channelType }) => ({
      productNo,
      optionNo,
      orderCnt,
      optionInputs,
      channelType: channelType ?? '',
    }));

    prepareNaverPay({ items });
  }, [checkedProducts]);

  return (
    <div className="cart">
      <CartTopSelectManager />
      <DeliverySection />
      <div className='divider'/>
      <section className="l-panel cart__payment-info">
        <CartPriceTag />
        <Button className="cart__order-btn" label="주문하기" onClick={handleOrderBtnClick} />
        <div className="cart__naver-pay-btn" id="naver-pay" />
      </section>
      <FixedOrderBtn onOrderBtnClick={handleOrderBtnClick} />
    </div>
  );
};

const Cart = () => {
  const { clientId, mallProfile } = useMallStateContext();
  const { cartConfig } = useMallStateContext();

  const { delayPageScriptLoading } = usePageScriptsActionContext();

  useEffect(() => {
    delayPageScriptLoading();
  }, []);

  return (
    <OrderSheetProvider>
      <NaverPayProvider clientId={clientId} mallProfile={mallProfile} platform={isMobile ? 'MOBILE_WEB' : 'PC'}>
        <CartProvider
          dividesInvalidProducts={true}
          guestCartOption={{
            storagePeriodByDays: cartConfig?.storagePeriod,
            storageMaxQuantity: cartConfig?.storageMaxQuantity,
          }}
        >
          <CartContent />
        </CartProvider>
      </NaverPayProvider>
    </OrderSheetProvider>
  );
};

export default Cart;
