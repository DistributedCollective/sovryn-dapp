import { useEffect, useState } from 'react';

import { Decimal } from '@sovryn/utils';

import { LiquityBaseParams } from '../types';
import { getLiquityBaseParams } from '../utils';

export const useLiquityBaseParams = () => {
  const [liquityBaseParams, setLiquityBaseParams] = useState<LiquityBaseParams>(
    {
      minBorrowingFeeRate: Decimal.ZERO,
      maxBorrowingFeeRate: Decimal.ZERO,
    },
  );

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
