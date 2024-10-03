import { AsyncContractConfigData } from '../../types';

export const bob: Record<string, AsyncContractConfigData> = {
  staking: {
    address: '0xc17C6462cEAFE9A8819258c6bA168BEF5544Fc21',
    getAbi: async () => (await import('../../abis/staking.json')).default,
  },
  merkleDistributor: {
    address: '0x21a373286104acC8Fd8BFdCbe6714FEb4da30AeF',
    getAbi: async () =>
      (await import('../../abis/merkleDistributor.json')).default,
  },
  stakingRewardsOs: {
    address: '0xFdC57Cb52264209afd1559E7E3Db0F28351E9422',
    getAbi: async () =>
      (await import('../../abis/StakingRewardsOs.json')).default,
  },
  runeBridge: {
    address: '0x8989E07E565966463C73dadE4c095DaC991e1dD2',
    getAbi: async () => (await import('../../abis/RuneBridge.json')).default,
  },
  lbFactory: {
    address: '0x603764D0D819C50a6A9aab009410ABAC6482C874', //TODO: Update this address
    getAbi: async () => (await import('../../abis/LBFactory.json')).default,
  },
  lbRouter: {
    address: '0xbab96CC58a312a5f09E18630416794EC6C3D971D', //TODO: Update this address
    getAbi: async () => (await import('../../abis/LBRouter.json')).default,
  },
  lbPair: {
    address: '0xC40B82b1269346b3967AD9F29e91eD8fCC8C4484', //TODO: Update this address
    getAbi: async () => (await import('../../abis/LBPair.json')).default,
  },
  lbQuoter: {
    address: '0x5d36E7Ca84d24a4a6ABd082A6B6773Eb197BB100', //TODO: Update this address
    getAbi: async () => (await import('../../abis/LBQuoter.json')).default,
  },
};
