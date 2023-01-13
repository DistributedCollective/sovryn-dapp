import { addresses } from '@sovryn-zero/lib-ethers/dist/deployments/default/rsktestnet.json';

import { AsyncContractConfigData } from '../../types';

export const rskTestnet: Record<string, AsyncContractConfigData> = {
  borrowerOperations: {
    address: addresses.borrowerOperations,
    getAbi: async () =>
      (await import('@sovryn-zero/lib-ethers/dist/abi/BorrowerOperations.json'))
        .default,
  },
};
