import { JsonRpcSigner } from '@ethersproject/providers';

import { BigNumberish, TypedDataDomain, TypedDataField, ethers } from 'ethers';

import { StatusType } from '@sovryn/ui';

export interface TransactionConfig {
  amount?: BigNumberish;
  unlimitedAmount?: boolean;
  gasLimit?: BigNumberish;
  gasPrice?: string;
}

export type TransactionStepData = {
  transaction: Transaction;
  receipt: TransactionReceipt;
  config: TransactionConfig;
};

export type Transaction = {
  title: string;
  subtitle?: string;
  request: TransactionRequest;
  onStart?: (hash: string) => void;
  onComplete?: (hash: string) => void;
  onChangeStatus?: (status: StatusType) => void;
  updateHandler?: (
    request: TransactionRequest,
    receipts: TransactionReceipt[],
  ) => TransactionRequest;
};

export enum TransactionType {
  signMessage = 'sign',
  signTypedData = 'signTypedData',
  signTransaction = 'signTransaction',
}

export type SignMessageRequest = {
  type: TransactionType.signMessage;
  signer: JsonRpcSigner;
  message: string;
};

export type SignTypedDataRequest = {
  type: TransactionType.signTypedData;
  signer: JsonRpcSigner;
  domain: TypedDataDomain;
  types: Record<string, Array<TypedDataField>>;
  value: Record<string, any>;
};

export type SignTransactionRequest = {
  type: TransactionType.signTransaction;
  contract: ethers.Contract;
  fnName: string;
  args: any[];
  value?: BigNumberish;
  gasLimit?: BigNumberish;
  gasPrice?: string;
};

export type TransactionRequest =
  | SignMessageRequest
  | SignTypedDataRequest
  | SignTransactionRequest;

export enum TransactionReceiptStatus {
  pending = 'pending',
  success = 'success',
  error = 'error',
}

export type TransactionReceipt = {
  status: TransactionReceiptStatus;
  request: TransactionRequest;
  response?: string;
};
