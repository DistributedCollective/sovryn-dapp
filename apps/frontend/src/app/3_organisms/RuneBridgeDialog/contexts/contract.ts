import React, { Dispatch, SetStateAction } from 'react';

import { ethers } from 'ethers';

export type TokenBalance = {
  symbol: string;
  balance: string;
  name: string;
  decimals: number;
  tokenContractAddress: string;
};

export type ContractContextStateType = {
  tokenBalances: TokenBalance[];
  runeBridgeContract: ethers.Contract | undefined;
  depositAddress: string;
};

export type ContractContextFunctionsType = {
  set: Dispatch<SetStateAction<ContractContextStateType>>;
};

export type ContractContextType = ContractContextStateType &
  ContractContextFunctionsType;

export const defaultValue: ContractContextType = {
  tokenBalances: [],
  runeBridgeContract: undefined,
  depositAddress: '',
  set: () => {},
};

export const tokenABI = [
  'function balanceOf(address) view returns (uint)',
  'function symbol() view returns (string)',
  'function name() view returns (string)',
  'function decimals() view returns (uint)',
];

export const Contract = React.createContext(defaultValue);

export const useContractContext = () => {
  return React.useContext(Contract) as ContractContextType;
};
