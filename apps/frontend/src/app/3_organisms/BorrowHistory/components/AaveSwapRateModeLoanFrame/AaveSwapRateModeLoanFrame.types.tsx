export type SwapBorrowRateModeHistoryItem = {
  id: string;
  from: string;
  to: string;
  timestamp: number;
  hash: string;
  variableBorrowRate: string;
  stableBorrowRate: string;
  reserve: {
    symbol: string;
    decimals: number;
    name: string;
    underlyingAsset: string;
  };
};
