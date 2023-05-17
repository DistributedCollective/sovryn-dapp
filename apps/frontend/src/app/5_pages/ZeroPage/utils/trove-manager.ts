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

import { getLiquityBaseParams } from './';
import { getZeroProvider } from './zero-provider';

export const openTrove = async (
  token: SupportedTokens,
  params: Partial<TroveCreationParams<Decimalish>>,
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

  return {
    value: value.hex,
    fn: token === SupportedTokens.dllr ? 'openNueTrove' : 'openTrove',
    args: [fees?.maxBorrowingFeeRate.toHexString(), borrowZUSD.hex, ...hints],
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
    borrowZUSD && getLiquityBaseParams(),
  ]);

  const finalTrove = trove.adjust(
    normalized,
    fees?.minBorrowingFeeRate.toString(),
  );

  const value = depositCollateral ?? Decimal.ZERO;

  const hints = await ethers.populate.findHints(finalTrove);

  return {
    value: value.hex,
    fn: token === SupportedTokens.dllr ? 'adjustNueTrove' : 'adjustTrove',
    args: [
      fees?.maxBorrowingFeeRate.toHexString() ?? Decimal.ZERO.hex,
      (withdrawCollateral ?? Decimal.ZERO).hex,
      (borrowZUSD ?? repayZUSD ?? Decimal.ZERO).hex,
      !!borrowZUSD,
      ...hints,
    ],
  };
};
