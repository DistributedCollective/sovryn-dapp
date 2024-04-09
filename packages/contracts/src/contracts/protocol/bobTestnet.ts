import { AsyncContractConfigData } from '../../types';

export const bobTestnet: Record<string, AsyncContractConfigData> = {
  staking: {
    address: '0xe888470E4b7e077115edbBeC883CCD7C609AeE3c',
    getAbi: async () => (await import('../../abis/staking.json')).default,
  },
};
