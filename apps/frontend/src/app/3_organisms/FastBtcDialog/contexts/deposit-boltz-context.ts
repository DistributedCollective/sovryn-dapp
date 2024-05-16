import { createContext, Dispatch, SetStateAction } from 'react';

import { BoltzFees, BoltzLimits } from '../types';

export enum DepositBoltzStep {
  MAIN,
  AMOUNT,
  REVIEW,
}

export type DepositBoltzContextStateType = {
  step: DepositBoltzStep;
  amount: string;
  loadingPairData: boolean;
  limits: BoltzLimits;
  fees: BoltzFees;
  rate: number;
  hash: string;
};

export type DepositContextFunctionsType = {
  set: Dispatch<SetStateAction<DepositBoltzContextStateType>>;
};

export type DepositContextType = DepositBoltzContextStateType &
  DepositContextFunctionsType;

export const defaultValue: DepositContextType = {
  step: DepositBoltzStep.MAIN,
  amount: '',
  fees: {
    percentage: 0,
    percentageSwapIn: 0,
    minerFees: {
      quoteAsset: {
        normal: 0,
        reverse: {
          claim: 0,
          lockup: 0,
        },
      },
      baseAsset: {
        normal: 0,
        reverse: {
          claim: 0,
          lockup: 0,
        },
      },
    },
  },
  limits: {
    minimal: 0,
    maximal: 0,
    maximalZeroConf: {
      baseAsset: 0,
      quoteAsset: 0,
    },
  },
  rate: 1,
  hash: '',
  loadingPairData: true,
  set: () => {
    throw new Error('set() has not been defined.');
  },
};

export const DepositBoltzContext =
  createContext<DepositContextType>(defaultValue);
