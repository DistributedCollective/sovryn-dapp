import React, { FC } from 'react';

import { AmmLiquidityPool } from '../../../../utils/AmmLiquidityPool';
import { useGetPoolVolumeData } from './hooks/useGetPoolVolumeData';

type PoolChartProps = {
  pool: AmmLiquidityPool;
};

export const PoolChart: FC<PoolChartProps> = ({ pool }) => {
  const data = useGetPoolVolumeData(pool);

  return <div>{JSON.stringify(data, null, 2)}</div>;
};
