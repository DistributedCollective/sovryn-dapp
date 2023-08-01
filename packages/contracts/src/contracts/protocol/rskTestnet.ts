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
    address: '0x6390dF6De9F24902B29740371525C2CeAa8f5a4f',
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
    address: '0xb3E92Db36eeac0627385Fa4F39F615a85eA5E911',
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
  mocExchangeProxy: {
    address: '0xc03Ac60eBbc01A1f4e9b5bb989F359e5D8348919',
    getAbi: async () => (await import('../../abis/mocExchange.json')).default,
  },
  babelfishAggregator: {
    address: '0x1572D7E4a78A8AD14AE722E6fE5f5600a2c7A149',
    getAbi: async () => (await import('../../abis/erc20.json')).default,
  },
  liquidityMiningProxy: {
    address: '0xe28aEbA913c34EC8F10DF0D9C92D2Aa27545870e',
    getAbi: async () =>
      (await import('../../abis/liquidityMining.json')).default,
  },
};
