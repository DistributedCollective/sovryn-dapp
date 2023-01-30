import setup, { Chain, ChainIds } from '@sovryn/ethers-provider';

export enum Chains {
  RSK = 'rsk',
  BSC = 'bsc',
}

export const defaultChainId =
  process.env.REACT_APP_CHAIN_ID || ChainIds.RSK_TESTNET;

export const chains: Chain[] = [
  {
    id: ChainIds.RSK_MAINNET,
    label: 'Rootstock',
    token: 'RBTC',
    rpcUrl: ['https://mainnet.sovryn.app/rpc', 'https://public-node.rsk.co'],
    blockExplorerUrl: 'https://explorer.rsk.co',
  },
  {
    id: ChainIds.MAINNET,
    label: 'Ethereum',
    token: 'ETH',
    rpcUrl: ['https://cloudflare-eth.com/'],
    blockExplorerUrl: 'https://etherscan.io',
  },
  {
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
