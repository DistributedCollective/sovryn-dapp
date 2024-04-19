import { AsyncContractConfigData } from '../../types';

export const sepolia: Record<string, AsyncContractConfigData> = {
  staking: {
    address: '0xdC3e5232db60088D67aA7AF10595979D7eB5290f',
    getAbi: async () => (await import('../../abis/staking.json')).default,
  },
};
