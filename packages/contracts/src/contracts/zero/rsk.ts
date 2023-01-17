import { addresses } from '@sovryn-zero/lib-ethers/dist/deployments/default/rsksovrynmainnet.json';

import { AsyncContractConfigData } from '../../types';

export const rsk: Record<string, AsyncContractConfigData> = {
  borrowerOperations: {
    address: addresses.borrowerOperations,
    getAbi: async () =>
      (await import('@sovryn-zero/lib-ethers/dist/abi/BorrowerOperations.json'))
        .default,
  },
  stabilityPool: {
    address: addresses.stabilityPool,
    getAbi: async () =>
      (await import('@sovryn-zero/lib-ethers/dist/abi/StabilityPool.json'))
        .default,
  },
};
