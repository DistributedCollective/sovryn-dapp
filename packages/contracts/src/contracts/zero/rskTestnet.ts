import { addresses } from '@sovryn-zero/lib-ethers/dist/deployments/default/rsktestnet.json';

import { AsyncContractConfigData } from '../../types';

export const rskTestnet: Record<string, AsyncContractConfigData> = {
  borrowerOperations: {
    address: addresses.borrowerOperations,
    getAbi: async () =>
      (
        await import(
          '@sovryn-zero/contracts/deployment/deployments/rskSovrynTestnet/BorrowerOperations.json'
        )
      ).default,
  },
  troveManager: {
    address: addresses.troveManager,
    getAbi: async () =>
      (
        await import(
          '@sovryn-zero/contracts/deployment/deployments/rskSovrynTestnet/TroveManager.json'
        )
      ).default,
  },
  stabilityPool: {
    address: addresses.stabilityPool,
    getAbi: async () =>
      (
        await import(
          '@sovryn-zero/contracts/deployment/deployments/rskSovrynTestnet/StabilityPool.json'
        )
      ).default,
  },
  liquityBaseParams: {
    address: addresses.liquityBaseParams,
    getAbi: async () =>
      (
        await import(
          '@sovryn-zero/contracts/deployment/deployments/rskSovrynTestnet/LiquityBaseParams.json'
        )
      ).default,
  },
  communityIssuance: {
    address: addresses.communityIssuance,
    getAbi: async () =>
      (
        await import(
          '@sovryn-zero/contracts/deployment/deployments/rskSovrynTestnet/CommunityIssuance.json'
        )
      ).default,
  },
};
