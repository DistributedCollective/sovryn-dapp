import React, { FC, useState } from 'react';

import classNames from 'classnames';
import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';

import { Tabs, TabSize, TabType } from '@sovryn/ui';

import { translations } from '../../../locales/i18n';
import { EModeDetails } from './components/EModeDetails/EModeDetails';
import { WalletOverview } from './components/WalletOverview/WalletOverview';

const pageTranslations = translations.aaveReserveOverviewPage;

enum OverviewTab {
  RESERVE = 0,
  WALLET,
}

const AaveReserveOverviewPage: FC = () => {
  const [activeOverviewTab, setActiveOverviewTab] = useState<OverviewTab>(
    OverviewTab.RESERVE,
  );

  return (
    <div className="w-full pb-6 2xl:px-12">
      <Helmet>
        <title>{t(pageTranslations.meta.title)}</title>
      </Helmet>

      {/* TODO: <TopPanel /> */}

      <div className="pt-6 mt-6 space-y-6 lg:pt-0 lg:mt-0 lg:space-y-0 w-full">
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
        <div className="grid grid-cols-1 lg:gap-5 lg:grid-cols-[auto_465px]">
          <div
            className={classNames(
              { hidden: activeOverviewTab !== OverviewTab.RESERVE },
              'lg:block space-y-4 w-full',
            )}
          >
            <EModeDetails />
          </div>

          {/* wallet column */}
          <div
            className={classNames(
              { hidden: activeOverviewTab !== OverviewTab.WALLET },
              'lg:block space-y-4',
            )}
          >
            <WalletOverview asset="ETH" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AaveReserveOverviewPage;
