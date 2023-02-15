import { JsonRpcSigner } from '@ethersproject/providers';

import { BigNumberish, TypedDataDomain, TypedDataField, ethers } from 'ethers';

import { StatusType } from '@sovryn/ui';

export interface TxConfig {
  amount?: BigNumberish;
  unlimitedAmount?: boolean;
  gasLimit?: BigNumberish;
  gasPrice?: string;
  value?: BigNumberish;
  // @deprecated use receipt.response instead
  hash?: string;
}

export type TxConf = {
  transaction: Transaction;
  receipt: TransactionReceipt;
  config: TxConfig;
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

export enum TxType {
  signMessage = 'sign',
  signTypedData = 'signTypedData',
  signTransaction = 'signTransaction',
}

export type SignMessageRequest = {
  type: TxType.signMessage;
  signer: JsonRpcSigner;
  message: string;
};

export type SignTypedDataRequest = {
  type: TxType.signTypedData;
  signer: JsonRpcSigner;
  domain: TypedDataDomain;
  types: Record<string, Array<TypedDataField>>;
  value: Record<string, any>;
};

export type SignTransactionRequest = {
  type: TxType.signTransaction;
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

export type TransactionReceipt =
  | {
      status: TransactionReceiptStatus.success;
      request: TransactionRequest;
      response: string;
    }
  | {
      status: TransactionReceiptStatus.pending | TransactionReceiptStatus.error;
      request: TransactionRequest;
    };
