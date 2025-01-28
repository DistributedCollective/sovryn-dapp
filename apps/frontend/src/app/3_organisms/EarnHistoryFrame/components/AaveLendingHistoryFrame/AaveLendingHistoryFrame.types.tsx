export type LendingHistoryItem = {
  id: string;
  action: 'Supply' | 'RedeemUnderlying' | 'UsageAsCollateral';
  amount: string;
  timestamp: number;
  txHash: string;
  assetPriceUSD?: string;
  fromState?: boolean;
  toState?: boolean;
  reserve: {
    symbol: string;
    decimals: number;
    name: string;
    underlyingAsset: string;
  };
};
