import { AsyncContractConfigData } from '../../types';

export const rsk: Record<string, AsyncContractConfigData> = {
  protocol: {
    address: '0x5A0D867e0D70Fcc6Ade25C3F1B89d618b5B4Eaa7',
    getAbi: async () => (await import('../../abis/protocol.json')).default,
  },
  priceFeed: {
    address: '0x437AC62769f386b2d238409B7f0a7596d36506e4',
    getAbi: async () => (await import('../../abis/priceFeed.json')).default,
  },
  swapNetwork: {
    address: '0x98aCE08D2b759a265ae326F010496bcD63C15afc',
    getAbi: async () => (await import('../../abis/swapNetwork.json')).default,
  },
  btcWrapperProxy: {
    address: '0x2BEe6167f91D10db23252e03de039Da6b9047D49',
    getAbi: async () =>
      (await import('../../abis/btcWrapperProxy.json')).default,
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
  mocIntegrationProxy: {
    address: '0x9363323D9c653a2b89C758f62f5043f0B2c67C71',
    getAbi: async () =>
      (await import('../../abis/mocIntegration.json')).default,
  },
  feeSharing: {
    address: '0x115cAF168c51eD15ec535727F64684D33B7b08D1',
    getAbi: async () => (await import('../../abis/feeSharing.json')).default,
  },
  staking: {
    address: '0x5684a06CaB22Db16d901fEe2A5C081b4C91eA40e',
    getAbi: async () => (await import('../../abis/staking.json')).default,
  },
  stakingRewards: {
    address: '0x8304FB3614c728B712e94F9D4DF6719fede6517F',
    getAbi: async () =>
      (await import('../../abis/stakingRewards.json')).default,
  },
  mocExchangeProxy: {
    address: '0x6acb83bb0281fb847b43cf7dd5e2766bfdf49038',
    getAbi: async () => (await import('../../abis/mocExchange.json')).default,
  },
  babelfishAggregator: {
    address: '0x1440d19436bEeaF8517896bffB957a88EC95a00F',
    getAbi: async () => (await import('../../abis/erc20.json')).default,
  },
  feeSharing: {
    address: '0x115cAF168c51eD15ec535727F64684D33B7b08D1',
    getAbi: async () => (await import('../../abis/feeSharing.json')).default,
  },
  staking: {
    address: '0x5684a06CaB22Db16d901fEe2A5C081b4C91eA40e',
    getAbi: async () => (await import('../../abis/staking.json')).default,
  },
  stakingRewards: {
    address: '0x8304FB3614c728B712e94F9D4DF6719fede6517F',
    getAbi: async () =>
      (await import('../../abis/stakingRewards.json')).default,
  },
  babelfishAggregator: {
    address: '0x1440d19436bEeaF8517896bffB957a88EC95a00F',
    getAbi: async () => (await import('../../abis/erc20.json')).default,
  },
};
