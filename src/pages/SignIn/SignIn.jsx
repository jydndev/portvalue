import React, { useEffect } from 'react';

import { useTranslation } from 'react-i18next';

import { SignInProvider, OpenIdSignInProvider, CustomTermsProvider } from '@shopby/react-components';
import { CUSTOM_TERMS_CATEGORY_TYPE } from '@shopby/shop-sdk';

import useLayoutChanger from '../../hooks/useLayoutChanger';

import SignInForm from './SignInForm';

const SignIn = () => {
  const { t } = useTranslation('title');

  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    scrollToTop();
  }, []);

  useLayoutChanger({
    hasBackBtnOnHeader: true,
    // title: t('signIn'),
  });

  return (
    <SignInProvider>
      <CustomTermsProvider customCategoryType={CUSTOM_TERMS_CATEGORY_TYPE.MEMBER}>
        <OpenIdSignInProvider>
          <SignInForm />
        </OpenIdSignInProvider>
      </CustomTermsProvider>
    </SignInProvider>
  );
};

export default SignIn;

SignIn.propTypes = {};
