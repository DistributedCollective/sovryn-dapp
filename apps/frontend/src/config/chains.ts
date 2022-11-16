import { Chain, ChainIds } from '@sovryn/ethers-provider';

export const defaultChainId =
  process.env.REACT_APP_CHAIN_ID || ChainIds.RSK_TESTNET;

export const chains: Chain[] = [
  {
    id: ChainIds.RSK_MAINNET,
    label: 'Rootstock',
    symbol: 'RBTC',
    rpcUrl: ['https://mainnet.sovryn.app/rpc', 'https://public-node.rsk.co'],
  },
  {
    id: ChainIds.MAINNET,
    label: 'Ethereum',
    symbol: 'ETH',
    rpcUrl: [
      'https://main-light.eth.linkpool.io',
      'https://cloudflare-eth.com/',
      'https://api.mycryptoapi.com/eth',
    ],
  },
  {
    id: ChainIds.RSK_TESTNET,
    label: 'Rootstock testnet',
    symbol: 'tRBTC',
    rpcUrl: [
      'https://testnet.sovryn.app/rpc',
      'https://public-node.testnet.rsk.co',
    ],
  },
];
