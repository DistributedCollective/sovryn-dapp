import { ethers } from 'ethers';

import { Chains } from '../../../../config/chains';
import { Environments } from '../../../../types/global';
import erc20TokenAbi from './abi/erc20.json';

export type FastBTCWithdrawContractName = 'btcToken' | 'btcWrapperToken';

export type AppModelToContractAddressMap = Record<Environments, string>;

export type ChainToContractsMap = {
  address: Partial<Record<string, AppModelToContractAddressMap>>;
  abi: ethers.ContractInterface;
};

export const contracts: Record<
  FastBTCWithdrawContractName,
  ChainToContractsMap
> = {
  btcToken: {
    address: {
      [Chains.RSK]: {
        [Environments.Mainnet]: ethers.constants.AddressZero,
        [Environments.Testnet]: ethers.constants.AddressZero,
      },
    },
    abi: erc20TokenAbi,
  },
  btcWrapperToken: {
    address: {
      [Chains.RSK]: {
        [Environments.Mainnet]: '0xa233108b33dc77f1eee9d183ee1dc9725e76d475',
        [Environments.Testnet]: '0xf629e5c7527ac7bc9ce26bdd6d66f0eb955ef3b2',
      },
    },
    abi: erc20TokenAbi,
  },
};
