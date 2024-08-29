import { Decimal } from '@sovryn/utils';

import { ReserveData } from '../../../hooks/aave/useAaveReservesData';
import { BorrowRateMode } from '../../../types/aave';
import { AaveUserReservesSummary } from '../../../utils/aave/AaveUserReservesSummary';
import { BorrowPosition } from './components/BorrowPositionsList/BorrowPositionsList.types';
import { LendPosition } from './components/LendPositionsList/LendPositionsList.types';

export function normalizeLendPositions(
  userReservesSummary: AaveUserReservesSummary,
): LendPosition[] {
  return userReservesSummary.reserves
    .filter(r => r.supplied.gt(0))
    .map(s => ({
      asset: s.reserve.symbol,
      apy: Decimal.from(s.reserve.variableBorrowAPY),
      supplied: s.supplied,
      suppliedUSD: s.suppliedUSD,
      collateral: s.collateral,
    }));
}

export function normalizeBorrowPositions(
  userReservesSummary: AaveUserReservesSummary,
): BorrowPosition[] {
  return userReservesSummary.reserves
    .filter(r => r.borrowed.gt(0))
    .map(r => ({
      asset: r.reserve.symbol,
      apy: Decimal.from(
        r.borrowRateMode === BorrowRateMode.STABLE
          ? Decimal.from(r.reserve.stableBorrowAPY).mul(100)
          : Decimal.from(r.reserve.variableBorrowAPY).mul(100),
      ),
      borrowed: r.borrowed,
      borrowedUSD: r.borrowedUSD,
      type: r.borrowRateMode,
    }));
}

export function normalizeBorrowPoolDetails(
  reserves: ReserveData,
  userReservesSummary: AaveUserReservesSummary,
) {
  if (userReservesSummary.reserves.length === 0) {
    return reserves
      .filter(r => r.borrowingEnabled)
      .map(r => ({
        asset: r.symbol,
        apy: Decimal.from(r.variableBorrowAPY).mul(100),
      }));
  } else {
    return reserves
      .filter(r => r.borrowingEnabled)
      .map(r => ({
        asset: r.symbol,
        apy: Decimal.from(r.variableBorrowAPY).mul(100),
        available: userReservesSummary.borrowPower.div(r.priceInUSD),
        availableUSD: userReservesSummary.borrowPower,
      }));
  }
}

export function normalizeLendPoolDetails(
  reserves: ReserveData,
  userReservesSummary: AaveUserReservesSummary,
) {
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
}
