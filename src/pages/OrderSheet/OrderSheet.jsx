import { createRef, useEffect, useMemo } from 'react';
import { isMobile } from 'react-device-detect';
import { useTranslation } from 'react-i18next';
import { useParams, useLocation } from 'react-router-dom';

import {
  Button,
  MyPayProvider,
  MyShippingAddressProvider,
  OrderSheetProvider,
  useAuthStateContext,
  useMyShippingAddressActionContext,
  useMyShippingAddressStateContext,
  useOrderSheetActionContext,
  useOrderSheetStateContext,
  DEFAULT_ORDER_SHEET_PROVIDER_STATE,
  usePageScriptsActionContext,
  useMallStateContext,
  useModalActionContext,
} from '@shopby/react-components';
import { getPlatformByMobile, isSignedIn, parsePhoneNumber } from '@shopby/shared';

import { useErrorBoundaryActionContext } from '../../components/ErrorBoundary';
import { EXTERNAL_CUSTOM_ORDER_SHEET_TERMS } from '../../constants';
import useLayoutChanger from '../../hooks/useLayoutChanger';
import { convertBooleanToYorN } from '../../utils';

import OrdererInfoForm from './OrdererInfoForm';
import OrderProductTable from './OrderProductTable';
import PaymentInfo from './PaymentInfo';
import PayMethodSelector from './PayMethodSelector';
import PromotionController from './PromotionController';
import ShippingAddressInfoForm from './ShippingAddressInfoForm';
import TermsChecker from './TermsChecker';
import useValidateFormMaker from './useValidateFormMaker';

