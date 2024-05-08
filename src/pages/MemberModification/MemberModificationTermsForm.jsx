import { useEffect } from 'react';

import {
  Button,
  Checkbox,
  useMemberModificationActionContext,
  useMemberModificationStateContext,
  useAuthStateContext,
  useCustomTermsActionContext,
} from '@shopby/react-components';

import { CustomTerms } from '../../components/CustomTerms';
import FullModal from '../../components/FullModal';
import Sanitized from '../../components/Sanitized';
import { PI_14_AGE_TERM_TYPE } from '../../constants/form';

const MemberModificationTermsForm = () => {
  const { profile } = useAuthStateContext();
  const {
    getTerms,
    checkSingle,
    updateTermsInfo,
    updateIsTermsContentFullModalOpen,
    updateTermStatus,
    updateValidationStatus,
  } = useMemberModificationActionContext();
  const { termStatus, termsInfo, isTermsContentFullModalOpen } = useMemberModificationStateContext();
  const { updateInitialCustomTermsNos } = useCustomTermsActionContext();

  const initialTermStatus = [
    { id: 'use', label: '[필수] 이용약관', checked: true, require: true, termsType: 'USE', disabled: true },
    {
      id: 'pi',
      label: '[필수] 개인정보 수집 / 이용동의',
      checked: true,
      require: true,
      termsType: 'PI_COLLECTION_AND_USE_REQUIRED',
      disabled: true,
    },
  ];

  const ageTermStatus = {
    id: 'age',
    label: '[필수] 만 14세 이상 가입 동의',
    require: true,
    termsType: 'PI_14_AGE',
    disabled: false,
    checked: false,
  };

  const handleCheckSingle = (isChecked, label) => {
    checkSingle({ isChecked, label });
  };

  const handleGetTerms = async ({ termsTypes, title }) => {
    const terms = await getTerms({ termsTypes });
    const termContentValues = Object.values(terms);
    const [termData] = termContentValues;
    const { contents } = termData;

    updateIsTermsContentFullModalOpen(true);
    updateTermsInfo({ title, contents });
  };

  const addAgeTerm = async () => {
    const res = await getTerms({ termsTypes: PI_14_AGE_TERM_TYPE });
    if (res?.pi_14_age?.used) {
      ageTermStatus.checked = profile?.agreedTerms.includes(ageTermStatus.termsType);
      ageTermStatus.disabled = ageTermStatus.checked;
      updateTermStatus([...initialTermStatus, ageTermStatus]);
    } else {
      updateTermStatus(initialTermStatus);
    }
  };

  useEffect(() => {
    addAgeTerm();

    const customTermsNos = profile?.customTermsAgreement
      ?.filter(({ isAgree }) => isAgree)
      .map(({ customTermsNo }) => customTermsNo);
    customTermsNos?.length > 0 && updateInitialCustomTermsNos(customTermsNos);
  }, [profile]);

  useEffect(() => {
    const termStatusItems = [...termStatus];
    const requireTypeItem = termStatusItems.filter((el) => el.require);
    const checkJoinRequireAgreements = requireTypeItem.filter((el) => el.checked === false);

    if (checkJoinRequireAgreements.length !== 0) {
      updateValidationStatus((prev) => ({
        ...prev,
        joinTermsAgreements: { result: false, message: '필수 약관을 체크해 주세요.' },
      }));
    } else {
      updateValidationStatus((prev) => ({
        ...prev,
        joinTermsAgreements: { result: true, message: '' },
      }));
    }
  }, [termStatus]);

  return (
    <div className="member-modification-form__item">
      <p className="member-modification-form__tit">약관동의 현황</p>

      <div className="member-modification-form__agree-wrap">
        <ul className="member-modification-form__agree-list">
          {termStatus?.map((item, idx) => (
            <li key={idx}>
              <div className="member-modification-form__checkbox--check-single">
                <Checkbox
                  label={item.label}
                  checked={item.checked}
                  onChange={() => handleCheckSingle(item.checked, item.label)}
                  disabled={item?.disabled}
                />
                {item.termsType && (
                  <Button
                    label="보기"
                    onClick={() => {
                      handleGetTerms({ termsTypes: item.termsType, title: item.label });
                    }}
                  />
                )}
              </div>
            </li>
          ))}
        </ul>
        <CustomTerms />

        {isTermsContentFullModalOpen && (
          <FullModal
            className="agreement"
            title={termsInfo.title}
            onClose={() => updateIsTermsContentFullModalOpen(false)}
          >
            <Sanitized html={termsInfo.contents} />
          </FullModal>
        )}
      </div>
    </div>
  );
};

export default MemberModificationTermsForm;
