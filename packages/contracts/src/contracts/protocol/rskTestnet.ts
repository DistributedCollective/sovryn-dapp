import { AsyncContractConfigData } from '../../types';

export const rskTestnet: Record<string, AsyncContractConfigData> = {
  protocol: {
    address: '0x25380305f223B32FDB844152abD2E82BC5Ad99c3',
    getAbi: async () => (await import('../../abis/protocol.json')).default,
  },
  priceFeed: {
    address: '0x7f38c422b99075f63C9c919ECD200DF8d2Cf5BD4',
    getAbi: async () => (await import('../../abis/priceFeed.json')).default,
  },
  swapNetwork: {
    address: '0x61172B53423E205a399640e5283e51FE60EC2256',
    getAbi: async () => (await import('../../abis/swapNetwork.json')).default,
  },
  btcWrapperProxy: {
    address: '0xA3a46b149360a0B1e005CA8cB7522938A2da7532',
    getAbi: async () =>
      (await import('../../abis/btcWrapperProxy.json')).default,
  },
  massetManager: {
    address: '0xac2d05A148aB512EDEDc7280c00292ED33d31f1A',
    getAbi: async () => (await import('../../abis/massetManager.json')).default,
  },
  fastBtcBridge: {
    address: '0x10C848e9495a32acA95F6c23C92eCA2b2bE9903A',
    getAbi: async () => (await import('../../abis/fastBtcBridge.json')).default,
  },
  fastBtcMultisig: {
    address: '0x1D67BDA1144CacDbEFF1782f0E5B43D7B50bbFe0',
    getAbi: async () =>
      (await import('../../abis/fastBtcMultisig.json')).default,
  },
  mocIntegrationProxy: {
    address: '0xdC3e5232db60088D67aA7AF10595979D7eB5290f',
    getAbi: async () =>
      (await import('../../abis/mocIntegration.json')).default,
  },
};
