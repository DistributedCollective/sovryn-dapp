export type ChartData = {
  date: Date;
  lendApr: number;
  availableLiquidity: number;
  borrowedLiquidity: number;
};

export type ChartProps = {
  data: ChartData[];
};

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
