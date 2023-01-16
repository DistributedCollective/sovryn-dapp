import { AsyncContractConfigData } from '../../types';

export const rsk: Record<string, AsyncContractConfigData> = {
  protocol: {
    address: '0x5A0D867e0D70Fcc6Ade25C3F1B89d618b5B4Eaa7',
    getAbi: async () => (await import('../../abis/protocol.json')).default,
  },
  swapNetwork: {
    address: '0x98aCE08D2b759a265ae326F010496bcD63C15afc',
    getAbi: async () => (await import('../../abis/swapNetwork.json')).default,
  },
  massetManager: {
    address: '0xac2d05A148aB512EDEDc7280c00292ED33d31f1A', // TODO: This is testnet address, change it to mainnet
    getAbi: async () => (await import('../../abis/massetManager.json')).default,
  },
};
