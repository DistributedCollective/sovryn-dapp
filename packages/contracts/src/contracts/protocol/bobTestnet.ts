import { AsyncContractConfigData } from '../../types';

export const bobTestnet: Record<string, AsyncContractConfigData> = {
  staking: {
    address: '0x1139B088887237ed256687d9E1499275e37d9f2d',
    getAbi: async () => (await import('../../abis/staking.json')).default,
  },
  merkleDistributor: {
    address: '0x0', // todo: update address
    getAbi: async () =>
      (await import('../../abis/merkleDistributor.json')).default,
  },
  runeBridge: {
    address: '',
    getAbi: async () => (await import('../../abis/RuneBridge.json')).default,
  },
};
