import { SupportedTokens } from '@sovryn/contracts';
import { ChainIds } from '@sovryn/ethers-provider';

import { PromotionColor } from './MarketMakingPage.types';
import { AmmLiquidityPool } from './utils/AmmLiquidityPool';

export const MAINNET_AMM = [
  new AmmLiquidityPool(
    SupportedTokens.dllr,
    SupportedTokens.rbtc,
    1,
    ChainIds.RSK_MAINNET,
    '0xe81373285eb8cdee2e0108e98c5aa022948da9d2',
    '0x3D5eDF3201876BF6935090C319FE3Ff36ED3D494',
  ).setPromotionColor(PromotionColor.Orange),
];

export const TESTNET_AMM = [
  new AmmLiquidityPool(
    SupportedTokens.dllr,
    SupportedTokens.rbtc,
    1,
    ChainIds.RSK_TESTNET,
    '0x5fc0b3ac4683bd8af8e244e646d897a2c3f2a6ac',
    '0x64B1aC8301f64c92721804ed78f2ee6025aaf7cE',
  ).setPromotionColor(PromotionColor.Orange),
];
