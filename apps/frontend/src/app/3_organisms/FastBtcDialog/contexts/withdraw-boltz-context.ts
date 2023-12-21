import { createContext, Dispatch, SetStateAction } from 'react';

export enum WithdrawBoltzStep {
  MAIN,
  AMOUNT,
  INVOICE,
  REVIEW,
  CONFIRM,
  PROCESSING,
  COMPLETED,
}

export type WithdrawBoltzContextStateType = {
  step: WithdrawBoltzStep;
  amount: string;
  invoice: string;
  loadingPairData: boolean;
  limits: BoltzLimits;
  fees: BoltzFees;
  rate: number;
  hash: string;
};

type BoltzFees = {
  percentage: number;
  percentageSwapIn: number;
  minerFees: {
    baseAsset: BoltzMinerFees;
    quoteAsset: BoltzMinerFees;
  };
};

type BoltzMinerFees = {
  normal: number;
  reverse: {
    claim: number;
    lockup: number;
  };
};

type BoltzLimits = {
  minimal: number;
  maximal: number;
  maximalZeroConf: {
    baseAsset: number;
    quoteAsset: number;
  };
};

export type WithdrawContextFunctionsType = {
  set: Dispatch<SetStateAction<WithdrawBoltzContextStateType>>;
};

export type WithdrawContextType = WithdrawBoltzContextStateType &
  WithdrawContextFunctionsType;

export const defaultValue: WithdrawContextType = {
  step: WithdrawBoltzStep.MAIN,
  amount: '',
  invoice: '',
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

export const WithdrawBoltzContext =
  createContext<WithdrawContextType>(defaultValue);
