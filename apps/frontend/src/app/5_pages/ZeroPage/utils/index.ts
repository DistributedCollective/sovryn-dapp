import { _getContracts } from '@sovryn-zero/lib-ethers/dist/src/EthersLiquityConnection';
import { Decimal } from '@sovryn/utils';

import { LiquityBaseParams } from '../types';
import { getZeroProvider } from './zero-provider';

let cachedParams: LiquityBaseParams | undefined;

export const getLiquityBaseParams = async (): Promise<LiquityBaseParams> => {
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

    cachedParams = {
      minBorrowingFeeRate,
      maxBorrowingFeeRate,
    };
    return cachedParams;
  } catch (error) {
    throw error;
  }
};
