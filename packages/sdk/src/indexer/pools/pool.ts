type TokenData = {
  symbol: string;
  name: string;
  address: string;
  // logoUrl: string;
};

type PoolData = {
  id: number;
  featured: boolean;
  identifier: string;
  type: string;
  base: TokenData;
  quote: TokenData;
  price: string;
  fee: string;
  apr: string;
  baseLiquidity: string;
  quoteLiquidity: string;
  baseVolume: string;
  quoteVolume: string;
  dailyBaseVolume: string;
  dailyQuoteVolume: string;
  extra: Record<string, any>;
};

// todo: convert to class
export type Pool = PoolData;
