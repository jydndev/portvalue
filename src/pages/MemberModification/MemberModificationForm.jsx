import { useEffect, useMemo } from 'react';

import {
  Button,
  useMemberModificationStateContext,
  useMemberModificationActionContext,
  useMallStateContext,
  useCustomTermsStateContext,
  useModalActionContext,
} from '@shopby/react-components';
import { AUTHENTICATION_TYPE } from '@shopby/shared/constants';

import { useErrorBoundaryActionContext } from '../../components/ErrorBoundary';
import { NOT_USED, REQUIRED } from '../../constants/form';

import MemberModificationAddressForm from './MemberModificationAddressForm';
import MemberModificationBirthdayForm from './MemberModificationBirthdayForm';
import MemberModificationEmailForm from './MemberModificationEmailForm';
import MemberModificationNicknameForm from './MemberModificationNicknameForm';
import MemberModificationPasswordForm from './MemberModificationPasswordForm';
import MemberModificationReceiveAgreement from './MemberModificationReceiveAgreement';
import MemberModificationSexForm from './MemberModificationSexForm';
import MemberModificationSmsForm from './MemberModificationSmsForm';
import MemberModificationTelephoneNumberForm from './MemberModificationTelephoneNumberForm';
import MemberModificationTermsForm from './MemberModificationTermsForm';

