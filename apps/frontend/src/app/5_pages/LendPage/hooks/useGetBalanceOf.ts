import { useCallback, useEffect, useState } from 'react';

import { SupportedTokens } from '@sovryn/contracts';

import { useAccount } from '../../../../hooks/useAccount';
import { useLoadContract } from '../../../../hooks/useLoadContract';
import { lendingBalanceOf } from '../utils/contract-calls';

export const useGetBalanceOf = (asset: SupportedTokens) => {
  const { account } = useAccount();

  const [balanceTotal, setBalanceTotal] = useState('0');

  const lendContract = useLoadContract(asset, 'loanTokens');

  const getBalance = useCallback(async () => {
    const balance = await lendingBalanceOf(asset, account);
    if (balance) {
      setBalanceTotal(balance.toString());
    }
  }, [asset, account]);

  useEffect(() => {
    if (account && lendContract) {
      getBalance();
    }
  }, [getBalance, account, lendContract]);

  return { balanceTotal };
};
