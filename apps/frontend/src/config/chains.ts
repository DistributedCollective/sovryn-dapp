import setup, { Chain, ChainIds } from '@sovryn/ethers-provider';

export enum Chains {
  RSK = 'rsk',
  BSC = 'bsc',
}

export const defaultChainId =
  process.env.REACT_APP_CHAIN_ID || ChainIds.RSK_TESTNET;

// @dev: temp solution for hardware wallets to connect to the correct chain
// good enough for now, but should be refactored when cross-chain support is needed
export const chains: Chain[] = [
  defaultChainId === ChainIds.RSK_MAINNET
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
