export type ChartData = {
  date: Date;
  lendAPY: number;
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
  lendAPY: number[];
  availableLiquidity: number[];
  borrowedLiquidity: number[];
};
