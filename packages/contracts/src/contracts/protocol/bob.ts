import { AsyncContractConfigData } from '../../types';

export const bobTestnet: Record<string, AsyncContractConfigData> = {
  staking: {
    address: '',
    getAbi: async () => (await import('../../abis/staking.json')).default,
  },
  runeBridge: {
    address: '',
    getAbi: async () => (await import('../../abis/RuneBridge.json')).default,
  },
};