// eslint-disable-next-line complexity
const MemberModificationForm = () => {
  const { fetchProfile, modifyProfile, updateIsAuthenticationReSend, updateValidationStatus } =
    useMemberModificationActionContext();

  const {
    validationStatus,
    memberModificationInfo: { providerType, address, detailAddress, memberName, telephoneNo, sex, nickname, memberId },
    newNickname,
    birthYear,
    birthMonth,
    birthDate,
    newEmail,
    carrierNumber,
    firstSerial,
    secondSerial,
    newPassword,
    newPasswordCheck,
    isNewPasswordDisplay,
  } = useMemberModificationStateContext();
  const {
    mallJoinConfig: { authenticationTimeType, authenticationType },
    memberJoinConfig: {
      password: passwordConfig,
      sex: sexConfig,
      email: emailConfig,
      address: addressConfig,
      phoneNo: phoneNoConfig,
      birthday: birthdayConfig,
      mobileNo: mobileNoConfig,
      nickname: nicknameConfig,
      smsAgreement,
      emailAgreement,
    },
  } = useMallStateContext();
  const { AUTHENTICATION_BY_PHONE, SMS_AUTHENTICATION } = AUTHENTICATION_TYPE;

  const { catchError } = useErrorBoundaryActionContext();
  const { openAlert } = useModalActionContext();

  // 약관 추가항목 관리
  const { agreedAllRequiredTerms, agreedTermsNos } = useCustomTermsStateContext();

  const isPasswordEmpty = () => {
    if (!newPasswordCheck) {
      updateValidationStatus((prev) => ({
        ...prev,
        password: { result: false, message: '비밀번호를 입력해주세요.' },
        passwordCheck: { result: false, message: '비밀번호를 입력해주세요.' },
      }));

      return true;
    }

    return false;
  };

  const isAddressEmpty = () => {
    if (!address || !detailAddress) {
      updateValidationStatus((prev) => ({
        ...prev,
        address: { result: false, message: '주소를 입력해주세요.' },
      }));

      return true;
    }

    return false;
  };

  const isBirthdayEmpty = () => {
    if (!birthYear || !birthMonth || !birthDate) {
      updateValidationStatus((prev) => ({
        ...prev,
        birthday: { result: false, message: '생년월일을 선택해주세요.' },
      }));

      return true;
    }

    return false;
  };

  const isEmailEmpty = () => {
    const [emailId = '', emailDomain = ''] = newEmail?.split('@') ?? [];

    if (!emailId && !emailDomain) {
      updateValidationStatus((prev) => ({
        ...prev,
        email: { result: false, message: '이메일을 입력해주세요.' },
      }));

      return true;
    }

    return false;
  };

  const isNicknameEmpty = () => {
    if (!newNickname) {
      updateValidationStatus((prev) => ({
        ...prev,
        nickname: { result: false, message: '닉네임을 입력해주세요.' },
      }));

      return true;
    }

    return false;
  };
  const isPhoneNoEmpty = () => {
    if (!telephoneNo) {
      updateValidationStatus((prev) => ({
        ...prev,
        phoneNo: { result: false, message: '전화번호를 입력해주세요.' },
      }));

      return true;
    }

    return false;
  };
  const isMobileNoEmpty = () => {
    if (!carrierNumber || !firstSerial || !secondSerial) {
      const message =
        authenticationType === AUTHENTICATION_BY_PHONE
          ? '휴대폰 번호 인증을 진행해주세요.'
          : '휴대폰 번호를 입력해주세요.';
      updateValidationStatus((prev) => ({
        ...prev,
        mobileNo: { result: false, message },
      }));

      return true;
    }

    return false;
  };
  const isSexEmpty = () => {
    if (sex !== 'M' && sex !== 'F') {
      updateValidationStatus((prev) => ({
        ...prev,
        sex: { result: false, message: '성별을 선택해주세요.' },
      }));

      return true;
    }

    return false;
  };

  const isMobileRequired = useMemo(() => {
    const isMobileAuthentication =
      authenticationType === AUTHENTICATION_BY_PHONE || authenticationType === SMS_AUTHENTICATION;

    if (authenticationTimeType === 'JOIN_TIME' && isMobileAuthentication) {
      return true;
    }

    return false;
  }, [authenticationTimeType, authenticationType]);

  // eslint-disable-next-line complexity
  const validateRequireItems = () => {
    const isPasswordValid = isNewPasswordDisplay && isPasswordEmpty();
    const isAddressValid = addressConfig === REQUIRED && isAddressEmpty();
    const isBirthdayValid = birthdayConfig === REQUIRED && isBirthdayEmpty();
    const isEmailValid = emailConfig === REQUIRED && isEmailEmpty();
    const isMobileNoValid = (mobileNoConfig === REQUIRED || isMobileRequired) && isMobileNoEmpty();
    const isNicknameValid = nicknameConfig === REQUIRED && isNicknameEmpty();
    const isPhoneNoValid = phoneNoConfig === REQUIRED && isPhoneNoEmpty();
    const isSexValid = sexConfig === REQUIRED && isSexEmpty();
    return (
      isPasswordValid ||
      isAddressValid ||
      isBirthdayValid ||
      isEmailValid ||
      isMobileNoValid ||
      isNicknameValid ||
      isPhoneNoValid ||
      isSexValid
    );
  };

  const resetPassword = () => {
    if (isNewPasswordDisplay) {
      return;
    }
    validationStatus.password.result = true;
    validationStatus.passwordCheck.result = true;
  };

  const validate = () => {
    resetPassword();

    if (validateRequireItems() || !agreedAllRequiredTerms) {
      openAlert({
        message: '필수 입력 사항을 확인 바랍니다.',
      });

      return true;
    }

    if (!validationStatus?.address?.result) {
      openAlert({
        message: '상세 주소를 입력해주세요.',
      });

      return true;
    }

    if (!validationStatus.birthday.result) {
      openAlert({
        message: '생년월일을 확인해주세요.',
      });

      return true;
    }

    return false;
  };

  const handleModifyBtnClick = async () => {
    if (validate()) {
      return;
    }

    const errorMessage = Object.values(validationStatus)
      .filter(({ result }) => !result)
      ?.at(0)?.message;
    if (errorMessage) {
      openAlert({
        message: errorMessage,
      });

      return;
    }

    try {
      const modifyResult = await modifyProfile({
        customTermsNos: agreedTermsNos,
        password: isNewPasswordDisplay ? newPassword : null,
      });

      if (modifyResult) {
        location.href = '/my-page';
      }
    } catch (e) {
      catchError(e);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (authenticationType !== AUTHENTICATION_TYPE.NOT_USED) {
      updateIsAuthenticationReSend(true);
    }
  }, [authenticationType]);

  return (
    <div className="member-modification">
      <div className="member-modification-name">
        <p>
          {memberName || nickname || memberId}
          <span>({providerType ? providerType : '쇼핑몰'} 아이디 회원)</span>
        </p>
      </div>
      <section className="l-panel">
        <div className="member-modification-form">
          {passwordConfig !== NOT_USED && <MemberModificationPasswordForm />}
          {nicknameConfig !== NOT_USED && <MemberModificationNicknameForm />}
          {emailConfig !== NOT_USED && <MemberModificationEmailForm />}
          {mobileNoConfig !== NOT_USED && <MemberModificationSmsForm />}
          {phoneNoConfig !== NOT_USED && <MemberModificationTelephoneNumberForm />}
          {addressConfig !== NOT_USED && <MemberModificationAddressForm />}
          {birthdayConfig !== NOT_USED && <MemberModificationBirthdayForm />}
          {sexConfig !== NOT_USED && <MemberModificationSexForm />}
        </div>
      </section>
      {(smsAgreement !== NOT_USED || emailAgreement !== NOT_USED) && (
        <section className="l-panel">
          <div className="member-modification-form">
            <MemberModificationReceiveAgreement />
          </div>
        </section>
      )}
      <section className="l-panel">
        <div className="member-modification-form">
          <MemberModificationTermsForm />
          <div className="member-modification-form__button-wrap">
            <Button label="정보 수정" onClick={handleModifyBtnClick} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default MemberModificationForm;

MemberModificationForm.propTypes = {};
