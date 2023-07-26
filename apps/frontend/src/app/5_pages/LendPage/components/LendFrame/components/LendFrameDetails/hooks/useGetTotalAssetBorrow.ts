import { useCallback, useEffect, useState } from 'react';

import { SupportedTokens } from '@sovryn/contracts';

import { useLoadContract } from '../../../../../../../../hooks/useLoadContract';
import { fromWei } from '../../../../../../../../utils/math';

export const useGetTotalAssetBorrow = (asset: SupportedTokens) => {
  const lendContract = useLoadContract(asset, 'loanTokens');
  const [borrowedAmount, setBorrowedAmount] = useState('0');

  const getTotalAssetBorrow = useCallback(async () => {
    const amount = await lendContract?.totalAssetBorrow();
    if (amount) {
      setBorrowedAmount(fromWei(amount));
    }
  }, [lendContract]);

  useEffect(() => {
    getTotalAssetBorrow();
  }, [getTotalAssetBorrow]);

  return { borrowedAmount };
};
