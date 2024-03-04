import { Decimal } from '@sovryn/utils';

export type PairData = {
  trading_pairs: string;
  base_symbol: string;
  base_symbol_legacy: string;
  base_id: string;
  quote_symbol: string;
  quote_symbol_legacy: string;
  quote_id: string;
  last_price: number;
  last_price_usd: number;
  inverse_price: number;
  high_price_24h: number;
  high_price_24h_usd: number;
  lowest_price_24h: number;
  lowest_price_24h_usd: number;
  base_volume: number;
  quote_volume: number;
  price_change_percent_24h: number;
  price_change_percent_24h_usd: number;
  price_change_week: number;
  price_change_week_usd: number;
  day_price: number;
};

export type AssetData = {
  symbol: string;
  name: string;
  id: string;
  trading_fee: number;
  unified_cryptoasset_id: string;
  circulating_supply: number;
  updated: string;
};

export type AssetsData = {
  [key: string]: AssetData;
};

export type CryptoPair = {
  marketCap: Decimal;
  circulatingSupply: string | number;
  asset: string;
  price24h: number;
  priceWeek: number;
  lastPrice: number;
  assetData: AssetData | undefined;
};
