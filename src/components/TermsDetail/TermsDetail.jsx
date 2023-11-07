import { useEffect, useMemo, useRef, useState } from 'react';

import { string, func } from 'prop-types';

import { SelectBox, VisibleComponent, useTermsActionContext, useTermsStateContext } from '@shopby/react-components';
import { TERMS_HISTORY_KEY_TYPE } from '@shopby/shared';

import { TERMS_MENUS } from '../../constants';
import useLayoutChanger from '../../hooks/useLayoutChanger';
import { isSameOrAfter } from '../../utils';
import Sanitized from '../Sanitized';

const termsHistoryKeys = [TERMS_HISTORY_KEY_TYPE.USE, TERMS_HISTORY_KEY_TYPE.PI_PROCESS];

const TermsDetail = ({ termsKey }) => {
  const { termsHistory, termsDetail, terms } = useTermsStateContext();
  const { fetchTermsHistory, fetchTermsDetail } = useTermsActionContext();
  const termsState = terms[termsKey];
  const title = useMemo(
    () => TERMS_MENUS.filter(({ termsKey: _termsKey }) => _termsKey === termsKey).at(0).title,
    [termsKey]
  );
  const showHistory = termsHistoryKeys.includes(termsKey);

  const [termsNo, setTermsNo] = useState(0);

  const contentRef = useRef();

  const currentTermsHistory = useMemo(
    () =>
      termsHistory[termsKey]?.filter(({ enforcementDate }) => isSameOrAfter({ comparisonDate: enforcementDate }))?.at(),
    [termsHistory]
  );

  const termsHistorySelectOptions = useMemo(
    () =>
      termsHistory[termsKey]?.map(({ termsNo, enforcementDate, termsEnforcementStatusLabel }) => ({
        value: termsNo,
        label: `${enforcementDate}${termsEnforcementStatusLabel ? ` (${termsEnforcementStatusLabel})` : ''}`,
      })),
    [termsHistory]
  );

  const scrollIntoView = () => {
    contentRef?.current?.scrollIntoView({
      block: 'start',
      behavior: 'smooth',
    });
  };

  const changeTermsNo = (termsNo) => {
    fetchTermsDetail(termsNo);
    setTermsNo(termsNo);
    scrollIntoView();
  };

  useLayoutChanger({
    hasBackBtnOnHeader: true,
    title,
  });

  useEffect(() => {
    showHistory && fetchTermsHistory({ termsHistoryType: termsKey });
    scrollIntoView();
  }, [termsKey]);

  useEffect(() => {
    currentTermsHistory?.termsNo && changeTermsNo(currentTermsHistory.termsNo);
  }, [currentTermsHistory]);

  return (
    <div ref={contentRef} className="agreement">
      <Sanitized html={showHistory && termsDetail.contents ? termsDetail.contents : termsState?.contents} />
      <VisibleComponent
        shows={showHistory}
        TruthyComponent={
          <SelectBox
            value={termsNo}
            options={termsHistorySelectOptions}
            onSelect={({ currentTarget }) => {
              changeTermsNo(currentTarget.value);
            }}
          />
        }
      />
    </div>
  );
};

export default TermsDetail;

TermsDetail.propTypes = {
  termsKey: string,
  content: string,
  title: string,
  onClose: func,
};
