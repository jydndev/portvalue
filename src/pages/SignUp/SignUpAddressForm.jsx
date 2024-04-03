import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { useMallStateContext, useSignUpActionContext, useSignUpStateContext } from '@shopby/react-components';

import AddressForm from '../../components/AddressForm';
import { REQUIRED } from '../../constants/form';

import ValidationStatus from './ValidationStatus';

const SignUpAddressForm = () => {
  const { t } = useTranslation(['form']);
  const {
    memberJoinConfig: { address: addressConfig },
  } = useMallStateContext();

  const { setSignUpMemberInfo, setValidationStatus } = useSignUpActionContext();
  const {
    signUpMemberInfo: { zipCd, address, detailAddress },
  } = useSignUpStateContext();

  const handleAddressItemClick = ({ zipCode, roadAddress, jibunAddress }) => {
    setSignUpMemberInfo((prev) => ({
      ...prev,
      zipCd: zipCode,
      address: roadAddress,
      jibunAddress,
    }));
  };

  const handleAddressDetailChange = ({ addressDetail }) => {
    setSignUpMemberInfo((prev) => ({ ...prev, detailAddress: addressDetail }));
  };

  const isAddressDetailEmpty = () => {
    if (!detailAddress && zipCd && address) {
      setValidationStatus((prev) => ({ ...prev, address: { result: false, message: '상세 주소를 입력해주세요.' } }));

      return true;
    }
    setValidationStatus((prev) => ({ ...prev, address: { result: true, message: '' } }));

    return false;
  };

  useEffect(() => {
    isAddressDetailEmpty();
  }, [zipCd, address, detailAddress]);

  return (
    <div className="sign-up-form__item">
      <label htmlFor="address" className="sign-up-form__tit">
        {t('address-label')}
        {addressConfig === REQUIRED && <div className="required"></div>}
      </label>
      <div className="sign-up-form__input-wrap">
        <AddressForm
          zipCode={zipCd}
          address={address}
          addressDetail={detailAddress}
          onAddressItemClick={handleAddressItemClick}
          onAddressDetailChange={handleAddressDetailChange}
        />
      </div>
      <ValidationStatus name="address" />
    </div>
  );
};

export default SignUpAddressForm;

SignUpAddressForm.propTypes = {};
