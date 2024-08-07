import React, { FC, useState } from 'react';

import classNames from 'classnames';
import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';

import { Tabs, TabSize, TabType } from '@sovryn/ui';

import { useAccount } from '../../../hooks/useAccount';
import { translations } from '../../../locales/i18n';
import { BorrowingPositionsList } from './components/BorrowingPositionsList/BorrowingPositionsList';
import { LendingPositionsList } from './components/LendingPositionsList/LendingPositionsList';
import { TopPanel } from './components/TopPanel/TopPanel';

enum LiquidityTabs {
  LEND = 0,
  BORROW,
}

const AavePage: FC = () => {
  const { account } = useAccount();
  const [activeLiquidityTab, setActiveLiquidityTab] = useState<LiquidityTabs>(
    LiquidityTabs.BORROW,
  );

  return (
    <div className="w-full">
      <Helmet>
        <title>{t(translations.aavePage.meta.title)}</title>
      </Helmet>

      <TopPanel account={account} />

      <div className="pt-6 mt-6 space-y-6">
        {/* Tab selector */}
        <div className="bg-gray-80 rounded p-1 border border-gray-60">
          <Tabs
            className="w-full"
            index={activeLiquidityTab}
            items={[
              {
                activeClassName: 'text-primary-20',
                dataAttribute: 'lending',
                label: 'Lend', // TODO: translations
              },
              {
                activeClassName: 'text-primary-20',
                dataAttribute: 'borrowing',
                label: 'Borrow', // TODO: translations
              },
            ]}
            onChange={e => setActiveLiquidityTab(e)}
            size={TabSize.normal}
            type={TabType.secondary}
          />
        </div>

        {/* Lending and borrowing columns */}
        <div>
          {/* Lending column */}
          <div
            className={classNames(
              activeLiquidityTab !== LiquidityTabs.LEND ? 'hidden' : '',
            )}
          >
            <LendingPositionsList />
            {/* LendingAssetsList */}
          </div>

          {/* Borrowing column */}
          <div
            className={classNames(
              activeLiquidityTab !== LiquidityTabs.BORROW ? 'hidden' : '',
            )}
          >
            <BorrowingPositionsList />

            {/* BorrowAssetsList */}
          </div>
        </div>
      </div>
    </div>
  );
};
export default AavePage;
