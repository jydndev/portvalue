import { forwardRef, useImperativeHandle, useState } from 'react';
import { Button, useOrderSheetStateContext } from '@shopby/react-components';
import FullModal from '../../components/FullModal';
import Sanitized from '../../components/Sanitized/Sanitized';
import { EXTERNAL_CUSTOM_ORDER_SHEET_TERMS } from '../../constants';

const externalCustomOrderSheetValues = EXTERNAL_CUSTOM_ORDER_SHEET_TERMS.map(({ value }) => value);

const filterValidTermsValues = (terms, key) =>
  terms
    .filter(({ value }) => !externalCustomOrderSheetValues.includes(value))
    .map(({ value }) => ({
      isAgree: true,
      [key]: value,
    }));

const TermsChecker = forwardRef((_, ref) => {
  const { termsStatus } = useOrderSheetStateContext();
  const [isTermContentsModalOpen, setIsTermContentsModalOpen] = useState(false);
  const [clickedTerm, setClickedTerm] = useState(null);

  const terms = Object.values(termsStatus).filter(({ isCustom }) => !isCustom);
  const customTerms = Object.values(termsStatus).filter(({ isCustom }) => isCustom);

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
      agreementTermsAgrees: filterValidTermsValues(terms, 'termsType'),
      customTermsAgrees: filterValidTermsValues(customTerms, 'customTermsNo').filter(
        ({ customTermsNo }) => customTermsNo > 0
      ),
    }),
    [terms, customTerms]
  );

  return (
    <section className="l-page order-sheet__terms">
      {[...terms, ...customTerms].map(({ title, value, content }) => {
        return (
          <div key={value} className="order-sheet__term-checker">
            <span>{title}</span>
            {content && (
              <Button
                label="보기"
                onClick={() =>
                  showDetailBtnClick({
                    title,
                    content,
                  })
                }
                className="order-sheet__term-view-btn"
              />
            )}
          </div>
        );
      })}
      {Boolean(isTermContentsModalOpen && clickedTerm) && (
        <FullModal title={clickedTerm.title} onClose={handleTermContentModalClose}>
          <Sanitized html={clickedTerm.contents} style={{ padding: '20px' }} />
        </FullModal>
      )}
      <p className="order-sheet__terms-agreement">
        위 주문 내용을 확인하였으며, 회원 본인은 개인정보 이용 및 제공, 결제에 동의합니다.
      </p>
    </section>
  );
});

export default TermsChecker;

TermsChecker.displayName = 'TermsChecker';
