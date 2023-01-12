import { AsyncContractConfigData } from '../../types';

export const rskTestnet: Record<string, AsyncContractConfigData> = {
  borrowerOperations: {
    address: '0x135A1545fa1B2989251921737CD7862c98244FbF',
    getAbi: async () =>
      (await import('../../abis/zero/borrowerOperations.json')).default,
  },
};
