import React, { FC } from 'react';

import { AmountRenderer } from '../../../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { useGetPoolInfo } from '../../../../../BobDepositModal/hooks/useGetPoolInfo';
import { AmbientLiquidityPool } from '../../../../utils/AmbientLiquidityPool';

type AmbientPoolFeeRateProps = {
  pool: AmbientLiquidityPool;
};

export const AmbientPoolFeeRate: FC<AmbientPoolFeeRateProps> = ({ pool }) => {
  const { feeRate } = useGetPoolInfo(pool.base, pool.quote);
  return <AmountRenderer value={feeRate} suffix="%" />;
};
