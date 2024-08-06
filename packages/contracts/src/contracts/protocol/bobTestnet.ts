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
    address: '0x603764D0D819C50a6A9aab009410ABAC6482C874',
    getAbi: async () => (await import('../../abis/LBFactory.json')).default,
  },
  lbRouter: {
    address: '0xbab96CC58a312a5f09E18630416794EC6C3D971D',
    getAbi: async () => (await import('../../abis/LBRouter.json')).default,
  },
};
