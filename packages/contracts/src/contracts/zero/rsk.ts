import { AsyncContractConfigData } from '../../types';

export const rsk: Record<string, AsyncContractConfigData> = {
  borrowerOperations: {
    address: '0x5B9dB4B8bdeF3e57323187a9AC2639C5DEe5FD39',
    getAbi: async () =>
      (
        await import(
          '@sovryn-zero/contracts/deployment/deployments/rskSovrynMainet/BorrowerOperations.json'
        )
      ).default.abi,
  },
  troveManager: {
    address: '0x82B09695ee4F214f3A0803683C4AaEc332E4E0a3',
    getAbi: async () =>
      (
        await import(
          '@sovryn-zero/contracts/deployment/deployments/rskSovrynMainet/TroveManager.json'
        )
      ).default.abi,
  },
  stabilityPool: {
    address: '0xd46C0225D1331B46700d64fF8c906709D15C9202',
    getAbi: async () =>
      (
        await import(
          '@sovryn-zero/contracts/deployment/deployments/rskSovrynMainet/StabilityPool.json'
        )
      ).default.abi,
  },
  liquityBaseParams: {
    address: '0xf8B04A36c36d5DbD1a9Fe7B74897c609d6A17aa2',
    getAbi: async () =>
      (
        await import(
          '@sovryn-zero/contracts/deployment/deployments/rskSovrynMainet/LiquityBaseParams.json'
        )
      ).default.abi,
  },
  communityIssuance: {
    address: '0x9b38044A276fED8bC1703bd4a2DA1b17F2c61d16',
    getAbi: async () =>
      (
        await import(
          '@sovryn-zero/contracts/deployment/deployments/rskSovrynMainet/CommunityIssuance.json'
        )
      ).default.abi,
  },
  hintHelpers: {
    address: '0x1D7DaC5a63A35540bE9e031212ecf39584AE5595',
    getAbi: async () =>
      (
        await import(
          '@sovryn-zero/contracts/deployment/deployments/rskSovrynMainet/HintHelpers.json'
        )
      ).default.abi,
  },
};
