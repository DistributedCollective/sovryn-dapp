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
    rpcUrl: 'https://public-node.rsk.co',
  },
  {
    id: ChainIds.RSK_TESTNET,
    label: 'RSK Testnet',
    rpcUrl: 'https://public-node.testnet.rsk.co',
    providerConnectionInfo: provider.connection,
  },
];
