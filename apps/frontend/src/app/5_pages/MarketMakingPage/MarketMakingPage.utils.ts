import { SupportedTokens } from '@sovryn/contracts';

import { AmmHistory } from './MarketMakingPage.types';
import { AmmLiquidityPoolDictionary } from './utils/AmmLiquidityPoolDictionary';

export const getAmmHistory = (
  ammData: any,
  asset1: SupportedTokens,
  asset2: SupportedTokens,
): AmmHistory =>
  ammData &&
  ammData[
    AmmLiquidityPoolDictionary.get(asset1, asset2).converter.toLowerCase()
  ];
