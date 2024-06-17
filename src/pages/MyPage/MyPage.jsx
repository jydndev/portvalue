import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import {
  Button,
  CouponProvider,
  IconBtn,
  ProfileAccumulationProvider,
  ProfileLikeProvider,
  useAuthActionContext,
  useAuthStateContext,
  useCouponActionContext,
  useCouponStateContext,
  useProfileAccumulationActionContext,
  useProfileAccumulationStateContext,
  useProfileLikeActionContext,
  useProfileLikeStateContext,
  useMallStateContext,
  useBoardConfigurationContextState,
  IconSVG,
  VisibleComponent,
  ProfileGradeProvider,
  useProfileGradeActionContext,
  usePageScriptsActionContext,
  useInquiryActionContext,
  useProfileProductInquiryActionContext,
  useProfileProductReviewActionContext,
  InquiryProvider,
  ProfileProductInquiryProvider,
  ProfileProductReviewProvider,
  useMyOrderActionContext,
  MyOrderProvider,
} from '@shopby/react-components';
import { convertToKoreanCurrency, getDateLabel } from '@shopby/shared';

import TitleModal from '../../components/TitleModal';
import useLayoutChanger from '../../hooks/useLayoutChanger';
import { lastHalfYear } from '../../utils/date';

import MyGrade from './MyGrade';

const today = getDateLabel();

const MyPageSummary = () => {
  const { fetchProfileCouponSummary } = useCouponActionContext();
  const { fetchProfileLikeProductCount } = useProfileLikeActionContext();
  const { fetchAccumulationSummary } = useProfileAccumulationActionContext();
  const { fetchInquiries } = useInquiryActionContext();
  const { fetchProfileProductInquiries } = useProfileProductInquiryActionContext();
  const { fetchProfileReviewableProducts, fetchProfileReviewedProducts } = useProfileProductReviewActionContext();
  const { applyPageScripts } = usePageScriptsActionContext();
  const { fetchProfileOrdersSummaryStatus } = useMyOrderActionContext();

  const {
    profileCouponSummary: { usableCouponCnt },
  } = useCouponStateContext();
  const { likedCount } = useProfileLikeStateContext();
  const { profileAccumulationSummary } = useProfileAccumulationStateContext();
  const {
    accumulationConfig: { accumulationName },
  } = useMallStateContext();

  const handleGlobalsVariableMyPage = async () => {
    const response = await Promise.all([
      fetchInquiries({
        hasTotalCount: true,
        inquiryStatuses: ['ISSUED', 'IN_PROGRESS'],
        startYmd: '2020-01-01',
      }),
      fetchInquiries({
        hasTotalCount: true,
        inquiryStatuses: ['ANSWERED'],
        startYmd: '2020-01-01',
      }),
      fetchProfileProductInquiries({
        hasAnswers: false,
        hasTotalCount: true,
        startYmd: '2020-01-01',
      }),
      fetchProfileProductInquiries({
        hasAnswers: true,
        hasTotalCount: true,
        startYmd: '2020-01-01',
      }),
      fetchProfileReviewableProducts({
        hasTotalCount: true,
        startDate: '2020-01-01',
      }),
      fetchProfileReviewedProducts({
        hasTotalCount: true,
        startYmd: '2020-01-01',
      }),
      fetchProfileOrdersSummaryStatus({
        startYmd: lastHalfYear,
        endYmd: today,
      }),
    ]);

    const [
      progressInquiry,
      answeredInquiry,
      progressProductInquiry,
      answeredProductInquiry,
      possibleProductReview,
      myProductReview,
      orderSummary,
    ] = response.map(({ data }) => data);

    applyPageScripts('PROFILE_INQUIRIES_PROGRESS', { profileInquiriesProgress: progressInquiry });
    applyPageScripts('PROFILE_INQUIRIES_ANSWERED', { profileInquiriesAnswered: answeredInquiry });
    applyPageScripts('PROFILE_PRODUCT_INQUIRIES_PROGRESS', { profileProductInquiriesProgress: progressProductInquiry });
    applyPageScripts('PROFILE_PRODUCT_INQUIRIES_ANSWERED', { profileProductInquiresAnswered: answeredProductInquiry });
    applyPageScripts('PROFILE_PRODUCT_REVIEWABLE', { profileProductReviewable: possibleProductReview });
    applyPageScripts('PROFILE_PRODUCT_REVIEWED', { profileProductReviewed: myProductReview });
    applyPageScripts('PROFILE_ORDERS_SUMMARY_STATUS', { profileOrdersSummaryStatus: orderSummary });
  };

  useEffect(() => {
    fetchProfileCouponSummary();
    fetchProfileLikeProductCount();
    fetchAccumulationSummary();
    handleGlobalsVariableMyPage();
  }, []);

  return (
    <div className="my-coupon-data">
      <Link className="my-coupon-data__link" to="/my-page/coupon">
        보유쿠폰
        <em className="my-coupon-data__num">{usableCouponCnt}</em>
      </Link>
      <Link className="my-coupon-data__link" to="/my-page/accumulation">
        {accumulationName}
        <em className="my-coupon-data__num">
          {convertToKoreanCurrency(profileAccumulationSummary?.totalAvailableAmt ?? 0)}
        </em>
      </Link>
      <Link className="my-coupon-data__link" to="/my-page/like">
        좋아요
        <em className="my-coupon-data__num">{likedCount}</em>
      </Link>
    </div>
  );
};

