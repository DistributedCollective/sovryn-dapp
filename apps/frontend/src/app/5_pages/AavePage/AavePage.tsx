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
  const reserves = useAaveReservesData();
  const userReservesSummary = useAaveUserReservesData();
  const [activeTab, setActiveTab] = useState<ActiveTab>(ActiveTab.LEND);

  const lendPositions: LendPosition[] = useMemo(
    () => normalizeLendPositions(userReservesSummary),
    [userReservesSummary],
  );
  const borrowPositions: BorrowPosition[] = useMemo(
    () => normalizeBorrowPositions(userReservesSummary),
    [userReservesSummary],
  );
  const borrowPools: BorrowPoolDetails[] = useMemo(
    () => normalizeBorrowPoolDetails(reserves, userReservesSummary),
    [reserves, userReservesSummary],
  );
  const lendPools: LendPoolDetails[] = useMemo(
    () => normalizeLendPoolDetails(reserves, userReservesSummary),
    [reserves, userReservesSummary],
  );

  const tabsItems = useMemo(
    () => [
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
    ],
    [],
  );

  return (
    <div className="w-full pb-6 2xl:px-12">
      <Helmet>
        <title>{t(pageTranslations.meta.title)}</title>
      </Helmet>

      <TopPanel
        healthFactor={userReservesSummary?.healthFactor}
        netApy={userReservesSummary?.netApy}
        netWorth={userReservesSummary?.netWorth}
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
              supplyBalance={userReservesSummary.supplyBalance}
              collateralBalance={userReservesSummary.collateralBalance}
              supplyWeightedApy={userReservesSummary.supplyWeightedApy}
            />
            <LendAssetsList lendPools={lendPools} />
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
              eModeEnabled={userReservesSummary.eModeEnabled}
              borrowBalance={userReservesSummary.borrowBalance}
              borrowPowerUsed={userReservesSummary.borrowPowerUsed}
              borrowWeightedApy={userReservesSummary.borrowWeightedApy}
            />
            <BorrowAssetsList borrowPools={borrowPools} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AavePage;
