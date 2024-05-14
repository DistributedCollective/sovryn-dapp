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
    address: '0x1A8E78B41bc5Ab9Ebb6996136622B9b41A601b5C',
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
  mocExchangeProxy: {
    address: '0x6acb83bb0281fb847b43cf7dd5e2766bfdf49038',
    getAbi: async () => (await import('../../abis/mocExchange.json')).default,
  },
  babelfishAggregator: {
    address: '0x1440d19436bEeaF8517896bffB957a88EC95a00F',
    getAbi: async () => (await import('../../abis/erc20.json')).default,
  },
  liquidityMiningProxy: {
    address: '0xf730af26e87D9F55E46A6C447ED2235C385E55e0',
    getAbi: async () =>
      (await import('../../abis/liquidityMining.json')).default,
  },
  feeSharing: {
    address: '0x115cAF168c51eD15ec535727F64684D33B7b08D1',
    getAbi: async () => (await import('../../abis/feeSharing.json')).default,
  },
  feeSharing_old: {
    // retained for use with legacy staking fees
    address: '0x12B1B0C67d9A771EB5Db7726d23fdc6848fd93ef',
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
  stakingRewardsOs: {
    address: '0xb0e08B7e4498ecA6868781aC3B5086fF4F66be56',
    getAbi: async () =>
      (await import('../../abis/StakingRewardsOs.json')).default,
  },
  multiCall: {
    address: '0x6c62bf5440de2cb157205b15c424bceb5c3368f5',
    getAbi: async () => (await import('../../abis/multiCall2.json')).default,
  },
  stakingFish: {
    address: '0xFd8ea2e5e8591fA791d44731499cDF2e81CD6a41',
    getAbi: async () => (await import('../../abis/staking.json')).default,
  },
  vesting: {
    address: '0x80B036ae59B3e38B573837c01BB1DB95515b7E6B',
    getAbi: async () => (await import('../../abis/vesting.json')).default,
  },
  vestingRegistry: {
    address: '0xe24ABdB7DcaB57F3cbe4cBDDd850D52F143eE920',
    getAbi: async () =>
      (await import('../../abis/vestingRegistry.json')).default,
  },
  vestingRegistryFish: {
    address: '0x036ab2DB0a3d1574469a4a7E09887Ed76fB56C41',
    getAbi: async () =>
      (await import('../../abis/vestingRegistry.json')).default,
  },
  governorAdmin: {
    address: '0xfF25f66b7D7F385503D70574AE0170b6B1622dAd',
    getAbi: async () => (await import('../../abis/governor.json')).default,
  },
  governorOwner: {
    address: '0x6496DF39D000478a7A7352C01E0E713835051CcD',
    getAbi: async () => (await import('../../abis/governor.json')).default,
  },
  fixedRateMynt: {
    address: '0x7231960A6e4AA89F3e4f9098BB42619C79F5D354',
    getAbi: async () =>
      (await import('../../abis/fixedRateConverter.json')).default,
  },
  loanTokenLogicBeaconWrbtc: {
    address: '0x845eF7Be59664899398282Ef42239634aBDd752C',
    getAbi: async () =>
      (await import('../../abis/loanTokenLogicBeacon.json')).default,
  },
  loanTokenLogicBeaconLM: {
    address: '0x5b155ECcC1dC31Ea59F2c12d2F168C956Ac0FFAa',
    getAbi: async () =>
      (await import('../../abis/loanTokenLogicBeacon.json')).default,
  },
  loanTokenSettingsLowerAdmin: {
    address: '0x248Df85079707C6B7106982b8FE236Be22816aaF',
    getAbi: async () =>
      (await import('../../abis/LoanTokenSettingsLowerAdmin.json')).default,
  },
  runeBridge: {
    address: '0x94f1dcc69019819f64807BC0D275F9f3503cBD37',
    getAbi: async () => (await import('../../abis/RuneBridge.json')).default,
  },
  merkleDistributor: {
    address: '0x8510fe153b9e6fabee709d75bf0a864cd27d7593',
    getAbi: async () =>
      (await import('../../abis/merkleDistributor.json')).default,
  },
};
