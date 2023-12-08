import dayjs from 'dayjs';
import { t } from 'i18next';

import { MockData } from '../../../../../../2_molecules/Chart/Chart.types';
import { translations } from '../../../../../../../locales/i18n';
import { PoolHistoryData } from './LendFrameChart.types';

export const convertPoolHistoryToMockData = (
  poolHistory: PoolHistoryData[],
): MockData => {
  const dates = poolHistory.map(entry =>
    dayjs(entry.timestamp).format('YYYY-MM-DD'),
  );
  const lendApr = poolHistory.map(entry => parseFloat(entry.supply_apr));
  const totalLiquidity = poolHistory.map(entry => parseFloat(entry.supply));

  return {
    data1: lendApr,
    label1: t(translations.lendPage.table.lendApr),
    borderColor1: '#72EADE',
    data2: totalLiquidity,
    label2: t(translations.lendPage.table.totalLiquidity),
    borderColor2: '#82868F',
    xLabels: dates,
  };
};
