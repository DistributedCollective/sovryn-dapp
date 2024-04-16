import React, { useEffect } from 'react';

import { ethers } from 'ethers';

import { useAccount } from '../../../../hooks/useAccount';
import { currentNetwork } from '../../../../utils/helpers';
import runeBridgeABI from '../abi/RuneBridge.json';
import { contractAddresses } from '../config';
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
  const requestTokenBalances = React.useCallback(async () => {
    if (!state.runeBridgeContract) {
      console.log('no contract');
      return;
    }
    const listTokens = await state.runeBridgeContract.listTokens();
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
  }, [account, provider, state.runeBridgeContract]);
  const value = React.useMemo(
    () => ({
      ...state,
      set: setState,
      requestTokenBalances,
    }),
    [requestTokenBalances, state],
  );
  const runeBridgeAddress = contractAddresses[currentNetwork];

  useEffect(() => {
    const runeBridgeContract = new ethers.Contract(
      runeBridgeAddress,
      runeBridgeABI,
      provider,
    );
    setState(state => ({
      ...state,
      runeBridgeContract,
    }));
  }, [provider, runeBridgeAddress]);

  useEffect(() => {
    const refreshTokenBalances = setInterval(async () => {
      await requestTokenBalances();
    }, 5000);
    return () => clearInterval(refreshTokenBalances);
  }, [requestTokenBalances]);

  return <Contract.Provider value={value}>{children}</Contract.Provider>;
};
