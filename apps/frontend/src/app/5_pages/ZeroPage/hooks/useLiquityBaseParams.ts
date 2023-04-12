import { useEffect, useState } from 'react';

import { _getContracts } from '@sovryn-zero/lib-ethers/dist/src/EthersLiquityConnection';
import { Decimal } from '@sovryn/utils';

import { getZeroProvider } from '../utils/zero-provider';

export const useLiquityBaseParams = () => {
  const [liquityBaseParams, setLiquityBaseParams] = useState({
    minBorrowingFeeRate: Decimal.ZERO,
    maxBorrowingFeeRate: Decimal.ZERO,
  });

  useEffect(() => {
    const getBorrowingFee = async () => {
      try {
        const { ethers } = await getZeroProvider();
        const contract = _getContracts(ethers.connection).liquityBaseParams;
        const [getMinBorrowingFee, getMaxBorrowingFee] = await Promise.all([
          contract.BORROWING_FEE_FLOOR(),
          contract.MAX_BORROWING_FEE(),
        ]);
        const minBorrowingFeeRate = Decimal.fromBigNumberString(
          String(getMinBorrowingFee),
        );
        const maxBorrowingFeeRate = Decimal.fromBigNumberString(
          String(getMaxBorrowingFee),
        );
        setLiquityBaseParams({
          minBorrowingFeeRate,
          maxBorrowingFeeRate,
        });
      } catch (error) {
        console.error(error);
      }
    };
    getBorrowingFee();
  }, []);

  return liquityBaseParams;
};
