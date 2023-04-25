import {
  Decimal,
  Decimalish,
  Trove,
  TroveAdjustmentParams,
  TroveCreationParams,
  _normalizeTroveAdjustment,
  _normalizeTroveCreation,
} from '@sovryn-zero/lib-base';
import { SupportedTokens } from '@sovryn/contracts';

import { getZeroProvider } from './zero-provider';

const defaultBorrowingRateSlippageTolerance = 0.005; // 0.5%

export const openTrove = async (
  token: SupportedTokens,
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

  const hints = await ethers.populate.findHints(newTrove);

  return {
    value: value.hex,
    fn: token === SupportedTokens.dllr ? 'openNueTrove' : 'openTrove',
    args: [maxBorrowingRate.hex, borrowZUSD.hex, ...hints],
  };
};

export const adjustTrove = async (
  token: SupportedTokens,
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

  const hints = await ethers.populate.findHints(finalTrove);

  return {
    value: value.hex,
    fn: token === SupportedTokens.dllr ? 'adjustNueTrove' : 'adjustTrove',
    args: [
      maxBorrowingRate.hex,
      (withdrawCollateral ?? Decimal.ZERO).hex,
      (borrowZUSD ?? repayZUSD ?? Decimal.ZERO).hex,
      !!borrowZUSD,
      ...hints,
    ],
  };
};
