import {
  SignMessageRequest,
  SignTransactionDataRequest,
  SignTransactionRequest,
  SignTypedDataRequest,
  TransactionRequest,
  TransactionType,
} from './TransactionStepDialog.types';

export const isMessageSignatureRequest = (
  request: TransactionRequest,
): request is SignMessageRequest =>
  request.type === TransactionType.signMessage;

export const isTypedDataRequest = (
  request: TransactionRequest,
): request is SignTypedDataRequest =>
  request.type === TransactionType.signTypedData;

export const isTransactionRequest = (
  request: TransactionRequest,
): request is SignTransactionRequest =>
  request.type === TransactionType.signTransaction;

export const isSignTransactionDataRequest = (
  request: TransactionRequest,
): request is SignTransactionDataRequest =>
  request.type === TransactionType.signTransactionData;
