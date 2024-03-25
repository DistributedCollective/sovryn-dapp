import React, { Dispatch, SetStateAction } from 'react';

import { ethers } from 'ethers';

export type TokenBalance = {
  symbol: string;
  balance: string;
  name: string;
  tokenContractAddress: string;
};

export type ContractContextStateType = {
  tokenBalances: TokenBalance[];
  runeBridgeContract: ethers.Contract | null;
  depositAddress: string;
};

export type ContractContextFunctionsType = {
  set: Dispatch<SetStateAction<ContractContextStateType>>;
  requestTokenBalances: (address: string) => void;
};

export type ContractContextType = ContractContextStateType &
  ContractContextFunctionsType;

export const defaultValue: ContractContextType = {
  tokenBalances: [],
  runeBridgeContract: null,
  depositAddress: '',
  set: () => {},
  requestTokenBalances: (address: string) => {
    throw new Error('requestTokenBalances() has not been defined.');
  },
};

export const tokenABI = [
  'function balanceOf(address) view returns (uint)',
  'function symbol() view returns (string)',
  'function name() view returns (string)',
  'function decimals() view returns (uint)',
];

export const Contract = React.createContext(defaultValue);
