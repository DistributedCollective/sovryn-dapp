import { AmmHistory } from './MarketMakingPage.types';
import { AmmLiquidityPoolDictionary } from './utils/AmmLiquidityPoolDictionary';

export const getAmmHistory = (
  ammData: any,
  asset1: string,
  asset2: string,
): AmmHistory =>
  ammData &&
  ammData[
    AmmLiquidityPoolDictionary.get(asset1, asset2).converter.toLowerCase()
  ];
