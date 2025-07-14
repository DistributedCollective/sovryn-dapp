import { AssetConfig, CrossBridgeAsset } from '../types';

// Aggregator addresses
export const aggregators = {
  mainnet: {
    xusd: '0xb5999795BE0EbB5bAb23144AA5FD6A02D080299F',
    eths: '0x4bf113905d7f69202106f613308bb02c84aadf2f',
    bnbs: '0xafD905Fe2EdBF5A7367A73B0F1e6a62Cb5E27D3e',
  },
  testnet: {
    xusd: '0x372d5C32A5e601D0e8Dd5289Bfb18da79c5E11e2',
    eths: '0x00632183B7c36Bb436C3f709E3e8e9DFB5002852',
    bnbs: '0x790C4451c2e8e4cDC50cEdEC22756DaC993e93eb',
  },
};

// BSC to RSK Assets (Mainnet)
export const bscToRskMainnetAssets: AssetConfig[] = [
  {
    asset: CrossBridgeAsset.BNB,
    symbol: 'BNB',
    icon: '/icons/bnb.svg',
    decimals: 18,
    minDecimals: 4,
    tokenContractAddress: '0xB6C313a427fa911A4C9a119e80Feea0fe20E69F0',
    isNative: true,
    targetAsset: CrossBridgeAsset.BNBS,
    isBase: true,
    usesAggregator: true,
    aggregatorContractAddress: aggregators.mainnet.bnbs,
    allowedTargets: [CrossBridgeAsset.BNBS],
  },
  {
    asset: CrossBridgeAsset.BUSD,
    symbol: 'BUSD',
    icon: '/icons/busd.svg',
    decimals: 18,
    minDecimals: 4,
    tokenContractAddress: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
    isNative: false,
    targetAsset: CrossBridgeAsset.XUSD,
    isBase: true,
    usesAggregator: true,
    aggregatorContractAddress: aggregators.mainnet.xusd,
    allowedTargets: [CrossBridgeAsset.XUSD],
  },
  {
    asset: CrossBridgeAsset.USDT,
    symbol: 'USDT',
    icon: '/icons/usdt.svg',
    decimals: 18,
    minDecimals: 4,
    tokenContractAddress: '0x55d398326f99059ff775485246999027b3197955',
    isNative: false,
    targetAsset: CrossBridgeAsset.XUSD,
    isBase: true,
    usesAggregator: true,
    aggregatorContractAddress: aggregators.mainnet.xusd,
    allowedTargets: [CrossBridgeAsset.XUSD],
  },
  {
    asset: CrossBridgeAsset.USDC,
    symbol: 'USDC',
    icon: '/icons/usdc.svg',
    decimals: 18,
    minDecimals: 4,
    tokenContractAddress: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
    isNative: false,
    targetAsset: CrossBridgeAsset.XUSD,
    isBase: true,
    usesAggregator: true,
    aggregatorContractAddress: aggregators.mainnet.xusd,
    allowedTargets: [CrossBridgeAsset.XUSD],
  },
  {
    asset: CrossBridgeAsset.DAI,
    symbol: 'DAI',
    icon: '/icons/dai.svg',
    decimals: 18,
    minDecimals: 4,
    tokenContractAddress: '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3',
    isNative: false,
    targetAsset: CrossBridgeAsset.XUSD,
    isBase: true,
    usesAggregator: true,
    aggregatorContractAddress: aggregators.mainnet.xusd,
    allowedTargets: [CrossBridgeAsset.XUSD],
  },
  {
    asset: CrossBridgeAsset.ETH,
    symbol: 'ETH',
    icon: '/icons/eth.svg',
    decimals: 18,
    minDecimals: 4,
    tokenContractAddress: '0x2170ed0880ac9a755fd29b2688956bd959f933f8',
    isNative: false,
    targetAsset: CrossBridgeAsset.ETHS,
    isBase: true,
    usesAggregator: true,
    aggregatorContractAddress: aggregators.mainnet.eths,
    allowedTargets: [CrossBridgeAsset.ETHS],
  },
];

// RSK to BSC Assets (Mainnet)
export const rskToBscMainnetAssets: AssetConfig[] = [
  {
    asset: CrossBridgeAsset.BNBS,
    symbol: 'BNBs',
    icon: '/icons/bnbs.svg',
    decimals: 18,
    minDecimals: 4,
    tokenContractAddress: '0x6D9659bdF5b1A1dA217f7BbAf7dBAF8190E2e71B',
    isNative: false,
    targetAsset: CrossBridgeAsset.BNBS,
    isBase: true,
    usesAggregator: false,
    aggregatorContractAddress: aggregators.mainnet.bnbs,
    bridgeTokenAddress: '0xd2a826b78200c8434b957913ce4067e6e3169385',
    allowedTargets: [CrossBridgeAsset.BNB],
    targetContracts: new Map([
      [CrossBridgeAsset.BNB, '0xd2a826b78200c8434b957913ce4067e6e3169385'],
    ]),
  },
  {
    asset: CrossBridgeAsset.ETHS,
    symbol: 'ETHs',
    icon: '/icons/eths.svg',
    decimals: 18,
    minDecimals: 4,
    tokenContractAddress: '0x1D931BF8656D795e50Ef6d639562C5bD8AC2b78F',
    isNative: false,
    targetAsset: CrossBridgeAsset.ETHS,
    isBase: true,
    usesAggregator: false,
    aggregatorContractAddress: aggregators.mainnet.eths,
    bridgeTokenAddress: '0x30d1B36924c2c0CD1c03EC257D7FFf31bD8c3007',
    allowedTargets: [CrossBridgeAsset.ETH],
    targetContracts: new Map([
      [CrossBridgeAsset.ETH, '0x30d1B36924c2c0CD1c03EC257D7FFf31bD8c3007'],
    ]),
  },
  {
    asset: CrossBridgeAsset.XUSD,
    symbol: 'XUSD',
    icon: '/icons/xusd.svg',
    decimals: 18,
    minDecimals: 4,
    tokenContractAddress: '0xb5999795BE0EbB5bAb23144AA5FD6A02D080299F',
    isNative: false,
    targetAsset: CrossBridgeAsset.XUSD,
    isBase: true,
    usesAggregator: false,
    aggregatorContractAddress: aggregators.mainnet.xusd,
    bridgeTokenAddress: '0xFf4299bCA0313C20A61dc5eD597739743BEf3f6d',
    allowedTargets: [
      CrossBridgeAsset.USDT,
      CrossBridgeAsset.USDC,
      CrossBridgeAsset.DAI,
      CrossBridgeAsset.BUSD,
    ],
    targetContracts: new Map([
      [CrossBridgeAsset.USDT, '0xFf4299bCA0313C20A61dc5eD597739743BEf3f6d'],
      [CrossBridgeAsset.USDC, '0x91EDceE9567cd5612c9DEDeaAE24D5e574820af1'],
      [CrossBridgeAsset.DAI, '0x6A42Ff12215a90f50866A5cE43A9c9C870116e76'],
      [CrossBridgeAsset.BUSD, '0x61e9604e31a736129d7f5C58964c75935b2d80D6'],
    ]),
  },
];

// Similar configurations for testnet...
export const bscToRskTestnetAssets: AssetConfig[] = [
  // ... testnet assets
];

export const rskToBscTestnetAssets: AssetConfig[] = [
  // ... testnet assets
];
