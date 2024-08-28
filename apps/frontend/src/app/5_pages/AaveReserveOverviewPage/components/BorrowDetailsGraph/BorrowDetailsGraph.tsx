import React, { FC, useMemo, useState } from 'react';

import { t } from 'i18next';

import { theme } from '@sovryn/tailwindcss-config';
import { Accordion, Link, Paragraph } from '@sovryn/ui';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { StatisticsCard } from '../../../../2_molecules/StatisticsCard/StatisticsCard';
import { useIsMobile } from '../../../../../hooks/useIsMobile';
import { translations } from '../../../../../locales/i18n';
import { Chart } from './components/Chart/Chart';
import { harcodedData } from './components/Chart/Chart.constants';
import { MockData } from './components/Chart/Chart.types';

const pageTranslations = translations.aaveReserveOverviewPage.borrowDetails;

export const BorrowDetailsGraph: FC = () => {
  const [open, setOpen] = useState(true);
  const { isMobile } = useIsMobile();

  // TODO: mocked amounts
  const mockData: MockData<{ x: string; y: number }> = useMemo(() => {
    const data1 = harcodedData;

    return {
      data1,
      label1: t(pageTranslations.chart.label1),
      lineColor: theme.colors.positive,
      xLabels: data1.map(item => item.x),
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
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8 ">
          <StatisticsCard
            label={t(pageTranslations.totalBorrowed)}
            help={t(pageTranslations.totalBorrowedInfo)}
            value={
              <div>
                <div className="space-x-1 font-medium text-base">
                  <AmountRenderer value={100} suffix="B" />
                  <span>{t(pageTranslations.of)}</span>
                  <AmountRenderer value={100} suffix="B" />
                </div>
                <div className="space-x-1 text-gray-40 text-xs font-semibold">
                  <AmountRenderer value={100} suffix="B" />
                  <span>{t(pageTranslations.of)}</span>
                  <AmountRenderer value={100} suffix="B" />
                </div>

                {/* Progress bar */}
                <div className="mt-2 h-[3px] w-[160px] bg-gray-70 rounded-full">
                  <div className="h-full bg-primary-30 w-[80%]"></div>
                </div>
              </div>
            }
          />
          <div className="flex gap-8">
            <StatisticsCard
              label={t(pageTranslations.apr)}
              value={<AmountRenderer value={5.94} suffix="%" />}
            />
            <StatisticsCard
              label={t(pageTranslations.borrowCap)}
              value={<AmountRenderer value={1.4} suffix="M" />}
            />
          </div>
        </div>

        <Chart mockData={mockData} yLabel1="" />

        <div className="space-y-6">
          <Paragraph className="text-base">
            {t(pageTranslations.collectorInfo)}
          </Paragraph>

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
      </div>
    </Accordion>
  );
};
