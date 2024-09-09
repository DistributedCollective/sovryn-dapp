import { t } from 'i18next';

import { Decimal } from '@sovryn/utils';

import { Reserve } from '../../../hooks/aave/useAaveReservesData';
import { translations } from '../../../locales/i18n';
import { BorrowRateMode } from '../../../types/aave';
import { AaveUserReservesSummary } from '../../../utils/aave/AaveUserReservesSummary';
import { BorrowPoolDetails } from './components/BorrowAssetsList/BorrowAssetsList.types';
import { BorrowPosition } from './components/BorrowPositionsList/BorrowPositionsList.types';
import { LendPoolDetails } from './components/LendAssetsList/LendAssetsList.types';
import { LendPosition } from './components/LendPositionsList/LendPositionsList.types';

export const tabsItems = [
  {
    activeClassName: 'text-primary-20',
    dataAttribute: 'lending',
    label: t(translations.aavePage.common.lend),
  },
  {
    activeClassName: 'text-primary-20',
    dataAttribute: 'borrowing',
    label: t(translations.aavePage.common.borrow),
  },
];

export const normalizeLendPositions = (
  userReservesSummary: AaveUserReservesSummary,
): LendPosition[] => {
  return userReservesSummary.reserves.reduce((acc, r) => {
    if (r.supplied.gt(0)) {
      acc.push({
        asset: r.reserve.symbol,
        apy: Decimal.from(r.reserve.variableBorrowAPY),
        supplied: r.supplied,
        suppliedUSD: r.suppliedUSD,
        collateral: r.collateral,
      });
    }
    return acc;
  }, [] as LendPosition[]);
};

export const normalizeBorrowPositions = (
  userReservesSummary: AaveUserReservesSummary,
): BorrowPosition[] => {
  return userReservesSummary.reserves.reduce((acc, r) => {
    if (r.borrowed.gt(0)) {
      acc.push({
        asset: r.reserve.symbol,
        apy: Decimal.from(
          r.borrowRateMode === BorrowRateMode.STABLE
            ? Decimal.from(r.reserve.stableBorrowAPY).mul(100)
            : Decimal.from(r.reserve.variableBorrowAPY).mul(100),
        ),
        borrowRateMode: r.borrowRateMode,
        stableApy: Decimal.from(r.reserve.stableBorrowAPY).mul(100),
        variableApy: Decimal.from(r.reserve.variableBorrowAPY).mul(100),
        stableBorrowEnabled: r.reserve.stableBorrowRateEnabled,
        borrowed: r.borrowed,
        borrowedUSD: r.borrowedUSD,
        isCollateral: r.collateral,
      });
    }
    return acc;
  }, [] as BorrowPosition[]);
};

export const normalizeBorrowPoolDetails = (
  reserves: Reserve[],
  userReservesSummary: AaveUserReservesSummary,
): BorrowPoolDetails[] => {
  if (userReservesSummary.reserves.length === 0) {
    return reserves.reduce((acc, r) => {
      if (r.borrowingEnabled) {
        acc.push({
          asset: r.symbol,
          apy: Decimal.from(r.variableBorrowAPY).mul(100),
        });
      }
      return acc;
    }, [] as BorrowPoolDetails[]);
  } else {
    return reserves.reduce((acc, r) => {
      // skip borrow pools that are not enabled
      if (!r.borrowingEnabled) {
        return acc;
      }

      // skip borrow pools that are not enabled for the user
      if (
        userReservesSummary.eModeCategoryId !== r.eModeCategoryId &&
        userReservesSummary.eModeCategoryId !== 0
      ) {
        return acc;
      }

      const userSummary = userReservesSummary.reserves.find(
        userReserve => r.symbol === userReserve.asset,
      );
      acc.push({
        asset: r.symbol,
        apy: Decimal.from(r.variableBorrowAPY).mul(100),
        available: userSummary?.availableToBorrow,
        availableUSD: userSummary?.availableToBorrowUSD,
      });

      return acc;
    }, [] as BorrowPoolDetails[]);
  }
};

export const normalizeLendPoolDetails = (
  reserves: Reserve[],
  userReservesSummary: AaveUserReservesSummary,
): LendPoolDetails[] => {
  if (userReservesSummary.reserves.length === 0) {
    return reserves.map(r => ({
      asset: r.symbol,
      apy: Decimal.from(r.supplyAPY).mul(100),
      canBeCollateral: r.usageAsCollateralEnabled,
      walletBalance: Decimal.from(0),
    }));
  } else {
    return userReservesSummary.reserves.map(r => ({
      asset: r.reserve.symbol,
      apy: Decimal.from(r.reserve.supplyAPY).mul(100),
      canBeCollateral: r.reserve.usageAsCollateralEnabled,
      walletBalance: r.walletBalance,
    }));
  }
};
