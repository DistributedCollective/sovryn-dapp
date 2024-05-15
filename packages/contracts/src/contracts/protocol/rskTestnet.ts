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
  feeSharing: {
    address: '0xedD92fb7C556E4A4faf8c4f5A90f471aDCD018f4',
    getAbi: async () => (await import('../../abis/feeSharing.json')).default,
  },
  feeSharing_old: {
    // retained for use with legacy staking fees
    address: '0xedD92fb7C556E4A4faf8c4f5A90f471aDCD018f4',
    getAbi: async () => (await import('../../abis/feeSharing.json')).default,
  },
  staking: {
    address: '0xc37A85e35d7eECC82c4544dcba84CF7E61e1F1a3',
    getAbi: async () => (await import('../../abis/staking.json')).default,
  },
  stakingRewards: {
    address: '0x18eF0ff12f1b4D30104B4680D485D026C26D164D',
    getAbi: async () =>
      (await import('../../abis/stakingRewards.json')).default,
  },
  stakingRewardsOs: {
    address: '0x720bA758526E086EAe849063f3160F12a624A6f6',
    getAbi: async () =>
      (await import('../../abis/StakingRewardsOs.json')).default,
  },
  multiCall: {
    address: '0x9e469e1fc7fb4c5d17897b68eaf1afc9df39f103',
    getAbi: async () => (await import('../../abis/multiCall2.json')).default,
  },
  stakingFish: {
    address: '0xc1fc98FEFA2130fC1CE352ec85f7aa61021eFE97',
    getAbi: async () => (await import('../../abis/staking.json')).default,
  },
  vesting: {
    address: '0x80ec7ADd6CC1003BBEa89527ce93722e1DaD5c2a',
    getAbi: async () => (await import('../../abis/vesting.json')).default,
  },
  vestingRegistry: {
    address: '0x09e8659B6d204C6b1bED2BFF8E3F43F834A5Bbc4',
    getAbi: async () =>
      (await import('../../abis/vestingRegistry.json')).default,
  },
  vestingRegistryFish: {
    address: '0xFd8ea2e5e8591fA791d44731499cDF2e81CD6a41',
    getAbi: async () =>
      (await import('../../abis/vestingRegistry.json')).default,
  },
  governorAdmin: {
    address: '0xc9a558f522755C1Ea6C25a885ae8131E00c9971A',
    getAbi: async () => (await import('../../abis/governor.json')).default,
  },
  governorOwner: {
    address: '0x69dB16Aa6EEf291Fec522581F4fc9c82dFE60beD',
    getAbi: async () => (await import('../../abis/governor.json')).default,
  },
  fixedRateMynt: {
    address: '0x36C6554EE2FcCAb1389aF309aB0793abce0E91F3',
    getAbi: async () =>
      (await import('../../abis/fixedRateConverter.json')).default,
  },
  loanTokenLogicBeaconWrbtc: {
    address: '0x6EDEeC91f5C0A57248BF4D7dBce2c689c74F3c06',
    getAbi: async () =>
      (await import('../../abis/loanTokenLogicBeacon.json')).default,
  },
  loanTokenLogicBeaconLM: {
    address: '0xb9f993E7Da03D8a21Cda6fa1925BAAE17C6932aE',
    getAbi: async () =>
      (await import('../../abis/loanTokenLogicBeacon.json')).default,
  },
  loanTokenSettingsLowerAdmin: {
    address: '0x7cA151dc569fa88701f149fc81e960376C111203',
    getAbi: async () =>
      (await import('../../abis/LoanTokenSettingsLowerAdmin.json')).default,
  },
  runeBridge: {
    address: '0x296EC9db115a352D3a43873b3814ec795441B8dd',
    getAbi: async () => (await import('../../abis/RuneBridge.json')).default,
  },
  merkleDistributor: {
    address: '0xcce97e181a355939248afe2aab9587b46de56396',
    getAbi: async () =>
      (await import('../../abis/merkleDistributor.json')).default,
  },
};
