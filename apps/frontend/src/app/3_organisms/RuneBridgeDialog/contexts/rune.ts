import React, { Dispatch, SetStateAction } from 'react';

import { ethers } from 'ethers';

import { noop } from '@sovryn/ui';

export type TokenBalance = {
  symbol: string;
  balance: string;
  name: string;
  decimals: number;
  tokenContractAddress: string;
};

export type RuneContextStateType = {
  tokenBalances: TokenBalance[];
  runeBridgeContract: ethers.Contract | undefined;
  depositAddress: string;
};

export type RuneContextFunctionsType = {
  set: Dispatch<SetStateAction<RuneContextStateType>>;
};

export type RuneContextType = RuneContextStateType & RuneContextFunctionsType;

export const defaultValue: RuneContextType = {
  tokenBalances: [],
  runeBridgeContract: undefined,
  depositAddress: '',
  set: noop,
};

export const tokenABI = [
  'function balanceOf(address) view returns (uint)',
  'function symbol() view returns (string)',
  'function name() view returns (string)',
  'function decimals() view returns (uint)',
];

export const RuneContext = React.createContext(defaultValue);

export const useRuneContext = () => {
  return React.useContext(RuneContext) as RuneContextType;
};