const OrderSheetContent = () => {
  const { state } = useLocation();
  const orderSheetRef = {
    ordererInfoFormRef: {
      ordererNameInputRef: createRef(),
      emailInputRef: createRef(),
      phoneNumberInputRef: createRef(),
      passwordInputRef: createRef(),
      passwordForConfirmationInputRef: createRef(),
    },
    shippingAddressInfoFormRef: {
      receiverNameInputRef: createRef(),
      addressFormRef: createRef(),
      mobilePhoneNumberInputRef: createRef(),
      addressDetailInputRef: createRef(),
    },
    depositBankFormRef: {
      bankAccountSelectRef: createRef(),
      remitterNameInputRef: createRef(),
    },
    termsCheckerRef: createRef(),
  };
  const { orderSheetNo } = useParams();
  const { t } = useTranslation('title');
  const { profile } = useAuthStateContext();
  const { order, fetchOrderSheet, updateOrdererInfo, updateShippingAddressInfo, resetShippingAddressInfo } =
    useOrderSheetActionContext();
  const { catchError } = useErrorBoundaryActionContext();
  const {
    ordererInfo,
    shippingAddressInfo,
    termsStatus,
    orderSheet,
    needsDepositBankForm,
    bankAccountToDeposit,
    remitterName,
    selectedPayMethod,
    myPayInfo,
    accumulationInputValue,
    selectedCoupon,
    blockUseAccumulationWhenUseCoupon,
    paymentInfo: { minAccumulationLimit },
  } = useOrderSheetStateContext();
  const { applyPageScripts } = usePageScriptsActionContext();
  const { fetchMyShippingAddress } = useMyShippingAddressActionContext();
  const { defaultAddress } = useMyShippingAddressStateContext();
  const { validateForm } = useValidateFormMaker(orderSheetRef);
  const { openAlert } = useModalActionContext();
  const {
    accumulationConfig: { accumulationName },
  } = useMallStateContext();

  const hasDeliverableProduct = useMemo(
    () =>
      orderSheet?.deliveryGroups
        ?.map(({ orderProducts }) => orderProducts.some(({ deliverable }) => deliverable))
        .some((deliverable) => deliverable),
    [orderSheet]
  );

  useLayoutChanger({ hasBackBtnOnHeader: true, title: t('orderSheet') });

  useEffect(() => {
    fetchOrderSheet({ orderSheetNo: orderSheetNo ?? state?.orderSheetNo, includesMemberAddress: false });
    if (isSignedIn()) {
      fetchMyShippingAddress();
    }
  }, []);

  useEffect(() => {
    if (!orderSheet) return;

    applyPageScripts('ORDER', { orderSheet });
  }, [orderSheet]);

  useEffect(() => {
    if (!defaultAddress || shippingAddressInfo.zipCode) return;

    resetShippingAddressInfo();
    updateShippingAddressInfo({
      addressNo: defaultAddress.addressNo,
      addressName: defaultAddress.addressName,
      receiverName: defaultAddress.receiverName,
      roadAddress: defaultAddress.receiverAddress,
      mobilePhoneNumber: parsePhoneNumber(defaultAddress.receiverContact1),
      addressDetail: defaultAddress.receiverDetailAddress,
      zipCode: defaultAddress.receiverZipCd,
      countryCd: defaultAddress.countryCd,
    });

    if (defaultAddress.receiverContact2) {
      updateShippingAddressInfo({
        phoneNumber: parsePhoneNumber(defaultAddress.receiverContact2),
      });
    }
  }, [defaultAddress]);

  useEffect(() => {
    if (!profile) return;

    const { memberName, email, mobileNo } = profile;
    const [emailId = '', emailDomain = ''] = email?.split('@') ?? [];

    updateOrdererInfo({
      ordererName: memberName,
      emailId,
      emailDomain,
      phoneNumber: mobileNo
        ? parsePhoneNumber(mobileNo, { isWithDash: false })
        : DEFAULT_ORDER_SHEET_PROVIDER_STATE.ordererInfo.phoneNumber,
    });
  }, [profile]);

  const handleOrderBtnClick = () => {
    const isValid = validateForm({
      ordererInfo,
      shippingAddressInfo,
      accumulationInputValue,
      selectedCoupon,
      needsShippingAddressInfo: hasDeliverableProduct,
      termsStatus,
      needsDepositBankForm,
      bankAccountToDeposit,
      remitterName,
      selectedPayMethod,
      myPayInfo,
      blockUseAccumulationWhenUseCoupon,
    });
    if (!isValid) return;

    try {
      const { customTermsAgrees, agreementTermsAgrees } = orderSheetRef.termsCheckerRef.current;

      const isAccumulationInputValueLessThanMin =
        accumulationInputValue && accumulationInputValue < minAccumulationLimit;

      if (isAccumulationInputValueLessThanMin) {
        openAlert({ message: `최소 사용 가능 ${accumulationName} 은(는) ${minAccumulationLimit} 입니다.` });

        return;
      }

      order({
        platform: isMobile ? 'MOBILE_WEB' : 'PC',
        confirmUrl: `${location.origin}/order/confirm?deliverable=${convertBooleanToYorN(hasDeliverableProduct)}`,
        customTermsAgrees,
        agreementTermsAgrees,
      });
    } catch (e) {
      catchError(e);
    }
  };

  return (
    <div className="order-sheet">
      <OrdererInfoForm refs={orderSheetRef.ordererInfoFormRef} />
      {hasDeliverableProduct && <ShippingAddressInfoForm refs={orderSheetRef.shippingAddressInfoFormRef} />}
      <OrderProductTable />
      <PromotionController />
      <PaymentInfo />
      <PayMethodSelector refs={orderSheetRef.depositBankFormRef} />
      <TermsChecker ref={orderSheetRef.termsCheckerRef} />
      <Button className="order-sheet__pay-btn" label={'결제 하기'} onClick={handleOrderBtnClick} />
    </div>
  );
};

const OrderSheet = () => {
  const { clientId, mallProfile } = useMallStateContext();
  const { delayPageScriptLoading } = usePageScriptsActionContext();

  useEffect(() => {
    delayPageScriptLoading();
  }, []);

  return (
    <OrderSheetProvider clientId={clientId} mallProfile={mallProfile} customTerms={EXTERNAL_CUSTOM_ORDER_SHEET_TERMS}>
      <MyShippingAddressProvider>
        <MyPayProvider clientId={clientId} mallProfile={mallProfile} platform={getPlatformByMobile(isMobile)}>
          <OrderSheetContent />
        </MyPayProvider>
      </MyShippingAddressProvider>
    </OrderSheetProvider>
  );
};

export default OrderSheet;

OrderSheet.propTypes = {};
