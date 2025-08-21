import { Provider } from '@ethersproject/abstract-provider';

import type { Contract, ContractInterface, Signer } from 'ethers';

import type { ChainId } from '@sovryn/ethers-provider';

import { contracts } from './contracts';

export type ContractGroup = keyof typeof contracts;
export type ContractNetworkName = keyof typeof contracts[ContractGroup];

/** @deprecated */
export type SupportedTokens = string;

export type ContractConfigData = {
  address: string;
  abi: ContractInterface;
  contract: (signerOrProvider?: Signer | Provider) => Contract;
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

export type AssetDetails = {
  symbol: string;
  address: string;
  decimals: number;
  getIcon: () => Promise<string>;
  name?: string;
  isNative?: boolean;
  description?: string;
};

export type AssetDetailsData = Omit<AssetDetails, 'getIcon'> & {
  icon?: string;
  abi: ContractInterface;
  contract: (signerOrProvider?: Signer | Provider) => Contract;
};
