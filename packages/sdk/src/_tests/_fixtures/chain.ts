import type { providers } from 'ethers';

import setupChains, { ChainIds, getProvider } from '@sovryn/ethers-provider';

export type ChainFixture = {
  provider: providers.Provider;
};

export const makeChainFixture = async (): Promise<ChainFixture> => {
  setupChains([
    {
      id: ChainIds.RSK_MAINNET,
      label: 'RSK Mainnet',
      rpcUrl: 'https://public-node.rsk.co',
      token: 'RBTC',
    },
  ]);

  return {
    provider: getProvider(ChainIds.RSK_MAINNET),
  };
};
