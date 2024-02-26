import { Decimal } from '@sovryn/utils';

import { AssetsData, CryptoPair, PairData } from './PricesBy24hChange.types';

export const parseCryptoPairs = (
  pairs: PairData[],
  assetData: AssetsData | undefined,
): CryptoPair[] => {
  if (!pairs.length) {
    return [];
  }

  return pairs
    .map(pair => {
      const result = [
        {
          asset: pair.base_id,
          price24h: Number(pair.price_change_percent_24h_usd),
          priceWeek: Number(pair.price_change_week_usd),
          lastPrice: Number(pair.last_price_usd),
          assetData: assetData && assetData[pair?.base_id],
        },
      ];

      if (pair.base_symbol_legacy === 'USDT') {
        result.push({
          asset: pair.quote_id,
          price24h: -Number(pair.price_change_percent_24h),
          priceWeek: -Number(pair.price_change_week),
          lastPrice: Number(1 / pair.last_price),
          assetData: assetData && assetData[pair?.quote_id],
        });
      }

      return result;
    })
    .flat()
    .map(pair => {
      const marketCap = Decimal.from(
        pair.assetData?.circulating_supply || '0',
      ).mul(pair.lastPrice || '0');
      return {
        ...pair,
        marketCap,
        circulatingSupply: pair.assetData?.circulating_supply || '0',
      };
    })
    .sort((pairA, pairB) => (pairA.marketCap.gt(pairB.marketCap) ? -1 : 1));
};
