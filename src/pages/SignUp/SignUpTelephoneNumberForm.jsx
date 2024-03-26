import { useTranslation } from 'react-i18next';

import {
  useSignUpStateContext,
  useSignUpActionContext,
  TextField,
  useMallStateContext,
} from '@shopby/react-components';

import { PHONE_NUMBER_MAX_LENGTH, REQUIRED } from '../../constants/form';

import ValidationStatus from './ValidationStatus';

const SignUpTelephoneNumberForm = () => {
  const { t } = useTranslation(['form']);

  const {
    memberJoinConfig: { phoneNo: phoneNoConfig },
  } = useMallStateContext();

  const { setSignUpMemberInfo, setValidationStatus } = useSignUpActionContext();

  const {
    signUpMemberInfo: { phoneNo },
  } = useSignUpStateContext();

  const resetValidationStatus = (key) => {
    setValidationStatus((prev) => ({ ...prev, [key]: { result: true, message: '' } }));
  };

  const isPhoneNoEmpty = () => {
    if (!phoneNo) {
      setValidationStatus((prev) => ({
        ...prev,
        phoneNo: { result: false, message: '전화번호를 입력해주세요.' },
      }));

      return true;
    }
    resetValidationStatus('phoneNo');

    return false;
  };
  const validatePhoneNumber = () => {
    if (phoneNoConfig === REQUIRED) {
      isPhoneNoEmpty();

      return;
    }
    if (phoneNo) {
      resetValidationStatus('phoneNo');
    }
  };

  const handleFormValueChange = (event) => {
    setSignUpMemberInfo((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  return (
    <div className="sign-up-form__item">
      <label htmlFor="phoneNo" className="sign-up-form__tit">
        {t('phoneNo-label')}
        {phoneNoConfig === REQUIRED && <div className="required"></div>}
      </label>
      <div className="sign-up-form__input-wrap">
        <TextField
          name="phoneNo"
          id="phoneNo"
          value={phoneNo}
          maxLength={PHONE_NUMBER_MAX_LENGTH}
          valid="NUMBER"
          onChange={handleFormValueChange}
          onBlur={validatePhoneNumber}
        />
      </div>
      <ValidationStatus name="phoneNo" />
    </div>
  );
};

export default SignUpTelephoneNumberForm;

SignUpTelephoneNumberForm.propTypes = {};
