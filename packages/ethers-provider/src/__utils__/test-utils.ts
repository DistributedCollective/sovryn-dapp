import { providers } from 'ethers';

import { ChainIds } from '../chains';
import { Chain } from '../types';

const provider = new providers.StaticJsonRpcProvider(
  'https://public-node.testnet.rsk.co',
);

export const chains: Chain[] = [
  {
    id: ChainIds.RSK_MAINNET,
    label: 'RSK Mainnet',
    token: 'RBTC',
    rpcUrl: ['https://public-node.rsk.co', 'https://rsk-live.sovryn.app/rpc'],
    publicRpcUrl: 'https://rsk-live.sovryn.app/rpc',
  },
  {
    id: ChainIds.RSK_TESTNET,
    label: 'RSK Testnet',
    token: 'tRBTC',
    rpcUrl: 'https://public-node.testnet.rsk.co',
    providerConnectionInfo: provider.connection,
    publicRpcUrl: 'https://public-node.testnet.rsk.co',
  },
  {
    id: ChainIds.MAINNET,
    label: 'Ethereum Mainnet',
    token: 'ETH',
    rpcUrl: ['https://google.com', 'https://cloudflare-eth.com/'],
    publicRpcUrl: 'https://cloudflare-eth.com/',
  },
];
