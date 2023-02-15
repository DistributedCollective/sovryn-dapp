import {
  SignMessageRequest,
  SignTransactionRequest,
  SignTypedDataRequest,
  TransactionRequest,
  TxType,
} from './TransactionStepDialog.types';

export const isMessageSignatureRequest = (
  request: TransactionRequest,
): request is SignMessageRequest => request.type === TxType.signMessage;

export const isTypedDataRequest = (
  request: TransactionRequest,
): request is SignTypedDataRequest => request.type === TxType.signTypedData;

export const isTransactionRequest = (
  request: TransactionRequest,
): request is SignTransactionRequest => request.type === TxType.signTransaction;
