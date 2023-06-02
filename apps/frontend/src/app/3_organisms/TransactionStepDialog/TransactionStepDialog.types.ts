import { JsonRpcSigner } from '@ethersproject/providers';

import {
  BigNumberish,
  BytesLike,
  TypedDataDomain,
  TypedDataField,
  ethers,
} from 'ethers';

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
  onComplete?: (result: string | PermitResponse) => void;
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
  signTransactionData = 'signTransactionData',
  signPermit = 'signPermit',
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

export type SignPermitRequest = {
  type: TransactionType.signPermit;
  signer: JsonRpcSigner;
  token: string;
  owner: string;
  spender: string;
  value?: string | number;
  deadline?: number;
  nonce?: number;
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

export type SignTransactionDataRequest = {
  type: TransactionType.signTransactionData;
  signer: JsonRpcSigner;
  data: BytesLike;
  to: string;
  value?: BigNumberish;
  gasLimit?: BigNumberish;
  gasPrice?: string;
};

export type TransactionRequest =
  | SignMessageRequest
  | SignTypedDataRequest
  | SignPermitRequest
  | SignTransactionRequest
  | SignTransactionDataRequest;

export enum TransactionReceiptStatus {
  pending = 'pending',
  success = 'success',
  error = 'error',
}

export type PermitResponse = {
  owner: string;
  spender: string;
  value: number | string;
  nonce: number | string;
  deadline: number | string;
  r: string;
  s: string;
  v: number;
};

export type TransactionReceipt = {
  status: TransactionReceiptStatus;
  request: TransactionRequest;
  response?: string | PermitResponse;
};
