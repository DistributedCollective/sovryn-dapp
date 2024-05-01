import { Dispatch, SetStateAction } from 'react';

export type DepositContextValue = {
  rangeWidth: number;
  setRangeWidth: Dispatch<SetStateAction<number>>;
  minimumPrice: number;
  setMinimumPrice: Dispatch<SetStateAction<number>>;
  maximumPrice: number;
  setMaximumPrice: Dispatch<SetStateAction<number>>;
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
  isBalancedRange: boolean;
  setIsBalancedRange: Dispatch<SetStateAction<boolean>>;
  spotPrice: number;
  setSpotPrice: Dispatch<SetStateAction<number>>;
  usesBaseToken: boolean;
  setUsesBaseToken: Dispatch<SetStateAction<boolean>>;
};
