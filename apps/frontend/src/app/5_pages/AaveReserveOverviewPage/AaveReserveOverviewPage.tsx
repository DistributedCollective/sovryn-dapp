import React, { FC, useMemo, useState } from 'react';

import classNames from 'classnames';
import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';

import { Paragraph, Tabs, TabSize, TabType } from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { useAaveInterestRatesData } from '../../../hooks/aave/useAaveRates';
import { useAaveReservesData } from '../../../hooks/aave/useAaveReservesData';
import { translations } from '../../../locales/i18n';
import { BorrowDetailsGraph } from './components/BorrowDetailsGraph/BorrowDetailsGraph';
import { EModeDetails } from './components/EModeDetails/EModeDetails';
import { InterestRateModelGraph } from './components/InterestRateModelGraph/InterestRateModelGraph';
import { SupplyDetailsGraph } from './components/SupplyDetailsGraph/SupplyDetailsGraph';
import { ReserveOverview, TopPanel } from './components/TopPanel/TopPanel';
import { WalletOverview } from './components/WalletOverview/WalletOverview';

const pageTranslations = translations.aaveReserveOverviewPage;

enum OverviewTab {
  RESERVE = 0,
  WALLET,
}

const AaveReserveOverviewPage: FC = () => {
  const [searchParams] = useSearchParams();
  const symbol = searchParams.get('asset') || 'ETH';
  const { reserves } = useAaveReservesData();
  const { data: interestRatesData } = useAaveInterestRatesData();
  const [activeOverviewTab, setActiveOverviewTab] = useState<OverviewTab>(
    OverviewTab.RESERVE,
  );

  const reserve = useMemo(
    () => reserves.find(r => r.symbol.toLowerCase() === symbol.toLowerCase()),
    [reserves, symbol],
  );

  const reserveOverview: ReserveOverview = useMemo(() => {
    if (!reserve) {
      return {
        symbol,
        name: symbol,
        underlyingAsset: '',
        aTokenAddress: '',
        variableDebtTokenAddress: '',
        stableDebtTokenAddress: '',
        reserveSize: Decimal.from(0),
        availableLiquidity: Decimal.from(0),
        utilizationRate: Decimal.from(0),
        oraclePrice: Decimal.from(0),
        oracleAddress: '',
      };
    }

    return {
      symbol: reserve.symbol,
      name: reserve.name,
      underlyingAsset: reserve.underlyingAsset,
      aTokenAddress: reserve.aTokenAddress,
      variableDebtTokenAddress: reserve.variableDebtTokenAddress,
      stableDebtTokenAddress: reserve.stableDebtTokenAddress,
      reserveSize: Decimal.from(reserve?.availableLiquidityUSD ?? 0).add(
        reserve?.totalDebtUSD ?? 0,
      ),
      availableLiquidity: Decimal.from(reserve.availableLiquidityUSD),
      utilizationRate: Decimal.from(reserve.borrowUsageRatio),
      oraclePrice: Decimal.from(reserve.priceInUSD),
      oracleAddress: reserve.priceOracle,
    };
  }, [reserve, symbol]);

  return (
    <div className="w-full pb-6 2xl:px-12">
      <Helmet>
        <title>{t(pageTranslations.meta.title)}</title>
      </Helmet>

      <TopPanel
        reserve={reserveOverview}
        className="lg:mb-[110px] lg:mt-[52px]"
      />

      <Paragraph className="text-base mb-4 hidden lg:block">
        {t(pageTranslations.reserveStatusTab.fullTitle)}
      </Paragraph>

      <div className="pt-6 space-y-6 lg:pt-0 lg:space-y-0 w-full">
        <Tabs
          className="w-full bg-gray-80 rounded p-1 border border-gray-60 lg:hidden"
          index={activeOverviewTab}
          items={[
            {
              activeClassName: 'text-primary-20',
              dataAttribute: 'reserve-status',
              label: t(pageTranslations.reserveStatusTab.title),
            },
            {
              activeClassName: 'text-primary-20',
              dataAttribute: 'your-wallet',
              label: t(pageTranslations.yourWalletTab.title),
            },
          ]}
          onChange={e => setActiveOverviewTab(e)}
          size={TabSize.normal}
          type={TabType.secondary}
        />

        {/* reserve graphics columns */}
        <div className="flex gap-5">
          <div
            className={classNames(
              { hidden: activeOverviewTab !== OverviewTab.RESERVE },
              'lg:block space-y-4 flex-grow w-min',
            )}
          >
            <SupplyDetailsGraph />
            <BorrowDetailsGraph />
            <EModeDetails />
            {interestRatesData && (
              <InterestRateModelGraph rates={interestRatesData} />
            )}
          </div>

          {/* wallet column */}
          <div
            className={classNames(
              { hidden: activeOverviewTab !== OverviewTab.WALLET },
              'lg:block space-y-4 w-[450px] shrink-0',
            )}
          >
            <WalletOverview asset={{ symbol: 'btc', name: 'bitcoin' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AaveReserveOverviewPage;
