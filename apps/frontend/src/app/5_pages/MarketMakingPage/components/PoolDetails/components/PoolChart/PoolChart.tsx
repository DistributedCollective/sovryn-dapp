import React, { FC, useMemo } from 'react';

import { t } from 'i18next';

import { Chart } from '../../../../../../2_molecules/Chart/Chart';
import { translations } from '../../../../../../../locales/i18n';
import { AmmLiquidityPool } from '../../../../utils/AmmLiquidityPool';
import {
  GRADIENT1_COLOR1,
  GRADIENT1_COLOR2,
  GRADIENT2_COLOR1,
  GRADIENT2_COLOR2,
} from './PoolChart.constants';
import { convertPoolVolumeDataToMockData } from './PoolChart.utils';
import { useGetPoolVolumeData } from './hooks/useGetPoolVolumeData';

type PoolChartProps = {
  pool: AmmLiquidityPool;
};

export const PoolChart: FC<PoolChartProps> = ({ pool }) => {
  const data = useGetPoolVolumeData(pool);
  const mockData = convertPoolVolumeDataToMockData(data);

  const maxApy = useMemo(() => Math.max(...mockData.data1), [mockData.data1]);
  const minApy = useMemo(() => Math.min(...mockData.data1), [mockData.data1]);

  const tickStep = useMemo(() => (maxApy - minApy) / 6, [maxApy, minApy]);

  return (
    <Chart
      mockData={mockData}
      tickStep={tickStep}
      yLabel1={t(translations.marketMakingPage.poolVolumeChart.apr)}
      yLabel2={t(translations.marketMakingPage.poolVolumeChart.volume)}
      gradient1Colors={[GRADIENT1_COLOR1, GRADIENT1_COLOR2]}
      gradient2Colors={[GRADIENT2_COLOR1, GRADIENT2_COLOR2]}
    />
  );
};
