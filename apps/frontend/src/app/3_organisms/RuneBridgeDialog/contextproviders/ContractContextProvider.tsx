import React from 'react';

import { ethers } from 'ethers';

import { useAccount } from '../../../../hooks/useAccount';
import { useGetProtocolContract } from '../../../../hooks/useGetContract';
import { useInterval } from '../../../../hooks/useInterval';
import {
  Contract,
  defaultValue,
  ContractContextStateType,
  TokenBalance,
  tokenABI,
} from '../contexts/contract';

export type ContractContextProviderProps = {
  children: React.ReactNode;
};
export const ContractContextProvider: React.FC<
  ContractContextProviderProps
> = ({ children }) => {
  const [state, setState] =
    React.useState<ContractContextStateType>(defaultValue);

  const { provider, account } = useAccount();
  const runeBridgeContract = useGetProtocolContract('runeBridge');

  const requestTokenBalances = React.useCallback(async () => {
    if (!runeBridgeContract) {
      console.warn(
        'RuneBridge contract not loaded, cannot refresh token balances',
      );
      return;
    }
    const listTokens = await runeBridgeContract.listTokens();
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
  }, [account, provider, runeBridgeContract]);

  const value = React.useMemo(
    () => ({
      ...state,
      runeBridgeContract,
      set: setState,
      requestTokenBalances,
    }),
    [requestTokenBalances, state, runeBridgeContract],
  );

  useInterval(requestTokenBalances, 10000, {
    immediate: true,
  });

  return <Contract.Provider value={value}>{children}</Contract.Provider>;
};
