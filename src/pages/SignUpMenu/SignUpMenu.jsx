import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';

import { OpenIdSignInProvider, useMallStateContext, CustomTermsProvider } from '@shopby/react-components';
import { CUSTOM_TERMS_CATEGORY_TYPE } from '@shopby/shop-sdk';

import OpenIdSignIn from '../../components/OpenIdSignIn';
import useLayoutChanger from '../../hooks/useLayoutChanger';

const SignUpMenu = () => {
  const { state } = useLocation();
  const { t } = useTranslation('title');
  useLayoutChanger({
    hasBackBtnOnHeader: true,
    title: t('signUp'),
  });

  const { openIdJoinConfig } = useMallStateContext();

  return (
    <div className="sign-up-menu">
      <div className="sign-up-menu__link-normal">
        <Link to="/sign-up/form" state={{ ...state }}>
          쇼핑몰 회원가입
        </Link>
      </div>
      {openIdJoinConfig.providers && (
        <div className="sign-up-menu__link-open-id">
          <CustomTermsProvider customCategoryType={CUSTOM_TERMS_CATEGORY_TYPE.MEMBER}>
            <OpenIdSignInProvider>
              <OpenIdSignIn label="회원가입" providers={openIdJoinConfig.providers} state={{ ...state }} />
            </OpenIdSignInProvider>
          </CustomTermsProvider>
        </div>
      )}
    </div>
  );
};

export default SignUpMenu;

SignUpMenu.propTypes = {};
