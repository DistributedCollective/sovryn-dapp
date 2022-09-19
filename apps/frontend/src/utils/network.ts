import init, { Chain, ChainIds } from '@sovryn/ethers-provider';

const chains: Chain[] = [
  {
    id: ChainIds.MAINNET,
    label: 'Ethereum Mainnet',
    rpcUrl: 'https://cloudflare-eth.com',
  },
  {
    id: ChainIds.RSK_MAINNET,
    label: 'RSK Mainnet',
    rpcUrl: 'https://public-node.rsk.co',
  },
  {
    id: ChainIds.RSK_TESTNET,
    label: 'RSK Testnet',
    rpcUrl: 'https://public-node.testnet.rsk.co',
  },
];

export const network = init(chains);
