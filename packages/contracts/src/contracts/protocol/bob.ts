import { AsyncContractConfigData } from '../../types';

export const bob: Record<string, AsyncContractConfigData> = {
  staking: {
    address: '0x5fA95212825a474E2C75676e8D833330F261CaeD',
    getAbi: async () => (await import('../../abis/staking.json')).default,
  },
  runeBridge: {
    address: '0x8989E07E565966463C73dadE4c095DaC991e1dD2',
    getAbi: async () => (await import('../../abis/RuneBridge.json')).default,
  },
};
