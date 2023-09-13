import { forwardRef, useImperativeHandle, useState } from 'react';

import { Button, Checkbox, useOrderSheetActionContext, useOrderSheetStateContext } from '@shopby/react-components';

import { CustomTerms } from '../../components/CustomTerms';
import FullModal from '../../components/FullModal';
import Sanitized from '../../components/Sanitized/Sanitized';
import { EXTERNAL_CUSTOM_ORDER_SHEET_TERMS } from '../../constants';

const externalCustomOrderSheetValues = EXTERNAL_CUSTOM_ORDER_SHEET_TERMS.map(({ value }) => value);

const filterValidTermsValues = (terms) =>
  terms
    .filter(({ isChecked, value }) => isChecked && !externalCustomOrderSheetValues.includes(value))
    .map(({ value }) => value);

const TermsChecker = forwardRef((_, ref) => {
  const { termsStatus } = useOrderSheetStateContext();
  const { updateTermsStatus } = useOrderSheetActionContext();
  const [isTermContentsModalOpen, setIsTermContentsModalOpen] = useState(false);
  const [clickedTerm, setClickedTerm] = useState(null);

  const terms = Object.values(termsStatus).filter(({ isCustom }) => !isCustom);
  const customTerms = Object.values(termsStatus).filter(({ isCustom }) => isCustom);

  const handleTermCheckboxClick = ({ isChecked, value }) => {
    updateTermsStatus({
      [value]: {
        ...termsStatus[value],
        isChecked,
      },
    });
  };

  const handleTermContentModalClose = () => {
    setIsTermContentsModalOpen(false);
  };

  const showDetailBtnClick = ({ title, content }) => {
    setClickedTerm({ title, contents: content });
    setIsTermContentsModalOpen(true);
  };

  useImperativeHandle(
    ref,
    () => ({
      agreementTypes: filterValidTermsValues(terms),
      customTermsNos: filterValidTermsValues(customTerms).filter((v) => v > 0),
    }),
    [terms, customTerms]
  );

  return (
    <section className="l-page order-sheet__terms">
      {[...terms, ...customTerms].map(({ title, isChecked, isRequired, value, content }) => (
        <div key={value} className="order-sheet__term-checker">
          <Checkbox
            isRounded={true}
            label={`[${isRequired ? '필수' : '선택'}] ${title}`}
            checked={isChecked}
            onClick={(event) => {
              const isChecked = event.currentTarget.checked;

              handleTermCheckboxClick({
                isChecked,
                value,
              });
            }}
          />
          {content && (
            <Button
              label="보기"
              onClick={() =>
                showDetailBtnClick({
                  title,
                  content,
                })
              }
            />
          )}
        </div>
      ))}
      {Boolean(isTermContentsModalOpen && clickedTerm) && (
        <FullModal title={clickedTerm.title} onClose={handleTermContentModalClose}>
          <Sanitized html={clickedTerm.contents} style={{ padding: '20px' }} />
        </FullModal>
      )}
    </section>
  );
});

export default TermsChecker;

TermsChecker.displayName = 'TermsChecker';
