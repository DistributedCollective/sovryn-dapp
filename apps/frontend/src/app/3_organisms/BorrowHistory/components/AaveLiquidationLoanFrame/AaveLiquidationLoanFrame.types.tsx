export type LiquidationHistoryItem = {
  id: string;
  collateralAmount: string;
  collateralReserve: {
    symbol: string;
    decimals: number;
    name: string;
    underlyingAsset: string;
  };
  timestamp: number;
  hash: string;
  debtAmount: string;
  debtReserve: {
    symbol: string;
    decimals: number;
    name: string;
    underlyingAsset: string;
  };
};
