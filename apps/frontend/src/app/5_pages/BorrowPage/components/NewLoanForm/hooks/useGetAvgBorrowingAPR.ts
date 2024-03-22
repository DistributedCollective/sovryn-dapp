import { useCallback, useEffect, useState } from 'react';

import { BigNumber } from 'ethers';

import { useLoadContract } from '../../../../../../hooks/useLoadContract';
import { asyncCall } from '../../../../../../store/rxjs/provider-cache';

export const useGetAvgBorrowingAPR = (borrowToken: string) => {
  const [borrowApr, setBorrowApr] = useState(BigNumber.from(0));

  const assetContract = useLoadContract(borrowToken, 'loanTokens');

  const updateAPR = useCallback(async () => {
    if (!assetContract) {
      return;
    }
    try {
      const borrowApr = await asyncCall(
        `borrowAvgApr/${assetContract?.address}`,
        () => assetContract?.avgBorrowInterestRate(),
      );

      if (borrowApr) {
        setBorrowApr(borrowApr);
      }
    } catch (error) {
      console.error('Error fetching AVG borrow APR:', error);
    }
  }, [assetContract]);

  useEffect(() => {
    updateAPR();
  }, [updateAPR]);

  return { avgBorrowApr: borrowApr };
};
