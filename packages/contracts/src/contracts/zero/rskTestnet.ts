import { addresses } from '@sovryn-zero/lib-ethers/dist/deployments/default/rsktestnet.json';

import { AsyncContractConfigData } from '../../types';

export const rskTestnet: Record<string, AsyncContractConfigData> = {
  borrowerOperations: {
    address: addresses.borrowerOperations,
    getAbi: async () =>
      (await import('@sovryn-zero/lib-ethers/dist/abi/BorrowerOperations.json'))
        .default,
  },
  troveManager: {
    address: addresses.troveManager,
    getAbi: async () =>
      (await import('@sovryn-zero/lib-ethers/dist/abi/TroveManager.json'))
        .default,
  },
  stabilityPool: {
    address: addresses.stabilityPool,
    getAbi: async () =>
      (await import('@sovryn-zero/lib-ethers/dist/abi/StabilityPool.json'))
        .default,
  },
  liquityBaseParams: {
    address: addresses.liquityBaseParams,
    getAbi: async () =>
      (await import('@sovryn-zero/lib-ethers/dist/abi/LiquityBaseParams.json'))
        .default,
  },
  communityIssuance: {
    address: '0xD017396d2284699e0Ce34b236CcE5321Ee3078e5',
    getAbi: async () =>
      (await import('@sovryn-zero/lib-ethers/dist/abi/CommunityIssuance.json'))
        .default,
  },
};
