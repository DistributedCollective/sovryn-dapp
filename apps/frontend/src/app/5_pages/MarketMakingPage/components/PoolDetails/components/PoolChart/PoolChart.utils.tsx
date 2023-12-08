import { t } from 'i18next';

import { MockData } from '../../../../../../2_molecules/Chart/Chart.types';
import { translations } from '../../../../../../../locales/i18n';
import { PoolVolumeData } from './hooks/useGetPoolVolumeData';

export const convertPoolVolumeDataToMockData = (
  rawData: PoolVolumeData[],
): MockData => {
  const processedData = {
    dates: rawData.map(item => item.timestamp),
    apy: rawData.map(item => item.apy),
    btcVolumes: rawData.map(item => Number(item.btcVolume)),
  };

  return {
    data1: processedData.apy,
    label1: t(translations.marketMakingPage.poolVolumeChart.apr),
    borderColor1: '#82868F',
    data2: processedData.btcVolumes,
    label2: t(translations.marketMakingPage.poolVolumeChart['24hVolume']),
    borderColor2: '#f58c31',
    xLabels: processedData.dates,
  };
};
