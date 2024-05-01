import {
  Decimal,
  Decimalish,
  Trove,
  TroveAdjustmentParams,
  TroveCreationParams,
  _normalizeTroveAdjustment,
  _normalizeTroveCreation,
} from '@sovryn-zero/lib-base';

import { decimalic } from '../../../../utils/math';
import { getLiquityBaseParams } from './';
import { getZeroProvider } from './zero-provider';
import { COMMON_SYMBOLS } from '../../../../utils/asset';

export const openTrove = async (
  token: string,
  params: Partial<TroveCreationParams<Decimalish>>,
  maxBorrowingRate?: string,
) => {
  const normalized = _normalizeTroveCreation(params);
  const { depositCollateral, borrowZUSD } = normalized;

  const { ethers } = await getZeroProvider();
  const fees = borrowZUSD && (await getLiquityBaseParams());

  const newTrove = Trove.create(
    normalized,
    fees?.minBorrowingFeeRate.toString(),
  );

  const value = depositCollateral ?? Decimal.ZERO;

  const hints = await ethers.populate.findHints(newTrove);

  const borrowingRate = maxBorrowingRate
    ? decimalic(maxBorrowingRate).div(100).toHexString()
    : fees?.maxBorrowingFeeRate.toHexString();

  return {
    value: value.hex,
    fn:
      token.toUpperCase() === COMMON_SYMBOLS.DLLR
        ? 'openNueTrove'
        : 'openTrove',
    args: [borrowingRate, borrowZUSD.hex, ...hints],
  };
};

export const adjustTrove = async (
  token: string,
  address: string,
  params: Partial<TroveAdjustmentParams<Decimalish>>,
  maxBorrowingRate?: string,
) => {
  const normalized = _normalizeTroveAdjustment(params);
  const { depositCollateral, withdrawCollateral, borrowZUSD, repayZUSD } =
    normalized;

  const { ethers } = await getZeroProvider();

  const [trove, fees] = await Promise.all([
    ethers.getTrove(address),
    borrowZUSD && getLiquityBaseParams(),
  ]);

  const finalTrove = trove.adjust(
    normalized,
    fees?.minBorrowingFeeRate.toString(),
  );

  const value = depositCollateral ?? Decimal.ZERO;

  const hints = await ethers.populate.findHints(finalTrove);

  const borrowingRate = maxBorrowingRate
    ? decimalic(maxBorrowingRate).div(100).toHexString()
    : fees?.maxBorrowingFeeRate?.toHexString() ?? Decimal.ZERO.hex;

  return {
    value: value.hex,
    fn:
      token.toUpperCase() === COMMON_SYMBOLS.DLLR && repayZUSD
        ? 'adjustNueTroveWithPermit2'
        : 'adjustTrove',
    args: [
      borrowingRate,
      (withdrawCollateral ?? Decimal.ZERO).hex,
      (borrowZUSD ?? repayZUSD ?? Decimal.ZERO).hex,
      !!borrowZUSD,
      ...hints,
    ],
  };
};
