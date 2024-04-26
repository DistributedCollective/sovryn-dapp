import { AsyncContractConfigData } from '../../types';

export const bobTestnet: Record<string, AsyncContractConfigData> = {
  staking: {
    address: '0x1139B088887237ed256687d9E1499275e37d9f2d',
    getAbi: async () => (await import('../../abis/staking.json')).default,
  },
  runeBridge: {
    address: '0x9d451acb7A7f98dc4F2d2A2aA1A0b0436f0Effdb',
    getAbi: async () => (await import('../../abis/RuneBridge.json')).default,
  },
};
