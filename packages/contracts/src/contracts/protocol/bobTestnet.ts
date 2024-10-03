import { AsyncContractConfigData } from '../../types';

export const bobTestnet: Record<string, AsyncContractConfigData> = {
  staking: {
    address: '0x1139B088887237ed256687d9E1499275e37d9f2d',
    getAbi: async () => (await import('../../abis/staking.json')).default,
  },
  merkleDistributor: {
    address: '0x0',
    getAbi: async () =>
      (await import('../../abis/merkleDistributor.json')).default,
  },
  stakingRewardsOs: {
    address: '0x0',
    getAbi: async () =>
      (await import('../../abis/StakingRewardsOs.json')).default,
  },
  runeBridge: {
    address: '0x9d451acb7A7f98dc4F2d2A2aA1A0b0436f0Effdb',
    getAbi: async () => (await import('../../abis/RuneBridge.json')).default,
  },
  lbFactory: {
    address: '0x7a6cBEbcB12095f32D620E0970A22F8635946D15',
    getAbi: async () => (await import('../../abis/LBFactory.json')).default,
  },
  lbRouter: {
    address: '0xC2Af3934F01FAFBD780e9BD572c9DC711A163cdc',
    getAbi: async () => (await import('../../abis/LBRouter.json')).default,
  },
  lbPair: {
    address: '0x0e9a247D8e79a7F27958FeDDcabE572B1F064C8e',
    getAbi: async () => (await import('../../abis/LBPair.json')).default,
  },
  lbQuoter: {
    address: '0x55e530dc7741DeeaC356F25179a0aC6dc917949c',
    getAbi: async () => (await import('../../abis/LBQuoter.json')).default,
  },
};
