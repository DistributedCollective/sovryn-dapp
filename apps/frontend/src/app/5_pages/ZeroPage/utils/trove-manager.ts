import {
  Decimal,
  Decimalish,
  Trove,
  TroveAdjustmentParams,
  TroveCreationParams,
  _normalizeTroveAdjustment,
  _normalizeTroveCreation,
} from '@sovryn-zero/lib-base';

import { getZeroProvider } from './zero-provider';

const defaultBorrowingRateSlippageTolerance = 0.005; // 0.5%

export const openTrove = async (
  params: Partial<TroveCreationParams<Decimalish>>,
) => {
  const normalized = _normalizeTroveCreation(params);
  const { depositCollateral, borrowZUSD } = normalized;

  const { ethers } = await getZeroProvider();

  const fees = await ethers.getFees();
  const borrowingRate = fees.borrowingRate();
  const newTrove = Trove.create(normalized, borrowingRate);

  const maxBorrowingRate = borrowingRate.add(
    defaultBorrowingRateSlippageTolerance,
  );

  const value = depositCollateral ?? Decimal.ZERO;

  const hints = await getHints(newTrove);

  return {
    value: value.hex,
    args: [maxBorrowingRate.hex, borrowZUSD.hex, ...hints],
  };
};

export const adjustTrove = async (
  address: string,
  params: Partial<TroveAdjustmentParams<Decimalish>>,
) => {
  const normalized = _normalizeTroveAdjustment(params);
  const { depositCollateral, withdrawCollateral, borrowZUSD, repayZUSD } =
    normalized;

  const { ethers } = await getZeroProvider();

  const [trove, fees] = await Promise.all([
    ethers.getTrove(address),
    borrowZUSD && ethers.getFees(),
  ]);

  const borrowingRate = fees?.borrowingRate();
  const finalTrove = trove.adjust(normalized, borrowingRate);

  const maxBorrowingRate =
    borrowingRate?.add(defaultBorrowingRateSlippageTolerance) ?? Decimal.ZERO;

  const value = depositCollateral ?? Decimal.ZERO;

  const hints = await getHints(finalTrove);

  return {
    value: value.hex,
    args: [
      maxBorrowingRate.hex,
      (withdrawCollateral ?? Decimal.ZERO).hex,
      (borrowZUSD ?? repayZUSD ?? Decimal.ZERO).hex,
      !!borrowZUSD,
      ...hints,
    ],
  };
};

// todo: implement / use from lib when available
const getHints = (a: any): any => {
  return [];
};
