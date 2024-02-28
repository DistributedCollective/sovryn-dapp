type AmmAPY = {
  activity_date: string;
  apy: number;
  pool: string;
  pool_token: string;
};

export type AmmBalanceRow = {
  ammPool: string;
  ammRateBtc: number;
  ammRateToken: number;
  btcDelta: number;
  contractBalanceBtc: number;
  contractBalanceToken: number;
  stakedBalanceBtc: number;
  stakedBalanceToken: number;
  tokenDelta: number;
  yesterdayApy: AmmAPY[];
};
