import { createContext, Dispatch, SetStateAction } from 'react';

import { ReverseSwapPair } from '../utils/boltz/boltz.types';

export enum DepositBoltzStep {
  MAIN,
  AMOUNT,
  REVIEW,
}

export type DepositBoltzContextStateType = {
  step: DepositBoltzStep;
  amount: string;
  loadingPairData: boolean;
  limits: ReverseSwapPair['limits'];
  fees: ReverseSwapPair['fees'];
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
    minerFees: {
      claim: 0,
      lockup: 0,
    },
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

export const DepositBoltzContext =
  createContext<DepositContextType>(defaultValue);
