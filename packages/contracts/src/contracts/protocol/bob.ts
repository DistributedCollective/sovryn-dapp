import { AsyncContractConfigData } from '../../types';

export const bobTestnet: Record<string, AsyncContractConfigData> = {
  staking: {
    address: '0x5fA95212825a474E2C75676e8D833330F261CaeD',
    getAbi: async () => (await import('../../abis/staking.json')).default,
  },
  runeBridge: {
    address: '',
    getAbi: async () => (await import('../../abis/RuneBridge.json')).default,
  },
};
