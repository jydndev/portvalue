import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  SignUpProvider,
  IdentificationVerificationProvider,
  AgeVerificationProvider,
  CustomTermsProvider,
} from '@shopby/react-components';
import { CUSTOM_TERMS_CATEGORY_TYPE } from '@shopby/shop-sdk';

import useLayoutChanger from '../../hooks/useLayoutChanger';

import SignUpButton from './SignUpButton';
import SignUpForm from './SignUpForm';
import TermsForm from './TermsForm';
import TermsModal from './TermsModal';

const SignUp = () => {
  const { t } = useTranslation('title');
  useLayoutChanger({
    hasBackBtnOnHeader: true,
    title: t('signUp'),
  });

  const refs = {
    emailRef: useRef(),
    mobilePhoneNumberInputRef: useRef(),
  };

  const [isTermsFullModalOpen, setIsTermsFullModalOpen] = useState(false);

  return (
    <SignUpProvider>
      <AgeVerificationProvider>
        <IdentificationVerificationProvider>
          <CustomTermsProvider customCategoryType={CUSTOM_TERMS_CATEGORY_TYPE.MEMBER}>
            <div className="sign-up-form">
              <SignUpForm refs={refs} />
              <TermsForm setIsTermsFullModalOpen={() => setIsTermsFullModalOpen(true)} />
              <SignUpButton refs={refs} />
            </div>
          </CustomTermsProvider>
          {isTermsFullModalOpen && <TermsModal onClose={() => setIsTermsFullModalOpen(false)} />}
        </IdentificationVerificationProvider>
      </AgeVerificationProvider>
    </SignUpProvider>
  );
};

export default SignUp;
