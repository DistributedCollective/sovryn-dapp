import React, { FC, useMemo, useState } from 'react';

import classNames from 'classnames';
import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';

import { Paragraph, Tabs, TabSize, TabType } from '@sovryn/ui';

import { useAaveReservesData } from '../../../hooks/aave/useAaveReservesData';
import { translations } from '../../../locales/i18n';
import { BorrowDetailsGraph } from './components/BorrowDetailsGraph/BorrowDetailsGraph';
import { EModeDetails } from './components/EModeDetails/EModeDetails';
import { InterestRateModelGraph } from './components/InterestRateModelGraph/InterestRateModelGraph';
import { SupplyDetailsGraph } from './components/SupplyDetailsGraph/SupplyDetailsGraph';
import { TopPanel } from './components/TopPanel/TopPanel';
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
  const [activeOverviewTab, setActiveOverviewTab] = useState<OverviewTab>(
    OverviewTab.RESERVE,
  );

  const reserve = useMemo(
    () => reserves.find(r => r.symbol.toLowerCase() === symbol.toLowerCase()),
    [reserves, symbol],
  );

  if (!reserve) return null;
  return (
    <div className="w-full pb-6 2xl:px-12">
      <Helmet>
        <title>{t(pageTranslations.meta.title)}</title>
      </Helmet>

      <TopPanel reserve={reserve} className="lg:mb-[110px] lg:mt-[52px]" />

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
            <SupplyDetailsGraph reserve={reserve} history={[]} />

            <BorrowDetailsGraph reserve={reserve} history={[]} />

            <EModeDetails reserve={reserve} />

            <InterestRateModelGraph reserve={reserve} />
          </div>

          {/* wallet column */}
          <div
            className={classNames(
              { hidden: activeOverviewTab !== OverviewTab.WALLET },
              'lg:block space-y-4 w-[450px] shrink-0',
            )}
          >
            <WalletOverview symbol={symbol} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AaveReserveOverviewPage;
