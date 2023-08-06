import { useCallback, useEffect, useState } from 'react';

import { Decimal } from '@sovryn/utils';

import { useLoadContract } from '../../../../../../hooks/useLoadContract';

export const useGetBorrowingAPR = (
  borrowToken: string,
  borrowAmount: Decimal,
) => {
  const [borrowApr, setBorrowApr] = useState('0');

  const normalizeToken =
    borrowToken === 'wrbtc' ? 'rbtc' : borrowToken.toLowerCase();

  const assetContract = useLoadContract(normalizeToken, 'lendTokens');

  const updateAPR = useCallback(async () => {
    if (!assetContract) {
      return;
    }
    try {
      const borrowApr = await assetContract.nextBorrowInterestRate(
        borrowAmount,
      );
      if (borrowApr) {
        setBorrowApr(borrowApr);
      }
    } catch (error) {
      console.error('Error fetching borrow APR:', error);
    }
  }, [assetContract, borrowAmount]);

  useEffect(() => {
    if (Number(borrowApr) === 0 && Number(borrowAmount) > 0) {
      updateAPR();
    }
  }, [updateAPR, borrowAmount, borrowApr]);

  return { borrowApr };
};
