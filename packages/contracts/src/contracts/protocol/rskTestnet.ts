import { AsyncContractConfigData } from '../../types';

export const rskTestnet: Record<string, AsyncContractConfigData> = {
  protocol: {
    address: '0x5A0D867e0D70Fcc6Ade25C3F1B89d618b5B4Eaa7', // TODO: This is mainnet address, change it to testnet
    getAbi: async () => (await import('../../abis/protocol.json')).default,
  },
  swapNetwork: {
    address: '0x98aCE08D2b759a265ae326F010496bcD63C15afc', // TODO: This is mainnet address, change it to testnet
    getAbi: async () => (await import('../../abis/swapNetwork.json')).default,
  },
  massetManager: {
    address: '0xac2d05A148aB512EDEDc7280c00292ED33d31f1A',
    getAbi: async () => (await import('../../abis/massetManager.json')).default,
  },
};
