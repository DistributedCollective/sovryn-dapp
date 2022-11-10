import { ContractInterface } from 'ethers';

import type { ChainId } from '@sovryn/ethers-provider';

import { contracts } from '../config/contracts';

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
