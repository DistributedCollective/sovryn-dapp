import React, { FC, useMemo, useState } from 'react';

import { t } from 'i18next';

import { theme } from '@sovryn/tailwindcss-config';
import { Accordion, Link } from '@sovryn/ui';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { StatisticsCard } from '../../../../2_molecules/StatisticsCard/StatisticsCard';
import { useIsMobile } from '../../../../../hooks/useIsMobile';
import { translations } from '../../../../../locales/i18n';
import { Chart } from './components/Chart/Chart';
import { harcodedData } from './components/Chart/Chart.constants';
import { MockData } from './components/Chart/Chart.types';

const pageTranslations = translations.aaveReserveOverviewPage.interestRateModel;

type InterestRateModelGraphProps = {};

export const InterestRateModelGraph: FC<InterestRateModelGraphProps> = () => {
  const [open, setOpen] = useState<boolean>(true);
  const { isMobile } = useIsMobile();

  // TODO: mocked amounts
  const mockData: MockData<{ x: number; y: number }> = useMemo(() => {
    const data = harcodedData.values;
    const currentData = harcodedData.annotations.current;
    const optimalData = harcodedData.annotations.optimal;

    return {
      data1: data,
      data2: currentData,
      data3: optimalData,
      label1: t(pageTranslations.chart.label1),
      lineColor: theme.colors['primary-30'],
      xLabels: data.map(() => ''),
    };
  }, []);
  return (
    <Accordion
      label={
        <span className="text-base font-medium">
          {t(pageTranslations.title)}
        </span>
      }
      className="bg-gray-90 px-4 py-3 rounded lg:p-6 border border-gray-60"
      labelClassName="justify-between flex items-center "
      open={open || !isMobile}
      onClick={setOpen}
      flatMode={!isMobile}
    >
      <div className="space-y-8 pt-2">
        <div className="flex justify-between items-end">
          <StatisticsCard
            label={t(pageTranslations.utilizationRate)}
            value={<AmountRenderer value={5.94} suffix="%" />}
          />
          <Link href="#" text={t(pageTranslations.interestRateStrategy)} />
        </div>

        <Chart mockData={mockData} yLabel1="" />
        {/* statistics */}
        <div className="flex gap-8">
          <StatisticsCard
            label={t(pageTranslations.reserveFactor)}
            help={t(pageTranslations.reserveFactorInfo)}
            value={<AmountRenderer value={85.94} suffix="%" />}
          />
          <StatisticsCard
            label={t(pageTranslations.collectorContract)}
            value={<Link href="#" text={t(pageTranslations.viewContract)} />}
          />
        </div>
      </div>
    </Accordion>
  );
};
