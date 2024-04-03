import { useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { shape, object } from 'prop-types';

import {
  useSignUpActionContext,
  useSignUpStateContext,
  useModalActionContext,
  useCustomTermsStateContext,
  useMallStateContext,
  useIdentificationVerificationStateContext,
} from '@shopby/react-components';
import { AUTHENTICATION_TYPE } from '@shopby/shared/constants';

import { useErrorBoundaryActionContext } from '../../components/ErrorBoundary';
import { REQUIRED } from '../../constants/form';

// eslint-disable-next-line complexity
const SignUpButton = ({ refs: { emailRef, mobilePhoneNumberInputRef } }) => {
  const { state } = useLocation();
  const { postProfile } = useSignUpActionContext();
  const { openAlert } = useModalActionContext();
  const { isSignedUp } = useSignUpStateContext();
  const { AUTHENTICATION_BY_EMAIL, AUTHENTICATION_BY_PHONE, SMS_AUTHENTICATION } = AUTHENTICATION_TYPE;

  const {
    mallJoinConfig: { authenticationTimeType, authenticationType },
    memberJoinConfig: {
      sex: sexConfig,
      email: emailConfig,
      address: addressConfig,
      phoneNo: phoneNoConfig,
      birthday: birthdayConfig,
      memberId: memberIdConfig,
      mobileNo: mobileNoConfig,
      nickname: nicknameConfig,
      password: passwordConfig,
      memberName: memberNameConfig,
    },
  } = useMallStateContext();
  const { setValidationStatus, setIsCertificated } = useSignUpActionContext();
  const {
    validationStatus,
    signUpMemberInfo: {
      address,
      birthDate,
      birthMonth,
      birthYear,
      carrierNumber,
      detailAddress,
      emailDomain,
      emailId,
      firstSerial,
      memberId,
      memberName,
      nickname,
      passwordCheck,
      phoneNo,
      secondSerial,
      sex,
    },
    isCertificated,
  } = useSignUpStateContext();
  const { catchError } = useErrorBoundaryActionContext();
  const { agreedAllRequiredTerms, agreedTermsNos } = useCustomTermsStateContext();
  const { isCiExist, ci } = useIdentificationVerificationStateContext();

  const navigate = useNavigate();

  const isValidEmailAuthentication = useMemo(() => {
    const isEmailAuthentication =
      authenticationTimeType !== 'JOIN_TIME' || authenticationType !== AUTHENTICATION_BY_EMAIL;
    const isEmailEmpty = !emailId || !emailDomain;

    return isEmailAuthentication || isEmailEmpty;
  }, [authenticationTimeType, authenticationType, emailId, emailDomain]);

  const isValidMobileNoAuthentication = useMemo(() => {
    const isMobileNoEmpty = !carrierNumber || !firstSerial || !secondSerial;

    return authenticationTimeType !== 'JOIN_TIME' || isMobileNoEmpty;
  }, [carrierNumber, firstSerial, secondSerial]);

  const isMemberIdEmpty = () => {
    if (!memberId) {
      setValidationStatus((prev) => ({ ...prev, memberId: { result: false, message: '아이디를 입력해주세요.' } }));

      return true;
    }

    return false;
  };
  const isPasswordEmpty = () => {
    if (!passwordCheck) {
      setValidationStatus((prev) => ({
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
      setValidationStatus((prev) => ({
        ...prev,
        address: { result: false, message: '주소를 입력해주세요.' },
      }));

      return true;
    }

    return false;
  };

  const isBirthdayEmpty = () => {
    if (!birthYear || !birthMonth || !birthDate) {
      setValidationStatus((prev) => ({
        ...prev,
        birthday: { result: false, message: '생년월일을 선택해주세요.' },
      }));

      return true;
    }

    return false;
  };

  const validateEmailAuthentication = () => {
    if (isValidEmailAuthentication) {
      return true;
    }

    if (!isCertificated) {
      setValidationStatus((prev) => ({
        ...prev,
        email: { result: false, message: '이메일 인증을 진행해주세요.' },
      }));

      return false;
    }

    if (validationStatus.certificatedNumber.message === '인증을 완료하였습니다.') {
      setValidationStatus((prev) => ({
        ...prev,
        email: { result: true, message: '' },
      }));
    }

    return true;
  };

  const validateSMSAuthentication = () => {
    if (isValidMobileNoAuthentication || authenticationType !== SMS_AUTHENTICATION) {
      return true;
    }

    if (!isCertificated) {
      setValidationStatus((prev) => ({
        ...prev,
        mobileNo: { result: false, message: '휴대폰 번호 인증을 진행해주세요.' },
      }));

      return false;
    }

    setValidationStatus((prev) => ({
      ...prev,
      mobileNo: { result: true, message: '' },
    }));

    return true;
  };

  const validateMobileNoAuthentication = () => {
    if (isValidMobileNoAuthentication || authenticationType !== AUTHENTICATION_BY_PHONE) {
      return true;
    }

    if (!isCertificated) {
      setValidationStatus((prev) => ({
        ...prev,
        mobileNo: { result: false, message: '휴대폰 번호 인증을 진행해주세요.' },
      }));

      return false;
    }

    setValidationStatus((prev) => ({
      ...prev,
      mobileNo: { result: true, message: '' },
    }));

    return true;
  };

  const isEmailEmpty = () => {
    if (!emailId || !emailDomain) {
      setValidationStatus((prev) => ({
        ...prev,
        email: { result: false, message: '이메일을 입력해주세요.' },
      }));

      return true;
    }

    return false;
  };
  const isMemberNameEmpty = () => {
    if (!memberName) {
      setValidationStatus((prev) => ({ ...prev, memberName: { result: false, message: '이름을 입력해주세요.' } }));

      return true;
    }

    return false;
  };
  const isNicknameEmpty = () => {
    if (!nickname) {
      setValidationStatus((prev) => ({
        ...prev,
        nickname: { result: false, message: '닉네임을 입력해주세요.' },
      }));

      return true;
    }

    return false;
  };
  const isPhoneNoEmpty = () => {
    if (!phoneNo) {
      setValidationStatus((prev) => ({
        ...prev,
        phoneNo: { result: false, message: '전화번호를 입력해주세요.' },
      }));

      return true;
    }

    return false;
  };
  const isMobileNoEmpty = () => {
    if (!carrierNumber || !firstSerial || !secondSerial) {
      setValidationStatus((prev) => ({
        ...prev,
        mobileNo: { result: false, message: '휴대폰 번호를 입력해주세요.' },
      }));

      return true;
    }

    return false;
  };
  const isSexEmpty = () => {
    if (sex !== 'M' && sex !== 'F') {
      setValidationStatus((prev) => ({
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
  const validate = () => {
    const isMemberIdValid = memberIdConfig === REQUIRED && isMemberIdEmpty();
    const isAddressValid = addressConfig === REQUIRED && isAddressEmpty();
    const isBirthdayValid = birthdayConfig === REQUIRED && isBirthdayEmpty();
    const isEmailValid = emailConfig === REQUIRED && isEmailEmpty();
    const isMobileNoValid = (mobileNoConfig === REQUIRED || isMobileRequired) && isMobileNoEmpty();
    const isNicknameValid = nicknameConfig === REQUIRED && isNicknameEmpty();
    const isPasswordValid = passwordConfig === REQUIRED && isPasswordEmpty();
    const isPhoneNoValid = phoneNoConfig === REQUIRED && isPhoneNoEmpty();
    const isSexValid = sexConfig === REQUIRED && isSexEmpty();
    const isMemberNameValid = memberNameConfig === REQUIRED && isMemberNameEmpty();
    return (
      isMemberIdValid ||
      isAddressValid ||
      isBirthdayValid ||
      isEmailValid ||
      isMobileNoValid ||
      isNicknameValid ||
      isPasswordValid ||
      isPhoneNoValid ||
      isSexValid ||
      isMemberNameValid
    );
  };

  // eslint-disable-next-line complexity
  const handleSignUp = async () => {
    if (validate() || !agreedAllRequiredTerms) {
      openAlert({
        message: '필수 입력 사항을 확인 바랍니다.',
      });

      return;
    }

    if (!validationStatus.birthday.result) {
      openAlert({
        message: '생년월일을 확인해주세요.',
      });

      return;
    }

    if (!validateEmailAuthentication()) {
      openAlert({
        message: '이메일 인증을 진행해주세요.',
        onClose: () => emailRef.current?.focusId(),
      });

      return;
    }

    if (!validateSMSAuthentication() || !validateMobileNoAuthentication()) {
      openAlert({
        message: '휴대폰 번호 인증을 진행해주세요.',
        onClose: () => mobilePhoneNumberInputRef.current?.focusFirstSerial(),
      });

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
      await postProfile({
        customTermsNos: agreedTermsNos,
      });
    } catch (e) {
      catchError(e);
    }
  };

  useEffect(() => {
    if (isSignedUp === true) {
      navigate('/sign-up-confirm', {
        replace: true,
        state: {
          memberId,
          ...state,
        },
      });
    }
  }, [isSignedUp]);

  useEffect(() => {
    validateEmailAuthentication();
    validateSMSAuthentication();
    validateMobileNoAuthentication();
  }, [isCertificated]);

  const validateCiExist = () => {
    if (ci && !isCiExist) {
      setValidationStatus((prev) => ({
        ...prev,
        mobileNo: { result: true, message: '' },
      }));
      setIsCertificated(true);
    }
  };

  useEffect(() => {
    validateCiExist();
  }, [isCiExist, ci]);

  return (
    <div className="sign-up-form__confirm">
      <button className="" onClick={handleSignUp}>
        회원가입
      </button>
    </div>
  );
};

export default SignUpButton;

SignUpButton.propTypes = {
  refs: shape({
    emailRef: object,
    mobilePhoneNumberInputRef: object,
  }),
};
