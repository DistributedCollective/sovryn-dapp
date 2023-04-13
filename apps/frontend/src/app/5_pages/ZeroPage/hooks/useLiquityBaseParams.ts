import { useEffect, useState } from 'react';

import { Decimal } from '@sovryn-zero/lib-base';

import { getLiquityBaseParams } from '../utils/trove-manager';

export const useLiquityBaseParams = () => {
  const [liquityBaseParams, setLiquityBaseParams] = useState({
    minBorrowingFeeRate: Decimal.ZERO,
    maxBorrowingFeeRate: Decimal.ZERO,
  });

  useEffect(() => {
    const getBorrowingFee = async () => {
      try {
        const { minBorrowingFeeRate, maxBorrowingFeeRate } =
          await getLiquityBaseParams();
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
