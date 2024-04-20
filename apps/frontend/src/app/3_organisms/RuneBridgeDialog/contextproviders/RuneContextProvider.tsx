import React, { useEffect } from 'react';

import { ethers } from 'ethers';

import { useCacheCall } from '../../../../hooks';
import { useAccount } from '../../../../hooks/useAccount';
import { useCurrentChain } from '../../../../hooks/useChainStore';
import { useGetProtocolContract } from '../../../../hooks/useGetContract';
import { useInterval } from '../../../../hooks/useInterval';
import {
  RuneContext,
  defaultValue,
  RuneContextStateType,
  TokenBalance,
  tokenABI,
} from '../contexts/rune';

export type RuneContextProviderProps = {
  children: React.ReactNode;
};

export const RuneContextProvider: React.FC<RuneContextProviderProps> = ({
  children,
}) => {
  const [state, setState] = React.useState<RuneContextStateType>(defaultValue);

  const { provider, account } = useAccount();
  const runeBridgeContract = useGetProtocolContract('runeBridge');
  const chainId = useCurrentChain();

  const { value: listTokens } = useCacheCall(
    'runeBridge/tokens',
    chainId,
    async () => runeBridgeContract?.listTokens(),
  );

  const requestTokenBalances = React.useCallback(async () => {
    if (!listTokens) {
      console.warn(
        'RuneBridge contract not loaded, cannot refresh token balances',
      );
      return;
    }
    const tokenBalances: TokenBalance[] = [];
    for (const tokenAddress of listTokens) {
      const tokenContract = new ethers.Contract(
        tokenAddress,
        tokenABI,
        provider,
      );
      const balance = await tokenContract.balanceOf(account);
      const symbol = await tokenContract.symbol();
      const name = await tokenContract.name();
      const decimals = await tokenContract.decimals();
      tokenBalances.push({
        symbol: symbol,
        balance: ethers.utils.formatUnits(balance, decimals),
        decimals: decimals,
        name: name,
        tokenContractAddress: tokenAddress,
      });
    }
    if (tokenBalances) {
      setState(state => ({
        ...state,
        tokenBalances,
      }));
    }
  }, [account, provider, listTokens]);

  const value = React.useMemo(
    () => ({
      ...state,
      runeBridgeContract,
      set: setState,
      requestTokenBalances,
    }),
    [requestTokenBalances, state, runeBridgeContract],
  );

  // we cannot use immediate: true because runeBridgeContract is not loaded on the initial render

  useInterval(requestTokenBalances, 10000);

  useEffect(() => {
    const timeout = setTimeout(requestTokenBalances, 1000);
    return () => clearTimeout(timeout);
  }, [requestTokenBalances]);

  return <RuneContext.Provider value={value}>{children}</RuneContext.Provider>;
};
