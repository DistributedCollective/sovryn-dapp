import { createContext, Dispatch, SetStateAction } from 'react';

export enum ReceiveflowStep {
  MAIN,
  VALIDATION,
  AMOUNT,
  ADDRESS,
  REVIEW,
  CONFIRM,
  PROCESSING,
  COMPLETED,
}

type ReceiveFlowLimits = {
  min: number;
  max: number;
  baseFee: number;
  dynamicFee: number;
  loading: boolean;
};

export type ReceiveFlowContextStateType = {
  step: ReceiveflowStep;
  ready: boolean;
  address: string;
  addressLoading: boolean;
  addressError: string | null;
  depositTx: TxData | null;
  transferTx: TxData | null;
  depositRskTransactionHash: string | null;
  limits: ReceiveFlowLimits;
  signatures: Signature[];
};

export type TxData = {
  txHash: string;
  value: number;
  status: TxStatus;
};

export type Signature = {
  signer: string;
  signature: number;
};

type TxStatus = 'pending' | 'confirmed' | string;

export type ReceiveFlowContextFunctionsType = {
  set: Dispatch<SetStateAction<ReceiveFlowContextStateType>>;
};

export type ReceiveFlowContextType = ReceiveFlowContextStateType &
  ReceiveFlowContextFunctionsType;

export const defaultValue: ReceiveFlowContextType = {
  step: ReceiveflowStep.MAIN,
  ready: false,
  address: '',
  addressLoading: false,
  addressError: null,
  depositTx: null,
  transferTx: null,
  depositRskTransactionHash: null,
  limits: {
    min: 0,
    max: 0,
    baseFee: 0,
    dynamicFee: 0,
    loading: true,
  },
  signatures: [],
  set: () => {
    throw new Error('set() has not been defined.');
  },
};

export const ReceiveFlowContext =
  createContext<ReceiveFlowContextType>(defaultValue);
