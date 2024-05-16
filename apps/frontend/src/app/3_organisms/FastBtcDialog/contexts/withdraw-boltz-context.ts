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

export type WithdrawContextStateType = {
  step: WithdrawBoltzStep;
  amount: string;
  invoice: string;
  limits: WithdrawLimits;
};

type WithdrawLimits = {
  min: number;
  max: number;
  baseFee: number;
  dynamicFee: number;
  loading: boolean;
};

export type WithdrawContextFunctionsType = {
  set: Dispatch<SetStateAction<WithdrawContextStateType>>;
};

export type WithdrawContextType = WithdrawContextStateType &
  WithdrawContextFunctionsType;

export const defaultValue: WithdrawContextType = {
  step: WithdrawBoltzStep.MAIN,
  amount: '',
  invoice: '',
  limits: {
    min: 0,
    max: 0,
    baseFee: 0,
    dynamicFee: 0,
    loading: true,
  },
  set: () => {
    throw new Error('set() has not been defined.');
  },
};

export const WithdrawBoltzContext =
  createContext<WithdrawContextType>(defaultValue);
