import React, { FC, useState } from 'react';

import classNames from 'classnames';
import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';

import { Tabs, TabSize, TabType } from '@sovryn/ui';

import { translations } from '../../../locales/i18n';
import { BorrowAssetsList } from './components/BorrowAssetsList/BorrowAssetsList';
import { BorrowPositionsList } from './components/BorrowPositionsList/BorrowPositionsList';
import { LendAssetsList } from './components/LendAssetsList/LendAssetsList';
import { LendPositionsList } from './components/LendPositionsList/LendPositionsList';
import { TopPanel } from './components/TopPanel/TopPanel';

const pageTranslations = translations.aavePage;

enum LiquidityTabs {
  LEND = 0,
  BORROW,
}

const AavePage: FC = () => {
  const [activeLiquidityTab, setActiveLiquidityTab] = useState<LiquidityTabs>(
    LiquidityTabs.LEND,
  );

  return (
    <div className="w-full pb-6 2xl:px-12">
      <Helmet>
        <title>{t(pageTranslations.meta.title)}</title>
      </Helmet>

      <TopPanel />

      <div className="pt-6 mt-6 space-y-6 lg:pt-0 lg:mt-0 lg:space-y-0">
        {/* Tab selector */}
        <Tabs
          className="w-full bg-gray-80 rounded p-1 border border-gray-60 lg:hidden"
          index={activeLiquidityTab}
          items={[
            {
              activeClassName: 'text-primary-20',
              dataAttribute: 'lending',
              label: t(pageTranslations.common.lend),
            },
            {
              activeClassName: 'text-primary-20',
              dataAttribute: 'borrowing',
              label: t(pageTranslations.common.borrow),
            },
          ]}
          onChange={e => setActiveLiquidityTab(e)}
          size={TabSize.normal}
          type={TabType.secondary}
        />

        {/* Lending and borrowing columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-5">
          <div
            className={classNames(
              { hidden: activeLiquidityTab !== LiquidityTabs.LEND },
              'lg:block space-y-4',
            )}
          >
            <LendPositionsList />
            <LendAssetsList />
          </div>

          {/* Borrowing column */}
          <div
            className={classNames(
              { hidden: activeLiquidityTab !== LiquidityTabs.BORROW },
              'lg:block space-y-4',
            )}
          >
            <BorrowPositionsList />
            <BorrowAssetsList />
          </div>
        </div>
      </div>
    </div>
  );
};
export default AavePage;
