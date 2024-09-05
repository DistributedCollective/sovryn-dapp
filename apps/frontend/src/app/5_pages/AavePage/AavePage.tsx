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

enum ActiveTab {
  LEND = 0,
  BORROW,
}

const AavePage: FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>(ActiveTab.LEND);

  return (
    <div className="w-full pb-6 2xl:px-12">
      <Helmet>
        <title>{t(pageTranslations.meta.title)}</title>
      </Helmet>

      <TopPanel />

      <div className="pt-6 mt-6 space-y-6 2xl:pt-0 2xl:mt-0 2xl:space-y-0">
        {/* Tab selector */}
        <Tabs
          className="w-full bg-gray-80 rounded p-1 border border-gray-60 2xl:hidden"
          index={activeTab}
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
          onChange={setActiveTab}
          size={TabSize.normal}
          type={TabType.secondary}
        />

        {/* Lending and borrowing columns */}
        <div className="grid grid-cols-1 2xl:grid-cols-2 2xl:gap-5">
          <div
            className={classNames(
              { hidden: activeTab !== ActiveTab.LEND },
              '2xl:block space-y-4',
            )}
          >
            <LendPositionsList />
            <LendAssetsList />
          </div>

          {/* Borrowing column */}
          <div
            className={classNames(
              { hidden: activeTab !== ActiveTab.BORROW },
              '2xl:block space-y-4',
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
