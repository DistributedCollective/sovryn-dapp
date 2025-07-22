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
    symbol: 'BNB',
    minDecimals: 4,
    isNative: true,
    targetAsset: CrossBridgeAsset.BNBS,
    isBase: true,
    usesAggregator: true,
    aggregatorContractAddress: aggregators.mainnet.bnbs,
    allowedTargets: [CrossBridgeAsset.BNBS],
  },
  {
    symbol: 'BUSD',
    minDecimals: 4,
    isNative: false,
    targetAsset: CrossBridgeAsset.XUSD,
    isBase: true,
    usesAggregator: true,
    aggregatorContractAddress: aggregators.mainnet.xusd,
    allowedTargets: [CrossBridgeAsset.XUSD],
  },
  {
    symbol: 'USDT',
    minDecimals: 4,
    isNative: false,
    targetAsset: CrossBridgeAsset.XUSD,
    isBase: true,
    usesAggregator: true,
    aggregatorContractAddress: aggregators.mainnet.xusd,
    allowedTargets: [CrossBridgeAsset.XUSD],
  },
  {
    symbol: 'USDC',
    minDecimals: 4,
    isNative: false,
    targetAsset: CrossBridgeAsset.XUSD,
    isBase: true,
    usesAggregator: true,
    aggregatorContractAddress: aggregators.mainnet.xusd,
    allowedTargets: [CrossBridgeAsset.XUSD],
  },
  {
    symbol: 'DAI',
    minDecimals: 4,
    isNative: false,
    targetAsset: CrossBridgeAsset.XUSD,
    isBase: true,
    usesAggregator: true,
    aggregatorContractAddress: aggregators.mainnet.xusd,
    allowedTargets: [CrossBridgeAsset.XUSD],
  },
  {
    symbol: 'ETH',
    minDecimals: 4,
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
    symbol: 'BNB',
    minDecimals: 4,
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
    symbol: 'ETH',
    minDecimals: 4,
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
];

// BSC to RSK Assets (Testnet)
export const bscToRskTestnetAssets: AssetConfig[] = [
  {
    symbol: 'BNB',
    minDecimals: 4,
    isNative: true,
    targetAsset: CrossBridgeAsset.BNBS,
    isBase: true,
    usesAggregator: true,
    aggregatorContractAddress: '0x790C4451c2e8e4cDC50cEdEC22756DaC993e93eb',
    allowedTargets: [CrossBridgeAsset.BNBS],
  },
  {
    symbol: 'BUSD',
    minDecimals: 4,
    isNative: false,
    targetAsset: CrossBridgeAsset.XUSD,
    isBase: true,
    usesAggregator: true,
    aggregatorContractAddress: '0x372d5C32A5e601D0e8Dd5289Bfb18da79c5E11e2',
    allowedTargets: [CrossBridgeAsset.XUSD],
  },
  {
    symbol: 'USDT',
    minDecimals: 4,
    isNative: false,
    targetAsset: CrossBridgeAsset.XUSD,
    isBase: true,
    usesAggregator: true,
    aggregatorContractAddress: '0x372d5C32A5e601D0e8Dd5289Bfb18da79c5E11e2',
    allowedTargets: [CrossBridgeAsset.XUSD],
  },
  {
    symbol: 'USDC',
    minDecimals: 4,
    isNative: false,
    targetAsset: CrossBridgeAsset.XUSD,
    isBase: true,
    usesAggregator: true,
    aggregatorContractAddress: '0x372d5C32A5e601D0e8Dd5289Bfb18da79c5E11e2',
    allowedTargets: [CrossBridgeAsset.XUSD],
  },
  {
    symbol: 'DAI',
    minDecimals: 4,
    isNative: false,
    targetAsset: CrossBridgeAsset.XUSD,
    isBase: true,
    usesAggregator: true,
    aggregatorContractAddress: '0x372d5C32A5e601D0e8Dd5289Bfb18da79c5E11e2',
    allowedTargets: [CrossBridgeAsset.XUSD],
  },
  {
    symbol: 'ETH',
    minDecimals: 4,
    isNative: false,
    targetAsset: CrossBridgeAsset.ETHS,
    isBase: true,
    usesAggregator: true,
    aggregatorContractAddress: '0x00632183B7c36Bb436C3f709E3e8e9DFB5002852',
    allowedTargets: [CrossBridgeAsset.ETHS],
  },
];

// RSK to BSC Assets (Testnet)
export const rskToBscTestnetAssets: AssetConfig[] = [
  {
    symbol: 'BNB',
    minDecimals: 4,
    isNative: false,
    targetAsset: CrossBridgeAsset.BNBS,
    isBase: true,
    usesAggregator: false,
    aggregatorContractAddress: '0x790C4451c2e8e4cDC50cEdEC22756DaC993e93eb',
    bridgeTokenAddress: '0xafa6A1eb7E2282E8854822d2bB412b6db2cabA4E',
    allowedTargets: [CrossBridgeAsset.BNB],
    targetContracts: new Map([
      [CrossBridgeAsset.BNB, '0xafa6A1eb7E2282E8854822d2bB412b6db2cabA4E'],
    ]),
  },
  {
    symbol: 'ETH',
    minDecimals: 4,
    isNative: false,
    targetAsset: CrossBridgeAsset.ETHS,
    isBase: true,
    usesAggregator: false,
    aggregatorContractAddress: '0x00632183B7c36Bb436C3f709E3e8e9DFB5002852',
    bridgeTokenAddress: '0x793CE6F95912D5b43532c2116e1b68993d902272',
    allowedTargets: [CrossBridgeAsset.ETH],
    targetContracts: new Map([
      [CrossBridgeAsset.ETH, '0x793CE6F95912D5b43532c2116e1b68993d902272'],
    ]),
  },
];
