import { ChainIds } from './chains';

export const networkMap = {
  [ChainIds.RSK_MAINNET]: 'rsk',
  [ChainIds.RSK_TESTNET]: 'rskTestnet',
  [ChainIds.MAINNET]: 'eth',
  [ChainIds.ROPSTEN]: 'ropsten',
  [ChainIds.SEPOLIA]: 'sepolia',
  [ChainIds.BSC_MAINNET]: 'bsc',
  [ChainIds.BSC_TESTNET]: 'bscTestnet',
  [ChainIds.BOB_MAINNET]: 'bob',
  [ChainIds.BOB_TESTNET]: 'bobTestnet',
  [ChainIds.FORK]: 'fork',
  [ChainIds.BITLAYER]: 'bitlayer',
  [ChainIds.BITLAYER_TESTNET]: 'bitlayerTestnet',
} as const;
