import { Decimal } from '@sovryn/utils';

export type MockData<T> = {
  data1: T[];
  data2: T[];
  data3: T[];
  label1: string;
  lineColor: string;
  xLabels: string[];
};

export interface RatesData {
  currentUsageRatio: Decimal;
  optimalUsageRatio: Decimal;
  baseVariableBorrowRate: Decimal;
  variableRateSlope1: Decimal;
  variableRateSlope2: Decimal;
  underlyingAsset: string;
  name: string;
  symbol: string;
  decimals: number;
}
