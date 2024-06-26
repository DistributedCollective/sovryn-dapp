import { AsyncContractConfigData } from '../../types';

export const bitlayerTestnet: Record<string, AsyncContractConfigData> = {
  staking: {
    address: '0x8AC7f31B587A2369C985b05627873cFA50C70a3C',
    getAbi: async () => (await import('../../abis/staking.json')).default,
  },
};
