import { useEffect } from 'react';

import {
  useMemberModificationStateContext,
  useMemberModificationActionContext,
  useMallStateContext,
} from '@shopby/react-components';

import AddressForm from '../../components/AddressForm';
import { REQUIRED } from '../../constants/form';

import ValidationStatus from './ValidationStatus';

const MemberModificationAddressForm = () => {
  const {
    memberJoinConfig: { address: addressConfig },
  } = useMallStateContext();

  const { updateMemberModificationInfo, updateValidationStatus } = useMemberModificationActionContext();

  const {
    memberModificationInfo: { zipCd, address, detailAddress },
  } = useMemberModificationStateContext();

  const handleAddressItemClick = ({ zipCode, roadAddress, jibunAddress }) => {
    updateMemberModificationInfo({
      zipCd: zipCode,
      address: roadAddress,
      jibunAddress,
    });
  };

  const handleAddressDetailChange = ({ addressDetail }) => {
    updateMemberModificationInfo({ detailAddress: addressDetail });
  };

  const isDetailAddressEmpty = () => {
    if (!detailAddress && zipCd && address) {
      updateValidationStatus((prev) => ({ ...prev, address: { result: false, message: '상세 주소를 입력해주세요.' } }));

      return true;
    }
    updateValidationStatus((prev) => ({ ...prev, address: { result: true, message: '' } }));

    return false;
  };

  useEffect(() => {
    isDetailAddressEmpty();
  }, [zipCd, address, detailAddress]);

  return (
    <div className="member-modification-form__item">
      <label htmlFor="address" className="member-modification-form__tit">
        주소찾기
        {addressConfig === REQUIRED && <div className="required"></div>}
      </label>
      <AddressForm
        zipCode={zipCd}
        address={address}
        addressDetail={detailAddress}
        onAddressItemClick={handleAddressItemClick}
        onAddressDetailChange={handleAddressDetailChange}
      />
      <ValidationStatus name="address" />
    </div>
  );
};

export default MemberModificationAddressForm;

MemberModificationAddressForm.propTypes = {};
