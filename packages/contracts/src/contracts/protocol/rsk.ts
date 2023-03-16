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
    address: '0x5F777270259E32F79589fe82269DB6209F7b7582',
    getAbi: async () => (await import('../../abis/massetManager.json')).default,
  },
  fastBtcBridge: {
    address: '0x0D5006330289336ebdF9d0AC9E0674f91b4851eA',
    getAbi: async () => (await import('../../abis/fastBtcBridge.json')).default,
  },
  fastBtcMultisig: {
    address: '0x0f279e810B95E0d425622b9b40D7bCD0B5C4B19d',
    getAbi: async () =>
      (await import('../../abis/fastBtcMultisig.json')).default,
  },
};
