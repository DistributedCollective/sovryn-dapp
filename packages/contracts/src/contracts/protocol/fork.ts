import type { AsyncContractConfigData } from '../../types';

export const fork: Record<string, AsyncContractConfigData> = {
  merkleDistributor: {
    address: '0xcce97e181a355939248afe2aab9587b46de56396',
    getAbi: async () =>
      (await import('../../abis/merkleDistributor.json')).default,
  },
};
