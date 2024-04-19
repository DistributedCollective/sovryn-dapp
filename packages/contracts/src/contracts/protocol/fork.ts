import type { AsyncContractConfigData } from '../../types';

export const fork: Record<string, AsyncContractConfigData> = {
  merkleDistributor: {
    address: '0xe193c995a9f631144441e0cf8d37583ef7b35fe3',
    getAbi: async () =>
      (await import('../../abis/merkleDistributor.json')).default,
  },
};
