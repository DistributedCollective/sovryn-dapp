import { AssetConfig } from '../types';

// Aggregator addresses
export const aggregators = {
  mainnet: {
    xusd: '0x1440d19436bEeaF8517896bffB957a88EC95a00F',
    eths: '0x4bf113905d7f69202106f613308bb02c84aadf2f',
    bnbs: '0xafD905Fe2EdBF5A7367A73B0F1e6a62Cb5E27D3e',
  },
  testnet: {
    xusd: '0x1572D7E4a78A8AD14AE722E6fE5f5600a2c7A149',
    eths: '0x04D92DaA8f3Ef7bD222195e8D1DbE8D89A8CebD3',
    bnbs: '0x790C4451c2e8e4cDC50cEdEC22756DaC993e93eb',
  },
};

// BSC to RSK Assets (Mainnet)
export const bscToRskMainnetAssets: AssetConfig[] = [
  {
    symbol: 'BNB',
    minDecimals: 4,
    isNative: true,
    isBase: false,
    usesAggregator: true,
    aggregatorContractAddress: aggregators.mainnet.bnbs,
    bridgeTokenAddress: '0xB6C313a427fa911A4C9a119e80Feea0fe20E69F0',
  },
  {
    symbol: 'ETH',
    minDecimals: 4,
    isNative: false,
    isBase: false,
    usesAggregator: true,
    aggregatorContractAddress: aggregators.mainnet.eths,
  },
];

// RSK to BSC Assets (Mainnet)
export const rskToBscMainnetAssets: AssetConfig[] = [
  {
    symbol: 'BNB',
    minDecimals: 4,
    isNative: false,
    isBase: false,
    usesAggregator: true,
    aggregatorContractAddress: aggregators.mainnet.bnbs,
    bridgeTokenAddress: '0xd2a826b78200c8434b957913ce4067e6e3169385',
  },
  {
    symbol: 'ETH',
    minDecimals: 4,
    isNative: false,
    isBase: false,
    usesAggregator: true,
    aggregatorContractAddress: aggregators.mainnet.eths,
    bridgeTokenAddress: '0x30d1B36924c2c0CD1c03EC257D7FFf31bD8c3007',
  },
];

// ETH to RSK Assets (Mainnet)
export const ethToRskMainnetAssets: AssetConfig[] = [
  {
    symbol: 'ESOV',
    minDecimals: 4,
    isNative: false,
    isBase: false,
    usesAggregator: false,
    aggregatorContractAddress: undefined,
    bridgeTokenAddress: '0xbdab72602e9ad40fc6a6852caf43258113b8f7a5',
  },
  {
    symbol: 'DLLR',
    minDecimals: 4,
    isNative: false,
    isBase: true,
    usesAggregator: false,
    aggregatorContractAddress: undefined,
    bridgeTokenAddress: '0xbdbb63f938c8961af31ead3deba5c96e6a323dd1',
  },
  {
    symbol: 'ETH',
    minDecimals: 4,
    isNative: true,
    isBase: false,
    usesAggregator: true,
    aggregatorContractAddress: aggregators.mainnet.eths,
    bridgeTokenAddress: '0xd412acd34a832a09c80c8a4895ff46d733f09538',
  },
];

// RSK to ETH Assets (Mainnet)
export const rskToEthMainnetAssets: AssetConfig[] = [
  {
    symbol: 'SOV',
    minDecimals: 4,
    isNative: false,
    isBase: false,
    usesAggregator: false,
    aggregatorContractAddress: undefined,
  },
  {
    symbol: 'DLLR',
    minDecimals: 4,
    isNative: false,
    isBase: true,
    usesAggregator: false,
    aggregatorContractAddress: undefined,
  },
  {
    symbol: 'ETH',
    minDecimals: 4,
    isNative: false,
    isBase: false,
    usesAggregator: true,
    aggregatorContractAddress: aggregators.mainnet.eths,
    bridgeTokenAddress: '0xFe878227c8F334038DAb20a99fC3B373fFe0a755',
  },
];

// BSC to RSK Assets (Testnet)
export const bscToRskTestnetAssets: AssetConfig[] = [
  {
    symbol: 'BNB',
    minDecimals: 4,
    isNative: true,
    isBase: false,
    usesAggregator: true,
    aggregatorContractAddress: aggregators.testnet.bnbs,
    bridgeTokenAddress: '0x68bD35422b457f315AA176743325a9F7C9830c68',
  },
  {
    symbol: 'ETH',
    minDecimals: 4,
    isNative: false,
    isBase: false,
    usesAggregator: true,
    aggregatorContractAddress: aggregators.testnet.eths,
  },
];

// RSK to BSC Assets (Testnet)
export const rskToBscTestnetAssets: AssetConfig[] = [
  {
    symbol: 'BNB',
    minDecimals: 4,
    isNative: false,
    isBase: false,
    usesAggregator: true,
    aggregatorContractAddress: aggregators.testnet.bnbs,
    bridgeTokenAddress: '0xafa6A1eb7E2282E8854822d2bB412b6db2cabA4E',
  },
  {
    symbol: 'ETH',
    minDecimals: 4,
    isNative: false,
    isBase: false,
    usesAggregator: true,
    aggregatorContractAddress: aggregators.testnet.eths,
    bridgeTokenAddress: '0x793CE6F95912D5b43532c2116e1b68993d902272',
  },
];
