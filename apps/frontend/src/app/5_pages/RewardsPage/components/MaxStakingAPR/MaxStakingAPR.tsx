import React, { FC } from 'react';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { APR } from '../../../StakePage/StakePage.constants';
import { useGetStakingStatistics } from '../../../StakePage/components/StakingStatistics/hooks/useGetStakingStatistics';

export const MaxStakingAPR: FC = () => {
  const { maxStakingApr } = useGetStakingStatistics();

  if (!maxStakingApr) {
    return <>-</>;
  }

  return (
    <AmountRenderer value={maxStakingApr} suffix={` % ${APR}`} precision={1} />
  );
};
