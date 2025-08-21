import { createContext, Dispatch, SetStateAction, useContext } from 'react';

export enum ReceiveflowStep {
  MAIN,
  ADDRESS,
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
  txCheckingAttempts: number;
  depositTx: TxData;
  limits: ReceiveFlowLimits;
  signatures: Signature[];
  errorMessage: string | null;
};

export type TxData = {
  lastBlockHash: string;
  statuses: TxStatus[];
  currentTX: TxStatus;
};

export type Signature = {
  signer: string;
  signature: number;
};

export type TxStatus = {
  btcDepositTxid: string;
  btcDepositVout: string; // amount this should be a BigNumber
  runeName: string;
  runeSymbol: string;
  amountDecimal: string;
  feeDecimal: string;
  receiveAmountDecimal: string;
  status: TransferStatusType;
  evmTransferTxHash: string;
};

export type TransferStatusType =
  | 'detected'
  | 'seen'
  | 'sent_to_evm'
  | 'confirmed'
  | string;

export type ReceiveFlowContextFunctionsType = {
  set: Dispatch<SetStateAction<ReceiveFlowContextStateType>>;
  requestLastScannedBlock: () => Promise<any>;
  getRuneDepositStatus: (
    userEvmAddress: string,
    lastScannedBlockHash: string,
  ) => Promise<any>;
};

export type ReceiveFlowContextType = ReceiveFlowContextStateType &
  ReceiveFlowContextFunctionsType;

export const defaultValue: ReceiveFlowContextType = {
  step: ReceiveflowStep.MAIN,
  ready: false,
  address: '',
  addressLoading: false,
  addressError: null,
  txCheckingAttempts: 0,
  depositTx: {
    lastBlockHash: '',
    statuses: [],
    currentTX: {
      btcDepositTxid: '',
      btcDepositVout: '',
      runeName: '',
      runeSymbol: '',
      amountDecimal: '',
      feeDecimal: '',
      receiveAmountDecimal: '',
      status: '',
      evmTransferTxHash: '',
    },
  },
  limits: {
    min: 0,
    max: 0,
    baseFee: 0,
    dynamicFee: 0,
    loading: true,
  },
  signatures: [],
  errorMessage: null,
  set: () => {
    throw new Error('set() has not been defined.');
  },
  requestLastScannedBlock: async () => {
    throw new Error('requestLastScannedBlock() has not been defined.');
  },
  getRuneDepositStatus: async () => {
    throw new Error('getRuneDepositStatus() has not been defined.');
  },
};

export const ReceiveFlowContext =
  createContext<ReceiveFlowContextType>(defaultValue);

export const useReceiveFlowContext = () => {
  return useContext(ReceiveFlowContext) as ReceiveFlowContextType;
};
