export type RepayHistoryItem = {
  id: string;
  amount: string;
  timestamp: number;
  hash: string;
  reserve: {
    symbol: string;
    decimals: number;
    name: string;
    underlyingAsset: string;
    assetPriceUSD?: string;
  };
};
