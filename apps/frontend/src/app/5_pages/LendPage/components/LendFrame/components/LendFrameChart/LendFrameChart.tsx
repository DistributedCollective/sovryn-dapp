import React, { FC, useMemo, memo } from 'react';

import { t } from 'i18next';

import { Chart } from '../../../../../../2_molecules/Chart/Chart';
import { getTokenDisplayName } from '../../../../../../../constants/tokens';
import { translations } from '../../../../../../../locales/i18n';
import { LendFrameProps } from '../../LendFrame.types';
import {
  GRADIENT1_COLOR1,
  GRADIENT1_COLOR2,
  GRADIENT2_COLOR1,
  GRADIENT2_COLOR2,
} from './LendFrameChart.constants';
import { convertPoolHistoryToMockData } from './LendFrameChart.utils';
import { useGetLendHistory } from './hooks/useGetLendHistory';

export const LendFrameChart: FC<LendFrameProps> = memo(({ pool }) => {
  const asset = useMemo(() => pool.getAsset(), [pool]);
  const { lendHistory } = useGetLendHistory(asset);

  const mockData = convertPoolHistoryToMockData(lendHistory);
  const tickStep = useMemo(
    () => (Math.max(...mockData.data1) - Math.min(...mockData.data1)) / 6,
    [mockData.data1],
  );

  return (
    <Chart
      mockData={mockData}
      tickStep={tickStep}
      yLabel1={t(translations.lendPage.table.lendApr)}
      yLabel2={`${t(
        translations.lendPage.table.totalLiquidity,
      )} ${getTokenDisplayName(pool.getAsset())}`}
      gradient1Colors={[GRADIENT1_COLOR1, GRADIENT1_COLOR2]}
      gradient2Colors={[GRADIENT2_COLOR1, GRADIENT2_COLOR2]}
    />
  );
});
