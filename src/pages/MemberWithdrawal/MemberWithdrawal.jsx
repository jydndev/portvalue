import { useEffect, useState } from 'react';

import {
  CheckMemberPasswordProvider,
  MemberWithdrawalProvider,
  OpenIdSignInProvider,
  useAuthStateContext,
  CustomTermsProvider,
} from '@shopby/react-components';
import { CUSTOM_TERMS_CATEGORY_TYPE } from '@shopby/shop-sdk';

import CheckMemberPassword from '../../components/CheckMemberPassword';
import FullModal from '../../components/FullModal';
import useLayoutChanger from '../../hooks/useLayoutChanger';

import CheckOpenIdMember from './CheckOpenIdMember';
import MemberWithdrawalContent from './MemberWithdrawalContent';

const MemberWithdrawal = () => {
  useLayoutChanger({
    hasBackBtnOnHeader: true,
    hasHomeBtnOnHeader: true,
    hasBottomNav: true,
    title: '회원탈퇴',
  });

  const { profile } = useAuthStateContext();

  const [isCheckPasswordFullModalOpen, setIsCheckPasswordFullModalOpen] = useState(false);
  const [isCheckOpenIdMemberFullModalOpen, setIsCheckOpenIdMemberFullModalOpen] = useState(false);

  useEffect(() => {
    if (profile?.memberType === 'MALL') {
      setIsCheckPasswordFullModalOpen(true);
    } else {
      setIsCheckOpenIdMemberFullModalOpen(true);
    }
  }, [profile]);

  return (
    <MemberWithdrawalProvider>
      <CustomTermsProvider customCategoryType={CUSTOM_TERMS_CATEGORY_TYPE.MEMBER}>
        <CheckMemberPasswordProvider>
          <OpenIdSignInProvider>
            <MemberWithdrawalContent />
            {isCheckPasswordFullModalOpen && (
              <FullModal
                title={'회원탈퇴'}
                onClose={() => {
                  location.href = 'my-page';
                }}
              >
                <CheckMemberPassword
                  onAuthenticationBtnClick={() => {
                    setIsCheckPasswordFullModalOpen(false);
                  }}
                />
              </FullModal>
            )}
            {isCheckOpenIdMemberFullModalOpen && (
              <FullModal
                title={'회원탈퇴'}
                onClose={() => {
                  location.href = 'my-page';
                }}
              >
                <CheckOpenIdMember
                  onAuthenticationBtnClick={() => {
                    setIsCheckOpenIdMemberFullModalOpen(false);
                  }}
                />
              </FullModal>
            )}
          </OpenIdSignInProvider>
        </CheckMemberPasswordProvider>
      </CustomTermsProvider>
    </MemberWithdrawalProvider>
  );
};

export default MemberWithdrawal;
