import { AsyncContractConfigData } from '../../types';

export const bobTestnet: Record<string, AsyncContractConfigData> = {
  staking: {
    address: '0x7B794a3101594EC9aF48eF505E9f18DFbe966315',
    getAbi: async () => (await import('../../abis/staking.json')).default,
  },
};
