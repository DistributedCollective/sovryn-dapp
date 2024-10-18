import React, { FC, useMemo, useState } from 'react';

import { t } from 'i18next';
import { useSearchParams } from 'react-router-dom';

import { theme } from '@sovryn/tailwindcss-config';
import { Accordion, Link } from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { StatisticsCard } from '../../../../2_molecules/StatisticsCard/StatisticsCard';
import { AAVE_CONTRACT_ADDRESSES } from '../../../../../constants/aave';
import { useAaveInterestRatesData } from '../../../../../hooks/aave/useAaveRates';
import { Reserve } from '../../../../../hooks/aave/useAaveReservesData';
import { useIsMobile } from '../../../../../hooks/useIsMobile';
import { translations } from '../../../../../locales/i18n';
import { COMMON_SYMBOLS } from '../../../../../utils/asset';
import { getBobExplorerUrl } from '../../../../../utils/helpers';
import { Chart } from './components/Chart/Chart';

const pageTranslations = translations.aaveReserveOverviewPage.interestRateModel;

type InterestRateModelGraphProps = {
  reserve: Reserve;
};

export const InterestRateModelGraph: FC<InterestRateModelGraphProps> = ({
  reserve,
}) => {
  const [searchParams] = useSearchParams();
  const symbol = searchParams.get('asset') || COMMON_SYMBOLS.ETH;
  const { data: rates } = useAaveInterestRatesData(symbol);
  const { isMobile } = useIsMobile();
  const [open, setOpen] = useState(true);

  const interestRateStrategyUrl = useMemo(
    () =>
      `${getBobExplorerUrl()}/address/${rates?.interestRateStrategyAddress}`,
    [rates?.interestRateStrategyAddress],
  );

  const collectorContractUrl = useMemo(
    () => `${getBobExplorerUrl()}/address/${AAVE_CONTRACT_ADDRESSES.TREASURY}`,
    [],
  );

  const currentUsageRatio = useMemo(
    () => Decimal.from(reserve.borrowUsageRatio).mul(100),
    [reserve.borrowUsageRatio],
  );

  if (!rates || !reserve.borrowingEnabled) {
    return null;
  }
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
      <div className="space-y-8 pt-2">
        <div className="flex justify-between items-end">
          <StatisticsCard
            label={t(pageTranslations.utilizationRate)}
            value={
              <AmountRenderer
                value={currentUsageRatio}
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

        <Chart
          meta={{
            label: t(pageTranslations.chart.aprVarLabel),
            lineColor: theme.colors['primary-30'],
          }}
          rates={rates}
        />

        {/* statistics */}
        <div className="flex gap-8">
          <StatisticsCard
            label={t(pageTranslations.reserveFactor)}
            help={t(pageTranslations.reserveFactorInfo)}
            value={
              <AmountRenderer
                value={Decimal.from(reserve.reserveFactor).mul(100)}
                suffix="%"
                precision={2}
              />
            }
          />
          <StatisticsCard
            label={t(pageTranslations.collectorContract)}
            value={
              <Link
                openNewTab
                href={collectorContractUrl}
                text={t(pageTranslations.viewContract)}
              />
            }
          />
        </div>
      </div>
    </Accordion>
  );
};
