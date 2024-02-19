import { SignInProvider, OpenIdSignInProvider, CustomTermsProvider } from '@shopby/react-components';
import { CUSTOM_TERMS_CATEGORY_TYPE } from '@shopby/shop-sdk';

import OpenIdCallbackForm from './OpenIdCallbackForm';

const OpenIdCallback = () => (
  <SignInProvider>
    <CustomTermsProvider customCategoryType={CUSTOM_TERMS_CATEGORY_TYPE.MEMBER}>
      <OpenIdSignInProvider>
        <OpenIdCallbackForm />
      </OpenIdSignInProvider>
    </CustomTermsProvider>
  </SignInProvider>
);

export default OpenIdCallback;
