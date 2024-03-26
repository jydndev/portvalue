import { useTranslation } from 'react-i18next';

import {
  useMemberModificationStateContext,
  useMemberModificationActionContext,
  TextField,
  useMallStateContext,
} from '@shopby/react-components';

import { PHONE_NUMBER_MAX_LENGTH, REQUIRED } from '../../constants/form';

import ValidationStatus from './ValidationStatus';

const MemberModificationTelephoneNumberForm = () => {
  const { t } = useTranslation(['form']);

  const {
    memberJoinConfig: { phoneNo: phoneNoConfig },
  } = useMallStateContext();

  const { updateMemberModificationInfo, updateValidationStatus } = useMemberModificationActionContext();

  const {
    memberModificationInfo: { telephoneNo },
  } = useMemberModificationStateContext();

  const resetValidationStatus = (key) => {
    updateValidationStatus((prev) => ({ ...prev, [key]: { result: true, message: '' } }));
  };

  const isPhoneNoEmpty = () => {
    if (!telephoneNo) {
      updateValidationStatus((prev) => ({
        ...prev,
        phoneNo: { result: false, message: '전화번호를 입력해주세요.' },
      }));

      return true;
    }
    resetValidationStatus('phoneNo');

    return false;
  };

  const validateTelePhoneNumber = () => {
    if (phoneNoConfig === REQUIRED) {
      isPhoneNoEmpty();

      return;
    }
    if (telephoneNo) {
      resetValidationStatus('phoneNo');
    }
  };

  const handleTelephoneNoChange = ({ currentTarget: { value } }) => {
    updateMemberModificationInfo({ telephoneNo: value });
  };

  return (
    <div className="member-modification-form__item">
      <label htmlFor="telephoneNo" className="member-modification-form__tit">
        {t('phoneNo-label')}
        {phoneNoConfig === REQUIRED && <div className="required"></div>}
      </label>
      <div className="member-modification-form__input-wrap">
        <TextField
          name="telephoneNo"
          id="telephoneNo"
          value={telephoneNo}
          maxLength={PHONE_NUMBER_MAX_LENGTH}
          valid="NUMBER"
          onChange={handleTelephoneNoChange}
          onBlur={validateTelePhoneNumber}
        />
      </div>
      <ValidationStatus name="phoneNo" />
    </div>
  );
};

export default MemberModificationTelephoneNumberForm;

MemberModificationTelephoneNumberForm.propTypes = {};
