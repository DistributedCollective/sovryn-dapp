import React, { FC, useMemo, useState } from 'react';

import classNames from 'classnames';
import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';

import { Tabs, TabSize, TabType } from '@sovryn/ui';

import { useAaveReservesData } from '../../../hooks/aave/useAaveReservesData';
import { useAaveUserReservesData } from '../../../hooks/aave/useAaveUserReservesData';
import { translations } from '../../../locales/i18n';
import {
  normalizeBorrowPoolDetails,
  normalizeBorrowPositions,
  normalizeLendPoolDetails,
  normalizeLendPositions,
  tabsItems,
} from './AavePage.utils';
import { BorrowAssetsList } from './components/BorrowAssetsList/BorrowAssetsList';
import { BorrowPoolDetails } from './components/BorrowAssetsList/BorrowAssetsList.types';
import { BorrowPositionsList } from './components/BorrowPositionsList/BorrowPositionsList';
import { BorrowPosition } from './components/BorrowPositionsList/BorrowPositionsList.types';
import { LendAssetsList } from './components/LendAssetsList/LendAssetsList';
import { LendPoolDetails } from './components/LendAssetsList/LendAssetsList.types';
import { LendPositionsList } from './components/LendPositionsList/LendPositionsList';
import { LendPosition } from './components/LendPositionsList/LendPositionsList.types';
import { TopPanel } from './components/TopPanel/TopPanel';

const pageTranslations = translations.aavePage;

enum ActiveTab {
  LEND = 0,
  BORROW,
}

const AavePage: FC = () => {
  const { reserves, loading: reservesLoading } = useAaveReservesData();
  const { summary, loading: summaryLoading } = useAaveUserReservesData();
  const [activeTab, setActiveTab] = useState<ActiveTab>(ActiveTab.LEND);

  const lendPositions: LendPosition[] = useMemo(
    () => normalizeLendPositions(summary),
    [summary],
  );
  const borrowPositions: BorrowPosition[] = useMemo(
    () => normalizeBorrowPositions(summary),
    [summary],
  );
  const borrowPools: BorrowPoolDetails[] = useMemo(
    () => normalizeBorrowPoolDetails(reserves, summary),
    [reserves, summary],
  );
  const lendPools: LendPoolDetails[] = useMemo(
    () => normalizeLendPoolDetails(reserves, summary),
    [reserves, summary],
  );

  return (
    <div className="w-full pb-6 2xl:px-12">
      <Helmet>
        <title>{t(pageTranslations.meta.title)}</title>
      </Helmet>

      <TopPanel
        healthFactor={summary.healthFactor}
        netApy={summary.netApy}
        netWorth={summary.netWorth}
      />

      <div className="pt-6 mt-6 space-y-6 2xl:pt-0 2xl:mt-0 2xl:space-y-0">
        {/* Tab selector */}
        <Tabs
          className="w-full bg-gray-80 rounded p-1 border border-gray-60 2xl:hidden"
          index={activeTab}
          items={tabsItems}
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
            <LendPositionsList
              lendPositions={lendPositions}
              supplyBalance={summary.supplyBalance}
              collateralBalance={summary.collateralBalance}
              supplyWeightedApy={summary.supplyWeightedApy}
              loading={summaryLoading}
            />
            <LendAssetsList
              lendPools={lendPools}
              loading={reservesLoading || summaryLoading}
            />
          </div>

          {/* Borrowing column */}
          <div
            className={classNames(
              { hidden: activeTab !== ActiveTab.BORROW },
              '2xl:block space-y-4',
            )}
          >
            <BorrowPositionsList
              borrowPositions={borrowPositions}
              eModeCategoryId={summary.eModeCategoryId}
              borrowBalance={summary.borrowBalance}
              borrowPowerUsed={summary.borrowPowerUsed}
              borrowWeightedApy={summary.borrowWeightedApy}
              loading={summaryLoading}
            />
            <BorrowAssetsList
              borrowPools={borrowPools}
              eModeEnabled={summary.eModeEnabled}
              loading={reservesLoading || summaryLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default AavePage;
