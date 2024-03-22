import { useCallback, useEffect, useState } from 'react';

import { BigNumber } from 'ethers';

import { Decimal } from '@sovryn/utils';

import { useLoadContract } from '../../../../hooks/useLoadContract';
import { asyncCall } from '../../../../store/rxjs/provider-cache';

export const useGetBorrowingAPR = (
  borrowToken: string,
  borrowAmount: Decimal,
) => {
  const [borrowApr, setBorrowApr] = useState(BigNumber.from(0));

  const assetContract = useLoadContract(borrowToken, 'loanTokens');

  const updateAPR = useCallback(async () => {
    if (!assetContract) {
      return;
    }
    try {
      const borrowApr = await asyncCall(
        `borrowApr/${assetContract.address}/${borrowAmount}`,
        () => assetContract.nextBorrowInterestRate(borrowAmount),
      );

      if (borrowApr) {
        setBorrowApr(borrowApr);
      }
    } catch (error) {
      console.error('Error fetching borrow APR:', error);
    }
  }, [assetContract, borrowAmount]);

  useEffect(() => {
    updateAPR();
  }, [updateAPR, borrowAmount]);

  return { borrowApr };
};