const MemberInformation = () => {
  const { fetchProfileGrade } = useProfileGradeActionContext();

  const { profile } = useAuthStateContext();

  const [isOpen, setIsOpen] = useState(false);

  const memberTypeLabel = useMemo(() => {
    if (profile.memberType === 'MALL' || profile.providerType.includes('NCPSTORE')) return '쇼핑몰';

    return profile.providerType;
  }, [profile.memberType, profile.providerType]);

  useEffect(() => {
    fetchProfileGrade();
  }, []);

  return (
    <article className="my-info">
      <div className="my-info__summary">
        <p className="my-info__greeting">
          {profile.memberName ?? profile.memberId} 님은
          <br />
          {profile?.memberGradeName} 입니다.
        </p>
        <Button className="my-info__member-benefit" onClick={() => setIsOpen(true)}>
          <span className="my-info__member-benefit-label">나의혜택</span>
          <span className="my-info__member-benefit-icon">
            <IconSVG name="angle-r" fill="transparent" stroke="gray" strokeWidth={6} />
          </span>
        </Button>
      </div>
      <span className="my-info__member-type">{memberTypeLabel} 아이디 회원</span>
      <VisibleComponent
        shows={isOpen}
        TruthyComponent={
          <TitleModal className="my-info__benefit" title="등급혜택 안내" onClose={() => setIsOpen(false)}>
            <MyGrade />
          </TitleModal>
        }
      />
    </article>
  );
};

const MyPage = () => {
  const { t } = useTranslation('title');
  const { signOut } = useAuthActionContext();
  const { profile } = useAuthStateContext();
  const { boardConfig } = useBoardConfigurationContextState();
  const { applyPageScripts } = usePageScriptsActionContext();

  useLayoutChanger({
    title: t('myPage'),
    hasBackBtnOnHeader: true,
    hasCartBtnOnHeader: true,
    hasHomeBtnOnHeader: true,
    hasBottomNav: true,
  });

  const logoutBtnClick = async () => {
    await signOut();
    location.href = '/';
  };

  useEffect(() => {
    applyPageScripts('MY_PAGE', { profile });
  }, [profile]);

  if (!profile) return <></>;

  return (
    <>
      <ProfileGradeProvider>
        <MemberInformation />
      </ProfileGradeProvider>
      <CouponProvider>
        <ProfileLikeProvider>
          <ProfileAccumulationProvider>
            <InquiryProvider>
              <ProfileProductInquiryProvider>
                <ProfileProductReviewProvider>
                  <MyOrderProvider willOrdersBeAccumulated={true}>
                    <MyPageSummary />
                  </MyOrderProvider>
                </ProfileProductReviewProvider>
              </ProfileProductInquiryProvider>
            </InquiryProvider>
          </ProfileAccumulationProvider>
        </ProfileLikeProvider>
      </CouponProvider>
      <div className="my-orders">
        <Link className="my-orders__link" to="/orders">
          주문/배송 조회
        </Link>
        <Link className="my-orders__link" to="/claims">
          클레임 내역
        </Link>
      </div>

      <div className="l-panel">
        <VisibleComponent
          shows={boardConfig.productReviewConfig?.name}
          TruthyComponent={
            <Link className="my-link" to="/my-page/product-review">
              {boardConfig.productReviewConfig?.name ?? '상품후기'}
              <IconBtn className="my-link__ico" iconType="angle-down" />
            </Link>
          }
        />

        <VisibleComponent
          shows={boardConfig.productInquiryConfig?.name}
          TruthyComponent={
            <Link className="my-link" to="/my-page/product-inquiry">
              {boardConfig.productInquiryConfig?.name ?? '상품문의'}
              <IconBtn className="my-link__ico" iconType="angle-down" />
            </Link>
          }
        />
        <VisibleComponent
          shows={boardConfig.inquiryConfig?.name}
          TruthyComponent={
            <Link className="my-link" to="/my-page/personal-inquiry">
              {boardConfig.inquiryConfig?.name ?? '1:1문의'}
              <IconBtn className="my-link__ico" iconType="angle-down" />
            </Link>
          }
        />
        <Link className="my-link" to="/member-modification">
          회원정보 수정
          <IconBtn className="my-link__ico" iconType="angle-down" />
        </Link>
        <Link className="my-link" to="/my-page/shipping-address">
          배송지 관리
          <IconBtn className="my-link__ico" iconType="angle-down" />
        </Link>
      </div>

      <div className="my-membership">
        <Button className="my-membership__btn" label="로그아웃" onClick={logoutBtnClick} />
        <Link className="my-membership__btn btn" to="/member-withdrawal">
          회원 탈퇴
        </Link>
      </div>
    </>
  );
};

export default MyPage;
