import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams, useLocation } from 'react-router-dom';

import { bool, func } from 'prop-types';

import {
  SignInButton,
  useSignInActionContext,
  useSignInValueContext,
  TextField,
  Button,
  VisibleComponent,
  useMallStateContext,
  useModalActionContext,
  useAuthActionContext,
  CheckMemberPasswordProvider,
} from '@shopby/react-components';

import { useErrorBoundaryActionContext } from '../../components/ErrorBoundary';
import FullModal from '../../components/FullModal';
import OpenIdSignIn from '../../components/OpenIdSignIn';
import PasswordChanger from '../../components/PasswordChanger';

const SignInForm = ({ usesOnlySignIn = false, onSignIn }) => {
  const { state } = useLocation();

  const { t } = useTranslation('auth');
  const {
    updateSignInInfo,
    updateGuestOrderInfo,
    signIn,
    updateHasGuestOrderSheetUrl,
    searchGuestOrders,
    reactivateDormantAccount,
  } = useSignInActionContext();
  const { signOut } = useAuthActionContext();
  const { openConfirm, openAlert } = useModalActionContext();
  const { catchError } = useErrorBoundaryActionContext();
  const {
    signInInfo: { memberId, password },
    guestOrderInfo: { orderNo, orderPassword },
    hasGuestOrderSheetUrl,
    isSignedIn,
    dormantMemberResponse,
    daysFromLastPasswordChange,
    // TODO: 스킨에서 비밀번호 변경 및 휴면회원 페이지 이동전에 안내 할것인지 확인 필요
  } = useSignInValueContext();
  const { openIdJoinConfig, mallName } = useMallStateContext();

  const [isOpen, setIsOpen] = useState(false);

  const handleMemberIdChange = ({ currentTarget: { value } }) => {
    updateSignInInfo({ memberId: value });
  };

  const handlePasswordChange = ({ currentTarget: { value } }) => {
    updateSignInInfo({ password: value });
  };

  const handlePasswordKeyDown = (e) => {
    if (e.key === 'Enter') {
      signIn({ memberId, password });
    }
  };

  const handleOrderNoChange = ({ currentTarget: { value } }) => {
    updateGuestOrderInfo({ orderNo: value });
  };

  const handleOrderPasswordChange = ({ currentTarget: { value } }) => {
    updateGuestOrderInfo({ orderPassword: value });
  };

  const handleOrderPasswordKeyDown = async (e) => {
    try {
      if (e.key === 'Enter') {
        await searchGuestOrders({ orderNo, password: orderPassword, orderRequestType: 'ALL' });
        location.href = `/orders/${orderNo}`;
      }
    } catch (e) {
      catchError(e);
    }
  };

  const handleSearchGuestOrdersBtnClick = async () => {
    try {
      await searchGuestOrders({ orderNo, password: orderPassword, orderRequestType: 'ALL' });
      location.href = `/orders/${orderNo}`;
    } catch (e) {
      catchError(e);
    }
  };

  const [params] = useSearchParams();
  const orderSheetNo = params.get('orderSheetNo') ?? state?.orderSheetNo;

  useEffect(() => {
    if (orderSheetNo) {
      updateHasGuestOrderSheetUrl(true);
    }
  }, [orderSheetNo]);

  const locationPage = () => {
    location.state = {
      from: `${location.pathname}${location.search}`,
      to: state?.to,
    };

    if (onSignIn) {
      onSignIn();
    } else if (orderSheetNo) {
      location.href = `/order/${orderSheetNo}`;
    } else {
      const _state = {
        ...location.state,
        ...state,
      };
      const from = _state?.from?.includes('sign-in') ? '/' : _state?.from;

      location.replace(from ?? '/');
    }
  };

  const reactivate = async () => {
    try {
      await reactivateDormantAccount({ authType: 'NONE' });

      openAlert({
        message: '휴면해제 되었습니다.',
        onClose: locationPage,
      });
    } catch (e) {
      catchError(e);
    }
  };

  const passwordHandler = () => {
    if (daysFromLastPasswordChange > 90) {
      setIsOpen(true);
    } else {
      locationPage();
    }
  };

  const dormantMemberHandler = () => {
    const isDormantMember =
      dormantMemberResponse?.memberName || dormantMemberResponse?.mobileNo || dormantMemberResponse?.email;

    if (!isDormantMember) {
      passwordHandler();

      return;
    }

    openConfirm({
      message: (
        <>
          장기 미접속으로 인해 휴면회원 전환 상태입니다. <br />
          휴면해제 하시겠습니까?
        </>
      ),
      confirmLabel: '확인',
      onConfirm: () => reactivate(),
      onCancel: async () => {
        try {
          await signOut();

          window.location.href = '/';
        } catch (e) {
          catchError(e);
        }
      },
    });
  };

  const closePasswordChangerModal = () => {
    setIsOpen(false);
    locationPage();
  };

  useEffect(() => {
    if (!isSignedIn) return;

    dormantMemberHandler();
  }, [isSignedIn]);

  return (
    <>
      <section className="sign-in">
        <p className="sign-in__logo">
          <img
            src="https://dansungbee.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fdsb_logo_black.5d98e63b.png&w=256&q=75"
            alt="단성비 로고"
          ></img>
        </p>
        <p className="sign-in__image">
          <img
            src="https://dansungbee.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fsign_in_danbeeall.b67f777d.png&w=2048&q=75"
            alt="단성비 회원가입"
          ></img>
        </p>
        <p className="sign-in__title">
          <span>
            {' '}
            지금 단성비와 함께<br></br>단백질을 골라보세요!{' '}
          </span>
        </p>
        <p className="sign-in__description">
          <span> 영양,가격 비교분석부터 솔직한 후기까지 </span>
        </p>
        {openIdJoinConfig.providers && (
          <div className="sign-in-open-id">
            <OpenIdSignIn
              label="로그인"
              orderSheetNo={orderSheetNo}
              providers={openIdJoinConfig.providers}
              state={{ ...state }}
            />
          </div>
        )}

        <h2 className="a11y">로그인</h2>
        <div className="normal-sign-in">
          <p className="normal-sign-in__title">
            <span>또는</span>
          </p>
          <div className="normal-sign-in__input-wrap">
            <TextField
              name="memberId"
              placeholder="아이디"
              onChange={handleMemberIdChange}
              value={memberId}
              valid="NO_SPACE"
            />
          </div>
          <div className="normal-sign-in__input-wrap">
            <TextField
              name="password"
              placeholder="비밀번호"
              onChange={handlePasswordChange}
              onKeyDown={handlePasswordKeyDown}
              type="password"
              valid="NO_SPACE"
            />
          </div>
          <SignInButton label={t('SIGNIN')} onError={(e) => catchError(e)} />
        </div>

        <div className="sign-in-link">
          <Link className="sign-in-link__item" to="/find-id">
            아이디찾기
          </Link>
          <Link className="sign-in-link__item" to="/find-password">
            비밀번호찾기
          </Link>
          <Link className="sign-in-link__item" to="/sign-up" state={{ ...state }}>
            회원가입
          </Link>
        </div>

        <VisibleComponent
          shows={!usesOnlySignIn}
          TruthyComponent={
            <>
              {hasGuestOrderSheetUrl && (
                <Link className="guest-order-link" to={`/order/${orderSheetNo}`} state={{ ...state, orderSheetNo }}>
                  비회원 주문하기
                </Link>
              )}

              {!hasGuestOrderSheetUrl && (
                <div className="guest-order">
                  <p className="guest-order__title">비회원 주문조회 하기</p>
                  <div className="guest-order__input-wrap">
                    <TextField
                      name="orderNo"
                      placeholder="주문번호 입력"
                      onChange={handleOrderNoChange}
                      value={orderNo}
                    />
                  </div>
                  <div className="guest-order__input-wrap">
                    <TextField
                      name="orderPassword"
                      type="password"
                      placeholder="주문번호 비밀번호 입력"
                      onChange={handleOrderPasswordChange}
                      onKeyDown={handleOrderPasswordKeyDown}
                    />
                  </div>
                  <Button label="조회하기" onClick={handleSearchGuestOrdersBtnClick} />
                </div>
              )}
            </>
          }
        />
      </section>
      <VisibleComponent
        shows={isOpen}
        TruthyComponent={
          <FullModal title="비밀번호 변경">
            <div className="long-term-notice">
              <div className="long-term-notice__content">
                <h3 className="long-term-notice__title">회원님의 비밀번호를 변경해 주세요.</h3>
                <p className="long-term-notice__text">
                  회원님께서는 장기간 비밀번호를 변경하지 않고, 동일한 비밀번호를 사용 중이십니다.
                </p>
                <span className="long-term-notice__description">
                  {mallName}에서는 회원님의 소중한 개인정보를 보호하기 위하여 비밀번호 변경을 안내해드리고 있습니다.
                  <br />
                  정기적인 비밀번호 변경으로 회원님의 개인정보를 보호해 주세요.
                </span>
              </div>
              <CheckMemberPasswordProvider>
                <PasswordChanger
                  useNextChanger={true}
                  onSubmit={closePasswordChangerModal}
                  onNext={closePasswordChangerModal}
                />
              </CheckMemberPasswordProvider>
            </div>
          </FullModal>
        }
      />
    </>
  );
};
export default SignInForm;
SignInForm.propTypes = {
  usesOnlySignIn: bool,
  onSignIn: func,
};
