import { useEffect, useMemo, useState } from 'react';

import { shape, object, bool } from 'prop-types';

import { SelectBox, VisibleComponent, useClaimActionContext, useClaimStateContext } from '@shopby/react-components';

import ImageUploader from '../../components/ImageUploader';
import { CLAIM_REASON_DETAIL_MAX_LENGTH } from '../../constants/form';

const ClaimReasonForm = ({ refs, useImageUploader = false }) => {
  const { claimReasonSelectRef, claimReasonDetailTextareaRef } = refs ?? {};
  const { claimInfo, claimReason, claimReasonDetail } = useClaimStateContext();
  const { updateClaimReason, updateClaimReasonDetail, updateClaimImageUrls } = useClaimActionContext();
  const [images, setImages] = useState([]);

  const claimReasonOptions = useMemo(
    () => claimInfo?.claimReasonTypes.map(({ claimReasonType: value, label }) => ({ label, value })) ?? [],
    [claimInfo?.claimReasonTypes]
  );

  const handleClaimReasonSelect = ({ currentTarget: { value } }) => {
    updateClaimReason(value);
  };

  const handleClaimReasonDetailChange = ({ currentTarget: { value } }) => {
    const isLengthOverflow = value.length > CLAIM_REASON_DETAIL_MAX_LENGTH;

    updateClaimReasonDetail(isLengthOverflow ? value.slice(0, CLAIM_REASON_DETAIL_MAX_LENGTH) : value);
  };

  useEffect(() => {
    updateClaimImageUrls(images.map(({ imageUrl }) => imageUrl));
  }, [images]);

  return (
    <section className="claim__section claim__reason">
      <SelectBox
        ref={claimReasonSelectRef}
        className="claim__select-box"
        options={claimReasonOptions}
        hasEmptyOption={true}
        emptyOptionLabel="사유를 선택해주세요"
        value={claimReason}
        onSelect={handleClaimReasonSelect}
      />
      <p className="claim__sub-title">상세 사유</p>
      <textarea
        ref={claimReasonDetailTextareaRef}
        className="claim__reason-detail"
        placeholder="상세 사유를 입력해주세요"
        value={claimReasonDetail}
        onChange={handleClaimReasonDetailChange}
      />
      <VisibleComponent
        shows={useImageUploader}
        TruthyComponent={<ImageUploader canAttach={true} images={images} onChangeImages={setImages} />}
      />
    </section>
  );
};

export default ClaimReasonForm;

ClaimReasonForm.propTypes = {
  refs: shape({
    claimReasonSelectRef: object,
    claimReasonDetailTextareaRef: object,
  }),
  useImageUploader: bool,
};
