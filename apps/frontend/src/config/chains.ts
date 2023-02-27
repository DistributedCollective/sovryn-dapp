import setup, { Chain, ChainIds } from '@sovryn/ethers-provider';

import { isMainnet } from '../utils/helpers';

export enum Chains {
  RSK = 'rsk',
  BSC = 'bsc',
}

export const defaultChainId = (
  isMainnet() ? ChainIds.RSK_MAINNET : ChainIds.RSK_TESTNET
) as string;

// @dev: temp solution for hardware wallets to connect to the correct chain
// good enough for now, but should be refactored when cross-chain support is needed
export const chains: Chain[] = [
  isMainnet()
    ? {
        id: ChainIds.RSK_MAINNET,
        label: 'Rootstock',
        token: 'RBTC',
        rpcUrl: [
          'https://rsk-live.sovryn.app/rpc',
          'https://public-node.rsk.co',
        ],
        blockExplorerUrl: 'https://explorer.rsk.co',
      }
    : {
        id: ChainIds.RSK_TESTNET,
        label: 'Rootstock testnet',
        token: 'tRBTC',
        rpcUrl: [
          'https://testnet.sovryn.app/rpc',
          'https://public-node.testnet.rsk.co',
        ],
        blockExplorerUrl: 'https://explorer.testnet.rsk.co',
      },
];

setup(chains);
