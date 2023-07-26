import { useCallback, useEffect, useState } from 'react';

import { SupportedTokens } from '@sovryn/contracts';

import { useAccount } from '../../../../hooks/useAccount';
import { useLoadContract } from '../../../../hooks/useLoadContract';
import { fromWei } from '../../../../utils/math';

export const useGetProfitOf = (asset: SupportedTokens) => {
  const { account } = useAccount();
  const lendContract = useLoadContract(asset, 'loanTokens');
  const [profit, setProfit] = useState('0');

  const getProfitOf = useCallback(async () => {
    const profit = await lendContract?.profitOf(account);
    if (profit) {
      setProfit(fromWei(profit));
    }
  }, [lendContract, account]);

  useEffect(() => {
    if (account && lendContract) {
      getProfitOf();
    }
  }, [getProfitOf, account, lendContract]);

  return { profit };
};
