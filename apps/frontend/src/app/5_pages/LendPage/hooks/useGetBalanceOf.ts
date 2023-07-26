import { useCallback, useEffect, useState } from 'react';

import { SupportedTokens } from '@sovryn/contracts';

import { useAccount } from '../../../../hooks/useAccount';
import { useLoadContract } from '../../../../hooks/useLoadContract';
import { fromWei } from '../../../../utils/math';

export const useGetBalanceOf = (asset: SupportedTokens) => {
  const { account } = useAccount();

  const [balanceTotal, setBalanceTotal] = useState('0');

  const lendContract = useLoadContract(asset, 'loanTokens');

  const getBalance = useCallback(async () => {
    const balance = await lendContract?.balanceOf(account);
    if (balance) {
      setBalanceTotal(fromWei(balance));
    }
  }, [lendContract, account]);

  useEffect(() => {
    if (account && lendContract) {
      getBalance();
    }
  }, [getBalance, account, lendContract]);

  return { balanceTotal };
};
