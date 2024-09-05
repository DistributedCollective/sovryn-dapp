import React, { FC, useState } from 'react';

import { t } from 'i18next';

import { theme } from '@sovryn/tailwindcss-config';
import { Accordion, Link } from '@sovryn/ui';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { StatisticsCard } from '../../../../2_molecules/StatisticsCard/StatisticsCard';
import { IRatesDataResult } from '../../../../../hooks/aave/useAaveRates';
import { useIsMobile } from '../../../../../hooks/useIsMobile';
import { translations } from '../../../../../locales/i18n';
import { Chart } from './components/Chart/Chart';

const pageTranslations = translations.aaveReserveOverviewPage.interestRateModel;

type InterestRateModelGraphProps = {
  rates: IRatesDataResult;
};

export const InterestRateModelGraph: FC<InterestRateModelGraphProps> = ({
  rates,
}) => {
  const [open, setOpen] = useState<boolean>(true);
  const { isMobile } = useIsMobile();

  const meta = {
    label: t(pageTranslations.chart.label1),
    lineColor: theme.colors['primary-30'],
  };

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
      dataAttribute="interest-rate-model"
    >
      {rates && (
        <div className="space-y-8 pt-2">
          <div className="flex justify-between items-end">
            <StatisticsCard
              label={t(pageTranslations.utilizationRate)}
              value={
                <AmountRenderer
                  value={parseFloat(rates.currentUsageRatio) * 100}
                  suffix="%"
                />
              }
            />
            <Link href="#" text={t(pageTranslations.interestRateStrategy)} />
          </div>

          <Chart meta={meta} rates={rates} />
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
      )}
    </Accordion>
  );
};
