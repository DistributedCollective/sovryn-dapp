export type MockData<T> = {
  data1: T[];
  data2: T[];
  data3: T[];
  label1: string;
  lineColor: string;
  xLabels: string[];
};

export interface RatesData {
  currentUsageRatio: string;
  optimalUsageRatio: string;
  baseVariableBorrowRate: string;
  variableRateSlope1: string;
  variableRateSlope2: string;
  underlyingAsset: string;
  name: string;
  symbol: string;
  decimals: string;
}
