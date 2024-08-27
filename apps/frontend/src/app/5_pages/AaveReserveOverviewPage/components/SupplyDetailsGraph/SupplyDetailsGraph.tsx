import React, { FC, useMemo, useState } from 'react';

import { t } from 'i18next';

import { theme } from '@sovryn/tailwindcss-config';
import { Accordion, Icon, IconNames, Paragraph } from '@sovryn/ui';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { StatisticsCard } from '../../../../2_molecules/StatisticsCard/StatisticsCard';
import { useIsMobile } from '../../../../../hooks/useIsMobile';
import { translations } from '../../../../../locales/i18n';
import { Chart } from './components/Chart/Chart';
import { harcodedData } from './components/Chart/Chart.constants';
import { MockData } from './components/Chart/Chart.types';

const pageTranslations = translations.aaveReserveOverviewPage.supplyDetails;

type SupplyDetailsGraphProps = {};

export const SupplyDetailsGraph: FC = () => {
  const [open, setOpen] = useState<boolean>(true);
  const { isMobile } = useIsMobile();
  // TODO: mocked amounts
  const mockData: MockData<{ x: string; y: number }> = useMemo(() => {
    const data1 = harcodedData;

    return {
      data1,
      label1: t(pageTranslations.chart.label1),
      lineColor: theme.colors['primary-30'],
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
        <div className="flex gap-8">
          <StatisticsCard
            label={t(pageTranslations.totalSupplied)}
            help={t(pageTranslations.totalSuppliedInfo)}
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
          <StatisticsCard
            label={t(pageTranslations.apy)}
            value={<AmountRenderer value={5.94} suffix="%" />}
          />
        </div>

        <Chart mockData={mockData} yLabel1="" />

        <div className="space-y-6">
          {/* heading */}
          <div className="flex gap-8">
            <Paragraph className="text-base">
              {t(pageTranslations.collateralUsage)}
            </Paragraph>
            <div className="flex gap-2 items-center">
              <Icon
                icon={IconNames.CHECK}
                className="text-positive h-3 w-3"
                size={16}
              />
              <span className="text-sm text-gray-30">
                {t(pageTranslations.canBeCollateral)}
              </span>
            </div>
          </div>

          {/* statistics */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 lg:justify-start lg:gap-8">
            <StatisticsCard
              label={t(pageTranslations.maxLtv)}
              help={t(pageTranslations.maxLtvInfo)}
              value={<AmountRenderer value={85.94} suffix="%" />}
            />
            <StatisticsCard
              label={t(pageTranslations.liquidationThreshold)}
              help={t(pageTranslations.liquidationThresholdInfo)}
              value={<AmountRenderer value={83.01} suffix="%" />}
            />
            <StatisticsCard
              label={t(pageTranslations.liquidationPenalty)}
              help={t(pageTranslations.liquidationPenaltyInfo)}
              value={<AmountRenderer value={5.0} suffix="%" />}
            />
          </div>
        </div>
      </div>
    </Accordion>
  );
};
