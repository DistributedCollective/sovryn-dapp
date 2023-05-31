import { AsyncContractConfigData } from '../../types';

export const rskTestnet: Record<string, AsyncContractConfigData> = {
  borrowerOperations: {
    address: '0xba8d7B80bcb3A01A5e713c356fD18EeD299B70D0',
    getAbi: async () =>
      (
        await import(
          '@sovryn-zero/contracts/deployment/deployments/rskSovrynMainet/BorrowerOperations.json'
        )
      ).default.abi,
  },
  troveManager: {
    address: '0xd8aB7EC3bd20A0Ce3084e124bFBC9Aa96a6D7FdD',
    getAbi: async () =>
      (
        await import(
          '@sovryn-zero/contracts/deployment/deployments/rskSovrynTestnet/TroveManager.json'
        )
      ).default.abi,
  },
  stabilityPool: {
    address: '0x176D218CaB70002CEF08e15271476187c37ed25f',
    getAbi: async () =>
      (
        await import(
          '@sovryn-zero/contracts/deployment/deployments/rskSovrynTestnet/StabilityPool.json'
        )
      ).default.abi,
  },
  liquityBaseParams: {
    address: '0x8B1cB2Ffc9aFe4344503824898098d2E4c883873',
    getAbi: async () =>
      (
        await import(
          '@sovryn-zero/contracts/deployment/deployments/rskSovrynTestnet/LiquityBaseParams.json'
        )
      ).default.abi,
  },
  communityIssuance: {
    address: '0xD017396d2284699e0Ce34b236CcE5321Ee3078e5',
    getAbi: async () =>
      (
        await import(
          '@sovryn-zero/contracts/deployment/deployments/rskSovrynTestnet/CommunityIssuance.json'
        )
      ).default.abi,
  },
  hintHelpers: {
    address: '0xc7Bf159d6259ce5a4Fbdd0e3d060875F76605Dba',
    getAbi: async () =>
      (
        await import(
          '@sovryn-zero/contracts/deployment/deployments/rskSovrynTestnet/HintHelpers.json'
        )
      ).default.abi,
  },
};
