export type NewBorrowHistoryItem = {
  id: string;
  amount: string;
  timestamp: number;
  hash: string;
  borrowRate: string;
  borrowRateMode: string;
  reserve: {
    symbol: string;
    decimals: number;
    name: string;
    underlyingAsset: string;
    assetPriceUSD?: string;
  };
};
