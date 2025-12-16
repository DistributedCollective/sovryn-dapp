import { AsyncContractConfigData } from '../../types';

export const bobTestnet: Record<string, AsyncContractConfigData> = {
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
};
