import { ChainIds } from '@sovryn/ethers-provider';

export const networkMap = {
  [ChainIds.RSK_MAINNET]: 'rsk',
  [ChainIds.RSK_TESTNET]: 'rskTestnet',
  [ChainIds.MAINNET]: 'eth',
  [ChainIds.ROPSTEN]: 'ropsten',
} as const;

export type Network = typeof networkMap[keyof typeof networkMap];
