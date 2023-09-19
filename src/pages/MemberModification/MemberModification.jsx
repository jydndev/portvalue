import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  MemberModificationProvider,
  IdentificationVerificationProvider,
  AgeVerificationProvider,
  CheckMemberPasswordProvider,
  useAuthStateContext,
  VisibleComponent,
  OpenIdSignInProvider,
  CustomTermsProvider,
} from '@shopby/react-components';
import { CUSTOM_TERMS_CATEGORY_TYPE } from '@shopby/shop-sdk';

import CheckMemberPassword from '../../components/CheckMemberPassword';
import FullModal from '../../components/FullModal';
import useLayoutChanger from '../../hooks/useLayoutChanger';
import CheckOpenIdMember from '../MemberWithdrawal/CheckOpenIdMember';

import MemberModificationForm from './MemberModificationForm';

const MemberModification = () => {
  const { profile } = useAuthStateContext();
  const { t } = useTranslation('title');
  useLayoutChanger({
    hasBackBtnOnHeader: true,
    title: t('memberModification'),
  });
  const [isPasswordCheckModalOpen, setIsPasswordCheckModalOpen] = useState(true);

  const onAuthenticationBtnClick = () => {
    setIsPasswordCheckModalOpen(false);
  };

  return (
    <MemberModificationProvider>
      <CustomTermsProvider customCategoryType={CUSTOM_TERMS_CATEGORY_TYPE.MEMBER}>
        <OpenIdSignInProvider>
          <IdentificationVerificationProvider>
            <AgeVerificationProvider>
              <CheckMemberPasswordProvider>
                {isPasswordCheckModalOpen && (
                  <FullModal
                    title={t('memberModification')}
                    onClose={() => {
                      location.href = 'my-page';
                    }}
                  >
                    <VisibleComponent
                      shows={profile?.memberType === 'MALL'}
                      TruthyComponent={<CheckMemberPassword onAuthenticationBtnClick={onAuthenticationBtnClick} />}
                      FalsyComponent={<CheckOpenIdMember onAuthenticationBtnClick={onAuthenticationBtnClick} />}
                    />
                  </FullModal>
                )}
                <MemberModificationForm />
              </CheckMemberPasswordProvider>
            </AgeVerificationProvider>
          </IdentificationVerificationProvider>
        </OpenIdSignInProvider>
      </CustomTermsProvider>
    </MemberModificationProvider>
  );
};

export default MemberModification;

MemberModification.propTypes = {};
