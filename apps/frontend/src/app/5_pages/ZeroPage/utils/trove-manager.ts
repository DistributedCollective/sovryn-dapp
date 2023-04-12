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
import { Decimal as UtilsDecimal } from '@sovryn/utils';

import { decimalic } from '../../../../utils/math';
import { getZeroProvider } from './zero-provider';

export const openTrove = async (
  token: SupportedTokens,
  params: Partial<TroveCreationParams<Decimalish>>,
  minBorrowingFeeRate: UtilsDecimal,
  maxBorrowingFeeRate: UtilsDecimal,
) => {
  const normalized = _normalizeTroveCreation(params);
  const { depositCollateral, borrowZUSD } = normalized;

  const { ethers } = await getZeroProvider();
  const newTrove = Trove.create(
    normalized,
    decimalic(minBorrowingFeeRate).toString(),
  );

  const value = depositCollateral ?? Decimal.ZERO;

  const hints = await ethers.populate.findHints(newTrove);

  return {
    value: value.hex,
    fn: token === SupportedTokens.dllr ? 'openNueTrove' : 'openTrove',
    args: [maxBorrowingFeeRate.toHexString(), borrowZUSD.hex, ...hints],
  };
};

export const adjustTrove = async (
  token: SupportedTokens,
  address: string,
  params: Partial<TroveAdjustmentParams<Decimalish>>,
  minBorrowingFeeRate: UtilsDecimal,
  maxBorrowingFeeRate: UtilsDecimal,
) => {
  const normalized = _normalizeTroveAdjustment(params);
  const { depositCollateral, withdrawCollateral, borrowZUSD, repayZUSD } =
    normalized;

  const { ethers } = await getZeroProvider();

  const [trove] = await Promise.all([
    ethers.getTrove(address),
    borrowZUSD && ethers.getFees(),
  ]);

  const finalTrove = trove.adjust(
    normalized,
    decimalic(minBorrowingFeeRate).toString(),
  );

  const value = depositCollateral ?? Decimal.ZERO;

  const hints = await ethers.populate.findHints(finalTrove);

  return {
    value: value.hex,
    fn: token === SupportedTokens.dllr ? 'adjustNueTrove' : 'adjustTrove',
    args: [
      maxBorrowingFeeRate.toHexString(),
      (withdrawCollateral ?? Decimal.ZERO).hex,
      (borrowZUSD ?? repayZUSD ?? Decimal.ZERO).hex,
      !!borrowZUSD,
      ...hints,
    ],
  };
};
