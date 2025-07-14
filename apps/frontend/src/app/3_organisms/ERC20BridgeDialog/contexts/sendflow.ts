import { createContext, Dispatch, SetStateAction, useContext } from 'react';

import { ChainIds } from '@sovryn/ethers-provider';
import { noop } from '@sovryn/ui';

export enum SendFlowStep {
  INITIAL,
  MAIN,
  AMOUNT,
  REVIEW,
  PROCESSING,
  COMPLETED,
}

export enum AddressValidationState {
  NONE = 'NONE',
  LOADING = 'LOADING',
  VALID = 'VALID',
  INVALID = 'INVALID',
}

export type SendFlowContextStateType = {
  step: SendFlowStep;
  amount: string;
  receiver: string;

  chain: ChainIds;
  asset: string | undefined;
};

export type SendFlowContextFunctionsType = {
  set: Dispatch<SetStateAction<SendFlowContextStateType>>;
};

export type SendFlowContextType = SendFlowContextStateType &
  SendFlowContextFunctionsType;

export const defaultValue: SendFlowContextType = {
  step: SendFlowStep.INITIAL,
  amount: '',
  receiver: '',
  chain: ChainIds.MAINNET,
  asset: undefined,
  set: noop,
};

export const SendFlowContext = createContext<SendFlowContextType>(defaultValue);

export const useSendFlowContext = () => {
  return useContext(SendFlowContext) as SendFlowContextType;
};
