import { AsyncContractConfigData } from '../../types';

export const rsk: Record<string, AsyncContractConfigData> = {
  borrowerOperations: {
    address: '0x135A1545fa1B2989251921737CD7862c98244FbF',
    getAbi: async () =>
      (await import('../../abis/zero/BorrowerOperations.json')).default,
  },
};
