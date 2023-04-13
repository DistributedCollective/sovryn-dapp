import {
  Decimal,
  Decimalish,
  Trove,
  TroveAdjustmentParams,
  TroveCreationParams,
  _normalizeTroveAdjustment,
  _normalizeTroveCreation,
} from '@sovryn-zero/lib-base';
import { _getContracts } from '@sovryn-zero/lib-ethers/dist/src/EthersLiquityConnection';
import { SupportedTokens } from '@sovryn/contracts';

import { getZeroProvider } from './zero-provider';

interface ILiquityBaseParams {
  minBorrowingFeeRate: Decimal;
  maxBorrowingFeeRate: Decimal;
}

let cachedParams: ILiquityBaseParams | undefined;

export const getLiquityBaseParams = async (): Promise<ILiquityBaseParams> => {
  if (cachedParams) {
    return cachedParams;
  }

  try {
    const { ethers } = await getZeroProvider();
    const contract = _getContracts(ethers.connection).liquityBaseParams;

    const [minBorrowingFee, maxBorrowingFee] = await Promise.all([
      contract.BORROWING_FEE_FLOOR(),
      contract.MAX_BORROWING_FEE(),
    ]);

    const minBorrowingFeeRate = Decimal.fromBigNumberString(
      minBorrowingFee.toString(),
    );
    const maxBorrowingFeeRate = Decimal.fromBigNumberString(
      maxBorrowingFee.toString(),
    );

    const params = {
      minBorrowingFeeRate,
      maxBorrowingFeeRate,
    };

    cachedParams = params;

    return params;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const openTrove = async (
  token: SupportedTokens,
  params: Partial<TroveCreationParams<Decimalish>>,
) => {
  const normalized = _normalizeTroveCreation(params);
  const { depositCollateral, borrowZUSD } = normalized;

  const { ethers } = await getZeroProvider();
  const fees = borrowZUSD && (await getLiquityBaseParams());

  const newTrove = Trove.create(normalized, fees?.minBorrowingFeeRate);

  const value = depositCollateral ?? Decimal.ZERO;

  const hints = await ethers.populate.findHints(newTrove);

  return {
    value: value.hex,
    fn: token === SupportedTokens.dllr ? 'openNueTrove' : 'openTrove',
    args: [fees?.maxBorrowingFeeRate, borrowZUSD.hex, ...hints],
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

  const finalTrove = trove.adjust(normalized, fees?.minBorrowingFeeRate);

  const value = depositCollateral ?? Decimal.ZERO;

  const hints = await ethers.populate.findHints(finalTrove);

  return {
    value: value.hex,
    fn: token === SupportedTokens.dllr ? 'adjustNueTrove' : 'adjustTrove',
    args: [
      fees?.maxBorrowingFeeRate,
      (withdrawCollateral ?? Decimal.ZERO).hex,
      (borrowZUSD ?? repayZUSD ?? Decimal.ZERO).hex,
      !!borrowZUSD,
      ...hints,
    ],
  };
};
