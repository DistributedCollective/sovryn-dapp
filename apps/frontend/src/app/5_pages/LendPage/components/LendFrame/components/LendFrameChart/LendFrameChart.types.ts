export type PoolHistoryData = {
  supply: string;
  supply_apr: string;
  borrow_apr: string;
  timestamp: string;
};

export type MockData = {
  dates: string[];
  lendApr: number[];
  totalLiquidity: number[];
};
