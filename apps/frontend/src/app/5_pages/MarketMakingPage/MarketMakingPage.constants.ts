import { SupportedTokens } from '@sovryn/contracts';
import { ChainIds } from '@sovryn/ethers-provider';

import { PromotionData } from './MarketMakingPage.types';
import { AmmLiquidityPool } from './utils/AmmLiquidityPool';

export const MAINNET_AMM = [
  new AmmLiquidityPool(
    SupportedTokens.dllr,
    SupportedTokens.rbtc,
    1,
    ChainIds.RSK_MAINNET,
    '0xe81373285eb8cdee2e0108e98c5aa022948da9d2',
    '0x3D5eDF3201876BF6935090C319FE3Ff36ED3D494',
  ),

  new AmmLiquidityPool(
    SupportedTokens.sov,
    SupportedTokens.rbtc,
    1,
    ChainIds.RSK_MAINNET,
    '0xe76Ea314b32fCf641C6c57f14110c5Baa1e45ff4',
    '0x09C5faF7723b13434ABdF1a65aB1B667BC02A902',
  ).setPreviousConverters([
    '0x3fd679b01ddab34da8f72b7ec301aa75ea25f338',
    '0x88a67a0e79e311fe93c6e2101d55d6d2ae3a7e94',
  ]),
  new AmmLiquidityPool(
    SupportedTokens.fish,
    SupportedTokens.rbtc,
    1,
    ChainIds.RSK_MAINNET,
    '0xdeb0894196863dbb2f2d4c683f6d33a2197056b5',
    '0x35A74a38Fd7728F1c6BC39aE3b18C974b7979ddD',
  ).setPreviousConverters([
    '0xe731DA93034D769c2045B1ee137D42E1Aa23C18e',
    '0x832769cc15dbdd6814819988c7a875ec2cb943e8',
  ]),
  new AmmLiquidityPool(
    SupportedTokens.moc,
    SupportedTokens.rbtc,
    1,
    ChainIds.RSK_MAINNET,
    '0xe321442DC4793c17F41Fe3fB192a856A4864cEAF',
    '0x7Fef930ebaA90B2f8619722adc55e3f1D965B79b',
  )
    .setSovRewards(false)
    .setPreviousConverters([
      '0x34031D1cd14e2C80B0268B47eFf49643375aFaeb',
      '0x60cc333072f16d5f4cb2bc36d6aa1f00381e22c2',
    ]),
  new AmmLiquidityPool(
    SupportedTokens.rif,
    SupportedTokens.rbtc,
    1,
    ChainIds.RSK_MAINNET,
    '0x65528e06371635a338ca804cd65958a11cb11009',
    '0xAE66117C8105a65D914fB47d37a127E879244319',
  ).setPreviousConverters([
    '0x1769044CBa7aD37719badE16Cc71EC3f027b943D',
    '0xf6377dec9ce79b5bc0576618a5cd3e95f49f9ace',
  ]),
  new AmmLiquidityPool(
    SupportedTokens.mynt,
    SupportedTokens.rbtc,
    1,
    ChainIds.RSK_MAINNET,
    '0x3a18e61d9c9f1546dea013478dd653c793098f17',
    '0x36263AC99ecDcf1aB20513D580B7d8D32D3C439d',
  ).setPreviousConverters(['0x25B8D024B39174824424f032423E03dd7dcCF044']),
];

export const TESTNET_AMM = [
  new AmmLiquidityPool(
    SupportedTokens.dllr,
    SupportedTokens.rbtc,
    1,
    ChainIds.RSK_TESTNET,
    '0x5fc0b3ac4683bd8af8e244e646d897a2c3f2a6ac',
    '0x64B1aC8301f64c92721804ed78f2ee6025aaf7cE',
  ),
  new AmmLiquidityPool(
    SupportedTokens.sov,
    SupportedTokens.rbtc,
    1,
    ChainIds.RSK_TESTNET,
    '0xc2d05263318e2304fc7cdad40eea6a091b310080',
    '0xdF298421CB18740a7059b0Af532167fAA45e7A98',
  ).setPreviousConverters(['0xaBAABc2191A23D6Bb2cfa973892062c131cb7647']),
  new AmmLiquidityPool(
    SupportedTokens.fish,
    SupportedTokens.rbtc,
    1,
    ChainIds.RSK_TESTNET,
    '0x4265d4f55219a4BDe9f1DE1348dA1f0b504849b4',
    '0xe41E262889f89b9a6331680606D9e9AabD01743e',
  ).setPreviousConverters(['0x5871040a14331c0f7AB5390A3Df16D271b0936ef']),
  new AmmLiquidityPool(
    SupportedTokens.moc,
    SupportedTokens.rbtc,
    1,
    ChainIds.RSK_TESTNET,
    '0x2cb88F02cCA4dddBE8C41a6920853838Ada09F8b',
    '0x6e03DEFD0ae9091Be74f64c8CB9BE319994E5deB',
  )
    .setSovRewards(false)
    .setPreviousConverters(['0x3D18E1EC60c9725494252A835593aa90Da777E15']),
  new AmmLiquidityPool(
    SupportedTokens.rif,
    SupportedTokens.rbtc,
    1,
    ChainIds.RSK_TESTNET,
    '0xA82881bceb367f8653559937A6eFBFffBF2E06DD',
    '0x67fAA17ce83b14B2EA0e643A9030B133edD3Cc43',
  ),
  new AmmLiquidityPool(
    SupportedTokens.mynt,
    SupportedTokens.rbtc,
    1,
    ChainIds.RSK_TESTNET,
    '0x84953dAF0E7a9fFb8B4fDf7F948185e1cF85852e',
    '0xB12FA09a50c56e9a0C826b98e76DA7645017AB4D',
  ),
];

export const BLOCKS_PER_WEEK = 20160;

export const MINIMUM_REWARD = 500;

export const PLACEHOLDER_PROMOTION: PromotionData = {
  rewardAmount: 0,
  type: 'AMM',
  poolTokenA: '',
  asset1: SupportedTokens.sov,
  asset2: SupportedTokens.rbtc,
  ammData: {
    pool: '',
    data: {},
    balanceHistory: [],
  },
  linkAsset: '',
  apy: '',
};

export const AMM_SERVICE_URL = {
  [ChainIds.RSK_MAINNET]: 'https://amm-apy.sovryn.app/',
  [ChainIds.RSK_TESTNET]: 'https://amm-apy.test.sovryn.app/',
};
