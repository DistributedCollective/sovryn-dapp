import React, { FC, useMemo, useState } from 'react';

import { t } from 'i18next';

import { theme } from '@sovryn/tailwindcss-config';
import { Accordion, Link } from '@sovryn/ui';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { StatisticsCard } from '../../../../2_molecules/StatisticsCard/StatisticsCard';
import { config } from '../../../../../constants/aave';
import { useAaveInterestRatesData } from '../../../../../hooks/aave/useAaveRates';
import { Reserve } from '../../../../../hooks/aave/useAaveReservesData';
import { useIsMobile } from '../../../../../hooks/useIsMobile';
import { translations } from '../../../../../locales/i18n';
import { getBobExplorerUrl } from '../../../../../utils/helpers';
import { Chart } from './components/Chart/Chart';

const pageTranslations = translations.aaveReserveOverviewPage.interestRateModel;

type InterestRateModelGraphProps = {
  reserve: Reserve;
};

export const InterestRateModelGraph: FC<InterestRateModelGraphProps> = ({
  reserve,
}) => {
  const { isMobile } = useIsMobile();
  const interestRateStrategyUrl = useMemo(() => {
    return `${getBobExplorerUrl()}/address/${
      config.InterestRateStrategyAddress
    }`;
  }, []);

  const [open, setOpen] = useState<boolean>(true);
  const { data: rates } = useAaveInterestRatesData();

  const meta = {
    label: t(pageTranslations.chart.label1),
    lineColor: theme.colors['primary-30'],
  };

  if (!rates) return null;
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
                  precision={2}
                  suffix="%"
                />
              }
            />
            <Link
              href={interestRateStrategyUrl}
              text={t(pageTranslations.interestRateStrategy)}
            />
          </div>

          <Chart meta={meta} rates={rates} />
          {/* statistics */}
          <div className="flex gap-8">
            <StatisticsCard
              label={t(pageTranslations.reserveFactor)}
              help={t(pageTranslations.reserveFactorInfo)}
              value={
                <AmountRenderer
                  value={reserve.reserveFactor}
                  suffix="%"
                  precision={2}
                />
              }
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
