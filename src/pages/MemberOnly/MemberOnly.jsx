import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { SignInProvider, OpenIdSignInProvider, CustomTermsProvider } from '@shopby/react-components';
import { CUSTOM_TERMS_CATEGORY_TYPE, isSignedIn } from '@shopby/shared';

import SignInForm from '../SignIn/SignInForm';

const MemberOnly = () => {
  const location = useLocation();

  const handleSignIn = () => {
    window.location.replace(location.state?.from ?? '/', {
      replace: true,
      state: {
        ...location.state,
      },
    });
  };

  useEffect(() => {
    isSignedIn() && handleSignIn();
  }, [isSignedIn]);

  return (
    <div className="member-only">
      <p className="member-only__text">
        회원 전용으로 운영되는 쇼핑몰입니다.
        <br />
        로그인/회원가입 후 이용이 가능합니다.
      </p>

      <SignInProvider>
        <CustomTermsProvider customCategoryType={CUSTOM_TERMS_CATEGORY_TYPE.MEMBER}>
          <OpenIdSignInProvider>
            <SignInForm usesOnlySignIn={true} onSignIn={handleSignIn} />
          </OpenIdSignInProvider>
        </CustomTermsProvider>
      </SignInProvider>
    </div>
  );
};

export default MemberOnly;
