import { ChainIds } from '@sovryn/ethers-provider';
import { ChainId } from '@sovryn/ethers-provider';

import { APP_CHAIN_LIST } from '../config/chains';

import { isMainnet } from './helpers';

/** @deprecated use RSK_CHAIN_ID */
export const getRskChainId = () =>
  isMainnet() ? ChainIds.RSK_MAINNET : ChainIds.RSK_TESTNET;

export const isRskChain = (chainId: ChainId) =>
  [ChainIds.RSK_MAINNET, ChainIds.RSK_TESTNET].includes(chainId as ChainIds);

export const isBscChain = (chainId: ChainId) =>
  [ChainIds.BSC_MAINNET, ChainIds.BSC_TESTNET].includes(chainId as ChainIds);

export const isBobChain = (chainId: ChainId) =>
  [ChainIds.BOB_MAINNET, ChainIds.BOB_TESTNET].includes(chainId as ChainIds);

export const isEthChain = (chainId: ChainId) =>
  [ChainIds.MAINNET, ChainIds.SEPOLIA, ChainIds.ROPSTEN].includes(
    chainId as ChainIds,
  );

export const getChainById = (chainId: ChainId) =>
  APP_CHAIN_LIST.find(chain => chain.id === chainId);

export const getChainLabel = (chainId: ChainId) => getChainById(chainId)?.label;
