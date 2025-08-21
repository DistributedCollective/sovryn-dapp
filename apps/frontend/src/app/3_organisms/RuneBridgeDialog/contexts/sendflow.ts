import { createContext, Dispatch, SetStateAction, useContext } from 'react';

import { BigNumber } from 'ethers';

import { noop } from '@sovryn/ui';

import { TokenBalance } from './rune';

export enum SendFlowStep {
  MAIN,
  AMOUNT,
  ADDRESS,
  REVIEW,
  CONFIRM,
  PROCESSING,
  COMPLETED,
}

export enum AddressValidationState {
  NONE = 'NONE',
  LOADING = 'LOADING',
  VALID = 'VALID',
  INVALID = 'INVALID',
}

type SendFlowLimits = {
  min: number;
  max: number;
  flatFeeBaseCurrency: number;
  flatFeeBaseCurrencyWei: BigNumber;
  flatFeeTokens: number;
  dynamicFeeTokens: number;
  loading: boolean;
};

export type SendFlowContextStateType = {
  step: SendFlowStep;
  amount: string;
  address: string;
  limits: SendFlowLimits;
  selectedToken: TokenBalance;
  addressValidationState: AddressValidationState;
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
    flatFeeBaseCurrency: 0,
    flatFeeBaseCurrencyWei: BigNumber.from(0),
    dynamicFeeTokens: 0,
    flatFeeTokens: 0,
    loading: true,
  },
  selectedToken: {
    symbol: '',
    balance: '0',
    decimals: 18,
    name: '',
    tokenContractAddress: '',
  },
  addressValidationState: AddressValidationState.NONE,
  set: noop,
};

export const SendFlowContext = createContext<SendFlowContextType>(defaultValue);

export const useSendFlowContext = () => {
  return useContext(SendFlowContext) as SendFlowContextType;
};
