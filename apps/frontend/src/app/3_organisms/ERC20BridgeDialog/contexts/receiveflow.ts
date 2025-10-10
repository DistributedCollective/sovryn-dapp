import { createContext, Dispatch, SetStateAction, useContext } from 'react';

import { ChainIds } from '@sovryn/ethers-provider';
import { AssetConfig } from '@sovryn/sdk';
import { noop } from '@sovryn/ui';

export enum ReceiveFlowStep {
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

export type ReceiveFlowContextStateType = {
  step: ReceiveFlowStep;
  amount: string;
  receiver: string;
  chain: ChainIds;
  asset: AssetConfig | undefined;
  chainId: ChainIds | undefined;
  token: string | undefined;
};

export type ReceiveFlowContextFunctionsType = {
  set: Dispatch<SetStateAction<ReceiveFlowContextStateType>>;
};

export type ReceiveFlowContextType = ReceiveFlowContextStateType &
  ReceiveFlowContextFunctionsType;

export const defaultValue: ReceiveFlowContextType = {
  step: ReceiveFlowStep.INITIAL,
  amount: '',
  receiver: '',
  chain: ChainIds.MAINNET,
  asset: undefined,
  set: noop,

  chainId: undefined,
  token: undefined,
};

export const ReceiveFlowContext =
  createContext<ReceiveFlowContextType>(defaultValue);

export const useReceiveFlowContext = () => {
  return useContext(ReceiveFlowContext) as ReceiveFlowContextType;
};
