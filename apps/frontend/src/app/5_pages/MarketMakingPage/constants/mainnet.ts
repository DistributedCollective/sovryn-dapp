import { SupportedTokens } from '@sovryn/contracts';
import { ChainIds } from '@sovryn/ethers-provider';

import { PromotionColor } from '../MarketMakingPage.types';
import { AmmLiquidityPool } from '../utils/AmmLiquidityPool';

export const mainnetAmm = [
  new AmmLiquidityPool(
    SupportedTokens.dllr,
    SupportedTokens.rbtc,
    1,
    ChainIds.RSK_MAINNET,
    '0xe81373285eb8cdee2e0108e98c5aa022948da9d2',
    '0x3D5eDF3201876BF6935090C319FE3Ff36ED3D494',
  ).setPromotionColor(PromotionColor.Orange),
];
