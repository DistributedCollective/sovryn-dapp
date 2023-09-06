import { useCallback, useEffect, useState } from 'react';

import { Decimal } from '@sovryn/utils';

import { useLoadContract } from '../../../../../../hooks/useLoadContract';
import { asyncCall } from '../../../../../../store/rxjs/provider-cache';

export const useGetBorrowingAPR = (
  borrowToken: string,
  borrowAmount: Decimal,
) => {
  const [borrowApr, setBorrowApr] = useState('0');

  const assetContract = useLoadContract(borrowToken, 'lendTokens');

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
