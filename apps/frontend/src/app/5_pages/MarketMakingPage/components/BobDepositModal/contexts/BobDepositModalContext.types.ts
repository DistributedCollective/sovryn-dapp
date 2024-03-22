import { Dispatch, SetStateAction } from 'react';

export type DepositContextValue = {
  rangeWidth: number;
  setRangeWidth: Dispatch<SetStateAction<number>>;
  lowerBoundaryPrice: number;
  setLowerBoundaryPrice: Dispatch<SetStateAction<number>>;
  upperBoundaryPrice: number;
  setUpperBoundaryPrice: Dispatch<SetStateAction<number>>;
  lowerBoundaryPercentage: number;
  setLowerBoundaryPercentage: Dispatch<SetStateAction<number>>;
  upperBoundaryPercentage: number;
  setUpperBoundaryPercentage: Dispatch<SetStateAction<number>>;
  maximumSlippage: number;
  setMaximumSlippage: Dispatch<SetStateAction<number>>;
  firstAssetValue: string;
  setFirstAssetValue: Dispatch<SetStateAction<string>>;
  secondAssetValue: string;
  setSecondAssetValue: Dispatch<SetStateAction<string>>;
};
