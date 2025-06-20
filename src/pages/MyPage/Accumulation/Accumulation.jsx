import { useEffect } from 'react';

import {
  ProfileAccumulationProvider,
  useMallStateContext,
  useProfileAccumulationActionContext,
  useProfileAccumulationStateContext,
} from '@shopby/react-components';
import { convertToKoreanCurrency } from '@shopby/shared';

import StartYmdSelector from '../../../components/StartYmdSelector';
import useLayoutChanger from '../../../hooks/useLayoutChanger';

import AccumulationList from './AccumulationList';

const AccumulationContent = () => {
  const { profileAccumulationSummary } = useProfileAccumulationStateContext();
  const { fetchAccumulationSummary } = useProfileAccumulationActionContext();

  const {
    accumulationConfig: { unit, accumulationName },
  } = useMallStateContext();

  useEffect(() => {
    fetchAccumulationSummary();
  }, []);

  return (
    <div className="my-page-accumulation">
      <div className="my-page-accumlation__title">
        보유
      </div>
      <div className="my-page-accumulation__amount">
        <span>{convertToKoreanCurrency(profileAccumulationSummary?.totalAvailableAmt ?? 0)}</span>
        {unit ?? 'p'}
      </div>
      <StartYmdSelector className="my-page-accumulation__period-select" initialOffsetOption="7d" />
      <AccumulationList />
    </div>
  );
};

const Accumulation = () => {
  const {
    accumulationConfig: { accumulationName },
  } = useMallStateContext();

  useLayoutChanger({
    title: accumulationName,
    hasBackBtnOnHeader: true,
    hasCartBtnOnHeader: true,
    hasBottomNav: true,
  });

  return (
    <ProfileAccumulationProvider>
      <AccumulationContent />
    </ProfileAccumulationProvider>
  );
};

export default Accumulation;
