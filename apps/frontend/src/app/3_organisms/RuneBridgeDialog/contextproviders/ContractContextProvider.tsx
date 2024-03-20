import React, { useEffect } from 'react';

import { ethers } from 'ethers';

import runeBridgeABI from '../../../../abi/RuneBridge.json';
import tokenABI from '../../../../abi/TestToken.json';
import { useAccount } from '../../../../hooks/useAccount';
import {
  Contract,
  defaultValue,
  ContractContextStateType,
  TokenBalance,
} from '../contexts/contract';

export type ContractContextProviderProps = {
  children: React.ReactNode;
};
export const ContractContextProvider: React.FC<
  ContractContextProviderProps
> = ({ children }) => {
  const [state, setState] =
    React.useState<ContractContextStateType>(defaultValue);
  const { account, provider } = useAccount();
  const runeBridgeAddress = process.env.REACT_APP_RUNE_BRIDGE_CONTRACT_ADDRESS!;
  const value = React.useMemo(
    () => ({
      ...state,
      set: setState,
    }),
    [state],
  );

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
    if (state.tokenBalances.length > 0 || !state.runeBridgeContract) return;
    const getListTokens = async () => {
      const tokenBalancesLocalStorage: TokenBalance[] = [];
      if (!state.runeBridgeContract) return;
      const contract = state.runeBridgeContract!;
      const listTokens = await contract.listTokens();
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
        tokenBalancesLocalStorage.push({
          symbol,
          balance: ethers.utils.formatUnits(balance, decimals),
          name,
          tokenContractAddress: tokenAddress,
        });
      }
      return tokenBalancesLocalStorage;
    };
    getListTokens().then(tokenBalancesLocalStorage => {
      if (tokenBalancesLocalStorage) {
        setState(state => ({
          ...state,
          tokenBalances: tokenBalancesLocalStorage,
        }));
      }
    });
  }, [account, provider, state.runeBridgeContract, state.tokenBalances.length]);

  return <Contract.Provider value={value}>{children}</Contract.Provider>;
};
