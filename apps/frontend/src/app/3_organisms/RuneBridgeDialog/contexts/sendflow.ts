import { createContext, Dispatch, SetStateAction } from 'react';

export enum SendFlowStep {
  MAIN,
  AMOUNT,
  ADDRESS,
  REVIEW,
  CONFIRM,
  PROCESSING,
  COMPLETED,
}

type SendFlowLimits = {
  min: number;
  max: number;
  baseFee: number;
  dynamicFee: number;
  loading: boolean;
};

export type SendFlowContextStateType = {
  step: SendFlowStep;
  amount: string;
  address: string;
  limits: SendFlowLimits;
};

export type SendFlowContextFunctionsType = {
  set: Dispatch<SetStateAction<SendFlowContextStateType>>;
};

export type SendFlowContextType = SendFlowContextStateType &
  SendFlowContextFunctionsType;

export const defaultValue: SendFlowContextType = {
  step: SendFlowStep.MAIN,
  amount: '',
  address: '',
  limits: {
    min: 0,
    max: 0,
    baseFee: 0,
    dynamicFee: 0,
    loading: true,
  },
  set: () => {},
};

export const SendFlowContext = createContext<SendFlowContextType>(defaultValue);
