import { ChainIds } from '@sovryn/ethers-provider';

export const networkMap = {
  [ChainIds.RSK_MAINNET]: 'rsk',
  [ChainIds.RSK_TESTNET]: 'rskTestnet',
  [ChainIds.MAINNET]: 'eth',
  [ChainIds.ROPSTEN]: 'ropsten',
  [ChainIds.SEPOLIA]: 'sepolia',
  [ChainIds.BSC_MAINNET]: 'bsc',
  [ChainIds.BSC_TESTNET]: 'bscTestnet',
} as const;

export type Network = typeof networkMap[keyof typeof networkMap];
