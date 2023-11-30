import React, { FC } from 'react';

import { AmmLiquidityPool } from '../../utils/AmmLiquidityPool';
import { PoolChart } from './components/PoolChart/PoolChart';

type PoolDetailsProps = {
  pool: AmmLiquidityPool;
};

export const PoolDetails: FC<PoolDetailsProps> = ({ pool }) => {
  return (
    <>
      <PoolChart pool={pool} />
    </>
  );
};
