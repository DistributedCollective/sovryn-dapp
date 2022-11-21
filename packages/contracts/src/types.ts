import { ContractInterface } from 'ethers';

import type { ChainId } from '@sovryn/ethers-provider';

import { contracts } from './contracts';

export type ContractGroup = keyof typeof contracts;

export type ContractConfigData = {
  address: string;
  abi: ContractInterface;
};

export type AsyncContractConfigData = {
  address: string;
  getAbi: () => Promise<ContractInterface>;
};

export type ContractData = {
  address: string;
  abi: ContractInterface;
  chainId: ChainId;
  group: ContractGroup;
  name: string;
};

export enum SupportedTokens {
  xusd = 'xusd',
  sov = 'sov',
}

export type TokenBaseInfo = {
  symbol: SupportedTokens;
  decimalPrecision: number;
  getIcon: () => Promise<string>;
};

export type TokenDetailsData = {
  address: string;
  abi: ContractInterface;
  symbol: SupportedTokens;
  decimalPrecision: number;
  icon?: string;
};
