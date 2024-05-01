import { AsyncContractConfigData } from '../../types';

export const bob: Record<string, AsyncContractConfigData> = {
  staking: {
    address: '0xc17C6462cEAFE9A8819258c6bA168BEF5544Fc21',
    getAbi: async () => (await import('../../abis/staking.json')).default,
  },
  runeBridge: {
    address: '',
    getAbi: async () => (await import('../../abis/RuneBridge.json')).default,
  },
};
