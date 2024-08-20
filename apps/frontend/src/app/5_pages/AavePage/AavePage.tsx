import React, { FC, useMemo, useState } from 'react';

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
import { useAaveUserReservesData } from '../../../hooks/useAaveUserReservesData';
import { LendPosition } from './components/LendPositionsList/LendPositionsList.types';
import { BorrowPosition } from './components/BorrowPositionsList/BorrowPositionsList.types';
import { useAaveReservesData } from '../../../hooks/useAaveReservesData';
import { Decimal } from '@sovryn/utils';
import { BorrowPoolDetails } from './components/BorrowAssetsList/BorrowAssetsList.types';
import { LendPoolDetails } from './components/LendAssetsList/LendAssetsList.types';

const pageTranslations = translations.aavePage;

enum ActiveTab {
  LEND = 0,
  BORROW,
}

const AavePage: FC = () => {
  const { reserves } = useAaveReservesData();
  const { userReservesSummary } = useAaveUserReservesData();
  const [activeTab, setActiveTab] = useState<ActiveTab>(ActiveTab.LEND);

  const lendPositions: LendPosition[] = useMemo(() => {
    if (!userReservesSummary) return [];
    return userReservesSummary.suppliedAssets.map(s => ({
      asset: s.asset,
      apy: s.apy,
      supplied: s.supplied,
      suppliedUSD: s.suppliedUSD,
      collateral: s.isCollateral,
    }));
  }, [userReservesSummary]);

  const borrowPositions: BorrowPosition[] = useMemo(() => {
    if (!userReservesSummary) return [];
    return userReservesSummary.borrowedAssets.map(ba => ({
      asset: ba.asset,
      apy: ba.apy,
      borrowed: ba.borrowed,
      borrowedUSD: ba.borrowedUSD,
      apyType: ba.apyType,
    }));
  }, [userReservesSummary]);

  const borrowPools: BorrowPoolDetails[] = useMemo(() => {
    if (!userReservesSummary) {
      return reserves.map(r => ({
        asset: r.symbol,
        apy: Decimal.from(r.variableBorrowAPY).mul(100),
      }));
    } else {
      return reserves.map(r => ({
        asset: r.symbol,
        apy: Decimal.from(r.variableBorrowAPY).mul(100),
        available: userReservesSummary.borrowPower.div(r.priceInUSD),
        availableUSD: userReservesSummary.borrowPower,
      }));
    }
  }, [reserves, userReservesSummary]);

  const lendPools: LendPoolDetails[] = useMemo(
    () =>
      reserves.map(r => ({
        asset: r.symbol,
        apy: Decimal.from(r.supplyAPY).mul(100),
        canBeCollateral: r.usageAsCollateralEnabled,
      })),
    [reserves],
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

      <div className="pt-6 mt-6 space-y-6 lg:pt-0 lg:mt-0 lg:space-y-0">
        {/* Tab selector */}
        <Tabs
          className="w-full bg-gray-80 rounded p-1 border border-gray-60 lg:hidden"
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
          onChange={e => setActiveTab(e)}
          size={TabSize.normal}
          type={TabType.secondary}
        />

        {/* Lending and borrowing columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-5">
          <div
            className={classNames(
              { hidden: activeTab !== ActiveTab.LEND },
              'lg:block space-y-4',
            )}
          >
            <LendPositionsList
              lendPositions={lendPositions}
              supplyBalance={userReservesSummary?.supplyBalance}
              collateralBalance={userReservesSummary?.collateralBalance}
              supplyWeightedApy={userReservesSummary?.supplyWeightedApy}
            />
            <LendAssetsList lendPools={lendPools} />
          </div>

          {/* Borrowing column */}
          <div
            className={classNames(
              { hidden: activeTab !== ActiveTab.BORROW },
              'lg:block space-y-4',
            )}
          >
            <BorrowPositionsList
              eModeEnabled={userReservesSummary?.eModeEnabled ?? false}
              borrowPositions={borrowPositions}
              borrowBalance={userReservesSummary?.borrowBalance}
              borrowPowerUsed={userReservesSummary?.borrowPowerUsed}
              borrowWeightedApy={userReservesSummary?.borrowWeightedApy}
            />
            <BorrowAssetsList borrowPools={borrowPools} />
          </div>
        </div>
      </div>
    </div>
  );
};
export default AavePage;
