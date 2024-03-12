import { createContext, Dispatch, SetStateAction } from 'react';

import { SubmarineSwapPair } from '../utils/boltz/boltz.types';

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
  limits: SubmarineSwapPair['limits'];
  fees: SubmarineSwapPair['fees'];
  rate: number;
  hash: string;
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
    minerFees: 0,
  },
  limits: {
    minimal: 0,
    maximal: 0,
    maximalZeroConf: 0,
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
