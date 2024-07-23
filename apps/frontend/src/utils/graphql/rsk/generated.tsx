import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';

export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  BigDecimal: string;
  BigInt: string;
  Bytes: string;
};

export type BitcoinTransfer = {
  __typename?: 'BitcoinTransfer';
  amountBTC: Scalars['BigDecimal'];
  bitcoinTxHash?: Maybe<Scalars['String']>;
  btcAddress?: Maybe<Scalars['String']>;
  createdAtBlockNumber: Scalars['Int'];
  createdAtTimestamp: Scalars['Int'];
  createdAtTx: Transaction;
  direction: BitcoinTransferDirection;
  feeBTC: Scalars['BigDecimal'];
  id: Scalars['ID'];
  nonce?: Maybe<Scalars['Int']>;
  status: BitcoinTransferStatus;
  totalAmountBTC: Scalars['BigDecimal'];
  updatedAtBlockNumber: Scalars['Int'];
  updatedAtTimestamp: Scalars['Int'];
  updatedAtTx: Transaction;
  user: User;
};

export type BitcoinTransferBatchSending = {
  __typename?: 'BitcoinTransferBatchSending';
  bitcoinTxHash: Scalars['Bytes'];
  emittedBy: Scalars['Bytes'];
  id: Scalars['ID'];
  timestamp: Scalars['Int'];
  transaction: Transaction;
  transferBatchSize: Scalars['Int'];
};

export type BitcoinTransferBatchSending_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  bitcoinTxHash?: InputMaybe<Scalars['Bytes']>;
  bitcoinTxHash_contains?: InputMaybe<Scalars['Bytes']>;
  bitcoinTxHash_in?: InputMaybe<Array<Scalars['Bytes']>>;
  bitcoinTxHash_not?: InputMaybe<Scalars['Bytes']>;
  bitcoinTxHash_not_contains?: InputMaybe<Scalars['Bytes']>;
  bitcoinTxHash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  emittedBy?: InputMaybe<Scalars['Bytes']>;
  emittedBy_contains?: InputMaybe<Scalars['Bytes']>;
  emittedBy_in?: InputMaybe<Array<Scalars['Bytes']>>;
  emittedBy_not?: InputMaybe<Scalars['Bytes']>;
  emittedBy_not_contains?: InputMaybe<Scalars['Bytes']>;
  emittedBy_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  timestamp?: InputMaybe<Scalars['Int']>;
  timestamp_gt?: InputMaybe<Scalars['Int']>;
  timestamp_gte?: InputMaybe<Scalars['Int']>;
  timestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp_lt?: InputMaybe<Scalars['Int']>;
  timestamp_lte?: InputMaybe<Scalars['Int']>;
  timestamp_not?: InputMaybe<Scalars['Int']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
  transaction?: InputMaybe<Scalars['String']>;
  transaction_?: InputMaybe<Transaction_Filter>;
  transaction_contains?: InputMaybe<Scalars['String']>;
  transaction_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_gt?: InputMaybe<Scalars['String']>;
  transaction_gte?: InputMaybe<Scalars['String']>;
  transaction_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_lt?: InputMaybe<Scalars['String']>;
  transaction_lte?: InputMaybe<Scalars['String']>;
  transaction_not?: InputMaybe<Scalars['String']>;
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_not_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
  transaction_starts_with_nocase?: InputMaybe<Scalars['String']>;
  transferBatchSize?: InputMaybe<Scalars['Int']>;
  transferBatchSize_gt?: InputMaybe<Scalars['Int']>;
  transferBatchSize_gte?: InputMaybe<Scalars['Int']>;
  transferBatchSize_in?: InputMaybe<Array<Scalars['Int']>>;
  transferBatchSize_lt?: InputMaybe<Scalars['Int']>;
  transferBatchSize_lte?: InputMaybe<Scalars['Int']>;
  transferBatchSize_not?: InputMaybe<Scalars['Int']>;
  transferBatchSize_not_in?: InputMaybe<Array<Scalars['Int']>>;
};

export enum BitcoinTransferBatchSending_OrderBy {
  BitcoinTxHash = 'bitcoinTxHash',
  EmittedBy = 'emittedBy',
  Id = 'id',
  Timestamp = 'timestamp',
  Transaction = 'transaction',
  TransferBatchSize = 'transferBatchSize',
}

export enum BitcoinTransferDirection {
  Incoming = 'INCOMING',
  Outgoing = 'OUTGOING',
}

export enum BitcoinTransferStatus {
  /**
   * the transfer was confirmedly mined in Bitcoin blockchain
   *
   */
  Mined = 'MINED',
  /**
   * the transfer was initiated
   *
   */
  New = 'NEW',
  /**
   * the transfer slot has not been initialized
   *
   */
  NotApplicable = 'NOT_APPLICABLE',
  /**
   * the transfer was reclaimed by the user
   *
   */
  Reclaimed = 'RECLAIMED',
  /**
   * the transfer was refunded
   *
   */
  Refunded = 'REFUNDED',
  /**
   * the federators have approved this transfer as part of a transfer batch
   *
   */
  Sending = 'SENDING',
}

export type BitcoinTransfer_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amountBTC?: InputMaybe<Scalars['BigDecimal']>;
  amountBTC_gt?: InputMaybe<Scalars['BigDecimal']>;
  amountBTC_gte?: InputMaybe<Scalars['BigDecimal']>;
  amountBTC_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  amountBTC_lt?: InputMaybe<Scalars['BigDecimal']>;
  amountBTC_lte?: InputMaybe<Scalars['BigDecimal']>;
  amountBTC_not?: InputMaybe<Scalars['BigDecimal']>;
  amountBTC_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  bitcoinTxHash?: InputMaybe<Scalars['String']>;
  bitcoinTxHash_contains?: InputMaybe<Scalars['String']>;
  bitcoinTxHash_contains_nocase?: InputMaybe<Scalars['String']>;
  bitcoinTxHash_ends_with?: InputMaybe<Scalars['String']>;
  bitcoinTxHash_ends_with_nocase?: InputMaybe<Scalars['String']>;
  bitcoinTxHash_gt?: InputMaybe<Scalars['String']>;
  bitcoinTxHash_gte?: InputMaybe<Scalars['String']>;
  bitcoinTxHash_in?: InputMaybe<Array<Scalars['String']>>;
  bitcoinTxHash_lt?: InputMaybe<Scalars['String']>;
  bitcoinTxHash_lte?: InputMaybe<Scalars['String']>;
  bitcoinTxHash_not?: InputMaybe<Scalars['String']>;
  bitcoinTxHash_not_contains?: InputMaybe<Scalars['String']>;
  bitcoinTxHash_not_contains_nocase?: InputMaybe<Scalars['String']>;
  bitcoinTxHash_not_ends_with?: InputMaybe<Scalars['String']>;
  bitcoinTxHash_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  bitcoinTxHash_not_in?: InputMaybe<Array<Scalars['String']>>;
  bitcoinTxHash_not_starts_with?: InputMaybe<Scalars['String']>;
  bitcoinTxHash_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  bitcoinTxHash_starts_with?: InputMaybe<Scalars['String']>;
  bitcoinTxHash_starts_with_nocase?: InputMaybe<Scalars['String']>;
  btcAddress?: InputMaybe<Scalars['String']>;
  btcAddress_contains?: InputMaybe<Scalars['String']>;
  btcAddress_contains_nocase?: InputMaybe<Scalars['String']>;
  btcAddress_ends_with?: InputMaybe<Scalars['String']>;
  btcAddress_ends_with_nocase?: InputMaybe<Scalars['String']>;
  btcAddress_gt?: InputMaybe<Scalars['String']>;
  btcAddress_gte?: InputMaybe<Scalars['String']>;
  btcAddress_in?: InputMaybe<Array<Scalars['String']>>;
  btcAddress_lt?: InputMaybe<Scalars['String']>;
  btcAddress_lte?: InputMaybe<Scalars['String']>;
  btcAddress_not?: InputMaybe<Scalars['String']>;
  btcAddress_not_contains?: InputMaybe<Scalars['String']>;
  btcAddress_not_contains_nocase?: InputMaybe<Scalars['String']>;
  btcAddress_not_ends_with?: InputMaybe<Scalars['String']>;
  btcAddress_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  btcAddress_not_in?: InputMaybe<Array<Scalars['String']>>;
  btcAddress_not_starts_with?: InputMaybe<Scalars['String']>;
  btcAddress_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  btcAddress_starts_with?: InputMaybe<Scalars['String']>;
  btcAddress_starts_with_nocase?: InputMaybe<Scalars['String']>;
  createdAtBlockNumber?: InputMaybe<Scalars['Int']>;
  createdAtBlockNumber_gt?: InputMaybe<Scalars['Int']>;
  createdAtBlockNumber_gte?: InputMaybe<Scalars['Int']>;
  createdAtBlockNumber_in?: InputMaybe<Array<Scalars['Int']>>;
  createdAtBlockNumber_lt?: InputMaybe<Scalars['Int']>;
  createdAtBlockNumber_lte?: InputMaybe<Scalars['Int']>;
  createdAtBlockNumber_not?: InputMaybe<Scalars['Int']>;
  createdAtBlockNumber_not_in?: InputMaybe<Array<Scalars['Int']>>;
  createdAtTimestamp?: InputMaybe<Scalars['Int']>;
  createdAtTimestamp_gt?: InputMaybe<Scalars['Int']>;
  createdAtTimestamp_gte?: InputMaybe<Scalars['Int']>;
  createdAtTimestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  createdAtTimestamp_lt?: InputMaybe<Scalars['Int']>;
  createdAtTimestamp_lte?: InputMaybe<Scalars['Int']>;
  createdAtTimestamp_not?: InputMaybe<Scalars['Int']>;
  createdAtTimestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
  createdAtTx?: InputMaybe<Scalars['String']>;
  createdAtTx_?: InputMaybe<Transaction_Filter>;
  createdAtTx_contains?: InputMaybe<Scalars['String']>;
  createdAtTx_contains_nocase?: InputMaybe<Scalars['String']>;
  createdAtTx_ends_with?: InputMaybe<Scalars['String']>;
  createdAtTx_ends_with_nocase?: InputMaybe<Scalars['String']>;
  createdAtTx_gt?: InputMaybe<Scalars['String']>;
  createdAtTx_gte?: InputMaybe<Scalars['String']>;
  createdAtTx_in?: InputMaybe<Array<Scalars['String']>>;
  createdAtTx_lt?: InputMaybe<Scalars['String']>;
  createdAtTx_lte?: InputMaybe<Scalars['String']>;
  createdAtTx_not?: InputMaybe<Scalars['String']>;
  createdAtTx_not_contains?: InputMaybe<Scalars['String']>;
  createdAtTx_not_contains_nocase?: InputMaybe<Scalars['String']>;
  createdAtTx_not_ends_with?: InputMaybe<Scalars['String']>;
  createdAtTx_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  createdAtTx_not_in?: InputMaybe<Array<Scalars['String']>>;
  createdAtTx_not_starts_with?: InputMaybe<Scalars['String']>;
  createdAtTx_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  createdAtTx_starts_with?: InputMaybe<Scalars['String']>;
  createdAtTx_starts_with_nocase?: InputMaybe<Scalars['String']>;
  direction?: InputMaybe<BitcoinTransferDirection>;
  direction_in?: InputMaybe<Array<BitcoinTransferDirection>>;
  direction_not?: InputMaybe<BitcoinTransferDirection>;
  direction_not_in?: InputMaybe<Array<BitcoinTransferDirection>>;
  feeBTC?: InputMaybe<Scalars['BigDecimal']>;
  feeBTC_gt?: InputMaybe<Scalars['BigDecimal']>;
  feeBTC_gte?: InputMaybe<Scalars['BigDecimal']>;
  feeBTC_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  feeBTC_lt?: InputMaybe<Scalars['BigDecimal']>;
  feeBTC_lte?: InputMaybe<Scalars['BigDecimal']>;
  feeBTC_not?: InputMaybe<Scalars['BigDecimal']>;
  feeBTC_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  nonce?: InputMaybe<Scalars['Int']>;
  nonce_gt?: InputMaybe<Scalars['Int']>;
  nonce_gte?: InputMaybe<Scalars['Int']>;
  nonce_in?: InputMaybe<Array<Scalars['Int']>>;
  nonce_lt?: InputMaybe<Scalars['Int']>;
  nonce_lte?: InputMaybe<Scalars['Int']>;
  nonce_not?: InputMaybe<Scalars['Int']>;
  nonce_not_in?: InputMaybe<Array<Scalars['Int']>>;
  status?: InputMaybe<BitcoinTransferStatus>;
  status_in?: InputMaybe<Array<BitcoinTransferStatus>>;
  status_not?: InputMaybe<BitcoinTransferStatus>;
  status_not_in?: InputMaybe<Array<BitcoinTransferStatus>>;
  totalAmountBTC?: InputMaybe<Scalars['BigDecimal']>;
  totalAmountBTC_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalAmountBTC_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalAmountBTC_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalAmountBTC_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalAmountBTC_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalAmountBTC_not?: InputMaybe<Scalars['BigDecimal']>;
  totalAmountBTC_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  updatedAtBlockNumber?: InputMaybe<Scalars['Int']>;
  updatedAtBlockNumber_gt?: InputMaybe<Scalars['Int']>;
  updatedAtBlockNumber_gte?: InputMaybe<Scalars['Int']>;
  updatedAtBlockNumber_in?: InputMaybe<Array<Scalars['Int']>>;
  updatedAtBlockNumber_lt?: InputMaybe<Scalars['Int']>;
  updatedAtBlockNumber_lte?: InputMaybe<Scalars['Int']>;
  updatedAtBlockNumber_not?: InputMaybe<Scalars['Int']>;
  updatedAtBlockNumber_not_in?: InputMaybe<Array<Scalars['Int']>>;
  updatedAtTimestamp?: InputMaybe<Scalars['Int']>;
  updatedAtTimestamp_gt?: InputMaybe<Scalars['Int']>;
  updatedAtTimestamp_gte?: InputMaybe<Scalars['Int']>;
  updatedAtTimestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  updatedAtTimestamp_lt?: InputMaybe<Scalars['Int']>;
  updatedAtTimestamp_lte?: InputMaybe<Scalars['Int']>;
  updatedAtTimestamp_not?: InputMaybe<Scalars['Int']>;
  updatedAtTimestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
  updatedAtTx?: InputMaybe<Scalars['String']>;
  updatedAtTx_?: InputMaybe<Transaction_Filter>;
  updatedAtTx_contains?: InputMaybe<Scalars['String']>;
  updatedAtTx_contains_nocase?: InputMaybe<Scalars['String']>;
  updatedAtTx_ends_with?: InputMaybe<Scalars['String']>;
  updatedAtTx_ends_with_nocase?: InputMaybe<Scalars['String']>;
  updatedAtTx_gt?: InputMaybe<Scalars['String']>;
  updatedAtTx_gte?: InputMaybe<Scalars['String']>;
  updatedAtTx_in?: InputMaybe<Array<Scalars['String']>>;
  updatedAtTx_lt?: InputMaybe<Scalars['String']>;
  updatedAtTx_lte?: InputMaybe<Scalars['String']>;
  updatedAtTx_not?: InputMaybe<Scalars['String']>;
  updatedAtTx_not_contains?: InputMaybe<Scalars['String']>;
  updatedAtTx_not_contains_nocase?: InputMaybe<Scalars['String']>;
  updatedAtTx_not_ends_with?: InputMaybe<Scalars['String']>;
  updatedAtTx_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  updatedAtTx_not_in?: InputMaybe<Array<Scalars['String']>>;
  updatedAtTx_not_starts_with?: InputMaybe<Scalars['String']>;
  updatedAtTx_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  updatedAtTx_starts_with?: InputMaybe<Scalars['String']>;
  updatedAtTx_starts_with_nocase?: InputMaybe<Scalars['String']>;
  user?: InputMaybe<Scalars['String']>;
  user_?: InputMaybe<User_Filter>;
  user_contains?: InputMaybe<Scalars['String']>;
  user_contains_nocase?: InputMaybe<Scalars['String']>;
  user_ends_with?: InputMaybe<Scalars['String']>;
  user_ends_with_nocase?: InputMaybe<Scalars['String']>;
  user_gt?: InputMaybe<Scalars['String']>;
  user_gte?: InputMaybe<Scalars['String']>;
  user_in?: InputMaybe<Array<Scalars['String']>>;
  user_lt?: InputMaybe<Scalars['String']>;
  user_lte?: InputMaybe<Scalars['String']>;
  user_not?: InputMaybe<Scalars['String']>;
  user_not_contains?: InputMaybe<Scalars['String']>;
  user_not_contains_nocase?: InputMaybe<Scalars['String']>;
  user_not_ends_with?: InputMaybe<Scalars['String']>;
  user_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  user_not_in?: InputMaybe<Array<Scalars['String']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']>;
  user_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  user_starts_with?: InputMaybe<Scalars['String']>;
  user_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum BitcoinTransfer_OrderBy {
  AmountBtc = 'amountBTC',
  BitcoinTxHash = 'bitcoinTxHash',
  BtcAddress = 'btcAddress',
  CreatedAtBlockNumber = 'createdAtBlockNumber',
  CreatedAtTimestamp = 'createdAtTimestamp',
  CreatedAtTx = 'createdAtTx',
  Direction = 'direction',
  FeeBtc = 'feeBTC',
  Id = 'id',
  Nonce = 'nonce',
  Status = 'status',
  TotalAmountBtc = 'totalAmountBTC',
  UpdatedAtBlockNumber = 'updatedAtBlockNumber',
  UpdatedAtTimestamp = 'updatedAtTimestamp',
  UpdatedAtTx = 'updatedAtTx',
  User = 'user',
}

export type BlockChangedFilter = {
  number_gte: Scalars['Int'];
};

export type Block_Height = {
  hash?: InputMaybe<Scalars['Bytes']>;
  number?: InputMaybe<Scalars['Int']>;
  number_gte?: InputMaybe<Scalars['Int']>;
};

/**
 * Granular event data for the Loan entity. Emitted when a user Borrows (takes out a loan)
 *
 */
export type Borrow = {
  __typename?: 'Borrow';
  collateralToLoanRate: Scalars['BigDecimal'];
  collateralToken: Scalars['Bytes'];
  currentMargin: Scalars['BigDecimal'];
  emittedBy: Scalars['Bytes'];
  id: Scalars['ID'];
  interestDuration: Scalars['BigDecimal'];
  interestRate: Scalars['BigDecimal'];
  lender: Scalars['Bytes'];
  loanId: Loan;
  loanToken: Scalars['Bytes'];
  newCollateral: Scalars['BigDecimal'];
  newPrincipal: Scalars['BigDecimal'];
  timestamp: Scalars['Int'];
  transaction: Transaction;
  user: User;
};

export type Borrow_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  collateralToLoanRate?: InputMaybe<Scalars['BigDecimal']>;
  collateralToLoanRate_gt?: InputMaybe<Scalars['BigDecimal']>;
  collateralToLoanRate_gte?: InputMaybe<Scalars['BigDecimal']>;
  collateralToLoanRate_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  collateralToLoanRate_lt?: InputMaybe<Scalars['BigDecimal']>;
  collateralToLoanRate_lte?: InputMaybe<Scalars['BigDecimal']>;
  collateralToLoanRate_not?: InputMaybe<Scalars['BigDecimal']>;
  collateralToLoanRate_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  collateralToken?: InputMaybe<Scalars['Bytes']>;
  collateralToken_contains?: InputMaybe<Scalars['Bytes']>;
  collateralToken_in?: InputMaybe<Array<Scalars['Bytes']>>;
  collateralToken_not?: InputMaybe<Scalars['Bytes']>;
  collateralToken_not_contains?: InputMaybe<Scalars['Bytes']>;
  collateralToken_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  currentMargin?: InputMaybe<Scalars['BigDecimal']>;
  currentMargin_gt?: InputMaybe<Scalars['BigDecimal']>;
  currentMargin_gte?: InputMaybe<Scalars['BigDecimal']>;
  currentMargin_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  currentMargin_lt?: InputMaybe<Scalars['BigDecimal']>;
  currentMargin_lte?: InputMaybe<Scalars['BigDecimal']>;
  currentMargin_not?: InputMaybe<Scalars['BigDecimal']>;
  currentMargin_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  emittedBy?: InputMaybe<Scalars['Bytes']>;
  emittedBy_contains?: InputMaybe<Scalars['Bytes']>;
  emittedBy_in?: InputMaybe<Array<Scalars['Bytes']>>;
  emittedBy_not?: InputMaybe<Scalars['Bytes']>;
  emittedBy_not_contains?: InputMaybe<Scalars['Bytes']>;
  emittedBy_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  interestDuration?: InputMaybe<Scalars['BigDecimal']>;
  interestDuration_gt?: InputMaybe<Scalars['BigDecimal']>;
  interestDuration_gte?: InputMaybe<Scalars['BigDecimal']>;
  interestDuration_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  interestDuration_lt?: InputMaybe<Scalars['BigDecimal']>;
  interestDuration_lte?: InputMaybe<Scalars['BigDecimal']>;
  interestDuration_not?: InputMaybe<Scalars['BigDecimal']>;
  interestDuration_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  interestRate?: InputMaybe<Scalars['BigDecimal']>;
  interestRate_gt?: InputMaybe<Scalars['BigDecimal']>;
  interestRate_gte?: InputMaybe<Scalars['BigDecimal']>;
  interestRate_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  interestRate_lt?: InputMaybe<Scalars['BigDecimal']>;
  interestRate_lte?: InputMaybe<Scalars['BigDecimal']>;
  interestRate_not?: InputMaybe<Scalars['BigDecimal']>;
  interestRate_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  lender?: InputMaybe<Scalars['Bytes']>;
  lender_contains?: InputMaybe<Scalars['Bytes']>;
  lender_in?: InputMaybe<Array<Scalars['Bytes']>>;
  lender_not?: InputMaybe<Scalars['Bytes']>;
  lender_not_contains?: InputMaybe<Scalars['Bytes']>;
  lender_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  loanId?: InputMaybe<Scalars['String']>;
  loanId_?: InputMaybe<Loan_Filter>;
  loanId_contains?: InputMaybe<Scalars['String']>;
  loanId_contains_nocase?: InputMaybe<Scalars['String']>;
  loanId_ends_with?: InputMaybe<Scalars['String']>;
  loanId_ends_with_nocase?: InputMaybe<Scalars['String']>;
  loanId_gt?: InputMaybe<Scalars['String']>;
  loanId_gte?: InputMaybe<Scalars['String']>;
  loanId_in?: InputMaybe<Array<Scalars['String']>>;
  loanId_lt?: InputMaybe<Scalars['String']>;
  loanId_lte?: InputMaybe<Scalars['String']>;
  loanId_not?: InputMaybe<Scalars['String']>;
  loanId_not_contains?: InputMaybe<Scalars['String']>;
  loanId_not_contains_nocase?: InputMaybe<Scalars['String']>;
  loanId_not_ends_with?: InputMaybe<Scalars['String']>;
  loanId_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  loanId_not_in?: InputMaybe<Array<Scalars['String']>>;
  loanId_not_starts_with?: InputMaybe<Scalars['String']>;
  loanId_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  loanId_starts_with?: InputMaybe<Scalars['String']>;
  loanId_starts_with_nocase?: InputMaybe<Scalars['String']>;
  loanToken?: InputMaybe<Scalars['Bytes']>;
  loanToken_contains?: InputMaybe<Scalars['Bytes']>;
  loanToken_in?: InputMaybe<Array<Scalars['Bytes']>>;
  loanToken_not?: InputMaybe<Scalars['Bytes']>;
  loanToken_not_contains?: InputMaybe<Scalars['Bytes']>;
  loanToken_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  newCollateral?: InputMaybe<Scalars['BigDecimal']>;
  newCollateral_gt?: InputMaybe<Scalars['BigDecimal']>;
  newCollateral_gte?: InputMaybe<Scalars['BigDecimal']>;
  newCollateral_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  newCollateral_lt?: InputMaybe<Scalars['BigDecimal']>;
  newCollateral_lte?: InputMaybe<Scalars['BigDecimal']>;
  newCollateral_not?: InputMaybe<Scalars['BigDecimal']>;
  newCollateral_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  newPrincipal?: InputMaybe<Scalars['BigDecimal']>;
  newPrincipal_gt?: InputMaybe<Scalars['BigDecimal']>;
  newPrincipal_gte?: InputMaybe<Scalars['BigDecimal']>;
  newPrincipal_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  newPrincipal_lt?: InputMaybe<Scalars['BigDecimal']>;
  newPrincipal_lte?: InputMaybe<Scalars['BigDecimal']>;
  newPrincipal_not?: InputMaybe<Scalars['BigDecimal']>;
  newPrincipal_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  timestamp?: InputMaybe<Scalars['Int']>;
  timestamp_gt?: InputMaybe<Scalars['Int']>;
  timestamp_gte?: InputMaybe<Scalars['Int']>;
  timestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp_lt?: InputMaybe<Scalars['Int']>;
  timestamp_lte?: InputMaybe<Scalars['Int']>;
  timestamp_not?: InputMaybe<Scalars['Int']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
  transaction?: InputMaybe<Scalars['String']>;
  transaction_?: InputMaybe<Transaction_Filter>;
  transaction_contains?: InputMaybe<Scalars['String']>;
  transaction_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_gt?: InputMaybe<Scalars['String']>;
  transaction_gte?: InputMaybe<Scalars['String']>;
  transaction_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_lt?: InputMaybe<Scalars['String']>;
  transaction_lte?: InputMaybe<Scalars['String']>;
  transaction_not?: InputMaybe<Scalars['String']>;
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_not_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
  transaction_starts_with_nocase?: InputMaybe<Scalars['String']>;
  user?: InputMaybe<Scalars['String']>;
  user_?: InputMaybe<User_Filter>;
  user_contains?: InputMaybe<Scalars['String']>;
  user_contains_nocase?: InputMaybe<Scalars['String']>;
  user_ends_with?: InputMaybe<Scalars['String']>;
  user_ends_with_nocase?: InputMaybe<Scalars['String']>;
  user_gt?: InputMaybe<Scalars['String']>;
  user_gte?: InputMaybe<Scalars['String']>;
  user_in?: InputMaybe<Array<Scalars['String']>>;
  user_lt?: InputMaybe<Scalars['String']>;
  user_lte?: InputMaybe<Scalars['String']>;
  user_not?: InputMaybe<Scalars['String']>;
  user_not_contains?: InputMaybe<Scalars['String']>;
  user_not_contains_nocase?: InputMaybe<Scalars['String']>;
  user_not_ends_with?: InputMaybe<Scalars['String']>;
  user_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  user_not_in?: InputMaybe<Array<Scalars['String']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']>;
  user_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  user_starts_with?: InputMaybe<Scalars['String']>;
  user_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum Borrow_OrderBy {
  CollateralToLoanRate = 'collateralToLoanRate',
  CollateralToken = 'collateralToken',
  CurrentMargin = 'currentMargin',
  EmittedBy = 'emittedBy',
  Id = 'id',
  InterestDuration = 'interestDuration',
  InterestRate = 'interestRate',
  Lender = 'lender',
  LoanId = 'loanId',
  LoanToken = 'loanToken',
  NewCollateral = 'newCollateral',
  NewPrincipal = 'newPrincipal',
  Timestamp = 'timestamp',
  Transaction = 'transaction',
  User = 'user',
}

/**
 * Cross Chain Bridge
 *
 */
export type Bridge = {
  __typename?: 'Bridge';
  /**
   * CreatedAtTx - The bridge creation transaction
   *
   */
  createdAtTx: Transaction;
  /**
   * Federation - the Federation entity associated with this bridge
   *
   */
  federation: Federation;
  /**
   * Bridge ID - Bridge Contract Address
   *
   */
  id: Scalars['ID'];
  /**
   * isPaused - Indicates if the bridge is currently paused
   *
   */
  isPaused: Scalars['Boolean'];
  /**
   * isSuffix - is suffix or prefix
   *
   */
  isSuffix?: Maybe<Scalars['Boolean']>;
  /**
   * isUpgrading - Indicates if the bridge is currently upgrading
   *
   */
  isUpgrading: Scalars['Boolean'];
  /**
   * Pausers - an array of addresses authorized to pause the bridge
   *
   */
  pausers: Array<Scalars['Bytes']>;
  /**
   * Prefix - prefix added to sideTokens symbol when created
   *
   */
  prefix?: Maybe<Scalars['String']>;
  /**
   * BridgeType - there are currently only two bridges - RSK_BSC and RSK_ETH
   *
   */
  type: BridgeType;
  /**
   * UpdatedAtTx - The bridge last updated at this transaction
   *
   */
  updatedAtTx: Transaction;
};

export enum BridgeChain {
  Bsc = 'BSC',
  Eth = 'ETH',
  Rsk = 'RSK',
}

/**
 * BridgeType - only 2 bridges at the moment - RSK <-> BSC and RSK <-> ETH
 *
 */
export enum BridgeType {
  RskBsc = 'RSK_BSC',
  RskEth = 'RSK_ETH',
}

export type Bridge_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  createdAtTx?: InputMaybe<Scalars['String']>;
  createdAtTx_?: InputMaybe<Transaction_Filter>;
  createdAtTx_contains?: InputMaybe<Scalars['String']>;
  createdAtTx_contains_nocase?: InputMaybe<Scalars['String']>;
  createdAtTx_ends_with?: InputMaybe<Scalars['String']>;
  createdAtTx_ends_with_nocase?: InputMaybe<Scalars['String']>;
  createdAtTx_gt?: InputMaybe<Scalars['String']>;
  createdAtTx_gte?: InputMaybe<Scalars['String']>;
  createdAtTx_in?: InputMaybe<Array<Scalars['String']>>;
  createdAtTx_lt?: InputMaybe<Scalars['String']>;
  createdAtTx_lte?: InputMaybe<Scalars['String']>;
  createdAtTx_not?: InputMaybe<Scalars['String']>;
  createdAtTx_not_contains?: InputMaybe<Scalars['String']>;
  createdAtTx_not_contains_nocase?: InputMaybe<Scalars['String']>;
  createdAtTx_not_ends_with?: InputMaybe<Scalars['String']>;
  createdAtTx_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  createdAtTx_not_in?: InputMaybe<Array<Scalars['String']>>;
  createdAtTx_not_starts_with?: InputMaybe<Scalars['String']>;
  createdAtTx_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  createdAtTx_starts_with?: InputMaybe<Scalars['String']>;
  createdAtTx_starts_with_nocase?: InputMaybe<Scalars['String']>;
  federation?: InputMaybe<Scalars['String']>;
  federation_?: InputMaybe<Federation_Filter>;
  federation_contains?: InputMaybe<Scalars['String']>;
  federation_contains_nocase?: InputMaybe<Scalars['String']>;
  federation_ends_with?: InputMaybe<Scalars['String']>;
  federation_ends_with_nocase?: InputMaybe<Scalars['String']>;
  federation_gt?: InputMaybe<Scalars['String']>;
  federation_gte?: InputMaybe<Scalars['String']>;
  federation_in?: InputMaybe<Array<Scalars['String']>>;
  federation_lt?: InputMaybe<Scalars['String']>;
  federation_lte?: InputMaybe<Scalars['String']>;
  federation_not?: InputMaybe<Scalars['String']>;
  federation_not_contains?: InputMaybe<Scalars['String']>;
  federation_not_contains_nocase?: InputMaybe<Scalars['String']>;
  federation_not_ends_with?: InputMaybe<Scalars['String']>;
  federation_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  federation_not_in?: InputMaybe<Array<Scalars['String']>>;
  federation_not_starts_with?: InputMaybe<Scalars['String']>;
  federation_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  federation_starts_with?: InputMaybe<Scalars['String']>;
  federation_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  isPaused?: InputMaybe<Scalars['Boolean']>;
  isPaused_in?: InputMaybe<Array<Scalars['Boolean']>>;
  isPaused_not?: InputMaybe<Scalars['Boolean']>;
  isPaused_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  isSuffix?: InputMaybe<Scalars['Boolean']>;
  isSuffix_in?: InputMaybe<Array<Scalars['Boolean']>>;
  isSuffix_not?: InputMaybe<Scalars['Boolean']>;
  isSuffix_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  isUpgrading?: InputMaybe<Scalars['Boolean']>;
  isUpgrading_in?: InputMaybe<Array<Scalars['Boolean']>>;
  isUpgrading_not?: InputMaybe<Scalars['Boolean']>;
  isUpgrading_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  pausers?: InputMaybe<Array<Scalars['Bytes']>>;
  pausers_contains?: InputMaybe<Array<Scalars['Bytes']>>;
  pausers_contains_nocase?: InputMaybe<Array<Scalars['Bytes']>>;
  pausers_not?: InputMaybe<Array<Scalars['Bytes']>>;
  pausers_not_contains?: InputMaybe<Array<Scalars['Bytes']>>;
  pausers_not_contains_nocase?: InputMaybe<Array<Scalars['Bytes']>>;
  prefix?: InputMaybe<Scalars['String']>;
  prefix_contains?: InputMaybe<Scalars['String']>;
  prefix_contains_nocase?: InputMaybe<Scalars['String']>;
  prefix_ends_with?: InputMaybe<Scalars['String']>;
  prefix_ends_with_nocase?: InputMaybe<Scalars['String']>;
  prefix_gt?: InputMaybe<Scalars['String']>;
  prefix_gte?: InputMaybe<Scalars['String']>;
  prefix_in?: InputMaybe<Array<Scalars['String']>>;
  prefix_lt?: InputMaybe<Scalars['String']>;
  prefix_lte?: InputMaybe<Scalars['String']>;
  prefix_not?: InputMaybe<Scalars['String']>;
  prefix_not_contains?: InputMaybe<Scalars['String']>;
  prefix_not_contains_nocase?: InputMaybe<Scalars['String']>;
  prefix_not_ends_with?: InputMaybe<Scalars['String']>;
  prefix_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  prefix_not_in?: InputMaybe<Array<Scalars['String']>>;
  prefix_not_starts_with?: InputMaybe<Scalars['String']>;
  prefix_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  prefix_starts_with?: InputMaybe<Scalars['String']>;
  prefix_starts_with_nocase?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<BridgeType>;
  type_in?: InputMaybe<Array<BridgeType>>;
  type_not?: InputMaybe<BridgeType>;
  type_not_in?: InputMaybe<Array<BridgeType>>;
  updatedAtTx?: InputMaybe<Scalars['String']>;
  updatedAtTx_?: InputMaybe<Transaction_Filter>;
  updatedAtTx_contains?: InputMaybe<Scalars['String']>;
  updatedAtTx_contains_nocase?: InputMaybe<Scalars['String']>;
  updatedAtTx_ends_with?: InputMaybe<Scalars['String']>;
  updatedAtTx_ends_with_nocase?: InputMaybe<Scalars['String']>;
  updatedAtTx_gt?: InputMaybe<Scalars['String']>;
  updatedAtTx_gte?: InputMaybe<Scalars['String']>;
  updatedAtTx_in?: InputMaybe<Array<Scalars['String']>>;
  updatedAtTx_lt?: InputMaybe<Scalars['String']>;
  updatedAtTx_lte?: InputMaybe<Scalars['String']>;
  updatedAtTx_not?: InputMaybe<Scalars['String']>;
  updatedAtTx_not_contains?: InputMaybe<Scalars['String']>;
  updatedAtTx_not_contains_nocase?: InputMaybe<Scalars['String']>;
  updatedAtTx_not_ends_with?: InputMaybe<Scalars['String']>;
  updatedAtTx_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  updatedAtTx_not_in?: InputMaybe<Array<Scalars['String']>>;
  updatedAtTx_not_starts_with?: InputMaybe<Scalars['String']>;
  updatedAtTx_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  updatedAtTx_starts_with?: InputMaybe<Scalars['String']>;
  updatedAtTx_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum Bridge_OrderBy {
  CreatedAtTx = 'createdAtTx',
  Federation = 'federation',
  Id = 'id',
  IsPaused = 'isPaused',
  IsSuffix = 'isSuffix',
  IsUpgrading = 'isUpgrading',
  Pausers = 'pausers',
  Prefix = 'prefix',
  Type = 'type',
  UpdatedAtTx = 'updatedAtTx',
}

export type CandleStickDay = ICandleStick & {
  __typename?: 'CandleStickDay';
  baseToken?: Maybe<Token>;
  close: Scalars['BigDecimal'];
  high: Scalars['BigDecimal'];
  id: Scalars['ID'];
  low: Scalars['BigDecimal'];
  open?: Maybe<Scalars['BigDecimal']>;
  periodStartUnix: Scalars['Int'];
  quoteToken?: Maybe<Token>;
  totalVolume: Scalars['BigDecimal'];
  txCount: Scalars['Int'];
};

export type CandleStickDay_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  baseToken?: InputMaybe<Scalars['String']>;
  baseToken_?: InputMaybe<Token_Filter>;
  baseToken_contains?: InputMaybe<Scalars['String']>;
  baseToken_contains_nocase?: InputMaybe<Scalars['String']>;
  baseToken_ends_with?: InputMaybe<Scalars['String']>;
  baseToken_ends_with_nocase?: InputMaybe<Scalars['String']>;
  baseToken_gt?: InputMaybe<Scalars['String']>;
  baseToken_gte?: InputMaybe<Scalars['String']>;
  baseToken_in?: InputMaybe<Array<Scalars['String']>>;
  baseToken_lt?: InputMaybe<Scalars['String']>;
  baseToken_lte?: InputMaybe<Scalars['String']>;
  baseToken_not?: InputMaybe<Scalars['String']>;
  baseToken_not_contains?: InputMaybe<Scalars['String']>;
  baseToken_not_contains_nocase?: InputMaybe<Scalars['String']>;
  baseToken_not_ends_with?: InputMaybe<Scalars['String']>;
  baseToken_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  baseToken_not_in?: InputMaybe<Array<Scalars['String']>>;
  baseToken_not_starts_with?: InputMaybe<Scalars['String']>;
  baseToken_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  baseToken_starts_with?: InputMaybe<Scalars['String']>;
  baseToken_starts_with_nocase?: InputMaybe<Scalars['String']>;
  close?: InputMaybe<Scalars['BigDecimal']>;
  close_gt?: InputMaybe<Scalars['BigDecimal']>;
  close_gte?: InputMaybe<Scalars['BigDecimal']>;
  close_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  close_lt?: InputMaybe<Scalars['BigDecimal']>;
  close_lte?: InputMaybe<Scalars['BigDecimal']>;
  close_not?: InputMaybe<Scalars['BigDecimal']>;
  close_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  high?: InputMaybe<Scalars['BigDecimal']>;
  high_gt?: InputMaybe<Scalars['BigDecimal']>;
  high_gte?: InputMaybe<Scalars['BigDecimal']>;
  high_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  high_lt?: InputMaybe<Scalars['BigDecimal']>;
  high_lte?: InputMaybe<Scalars['BigDecimal']>;
  high_not?: InputMaybe<Scalars['BigDecimal']>;
  high_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  low?: InputMaybe<Scalars['BigDecimal']>;
  low_gt?: InputMaybe<Scalars['BigDecimal']>;
  low_gte?: InputMaybe<Scalars['BigDecimal']>;
  low_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  low_lt?: InputMaybe<Scalars['BigDecimal']>;
  low_lte?: InputMaybe<Scalars['BigDecimal']>;
  low_not?: InputMaybe<Scalars['BigDecimal']>;
  low_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  open?: InputMaybe<Scalars['BigDecimal']>;
  open_gt?: InputMaybe<Scalars['BigDecimal']>;
  open_gte?: InputMaybe<Scalars['BigDecimal']>;
  open_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  open_lt?: InputMaybe<Scalars['BigDecimal']>;
  open_lte?: InputMaybe<Scalars['BigDecimal']>;
  open_not?: InputMaybe<Scalars['BigDecimal']>;
  open_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  periodStartUnix?: InputMaybe<Scalars['Int']>;
  periodStartUnix_gt?: InputMaybe<Scalars['Int']>;
  periodStartUnix_gte?: InputMaybe<Scalars['Int']>;
  periodStartUnix_in?: InputMaybe<Array<Scalars['Int']>>;
  periodStartUnix_lt?: InputMaybe<Scalars['Int']>;
  periodStartUnix_lte?: InputMaybe<Scalars['Int']>;
  periodStartUnix_not?: InputMaybe<Scalars['Int']>;
  periodStartUnix_not_in?: InputMaybe<Array<Scalars['Int']>>;
  quoteToken?: InputMaybe<Scalars['String']>;
  quoteToken_?: InputMaybe<Token_Filter>;
  quoteToken_contains?: InputMaybe<Scalars['String']>;
  quoteToken_contains_nocase?: InputMaybe<Scalars['String']>;
  quoteToken_ends_with?: InputMaybe<Scalars['String']>;
  quoteToken_ends_with_nocase?: InputMaybe<Scalars['String']>;
  quoteToken_gt?: InputMaybe<Scalars['String']>;
  quoteToken_gte?: InputMaybe<Scalars['String']>;
  quoteToken_in?: InputMaybe<Array<Scalars['String']>>;
  quoteToken_lt?: InputMaybe<Scalars['String']>;
  quoteToken_lte?: InputMaybe<Scalars['String']>;
  quoteToken_not?: InputMaybe<Scalars['String']>;
  quoteToken_not_contains?: InputMaybe<Scalars['String']>;
  quoteToken_not_contains_nocase?: InputMaybe<Scalars['String']>;
  quoteToken_not_ends_with?: InputMaybe<Scalars['String']>;
  quoteToken_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  quoteToken_not_in?: InputMaybe<Array<Scalars['String']>>;
  quoteToken_not_starts_with?: InputMaybe<Scalars['String']>;
  quoteToken_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  quoteToken_starts_with?: InputMaybe<Scalars['String']>;
  quoteToken_starts_with_nocase?: InputMaybe<Scalars['String']>;
  totalVolume?: InputMaybe<Scalars['BigDecimal']>;
  totalVolume_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalVolume_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalVolume_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalVolume_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalVolume_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalVolume_not?: InputMaybe<Scalars['BigDecimal']>;
  totalVolume_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  txCount?: InputMaybe<Scalars['Int']>;
  txCount_gt?: InputMaybe<Scalars['Int']>;
  txCount_gte?: InputMaybe<Scalars['Int']>;
  txCount_in?: InputMaybe<Array<Scalars['Int']>>;
  txCount_lt?: InputMaybe<Scalars['Int']>;
  txCount_lte?: InputMaybe<Scalars['Int']>;
  txCount_not?: InputMaybe<Scalars['Int']>;
  txCount_not_in?: InputMaybe<Array<Scalars['Int']>>;
};

export enum CandleStickDay_OrderBy {
  BaseToken = 'baseToken',
  Close = 'close',
  High = 'high',
  Id = 'id',
  Low = 'low',
  Open = 'open',
  PeriodStartUnix = 'periodStartUnix',
  QuoteToken = 'quoteToken',
  TotalVolume = 'totalVolume',
  TxCount = 'txCount',
}

export type CandleStickFifteenMinute = ICandleStick & {
  __typename?: 'CandleStickFifteenMinute';
  baseToken?: Maybe<Token>;
  close: Scalars['BigDecimal'];
  high: Scalars['BigDecimal'];
  id: Scalars['ID'];
  low: Scalars['BigDecimal'];
  open?: Maybe<Scalars['BigDecimal']>;
  periodStartUnix: Scalars['Int'];
  quoteToken?: Maybe<Token>;
  totalVolume: Scalars['BigDecimal'];
  txCount: Scalars['Int'];
};

export type CandleStickFifteenMinute_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  baseToken?: InputMaybe<Scalars['String']>;
  baseToken_?: InputMaybe<Token_Filter>;
  baseToken_contains?: InputMaybe<Scalars['String']>;
  baseToken_contains_nocase?: InputMaybe<Scalars['String']>;
  baseToken_ends_with?: InputMaybe<Scalars['String']>;
  baseToken_ends_with_nocase?: InputMaybe<Scalars['String']>;
  baseToken_gt?: InputMaybe<Scalars['String']>;
  baseToken_gte?: InputMaybe<Scalars['String']>;
  baseToken_in?: InputMaybe<Array<Scalars['String']>>;
  baseToken_lt?: InputMaybe<Scalars['String']>;
  baseToken_lte?: InputMaybe<Scalars['String']>;
  baseToken_not?: InputMaybe<Scalars['String']>;
  baseToken_not_contains?: InputMaybe<Scalars['String']>;
  baseToken_not_contains_nocase?: InputMaybe<Scalars['String']>;
  baseToken_not_ends_with?: InputMaybe<Scalars['String']>;
  baseToken_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  baseToken_not_in?: InputMaybe<Array<Scalars['String']>>;
  baseToken_not_starts_with?: InputMaybe<Scalars['String']>;
  baseToken_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  baseToken_starts_with?: InputMaybe<Scalars['String']>;
  baseToken_starts_with_nocase?: InputMaybe<Scalars['String']>;
  close?: InputMaybe<Scalars['BigDecimal']>;
  close_gt?: InputMaybe<Scalars['BigDecimal']>;
  close_gte?: InputMaybe<Scalars['BigDecimal']>;
  close_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  close_lt?: InputMaybe<Scalars['BigDecimal']>;
  close_lte?: InputMaybe<Scalars['BigDecimal']>;
  close_not?: InputMaybe<Scalars['BigDecimal']>;
  close_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  high?: InputMaybe<Scalars['BigDecimal']>;
  high_gt?: InputMaybe<Scalars['BigDecimal']>;
  high_gte?: InputMaybe<Scalars['BigDecimal']>;
  high_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  high_lt?: InputMaybe<Scalars['BigDecimal']>;
  high_lte?: InputMaybe<Scalars['BigDecimal']>;
  high_not?: InputMaybe<Scalars['BigDecimal']>;
  high_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  low?: InputMaybe<Scalars['BigDecimal']>;
  low_gt?: InputMaybe<Scalars['BigDecimal']>;
  low_gte?: InputMaybe<Scalars['BigDecimal']>;
  low_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  low_lt?: InputMaybe<Scalars['BigDecimal']>;
  low_lte?: InputMaybe<Scalars['BigDecimal']>;
  low_not?: InputMaybe<Scalars['BigDecimal']>;
  low_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  open?: InputMaybe<Scalars['BigDecimal']>;
  open_gt?: InputMaybe<Scalars['BigDecimal']>;
  open_gte?: InputMaybe<Scalars['BigDecimal']>;
  open_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  open_lt?: InputMaybe<Scalars['BigDecimal']>;
  open_lte?: InputMaybe<Scalars['BigDecimal']>;
  open_not?: InputMaybe<Scalars['BigDecimal']>;
  open_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  periodStartUnix?: InputMaybe<Scalars['Int']>;
  periodStartUnix_gt?: InputMaybe<Scalars['Int']>;
  periodStartUnix_gte?: InputMaybe<Scalars['Int']>;
  periodStartUnix_in?: InputMaybe<Array<Scalars['Int']>>;
  periodStartUnix_lt?: InputMaybe<Scalars['Int']>;
  periodStartUnix_lte?: InputMaybe<Scalars['Int']>;
  periodStartUnix_not?: InputMaybe<Scalars['Int']>;
  periodStartUnix_not_in?: InputMaybe<Array<Scalars['Int']>>;
  quoteToken?: InputMaybe<Scalars['String']>;
  quoteToken_?: InputMaybe<Token_Filter>;
  quoteToken_contains?: InputMaybe<Scalars['String']>;
  quoteToken_contains_nocase?: InputMaybe<Scalars['String']>;
  quoteToken_ends_with?: InputMaybe<Scalars['String']>;
  quoteToken_ends_with_nocase?: InputMaybe<Scalars['String']>;
  quoteToken_gt?: InputMaybe<Scalars['String']>;
  quoteToken_gte?: InputMaybe<Scalars['String']>;
  quoteToken_in?: InputMaybe<Array<Scalars['String']>>;
  quoteToken_lt?: InputMaybe<Scalars['String']>;
  quoteToken_lte?: InputMaybe<Scalars['String']>;
  quoteToken_not?: InputMaybe<Scalars['String']>;
  quoteToken_not_contains?: InputMaybe<Scalars['String']>;
  quoteToken_not_contains_nocase?: InputMaybe<Scalars['String']>;
  quoteToken_not_ends_with?: InputMaybe<Scalars['String']>;
  quoteToken_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  quoteToken_not_in?: InputMaybe<Array<Scalars['String']>>;
  quoteToken_not_starts_with?: InputMaybe<Scalars['String']>;
  quoteToken_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  quoteToken_starts_with?: InputMaybe<Scalars['String']>;
  quoteToken_starts_with_nocase?: InputMaybe<Scalars['String']>;
  totalVolume?: InputMaybe<Scalars['BigDecimal']>;
  totalVolume_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalVolume_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalVolume_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalVolume_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalVolume_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalVolume_not?: InputMaybe<Scalars['BigDecimal']>;
  totalVolume_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  txCount?: InputMaybe<Scalars['Int']>;
  txCount_gt?: InputMaybe<Scalars['Int']>;
  txCount_gte?: InputMaybe<Scalars['Int']>;
  txCount_in?: InputMaybe<Array<Scalars['Int']>>;
  txCount_lt?: InputMaybe<Scalars['Int']>;
  txCount_lte?: InputMaybe<Scalars['Int']>;
  txCount_not?: InputMaybe<Scalars['Int']>;
  txCount_not_in?: InputMaybe<Array<Scalars['Int']>>;
};

export enum CandleStickFifteenMinute_OrderBy {
  BaseToken = 'baseToken',
  Close = 'close',
  High = 'high',
  Id = 'id',
  Low = 'low',
  Open = 'open',
  PeriodStartUnix = 'periodStartUnix',
  QuoteToken = 'quoteToken',
  TotalVolume = 'totalVolume',
  TxCount = 'txCount',
}

export type CandleStickFourHour = ICandleStick & {
  __typename?: 'CandleStickFourHour';
  baseToken?: Maybe<Token>;
  close: Scalars['BigDecimal'];
  high: Scalars['BigDecimal'];
  id: Scalars['ID'];
  low: Scalars['BigDecimal'];
  open?: Maybe<Scalars['BigDecimal']>;
  periodStartUnix: Scalars['Int'];
  quoteToken?: Maybe<Token>;
  totalVolume: Scalars['BigDecimal'];
  txCount: Scalars['Int'];
};

export type CandleStickFourHour_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  baseToken?: InputMaybe<Scalars['String']>;
  baseToken_?: InputMaybe<Token_Filter>;
  baseToken_contains?: InputMaybe<Scalars['String']>;
  baseToken_contains_nocase?: InputMaybe<Scalars['String']>;
  baseToken_ends_with?: InputMaybe<Scalars['String']>;
  baseToken_ends_with_nocase?: InputMaybe<Scalars['String']>;
  baseToken_gt?: InputMaybe<Scalars['String']>;
  baseToken_gte?: InputMaybe<Scalars['String']>;
  baseToken_in?: InputMaybe<Array<Scalars['String']>>;
  baseToken_lt?: InputMaybe<Scalars['String']>;
  baseToken_lte?: InputMaybe<Scalars['String']>;
  baseToken_not?: InputMaybe<Scalars['String']>;
  baseToken_not_contains?: InputMaybe<Scalars['String']>;
  baseToken_not_contains_nocase?: InputMaybe<Scalars['String']>;
  baseToken_not_ends_with?: InputMaybe<Scalars['String']>;
  baseToken_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  baseToken_not_in?: InputMaybe<Array<Scalars['String']>>;
  baseToken_not_starts_with?: InputMaybe<Scalars['String']>;
  baseToken_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  baseToken_starts_with?: InputMaybe<Scalars['String']>;
  baseToken_starts_with_nocase?: InputMaybe<Scalars['String']>;
  close?: InputMaybe<Scalars['BigDecimal']>;
  close_gt?: InputMaybe<Scalars['BigDecimal']>;
  close_gte?: InputMaybe<Scalars['BigDecimal']>;
  close_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  close_lt?: InputMaybe<Scalars['BigDecimal']>;
  close_lte?: InputMaybe<Scalars['BigDecimal']>;
  close_not?: InputMaybe<Scalars['BigDecimal']>;
  close_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  high?: InputMaybe<Scalars['BigDecimal']>;
  high_gt?: InputMaybe<Scalars['BigDecimal']>;
  high_gte?: InputMaybe<Scalars['BigDecimal']>;
  high_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  high_lt?: InputMaybe<Scalars['BigDecimal']>;
  high_lte?: InputMaybe<Scalars['BigDecimal']>;
  high_not?: InputMaybe<Scalars['BigDecimal']>;
  high_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  low?: InputMaybe<Scalars['BigDecimal']>;
  low_gt?: InputMaybe<Scalars['BigDecimal']>;
  low_gte?: InputMaybe<Scalars['BigDecimal']>;
  low_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  low_lt?: InputMaybe<Scalars['BigDecimal']>;
  low_lte?: InputMaybe<Scalars['BigDecimal']>;
  low_not?: InputMaybe<Scalars['BigDecimal']>;
  low_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  open?: InputMaybe<Scalars['BigDecimal']>;
  open_gt?: InputMaybe<Scalars['BigDecimal']>;
  open_gte?: InputMaybe<Scalars['BigDecimal']>;
  open_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  open_lt?: InputMaybe<Scalars['BigDecimal']>;
  open_lte?: InputMaybe<Scalars['BigDecimal']>;
  open_not?: InputMaybe<Scalars['BigDecimal']>;
  open_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  periodStartUnix?: InputMaybe<Scalars['Int']>;
  periodStartUnix_gt?: InputMaybe<Scalars['Int']>;
  periodStartUnix_gte?: InputMaybe<Scalars['Int']>;
  periodStartUnix_in?: InputMaybe<Array<Scalars['Int']>>;
  periodStartUnix_lt?: InputMaybe<Scalars['Int']>;
  periodStartUnix_lte?: InputMaybe<Scalars['Int']>;
  periodStartUnix_not?: InputMaybe<Scalars['Int']>;
  periodStartUnix_not_in?: InputMaybe<Array<Scalars['Int']>>;
  quoteToken?: InputMaybe<Scalars['String']>;
  quoteToken_?: InputMaybe<Token_Filter>;
  quoteToken_contains?: InputMaybe<Scalars['String']>;
  quoteToken_contains_nocase?: InputMaybe<Scalars['String']>;
  quoteToken_ends_with?: InputMaybe<Scalars['String']>;
  quoteToken_ends_with_nocase?: InputMaybe<Scalars['String']>;
  quoteToken_gt?: InputMaybe<Scalars['String']>;
  quoteToken_gte?: InputMaybe<Scalars['String']>;
  quoteToken_in?: InputMaybe<Array<Scalars['String']>>;
  quoteToken_lt?: InputMaybe<Scalars['String']>;
  quoteToken_lte?: InputMaybe<Scalars['String']>;
  quoteToken_not?: InputMaybe<Scalars['String']>;
  quoteToken_not_contains?: InputMaybe<Scalars['String']>;
  quoteToken_not_contains_nocase?: InputMaybe<Scalars['String']>;
  quoteToken_not_ends_with?: InputMaybe<Scalars['String']>;
  quoteToken_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  quoteToken_not_in?: InputMaybe<Array<Scalars['String']>>;
  quoteToken_not_starts_with?: InputMaybe<Scalars['String']>;
  quoteToken_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  quoteToken_starts_with?: InputMaybe<Scalars['String']>;
  quoteToken_starts_with_nocase?: InputMaybe<Scalars['String']>;
  totalVolume?: InputMaybe<Scalars['BigDecimal']>;
  totalVolume_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalVolume_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalVolume_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalVolume_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalVolume_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalVolume_not?: InputMaybe<Scalars['BigDecimal']>;
  totalVolume_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  txCount?: InputMaybe<Scalars['Int']>;
  txCount_gt?: InputMaybe<Scalars['Int']>;
  txCount_gte?: InputMaybe<Scalars['Int']>;
  txCount_in?: InputMaybe<Array<Scalars['Int']>>;
  txCount_lt?: InputMaybe<Scalars['Int']>;
  txCount_lte?: InputMaybe<Scalars['Int']>;
  txCount_not?: InputMaybe<Scalars['Int']>;
  txCount_not_in?: InputMaybe<Array<Scalars['Int']>>;
};

export enum CandleStickFourHour_OrderBy {
  BaseToken = 'baseToken',
  Close = 'close',
  High = 'high',
  Id = 'id',
  Low = 'low',
  Open = 'open',
  PeriodStartUnix = 'periodStartUnix',
  QuoteToken = 'quoteToken',
  TotalVolume = 'totalVolume',
  TxCount = 'txCount',
}

export type CandleStickHour = ICandleStick & {
  __typename?: 'CandleStickHour';
  baseToken?: Maybe<Token>;
  close: Scalars['BigDecimal'];
  high: Scalars['BigDecimal'];
  id: Scalars['ID'];
  low: Scalars['BigDecimal'];
  open?: Maybe<Scalars['BigDecimal']>;
  periodStartUnix: Scalars['Int'];
  quoteToken?: Maybe<Token>;
  totalVolume: Scalars['BigDecimal'];
  txCount: Scalars['Int'];
};

export type CandleStickHour_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  baseToken?: InputMaybe<Scalars['String']>;
  baseToken_?: InputMaybe<Token_Filter>;
  baseToken_contains?: InputMaybe<Scalars['String']>;
  baseToken_contains_nocase?: InputMaybe<Scalars['String']>;
  baseToken_ends_with?: InputMaybe<Scalars['String']>;
  baseToken_ends_with_nocase?: InputMaybe<Scalars['String']>;
  baseToken_gt?: InputMaybe<Scalars['String']>;
  baseToken_gte?: InputMaybe<Scalars['String']>;
  baseToken_in?: InputMaybe<Array<Scalars['String']>>;
  baseToken_lt?: InputMaybe<Scalars['String']>;
  baseToken_lte?: InputMaybe<Scalars['String']>;
  baseToken_not?: InputMaybe<Scalars['String']>;
  baseToken_not_contains?: InputMaybe<Scalars['String']>;
  baseToken_not_contains_nocase?: InputMaybe<Scalars['String']>;
  baseToken_not_ends_with?: InputMaybe<Scalars['String']>;
  baseToken_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  baseToken_not_in?: InputMaybe<Array<Scalars['String']>>;
  baseToken_not_starts_with?: InputMaybe<Scalars['String']>;
  baseToken_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  baseToken_starts_with?: InputMaybe<Scalars['String']>;
  baseToken_starts_with_nocase?: InputMaybe<Scalars['String']>;
  close?: InputMaybe<Scalars['BigDecimal']>;
  close_gt?: InputMaybe<Scalars['BigDecimal']>;
  close_gte?: InputMaybe<Scalars['BigDecimal']>;
  close_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  close_lt?: InputMaybe<Scalars['BigDecimal']>;
  close_lte?: InputMaybe<Scalars['BigDecimal']>;
  close_not?: InputMaybe<Scalars['BigDecimal']>;
  close_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  high?: InputMaybe<Scalars['BigDecimal']>;
  high_gt?: InputMaybe<Scalars['BigDecimal']>;
  high_gte?: InputMaybe<Scalars['BigDecimal']>;
  high_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  high_lt?: InputMaybe<Scalars['BigDecimal']>;
  high_lte?: InputMaybe<Scalars['BigDecimal']>;
  high_not?: InputMaybe<Scalars['BigDecimal']>;
  high_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  low?: InputMaybe<Scalars['BigDecimal']>;
  low_gt?: InputMaybe<Scalars['BigDecimal']>;
  low_gte?: InputMaybe<Scalars['BigDecimal']>;
  low_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  low_lt?: InputMaybe<Scalars['BigDecimal']>;
  low_lte?: InputMaybe<Scalars['BigDecimal']>;
  low_not?: InputMaybe<Scalars['BigDecimal']>;
  low_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  open?: InputMaybe<Scalars['BigDecimal']>;
  open_gt?: InputMaybe<Scalars['BigDecimal']>;
  open_gte?: InputMaybe<Scalars['BigDecimal']>;
  open_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  open_lt?: InputMaybe<Scalars['BigDecimal']>;
  open_lte?: InputMaybe<Scalars['BigDecimal']>;
  open_not?: InputMaybe<Scalars['BigDecimal']>;
  open_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  periodStartUnix?: InputMaybe<Scalars['Int']>;
  periodStartUnix_gt?: InputMaybe<Scalars['Int']>;
  periodStartUnix_gte?: InputMaybe<Scalars['Int']>;
  periodStartUnix_in?: InputMaybe<Array<Scalars['Int']>>;
  periodStartUnix_lt?: InputMaybe<Scalars['Int']>;
  periodStartUnix_lte?: InputMaybe<Scalars['Int']>;
  periodStartUnix_not?: InputMaybe<Scalars['Int']>;
  periodStartUnix_not_in?: InputMaybe<Array<Scalars['Int']>>;
  quoteToken?: InputMaybe<Scalars['String']>;
  quoteToken_?: InputMaybe<Token_Filter>;
  quoteToken_contains?: InputMaybe<Scalars['String']>;
  quoteToken_contains_nocase?: InputMaybe<Scalars['String']>;
  quoteToken_ends_with?: InputMaybe<Scalars['String']>;
  quoteToken_ends_with_nocase?: InputMaybe<Scalars['String']>;
  quoteToken_gt?: InputMaybe<Scalars['String']>;
  quoteToken_gte?: InputMaybe<Scalars['String']>;
  quoteToken_in?: InputMaybe<Array<Scalars['String']>>;
  quoteToken_lt?: InputMaybe<Scalars['String']>;
  quoteToken_lte?: InputMaybe<Scalars['String']>;
  quoteToken_not?: InputMaybe<Scalars['String']>;
  quoteToken_not_contains?: InputMaybe<Scalars['String']>;
  quoteToken_not_contains_nocase?: InputMaybe<Scalars['String']>;
  quoteToken_not_ends_with?: InputMaybe<Scalars['String']>;
  quoteToken_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  quoteToken_not_in?: InputMaybe<Array<Scalars['String']>>;
  quoteToken_not_starts_with?: InputMaybe<Scalars['String']>;
  quoteToken_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  quoteToken_starts_with?: InputMaybe<Scalars['String']>;
  quoteToken_starts_with_nocase?: InputMaybe<Scalars['String']>;
  totalVolume?: InputMaybe<Scalars['BigDecimal']>;
  totalVolume_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalVolume_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalVolume_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalVolume_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalVolume_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalVolume_not?: InputMaybe<Scalars['BigDecimal']>;
  totalVolume_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  txCount?: InputMaybe<Scalars['Int']>;
  txCount_gt?: InputMaybe<Scalars['Int']>;
  txCount_gte?: InputMaybe<Scalars['Int']>;
  txCount_in?: InputMaybe<Array<Scalars['Int']>>;
  txCount_lt?: InputMaybe<Scalars['Int']>;
  txCount_lte?: InputMaybe<Scalars['Int']>;
  txCount_not?: InputMaybe<Scalars['Int']>;
  txCount_not_in?: InputMaybe<Array<Scalars['Int']>>;
};

export enum CandleStickHour_OrderBy {
  BaseToken = 'baseToken',
  Close = 'close',
  High = 'high',
  Id = 'id',
  Low = 'low',
  Open = 'open',
  PeriodStartUnix = 'periodStartUnix',
  QuoteToken = 'quoteToken',
  TotalVolume = 'totalVolume',
  TxCount = 'txCount',
}

export type CandleStickMinute = ICandleStick & {
  __typename?: 'CandleStickMinute';
  baseToken?: Maybe<Token>;
  close: Scalars['BigDecimal'];
  high: Scalars['BigDecimal'];
  id: Scalars['ID'];
  low: Scalars['BigDecimal'];
  open?: Maybe<Scalars['BigDecimal']>;
  periodStartUnix: Scalars['Int'];
  quoteToken?: Maybe<Token>;
  totalVolume: Scalars['BigDecimal'];
  txCount: Scalars['Int'];
};

export type CandleStickMinute_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  baseToken?: InputMaybe<Scalars['String']>;
  baseToken_?: InputMaybe<Token_Filter>;
  baseToken_contains?: InputMaybe<Scalars['String']>;
  baseToken_contains_nocase?: InputMaybe<Scalars['String']>;
  baseToken_ends_with?: InputMaybe<Scalars['String']>;
  baseToken_ends_with_nocase?: InputMaybe<Scalars['String']>;
  baseToken_gt?: InputMaybe<Scalars['String']>;
  baseToken_gte?: InputMaybe<Scalars['String']>;
  baseToken_in?: InputMaybe<Array<Scalars['String']>>;
  baseToken_lt?: InputMaybe<Scalars['String']>;
  baseToken_lte?: InputMaybe<Scalars['String']>;
  baseToken_not?: InputMaybe<Scalars['String']>;
  baseToken_not_contains?: InputMaybe<Scalars['String']>;
  baseToken_not_contains_nocase?: InputMaybe<Scalars['String']>;
  baseToken_not_ends_with?: InputMaybe<Scalars['String']>;
  baseToken_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  baseToken_not_in?: InputMaybe<Array<Scalars['String']>>;
  baseToken_not_starts_with?: InputMaybe<Scalars['String']>;
  baseToken_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  baseToken_starts_with?: InputMaybe<Scalars['String']>;
  baseToken_starts_with_nocase?: InputMaybe<Scalars['String']>;
  close?: InputMaybe<Scalars['BigDecimal']>;
  close_gt?: InputMaybe<Scalars['BigDecimal']>;
  close_gte?: InputMaybe<Scalars['BigDecimal']>;
  close_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  close_lt?: InputMaybe<Scalars['BigDecimal']>;
  close_lte?: InputMaybe<Scalars['BigDecimal']>;
  close_not?: InputMaybe<Scalars['BigDecimal']>;
  close_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  high?: InputMaybe<Scalars['BigDecimal']>;
  high_gt?: InputMaybe<Scalars['BigDecimal']>;
  high_gte?: InputMaybe<Scalars['BigDecimal']>;
  high_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  high_lt?: InputMaybe<Scalars['BigDecimal']>;
  high_lte?: InputMaybe<Scalars['BigDecimal']>;
  high_not?: InputMaybe<Scalars['BigDecimal']>;
  high_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  low?: InputMaybe<Scalars['BigDecimal']>;
  low_gt?: InputMaybe<Scalars['BigDecimal']>;
  low_gte?: InputMaybe<Scalars['BigDecimal']>;
  low_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  low_lt?: InputMaybe<Scalars['BigDecimal']>;
  low_lte?: InputMaybe<Scalars['BigDecimal']>;
  low_not?: InputMaybe<Scalars['BigDecimal']>;
  low_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  open?: InputMaybe<Scalars['BigDecimal']>;
  open_gt?: InputMaybe<Scalars['BigDecimal']>;
  open_gte?: InputMaybe<Scalars['BigDecimal']>;
  open_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  open_lt?: InputMaybe<Scalars['BigDecimal']>;
  open_lte?: InputMaybe<Scalars['BigDecimal']>;
  open_not?: InputMaybe<Scalars['BigDecimal']>;
  open_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  periodStartUnix?: InputMaybe<Scalars['Int']>;
  periodStartUnix_gt?: InputMaybe<Scalars['Int']>;
  periodStartUnix_gte?: InputMaybe<Scalars['Int']>;
  periodStartUnix_in?: InputMaybe<Array<Scalars['Int']>>;
  periodStartUnix_lt?: InputMaybe<Scalars['Int']>;
  periodStartUnix_lte?: InputMaybe<Scalars['Int']>;
  periodStartUnix_not?: InputMaybe<Scalars['Int']>;
  periodStartUnix_not_in?: InputMaybe<Array<Scalars['Int']>>;
  quoteToken?: InputMaybe<Scalars['String']>;
  quoteToken_?: InputMaybe<Token_Filter>;
  quoteToken_contains?: InputMaybe<Scalars['String']>;
  quoteToken_contains_nocase?: InputMaybe<Scalars['String']>;
  quoteToken_ends_with?: InputMaybe<Scalars['String']>;
  quoteToken_ends_with_nocase?: InputMaybe<Scalars['String']>;
  quoteToken_gt?: InputMaybe<Scalars['String']>;
  quoteToken_gte?: InputMaybe<Scalars['String']>;
  quoteToken_in?: InputMaybe<Array<Scalars['String']>>;
  quoteToken_lt?: InputMaybe<Scalars['String']>;
  quoteToken_lte?: InputMaybe<Scalars['String']>;
  quoteToken_not?: InputMaybe<Scalars['String']>;
  quoteToken_not_contains?: InputMaybe<Scalars['String']>;
  quoteToken_not_contains_nocase?: InputMaybe<Scalars['String']>;
  quoteToken_not_ends_with?: InputMaybe<Scalars['String']>;
  quoteToken_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  quoteToken_not_in?: InputMaybe<Array<Scalars['String']>>;
  quoteToken_not_starts_with?: InputMaybe<Scalars['String']>;
  quoteToken_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  quoteToken_starts_with?: InputMaybe<Scalars['String']>;
  quoteToken_starts_with_nocase?: InputMaybe<Scalars['String']>;
  totalVolume?: InputMaybe<Scalars['BigDecimal']>;
  totalVolume_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalVolume_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalVolume_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalVolume_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalVolume_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalVolume_not?: InputMaybe<Scalars['BigDecimal']>;
  totalVolume_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  txCount?: InputMaybe<Scalars['Int']>;
  txCount_gt?: InputMaybe<Scalars['Int']>;
  txCount_gte?: InputMaybe<Scalars['Int']>;
  txCount_in?: InputMaybe<Array<Scalars['Int']>>;
  txCount_lt?: InputMaybe<Scalars['Int']>;
  txCount_lte?: InputMaybe<Scalars['Int']>;
  txCount_not?: InputMaybe<Scalars['Int']>;
  txCount_not_in?: InputMaybe<Array<Scalars['Int']>>;
};

export enum CandleStickMinute_OrderBy {
  BaseToken = 'baseToken',
  Close = 'close',
  High = 'high',
  Id = 'id',
  Low = 'low',
  Open = 'open',
  PeriodStartUnix = 'periodStartUnix',
  QuoteToken = 'quoteToken',
  TotalVolume = 'totalVolume',
  TxCount = 'txCount',
}

export enum CandleSticksInterval {
  DayInterval = 'DayInterval',
  FifteenMinutesInterval = 'FifteenMinutesInterval',
  FourHourInterval = 'FourHourInterval',
  HourInterval = 'HourInterval',
  MinuteInterval = 'MinuteInterval',
}

/**
 * Granular event data for the Loan entity. Emitted when a user closes a loan initiated by a Borrow event
 *
 */
export type CloseWithDeposit = {
  __typename?: 'CloseWithDeposit';
  closer: Scalars['Bytes'];
  collateralToLoanRate: Scalars['BigDecimal'];
  collateralToken: Scalars['Bytes'];
  collateralWithdrawAmount: Scalars['BigDecimal'];
  currentMargin: Scalars['BigDecimal'];
  emittedBy: Scalars['Bytes'];
  id: Scalars['ID'];
  lender: Scalars['Bytes'];
  loanId: Loan;
  loanToken: Scalars['Bytes'];
  repayAmount: Scalars['BigDecimal'];
  timestamp: Scalars['Int'];
  transaction: Transaction;
  user: Scalars['Bytes'];
};

export type CloseWithDeposit_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  closer?: InputMaybe<Scalars['Bytes']>;
  closer_contains?: InputMaybe<Scalars['Bytes']>;
  closer_in?: InputMaybe<Array<Scalars['Bytes']>>;
  closer_not?: InputMaybe<Scalars['Bytes']>;
  closer_not_contains?: InputMaybe<Scalars['Bytes']>;
  closer_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  collateralToLoanRate?: InputMaybe<Scalars['BigDecimal']>;
  collateralToLoanRate_gt?: InputMaybe<Scalars['BigDecimal']>;
  collateralToLoanRate_gte?: InputMaybe<Scalars['BigDecimal']>;
  collateralToLoanRate_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  collateralToLoanRate_lt?: InputMaybe<Scalars['BigDecimal']>;
  collateralToLoanRate_lte?: InputMaybe<Scalars['BigDecimal']>;
  collateralToLoanRate_not?: InputMaybe<Scalars['BigDecimal']>;
  collateralToLoanRate_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  collateralToken?: InputMaybe<Scalars['Bytes']>;
  collateralToken_contains?: InputMaybe<Scalars['Bytes']>;
  collateralToken_in?: InputMaybe<Array<Scalars['Bytes']>>;
  collateralToken_not?: InputMaybe<Scalars['Bytes']>;
  collateralToken_not_contains?: InputMaybe<Scalars['Bytes']>;
  collateralToken_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  collateralWithdrawAmount?: InputMaybe<Scalars['BigDecimal']>;
  collateralWithdrawAmount_gt?: InputMaybe<Scalars['BigDecimal']>;
  collateralWithdrawAmount_gte?: InputMaybe<Scalars['BigDecimal']>;
  collateralWithdrawAmount_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  collateralWithdrawAmount_lt?: InputMaybe<Scalars['BigDecimal']>;
  collateralWithdrawAmount_lte?: InputMaybe<Scalars['BigDecimal']>;
  collateralWithdrawAmount_not?: InputMaybe<Scalars['BigDecimal']>;
  collateralWithdrawAmount_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  currentMargin?: InputMaybe<Scalars['BigDecimal']>;
  currentMargin_gt?: InputMaybe<Scalars['BigDecimal']>;
  currentMargin_gte?: InputMaybe<Scalars['BigDecimal']>;
  currentMargin_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  currentMargin_lt?: InputMaybe<Scalars['BigDecimal']>;
  currentMargin_lte?: InputMaybe<Scalars['BigDecimal']>;
  currentMargin_not?: InputMaybe<Scalars['BigDecimal']>;
  currentMargin_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  emittedBy?: InputMaybe<Scalars['Bytes']>;
  emittedBy_contains?: InputMaybe<Scalars['Bytes']>;
  emittedBy_in?: InputMaybe<Array<Scalars['Bytes']>>;
  emittedBy_not?: InputMaybe<Scalars['Bytes']>;
  emittedBy_not_contains?: InputMaybe<Scalars['Bytes']>;
  emittedBy_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  lender?: InputMaybe<Scalars['Bytes']>;
  lender_contains?: InputMaybe<Scalars['Bytes']>;
  lender_in?: InputMaybe<Array<Scalars['Bytes']>>;
  lender_not?: InputMaybe<Scalars['Bytes']>;
  lender_not_contains?: InputMaybe<Scalars['Bytes']>;
  lender_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  loanId?: InputMaybe<Scalars['String']>;
  loanId_?: InputMaybe<Loan_Filter>;
  loanId_contains?: InputMaybe<Scalars['String']>;
  loanId_contains_nocase?: InputMaybe<Scalars['String']>;
  loanId_ends_with?: InputMaybe<Scalars['String']>;
  loanId_ends_with_nocase?: InputMaybe<Scalars['String']>;
  loanId_gt?: InputMaybe<Scalars['String']>;
  loanId_gte?: InputMaybe<Scalars['String']>;
  loanId_in?: InputMaybe<Array<Scalars['String']>>;
  loanId_lt?: InputMaybe<Scalars['String']>;
  loanId_lte?: InputMaybe<Scalars['String']>;
  loanId_not?: InputMaybe<Scalars['String']>;
  loanId_not_contains?: InputMaybe<Scalars['String']>;
  loanId_not_contains_nocase?: InputMaybe<Scalars['String']>;
  loanId_not_ends_with?: InputMaybe<Scalars['String']>;
  loanId_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  loanId_not_in?: InputMaybe<Array<Scalars['String']>>;
  loanId_not_starts_with?: InputMaybe<Scalars['String']>;
  loanId_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  loanId_starts_with?: InputMaybe<Scalars['String']>;
  loanId_starts_with_nocase?: InputMaybe<Scalars['String']>;
  loanToken?: InputMaybe<Scalars['Bytes']>;
  loanToken_contains?: InputMaybe<Scalars['Bytes']>;
  loanToken_in?: InputMaybe<Array<Scalars['Bytes']>>;
  loanToken_not?: InputMaybe<Scalars['Bytes']>;
  loanToken_not_contains?: InputMaybe<Scalars['Bytes']>;
  loanToken_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  repayAmount?: InputMaybe<Scalars['BigDecimal']>;
  repayAmount_gt?: InputMaybe<Scalars['BigDecimal']>;
  repayAmount_gte?: InputMaybe<Scalars['BigDecimal']>;
  repayAmount_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  repayAmount_lt?: InputMaybe<Scalars['BigDecimal']>;
  repayAmount_lte?: InputMaybe<Scalars['BigDecimal']>;
  repayAmount_not?: InputMaybe<Scalars['BigDecimal']>;
  repayAmount_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  timestamp?: InputMaybe<Scalars['Int']>;
  timestamp_gt?: InputMaybe<Scalars['Int']>;
  timestamp_gte?: InputMaybe<Scalars['Int']>;
  timestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp_lt?: InputMaybe<Scalars['Int']>;
  timestamp_lte?: InputMaybe<Scalars['Int']>;
  timestamp_not?: InputMaybe<Scalars['Int']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
  transaction?: InputMaybe<Scalars['String']>;
  transaction_?: InputMaybe<Transaction_Filter>;
  transaction_contains?: InputMaybe<Scalars['String']>;
  transaction_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_gt?: InputMaybe<Scalars['String']>;
  transaction_gte?: InputMaybe<Scalars['String']>;
  transaction_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_lt?: InputMaybe<Scalars['String']>;
  transaction_lte?: InputMaybe<Scalars['String']>;
  transaction_not?: InputMaybe<Scalars['String']>;
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_not_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
  transaction_starts_with_nocase?: InputMaybe<Scalars['String']>;
  user?: InputMaybe<Scalars['Bytes']>;
  user_contains?: InputMaybe<Scalars['Bytes']>;
  user_in?: InputMaybe<Array<Scalars['Bytes']>>;
  user_not?: InputMaybe<Scalars['Bytes']>;
  user_not_contains?: InputMaybe<Scalars['Bytes']>;
  user_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum CloseWithDeposit_OrderBy {
  Closer = 'closer',
  CollateralToLoanRate = 'collateralToLoanRate',
  CollateralToken = 'collateralToken',
  CollateralWithdrawAmount = 'collateralWithdrawAmount',
  CurrentMargin = 'currentMargin',
  EmittedBy = 'emittedBy',
  Id = 'id',
  Lender = 'lender',
  LoanId = 'loanId',
  LoanToken = 'loanToken',
  RepayAmount = 'repayAmount',
  Timestamp = 'timestamp',
  Transaction = 'transaction',
  User = 'user',
}

/**
 * Granular event data for the Loan entity. Emitted when a user closes a loan initiated by a Margin Trade
 *
 */
export type CloseWithSwap = {
  __typename?: 'CloseWithSwap';
  closer: Scalars['Bytes'];
  collateralToken: Scalars['Bytes'];
  /**
   * Leverage on the smart contract does not count user-provided collateral.
   * So, what would on the dapp be a 2x leverage trade would be a 1 here
   *
   */
  currentLeverage: Scalars['BigDecimal'];
  emittedBy: Scalars['Bytes'];
  exitPrice: Scalars['BigDecimal'];
  id: Scalars['ID'];
  lender: Scalars['Bytes'];
  loanCloseAmount: Scalars['BigDecimal'];
  loanId: Loan;
  loanToken: Scalars['Bytes'];
  positionCloseSize: Scalars['BigDecimal'];
  timestamp: Scalars['Int'];
  transaction: Transaction;
  user: Scalars['Bytes'];
};

export type CloseWithSwap_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  closer?: InputMaybe<Scalars['Bytes']>;
  closer_contains?: InputMaybe<Scalars['Bytes']>;
  closer_in?: InputMaybe<Array<Scalars['Bytes']>>;
  closer_not?: InputMaybe<Scalars['Bytes']>;
  closer_not_contains?: InputMaybe<Scalars['Bytes']>;
  closer_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  collateralToken?: InputMaybe<Scalars['Bytes']>;
  collateralToken_contains?: InputMaybe<Scalars['Bytes']>;
  collateralToken_in?: InputMaybe<Array<Scalars['Bytes']>>;
  collateralToken_not?: InputMaybe<Scalars['Bytes']>;
  collateralToken_not_contains?: InputMaybe<Scalars['Bytes']>;
  collateralToken_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  currentLeverage?: InputMaybe<Scalars['BigDecimal']>;
  currentLeverage_gt?: InputMaybe<Scalars['BigDecimal']>;
  currentLeverage_gte?: InputMaybe<Scalars['BigDecimal']>;
  currentLeverage_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  currentLeverage_lt?: InputMaybe<Scalars['BigDecimal']>;
  currentLeverage_lte?: InputMaybe<Scalars['BigDecimal']>;
  currentLeverage_not?: InputMaybe<Scalars['BigDecimal']>;
  currentLeverage_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  emittedBy?: InputMaybe<Scalars['Bytes']>;
  emittedBy_contains?: InputMaybe<Scalars['Bytes']>;
  emittedBy_in?: InputMaybe<Array<Scalars['Bytes']>>;
  emittedBy_not?: InputMaybe<Scalars['Bytes']>;
  emittedBy_not_contains?: InputMaybe<Scalars['Bytes']>;
  emittedBy_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  exitPrice?: InputMaybe<Scalars['BigDecimal']>;
  exitPrice_gt?: InputMaybe<Scalars['BigDecimal']>;
  exitPrice_gte?: InputMaybe<Scalars['BigDecimal']>;
  exitPrice_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  exitPrice_lt?: InputMaybe<Scalars['BigDecimal']>;
  exitPrice_lte?: InputMaybe<Scalars['BigDecimal']>;
  exitPrice_not?: InputMaybe<Scalars['BigDecimal']>;
  exitPrice_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  lender?: InputMaybe<Scalars['Bytes']>;
  lender_contains?: InputMaybe<Scalars['Bytes']>;
  lender_in?: InputMaybe<Array<Scalars['Bytes']>>;
  lender_not?: InputMaybe<Scalars['Bytes']>;
  lender_not_contains?: InputMaybe<Scalars['Bytes']>;
  lender_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  loanCloseAmount?: InputMaybe<Scalars['BigDecimal']>;
  loanCloseAmount_gt?: InputMaybe<Scalars['BigDecimal']>;
  loanCloseAmount_gte?: InputMaybe<Scalars['BigDecimal']>;
  loanCloseAmount_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  loanCloseAmount_lt?: InputMaybe<Scalars['BigDecimal']>;
  loanCloseAmount_lte?: InputMaybe<Scalars['BigDecimal']>;
  loanCloseAmount_not?: InputMaybe<Scalars['BigDecimal']>;
  loanCloseAmount_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  loanId?: InputMaybe<Scalars['String']>;
  loanId_?: InputMaybe<Loan_Filter>;
  loanId_contains?: InputMaybe<Scalars['String']>;
  loanId_contains_nocase?: InputMaybe<Scalars['String']>;
  loanId_ends_with?: InputMaybe<Scalars['String']>;
  loanId_ends_with_nocase?: InputMaybe<Scalars['String']>;
  loanId_gt?: InputMaybe<Scalars['String']>;
  loanId_gte?: InputMaybe<Scalars['String']>;
  loanId_in?: InputMaybe<Array<Scalars['String']>>;
  loanId_lt?: InputMaybe<Scalars['String']>;
  loanId_lte?: InputMaybe<Scalars['String']>;
  loanId_not?: InputMaybe<Scalars['String']>;
  loanId_not_contains?: InputMaybe<Scalars['String']>;
  loanId_not_contains_nocase?: InputMaybe<Scalars['String']>;
  loanId_not_ends_with?: InputMaybe<Scalars['String']>;
  loanId_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  loanId_not_in?: InputMaybe<Array<Scalars['String']>>;
  loanId_not_starts_with?: InputMaybe<Scalars['String']>;
  loanId_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  loanId_starts_with?: InputMaybe<Scalars['String']>;
  loanId_starts_with_nocase?: InputMaybe<Scalars['String']>;
  loanToken?: InputMaybe<Scalars['Bytes']>;
  loanToken_contains?: InputMaybe<Scalars['Bytes']>;
  loanToken_in?: InputMaybe<Array<Scalars['Bytes']>>;
  loanToken_not?: InputMaybe<Scalars['Bytes']>;
  loanToken_not_contains?: InputMaybe<Scalars['Bytes']>;
  loanToken_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  positionCloseSize?: InputMaybe<Scalars['BigDecimal']>;
  positionCloseSize_gt?: InputMaybe<Scalars['BigDecimal']>;
  positionCloseSize_gte?: InputMaybe<Scalars['BigDecimal']>;
  positionCloseSize_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  positionCloseSize_lt?: InputMaybe<Scalars['BigDecimal']>;
  positionCloseSize_lte?: InputMaybe<Scalars['BigDecimal']>;
  positionCloseSize_not?: InputMaybe<Scalars['BigDecimal']>;
  positionCloseSize_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  timestamp?: InputMaybe<Scalars['Int']>;
  timestamp_gt?: InputMaybe<Scalars['Int']>;
  timestamp_gte?: InputMaybe<Scalars['Int']>;
  timestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp_lt?: InputMaybe<Scalars['Int']>;
  timestamp_lte?: InputMaybe<Scalars['Int']>;
  timestamp_not?: InputMaybe<Scalars['Int']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
  transaction?: InputMaybe<Scalars['String']>;
  transaction_?: InputMaybe<Transaction_Filter>;
  transaction_contains?: InputMaybe<Scalars['String']>;
  transaction_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_gt?: InputMaybe<Scalars['String']>;
  transaction_gte?: InputMaybe<Scalars['String']>;
  transaction_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_lt?: InputMaybe<Scalars['String']>;
  transaction_lte?: InputMaybe<Scalars['String']>;
  transaction_not?: InputMaybe<Scalars['String']>;
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_not_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
  transaction_starts_with_nocase?: InputMaybe<Scalars['String']>;
  user?: InputMaybe<Scalars['Bytes']>;
  user_contains?: InputMaybe<Scalars['Bytes']>;
  user_in?: InputMaybe<Array<Scalars['Bytes']>>;
  user_not?: InputMaybe<Scalars['Bytes']>;
  user_not_contains?: InputMaybe<Scalars['Bytes']>;
  user_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum CloseWithSwap_OrderBy {
  Closer = 'closer',
  CollateralToken = 'collateralToken',
  CurrentLeverage = 'currentLeverage',
  EmittedBy = 'emittedBy',
  ExitPrice = 'exitPrice',
  Id = 'id',
  Lender = 'lender',
  LoanCloseAmount = 'loanCloseAmount',
  LoanId = 'loanId',
  LoanToken = 'loanToken',
  PositionCloseSize = 'positionCloseSize',
  Timestamp = 'timestamp',
  Transaction = 'transaction',
  User = 'user',
}

/**
 * Granular Conversion events, exactly as they appear on the contracts.
 * These events are the raw data that the Swap entity and candlestick entities are built from.
 *
 */
export type Conversion = {
  __typename?: 'Conversion';
  _amount: Scalars['BigDecimal'];
  _conversionFee: Scalars['BigDecimal'];
  _fromToken: Token;
  _protocolFee: Scalars['BigDecimal'];
  _return: Scalars['BigDecimal'];
  _toToken: Token;
  _trader: Scalars['Bytes'];
  blockNumber: Scalars['Int'];
  emittedBy: LiquidityPool;
  id: Scalars['ID'];
  timestamp: Scalars['Int'];
  transaction: Transaction;
};

export type Conversion_Filter = {
  _amount?: InputMaybe<Scalars['BigDecimal']>;
  _amount_gt?: InputMaybe<Scalars['BigDecimal']>;
  _amount_gte?: InputMaybe<Scalars['BigDecimal']>;
  _amount_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  _amount_lt?: InputMaybe<Scalars['BigDecimal']>;
  _amount_lte?: InputMaybe<Scalars['BigDecimal']>;
  _amount_not?: InputMaybe<Scalars['BigDecimal']>;
  _amount_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  _conversionFee?: InputMaybe<Scalars['BigDecimal']>;
  _conversionFee_gt?: InputMaybe<Scalars['BigDecimal']>;
  _conversionFee_gte?: InputMaybe<Scalars['BigDecimal']>;
  _conversionFee_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  _conversionFee_lt?: InputMaybe<Scalars['BigDecimal']>;
  _conversionFee_lte?: InputMaybe<Scalars['BigDecimal']>;
  _conversionFee_not?: InputMaybe<Scalars['BigDecimal']>;
  _conversionFee_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  _fromToken?: InputMaybe<Scalars['String']>;
  _fromToken_?: InputMaybe<Token_Filter>;
  _fromToken_contains?: InputMaybe<Scalars['String']>;
  _fromToken_contains_nocase?: InputMaybe<Scalars['String']>;
  _fromToken_ends_with?: InputMaybe<Scalars['String']>;
  _fromToken_ends_with_nocase?: InputMaybe<Scalars['String']>;
  _fromToken_gt?: InputMaybe<Scalars['String']>;
  _fromToken_gte?: InputMaybe<Scalars['String']>;
  _fromToken_in?: InputMaybe<Array<Scalars['String']>>;
  _fromToken_lt?: InputMaybe<Scalars['String']>;
  _fromToken_lte?: InputMaybe<Scalars['String']>;
  _fromToken_not?: InputMaybe<Scalars['String']>;
  _fromToken_not_contains?: InputMaybe<Scalars['String']>;
  _fromToken_not_contains_nocase?: InputMaybe<Scalars['String']>;
  _fromToken_not_ends_with?: InputMaybe<Scalars['String']>;
  _fromToken_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  _fromToken_not_in?: InputMaybe<Array<Scalars['String']>>;
  _fromToken_not_starts_with?: InputMaybe<Scalars['String']>;
  _fromToken_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  _fromToken_starts_with?: InputMaybe<Scalars['String']>;
  _fromToken_starts_with_nocase?: InputMaybe<Scalars['String']>;
  _protocolFee?: InputMaybe<Scalars['BigDecimal']>;
  _protocolFee_gt?: InputMaybe<Scalars['BigDecimal']>;
  _protocolFee_gte?: InputMaybe<Scalars['BigDecimal']>;
  _protocolFee_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  _protocolFee_lt?: InputMaybe<Scalars['BigDecimal']>;
  _protocolFee_lte?: InputMaybe<Scalars['BigDecimal']>;
  _protocolFee_not?: InputMaybe<Scalars['BigDecimal']>;
  _protocolFee_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  _return?: InputMaybe<Scalars['BigDecimal']>;
  _return_gt?: InputMaybe<Scalars['BigDecimal']>;
  _return_gte?: InputMaybe<Scalars['BigDecimal']>;
  _return_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  _return_lt?: InputMaybe<Scalars['BigDecimal']>;
  _return_lte?: InputMaybe<Scalars['BigDecimal']>;
  _return_not?: InputMaybe<Scalars['BigDecimal']>;
  _return_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  _toToken?: InputMaybe<Scalars['String']>;
  _toToken_?: InputMaybe<Token_Filter>;
  _toToken_contains?: InputMaybe<Scalars['String']>;
  _toToken_contains_nocase?: InputMaybe<Scalars['String']>;
  _toToken_ends_with?: InputMaybe<Scalars['String']>;
  _toToken_ends_with_nocase?: InputMaybe<Scalars['String']>;
  _toToken_gt?: InputMaybe<Scalars['String']>;
  _toToken_gte?: InputMaybe<Scalars['String']>;
  _toToken_in?: InputMaybe<Array<Scalars['String']>>;
  _toToken_lt?: InputMaybe<Scalars['String']>;
  _toToken_lte?: InputMaybe<Scalars['String']>;
  _toToken_not?: InputMaybe<Scalars['String']>;
  _toToken_not_contains?: InputMaybe<Scalars['String']>;
  _toToken_not_contains_nocase?: InputMaybe<Scalars['String']>;
  _toToken_not_ends_with?: InputMaybe<Scalars['String']>;
  _toToken_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  _toToken_not_in?: InputMaybe<Array<Scalars['String']>>;
  _toToken_not_starts_with?: InputMaybe<Scalars['String']>;
  _toToken_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  _toToken_starts_with?: InputMaybe<Scalars['String']>;
  _toToken_starts_with_nocase?: InputMaybe<Scalars['String']>;
  _trader?: InputMaybe<Scalars['Bytes']>;
  _trader_contains?: InputMaybe<Scalars['Bytes']>;
  _trader_in?: InputMaybe<Array<Scalars['Bytes']>>;
  _trader_not?: InputMaybe<Scalars['Bytes']>;
  _trader_not_contains?: InputMaybe<Scalars['Bytes']>;
  _trader_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  blockNumber?: InputMaybe<Scalars['Int']>;
  blockNumber_gt?: InputMaybe<Scalars['Int']>;
  blockNumber_gte?: InputMaybe<Scalars['Int']>;
  blockNumber_in?: InputMaybe<Array<Scalars['Int']>>;
  blockNumber_lt?: InputMaybe<Scalars['Int']>;
  blockNumber_lte?: InputMaybe<Scalars['Int']>;
  blockNumber_not?: InputMaybe<Scalars['Int']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['Int']>>;
  emittedBy?: InputMaybe<Scalars['String']>;
  emittedBy_?: InputMaybe<LiquidityPool_Filter>;
  emittedBy_contains?: InputMaybe<Scalars['String']>;
  emittedBy_contains_nocase?: InputMaybe<Scalars['String']>;
  emittedBy_ends_with?: InputMaybe<Scalars['String']>;
  emittedBy_ends_with_nocase?: InputMaybe<Scalars['String']>;
  emittedBy_gt?: InputMaybe<Scalars['String']>;
  emittedBy_gte?: InputMaybe<Scalars['String']>;
  emittedBy_in?: InputMaybe<Array<Scalars['String']>>;
  emittedBy_lt?: InputMaybe<Scalars['String']>;
  emittedBy_lte?: InputMaybe<Scalars['String']>;
  emittedBy_not?: InputMaybe<Scalars['String']>;
  emittedBy_not_contains?: InputMaybe<Scalars['String']>;
  emittedBy_not_contains_nocase?: InputMaybe<Scalars['String']>;
  emittedBy_not_ends_with?: InputMaybe<Scalars['String']>;
  emittedBy_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  emittedBy_not_in?: InputMaybe<Array<Scalars['String']>>;
  emittedBy_not_starts_with?: InputMaybe<Scalars['String']>;
  emittedBy_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  emittedBy_starts_with?: InputMaybe<Scalars['String']>;
  emittedBy_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  timestamp?: InputMaybe<Scalars['Int']>;
  timestamp_gt?: InputMaybe<Scalars['Int']>;
  timestamp_gte?: InputMaybe<Scalars['Int']>;
  timestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp_lt?: InputMaybe<Scalars['Int']>;
  timestamp_lte?: InputMaybe<Scalars['Int']>;
  timestamp_not?: InputMaybe<Scalars['Int']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
  transaction?: InputMaybe<Scalars['String']>;
  transaction_?: InputMaybe<Transaction_Filter>;
  transaction_contains?: InputMaybe<Scalars['String']>;
  transaction_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_gt?: InputMaybe<Scalars['String']>;
  transaction_gte?: InputMaybe<Scalars['String']>;
  transaction_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_lt?: InputMaybe<Scalars['String']>;
  transaction_lte?: InputMaybe<Scalars['String']>;
  transaction_not?: InputMaybe<Scalars['String']>;
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_not_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
  transaction_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum Conversion_OrderBy {
  Amount = '_amount',
  ConversionFee = '_conversionFee',
  FromToken = '_fromToken',
  ProtocolFee = '_protocolFee',
  Return = '_return',
  ToToken = '_toToken',
  Trader = '_trader',
  BlockNumber = 'blockNumber',
  EmittedBy = 'emittedBy',
  Id = 'id',
  Timestamp = 'timestamp',
  Transaction = 'transaction',
}

/**
 * The ConverterRegistry registers each new AMM pool added to the Sovryn Protocol
 *
 */
export type ConverterRegistry = {
  __typename?: 'ConverterRegistry';
  /**
   * All ERC20 tokens in this registry
   *
   */
  connectorTokens?: Maybe<Array<Token>>;
  /**
   * All the converters (AMM pools) associated with this registry
   *
   */
  converters?: Maybe<Array<LiquidityPool>>;
  /**
   * ID is the address of the converter registry contract
   *
   */
  id: Scalars['ID'];
  /**
   * The number of active converters (AMM pools) in this registry
   *
   */
  numConverters: Scalars['Int'];
  /**
   * All smart tokens in this registry
   *
   */
  smartTokens?: Maybe<Array<SmartToken>>;
};

/**
 * The ConverterRegistry registers each new AMM pool added to the Sovryn Protocol
 *
 */
export type ConverterRegistryConnectorTokensArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Token_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Token_Filter>;
};

/**
 * The ConverterRegistry registers each new AMM pool added to the Sovryn Protocol
 *
 */
export type ConverterRegistryConvertersArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<LiquidityPool_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<LiquidityPool_Filter>;
};

/**
 * The ConverterRegistry registers each new AMM pool added to the Sovryn Protocol
 *
 */
export type ConverterRegistrySmartTokensArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<SmartToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<SmartToken_Filter>;
};

export type ConverterRegistry_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  connectorTokens_?: InputMaybe<Token_Filter>;
  converters_?: InputMaybe<LiquidityPool_Filter>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  numConverters?: InputMaybe<Scalars['Int']>;
  numConverters_gt?: InputMaybe<Scalars['Int']>;
  numConverters_gte?: InputMaybe<Scalars['Int']>;
  numConverters_in?: InputMaybe<Array<Scalars['Int']>>;
  numConverters_lt?: InputMaybe<Scalars['Int']>;
  numConverters_lte?: InputMaybe<Scalars['Int']>;
  numConverters_not?: InputMaybe<Scalars['Int']>;
  numConverters_not_in?: InputMaybe<Array<Scalars['Int']>>;
  smartTokens_?: InputMaybe<SmartToken_Filter>;
};

export enum ConverterRegistry_OrderBy {
  ConnectorTokens = 'connectorTokens',
  Converters = 'converters',
  Id = 'id',
  NumConverters = 'numConverters',
  SmartTokens = 'smartTokens',
}

export enum CrossDirection {
  Incoming = 'Incoming',
  Outgoing = 'Outgoing',
}

export enum CrossStatus {
  Executed = 'Executed',
  Revoked = 'Revoked',
  Voting = 'Voting',
}

export type CrossTransfer = {
  __typename?: 'CrossTransfer';
  /**
   * Amount - the amount of originalToken transferred across the bridge
   *
   */
  amount: Scalars['BigDecimal'];
  /**
   * CreatedAtTimestamp - the timestamp at which this transfer was created
   *
   */
  createdAtTimestamp: Scalars['Int'];
  /**
   * CreatedAtTx - the transaction at which this transfer was created
   *
   */
  createdAtTx: Transaction;
  /**
   * Direction - the direction of the cross transfer (Incoming or Outgoing)
   *
   */
  direction: CrossDirection;
  /**
   * sourceChain - the source chain - for outgoing it is RSK and for incoming it is BSC/ETH
   *
   */
  externalChain: BridgeChain;
  /**
   * Address of the user on the external chain (eg Ethereum, BSC etc.)
   *
   */
  externalUser?: Maybe<Scalars['Bytes']>;
  /**
   * Id - the cross transfer Id - for outgoing it is generated from the cross event params for incoming it is coming from the federation events
   *
   */
  id: Scalars['ID'];
  /**
   * IsSigned - is this transfer signed by the federation contract (only relevant for the new federation contracts)
   *
   */
  isSigned: Scalars['Boolean'];
  /**
   * originalTokenAddress - the original token address for the transfer (for outgoing it is just the RSK token address)
   *
   */
  originalTokenAddress: Scalars['Bytes'];
  /**
   * sideToken - the SideToken entity if exist of original token address
   *
   */
  sideToken?: Maybe<SideToken>;
  /**
   * SourceChainBlockHash - the source chain block hash of the transfer, for outgoing transfers this is just the RSK block hash
   *
   */
  sourceChainBlockHash?: Maybe<Scalars['Bytes']>;
  /**
   * SourceChainTransactionHash - the source chain transaction hash of the transfer, for outgoing transfers this is just the RSK transaction hash
   *
   */
  sourceChainTransactionHash?: Maybe<Scalars['Bytes']>;
  /**
   * Status - transfer status - Voting, Executed, Revoked
   *
   */
  status: CrossStatus;
  /**
   * Symbol - the token symbol
   *
   */
  symbol?: Maybe<Scalars['String']>;
  /**
   * Token - the token entity if exist of original token address
   *
   */
  token?: Maybe<Token>;
  /**
   * TokenAddress - the token address for the transfer (only relevant for incoming transfers)
   *
   */
  tokenAddress?: Maybe<Scalars['Bytes']>;
  /**
   * updatedAtTimestamp - the timestamp at which this transfer was last updated
   *
   */
  updatedAtTimestamp: Scalars['Int'];
  /**
   * updatedAtTx - the transaction at which this transfer was last updated
   *
   */
  updatedAtTx: Transaction;
  /**
   * Address of the user on RSK chain
   *
   */
  user: User;
  /**
   * Votes - Number of votes cast for this transfer
   *
   */
  votes?: Maybe<Scalars['Int']>;
};

export type CrossTransfer_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars['BigDecimal']>;
  amount_gt?: InputMaybe<Scalars['BigDecimal']>;
  amount_gte?: InputMaybe<Scalars['BigDecimal']>;
  amount_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  amount_lt?: InputMaybe<Scalars['BigDecimal']>;
  amount_lte?: InputMaybe<Scalars['BigDecimal']>;
  amount_not?: InputMaybe<Scalars['BigDecimal']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  createdAtTimestamp?: InputMaybe<Scalars['Int']>;
  createdAtTimestamp_gt?: InputMaybe<Scalars['Int']>;
  createdAtTimestamp_gte?: InputMaybe<Scalars['Int']>;
  createdAtTimestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  createdAtTimestamp_lt?: InputMaybe<Scalars['Int']>;
  createdAtTimestamp_lte?: InputMaybe<Scalars['Int']>;
  createdAtTimestamp_not?: InputMaybe<Scalars['Int']>;
  createdAtTimestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
  createdAtTx?: InputMaybe<Scalars['String']>;
  createdAtTx_?: InputMaybe<Transaction_Filter>;
  createdAtTx_contains?: InputMaybe<Scalars['String']>;
  createdAtTx_contains_nocase?: InputMaybe<Scalars['String']>;
  createdAtTx_ends_with?: InputMaybe<Scalars['String']>;
  createdAtTx_ends_with_nocase?: InputMaybe<Scalars['String']>;
  createdAtTx_gt?: InputMaybe<Scalars['String']>;
  createdAtTx_gte?: InputMaybe<Scalars['String']>;
  createdAtTx_in?: InputMaybe<Array<Scalars['String']>>;
  createdAtTx_lt?: InputMaybe<Scalars['String']>;
  createdAtTx_lte?: InputMaybe<Scalars['String']>;
  createdAtTx_not?: InputMaybe<Scalars['String']>;
  createdAtTx_not_contains?: InputMaybe<Scalars['String']>;
  createdAtTx_not_contains_nocase?: InputMaybe<Scalars['String']>;
  createdAtTx_not_ends_with?: InputMaybe<Scalars['String']>;
  createdAtTx_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  createdAtTx_not_in?: InputMaybe<Array<Scalars['String']>>;
  createdAtTx_not_starts_with?: InputMaybe<Scalars['String']>;
  createdAtTx_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  createdAtTx_starts_with?: InputMaybe<Scalars['String']>;
  createdAtTx_starts_with_nocase?: InputMaybe<Scalars['String']>;
  direction?: InputMaybe<CrossDirection>;
  direction_in?: InputMaybe<Array<CrossDirection>>;
  direction_not?: InputMaybe<CrossDirection>;
  direction_not_in?: InputMaybe<Array<CrossDirection>>;
  externalChain?: InputMaybe<BridgeChain>;
  externalChain_in?: InputMaybe<Array<BridgeChain>>;
  externalChain_not?: InputMaybe<BridgeChain>;
  externalChain_not_in?: InputMaybe<Array<BridgeChain>>;
  externalUser?: InputMaybe<Scalars['Bytes']>;
  externalUser_contains?: InputMaybe<Scalars['Bytes']>;
  externalUser_in?: InputMaybe<Array<Scalars['Bytes']>>;
  externalUser_not?: InputMaybe<Scalars['Bytes']>;
  externalUser_not_contains?: InputMaybe<Scalars['Bytes']>;
  externalUser_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  isSigned?: InputMaybe<Scalars['Boolean']>;
  isSigned_in?: InputMaybe<Array<Scalars['Boolean']>>;
  isSigned_not?: InputMaybe<Scalars['Boolean']>;
  isSigned_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  originalTokenAddress?: InputMaybe<Scalars['Bytes']>;
  originalTokenAddress_contains?: InputMaybe<Scalars['Bytes']>;
  originalTokenAddress_in?: InputMaybe<Array<Scalars['Bytes']>>;
  originalTokenAddress_not?: InputMaybe<Scalars['Bytes']>;
  originalTokenAddress_not_contains?: InputMaybe<Scalars['Bytes']>;
  originalTokenAddress_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  sideToken?: InputMaybe<Scalars['String']>;
  sideToken_?: InputMaybe<SideToken_Filter>;
  sideToken_contains?: InputMaybe<Scalars['String']>;
  sideToken_contains_nocase?: InputMaybe<Scalars['String']>;
  sideToken_ends_with?: InputMaybe<Scalars['String']>;
  sideToken_ends_with_nocase?: InputMaybe<Scalars['String']>;
  sideToken_gt?: InputMaybe<Scalars['String']>;
  sideToken_gte?: InputMaybe<Scalars['String']>;
  sideToken_in?: InputMaybe<Array<Scalars['String']>>;
  sideToken_lt?: InputMaybe<Scalars['String']>;
  sideToken_lte?: InputMaybe<Scalars['String']>;
  sideToken_not?: InputMaybe<Scalars['String']>;
  sideToken_not_contains?: InputMaybe<Scalars['String']>;
  sideToken_not_contains_nocase?: InputMaybe<Scalars['String']>;
  sideToken_not_ends_with?: InputMaybe<Scalars['String']>;
  sideToken_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  sideToken_not_in?: InputMaybe<Array<Scalars['String']>>;
  sideToken_not_starts_with?: InputMaybe<Scalars['String']>;
  sideToken_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  sideToken_starts_with?: InputMaybe<Scalars['String']>;
  sideToken_starts_with_nocase?: InputMaybe<Scalars['String']>;
  sourceChainBlockHash?: InputMaybe<Scalars['Bytes']>;
  sourceChainBlockHash_contains?: InputMaybe<Scalars['Bytes']>;
  sourceChainBlockHash_in?: InputMaybe<Array<Scalars['Bytes']>>;
  sourceChainBlockHash_not?: InputMaybe<Scalars['Bytes']>;
  sourceChainBlockHash_not_contains?: InputMaybe<Scalars['Bytes']>;
  sourceChainBlockHash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  sourceChainTransactionHash?: InputMaybe<Scalars['Bytes']>;
  sourceChainTransactionHash_contains?: InputMaybe<Scalars['Bytes']>;
  sourceChainTransactionHash_in?: InputMaybe<Array<Scalars['Bytes']>>;
  sourceChainTransactionHash_not?: InputMaybe<Scalars['Bytes']>;
  sourceChainTransactionHash_not_contains?: InputMaybe<Scalars['Bytes']>;
  sourceChainTransactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  status?: InputMaybe<CrossStatus>;
  status_in?: InputMaybe<Array<CrossStatus>>;
  status_not?: InputMaybe<CrossStatus>;
  status_not_in?: InputMaybe<Array<CrossStatus>>;
  symbol?: InputMaybe<Scalars['String']>;
  symbol_contains?: InputMaybe<Scalars['String']>;
  symbol_contains_nocase?: InputMaybe<Scalars['String']>;
  symbol_ends_with?: InputMaybe<Scalars['String']>;
  symbol_ends_with_nocase?: InputMaybe<Scalars['String']>;
  symbol_gt?: InputMaybe<Scalars['String']>;
  symbol_gte?: InputMaybe<Scalars['String']>;
  symbol_in?: InputMaybe<Array<Scalars['String']>>;
  symbol_lt?: InputMaybe<Scalars['String']>;
  symbol_lte?: InputMaybe<Scalars['String']>;
  symbol_not?: InputMaybe<Scalars['String']>;
  symbol_not_contains?: InputMaybe<Scalars['String']>;
  symbol_not_contains_nocase?: InputMaybe<Scalars['String']>;
  symbol_not_ends_with?: InputMaybe<Scalars['String']>;
  symbol_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  symbol_not_in?: InputMaybe<Array<Scalars['String']>>;
  symbol_not_starts_with?: InputMaybe<Scalars['String']>;
  symbol_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  symbol_starts_with?: InputMaybe<Scalars['String']>;
  symbol_starts_with_nocase?: InputMaybe<Scalars['String']>;
  token?: InputMaybe<Scalars['String']>;
  tokenAddress?: InputMaybe<Scalars['Bytes']>;
  tokenAddress_contains?: InputMaybe<Scalars['Bytes']>;
  tokenAddress_in?: InputMaybe<Array<Scalars['Bytes']>>;
  tokenAddress_not?: InputMaybe<Scalars['Bytes']>;
  tokenAddress_not_contains?: InputMaybe<Scalars['Bytes']>;
  tokenAddress_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  token_?: InputMaybe<Token_Filter>;
  token_contains?: InputMaybe<Scalars['String']>;
  token_contains_nocase?: InputMaybe<Scalars['String']>;
  token_ends_with?: InputMaybe<Scalars['String']>;
  token_ends_with_nocase?: InputMaybe<Scalars['String']>;
  token_gt?: InputMaybe<Scalars['String']>;
  token_gte?: InputMaybe<Scalars['String']>;
  token_in?: InputMaybe<Array<Scalars['String']>>;
  token_lt?: InputMaybe<Scalars['String']>;
  token_lte?: InputMaybe<Scalars['String']>;
  token_not?: InputMaybe<Scalars['String']>;
  token_not_contains?: InputMaybe<Scalars['String']>;
  token_not_contains_nocase?: InputMaybe<Scalars['String']>;
  token_not_ends_with?: InputMaybe<Scalars['String']>;
  token_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  token_not_in?: InputMaybe<Array<Scalars['String']>>;
  token_not_starts_with?: InputMaybe<Scalars['String']>;
  token_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  token_starts_with?: InputMaybe<Scalars['String']>;
  token_starts_with_nocase?: InputMaybe<Scalars['String']>;
  updatedAtTimestamp?: InputMaybe<Scalars['Int']>;
  updatedAtTimestamp_gt?: InputMaybe<Scalars['Int']>;
  updatedAtTimestamp_gte?: InputMaybe<Scalars['Int']>;
  updatedAtTimestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  updatedAtTimestamp_lt?: InputMaybe<Scalars['Int']>;
  updatedAtTimestamp_lte?: InputMaybe<Scalars['Int']>;
  updatedAtTimestamp_not?: InputMaybe<Scalars['Int']>;
  updatedAtTimestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
  updatedAtTx?: InputMaybe<Scalars['String']>;
  updatedAtTx_?: InputMaybe<Transaction_Filter>;
  updatedAtTx_contains?: InputMaybe<Scalars['String']>;
  updatedAtTx_contains_nocase?: InputMaybe<Scalars['String']>;
  updatedAtTx_ends_with?: InputMaybe<Scalars['String']>;
  updatedAtTx_ends_with_nocase?: InputMaybe<Scalars['String']>;
  updatedAtTx_gt?: InputMaybe<Scalars['String']>;
  updatedAtTx_gte?: InputMaybe<Scalars['String']>;
  updatedAtTx_in?: InputMaybe<Array<Scalars['String']>>;
  updatedAtTx_lt?: InputMaybe<Scalars['String']>;
  updatedAtTx_lte?: InputMaybe<Scalars['String']>;
  updatedAtTx_not?: InputMaybe<Scalars['String']>;
  updatedAtTx_not_contains?: InputMaybe<Scalars['String']>;
  updatedAtTx_not_contains_nocase?: InputMaybe<Scalars['String']>;
  updatedAtTx_not_ends_with?: InputMaybe<Scalars['String']>;
  updatedAtTx_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  updatedAtTx_not_in?: InputMaybe<Array<Scalars['String']>>;
  updatedAtTx_not_starts_with?: InputMaybe<Scalars['String']>;
  updatedAtTx_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  updatedAtTx_starts_with?: InputMaybe<Scalars['String']>;
  updatedAtTx_starts_with_nocase?: InputMaybe<Scalars['String']>;
  user?: InputMaybe<Scalars['String']>;
  user_?: InputMaybe<User_Filter>;
  user_contains?: InputMaybe<Scalars['String']>;
  user_contains_nocase?: InputMaybe<Scalars['String']>;
  user_ends_with?: InputMaybe<Scalars['String']>;
  user_ends_with_nocase?: InputMaybe<Scalars['String']>;
  user_gt?: InputMaybe<Scalars['String']>;
  user_gte?: InputMaybe<Scalars['String']>;
  user_in?: InputMaybe<Array<Scalars['String']>>;
  user_lt?: InputMaybe<Scalars['String']>;
  user_lte?: InputMaybe<Scalars['String']>;
  user_not?: InputMaybe<Scalars['String']>;
  user_not_contains?: InputMaybe<Scalars['String']>;
  user_not_contains_nocase?: InputMaybe<Scalars['String']>;
  user_not_ends_with?: InputMaybe<Scalars['String']>;
  user_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  user_not_in?: InputMaybe<Array<Scalars['String']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']>;
  user_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  user_starts_with?: InputMaybe<Scalars['String']>;
  user_starts_with_nocase?: InputMaybe<Scalars['String']>;
  votes?: InputMaybe<Scalars['Int']>;
  votes_gt?: InputMaybe<Scalars['Int']>;
  votes_gte?: InputMaybe<Scalars['Int']>;
  votes_in?: InputMaybe<Array<Scalars['Int']>>;
  votes_lt?: InputMaybe<Scalars['Int']>;
  votes_lte?: InputMaybe<Scalars['Int']>;
  votes_not?: InputMaybe<Scalars['Int']>;
  votes_not_in?: InputMaybe<Array<Scalars['Int']>>;
};

export enum CrossTransfer_OrderBy {
  Amount = 'amount',
  CreatedAtTimestamp = 'createdAtTimestamp',
  CreatedAtTx = 'createdAtTx',
  Direction = 'direction',
  ExternalChain = 'externalChain',
  ExternalUser = 'externalUser',
  Id = 'id',
  IsSigned = 'isSigned',
  OriginalTokenAddress = 'originalTokenAddress',
  SideToken = 'sideToken',
  SourceChainBlockHash = 'sourceChainBlockHash',
  SourceChainTransactionHash = 'sourceChainTransactionHash',
  Status = 'status',
  Symbol = 'symbol',
  Token = 'token',
  TokenAddress = 'tokenAddress',
  UpdatedAtTimestamp = 'updatedAtTimestamp',
  UpdatedAtTx = 'updatedAtTx',
  User = 'user',
  Votes = 'votes',
}

export type DebugItem = {
  __typename?: 'DebugItem';
  amount?: Maybe<Scalars['BigDecimal']>;
  emittedBy: Scalars['Bytes'];
  formattedAmount?: Maybe<Scalars['BigDecimal']>;
  id: Scalars['ID'];
  timestamp: Scalars['Int'];
  totalStaked?: Maybe<Scalars['BigDecimal']>;
  totalVested?: Maybe<Scalars['BigDecimal']>;
  transaction: Transaction;
  type?: Maybe<Scalars['String']>;
};

export type DebugItem_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars['BigDecimal']>;
  amount_gt?: InputMaybe<Scalars['BigDecimal']>;
  amount_gte?: InputMaybe<Scalars['BigDecimal']>;
  amount_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  amount_lt?: InputMaybe<Scalars['BigDecimal']>;
  amount_lte?: InputMaybe<Scalars['BigDecimal']>;
  amount_not?: InputMaybe<Scalars['BigDecimal']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  emittedBy?: InputMaybe<Scalars['Bytes']>;
  emittedBy_contains?: InputMaybe<Scalars['Bytes']>;
  emittedBy_in?: InputMaybe<Array<Scalars['Bytes']>>;
  emittedBy_not?: InputMaybe<Scalars['Bytes']>;
  emittedBy_not_contains?: InputMaybe<Scalars['Bytes']>;
  emittedBy_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  formattedAmount?: InputMaybe<Scalars['BigDecimal']>;
  formattedAmount_gt?: InputMaybe<Scalars['BigDecimal']>;
  formattedAmount_gte?: InputMaybe<Scalars['BigDecimal']>;
  formattedAmount_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  formattedAmount_lt?: InputMaybe<Scalars['BigDecimal']>;
  formattedAmount_lte?: InputMaybe<Scalars['BigDecimal']>;
  formattedAmount_not?: InputMaybe<Scalars['BigDecimal']>;
  formattedAmount_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  timestamp?: InputMaybe<Scalars['Int']>;
  timestamp_gt?: InputMaybe<Scalars['Int']>;
  timestamp_gte?: InputMaybe<Scalars['Int']>;
  timestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp_lt?: InputMaybe<Scalars['Int']>;
  timestamp_lte?: InputMaybe<Scalars['Int']>;
  timestamp_not?: InputMaybe<Scalars['Int']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
  totalStaked?: InputMaybe<Scalars['BigDecimal']>;
  totalStaked_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalStaked_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalStaked_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalStaked_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalStaked_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalStaked_not?: InputMaybe<Scalars['BigDecimal']>;
  totalStaked_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalVested?: InputMaybe<Scalars['BigDecimal']>;
  totalVested_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalVested_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalVested_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalVested_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalVested_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalVested_not?: InputMaybe<Scalars['BigDecimal']>;
  totalVested_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  transaction?: InputMaybe<Scalars['String']>;
  transaction_?: InputMaybe<Transaction_Filter>;
  transaction_contains?: InputMaybe<Scalars['String']>;
  transaction_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_gt?: InputMaybe<Scalars['String']>;
  transaction_gte?: InputMaybe<Scalars['String']>;
  transaction_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_lt?: InputMaybe<Scalars['String']>;
  transaction_lte?: InputMaybe<Scalars['String']>;
  transaction_not?: InputMaybe<Scalars['String']>;
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_not_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
  transaction_starts_with_nocase?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
  type_contains?: InputMaybe<Scalars['String']>;
  type_contains_nocase?: InputMaybe<Scalars['String']>;
  type_ends_with?: InputMaybe<Scalars['String']>;
  type_ends_with_nocase?: InputMaybe<Scalars['String']>;
  type_gt?: InputMaybe<Scalars['String']>;
  type_gte?: InputMaybe<Scalars['String']>;
  type_in?: InputMaybe<Array<Scalars['String']>>;
  type_lt?: InputMaybe<Scalars['String']>;
  type_lte?: InputMaybe<Scalars['String']>;
  type_not?: InputMaybe<Scalars['String']>;
  type_not_contains?: InputMaybe<Scalars['String']>;
  type_not_contains_nocase?: InputMaybe<Scalars['String']>;
  type_not_ends_with?: InputMaybe<Scalars['String']>;
  type_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  type_not_in?: InputMaybe<Array<Scalars['String']>>;
  type_not_starts_with?: InputMaybe<Scalars['String']>;
  type_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  type_starts_with?: InputMaybe<Scalars['String']>;
  type_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum DebugItem_OrderBy {
  Amount = 'amount',
  EmittedBy = 'emittedBy',
  FormattedAmount = 'formattedAmount',
  Id = 'id',
  Timestamp = 'timestamp',
  TotalStaked = 'totalStaked',
  TotalVested = 'totalVested',
  Transaction = 'transaction',
  Type = 'type',
}

export type Deposit = {
  __typename?: 'Deposit';
  amount: Scalars['BigDecimal'];
  emittedBy: Scalars['Bytes'];
  id: Scalars['ID'];
  timestamp: Scalars['Int'];
  to: Scalars['Bytes'];
  transaction: Transaction;
};

/**
 * Granular event data for the Loan entity. Emitted when a user closes adds collateral to a Margin Trade or Borrow
 *
 */
export type DepositCollateral = {
  __typename?: 'DepositCollateral';
  depositAmount: Scalars['BigDecimal'];
  emittedBy: Scalars['Bytes'];
  id: Scalars['ID'];
  loanId: Loan;
  /**
   * Rate is sometimes null because this property was not included in older versions of the contract
   *
   */
  rate?: Maybe<Scalars['BigDecimal']>;
  timestamp: Scalars['Int'];
  transaction: Transaction;
};

export type DepositCollateral_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  depositAmount?: InputMaybe<Scalars['BigDecimal']>;
  depositAmount_gt?: InputMaybe<Scalars['BigDecimal']>;
  depositAmount_gte?: InputMaybe<Scalars['BigDecimal']>;
  depositAmount_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  depositAmount_lt?: InputMaybe<Scalars['BigDecimal']>;
  depositAmount_lte?: InputMaybe<Scalars['BigDecimal']>;
  depositAmount_not?: InputMaybe<Scalars['BigDecimal']>;
  depositAmount_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  emittedBy?: InputMaybe<Scalars['Bytes']>;
  emittedBy_contains?: InputMaybe<Scalars['Bytes']>;
  emittedBy_in?: InputMaybe<Array<Scalars['Bytes']>>;
  emittedBy_not?: InputMaybe<Scalars['Bytes']>;
  emittedBy_not_contains?: InputMaybe<Scalars['Bytes']>;
  emittedBy_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  loanId?: InputMaybe<Scalars['String']>;
  loanId_?: InputMaybe<Loan_Filter>;
  loanId_contains?: InputMaybe<Scalars['String']>;
  loanId_contains_nocase?: InputMaybe<Scalars['String']>;
  loanId_ends_with?: InputMaybe<Scalars['String']>;
  loanId_ends_with_nocase?: InputMaybe<Scalars['String']>;
  loanId_gt?: InputMaybe<Scalars['String']>;
  loanId_gte?: InputMaybe<Scalars['String']>;
  loanId_in?: InputMaybe<Array<Scalars['String']>>;
  loanId_lt?: InputMaybe<Scalars['String']>;
  loanId_lte?: InputMaybe<Scalars['String']>;
  loanId_not?: InputMaybe<Scalars['String']>;
  loanId_not_contains?: InputMaybe<Scalars['String']>;
  loanId_not_contains_nocase?: InputMaybe<Scalars['String']>;
  loanId_not_ends_with?: InputMaybe<Scalars['String']>;
  loanId_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  loanId_not_in?: InputMaybe<Array<Scalars['String']>>;
  loanId_not_starts_with?: InputMaybe<Scalars['String']>;
  loanId_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  loanId_starts_with?: InputMaybe<Scalars['String']>;
  loanId_starts_with_nocase?: InputMaybe<Scalars['String']>;
  rate?: InputMaybe<Scalars['BigDecimal']>;
  rate_gt?: InputMaybe<Scalars['BigDecimal']>;
  rate_gte?: InputMaybe<Scalars['BigDecimal']>;
  rate_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  rate_lt?: InputMaybe<Scalars['BigDecimal']>;
  rate_lte?: InputMaybe<Scalars['BigDecimal']>;
  rate_not?: InputMaybe<Scalars['BigDecimal']>;
  rate_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  timestamp?: InputMaybe<Scalars['Int']>;
  timestamp_gt?: InputMaybe<Scalars['Int']>;
  timestamp_gte?: InputMaybe<Scalars['Int']>;
  timestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp_lt?: InputMaybe<Scalars['Int']>;
  timestamp_lte?: InputMaybe<Scalars['Int']>;
  timestamp_not?: InputMaybe<Scalars['Int']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
  transaction?: InputMaybe<Scalars['String']>;
  transaction_?: InputMaybe<Transaction_Filter>;
  transaction_contains?: InputMaybe<Scalars['String']>;
  transaction_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_gt?: InputMaybe<Scalars['String']>;
  transaction_gte?: InputMaybe<Scalars['String']>;
  transaction_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_lt?: InputMaybe<Scalars['String']>;
  transaction_lte?: InputMaybe<Scalars['String']>;
  transaction_not?: InputMaybe<Scalars['String']>;
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_not_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
  transaction_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum DepositCollateral_OrderBy {
  DepositAmount = 'depositAmount',
  EmittedBy = 'emittedBy',
  Id = 'id',
  LoanId = 'loanId',
  Rate = 'rate',
  Timestamp = 'timestamp',
  Transaction = 'transaction',
}

export type Deposit_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars['BigDecimal']>;
  amount_gt?: InputMaybe<Scalars['BigDecimal']>;
  amount_gte?: InputMaybe<Scalars['BigDecimal']>;
  amount_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  amount_lt?: InputMaybe<Scalars['BigDecimal']>;
  amount_lte?: InputMaybe<Scalars['BigDecimal']>;
  amount_not?: InputMaybe<Scalars['BigDecimal']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  emittedBy?: InputMaybe<Scalars['Bytes']>;
  emittedBy_contains?: InputMaybe<Scalars['Bytes']>;
  emittedBy_in?: InputMaybe<Array<Scalars['Bytes']>>;
  emittedBy_not?: InputMaybe<Scalars['Bytes']>;
  emittedBy_not_contains?: InputMaybe<Scalars['Bytes']>;
  emittedBy_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  timestamp?: InputMaybe<Scalars['Int']>;
  timestamp_gt?: InputMaybe<Scalars['Int']>;
  timestamp_gte?: InputMaybe<Scalars['Int']>;
  timestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp_lt?: InputMaybe<Scalars['Int']>;
  timestamp_lte?: InputMaybe<Scalars['Int']>;
  timestamp_not?: InputMaybe<Scalars['Int']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
  to?: InputMaybe<Scalars['Bytes']>;
  to_contains?: InputMaybe<Scalars['Bytes']>;
  to_in?: InputMaybe<Array<Scalars['Bytes']>>;
  to_not?: InputMaybe<Scalars['Bytes']>;
  to_not_contains?: InputMaybe<Scalars['Bytes']>;
  to_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transaction?: InputMaybe<Scalars['String']>;
  transaction_?: InputMaybe<Transaction_Filter>;
  transaction_contains?: InputMaybe<Scalars['String']>;
  transaction_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_gt?: InputMaybe<Scalars['String']>;
  transaction_gte?: InputMaybe<Scalars['String']>;
  transaction_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_lt?: InputMaybe<Scalars['String']>;
  transaction_lte?: InputMaybe<Scalars['String']>;
  transaction_not?: InputMaybe<Scalars['String']>;
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_not_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
  transaction_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum Deposit_OrderBy {
  Amount = 'amount',
  EmittedBy = 'emittedBy',
  Id = 'id',
  Timestamp = 'timestamp',
  To = 'to',
  Transaction = 'transaction',
}

export type FastBtcBridgeStat = {
  __typename?: 'FastBTCBridgeStat';
  createdAtTx: Transaction;
  id: Scalars['ID'];
  totalAmountBTCInitialized: Scalars['BigDecimal'];
  totalAmountBTCMined: Scalars['BigDecimal'];
  totalAmountBTCRefunded: Scalars['BigDecimal'];
  totalAmountBTCSending: Scalars['BigDecimal'];
  totalFeesBTC: Scalars['BigDecimal'];
  updatedAtTx: Transaction;
  user?: Maybe<User>;
};

export type FastBtcBridgeStat_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  createdAtTx?: InputMaybe<Scalars['String']>;
  createdAtTx_?: InputMaybe<Transaction_Filter>;
  createdAtTx_contains?: InputMaybe<Scalars['String']>;
  createdAtTx_contains_nocase?: InputMaybe<Scalars['String']>;
  createdAtTx_ends_with?: InputMaybe<Scalars['String']>;
  createdAtTx_ends_with_nocase?: InputMaybe<Scalars['String']>;
  createdAtTx_gt?: InputMaybe<Scalars['String']>;
  createdAtTx_gte?: InputMaybe<Scalars['String']>;
  createdAtTx_in?: InputMaybe<Array<Scalars['String']>>;
  createdAtTx_lt?: InputMaybe<Scalars['String']>;
  createdAtTx_lte?: InputMaybe<Scalars['String']>;
  createdAtTx_not?: InputMaybe<Scalars['String']>;
  createdAtTx_not_contains?: InputMaybe<Scalars['String']>;
  createdAtTx_not_contains_nocase?: InputMaybe<Scalars['String']>;
  createdAtTx_not_ends_with?: InputMaybe<Scalars['String']>;
  createdAtTx_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  createdAtTx_not_in?: InputMaybe<Array<Scalars['String']>>;
  createdAtTx_not_starts_with?: InputMaybe<Scalars['String']>;
  createdAtTx_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  createdAtTx_starts_with?: InputMaybe<Scalars['String']>;
  createdAtTx_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  totalAmountBTCInitialized?: InputMaybe<Scalars['BigDecimal']>;
  totalAmountBTCInitialized_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalAmountBTCInitialized_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalAmountBTCInitialized_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalAmountBTCInitialized_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalAmountBTCInitialized_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalAmountBTCInitialized_not?: InputMaybe<Scalars['BigDecimal']>;
  totalAmountBTCInitialized_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalAmountBTCMined?: InputMaybe<Scalars['BigDecimal']>;
  totalAmountBTCMined_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalAmountBTCMined_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalAmountBTCMined_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalAmountBTCMined_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalAmountBTCMined_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalAmountBTCMined_not?: InputMaybe<Scalars['BigDecimal']>;
  totalAmountBTCMined_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalAmountBTCRefunded?: InputMaybe<Scalars['BigDecimal']>;
  totalAmountBTCRefunded_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalAmountBTCRefunded_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalAmountBTCRefunded_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalAmountBTCRefunded_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalAmountBTCRefunded_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalAmountBTCRefunded_not?: InputMaybe<Scalars['BigDecimal']>;
  totalAmountBTCRefunded_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalAmountBTCSending?: InputMaybe<Scalars['BigDecimal']>;
  totalAmountBTCSending_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalAmountBTCSending_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalAmountBTCSending_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalAmountBTCSending_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalAmountBTCSending_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalAmountBTCSending_not?: InputMaybe<Scalars['BigDecimal']>;
  totalAmountBTCSending_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalFeesBTC?: InputMaybe<Scalars['BigDecimal']>;
  totalFeesBTC_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalFeesBTC_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalFeesBTC_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalFeesBTC_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalFeesBTC_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalFeesBTC_not?: InputMaybe<Scalars['BigDecimal']>;
  totalFeesBTC_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  updatedAtTx?: InputMaybe<Scalars['String']>;
  updatedAtTx_?: InputMaybe<Transaction_Filter>;
  updatedAtTx_contains?: InputMaybe<Scalars['String']>;
  updatedAtTx_contains_nocase?: InputMaybe<Scalars['String']>;
  updatedAtTx_ends_with?: InputMaybe<Scalars['String']>;
  updatedAtTx_ends_with_nocase?: InputMaybe<Scalars['String']>;
  updatedAtTx_gt?: InputMaybe<Scalars['String']>;
  updatedAtTx_gte?: InputMaybe<Scalars['String']>;
  updatedAtTx_in?: InputMaybe<Array<Scalars['String']>>;
  updatedAtTx_lt?: InputMaybe<Scalars['String']>;
  updatedAtTx_lte?: InputMaybe<Scalars['String']>;
  updatedAtTx_not?: InputMaybe<Scalars['String']>;
  updatedAtTx_not_contains?: InputMaybe<Scalars['String']>;
  updatedAtTx_not_contains_nocase?: InputMaybe<Scalars['String']>;
  updatedAtTx_not_ends_with?: InputMaybe<Scalars['String']>;
  updatedAtTx_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  updatedAtTx_not_in?: InputMaybe<Array<Scalars['String']>>;
  updatedAtTx_not_starts_with?: InputMaybe<Scalars['String']>;
  updatedAtTx_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  updatedAtTx_starts_with?: InputMaybe<Scalars['String']>;
  updatedAtTx_starts_with_nocase?: InputMaybe<Scalars['String']>;
  user?: InputMaybe<Scalars['String']>;
  user_?: InputMaybe<User_Filter>;
  user_contains?: InputMaybe<Scalars['String']>;
  user_contains_nocase?: InputMaybe<Scalars['String']>;
  user_ends_with?: InputMaybe<Scalars['String']>;
  user_ends_with_nocase?: InputMaybe<Scalars['String']>;
  user_gt?: InputMaybe<Scalars['String']>;
  user_gte?: InputMaybe<Scalars['String']>;
  user_in?: InputMaybe<Array<Scalars['String']>>;
  user_lt?: InputMaybe<Scalars['String']>;
  user_lte?: InputMaybe<Scalars['String']>;
  user_not?: InputMaybe<Scalars['String']>;
  user_not_contains?: InputMaybe<Scalars['String']>;
  user_not_contains_nocase?: InputMaybe<Scalars['String']>;
  user_not_ends_with?: InputMaybe<Scalars['String']>;
  user_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  user_not_in?: InputMaybe<Array<Scalars['String']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']>;
  user_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  user_starts_with?: InputMaybe<Scalars['String']>;
  user_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum FastBtcBridgeStat_OrderBy {
  CreatedAtTx = 'createdAtTx',
  Id = 'id',
  TotalAmountBtcInitialized = 'totalAmountBTCInitialized',
  TotalAmountBtcMined = 'totalAmountBTCMined',
  TotalAmountBtcRefunded = 'totalAmountBTCRefunded',
  TotalAmountBtcSending = 'totalAmountBTCSending',
  TotalFeesBtc = 'totalFeesBTC',
  UpdatedAtTx = 'updatedAtTx',
  User = 'user',
}

/**
 * Federation - the federation entity
 *
 */
export type Federation = {
  __typename?: 'Federation';
  /**
   * Bridge - the bridge that is associated with this federation contract
   *
   */
  bridge: Bridge;
  /**
   * CreatedAtTx - the creation transaction of this federation
   *
   */
  createdAtTx: Transaction;
  /**
   * Id - the id of the federation entity is the federation contract address
   *
   */
  id: Scalars['ID'];
  /**
   * IsActive - is this federation contract active
   *
   */
  isActive: Scalars['Boolean'];
  /**
   * Members - federators that are members of this federation
   *
   */
  members: Array<Scalars['Bytes']>;
  /**
   * TotalExecuted - total transfers executed by this federation
   *
   */
  totalExecuted: Scalars['Int'];
  /**
   * TotalVotes - total votes cast on this federation
   *
   */
  totalVotes: Scalars['Int'];
  /**
   * UpdatedAtTx - the transaction at which this entity was last updated
   *
   */
  updatedAtTx: Transaction;
};

export type Federation_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  bridge?: InputMaybe<Scalars['String']>;
  bridge_?: InputMaybe<Bridge_Filter>;
  bridge_contains?: InputMaybe<Scalars['String']>;
  bridge_contains_nocase?: InputMaybe<Scalars['String']>;
  bridge_ends_with?: InputMaybe<Scalars['String']>;
  bridge_ends_with_nocase?: InputMaybe<Scalars['String']>;
  bridge_gt?: InputMaybe<Scalars['String']>;
  bridge_gte?: InputMaybe<Scalars['String']>;
  bridge_in?: InputMaybe<Array<Scalars['String']>>;
  bridge_lt?: InputMaybe<Scalars['String']>;
  bridge_lte?: InputMaybe<Scalars['String']>;
  bridge_not?: InputMaybe<Scalars['String']>;
  bridge_not_contains?: InputMaybe<Scalars['String']>;
  bridge_not_contains_nocase?: InputMaybe<Scalars['String']>;
  bridge_not_ends_with?: InputMaybe<Scalars['String']>;
  bridge_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  bridge_not_in?: InputMaybe<Array<Scalars['String']>>;
  bridge_not_starts_with?: InputMaybe<Scalars['String']>;
  bridge_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  bridge_starts_with?: InputMaybe<Scalars['String']>;
  bridge_starts_with_nocase?: InputMaybe<Scalars['String']>;
  createdAtTx?: InputMaybe<Scalars['String']>;
  createdAtTx_?: InputMaybe<Transaction_Filter>;
  createdAtTx_contains?: InputMaybe<Scalars['String']>;
  createdAtTx_contains_nocase?: InputMaybe<Scalars['String']>;
  createdAtTx_ends_with?: InputMaybe<Scalars['String']>;
  createdAtTx_ends_with_nocase?: InputMaybe<Scalars['String']>;
  createdAtTx_gt?: InputMaybe<Scalars['String']>;
  createdAtTx_gte?: InputMaybe<Scalars['String']>;
  createdAtTx_in?: InputMaybe<Array<Scalars['String']>>;
  createdAtTx_lt?: InputMaybe<Scalars['String']>;
  createdAtTx_lte?: InputMaybe<Scalars['String']>;
  createdAtTx_not?: InputMaybe<Scalars['String']>;
  createdAtTx_not_contains?: InputMaybe<Scalars['String']>;
  createdAtTx_not_contains_nocase?: InputMaybe<Scalars['String']>;
  createdAtTx_not_ends_with?: InputMaybe<Scalars['String']>;
  createdAtTx_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  createdAtTx_not_in?: InputMaybe<Array<Scalars['String']>>;
  createdAtTx_not_starts_with?: InputMaybe<Scalars['String']>;
  createdAtTx_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  createdAtTx_starts_with?: InputMaybe<Scalars['String']>;
  createdAtTx_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  isActive?: InputMaybe<Scalars['Boolean']>;
  isActive_in?: InputMaybe<Array<Scalars['Boolean']>>;
  isActive_not?: InputMaybe<Scalars['Boolean']>;
  isActive_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  members?: InputMaybe<Array<Scalars['Bytes']>>;
  members_contains?: InputMaybe<Array<Scalars['Bytes']>>;
  members_contains_nocase?: InputMaybe<Array<Scalars['Bytes']>>;
  members_not?: InputMaybe<Array<Scalars['Bytes']>>;
  members_not_contains?: InputMaybe<Array<Scalars['Bytes']>>;
  members_not_contains_nocase?: InputMaybe<Array<Scalars['Bytes']>>;
  totalExecuted?: InputMaybe<Scalars['Int']>;
  totalExecuted_gt?: InputMaybe<Scalars['Int']>;
  totalExecuted_gte?: InputMaybe<Scalars['Int']>;
  totalExecuted_in?: InputMaybe<Array<Scalars['Int']>>;
  totalExecuted_lt?: InputMaybe<Scalars['Int']>;
  totalExecuted_lte?: InputMaybe<Scalars['Int']>;
  totalExecuted_not?: InputMaybe<Scalars['Int']>;
  totalExecuted_not_in?: InputMaybe<Array<Scalars['Int']>>;
  totalVotes?: InputMaybe<Scalars['Int']>;
  totalVotes_gt?: InputMaybe<Scalars['Int']>;
  totalVotes_gte?: InputMaybe<Scalars['Int']>;
  totalVotes_in?: InputMaybe<Array<Scalars['Int']>>;
  totalVotes_lt?: InputMaybe<Scalars['Int']>;
  totalVotes_lte?: InputMaybe<Scalars['Int']>;
  totalVotes_not?: InputMaybe<Scalars['Int']>;
  totalVotes_not_in?: InputMaybe<Array<Scalars['Int']>>;
  updatedAtTx?: InputMaybe<Scalars['String']>;
  updatedAtTx_?: InputMaybe<Transaction_Filter>;
  updatedAtTx_contains?: InputMaybe<Scalars['String']>;
  updatedAtTx_contains_nocase?: InputMaybe<Scalars['String']>;
  updatedAtTx_ends_with?: InputMaybe<Scalars['String']>;
  updatedAtTx_ends_with_nocase?: InputMaybe<Scalars['String']>;
  updatedAtTx_gt?: InputMaybe<Scalars['String']>;
  updatedAtTx_gte?: InputMaybe<Scalars['String']>;
  updatedAtTx_in?: InputMaybe<Array<Scalars['String']>>;
  updatedAtTx_lt?: InputMaybe<Scalars['String']>;
  updatedAtTx_lte?: InputMaybe<Scalars['String']>;
  updatedAtTx_not?: InputMaybe<Scalars['String']>;
  updatedAtTx_not_contains?: InputMaybe<Scalars['String']>;
  updatedAtTx_not_contains_nocase?: InputMaybe<Scalars['String']>;
  updatedAtTx_not_ends_with?: InputMaybe<Scalars['String']>;
  updatedAtTx_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  updatedAtTx_not_in?: InputMaybe<Array<Scalars['String']>>;
  updatedAtTx_not_starts_with?: InputMaybe<Scalars['String']>;
  updatedAtTx_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  updatedAtTx_starts_with?: InputMaybe<Scalars['String']>;
  updatedAtTx_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum Federation_OrderBy {
  Bridge = 'bridge',
  CreatedAtTx = 'createdAtTx',
  Id = 'id',
  IsActive = 'isActive',
  Members = 'members',
  TotalExecuted = 'totalExecuted',
  TotalVotes = 'totalVotes',
  UpdatedAtTx = 'updatedAtTx',
}

export type FeeSharingTokensTransferred = {
  __typename?: 'FeeSharingTokensTransferred';
  amount: Scalars['BigDecimal'];
  id: Scalars['ID'];
  sender: Scalars['Bytes'];
  token: Scalars['Bytes'];
};

export type FeeSharingTokensTransferred_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars['BigDecimal']>;
  amount_gt?: InputMaybe<Scalars['BigDecimal']>;
  amount_gte?: InputMaybe<Scalars['BigDecimal']>;
  amount_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  amount_lt?: InputMaybe<Scalars['BigDecimal']>;
  amount_lte?: InputMaybe<Scalars['BigDecimal']>;
  amount_not?: InputMaybe<Scalars['BigDecimal']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  sender?: InputMaybe<Scalars['Bytes']>;
  sender_contains?: InputMaybe<Scalars['Bytes']>;
  sender_in?: InputMaybe<Array<Scalars['Bytes']>>;
  sender_not?: InputMaybe<Scalars['Bytes']>;
  sender_not_contains?: InputMaybe<Scalars['Bytes']>;
  sender_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  token?: InputMaybe<Scalars['Bytes']>;
  token_contains?: InputMaybe<Scalars['Bytes']>;
  token_in?: InputMaybe<Array<Scalars['Bytes']>>;
  token_not?: InputMaybe<Scalars['Bytes']>;
  token_not_contains?: InputMaybe<Scalars['Bytes']>;
  token_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum FeeSharingTokensTransferred_OrderBy {
  Amount = 'amount',
  Id = 'id',
  Sender = 'sender',
  Token = 'token',
}

export enum FeeType {
  Amm = 'AMM',
  Borrowing = 'Borrowing',
  Lending = 'Lending',
  Trading = 'Trading',
}

export type GovernorContract = {
  __typename?: 'GovernorContract';
  guardian: Scalars['Bytes'];
  /**
   * Address of the governance contract
   *
   */
  id: Scalars['ID'];
  /**
   * Majority percentage.
   *
   */
  majorityPercentageVotes: Scalars['Int'];
  /**
   * The maximum number of actions that can be included in a proposal.
   *
   */
  proposalMaxOperations: Scalars['Int'];
  proposals: Array<Proposal>;
  /**
   * Percentage of current total voting power require to vote.
   *
   */
  quorumPercentageVotes: Scalars['Int'];
  staking: Scalars['Bytes'];
  timelock: Scalars['Bytes'];
  /**
   * Timestamp when this contract has created a proposal and was loaded into the graph.
   *
   */
  timestamp: Scalars['Int'];
  type: GovernorType;
  /**
   * The delay before voting on a proposal may take place, once proposed, in blocks.
   *
   */
  votingDelay: Scalars['Int'];
  /**
   * The duration of voting on a proposal, in blocks.
   *
   */
  votingPeriod: Scalars['Int'];
};

export type GovernorContractProposalsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Proposal_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Proposal_Filter>;
};

export type GovernorContract_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  guardian?: InputMaybe<Scalars['Bytes']>;
  guardian_contains?: InputMaybe<Scalars['Bytes']>;
  guardian_in?: InputMaybe<Array<Scalars['Bytes']>>;
  guardian_not?: InputMaybe<Scalars['Bytes']>;
  guardian_not_contains?: InputMaybe<Scalars['Bytes']>;
  guardian_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  majorityPercentageVotes?: InputMaybe<Scalars['Int']>;
  majorityPercentageVotes_gt?: InputMaybe<Scalars['Int']>;
  majorityPercentageVotes_gte?: InputMaybe<Scalars['Int']>;
  majorityPercentageVotes_in?: InputMaybe<Array<Scalars['Int']>>;
  majorityPercentageVotes_lt?: InputMaybe<Scalars['Int']>;
  majorityPercentageVotes_lte?: InputMaybe<Scalars['Int']>;
  majorityPercentageVotes_not?: InputMaybe<Scalars['Int']>;
  majorityPercentageVotes_not_in?: InputMaybe<Array<Scalars['Int']>>;
  proposalMaxOperations?: InputMaybe<Scalars['Int']>;
  proposalMaxOperations_gt?: InputMaybe<Scalars['Int']>;
  proposalMaxOperations_gte?: InputMaybe<Scalars['Int']>;
  proposalMaxOperations_in?: InputMaybe<Array<Scalars['Int']>>;
  proposalMaxOperations_lt?: InputMaybe<Scalars['Int']>;
  proposalMaxOperations_lte?: InputMaybe<Scalars['Int']>;
  proposalMaxOperations_not?: InputMaybe<Scalars['Int']>;
  proposalMaxOperations_not_in?: InputMaybe<Array<Scalars['Int']>>;
  proposals_?: InputMaybe<Proposal_Filter>;
  quorumPercentageVotes?: InputMaybe<Scalars['Int']>;
  quorumPercentageVotes_gt?: InputMaybe<Scalars['Int']>;
  quorumPercentageVotes_gte?: InputMaybe<Scalars['Int']>;
  quorumPercentageVotes_in?: InputMaybe<Array<Scalars['Int']>>;
  quorumPercentageVotes_lt?: InputMaybe<Scalars['Int']>;
  quorumPercentageVotes_lte?: InputMaybe<Scalars['Int']>;
  quorumPercentageVotes_not?: InputMaybe<Scalars['Int']>;
  quorumPercentageVotes_not_in?: InputMaybe<Array<Scalars['Int']>>;
  staking?: InputMaybe<Scalars['Bytes']>;
  staking_contains?: InputMaybe<Scalars['Bytes']>;
  staking_in?: InputMaybe<Array<Scalars['Bytes']>>;
  staking_not?: InputMaybe<Scalars['Bytes']>;
  staking_not_contains?: InputMaybe<Scalars['Bytes']>;
  staking_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  timelock?: InputMaybe<Scalars['Bytes']>;
  timelock_contains?: InputMaybe<Scalars['Bytes']>;
  timelock_in?: InputMaybe<Array<Scalars['Bytes']>>;
  timelock_not?: InputMaybe<Scalars['Bytes']>;
  timelock_not_contains?: InputMaybe<Scalars['Bytes']>;
  timelock_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  timestamp?: InputMaybe<Scalars['Int']>;
  timestamp_gt?: InputMaybe<Scalars['Int']>;
  timestamp_gte?: InputMaybe<Scalars['Int']>;
  timestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp_lt?: InputMaybe<Scalars['Int']>;
  timestamp_lte?: InputMaybe<Scalars['Int']>;
  timestamp_not?: InputMaybe<Scalars['Int']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
  type?: InputMaybe<GovernorType>;
  type_in?: InputMaybe<Array<GovernorType>>;
  type_not?: InputMaybe<GovernorType>;
  type_not_in?: InputMaybe<Array<GovernorType>>;
  votingDelay?: InputMaybe<Scalars['Int']>;
  votingDelay_gt?: InputMaybe<Scalars['Int']>;
  votingDelay_gte?: InputMaybe<Scalars['Int']>;
  votingDelay_in?: InputMaybe<Array<Scalars['Int']>>;
  votingDelay_lt?: InputMaybe<Scalars['Int']>;
  votingDelay_lte?: InputMaybe<Scalars['Int']>;
  votingDelay_not?: InputMaybe<Scalars['Int']>;
  votingDelay_not_in?: InputMaybe<Array<Scalars['Int']>>;
  votingPeriod?: InputMaybe<Scalars['Int']>;
  votingPeriod_gt?: InputMaybe<Scalars['Int']>;
  votingPeriod_gte?: InputMaybe<Scalars['Int']>;
  votingPeriod_in?: InputMaybe<Array<Scalars['Int']>>;
  votingPeriod_lt?: InputMaybe<Scalars['Int']>;
  votingPeriod_lte?: InputMaybe<Scalars['Int']>;
  votingPeriod_not?: InputMaybe<Scalars['Int']>;
  votingPeriod_not_in?: InputMaybe<Array<Scalars['Int']>>;
};

export enum GovernorContract_OrderBy {
  Guardian = 'guardian',
  Id = 'id',
  MajorityPercentageVotes = 'majorityPercentageVotes',
  ProposalMaxOperations = 'proposalMaxOperations',
  Proposals = 'proposals',
  QuorumPercentageVotes = 'quorumPercentageVotes',
  Staking = 'staking',
  Timelock = 'timelock',
  Timestamp = 'timestamp',
  Type = 'type',
  VotingDelay = 'votingDelay',
  VotingPeriod = 'votingPeriod',
}

export enum GovernorType {
  Admin = 'Admin',
  Other = 'Other',
  Owner = 'Owner',
}

/**
 * Candlesticks are for presentational purposes on the dapp. This entity supports the candlestick trading data on the trading view charts.
 * Trading data is available for the following pairs:
 * 1. All tokens to RBTC
 * 2. All tokens to current usdStablecoin (see ProtocolStats entity for more information)
 * There is not candlestick data for other trading pairs as this would cause the amount of data stored to increase exponentially
 *
 */
export type ICandleStick = {
  /**
   * Eg in the pair SOV-XUSD, the base token is SOV and the quote token is XUSD
   * Prices shown are the price of the base token in the quote token (eg price of SOV in XUSD)
   *
   */
  baseToken?: Maybe<Token>;
  close: Scalars['BigDecimal'];
  high: Scalars['BigDecimal'];
  /**
   * The ID is fromToken + toToken + timestamp
   * toToken will be either RBTC or XUSD
   *
   */
  id: Scalars['ID'];
  low: Scalars['BigDecimal'];
  open?: Maybe<Scalars['BigDecimal']>;
  /**
   * Unix timestamp for the candlestick start time
   *
   */
  periodStartUnix: Scalars['Int'];
  quoteToken?: Maybe<Token>;
  /**
   * The volume of the base token that has been bought and sold in this time period
   *
   */
  totalVolume: Scalars['BigDecimal'];
  txCount: Scalars['Int'];
};

export type ICandleStick_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  baseToken?: InputMaybe<Scalars['String']>;
  baseToken_?: InputMaybe<Token_Filter>;
  baseToken_contains?: InputMaybe<Scalars['String']>;
  baseToken_contains_nocase?: InputMaybe<Scalars['String']>;
  baseToken_ends_with?: InputMaybe<Scalars['String']>;
  baseToken_ends_with_nocase?: InputMaybe<Scalars['String']>;
  baseToken_gt?: InputMaybe<Scalars['String']>;
  baseToken_gte?: InputMaybe<Scalars['String']>;
  baseToken_in?: InputMaybe<Array<Scalars['String']>>;
  baseToken_lt?: InputMaybe<Scalars['String']>;
  baseToken_lte?: InputMaybe<Scalars['String']>;
  baseToken_not?: InputMaybe<Scalars['String']>;
  baseToken_not_contains?: InputMaybe<Scalars['String']>;
  baseToken_not_contains_nocase?: InputMaybe<Scalars['String']>;
  baseToken_not_ends_with?: InputMaybe<Scalars['String']>;
  baseToken_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  baseToken_not_in?: InputMaybe<Array<Scalars['String']>>;
  baseToken_not_starts_with?: InputMaybe<Scalars['String']>;
  baseToken_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  baseToken_starts_with?: InputMaybe<Scalars['String']>;
  baseToken_starts_with_nocase?: InputMaybe<Scalars['String']>;
  close?: InputMaybe<Scalars['BigDecimal']>;
  close_gt?: InputMaybe<Scalars['BigDecimal']>;
  close_gte?: InputMaybe<Scalars['BigDecimal']>;
  close_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  close_lt?: InputMaybe<Scalars['BigDecimal']>;
  close_lte?: InputMaybe<Scalars['BigDecimal']>;
  close_not?: InputMaybe<Scalars['BigDecimal']>;
  close_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  high?: InputMaybe<Scalars['BigDecimal']>;
  high_gt?: InputMaybe<Scalars['BigDecimal']>;
  high_gte?: InputMaybe<Scalars['BigDecimal']>;
  high_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  high_lt?: InputMaybe<Scalars['BigDecimal']>;
  high_lte?: InputMaybe<Scalars['BigDecimal']>;
  high_not?: InputMaybe<Scalars['BigDecimal']>;
  high_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  low?: InputMaybe<Scalars['BigDecimal']>;
  low_gt?: InputMaybe<Scalars['BigDecimal']>;
  low_gte?: InputMaybe<Scalars['BigDecimal']>;
  low_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  low_lt?: InputMaybe<Scalars['BigDecimal']>;
  low_lte?: InputMaybe<Scalars['BigDecimal']>;
  low_not?: InputMaybe<Scalars['BigDecimal']>;
  low_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  open?: InputMaybe<Scalars['BigDecimal']>;
  open_gt?: InputMaybe<Scalars['BigDecimal']>;
  open_gte?: InputMaybe<Scalars['BigDecimal']>;
  open_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  open_lt?: InputMaybe<Scalars['BigDecimal']>;
  open_lte?: InputMaybe<Scalars['BigDecimal']>;
  open_not?: InputMaybe<Scalars['BigDecimal']>;
  open_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  periodStartUnix?: InputMaybe<Scalars['Int']>;
  periodStartUnix_gt?: InputMaybe<Scalars['Int']>;
  periodStartUnix_gte?: InputMaybe<Scalars['Int']>;
  periodStartUnix_in?: InputMaybe<Array<Scalars['Int']>>;
  periodStartUnix_lt?: InputMaybe<Scalars['Int']>;
  periodStartUnix_lte?: InputMaybe<Scalars['Int']>;
  periodStartUnix_not?: InputMaybe<Scalars['Int']>;
  periodStartUnix_not_in?: InputMaybe<Array<Scalars['Int']>>;
  quoteToken?: InputMaybe<Scalars['String']>;
  quoteToken_?: InputMaybe<Token_Filter>;
  quoteToken_contains?: InputMaybe<Scalars['String']>;
  quoteToken_contains_nocase?: InputMaybe<Scalars['String']>;
  quoteToken_ends_with?: InputMaybe<Scalars['String']>;
  quoteToken_ends_with_nocase?: InputMaybe<Scalars['String']>;
  quoteToken_gt?: InputMaybe<Scalars['String']>;
  quoteToken_gte?: InputMaybe<Scalars['String']>;
  quoteToken_in?: InputMaybe<Array<Scalars['String']>>;
  quoteToken_lt?: InputMaybe<Scalars['String']>;
  quoteToken_lte?: InputMaybe<Scalars['String']>;
  quoteToken_not?: InputMaybe<Scalars['String']>;
  quoteToken_not_contains?: InputMaybe<Scalars['String']>;
  quoteToken_not_contains_nocase?: InputMaybe<Scalars['String']>;
  quoteToken_not_ends_with?: InputMaybe<Scalars['String']>;
  quoteToken_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  quoteToken_not_in?: InputMaybe<Array<Scalars['String']>>;
  quoteToken_not_starts_with?: InputMaybe<Scalars['String']>;
  quoteToken_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  quoteToken_starts_with?: InputMaybe<Scalars['String']>;
  quoteToken_starts_with_nocase?: InputMaybe<Scalars['String']>;
  totalVolume?: InputMaybe<Scalars['BigDecimal']>;
  totalVolume_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalVolume_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalVolume_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalVolume_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalVolume_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalVolume_not?: InputMaybe<Scalars['BigDecimal']>;
  totalVolume_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  txCount?: InputMaybe<Scalars['Int']>;
  txCount_gt?: InputMaybe<Scalars['Int']>;
  txCount_gte?: InputMaybe<Scalars['Int']>;
  txCount_in?: InputMaybe<Array<Scalars['Int']>>;
  txCount_lt?: InputMaybe<Scalars['Int']>;
  txCount_lte?: InputMaybe<Scalars['Int']>;
  txCount_not?: InputMaybe<Scalars['Int']>;
  txCount_not_in?: InputMaybe<Array<Scalars['Int']>>;
};

export enum ICandleStick_OrderBy {
  BaseToken = 'baseToken',
  Close = 'close',
  High = 'high',
  Id = 'id',
  Low = 'low',
  Open = 'open',
  PeriodStartUnix = 'periodStartUnix',
  QuoteToken = 'quoteToken',
  TotalVolume = 'totalVolume',
  TxCount = 'txCount',
}

/**
 * LendingHistoryItem is one user's history of Lend/UnLend events across all the lending pools
 *
 */
export type LendingHistoryItem = {
  __typename?: 'LendingHistoryItem';
  /**
   * The amount of ERC20 token that was lent/unlent
   *
   */
  amount: Scalars['BigDecimal'];
  /**
   * The underlying asset for this pool (eg USDT for the iUSDT pool)
   *
   */
  asset?: Maybe<Token>;
  emittedBy: Scalars['String'];
  id: Scalars['ID'];
  lender: User;
  /**
   * The lending pool the user interacted with
   *
   */
  lendingPool: LendingPool;
  /**
   * The amount of pool token that was minted or burned
   *
   */
  loanTokenAmount: Scalars['BigDecimal'];
  timestamp: Scalars['Int'];
  transaction: Transaction;
  /**
   * Type is Lend/UnLend
   *
   */
  type: LendingHistoryType;
  /**
   * Foreign key to the UserLendingHistory entity (see the docs on this entity for more information)
   *
   */
  userLendingHistory: UserLendingHistory;
};

export type LendingHistoryItem_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars['BigDecimal']>;
  amount_gt?: InputMaybe<Scalars['BigDecimal']>;
  amount_gte?: InputMaybe<Scalars['BigDecimal']>;
  amount_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  amount_lt?: InputMaybe<Scalars['BigDecimal']>;
  amount_lte?: InputMaybe<Scalars['BigDecimal']>;
  amount_not?: InputMaybe<Scalars['BigDecimal']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  asset?: InputMaybe<Scalars['String']>;
  asset_?: InputMaybe<Token_Filter>;
  asset_contains?: InputMaybe<Scalars['String']>;
  asset_contains_nocase?: InputMaybe<Scalars['String']>;
  asset_ends_with?: InputMaybe<Scalars['String']>;
  asset_ends_with_nocase?: InputMaybe<Scalars['String']>;
  asset_gt?: InputMaybe<Scalars['String']>;
  asset_gte?: InputMaybe<Scalars['String']>;
  asset_in?: InputMaybe<Array<Scalars['String']>>;
  asset_lt?: InputMaybe<Scalars['String']>;
  asset_lte?: InputMaybe<Scalars['String']>;
  asset_not?: InputMaybe<Scalars['String']>;
  asset_not_contains?: InputMaybe<Scalars['String']>;
  asset_not_contains_nocase?: InputMaybe<Scalars['String']>;
  asset_not_ends_with?: InputMaybe<Scalars['String']>;
  asset_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  asset_not_in?: InputMaybe<Array<Scalars['String']>>;
  asset_not_starts_with?: InputMaybe<Scalars['String']>;
  asset_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  asset_starts_with?: InputMaybe<Scalars['String']>;
  asset_starts_with_nocase?: InputMaybe<Scalars['String']>;
  emittedBy?: InputMaybe<Scalars['String']>;
  emittedBy_contains?: InputMaybe<Scalars['String']>;
  emittedBy_contains_nocase?: InputMaybe<Scalars['String']>;
  emittedBy_ends_with?: InputMaybe<Scalars['String']>;
  emittedBy_ends_with_nocase?: InputMaybe<Scalars['String']>;
  emittedBy_gt?: InputMaybe<Scalars['String']>;
  emittedBy_gte?: InputMaybe<Scalars['String']>;
  emittedBy_in?: InputMaybe<Array<Scalars['String']>>;
  emittedBy_lt?: InputMaybe<Scalars['String']>;
  emittedBy_lte?: InputMaybe<Scalars['String']>;
  emittedBy_not?: InputMaybe<Scalars['String']>;
  emittedBy_not_contains?: InputMaybe<Scalars['String']>;
  emittedBy_not_contains_nocase?: InputMaybe<Scalars['String']>;
  emittedBy_not_ends_with?: InputMaybe<Scalars['String']>;
  emittedBy_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  emittedBy_not_in?: InputMaybe<Array<Scalars['String']>>;
  emittedBy_not_starts_with?: InputMaybe<Scalars['String']>;
  emittedBy_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  emittedBy_starts_with?: InputMaybe<Scalars['String']>;
  emittedBy_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  lender?: InputMaybe<Scalars['String']>;
  lender_?: InputMaybe<User_Filter>;
  lender_contains?: InputMaybe<Scalars['String']>;
  lender_contains_nocase?: InputMaybe<Scalars['String']>;
  lender_ends_with?: InputMaybe<Scalars['String']>;
  lender_ends_with_nocase?: InputMaybe<Scalars['String']>;
  lender_gt?: InputMaybe<Scalars['String']>;
  lender_gte?: InputMaybe<Scalars['String']>;
  lender_in?: InputMaybe<Array<Scalars['String']>>;
  lender_lt?: InputMaybe<Scalars['String']>;
  lender_lte?: InputMaybe<Scalars['String']>;
  lender_not?: InputMaybe<Scalars['String']>;
  lender_not_contains?: InputMaybe<Scalars['String']>;
  lender_not_contains_nocase?: InputMaybe<Scalars['String']>;
  lender_not_ends_with?: InputMaybe<Scalars['String']>;
  lender_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  lender_not_in?: InputMaybe<Array<Scalars['String']>>;
  lender_not_starts_with?: InputMaybe<Scalars['String']>;
  lender_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  lender_starts_with?: InputMaybe<Scalars['String']>;
  lender_starts_with_nocase?: InputMaybe<Scalars['String']>;
  lendingPool?: InputMaybe<Scalars['String']>;
  lendingPool_?: InputMaybe<LendingPool_Filter>;
  lendingPool_contains?: InputMaybe<Scalars['String']>;
  lendingPool_contains_nocase?: InputMaybe<Scalars['String']>;
  lendingPool_ends_with?: InputMaybe<Scalars['String']>;
  lendingPool_ends_with_nocase?: InputMaybe<Scalars['String']>;
  lendingPool_gt?: InputMaybe<Scalars['String']>;
  lendingPool_gte?: InputMaybe<Scalars['String']>;
  lendingPool_in?: InputMaybe<Array<Scalars['String']>>;
  lendingPool_lt?: InputMaybe<Scalars['String']>;
  lendingPool_lte?: InputMaybe<Scalars['String']>;
  lendingPool_not?: InputMaybe<Scalars['String']>;
  lendingPool_not_contains?: InputMaybe<Scalars['String']>;
  lendingPool_not_contains_nocase?: InputMaybe<Scalars['String']>;
  lendingPool_not_ends_with?: InputMaybe<Scalars['String']>;
  lendingPool_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  lendingPool_not_in?: InputMaybe<Array<Scalars['String']>>;
  lendingPool_not_starts_with?: InputMaybe<Scalars['String']>;
  lendingPool_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  lendingPool_starts_with?: InputMaybe<Scalars['String']>;
  lendingPool_starts_with_nocase?: InputMaybe<Scalars['String']>;
  loanTokenAmount?: InputMaybe<Scalars['BigDecimal']>;
  loanTokenAmount_gt?: InputMaybe<Scalars['BigDecimal']>;
  loanTokenAmount_gte?: InputMaybe<Scalars['BigDecimal']>;
  loanTokenAmount_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  loanTokenAmount_lt?: InputMaybe<Scalars['BigDecimal']>;
  loanTokenAmount_lte?: InputMaybe<Scalars['BigDecimal']>;
  loanTokenAmount_not?: InputMaybe<Scalars['BigDecimal']>;
  loanTokenAmount_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  timestamp?: InputMaybe<Scalars['Int']>;
  timestamp_gt?: InputMaybe<Scalars['Int']>;
  timestamp_gte?: InputMaybe<Scalars['Int']>;
  timestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp_lt?: InputMaybe<Scalars['Int']>;
  timestamp_lte?: InputMaybe<Scalars['Int']>;
  timestamp_not?: InputMaybe<Scalars['Int']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
  transaction?: InputMaybe<Scalars['String']>;
  transaction_?: InputMaybe<Transaction_Filter>;
  transaction_contains?: InputMaybe<Scalars['String']>;
  transaction_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_gt?: InputMaybe<Scalars['String']>;
  transaction_gte?: InputMaybe<Scalars['String']>;
  transaction_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_lt?: InputMaybe<Scalars['String']>;
  transaction_lte?: InputMaybe<Scalars['String']>;
  transaction_not?: InputMaybe<Scalars['String']>;
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_not_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
  transaction_starts_with_nocase?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<LendingHistoryType>;
  type_in?: InputMaybe<Array<LendingHistoryType>>;
  type_not?: InputMaybe<LendingHistoryType>;
  type_not_in?: InputMaybe<Array<LendingHistoryType>>;
  userLendingHistory?: InputMaybe<Scalars['String']>;
  userLendingHistory_?: InputMaybe<UserLendingHistory_Filter>;
  userLendingHistory_contains?: InputMaybe<Scalars['String']>;
  userLendingHistory_contains_nocase?: InputMaybe<Scalars['String']>;
  userLendingHistory_ends_with?: InputMaybe<Scalars['String']>;
  userLendingHistory_ends_with_nocase?: InputMaybe<Scalars['String']>;
  userLendingHistory_gt?: InputMaybe<Scalars['String']>;
  userLendingHistory_gte?: InputMaybe<Scalars['String']>;
  userLendingHistory_in?: InputMaybe<Array<Scalars['String']>>;
  userLendingHistory_lt?: InputMaybe<Scalars['String']>;
  userLendingHistory_lte?: InputMaybe<Scalars['String']>;
  userLendingHistory_not?: InputMaybe<Scalars['String']>;
  userLendingHistory_not_contains?: InputMaybe<Scalars['String']>;
  userLendingHistory_not_contains_nocase?: InputMaybe<Scalars['String']>;
  userLendingHistory_not_ends_with?: InputMaybe<Scalars['String']>;
  userLendingHistory_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  userLendingHistory_not_in?: InputMaybe<Array<Scalars['String']>>;
  userLendingHistory_not_starts_with?: InputMaybe<Scalars['String']>;
  userLendingHistory_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  userLendingHistory_starts_with?: InputMaybe<Scalars['String']>;
  userLendingHistory_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum LendingHistoryItem_OrderBy {
  Amount = 'amount',
  Asset = 'asset',
  EmittedBy = 'emittedBy',
  Id = 'id',
  Lender = 'lender',
  LendingPool = 'lendingPool',
  LoanTokenAmount = 'loanTokenAmount',
  Timestamp = 'timestamp',
  Transaction = 'transaction',
  Type = 'type',
  UserLendingHistory = 'userLendingHistory',
}

export enum LendingHistoryType {
  /**
   * Lend is equivalent to a Mint event
   *
   */
  Lend = 'Lend',
  /**
   * UnLend is equivalent to a Burn event
   *
   */
  UnLend = 'UnLend',
}

/**
 * A Lending Pool (iToken), where Users can lend assets to earn interest, and Users can borrow assets to Margin Trade or just as a regular loan.
 *
 */
export type LendingPool = {
  __typename?: 'LendingPool';
  /**
   * Balance of the underlying asset (ERC20 token) represented by the total supply of pool tokens
   * It is incremented on Mint events and decremented on Burn events.
   * WORK-IN-PROGRESS: This is a work-in-progress as it does not properly account for interest payments currently
   *
   */
  assetBalance: Scalars['BigDecimal'];
  /**
   * ID is the contract address of the iToken
   *
   */
  id: Scalars['ID'];
  /**
   * The total supply of this pool token (not the underlying asset).
   * It is incremented on Mint events and decremented on Burn events
   *
   */
  poolTokenBalance: Scalars['BigDecimal'];
  /**
   * Total asset volume lent over all time
   *
   */
  totalAssetLent: Scalars['BigDecimal'];
  /**
   * The actual asset being lent and borrowed in this pool
   *
   */
  underlyingAsset: Token;
};

export type LendingPool_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  assetBalance?: InputMaybe<Scalars['BigDecimal']>;
  assetBalance_gt?: InputMaybe<Scalars['BigDecimal']>;
  assetBalance_gte?: InputMaybe<Scalars['BigDecimal']>;
  assetBalance_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  assetBalance_lt?: InputMaybe<Scalars['BigDecimal']>;
  assetBalance_lte?: InputMaybe<Scalars['BigDecimal']>;
  assetBalance_not?: InputMaybe<Scalars['BigDecimal']>;
  assetBalance_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  poolTokenBalance?: InputMaybe<Scalars['BigDecimal']>;
  poolTokenBalance_gt?: InputMaybe<Scalars['BigDecimal']>;
  poolTokenBalance_gte?: InputMaybe<Scalars['BigDecimal']>;
  poolTokenBalance_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  poolTokenBalance_lt?: InputMaybe<Scalars['BigDecimal']>;
  poolTokenBalance_lte?: InputMaybe<Scalars['BigDecimal']>;
  poolTokenBalance_not?: InputMaybe<Scalars['BigDecimal']>;
  poolTokenBalance_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalAssetLent?: InputMaybe<Scalars['BigDecimal']>;
  totalAssetLent_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalAssetLent_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalAssetLent_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalAssetLent_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalAssetLent_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalAssetLent_not?: InputMaybe<Scalars['BigDecimal']>;
  totalAssetLent_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  underlyingAsset?: InputMaybe<Scalars['String']>;
  underlyingAsset_?: InputMaybe<Token_Filter>;
  underlyingAsset_contains?: InputMaybe<Scalars['String']>;
  underlyingAsset_contains_nocase?: InputMaybe<Scalars['String']>;
  underlyingAsset_ends_with?: InputMaybe<Scalars['String']>;
  underlyingAsset_ends_with_nocase?: InputMaybe<Scalars['String']>;
  underlyingAsset_gt?: InputMaybe<Scalars['String']>;
  underlyingAsset_gte?: InputMaybe<Scalars['String']>;
  underlyingAsset_in?: InputMaybe<Array<Scalars['String']>>;
  underlyingAsset_lt?: InputMaybe<Scalars['String']>;
  underlyingAsset_lte?: InputMaybe<Scalars['String']>;
  underlyingAsset_not?: InputMaybe<Scalars['String']>;
  underlyingAsset_not_contains?: InputMaybe<Scalars['String']>;
  underlyingAsset_not_contains_nocase?: InputMaybe<Scalars['String']>;
  underlyingAsset_not_ends_with?: InputMaybe<Scalars['String']>;
  underlyingAsset_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  underlyingAsset_not_in?: InputMaybe<Array<Scalars['String']>>;
  underlyingAsset_not_starts_with?: InputMaybe<Scalars['String']>;
  underlyingAsset_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  underlyingAsset_starts_with?: InputMaybe<Scalars['String']>;
  underlyingAsset_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum LendingPool_OrderBy {
  AssetBalance = 'assetBalance',
  Id = 'id',
  PoolTokenBalance = 'poolTokenBalance',
  TotalAssetLent = 'totalAssetLent',
  UnderlyingAsset = 'underlyingAsset',
}

/**
 * Granular event data for the Loan entity. Emitted when a loan is fully or partially liquidated
 *
 */
export type Liquidate = {
  __typename?: 'Liquidate';
  collateralToLoanRate: Scalars['BigDecimal'];
  collateralToken: Scalars['Bytes'];
  collateralWithdrawAmount: Scalars['BigDecimal'];
  currentMargin: Scalars['BigDecimal'];
  emittedBy: Scalars['Bytes'];
  id: Scalars['ID'];
  lender: Scalars['Bytes'];
  liquidator: Scalars['Bytes'];
  loanId: Loan;
  loanToken: Scalars['Bytes'];
  repayAmount: Scalars['BigDecimal'];
  timestamp: Scalars['Int'];
  transaction: Transaction;
  user: User;
};

export type Liquidate_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  collateralToLoanRate?: InputMaybe<Scalars['BigDecimal']>;
  collateralToLoanRate_gt?: InputMaybe<Scalars['BigDecimal']>;
  collateralToLoanRate_gte?: InputMaybe<Scalars['BigDecimal']>;
  collateralToLoanRate_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  collateralToLoanRate_lt?: InputMaybe<Scalars['BigDecimal']>;
  collateralToLoanRate_lte?: InputMaybe<Scalars['BigDecimal']>;
  collateralToLoanRate_not?: InputMaybe<Scalars['BigDecimal']>;
  collateralToLoanRate_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  collateralToken?: InputMaybe<Scalars['Bytes']>;
  collateralToken_contains?: InputMaybe<Scalars['Bytes']>;
  collateralToken_in?: InputMaybe<Array<Scalars['Bytes']>>;
  collateralToken_not?: InputMaybe<Scalars['Bytes']>;
  collateralToken_not_contains?: InputMaybe<Scalars['Bytes']>;
  collateralToken_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  collateralWithdrawAmount?: InputMaybe<Scalars['BigDecimal']>;
  collateralWithdrawAmount_gt?: InputMaybe<Scalars['BigDecimal']>;
  collateralWithdrawAmount_gte?: InputMaybe<Scalars['BigDecimal']>;
  collateralWithdrawAmount_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  collateralWithdrawAmount_lt?: InputMaybe<Scalars['BigDecimal']>;
  collateralWithdrawAmount_lte?: InputMaybe<Scalars['BigDecimal']>;
  collateralWithdrawAmount_not?: InputMaybe<Scalars['BigDecimal']>;
  collateralWithdrawAmount_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  currentMargin?: InputMaybe<Scalars['BigDecimal']>;
  currentMargin_gt?: InputMaybe<Scalars['BigDecimal']>;
  currentMargin_gte?: InputMaybe<Scalars['BigDecimal']>;
  currentMargin_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  currentMargin_lt?: InputMaybe<Scalars['BigDecimal']>;
  currentMargin_lte?: InputMaybe<Scalars['BigDecimal']>;
  currentMargin_not?: InputMaybe<Scalars['BigDecimal']>;
  currentMargin_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  emittedBy?: InputMaybe<Scalars['Bytes']>;
  emittedBy_contains?: InputMaybe<Scalars['Bytes']>;
  emittedBy_in?: InputMaybe<Array<Scalars['Bytes']>>;
  emittedBy_not?: InputMaybe<Scalars['Bytes']>;
  emittedBy_not_contains?: InputMaybe<Scalars['Bytes']>;
  emittedBy_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  lender?: InputMaybe<Scalars['Bytes']>;
  lender_contains?: InputMaybe<Scalars['Bytes']>;
  lender_in?: InputMaybe<Array<Scalars['Bytes']>>;
  lender_not?: InputMaybe<Scalars['Bytes']>;
  lender_not_contains?: InputMaybe<Scalars['Bytes']>;
  lender_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  liquidator?: InputMaybe<Scalars['Bytes']>;
  liquidator_contains?: InputMaybe<Scalars['Bytes']>;
  liquidator_in?: InputMaybe<Array<Scalars['Bytes']>>;
  liquidator_not?: InputMaybe<Scalars['Bytes']>;
  liquidator_not_contains?: InputMaybe<Scalars['Bytes']>;
  liquidator_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  loanId?: InputMaybe<Scalars['String']>;
  loanId_?: InputMaybe<Loan_Filter>;
  loanId_contains?: InputMaybe<Scalars['String']>;
  loanId_contains_nocase?: InputMaybe<Scalars['String']>;
  loanId_ends_with?: InputMaybe<Scalars['String']>;
  loanId_ends_with_nocase?: InputMaybe<Scalars['String']>;
  loanId_gt?: InputMaybe<Scalars['String']>;
  loanId_gte?: InputMaybe<Scalars['String']>;
  loanId_in?: InputMaybe<Array<Scalars['String']>>;
  loanId_lt?: InputMaybe<Scalars['String']>;
  loanId_lte?: InputMaybe<Scalars['String']>;
  loanId_not?: InputMaybe<Scalars['String']>;
  loanId_not_contains?: InputMaybe<Scalars['String']>;
  loanId_not_contains_nocase?: InputMaybe<Scalars['String']>;
  loanId_not_ends_with?: InputMaybe<Scalars['String']>;
  loanId_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  loanId_not_in?: InputMaybe<Array<Scalars['String']>>;
  loanId_not_starts_with?: InputMaybe<Scalars['String']>;
  loanId_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  loanId_starts_with?: InputMaybe<Scalars['String']>;
  loanId_starts_with_nocase?: InputMaybe<Scalars['String']>;
  loanToken?: InputMaybe<Scalars['Bytes']>;
  loanToken_contains?: InputMaybe<Scalars['Bytes']>;
  loanToken_in?: InputMaybe<Array<Scalars['Bytes']>>;
  loanToken_not?: InputMaybe<Scalars['Bytes']>;
  loanToken_not_contains?: InputMaybe<Scalars['Bytes']>;
  loanToken_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  repayAmount?: InputMaybe<Scalars['BigDecimal']>;
  repayAmount_gt?: InputMaybe<Scalars['BigDecimal']>;
  repayAmount_gte?: InputMaybe<Scalars['BigDecimal']>;
  repayAmount_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  repayAmount_lt?: InputMaybe<Scalars['BigDecimal']>;
  repayAmount_lte?: InputMaybe<Scalars['BigDecimal']>;
  repayAmount_not?: InputMaybe<Scalars['BigDecimal']>;
  repayAmount_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  timestamp?: InputMaybe<Scalars['Int']>;
  timestamp_gt?: InputMaybe<Scalars['Int']>;
  timestamp_gte?: InputMaybe<Scalars['Int']>;
  timestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp_lt?: InputMaybe<Scalars['Int']>;
  timestamp_lte?: InputMaybe<Scalars['Int']>;
  timestamp_not?: InputMaybe<Scalars['Int']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
  transaction?: InputMaybe<Scalars['String']>;
  transaction_?: InputMaybe<Transaction_Filter>;
  transaction_contains?: InputMaybe<Scalars['String']>;
  transaction_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_gt?: InputMaybe<Scalars['String']>;
  transaction_gte?: InputMaybe<Scalars['String']>;
  transaction_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_lt?: InputMaybe<Scalars['String']>;
  transaction_lte?: InputMaybe<Scalars['String']>;
  transaction_not?: InputMaybe<Scalars['String']>;
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_not_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
  transaction_starts_with_nocase?: InputMaybe<Scalars['String']>;
  user?: InputMaybe<Scalars['String']>;
  user_?: InputMaybe<User_Filter>;
  user_contains?: InputMaybe<Scalars['String']>;
  user_contains_nocase?: InputMaybe<Scalars['String']>;
  user_ends_with?: InputMaybe<Scalars['String']>;
  user_ends_with_nocase?: InputMaybe<Scalars['String']>;
  user_gt?: InputMaybe<Scalars['String']>;
  user_gte?: InputMaybe<Scalars['String']>;
  user_in?: InputMaybe<Array<Scalars['String']>>;
  user_lt?: InputMaybe<Scalars['String']>;
  user_lte?: InputMaybe<Scalars['String']>;
  user_not?: InputMaybe<Scalars['String']>;
  user_not_contains?: InputMaybe<Scalars['String']>;
  user_not_contains_nocase?: InputMaybe<Scalars['String']>;
  user_not_ends_with?: InputMaybe<Scalars['String']>;
  user_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  user_not_in?: InputMaybe<Array<Scalars['String']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']>;
  user_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  user_starts_with?: InputMaybe<Scalars['String']>;
  user_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum Liquidate_OrderBy {
  CollateralToLoanRate = 'collateralToLoanRate',
  CollateralToken = 'collateralToken',
  CollateralWithdrawAmount = 'collateralWithdrawAmount',
  CurrentMargin = 'currentMargin',
  EmittedBy = 'emittedBy',
  Id = 'id',
  Lender = 'lender',
  Liquidator = 'liquidator',
  LoanId = 'loanId',
  LoanToken = 'loanToken',
  RepayAmount = 'repayAmount',
  Timestamp = 'timestamp',
  Transaction = 'transaction',
  User = 'user',
}

export type LiquidityHistoryItem = {
  __typename?: 'LiquidityHistoryItem';
  /**
   * The amount that was added/removed
   *
   */
  amount: Scalars['BigDecimal'];
  /**
   * The contract that emitted this event (primarily used for debugging)
   *
   */
  emittedBy: Scalars['String'];
  /**
   * ID is transaction hash + log index
   *
   */
  id: Scalars['ID'];
  /**
   * AMM pool that liquidity was provided to
   *
   */
  liquidityPool: LiquidityPool;
  /**
   * New balance of the reserveToken (ERC20 token) on the AMM pool
   *
   */
  newBalance: Scalars['BigDecimal'];
  /**
   * New total supply of pool tokens
   *
   */
  newSupply: Scalars['BigDecimal'];
  /**
   * Provider is either the user, or a contract if the user interacted with a proxy contract
   *
   */
  provider: Scalars['String'];
  /**
   * The underlying asset (ERC20 token) that was added/removed
   *
   */
  reserveToken: Token;
  timestamp: Scalars['Int'];
  transaction: Transaction;
  /**
   * Type is either Added or Removed (if a user added or removed liquidity from the pool)
   *
   */
  type: LiquidityHistoryType;
  user: User;
  /**
   * Foreign key to join this transaction to the parent UserLiquidityHistory entity
   *
   */
  userLiquidityHistory: UserLiquidityHistory;
};

export type LiquidityHistoryItem_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars['BigDecimal']>;
  amount_gt?: InputMaybe<Scalars['BigDecimal']>;
  amount_gte?: InputMaybe<Scalars['BigDecimal']>;
  amount_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  amount_lt?: InputMaybe<Scalars['BigDecimal']>;
  amount_lte?: InputMaybe<Scalars['BigDecimal']>;
  amount_not?: InputMaybe<Scalars['BigDecimal']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  emittedBy?: InputMaybe<Scalars['String']>;
  emittedBy_contains?: InputMaybe<Scalars['String']>;
  emittedBy_contains_nocase?: InputMaybe<Scalars['String']>;
  emittedBy_ends_with?: InputMaybe<Scalars['String']>;
  emittedBy_ends_with_nocase?: InputMaybe<Scalars['String']>;
  emittedBy_gt?: InputMaybe<Scalars['String']>;
  emittedBy_gte?: InputMaybe<Scalars['String']>;
  emittedBy_in?: InputMaybe<Array<Scalars['String']>>;
  emittedBy_lt?: InputMaybe<Scalars['String']>;
  emittedBy_lte?: InputMaybe<Scalars['String']>;
  emittedBy_not?: InputMaybe<Scalars['String']>;
  emittedBy_not_contains?: InputMaybe<Scalars['String']>;
  emittedBy_not_contains_nocase?: InputMaybe<Scalars['String']>;
  emittedBy_not_ends_with?: InputMaybe<Scalars['String']>;
  emittedBy_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  emittedBy_not_in?: InputMaybe<Array<Scalars['String']>>;
  emittedBy_not_starts_with?: InputMaybe<Scalars['String']>;
  emittedBy_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  emittedBy_starts_with?: InputMaybe<Scalars['String']>;
  emittedBy_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  liquidityPool?: InputMaybe<Scalars['String']>;
  liquidityPool_?: InputMaybe<LiquidityPool_Filter>;
  liquidityPool_contains?: InputMaybe<Scalars['String']>;
  liquidityPool_contains_nocase?: InputMaybe<Scalars['String']>;
  liquidityPool_ends_with?: InputMaybe<Scalars['String']>;
  liquidityPool_ends_with_nocase?: InputMaybe<Scalars['String']>;
  liquidityPool_gt?: InputMaybe<Scalars['String']>;
  liquidityPool_gte?: InputMaybe<Scalars['String']>;
  liquidityPool_in?: InputMaybe<Array<Scalars['String']>>;
  liquidityPool_lt?: InputMaybe<Scalars['String']>;
  liquidityPool_lte?: InputMaybe<Scalars['String']>;
  liquidityPool_not?: InputMaybe<Scalars['String']>;
  liquidityPool_not_contains?: InputMaybe<Scalars['String']>;
  liquidityPool_not_contains_nocase?: InputMaybe<Scalars['String']>;
  liquidityPool_not_ends_with?: InputMaybe<Scalars['String']>;
  liquidityPool_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  liquidityPool_not_in?: InputMaybe<Array<Scalars['String']>>;
  liquidityPool_not_starts_with?: InputMaybe<Scalars['String']>;
  liquidityPool_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  liquidityPool_starts_with?: InputMaybe<Scalars['String']>;
  liquidityPool_starts_with_nocase?: InputMaybe<Scalars['String']>;
  newBalance?: InputMaybe<Scalars['BigDecimal']>;
  newBalance_gt?: InputMaybe<Scalars['BigDecimal']>;
  newBalance_gte?: InputMaybe<Scalars['BigDecimal']>;
  newBalance_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  newBalance_lt?: InputMaybe<Scalars['BigDecimal']>;
  newBalance_lte?: InputMaybe<Scalars['BigDecimal']>;
  newBalance_not?: InputMaybe<Scalars['BigDecimal']>;
  newBalance_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  newSupply?: InputMaybe<Scalars['BigDecimal']>;
  newSupply_gt?: InputMaybe<Scalars['BigDecimal']>;
  newSupply_gte?: InputMaybe<Scalars['BigDecimal']>;
  newSupply_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  newSupply_lt?: InputMaybe<Scalars['BigDecimal']>;
  newSupply_lte?: InputMaybe<Scalars['BigDecimal']>;
  newSupply_not?: InputMaybe<Scalars['BigDecimal']>;
  newSupply_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  provider?: InputMaybe<Scalars['String']>;
  provider_contains?: InputMaybe<Scalars['String']>;
  provider_contains_nocase?: InputMaybe<Scalars['String']>;
  provider_ends_with?: InputMaybe<Scalars['String']>;
  provider_ends_with_nocase?: InputMaybe<Scalars['String']>;
  provider_gt?: InputMaybe<Scalars['String']>;
  provider_gte?: InputMaybe<Scalars['String']>;
  provider_in?: InputMaybe<Array<Scalars['String']>>;
  provider_lt?: InputMaybe<Scalars['String']>;
  provider_lte?: InputMaybe<Scalars['String']>;
  provider_not?: InputMaybe<Scalars['String']>;
  provider_not_contains?: InputMaybe<Scalars['String']>;
  provider_not_contains_nocase?: InputMaybe<Scalars['String']>;
  provider_not_ends_with?: InputMaybe<Scalars['String']>;
  provider_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  provider_not_in?: InputMaybe<Array<Scalars['String']>>;
  provider_not_starts_with?: InputMaybe<Scalars['String']>;
  provider_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  provider_starts_with?: InputMaybe<Scalars['String']>;
  provider_starts_with_nocase?: InputMaybe<Scalars['String']>;
  reserveToken?: InputMaybe<Scalars['String']>;
  reserveToken_?: InputMaybe<Token_Filter>;
  reserveToken_contains?: InputMaybe<Scalars['String']>;
  reserveToken_contains_nocase?: InputMaybe<Scalars['String']>;
  reserveToken_ends_with?: InputMaybe<Scalars['String']>;
  reserveToken_ends_with_nocase?: InputMaybe<Scalars['String']>;
  reserveToken_gt?: InputMaybe<Scalars['String']>;
  reserveToken_gte?: InputMaybe<Scalars['String']>;
  reserveToken_in?: InputMaybe<Array<Scalars['String']>>;
  reserveToken_lt?: InputMaybe<Scalars['String']>;
  reserveToken_lte?: InputMaybe<Scalars['String']>;
  reserveToken_not?: InputMaybe<Scalars['String']>;
  reserveToken_not_contains?: InputMaybe<Scalars['String']>;
  reserveToken_not_contains_nocase?: InputMaybe<Scalars['String']>;
  reserveToken_not_ends_with?: InputMaybe<Scalars['String']>;
  reserveToken_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  reserveToken_not_in?: InputMaybe<Array<Scalars['String']>>;
  reserveToken_not_starts_with?: InputMaybe<Scalars['String']>;
  reserveToken_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  reserveToken_starts_with?: InputMaybe<Scalars['String']>;
  reserveToken_starts_with_nocase?: InputMaybe<Scalars['String']>;
  timestamp?: InputMaybe<Scalars['Int']>;
  timestamp_gt?: InputMaybe<Scalars['Int']>;
  timestamp_gte?: InputMaybe<Scalars['Int']>;
  timestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp_lt?: InputMaybe<Scalars['Int']>;
  timestamp_lte?: InputMaybe<Scalars['Int']>;
  timestamp_not?: InputMaybe<Scalars['Int']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
  transaction?: InputMaybe<Scalars['String']>;
  transaction_?: InputMaybe<Transaction_Filter>;
  transaction_contains?: InputMaybe<Scalars['String']>;
  transaction_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_gt?: InputMaybe<Scalars['String']>;
  transaction_gte?: InputMaybe<Scalars['String']>;
  transaction_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_lt?: InputMaybe<Scalars['String']>;
  transaction_lte?: InputMaybe<Scalars['String']>;
  transaction_not?: InputMaybe<Scalars['String']>;
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_not_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
  transaction_starts_with_nocase?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<LiquidityHistoryType>;
  type_in?: InputMaybe<Array<LiquidityHistoryType>>;
  type_not?: InputMaybe<LiquidityHistoryType>;
  type_not_in?: InputMaybe<Array<LiquidityHistoryType>>;
  user?: InputMaybe<Scalars['String']>;
  userLiquidityHistory?: InputMaybe<Scalars['String']>;
  userLiquidityHistory_?: InputMaybe<UserLiquidityHistory_Filter>;
  userLiquidityHistory_contains?: InputMaybe<Scalars['String']>;
  userLiquidityHistory_contains_nocase?: InputMaybe<Scalars['String']>;
  userLiquidityHistory_ends_with?: InputMaybe<Scalars['String']>;
  userLiquidityHistory_ends_with_nocase?: InputMaybe<Scalars['String']>;
  userLiquidityHistory_gt?: InputMaybe<Scalars['String']>;
  userLiquidityHistory_gte?: InputMaybe<Scalars['String']>;
  userLiquidityHistory_in?: InputMaybe<Array<Scalars['String']>>;
  userLiquidityHistory_lt?: InputMaybe<Scalars['String']>;
  userLiquidityHistory_lte?: InputMaybe<Scalars['String']>;
  userLiquidityHistory_not?: InputMaybe<Scalars['String']>;
  userLiquidityHistory_not_contains?: InputMaybe<Scalars['String']>;
  userLiquidityHistory_not_contains_nocase?: InputMaybe<Scalars['String']>;
  userLiquidityHistory_not_ends_with?: InputMaybe<Scalars['String']>;
  userLiquidityHistory_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  userLiquidityHistory_not_in?: InputMaybe<Array<Scalars['String']>>;
  userLiquidityHistory_not_starts_with?: InputMaybe<Scalars['String']>;
  userLiquidityHistory_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  userLiquidityHistory_starts_with?: InputMaybe<Scalars['String']>;
  userLiquidityHistory_starts_with_nocase?: InputMaybe<Scalars['String']>;
  user_?: InputMaybe<User_Filter>;
  user_contains?: InputMaybe<Scalars['String']>;
  user_contains_nocase?: InputMaybe<Scalars['String']>;
  user_ends_with?: InputMaybe<Scalars['String']>;
  user_ends_with_nocase?: InputMaybe<Scalars['String']>;
  user_gt?: InputMaybe<Scalars['String']>;
  user_gte?: InputMaybe<Scalars['String']>;
  user_in?: InputMaybe<Array<Scalars['String']>>;
  user_lt?: InputMaybe<Scalars['String']>;
  user_lte?: InputMaybe<Scalars['String']>;
  user_not?: InputMaybe<Scalars['String']>;
  user_not_contains?: InputMaybe<Scalars['String']>;
  user_not_contains_nocase?: InputMaybe<Scalars['String']>;
  user_not_ends_with?: InputMaybe<Scalars['String']>;
  user_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  user_not_in?: InputMaybe<Array<Scalars['String']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']>;
  user_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  user_starts_with?: InputMaybe<Scalars['String']>;
  user_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum LiquidityHistoryItem_OrderBy {
  Amount = 'amount',
  EmittedBy = 'emittedBy',
  Id = 'id',
  LiquidityPool = 'liquidityPool',
  NewBalance = 'newBalance',
  NewSupply = 'newSupply',
  Provider = 'provider',
  ReserveToken = 'reserveToken',
  Timestamp = 'timestamp',
  Transaction = 'transaction',
  Type = 'type',
  User = 'user',
  UserLiquidityHistory = 'userLiquidityHistory',
}

export enum LiquidityHistoryType {
  Added = 'Added',
  Removed = 'Removed',
}

export type LiquidityMiningAllocationPoint = {
  __typename?: 'LiquidityMiningAllocationPoint';
  allocationPoint: Scalars['BigInt'];
  /**
   * If this pool token is for an AMM liquidity pool, this is a foreign key to the SmartToken.
   * If not, this property is null
   *
   */
  ammPoolToken?: Maybe<SmartToken>;
  id: Scalars['ID'];
  /**
   * If this pool token is for a lending pool, this is a foreign key to the LendingPool.
   * If not, this property is null
   *
   */
  lendingPoolToken?: Maybe<LendingPool>;
  poolTokenAddedBlock: Scalars['Int'];
  /**
   * Unix timestamp for when this pool token was added to the liquidity mining program
   *
   */
  poolTokenAddedTimestamp: Scalars['Int'];
  poolTokenUpdatedBlock: Scalars['Int'];
  /**
   * Unix timestamp for when the allocation point for this pool token last changed
   *
   */
  poolTokenUpdatedTimestamp: Scalars['Int'];
  /**
   * The amount of SOV earned per block by all LPs in one pool
   * Calculated as (totalRewardPerBlock * allocationPoint) / totalAllocationPoint
   *
   */
  rewardPerBlock: Scalars['BigDecimal'];
};

export type LiquidityMiningAllocationPoint_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  allocationPoint?: InputMaybe<Scalars['BigInt']>;
  allocationPoint_gt?: InputMaybe<Scalars['BigInt']>;
  allocationPoint_gte?: InputMaybe<Scalars['BigInt']>;
  allocationPoint_in?: InputMaybe<Array<Scalars['BigInt']>>;
  allocationPoint_lt?: InputMaybe<Scalars['BigInt']>;
  allocationPoint_lte?: InputMaybe<Scalars['BigInt']>;
  allocationPoint_not?: InputMaybe<Scalars['BigInt']>;
  allocationPoint_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  ammPoolToken?: InputMaybe<Scalars['String']>;
  ammPoolToken_?: InputMaybe<SmartToken_Filter>;
  ammPoolToken_contains?: InputMaybe<Scalars['String']>;
  ammPoolToken_contains_nocase?: InputMaybe<Scalars['String']>;
  ammPoolToken_ends_with?: InputMaybe<Scalars['String']>;
  ammPoolToken_ends_with_nocase?: InputMaybe<Scalars['String']>;
  ammPoolToken_gt?: InputMaybe<Scalars['String']>;
  ammPoolToken_gte?: InputMaybe<Scalars['String']>;
  ammPoolToken_in?: InputMaybe<Array<Scalars['String']>>;
  ammPoolToken_lt?: InputMaybe<Scalars['String']>;
  ammPoolToken_lte?: InputMaybe<Scalars['String']>;
  ammPoolToken_not?: InputMaybe<Scalars['String']>;
  ammPoolToken_not_contains?: InputMaybe<Scalars['String']>;
  ammPoolToken_not_contains_nocase?: InputMaybe<Scalars['String']>;
  ammPoolToken_not_ends_with?: InputMaybe<Scalars['String']>;
  ammPoolToken_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  ammPoolToken_not_in?: InputMaybe<Array<Scalars['String']>>;
  ammPoolToken_not_starts_with?: InputMaybe<Scalars['String']>;
  ammPoolToken_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  ammPoolToken_starts_with?: InputMaybe<Scalars['String']>;
  ammPoolToken_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  lendingPoolToken?: InputMaybe<Scalars['String']>;
  lendingPoolToken_?: InputMaybe<LendingPool_Filter>;
  lendingPoolToken_contains?: InputMaybe<Scalars['String']>;
  lendingPoolToken_contains_nocase?: InputMaybe<Scalars['String']>;
  lendingPoolToken_ends_with?: InputMaybe<Scalars['String']>;
  lendingPoolToken_ends_with_nocase?: InputMaybe<Scalars['String']>;
  lendingPoolToken_gt?: InputMaybe<Scalars['String']>;
  lendingPoolToken_gte?: InputMaybe<Scalars['String']>;
  lendingPoolToken_in?: InputMaybe<Array<Scalars['String']>>;
  lendingPoolToken_lt?: InputMaybe<Scalars['String']>;
  lendingPoolToken_lte?: InputMaybe<Scalars['String']>;
  lendingPoolToken_not?: InputMaybe<Scalars['String']>;
  lendingPoolToken_not_contains?: InputMaybe<Scalars['String']>;
  lendingPoolToken_not_contains_nocase?: InputMaybe<Scalars['String']>;
  lendingPoolToken_not_ends_with?: InputMaybe<Scalars['String']>;
  lendingPoolToken_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  lendingPoolToken_not_in?: InputMaybe<Array<Scalars['String']>>;
  lendingPoolToken_not_starts_with?: InputMaybe<Scalars['String']>;
  lendingPoolToken_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  lendingPoolToken_starts_with?: InputMaybe<Scalars['String']>;
  lendingPoolToken_starts_with_nocase?: InputMaybe<Scalars['String']>;
  poolTokenAddedBlock?: InputMaybe<Scalars['Int']>;
  poolTokenAddedBlock_gt?: InputMaybe<Scalars['Int']>;
  poolTokenAddedBlock_gte?: InputMaybe<Scalars['Int']>;
  poolTokenAddedBlock_in?: InputMaybe<Array<Scalars['Int']>>;
  poolTokenAddedBlock_lt?: InputMaybe<Scalars['Int']>;
  poolTokenAddedBlock_lte?: InputMaybe<Scalars['Int']>;
  poolTokenAddedBlock_not?: InputMaybe<Scalars['Int']>;
  poolTokenAddedBlock_not_in?: InputMaybe<Array<Scalars['Int']>>;
  poolTokenAddedTimestamp?: InputMaybe<Scalars['Int']>;
  poolTokenAddedTimestamp_gt?: InputMaybe<Scalars['Int']>;
  poolTokenAddedTimestamp_gte?: InputMaybe<Scalars['Int']>;
  poolTokenAddedTimestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  poolTokenAddedTimestamp_lt?: InputMaybe<Scalars['Int']>;
  poolTokenAddedTimestamp_lte?: InputMaybe<Scalars['Int']>;
  poolTokenAddedTimestamp_not?: InputMaybe<Scalars['Int']>;
  poolTokenAddedTimestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
  poolTokenUpdatedBlock?: InputMaybe<Scalars['Int']>;
  poolTokenUpdatedBlock_gt?: InputMaybe<Scalars['Int']>;
  poolTokenUpdatedBlock_gte?: InputMaybe<Scalars['Int']>;
  poolTokenUpdatedBlock_in?: InputMaybe<Array<Scalars['Int']>>;
  poolTokenUpdatedBlock_lt?: InputMaybe<Scalars['Int']>;
  poolTokenUpdatedBlock_lte?: InputMaybe<Scalars['Int']>;
  poolTokenUpdatedBlock_not?: InputMaybe<Scalars['Int']>;
  poolTokenUpdatedBlock_not_in?: InputMaybe<Array<Scalars['Int']>>;
  poolTokenUpdatedTimestamp?: InputMaybe<Scalars['Int']>;
  poolTokenUpdatedTimestamp_gt?: InputMaybe<Scalars['Int']>;
  poolTokenUpdatedTimestamp_gte?: InputMaybe<Scalars['Int']>;
  poolTokenUpdatedTimestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  poolTokenUpdatedTimestamp_lt?: InputMaybe<Scalars['Int']>;
  poolTokenUpdatedTimestamp_lte?: InputMaybe<Scalars['Int']>;
  poolTokenUpdatedTimestamp_not?: InputMaybe<Scalars['Int']>;
  poolTokenUpdatedTimestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
  rewardPerBlock?: InputMaybe<Scalars['BigDecimal']>;
  rewardPerBlock_gt?: InputMaybe<Scalars['BigDecimal']>;
  rewardPerBlock_gte?: InputMaybe<Scalars['BigDecimal']>;
  rewardPerBlock_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  rewardPerBlock_lt?: InputMaybe<Scalars['BigDecimal']>;
  rewardPerBlock_lte?: InputMaybe<Scalars['BigDecimal']>;
  rewardPerBlock_not?: InputMaybe<Scalars['BigDecimal']>;
  rewardPerBlock_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
};

export enum LiquidityMiningAllocationPoint_OrderBy {
  AllocationPoint = 'allocationPoint',
  AmmPoolToken = 'ammPoolToken',
  Id = 'id',
  LendingPoolToken = 'lendingPoolToken',
  PoolTokenAddedBlock = 'poolTokenAddedBlock',
  PoolTokenAddedTimestamp = 'poolTokenAddedTimestamp',
  PoolTokenUpdatedBlock = 'poolTokenUpdatedBlock',
  PoolTokenUpdatedTimestamp = 'poolTokenUpdatedTimestamp',
  RewardPerBlock = 'rewardPerBlock',
}

/**
 * This entity has only one instance (id: 0), and holds global variables required for liquidity mining rewards calculations
 *
 */
export type LiquidityMiningGlobal = {
  __typename?: 'LiquidityMiningGlobal';
  id: Scalars['ID'];
  /**
   * Total available allocation points. This is used to calculated the reward per block for each pool token.
   * See the LiquidityMiningAllocationPoint entity for more details.
   *
   */
  totalAllocationPoint: Scalars['BigInt'];
  /**
   * Total possible SOV per block in the liquidity mining program. Not all of this has to be allocation (eg if totalRewardPerBlock = 1000, that does not mean 1000 SOV are being given to LPs per block)
   * This is used to calculated the reward per block for each pool token.
   * See the LiquidityMiningAllocationPoint entity for more details.
   *
   */
  totalRewardPerBlock: Scalars['BigInt'];
};

export type LiquidityMiningGlobal_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  totalAllocationPoint?: InputMaybe<Scalars['BigInt']>;
  totalAllocationPoint_gt?: InputMaybe<Scalars['BigInt']>;
  totalAllocationPoint_gte?: InputMaybe<Scalars['BigInt']>;
  totalAllocationPoint_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalAllocationPoint_lt?: InputMaybe<Scalars['BigInt']>;
  totalAllocationPoint_lte?: InputMaybe<Scalars['BigInt']>;
  totalAllocationPoint_not?: InputMaybe<Scalars['BigInt']>;
  totalAllocationPoint_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalRewardPerBlock?: InputMaybe<Scalars['BigInt']>;
  totalRewardPerBlock_gt?: InputMaybe<Scalars['BigInt']>;
  totalRewardPerBlock_gte?: InputMaybe<Scalars['BigInt']>;
  totalRewardPerBlock_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalRewardPerBlock_lt?: InputMaybe<Scalars['BigInt']>;
  totalRewardPerBlock_lte?: InputMaybe<Scalars['BigInt']>;
  totalRewardPerBlock_not?: InputMaybe<Scalars['BigInt']>;
  totalRewardPerBlock_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export enum LiquidityMiningGlobal_OrderBy {
  Id = 'id',
  TotalAllocationPoint = 'totalAllocationPoint',
  TotalRewardPerBlock = 'totalRewardPerBlock',
}

/**
 * AMM Pool (sometimes referred to as a Converter)
 *
 */
export type LiquidityPool = {
  __typename?: 'LiquidityPool';
  /**
   * Activated with be true when this pool is activated, and will change to false is the pool is deactivated
   *
   */
  activated?: Maybe<Scalars['Boolean']>;
  connectorTokens: Array<LiquidityPoolToken>;
  /**
   * Divide by maxConversionFee to get percentage
   *
   */
  conversionFee?: Maybe<Scalars['BigInt']>;
  conversions?: Maybe<Array<PoolVolumeItem>>;
  createdAtBlockNumber?: Maybe<Scalars['Int']>;
  createdAtTimestamp?: Maybe<Scalars['Int']>;
  createdAtTransaction: Transaction;
  currentConverterRegistry?: Maybe<ConverterRegistry>;
  /**
   * ID is the contract address of the Converter
   *
   */
  id: Scalars['ID'];
  maxConversionFee?: Maybe<Scalars['BigInt']>;
  owner?: Maybe<Scalars['String']>;
  poolTokens?: Maybe<Array<PoolToken>>;
  smartToken?: Maybe<SmartToken>;
  /**
   * The reserve assets of this AMM Pool. The are stored here like this so that they can be accessed inside mappings when the LiquidityPool is loaded.
   *
   */
  token0?: Maybe<Token>;
  /**
   * The balance for each token on this liquidity pool
   * NB: For the V2 pools (USDT, DOC, BPRO), this balance is the staked balance, not the contract balance
   *
   */
  token0Balance: Scalars['BigDecimal'];
  token1?: Maybe<Token>;
  token1Balance: Scalars['BigDecimal'];
  /**
   * Sovryn uses Bancor V1 and Bancor V2 pools
   *
   */
  type?: Maybe<Scalars['Int']>;
  version?: Maybe<Scalars['Int']>;
};

/**
 * AMM Pool (sometimes referred to as a Converter)
 *
 */
export type LiquidityPoolConnectorTokensArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<LiquidityPoolToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<LiquidityPoolToken_Filter>;
};

/**
 * AMM Pool (sometimes referred to as a Converter)
 *
 */
export type LiquidityPoolConversionsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<PoolVolumeItem_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<PoolVolumeItem_Filter>;
};

/**
 * AMM Pool (sometimes referred to as a Converter)
 *
 */
export type LiquidityPoolPoolTokensArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<PoolToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<PoolToken_Filter>;
};

/**
 * This entity stores the relationship between liquidity pools and underlying tokens
 * It also currently stores the total volumes bought and sold, but this should be moved to the LiquidityPool
 *
 */
export type LiquidityPoolToken = {
  __typename?: 'LiquidityPoolToken';
  /**
   * ID is liquidityPool address + tokenAddress
   *
   */
  id: Scalars['ID'];
  liquidityPool: LiquidityPool;
  /**
   * The pool token that represents this token-liquidityPool relationship
   *
   */
  poolToken: PoolToken;
  token: Token;
  /**
   * Total volume of this token that has been bought or sold through this liquidity pool
   *
   */
  totalVolume: Scalars['BigDecimal'];
  /**
   * Total volume of this token bought through this liquidity pool
   *
   */
  volumeBought: Scalars['BigDecimal'];
  /**
   * Total volume of this token sold through this liquidity pool
   *
   */
  volumeSold: Scalars['BigDecimal'];
};

export type LiquidityPoolToken_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  liquidityPool?: InputMaybe<Scalars['String']>;
  liquidityPool_?: InputMaybe<LiquidityPool_Filter>;
  liquidityPool_contains?: InputMaybe<Scalars['String']>;
  liquidityPool_contains_nocase?: InputMaybe<Scalars['String']>;
  liquidityPool_ends_with?: InputMaybe<Scalars['String']>;
  liquidityPool_ends_with_nocase?: InputMaybe<Scalars['String']>;
  liquidityPool_gt?: InputMaybe<Scalars['String']>;
  liquidityPool_gte?: InputMaybe<Scalars['String']>;
  liquidityPool_in?: InputMaybe<Array<Scalars['String']>>;
  liquidityPool_lt?: InputMaybe<Scalars['String']>;
  liquidityPool_lte?: InputMaybe<Scalars['String']>;
  liquidityPool_not?: InputMaybe<Scalars['String']>;
  liquidityPool_not_contains?: InputMaybe<Scalars['String']>;
  liquidityPool_not_contains_nocase?: InputMaybe<Scalars['String']>;
  liquidityPool_not_ends_with?: InputMaybe<Scalars['String']>;
  liquidityPool_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  liquidityPool_not_in?: InputMaybe<Array<Scalars['String']>>;
  liquidityPool_not_starts_with?: InputMaybe<Scalars['String']>;
  liquidityPool_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  liquidityPool_starts_with?: InputMaybe<Scalars['String']>;
  liquidityPool_starts_with_nocase?: InputMaybe<Scalars['String']>;
  poolToken?: InputMaybe<Scalars['String']>;
  poolToken_?: InputMaybe<PoolToken_Filter>;
  poolToken_contains?: InputMaybe<Scalars['String']>;
  poolToken_contains_nocase?: InputMaybe<Scalars['String']>;
  poolToken_ends_with?: InputMaybe<Scalars['String']>;
  poolToken_ends_with_nocase?: InputMaybe<Scalars['String']>;
  poolToken_gt?: InputMaybe<Scalars['String']>;
  poolToken_gte?: InputMaybe<Scalars['String']>;
  poolToken_in?: InputMaybe<Array<Scalars['String']>>;
  poolToken_lt?: InputMaybe<Scalars['String']>;
  poolToken_lte?: InputMaybe<Scalars['String']>;
  poolToken_not?: InputMaybe<Scalars['String']>;
  poolToken_not_contains?: InputMaybe<Scalars['String']>;
  poolToken_not_contains_nocase?: InputMaybe<Scalars['String']>;
  poolToken_not_ends_with?: InputMaybe<Scalars['String']>;
  poolToken_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  poolToken_not_in?: InputMaybe<Array<Scalars['String']>>;
  poolToken_not_starts_with?: InputMaybe<Scalars['String']>;
  poolToken_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  poolToken_starts_with?: InputMaybe<Scalars['String']>;
  poolToken_starts_with_nocase?: InputMaybe<Scalars['String']>;
  token?: InputMaybe<Scalars['String']>;
  token_?: InputMaybe<Token_Filter>;
  token_contains?: InputMaybe<Scalars['String']>;
  token_contains_nocase?: InputMaybe<Scalars['String']>;
  token_ends_with?: InputMaybe<Scalars['String']>;
  token_ends_with_nocase?: InputMaybe<Scalars['String']>;
  token_gt?: InputMaybe<Scalars['String']>;
  token_gte?: InputMaybe<Scalars['String']>;
  token_in?: InputMaybe<Array<Scalars['String']>>;
  token_lt?: InputMaybe<Scalars['String']>;
  token_lte?: InputMaybe<Scalars['String']>;
  token_not?: InputMaybe<Scalars['String']>;
  token_not_contains?: InputMaybe<Scalars['String']>;
  token_not_contains_nocase?: InputMaybe<Scalars['String']>;
  token_not_ends_with?: InputMaybe<Scalars['String']>;
  token_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  token_not_in?: InputMaybe<Array<Scalars['String']>>;
  token_not_starts_with?: InputMaybe<Scalars['String']>;
  token_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  token_starts_with?: InputMaybe<Scalars['String']>;
  token_starts_with_nocase?: InputMaybe<Scalars['String']>;
  totalVolume?: InputMaybe<Scalars['BigDecimal']>;
  totalVolume_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalVolume_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalVolume_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalVolume_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalVolume_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalVolume_not?: InputMaybe<Scalars['BigDecimal']>;
  totalVolume_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  volumeBought?: InputMaybe<Scalars['BigDecimal']>;
  volumeBought_gt?: InputMaybe<Scalars['BigDecimal']>;
  volumeBought_gte?: InputMaybe<Scalars['BigDecimal']>;
  volumeBought_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  volumeBought_lt?: InputMaybe<Scalars['BigDecimal']>;
  volumeBought_lte?: InputMaybe<Scalars['BigDecimal']>;
  volumeBought_not?: InputMaybe<Scalars['BigDecimal']>;
  volumeBought_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  volumeSold?: InputMaybe<Scalars['BigDecimal']>;
  volumeSold_gt?: InputMaybe<Scalars['BigDecimal']>;
  volumeSold_gte?: InputMaybe<Scalars['BigDecimal']>;
  volumeSold_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  volumeSold_lt?: InputMaybe<Scalars['BigDecimal']>;
  volumeSold_lte?: InputMaybe<Scalars['BigDecimal']>;
  volumeSold_not?: InputMaybe<Scalars['BigDecimal']>;
  volumeSold_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
};

export enum LiquidityPoolToken_OrderBy {
  Id = 'id',
  LiquidityPool = 'liquidityPool',
  PoolToken = 'poolToken',
  Token = 'token',
  TotalVolume = 'totalVolume',
  VolumeBought = 'volumeBought',
  VolumeSold = 'volumeSold',
}

export type LiquidityPool_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  activated?: InputMaybe<Scalars['Boolean']>;
  activated_in?: InputMaybe<Array<Scalars['Boolean']>>;
  activated_not?: InputMaybe<Scalars['Boolean']>;
  activated_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  connectorTokens_?: InputMaybe<LiquidityPoolToken_Filter>;
  conversionFee?: InputMaybe<Scalars['BigInt']>;
  conversionFee_gt?: InputMaybe<Scalars['BigInt']>;
  conversionFee_gte?: InputMaybe<Scalars['BigInt']>;
  conversionFee_in?: InputMaybe<Array<Scalars['BigInt']>>;
  conversionFee_lt?: InputMaybe<Scalars['BigInt']>;
  conversionFee_lte?: InputMaybe<Scalars['BigInt']>;
  conversionFee_not?: InputMaybe<Scalars['BigInt']>;
  conversionFee_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  conversions_?: InputMaybe<PoolVolumeItem_Filter>;
  createdAtBlockNumber?: InputMaybe<Scalars['Int']>;
  createdAtBlockNumber_gt?: InputMaybe<Scalars['Int']>;
  createdAtBlockNumber_gte?: InputMaybe<Scalars['Int']>;
  createdAtBlockNumber_in?: InputMaybe<Array<Scalars['Int']>>;
  createdAtBlockNumber_lt?: InputMaybe<Scalars['Int']>;
  createdAtBlockNumber_lte?: InputMaybe<Scalars['Int']>;
  createdAtBlockNumber_not?: InputMaybe<Scalars['Int']>;
  createdAtBlockNumber_not_in?: InputMaybe<Array<Scalars['Int']>>;
  createdAtTimestamp?: InputMaybe<Scalars['Int']>;
  createdAtTimestamp_gt?: InputMaybe<Scalars['Int']>;
  createdAtTimestamp_gte?: InputMaybe<Scalars['Int']>;
  createdAtTimestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  createdAtTimestamp_lt?: InputMaybe<Scalars['Int']>;
  createdAtTimestamp_lte?: InputMaybe<Scalars['Int']>;
  createdAtTimestamp_not?: InputMaybe<Scalars['Int']>;
  createdAtTimestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
  createdAtTransaction?: InputMaybe<Scalars['String']>;
  createdAtTransaction_?: InputMaybe<Transaction_Filter>;
  createdAtTransaction_contains?: InputMaybe<Scalars['String']>;
  createdAtTransaction_contains_nocase?: InputMaybe<Scalars['String']>;
  createdAtTransaction_ends_with?: InputMaybe<Scalars['String']>;
  createdAtTransaction_ends_with_nocase?: InputMaybe<Scalars['String']>;
  createdAtTransaction_gt?: InputMaybe<Scalars['String']>;
  createdAtTransaction_gte?: InputMaybe<Scalars['String']>;
  createdAtTransaction_in?: InputMaybe<Array<Scalars['String']>>;
  createdAtTransaction_lt?: InputMaybe<Scalars['String']>;
  createdAtTransaction_lte?: InputMaybe<Scalars['String']>;
  createdAtTransaction_not?: InputMaybe<Scalars['String']>;
  createdAtTransaction_not_contains?: InputMaybe<Scalars['String']>;
  createdAtTransaction_not_contains_nocase?: InputMaybe<Scalars['String']>;
  createdAtTransaction_not_ends_with?: InputMaybe<Scalars['String']>;
  createdAtTransaction_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  createdAtTransaction_not_in?: InputMaybe<Array<Scalars['String']>>;
  createdAtTransaction_not_starts_with?: InputMaybe<Scalars['String']>;
  createdAtTransaction_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  createdAtTransaction_starts_with?: InputMaybe<Scalars['String']>;
  createdAtTransaction_starts_with_nocase?: InputMaybe<Scalars['String']>;
  currentConverterRegistry?: InputMaybe<Scalars['String']>;
  currentConverterRegistry_?: InputMaybe<ConverterRegistry_Filter>;
  currentConverterRegistry_contains?: InputMaybe<Scalars['String']>;
  currentConverterRegistry_contains_nocase?: InputMaybe<Scalars['String']>;
  currentConverterRegistry_ends_with?: InputMaybe<Scalars['String']>;
  currentConverterRegistry_ends_with_nocase?: InputMaybe<Scalars['String']>;
  currentConverterRegistry_gt?: InputMaybe<Scalars['String']>;
  currentConverterRegistry_gte?: InputMaybe<Scalars['String']>;
  currentConverterRegistry_in?: InputMaybe<Array<Scalars['String']>>;
  currentConverterRegistry_lt?: InputMaybe<Scalars['String']>;
  currentConverterRegistry_lte?: InputMaybe<Scalars['String']>;
  currentConverterRegistry_not?: InputMaybe<Scalars['String']>;
  currentConverterRegistry_not_contains?: InputMaybe<Scalars['String']>;
  currentConverterRegistry_not_contains_nocase?: InputMaybe<Scalars['String']>;
  currentConverterRegistry_not_ends_with?: InputMaybe<Scalars['String']>;
  currentConverterRegistry_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  currentConverterRegistry_not_in?: InputMaybe<Array<Scalars['String']>>;
  currentConverterRegistry_not_starts_with?: InputMaybe<Scalars['String']>;
  currentConverterRegistry_not_starts_with_nocase?: InputMaybe<
    Scalars['String']
  >;
  currentConverterRegistry_starts_with?: InputMaybe<Scalars['String']>;
  currentConverterRegistry_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  maxConversionFee?: InputMaybe<Scalars['BigInt']>;
  maxConversionFee_gt?: InputMaybe<Scalars['BigInt']>;
  maxConversionFee_gte?: InputMaybe<Scalars['BigInt']>;
  maxConversionFee_in?: InputMaybe<Array<Scalars['BigInt']>>;
  maxConversionFee_lt?: InputMaybe<Scalars['BigInt']>;
  maxConversionFee_lte?: InputMaybe<Scalars['BigInt']>;
  maxConversionFee_not?: InputMaybe<Scalars['BigInt']>;
  maxConversionFee_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  owner?: InputMaybe<Scalars['String']>;
  owner_contains?: InputMaybe<Scalars['String']>;
  owner_contains_nocase?: InputMaybe<Scalars['String']>;
  owner_ends_with?: InputMaybe<Scalars['String']>;
  owner_ends_with_nocase?: InputMaybe<Scalars['String']>;
  owner_gt?: InputMaybe<Scalars['String']>;
  owner_gte?: InputMaybe<Scalars['String']>;
  owner_in?: InputMaybe<Array<Scalars['String']>>;
  owner_lt?: InputMaybe<Scalars['String']>;
  owner_lte?: InputMaybe<Scalars['String']>;
  owner_not?: InputMaybe<Scalars['String']>;
  owner_not_contains?: InputMaybe<Scalars['String']>;
  owner_not_contains_nocase?: InputMaybe<Scalars['String']>;
  owner_not_ends_with?: InputMaybe<Scalars['String']>;
  owner_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  owner_not_in?: InputMaybe<Array<Scalars['String']>>;
  owner_not_starts_with?: InputMaybe<Scalars['String']>;
  owner_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  owner_starts_with?: InputMaybe<Scalars['String']>;
  owner_starts_with_nocase?: InputMaybe<Scalars['String']>;
  poolTokens_?: InputMaybe<PoolToken_Filter>;
  smartToken?: InputMaybe<Scalars['String']>;
  smartToken_?: InputMaybe<SmartToken_Filter>;
  smartToken_contains?: InputMaybe<Scalars['String']>;
  smartToken_contains_nocase?: InputMaybe<Scalars['String']>;
  smartToken_ends_with?: InputMaybe<Scalars['String']>;
  smartToken_ends_with_nocase?: InputMaybe<Scalars['String']>;
  smartToken_gt?: InputMaybe<Scalars['String']>;
  smartToken_gte?: InputMaybe<Scalars['String']>;
  smartToken_in?: InputMaybe<Array<Scalars['String']>>;
  smartToken_lt?: InputMaybe<Scalars['String']>;
  smartToken_lte?: InputMaybe<Scalars['String']>;
  smartToken_not?: InputMaybe<Scalars['String']>;
  smartToken_not_contains?: InputMaybe<Scalars['String']>;
  smartToken_not_contains_nocase?: InputMaybe<Scalars['String']>;
  smartToken_not_ends_with?: InputMaybe<Scalars['String']>;
  smartToken_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  smartToken_not_in?: InputMaybe<Array<Scalars['String']>>;
  smartToken_not_starts_with?: InputMaybe<Scalars['String']>;
  smartToken_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  smartToken_starts_with?: InputMaybe<Scalars['String']>;
  smartToken_starts_with_nocase?: InputMaybe<Scalars['String']>;
  token0?: InputMaybe<Scalars['String']>;
  token0Balance?: InputMaybe<Scalars['BigDecimal']>;
  token0Balance_gt?: InputMaybe<Scalars['BigDecimal']>;
  token0Balance_gte?: InputMaybe<Scalars['BigDecimal']>;
  token0Balance_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  token0Balance_lt?: InputMaybe<Scalars['BigDecimal']>;
  token0Balance_lte?: InputMaybe<Scalars['BigDecimal']>;
  token0Balance_not?: InputMaybe<Scalars['BigDecimal']>;
  token0Balance_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  token0_?: InputMaybe<Token_Filter>;
  token0_contains?: InputMaybe<Scalars['String']>;
  token0_contains_nocase?: InputMaybe<Scalars['String']>;
  token0_ends_with?: InputMaybe<Scalars['String']>;
  token0_ends_with_nocase?: InputMaybe<Scalars['String']>;
  token0_gt?: InputMaybe<Scalars['String']>;
  token0_gte?: InputMaybe<Scalars['String']>;
  token0_in?: InputMaybe<Array<Scalars['String']>>;
  token0_lt?: InputMaybe<Scalars['String']>;
  token0_lte?: InputMaybe<Scalars['String']>;
  token0_not?: InputMaybe<Scalars['String']>;
  token0_not_contains?: InputMaybe<Scalars['String']>;
  token0_not_contains_nocase?: InputMaybe<Scalars['String']>;
  token0_not_ends_with?: InputMaybe<Scalars['String']>;
  token0_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  token0_not_in?: InputMaybe<Array<Scalars['String']>>;
  token0_not_starts_with?: InputMaybe<Scalars['String']>;
  token0_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  token0_starts_with?: InputMaybe<Scalars['String']>;
  token0_starts_with_nocase?: InputMaybe<Scalars['String']>;
  token1?: InputMaybe<Scalars['String']>;
  token1Balance?: InputMaybe<Scalars['BigDecimal']>;
  token1Balance_gt?: InputMaybe<Scalars['BigDecimal']>;
  token1Balance_gte?: InputMaybe<Scalars['BigDecimal']>;
  token1Balance_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  token1Balance_lt?: InputMaybe<Scalars['BigDecimal']>;
  token1Balance_lte?: InputMaybe<Scalars['BigDecimal']>;
  token1Balance_not?: InputMaybe<Scalars['BigDecimal']>;
  token1Balance_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  token1_?: InputMaybe<Token_Filter>;
  token1_contains?: InputMaybe<Scalars['String']>;
  token1_contains_nocase?: InputMaybe<Scalars['String']>;
  token1_ends_with?: InputMaybe<Scalars['String']>;
  token1_ends_with_nocase?: InputMaybe<Scalars['String']>;
  token1_gt?: InputMaybe<Scalars['String']>;
  token1_gte?: InputMaybe<Scalars['String']>;
  token1_in?: InputMaybe<Array<Scalars['String']>>;
  token1_lt?: InputMaybe<Scalars['String']>;
  token1_lte?: InputMaybe<Scalars['String']>;
  token1_not?: InputMaybe<Scalars['String']>;
  token1_not_contains?: InputMaybe<Scalars['String']>;
  token1_not_contains_nocase?: InputMaybe<Scalars['String']>;
  token1_not_ends_with?: InputMaybe<Scalars['String']>;
  token1_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  token1_not_in?: InputMaybe<Array<Scalars['String']>>;
  token1_not_starts_with?: InputMaybe<Scalars['String']>;
  token1_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  token1_starts_with?: InputMaybe<Scalars['String']>;
  token1_starts_with_nocase?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['Int']>;
  type_gt?: InputMaybe<Scalars['Int']>;
  type_gte?: InputMaybe<Scalars['Int']>;
  type_in?: InputMaybe<Array<Scalars['Int']>>;
  type_lt?: InputMaybe<Scalars['Int']>;
  type_lte?: InputMaybe<Scalars['Int']>;
  type_not?: InputMaybe<Scalars['Int']>;
  type_not_in?: InputMaybe<Array<Scalars['Int']>>;
  version?: InputMaybe<Scalars['Int']>;
  version_gt?: InputMaybe<Scalars['Int']>;
  version_gte?: InputMaybe<Scalars['Int']>;
  version_in?: InputMaybe<Array<Scalars['Int']>>;
  version_lt?: InputMaybe<Scalars['Int']>;
  version_lte?: InputMaybe<Scalars['Int']>;
  version_not?: InputMaybe<Scalars['Int']>;
  version_not_in?: InputMaybe<Array<Scalars['Int']>>;
};

export enum LiquidityPool_OrderBy {
  Activated = 'activated',
  ConnectorTokens = 'connectorTokens',
  ConversionFee = 'conversionFee',
  Conversions = 'conversions',
  CreatedAtBlockNumber = 'createdAtBlockNumber',
  CreatedAtTimestamp = 'createdAtTimestamp',
  CreatedAtTransaction = 'createdAtTransaction',
  CurrentConverterRegistry = 'currentConverterRegistry',
  Id = 'id',
  MaxConversionFee = 'maxConversionFee',
  Owner = 'owner',
  PoolTokens = 'poolTokens',
  SmartToken = 'smartToken',
  Token0 = 'token0',
  Token0Balance = 'token0Balance',
  Token1 = 'token1',
  Token1Balance = 'token1Balance',
  Type = 'type',
  Version = 'version',
}

/**
 * A Loan can be initialized by either a Margin Trade event or a Borrow event
 *
 */
export type Loan = {
  __typename?: 'Loan';
  /**
   * Average price per token from all loan open events
   * Updated on Trade and Borrow events
   * This is mainly used as internal storage to calculate PnL
   *
   */
  averageBuyPrice: Scalars['BigDecimal'];
  /**
   * Average price per token from all loan close events
   * Updated on CloseWithSwap, CloseWithDeposit and Liquidate events
   * This is mainly used as internal storage to calculate PnL
   *
   */
  averageSellPrice: Scalars['BigDecimal'];
  /**
   * Borrow transactions associated with this loan
   *
   */
  borrow?: Maybe<Array<Borrow>>;
  /**
   * The amount borrowed in loan tokens
   *
   */
  borrowedAmount: Scalars['BigDecimal'];
  /**
   * CloseWithDeposit events associated with this loan. Emitted when a user partially or fully closes a borrow loan.
   *
   */
  closeWithDeposits?: Maybe<Array<CloseWithDeposit>>;
  /**
   * CloseWithSwap events associated with this loan. Emitted when a user partially or fully closes a margin trade.
   *
   */
  closeWithSwaps?: Maybe<Array<CloseWithSwap>>;
  /**
   * The token provided as collateral
   *
   */
  collateralToken: Token;
  /**
   * DepositCollateral events associated with this loan, where a user has topped up collateral
   *
   */
  depositCollateral?: Maybe<Array<DepositCollateral>>;
  /**
   * Unix timestamp at end of loan (null if loan is still open)
   *
   */
  endTimestamp?: Maybe<Scalars['Int']>;
  id: Scalars['ID'];
  /**
   * If a Liquidate, CloseWithSwap, Rollover or CloseWithDeposit event occurs with 0 margin or 0 leverage, this property changes to false
   *
   */
  isOpen: Scalars['Boolean'];
  /**
   * Any liquidations that have happened on this loan
   *
   */
  liquidates?: Maybe<Array<Liquidate>>;
  /**
   * The token the loan was taken out in
   *
   */
  loanToken: Token;
  /**
   * The largest amount borrowed in the lifetime of this loan
   *
   */
  maxBorrowedAmount: Scalars['BigDecimal'];
  /**
   * The maximum this position size was - mainly for debugging purposes
   *
   */
  maximumPositionSize: Scalars['BigDecimal'];
  /**
   * Next date that the loan will be rolled over, interest and trading fee paid, and rollover reward paid
   * It is possible for the next rollover to be in the past if the loan has not yet been rolled over by the Sovryn node
   *
   */
  nextRollover?: Maybe<Scalars['Int']>;
  /**
   * Total of collateral (user collateral in a Borrow, and user collateral + borrowed amount in a Trade) in collateral tokens
   *
   */
  positionSize: Scalars['BigDecimal'];
  /**
   * Realized profit and loss. This is updated on every loan closing event - partially or fully closing a loan, or a liquidation.
   * Currently, this does not take into account fees paid
   * The realized PnL is quoted in the collateral currency
   *
   */
  realizedPnL: Scalars['BigDecimal'];
  /**
   * Percentage profit or loss relative to collateral
   *
   */
  realizedPnLPercent: Scalars['BigDecimal'];
  /**
   * Rollover events associated with this loan.
   * Rollovers are loan maintenance transactions where the next interest payment and fee is paid
   *
   */
  rollovers?: Maybe<Array<Rollover>>;
  /**
   * The amount borrowed when the loan was opened
   *
   */
  startBorrowedAmount: Scalars['BigDecimal'];
  /**
   * Initial size of the position
   *
   */
  startPositionSize: Scalars['BigDecimal'];
  /**
   * The start rate of the loan in loan tokens (eg if it is a long USD/BTC margin trade, this is the BTC price in USD)
   *
   */
  startRate: Scalars['BigDecimal'];
  /**
   * Unix timestamp at start of loan
   *
   */
  startTimestamp: Scalars['Int'];
  /**
   * Sum of position volume from Trade, Borrow and DepositCollateral events in this loan, in collateral token
   *
   */
  totalBought: Scalars['BigDecimal'];
  /**
   * Sum of position change volume from CloseWithSwap, CloseWithDeposit and Liquidate events in this loan, in collateral token
   *
   */
  totalSold: Scalars['BigDecimal'];
  /**
   * Trade (margin trade) transactions associated with this loan
   *
   */
  trade?: Maybe<Array<Trade>>;
  /**
   * LoanType is either Trade (for Margin Trades) or Borrow (for Borrows)
   *
   */
  type: LoanType;
  /**
   * The user who took out the loan
   *
   */
  user: User;
};

/**
 * A Loan can be initialized by either a Margin Trade event or a Borrow event
 *
 */
export type LoanBorrowArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Borrow_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Borrow_Filter>;
};

/**
 * A Loan can be initialized by either a Margin Trade event or a Borrow event
 *
 */
export type LoanCloseWithDepositsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<CloseWithDeposit_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<CloseWithDeposit_Filter>;
};

/**
 * A Loan can be initialized by either a Margin Trade event or a Borrow event
 *
 */
export type LoanCloseWithSwapsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<CloseWithSwap_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<CloseWithSwap_Filter>;
};

/**
 * A Loan can be initialized by either a Margin Trade event or a Borrow event
 *
 */
export type LoanDepositCollateralArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<DepositCollateral_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<DepositCollateral_Filter>;
};

/**
 * A Loan can be initialized by either a Margin Trade event or a Borrow event
 *
 */
export type LoanLiquidatesArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Liquidate_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Liquidate_Filter>;
};

/**
 * A Loan can be initialized by either a Margin Trade event or a Borrow event
 *
 */
export type LoanRolloversArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Rollover_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Rollover_Filter>;
};

/**
 * A Loan can be initialized by either a Margin Trade event or a Borrow event
 *
 */
export type LoanTradeArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Trade_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Trade_Filter>;
};

export type LoanParamsSetup = {
  __typename?: 'LoanParamsSetup';
  collateralToken: Token;
  id: Scalars['ID'];
  loanToken: Token;
  maintenanceMargin: Scalars['BigDecimal'];
  maxLoanTerm: Scalars['Int'];
  minInitialMargin: Scalars['BigDecimal'];
  owner: Scalars['Bytes'];
  timestamp: Scalars['Int'];
  transaction: Transaction;
};

export type LoanParamsSetup_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  collateralToken?: InputMaybe<Scalars['String']>;
  collateralToken_?: InputMaybe<Token_Filter>;
  collateralToken_contains?: InputMaybe<Scalars['String']>;
  collateralToken_contains_nocase?: InputMaybe<Scalars['String']>;
  collateralToken_ends_with?: InputMaybe<Scalars['String']>;
  collateralToken_ends_with_nocase?: InputMaybe<Scalars['String']>;
  collateralToken_gt?: InputMaybe<Scalars['String']>;
  collateralToken_gte?: InputMaybe<Scalars['String']>;
  collateralToken_in?: InputMaybe<Array<Scalars['String']>>;
  collateralToken_lt?: InputMaybe<Scalars['String']>;
  collateralToken_lte?: InputMaybe<Scalars['String']>;
  collateralToken_not?: InputMaybe<Scalars['String']>;
  collateralToken_not_contains?: InputMaybe<Scalars['String']>;
  collateralToken_not_contains_nocase?: InputMaybe<Scalars['String']>;
  collateralToken_not_ends_with?: InputMaybe<Scalars['String']>;
  collateralToken_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  collateralToken_not_in?: InputMaybe<Array<Scalars['String']>>;
  collateralToken_not_starts_with?: InputMaybe<Scalars['String']>;
  collateralToken_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  collateralToken_starts_with?: InputMaybe<Scalars['String']>;
  collateralToken_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  loanToken?: InputMaybe<Scalars['String']>;
  loanToken_?: InputMaybe<Token_Filter>;
  loanToken_contains?: InputMaybe<Scalars['String']>;
  loanToken_contains_nocase?: InputMaybe<Scalars['String']>;
  loanToken_ends_with?: InputMaybe<Scalars['String']>;
  loanToken_ends_with_nocase?: InputMaybe<Scalars['String']>;
  loanToken_gt?: InputMaybe<Scalars['String']>;
  loanToken_gte?: InputMaybe<Scalars['String']>;
  loanToken_in?: InputMaybe<Array<Scalars['String']>>;
  loanToken_lt?: InputMaybe<Scalars['String']>;
  loanToken_lte?: InputMaybe<Scalars['String']>;
  loanToken_not?: InputMaybe<Scalars['String']>;
  loanToken_not_contains?: InputMaybe<Scalars['String']>;
  loanToken_not_contains_nocase?: InputMaybe<Scalars['String']>;
  loanToken_not_ends_with?: InputMaybe<Scalars['String']>;
  loanToken_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  loanToken_not_in?: InputMaybe<Array<Scalars['String']>>;
  loanToken_not_starts_with?: InputMaybe<Scalars['String']>;
  loanToken_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  loanToken_starts_with?: InputMaybe<Scalars['String']>;
  loanToken_starts_with_nocase?: InputMaybe<Scalars['String']>;
  maintenanceMargin?: InputMaybe<Scalars['BigDecimal']>;
  maintenanceMargin_gt?: InputMaybe<Scalars['BigDecimal']>;
  maintenanceMargin_gte?: InputMaybe<Scalars['BigDecimal']>;
  maintenanceMargin_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  maintenanceMargin_lt?: InputMaybe<Scalars['BigDecimal']>;
  maintenanceMargin_lte?: InputMaybe<Scalars['BigDecimal']>;
  maintenanceMargin_not?: InputMaybe<Scalars['BigDecimal']>;
  maintenanceMargin_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  maxLoanTerm?: InputMaybe<Scalars['Int']>;
  maxLoanTerm_gt?: InputMaybe<Scalars['Int']>;
  maxLoanTerm_gte?: InputMaybe<Scalars['Int']>;
  maxLoanTerm_in?: InputMaybe<Array<Scalars['Int']>>;
  maxLoanTerm_lt?: InputMaybe<Scalars['Int']>;
  maxLoanTerm_lte?: InputMaybe<Scalars['Int']>;
  maxLoanTerm_not?: InputMaybe<Scalars['Int']>;
  maxLoanTerm_not_in?: InputMaybe<Array<Scalars['Int']>>;
  minInitialMargin?: InputMaybe<Scalars['BigDecimal']>;
  minInitialMargin_gt?: InputMaybe<Scalars['BigDecimal']>;
  minInitialMargin_gte?: InputMaybe<Scalars['BigDecimal']>;
  minInitialMargin_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  minInitialMargin_lt?: InputMaybe<Scalars['BigDecimal']>;
  minInitialMargin_lte?: InputMaybe<Scalars['BigDecimal']>;
  minInitialMargin_not?: InputMaybe<Scalars['BigDecimal']>;
  minInitialMargin_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  owner?: InputMaybe<Scalars['Bytes']>;
  owner_contains?: InputMaybe<Scalars['Bytes']>;
  owner_in?: InputMaybe<Array<Scalars['Bytes']>>;
  owner_not?: InputMaybe<Scalars['Bytes']>;
  owner_not_contains?: InputMaybe<Scalars['Bytes']>;
  owner_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  timestamp?: InputMaybe<Scalars['Int']>;
  timestamp_gt?: InputMaybe<Scalars['Int']>;
  timestamp_gte?: InputMaybe<Scalars['Int']>;
  timestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp_lt?: InputMaybe<Scalars['Int']>;
  timestamp_lte?: InputMaybe<Scalars['Int']>;
  timestamp_not?: InputMaybe<Scalars['Int']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
  transaction?: InputMaybe<Scalars['String']>;
  transaction_?: InputMaybe<Transaction_Filter>;
  transaction_contains?: InputMaybe<Scalars['String']>;
  transaction_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_gt?: InputMaybe<Scalars['String']>;
  transaction_gte?: InputMaybe<Scalars['String']>;
  transaction_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_lt?: InputMaybe<Scalars['String']>;
  transaction_lte?: InputMaybe<Scalars['String']>;
  transaction_not?: InputMaybe<Scalars['String']>;
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_not_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
  transaction_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum LoanParamsSetup_OrderBy {
  CollateralToken = 'collateralToken',
  Id = 'id',
  LoanToken = 'loanToken',
  MaintenanceMargin = 'maintenanceMargin',
  MaxLoanTerm = 'maxLoanTerm',
  MinInitialMargin = 'minInitialMargin',
  Owner = 'owner',
  Timestamp = 'timestamp',
  Transaction = 'transaction',
}

export enum LoanType {
  /**
   * Borrow is a loan originating from a user simply borrowing funds
   *
   */
  Borrow = 'Borrow',
  /**
   * Trade is a loan originating from a margin trade
   *
   */
  Trade = 'Trade',
}

export type Loan_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  averageBuyPrice?: InputMaybe<Scalars['BigDecimal']>;
  averageBuyPrice_gt?: InputMaybe<Scalars['BigDecimal']>;
  averageBuyPrice_gte?: InputMaybe<Scalars['BigDecimal']>;
  averageBuyPrice_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  averageBuyPrice_lt?: InputMaybe<Scalars['BigDecimal']>;
  averageBuyPrice_lte?: InputMaybe<Scalars['BigDecimal']>;
  averageBuyPrice_not?: InputMaybe<Scalars['BigDecimal']>;
  averageBuyPrice_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  averageSellPrice?: InputMaybe<Scalars['BigDecimal']>;
  averageSellPrice_gt?: InputMaybe<Scalars['BigDecimal']>;
  averageSellPrice_gte?: InputMaybe<Scalars['BigDecimal']>;
  averageSellPrice_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  averageSellPrice_lt?: InputMaybe<Scalars['BigDecimal']>;
  averageSellPrice_lte?: InputMaybe<Scalars['BigDecimal']>;
  averageSellPrice_not?: InputMaybe<Scalars['BigDecimal']>;
  averageSellPrice_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  borrow_?: InputMaybe<Borrow_Filter>;
  borrowedAmount?: InputMaybe<Scalars['BigDecimal']>;
  borrowedAmount_gt?: InputMaybe<Scalars['BigDecimal']>;
  borrowedAmount_gte?: InputMaybe<Scalars['BigDecimal']>;
  borrowedAmount_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  borrowedAmount_lt?: InputMaybe<Scalars['BigDecimal']>;
  borrowedAmount_lte?: InputMaybe<Scalars['BigDecimal']>;
  borrowedAmount_not?: InputMaybe<Scalars['BigDecimal']>;
  borrowedAmount_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  closeWithDeposits_?: InputMaybe<CloseWithDeposit_Filter>;
  closeWithSwaps_?: InputMaybe<CloseWithSwap_Filter>;
  collateralToken?: InputMaybe<Scalars['String']>;
  collateralToken_?: InputMaybe<Token_Filter>;
  collateralToken_contains?: InputMaybe<Scalars['String']>;
  collateralToken_contains_nocase?: InputMaybe<Scalars['String']>;
  collateralToken_ends_with?: InputMaybe<Scalars['String']>;
  collateralToken_ends_with_nocase?: InputMaybe<Scalars['String']>;
  collateralToken_gt?: InputMaybe<Scalars['String']>;
  collateralToken_gte?: InputMaybe<Scalars['String']>;
  collateralToken_in?: InputMaybe<Array<Scalars['String']>>;
  collateralToken_lt?: InputMaybe<Scalars['String']>;
  collateralToken_lte?: InputMaybe<Scalars['String']>;
  collateralToken_not?: InputMaybe<Scalars['String']>;
  collateralToken_not_contains?: InputMaybe<Scalars['String']>;
  collateralToken_not_contains_nocase?: InputMaybe<Scalars['String']>;
  collateralToken_not_ends_with?: InputMaybe<Scalars['String']>;
  collateralToken_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  collateralToken_not_in?: InputMaybe<Array<Scalars['String']>>;
  collateralToken_not_starts_with?: InputMaybe<Scalars['String']>;
  collateralToken_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  collateralToken_starts_with?: InputMaybe<Scalars['String']>;
  collateralToken_starts_with_nocase?: InputMaybe<Scalars['String']>;
  depositCollateral_?: InputMaybe<DepositCollateral_Filter>;
  endTimestamp?: InputMaybe<Scalars['Int']>;
  endTimestamp_gt?: InputMaybe<Scalars['Int']>;
  endTimestamp_gte?: InputMaybe<Scalars['Int']>;
  endTimestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  endTimestamp_lt?: InputMaybe<Scalars['Int']>;
  endTimestamp_lte?: InputMaybe<Scalars['Int']>;
  endTimestamp_not?: InputMaybe<Scalars['Int']>;
  endTimestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  isOpen?: InputMaybe<Scalars['Boolean']>;
  isOpen_in?: InputMaybe<Array<Scalars['Boolean']>>;
  isOpen_not?: InputMaybe<Scalars['Boolean']>;
  isOpen_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  liquidates_?: InputMaybe<Liquidate_Filter>;
  loanToken?: InputMaybe<Scalars['String']>;
  loanToken_?: InputMaybe<Token_Filter>;
  loanToken_contains?: InputMaybe<Scalars['String']>;
  loanToken_contains_nocase?: InputMaybe<Scalars['String']>;
  loanToken_ends_with?: InputMaybe<Scalars['String']>;
  loanToken_ends_with_nocase?: InputMaybe<Scalars['String']>;
  loanToken_gt?: InputMaybe<Scalars['String']>;
  loanToken_gte?: InputMaybe<Scalars['String']>;
  loanToken_in?: InputMaybe<Array<Scalars['String']>>;
  loanToken_lt?: InputMaybe<Scalars['String']>;
  loanToken_lte?: InputMaybe<Scalars['String']>;
  loanToken_not?: InputMaybe<Scalars['String']>;
  loanToken_not_contains?: InputMaybe<Scalars['String']>;
  loanToken_not_contains_nocase?: InputMaybe<Scalars['String']>;
  loanToken_not_ends_with?: InputMaybe<Scalars['String']>;
  loanToken_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  loanToken_not_in?: InputMaybe<Array<Scalars['String']>>;
  loanToken_not_starts_with?: InputMaybe<Scalars['String']>;
  loanToken_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  loanToken_starts_with?: InputMaybe<Scalars['String']>;
  loanToken_starts_with_nocase?: InputMaybe<Scalars['String']>;
  maxBorrowedAmount?: InputMaybe<Scalars['BigDecimal']>;
  maxBorrowedAmount_gt?: InputMaybe<Scalars['BigDecimal']>;
  maxBorrowedAmount_gte?: InputMaybe<Scalars['BigDecimal']>;
  maxBorrowedAmount_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  maxBorrowedAmount_lt?: InputMaybe<Scalars['BigDecimal']>;
  maxBorrowedAmount_lte?: InputMaybe<Scalars['BigDecimal']>;
  maxBorrowedAmount_not?: InputMaybe<Scalars['BigDecimal']>;
  maxBorrowedAmount_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  maximumPositionSize?: InputMaybe<Scalars['BigDecimal']>;
  maximumPositionSize_gt?: InputMaybe<Scalars['BigDecimal']>;
  maximumPositionSize_gte?: InputMaybe<Scalars['BigDecimal']>;
  maximumPositionSize_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  maximumPositionSize_lt?: InputMaybe<Scalars['BigDecimal']>;
  maximumPositionSize_lte?: InputMaybe<Scalars['BigDecimal']>;
  maximumPositionSize_not?: InputMaybe<Scalars['BigDecimal']>;
  maximumPositionSize_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  nextRollover?: InputMaybe<Scalars['Int']>;
  nextRollover_gt?: InputMaybe<Scalars['Int']>;
  nextRollover_gte?: InputMaybe<Scalars['Int']>;
  nextRollover_in?: InputMaybe<Array<Scalars['Int']>>;
  nextRollover_lt?: InputMaybe<Scalars['Int']>;
  nextRollover_lte?: InputMaybe<Scalars['Int']>;
  nextRollover_not?: InputMaybe<Scalars['Int']>;
  nextRollover_not_in?: InputMaybe<Array<Scalars['Int']>>;
  positionSize?: InputMaybe<Scalars['BigDecimal']>;
  positionSize_gt?: InputMaybe<Scalars['BigDecimal']>;
  positionSize_gte?: InputMaybe<Scalars['BigDecimal']>;
  positionSize_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  positionSize_lt?: InputMaybe<Scalars['BigDecimal']>;
  positionSize_lte?: InputMaybe<Scalars['BigDecimal']>;
  positionSize_not?: InputMaybe<Scalars['BigDecimal']>;
  positionSize_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  realizedPnL?: InputMaybe<Scalars['BigDecimal']>;
  realizedPnLPercent?: InputMaybe<Scalars['BigDecimal']>;
  realizedPnLPercent_gt?: InputMaybe<Scalars['BigDecimal']>;
  realizedPnLPercent_gte?: InputMaybe<Scalars['BigDecimal']>;
  realizedPnLPercent_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  realizedPnLPercent_lt?: InputMaybe<Scalars['BigDecimal']>;
  realizedPnLPercent_lte?: InputMaybe<Scalars['BigDecimal']>;
  realizedPnLPercent_not?: InputMaybe<Scalars['BigDecimal']>;
  realizedPnLPercent_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  realizedPnL_gt?: InputMaybe<Scalars['BigDecimal']>;
  realizedPnL_gte?: InputMaybe<Scalars['BigDecimal']>;
  realizedPnL_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  realizedPnL_lt?: InputMaybe<Scalars['BigDecimal']>;
  realizedPnL_lte?: InputMaybe<Scalars['BigDecimal']>;
  realizedPnL_not?: InputMaybe<Scalars['BigDecimal']>;
  realizedPnL_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  rollovers_?: InputMaybe<Rollover_Filter>;
  startBorrowedAmount?: InputMaybe<Scalars['BigDecimal']>;
  startBorrowedAmount_gt?: InputMaybe<Scalars['BigDecimal']>;
  startBorrowedAmount_gte?: InputMaybe<Scalars['BigDecimal']>;
  startBorrowedAmount_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  startBorrowedAmount_lt?: InputMaybe<Scalars['BigDecimal']>;
  startBorrowedAmount_lte?: InputMaybe<Scalars['BigDecimal']>;
  startBorrowedAmount_not?: InputMaybe<Scalars['BigDecimal']>;
  startBorrowedAmount_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  startPositionSize?: InputMaybe<Scalars['BigDecimal']>;
  startPositionSize_gt?: InputMaybe<Scalars['BigDecimal']>;
  startPositionSize_gte?: InputMaybe<Scalars['BigDecimal']>;
  startPositionSize_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  startPositionSize_lt?: InputMaybe<Scalars['BigDecimal']>;
  startPositionSize_lte?: InputMaybe<Scalars['BigDecimal']>;
  startPositionSize_not?: InputMaybe<Scalars['BigDecimal']>;
  startPositionSize_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  startRate?: InputMaybe<Scalars['BigDecimal']>;
  startRate_gt?: InputMaybe<Scalars['BigDecimal']>;
  startRate_gte?: InputMaybe<Scalars['BigDecimal']>;
  startRate_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  startRate_lt?: InputMaybe<Scalars['BigDecimal']>;
  startRate_lte?: InputMaybe<Scalars['BigDecimal']>;
  startRate_not?: InputMaybe<Scalars['BigDecimal']>;
  startRate_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  startTimestamp?: InputMaybe<Scalars['Int']>;
  startTimestamp_gt?: InputMaybe<Scalars['Int']>;
  startTimestamp_gte?: InputMaybe<Scalars['Int']>;
  startTimestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  startTimestamp_lt?: InputMaybe<Scalars['Int']>;
  startTimestamp_lte?: InputMaybe<Scalars['Int']>;
  startTimestamp_not?: InputMaybe<Scalars['Int']>;
  startTimestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
  totalBought?: InputMaybe<Scalars['BigDecimal']>;
  totalBought_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalBought_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalBought_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalBought_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalBought_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalBought_not?: InputMaybe<Scalars['BigDecimal']>;
  totalBought_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalSold?: InputMaybe<Scalars['BigDecimal']>;
  totalSold_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalSold_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalSold_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalSold_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalSold_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalSold_not?: InputMaybe<Scalars['BigDecimal']>;
  totalSold_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  trade_?: InputMaybe<Trade_Filter>;
  type?: InputMaybe<LoanType>;
  type_in?: InputMaybe<Array<LoanType>>;
  type_not?: InputMaybe<LoanType>;
  type_not_in?: InputMaybe<Array<LoanType>>;
  user?: InputMaybe<Scalars['String']>;
  user_?: InputMaybe<User_Filter>;
  user_contains?: InputMaybe<Scalars['String']>;
  user_contains_nocase?: InputMaybe<Scalars['String']>;
  user_ends_with?: InputMaybe<Scalars['String']>;
  user_ends_with_nocase?: InputMaybe<Scalars['String']>;
  user_gt?: InputMaybe<Scalars['String']>;
  user_gte?: InputMaybe<Scalars['String']>;
  user_in?: InputMaybe<Array<Scalars['String']>>;
  user_lt?: InputMaybe<Scalars['String']>;
  user_lte?: InputMaybe<Scalars['String']>;
  user_not?: InputMaybe<Scalars['String']>;
  user_not_contains?: InputMaybe<Scalars['String']>;
  user_not_contains_nocase?: InputMaybe<Scalars['String']>;
  user_not_ends_with?: InputMaybe<Scalars['String']>;
  user_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  user_not_in?: InputMaybe<Array<Scalars['String']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']>;
  user_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  user_starts_with?: InputMaybe<Scalars['String']>;
  user_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum Loan_OrderBy {
  AverageBuyPrice = 'averageBuyPrice',
  AverageSellPrice = 'averageSellPrice',
  Borrow = 'borrow',
  BorrowedAmount = 'borrowedAmount',
  CloseWithDeposits = 'closeWithDeposits',
  CloseWithSwaps = 'closeWithSwaps',
  CollateralToken = 'collateralToken',
  DepositCollateral = 'depositCollateral',
  EndTimestamp = 'endTimestamp',
  Id = 'id',
  IsOpen = 'isOpen',
  Liquidates = 'liquidates',
  LoanToken = 'loanToken',
  MaxBorrowedAmount = 'maxBorrowedAmount',
  MaximumPositionSize = 'maximumPositionSize',
  NextRollover = 'nextRollover',
  PositionSize = 'positionSize',
  RealizedPnL = 'realizedPnL',
  RealizedPnLPercent = 'realizedPnLPercent',
  Rollovers = 'rollovers',
  StartBorrowedAmount = 'startBorrowedAmount',
  StartPositionSize = 'startPositionSize',
  StartRate = 'startRate',
  StartTimestamp = 'startTimestamp',
  TotalBought = 'totalBought',
  TotalSold = 'totalSold',
  Trade = 'trade',
  Type = 'type',
  User = 'user',
}

export type MarginOrderCanceled = {
  __typename?: 'MarginOrderCanceled';
  emittedBy: Scalars['Bytes'];
  hash: Scalars['Bytes'];
  id: Scalars['ID'];
  timestamp: Scalars['Int'];
  trader: Scalars['Bytes'];
  transaction: Transaction;
};

export type MarginOrderCanceled_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  emittedBy?: InputMaybe<Scalars['Bytes']>;
  emittedBy_contains?: InputMaybe<Scalars['Bytes']>;
  emittedBy_in?: InputMaybe<Array<Scalars['Bytes']>>;
  emittedBy_not?: InputMaybe<Scalars['Bytes']>;
  emittedBy_not_contains?: InputMaybe<Scalars['Bytes']>;
  emittedBy_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  hash?: InputMaybe<Scalars['Bytes']>;
  hash_contains?: InputMaybe<Scalars['Bytes']>;
  hash_in?: InputMaybe<Array<Scalars['Bytes']>>;
  hash_not?: InputMaybe<Scalars['Bytes']>;
  hash_not_contains?: InputMaybe<Scalars['Bytes']>;
  hash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  timestamp?: InputMaybe<Scalars['Int']>;
  timestamp_gt?: InputMaybe<Scalars['Int']>;
  timestamp_gte?: InputMaybe<Scalars['Int']>;
  timestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp_lt?: InputMaybe<Scalars['Int']>;
  timestamp_lte?: InputMaybe<Scalars['Int']>;
  timestamp_not?: InputMaybe<Scalars['Int']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
  trader?: InputMaybe<Scalars['Bytes']>;
  trader_contains?: InputMaybe<Scalars['Bytes']>;
  trader_in?: InputMaybe<Array<Scalars['Bytes']>>;
  trader_not?: InputMaybe<Scalars['Bytes']>;
  trader_not_contains?: InputMaybe<Scalars['Bytes']>;
  trader_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transaction?: InputMaybe<Scalars['String']>;
  transaction_?: InputMaybe<Transaction_Filter>;
  transaction_contains?: InputMaybe<Scalars['String']>;
  transaction_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_gt?: InputMaybe<Scalars['String']>;
  transaction_gte?: InputMaybe<Scalars['String']>;
  transaction_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_lt?: InputMaybe<Scalars['String']>;
  transaction_lte?: InputMaybe<Scalars['String']>;
  transaction_not?: InputMaybe<Scalars['String']>;
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_not_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
  transaction_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum MarginOrderCanceled_OrderBy {
  EmittedBy = 'emittedBy',
  Hash = 'hash',
  Id = 'id',
  Timestamp = 'timestamp',
  Trader = 'trader',
  Transaction = 'transaction',
}

export type MarginOrderFilled = {
  __typename?: 'MarginOrderFilled';
  collateral: Scalars['BigDecimal'];
  collateralTokenAddress: Scalars['Bytes'];
  collateralTokenSent: Scalars['BigDecimal'];
  emittedBy: Scalars['Bytes'];
  filledPrice: Scalars['BigDecimal'];
  hash: Scalars['Bytes'];
  id: Scalars['ID'];
  leverageAmount: Scalars['BigDecimal'];
  loanTokenAddress: Scalars['Bytes'];
  loanTokenSent: Scalars['BigDecimal'];
  principal: Scalars['BigDecimal'];
  timestamp: Scalars['Int'];
  trader: User;
  transaction: Transaction;
};

export type MarginOrderFilled_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  collateral?: InputMaybe<Scalars['BigDecimal']>;
  collateralTokenAddress?: InputMaybe<Scalars['Bytes']>;
  collateralTokenAddress_contains?: InputMaybe<Scalars['Bytes']>;
  collateralTokenAddress_in?: InputMaybe<Array<Scalars['Bytes']>>;
  collateralTokenAddress_not?: InputMaybe<Scalars['Bytes']>;
  collateralTokenAddress_not_contains?: InputMaybe<Scalars['Bytes']>;
  collateralTokenAddress_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  collateralTokenSent?: InputMaybe<Scalars['BigDecimal']>;
  collateralTokenSent_gt?: InputMaybe<Scalars['BigDecimal']>;
  collateralTokenSent_gte?: InputMaybe<Scalars['BigDecimal']>;
  collateralTokenSent_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  collateralTokenSent_lt?: InputMaybe<Scalars['BigDecimal']>;
  collateralTokenSent_lte?: InputMaybe<Scalars['BigDecimal']>;
  collateralTokenSent_not?: InputMaybe<Scalars['BigDecimal']>;
  collateralTokenSent_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  collateral_gt?: InputMaybe<Scalars['BigDecimal']>;
  collateral_gte?: InputMaybe<Scalars['BigDecimal']>;
  collateral_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  collateral_lt?: InputMaybe<Scalars['BigDecimal']>;
  collateral_lte?: InputMaybe<Scalars['BigDecimal']>;
  collateral_not?: InputMaybe<Scalars['BigDecimal']>;
  collateral_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  emittedBy?: InputMaybe<Scalars['Bytes']>;
  emittedBy_contains?: InputMaybe<Scalars['Bytes']>;
  emittedBy_in?: InputMaybe<Array<Scalars['Bytes']>>;
  emittedBy_not?: InputMaybe<Scalars['Bytes']>;
  emittedBy_not_contains?: InputMaybe<Scalars['Bytes']>;
  emittedBy_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  filledPrice?: InputMaybe<Scalars['BigDecimal']>;
  filledPrice_gt?: InputMaybe<Scalars['BigDecimal']>;
  filledPrice_gte?: InputMaybe<Scalars['BigDecimal']>;
  filledPrice_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  filledPrice_lt?: InputMaybe<Scalars['BigDecimal']>;
  filledPrice_lte?: InputMaybe<Scalars['BigDecimal']>;
  filledPrice_not?: InputMaybe<Scalars['BigDecimal']>;
  filledPrice_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  hash?: InputMaybe<Scalars['Bytes']>;
  hash_contains?: InputMaybe<Scalars['Bytes']>;
  hash_in?: InputMaybe<Array<Scalars['Bytes']>>;
  hash_not?: InputMaybe<Scalars['Bytes']>;
  hash_not_contains?: InputMaybe<Scalars['Bytes']>;
  hash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  leverageAmount?: InputMaybe<Scalars['BigDecimal']>;
  leverageAmount_gt?: InputMaybe<Scalars['BigDecimal']>;
  leverageAmount_gte?: InputMaybe<Scalars['BigDecimal']>;
  leverageAmount_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  leverageAmount_lt?: InputMaybe<Scalars['BigDecimal']>;
  leverageAmount_lte?: InputMaybe<Scalars['BigDecimal']>;
  leverageAmount_not?: InputMaybe<Scalars['BigDecimal']>;
  leverageAmount_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  loanTokenAddress?: InputMaybe<Scalars['Bytes']>;
  loanTokenAddress_contains?: InputMaybe<Scalars['Bytes']>;
  loanTokenAddress_in?: InputMaybe<Array<Scalars['Bytes']>>;
  loanTokenAddress_not?: InputMaybe<Scalars['Bytes']>;
  loanTokenAddress_not_contains?: InputMaybe<Scalars['Bytes']>;
  loanTokenAddress_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  loanTokenSent?: InputMaybe<Scalars['BigDecimal']>;
  loanTokenSent_gt?: InputMaybe<Scalars['BigDecimal']>;
  loanTokenSent_gte?: InputMaybe<Scalars['BigDecimal']>;
  loanTokenSent_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  loanTokenSent_lt?: InputMaybe<Scalars['BigDecimal']>;
  loanTokenSent_lte?: InputMaybe<Scalars['BigDecimal']>;
  loanTokenSent_not?: InputMaybe<Scalars['BigDecimal']>;
  loanTokenSent_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  principal?: InputMaybe<Scalars['BigDecimal']>;
  principal_gt?: InputMaybe<Scalars['BigDecimal']>;
  principal_gte?: InputMaybe<Scalars['BigDecimal']>;
  principal_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  principal_lt?: InputMaybe<Scalars['BigDecimal']>;
  principal_lte?: InputMaybe<Scalars['BigDecimal']>;
  principal_not?: InputMaybe<Scalars['BigDecimal']>;
  principal_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  timestamp?: InputMaybe<Scalars['Int']>;
  timestamp_gt?: InputMaybe<Scalars['Int']>;
  timestamp_gte?: InputMaybe<Scalars['Int']>;
  timestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp_lt?: InputMaybe<Scalars['Int']>;
  timestamp_lte?: InputMaybe<Scalars['Int']>;
  timestamp_not?: InputMaybe<Scalars['Int']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
  trader?: InputMaybe<Scalars['String']>;
  trader_?: InputMaybe<User_Filter>;
  trader_contains?: InputMaybe<Scalars['String']>;
  trader_contains_nocase?: InputMaybe<Scalars['String']>;
  trader_ends_with?: InputMaybe<Scalars['String']>;
  trader_ends_with_nocase?: InputMaybe<Scalars['String']>;
  trader_gt?: InputMaybe<Scalars['String']>;
  trader_gte?: InputMaybe<Scalars['String']>;
  trader_in?: InputMaybe<Array<Scalars['String']>>;
  trader_lt?: InputMaybe<Scalars['String']>;
  trader_lte?: InputMaybe<Scalars['String']>;
  trader_not?: InputMaybe<Scalars['String']>;
  trader_not_contains?: InputMaybe<Scalars['String']>;
  trader_not_contains_nocase?: InputMaybe<Scalars['String']>;
  trader_not_ends_with?: InputMaybe<Scalars['String']>;
  trader_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  trader_not_in?: InputMaybe<Array<Scalars['String']>>;
  trader_not_starts_with?: InputMaybe<Scalars['String']>;
  trader_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  trader_starts_with?: InputMaybe<Scalars['String']>;
  trader_starts_with_nocase?: InputMaybe<Scalars['String']>;
  transaction?: InputMaybe<Scalars['String']>;
  transaction_?: InputMaybe<Transaction_Filter>;
  transaction_contains?: InputMaybe<Scalars['String']>;
  transaction_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_gt?: InputMaybe<Scalars['String']>;
  transaction_gte?: InputMaybe<Scalars['String']>;
  transaction_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_lt?: InputMaybe<Scalars['String']>;
  transaction_lte?: InputMaybe<Scalars['String']>;
  transaction_not?: InputMaybe<Scalars['String']>;
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_not_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
  transaction_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum MarginOrderFilled_OrderBy {
  Collateral = 'collateral',
  CollateralTokenAddress = 'collateralTokenAddress',
  CollateralTokenSent = 'collateralTokenSent',
  EmittedBy = 'emittedBy',
  FilledPrice = 'filledPrice',
  Hash = 'hash',
  Id = 'id',
  LeverageAmount = 'leverageAmount',
  LoanTokenAddress = 'loanTokenAddress',
  LoanTokenSent = 'loanTokenSent',
  Principal = 'principal',
  Timestamp = 'timestamp',
  Trader = 'trader',
  Transaction = 'transaction',
}

export type MultisigConfirmation = {
  __typename?: 'MultisigConfirmation';
  id: Scalars['ID'];
  multisigTransaction: MultisigTransaction;
  signer: User;
  timestamp: Scalars['Int'];
  transaction: Transaction;
};

export type MultisigConfirmation_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  multisigTransaction?: InputMaybe<Scalars['String']>;
  multisigTransaction_?: InputMaybe<MultisigTransaction_Filter>;
  multisigTransaction_contains?: InputMaybe<Scalars['String']>;
  multisigTransaction_contains_nocase?: InputMaybe<Scalars['String']>;
  multisigTransaction_ends_with?: InputMaybe<Scalars['String']>;
  multisigTransaction_ends_with_nocase?: InputMaybe<Scalars['String']>;
  multisigTransaction_gt?: InputMaybe<Scalars['String']>;
  multisigTransaction_gte?: InputMaybe<Scalars['String']>;
  multisigTransaction_in?: InputMaybe<Array<Scalars['String']>>;
  multisigTransaction_lt?: InputMaybe<Scalars['String']>;
  multisigTransaction_lte?: InputMaybe<Scalars['String']>;
  multisigTransaction_not?: InputMaybe<Scalars['String']>;
  multisigTransaction_not_contains?: InputMaybe<Scalars['String']>;
  multisigTransaction_not_contains_nocase?: InputMaybe<Scalars['String']>;
  multisigTransaction_not_ends_with?: InputMaybe<Scalars['String']>;
  multisigTransaction_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  multisigTransaction_not_in?: InputMaybe<Array<Scalars['String']>>;
  multisigTransaction_not_starts_with?: InputMaybe<Scalars['String']>;
  multisigTransaction_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  multisigTransaction_starts_with?: InputMaybe<Scalars['String']>;
  multisigTransaction_starts_with_nocase?: InputMaybe<Scalars['String']>;
  signer?: InputMaybe<Scalars['String']>;
  signer_?: InputMaybe<User_Filter>;
  signer_contains?: InputMaybe<Scalars['String']>;
  signer_contains_nocase?: InputMaybe<Scalars['String']>;
  signer_ends_with?: InputMaybe<Scalars['String']>;
  signer_ends_with_nocase?: InputMaybe<Scalars['String']>;
  signer_gt?: InputMaybe<Scalars['String']>;
  signer_gte?: InputMaybe<Scalars['String']>;
  signer_in?: InputMaybe<Array<Scalars['String']>>;
  signer_lt?: InputMaybe<Scalars['String']>;
  signer_lte?: InputMaybe<Scalars['String']>;
  signer_not?: InputMaybe<Scalars['String']>;
  signer_not_contains?: InputMaybe<Scalars['String']>;
  signer_not_contains_nocase?: InputMaybe<Scalars['String']>;
  signer_not_ends_with?: InputMaybe<Scalars['String']>;
  signer_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  signer_not_in?: InputMaybe<Array<Scalars['String']>>;
  signer_not_starts_with?: InputMaybe<Scalars['String']>;
  signer_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  signer_starts_with?: InputMaybe<Scalars['String']>;
  signer_starts_with_nocase?: InputMaybe<Scalars['String']>;
  timestamp?: InputMaybe<Scalars['Int']>;
  timestamp_gt?: InputMaybe<Scalars['Int']>;
  timestamp_gte?: InputMaybe<Scalars['Int']>;
  timestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp_lt?: InputMaybe<Scalars['Int']>;
  timestamp_lte?: InputMaybe<Scalars['Int']>;
  timestamp_not?: InputMaybe<Scalars['Int']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
  transaction?: InputMaybe<Scalars['String']>;
  transaction_?: InputMaybe<Transaction_Filter>;
  transaction_contains?: InputMaybe<Scalars['String']>;
  transaction_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_gt?: InputMaybe<Scalars['String']>;
  transaction_gte?: InputMaybe<Scalars['String']>;
  transaction_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_lt?: InputMaybe<Scalars['String']>;
  transaction_lte?: InputMaybe<Scalars['String']>;
  transaction_not?: InputMaybe<Scalars['String']>;
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_not_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
  transaction_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum MultisigConfirmation_OrderBy {
  Id = 'id',
  MultisigTransaction = 'multisigTransaction',
  Signer = 'signer',
  Timestamp = 'timestamp',
  Transaction = 'transaction',
}

export type MultisigContract = {
  __typename?: 'MultisigContract';
  id: Scalars['ID'];
  owners: Array<User>;
  required: Scalars['Int'];
  timestamp: Scalars['Int'];
  transaction: Transaction;
  transactions: Array<MultisigTransaction>;
};

export type MultisigContractOwnersArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<User_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<User_Filter>;
};

export type MultisigContractTransactionsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MultisigTransaction_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<MultisigTransaction_Filter>;
};

export type MultisigContract_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  owners?: InputMaybe<Array<Scalars['String']>>;
  owners_?: InputMaybe<User_Filter>;
  owners_contains?: InputMaybe<Array<Scalars['String']>>;
  owners_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  owners_not?: InputMaybe<Array<Scalars['String']>>;
  owners_not_contains?: InputMaybe<Array<Scalars['String']>>;
  owners_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  required?: InputMaybe<Scalars['Int']>;
  required_gt?: InputMaybe<Scalars['Int']>;
  required_gte?: InputMaybe<Scalars['Int']>;
  required_in?: InputMaybe<Array<Scalars['Int']>>;
  required_lt?: InputMaybe<Scalars['Int']>;
  required_lte?: InputMaybe<Scalars['Int']>;
  required_not?: InputMaybe<Scalars['Int']>;
  required_not_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp?: InputMaybe<Scalars['Int']>;
  timestamp_gt?: InputMaybe<Scalars['Int']>;
  timestamp_gte?: InputMaybe<Scalars['Int']>;
  timestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp_lt?: InputMaybe<Scalars['Int']>;
  timestamp_lte?: InputMaybe<Scalars['Int']>;
  timestamp_not?: InputMaybe<Scalars['Int']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
  transaction?: InputMaybe<Scalars['String']>;
  transaction_?: InputMaybe<Transaction_Filter>;
  transaction_contains?: InputMaybe<Scalars['String']>;
  transaction_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_gt?: InputMaybe<Scalars['String']>;
  transaction_gte?: InputMaybe<Scalars['String']>;
  transaction_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_lt?: InputMaybe<Scalars['String']>;
  transaction_lte?: InputMaybe<Scalars['String']>;
  transaction_not?: InputMaybe<Scalars['String']>;
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_not_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
  transaction_starts_with_nocase?: InputMaybe<Scalars['String']>;
  transactions_?: InputMaybe<MultisigTransaction_Filter>;
};

export enum MultisigContract_OrderBy {
  Id = 'id',
  Owners = 'owners',
  Required = 'required',
  Timestamp = 'timestamp',
  Transaction = 'transaction',
  Transactions = 'transactions',
}

export type MultisigTransaction = {
  __typename?: 'MultisigTransaction';
  confirmations: Array<MultisigConfirmation>;
  data: Scalars['Bytes'];
  destination: Scalars['Bytes'];
  id: Scalars['ID'];
  multisigContract: MultisigContract;
  status: MultisigTransactionStatus;
  submitter: User;
  timestamp: Scalars['Int'];
  transaction: Transaction;
  transactionId: Scalars['Int'];
  value: Scalars['BigInt'];
};

export type MultisigTransactionConfirmationsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MultisigConfirmation_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<MultisigConfirmation_Filter>;
};

export enum MultisigTransactionStatus {
  Executed = 'EXECUTED',
  Failed = 'FAILED',
  Submitted = 'SUBMITTED',
}

export type MultisigTransaction_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  confirmations_?: InputMaybe<MultisigConfirmation_Filter>;
  data?: InputMaybe<Scalars['Bytes']>;
  data_contains?: InputMaybe<Scalars['Bytes']>;
  data_in?: InputMaybe<Array<Scalars['Bytes']>>;
  data_not?: InputMaybe<Scalars['Bytes']>;
  data_not_contains?: InputMaybe<Scalars['Bytes']>;
  data_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  destination?: InputMaybe<Scalars['Bytes']>;
  destination_contains?: InputMaybe<Scalars['Bytes']>;
  destination_in?: InputMaybe<Array<Scalars['Bytes']>>;
  destination_not?: InputMaybe<Scalars['Bytes']>;
  destination_not_contains?: InputMaybe<Scalars['Bytes']>;
  destination_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  multisigContract?: InputMaybe<Scalars['String']>;
  multisigContract_?: InputMaybe<MultisigContract_Filter>;
  multisigContract_contains?: InputMaybe<Scalars['String']>;
  multisigContract_contains_nocase?: InputMaybe<Scalars['String']>;
  multisigContract_ends_with?: InputMaybe<Scalars['String']>;
  multisigContract_ends_with_nocase?: InputMaybe<Scalars['String']>;
  multisigContract_gt?: InputMaybe<Scalars['String']>;
  multisigContract_gte?: InputMaybe<Scalars['String']>;
  multisigContract_in?: InputMaybe<Array<Scalars['String']>>;
  multisigContract_lt?: InputMaybe<Scalars['String']>;
  multisigContract_lte?: InputMaybe<Scalars['String']>;
  multisigContract_not?: InputMaybe<Scalars['String']>;
  multisigContract_not_contains?: InputMaybe<Scalars['String']>;
  multisigContract_not_contains_nocase?: InputMaybe<Scalars['String']>;
  multisigContract_not_ends_with?: InputMaybe<Scalars['String']>;
  multisigContract_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  multisigContract_not_in?: InputMaybe<Array<Scalars['String']>>;
  multisigContract_not_starts_with?: InputMaybe<Scalars['String']>;
  multisigContract_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  multisigContract_starts_with?: InputMaybe<Scalars['String']>;
  multisigContract_starts_with_nocase?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<MultisigTransactionStatus>;
  status_in?: InputMaybe<Array<MultisigTransactionStatus>>;
  status_not?: InputMaybe<MultisigTransactionStatus>;
  status_not_in?: InputMaybe<Array<MultisigTransactionStatus>>;
  submitter?: InputMaybe<Scalars['String']>;
  submitter_?: InputMaybe<User_Filter>;
  submitter_contains?: InputMaybe<Scalars['String']>;
  submitter_contains_nocase?: InputMaybe<Scalars['String']>;
  submitter_ends_with?: InputMaybe<Scalars['String']>;
  submitter_ends_with_nocase?: InputMaybe<Scalars['String']>;
  submitter_gt?: InputMaybe<Scalars['String']>;
  submitter_gte?: InputMaybe<Scalars['String']>;
  submitter_in?: InputMaybe<Array<Scalars['String']>>;
  submitter_lt?: InputMaybe<Scalars['String']>;
  submitter_lte?: InputMaybe<Scalars['String']>;
  submitter_not?: InputMaybe<Scalars['String']>;
  submitter_not_contains?: InputMaybe<Scalars['String']>;
  submitter_not_contains_nocase?: InputMaybe<Scalars['String']>;
  submitter_not_ends_with?: InputMaybe<Scalars['String']>;
  submitter_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  submitter_not_in?: InputMaybe<Array<Scalars['String']>>;
  submitter_not_starts_with?: InputMaybe<Scalars['String']>;
  submitter_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  submitter_starts_with?: InputMaybe<Scalars['String']>;
  submitter_starts_with_nocase?: InputMaybe<Scalars['String']>;
  timestamp?: InputMaybe<Scalars['Int']>;
  timestamp_gt?: InputMaybe<Scalars['Int']>;
  timestamp_gte?: InputMaybe<Scalars['Int']>;
  timestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp_lt?: InputMaybe<Scalars['Int']>;
  timestamp_lte?: InputMaybe<Scalars['Int']>;
  timestamp_not?: InputMaybe<Scalars['Int']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
  transaction?: InputMaybe<Scalars['String']>;
  transactionId?: InputMaybe<Scalars['Int']>;
  transactionId_gt?: InputMaybe<Scalars['Int']>;
  transactionId_gte?: InputMaybe<Scalars['Int']>;
  transactionId_in?: InputMaybe<Array<Scalars['Int']>>;
  transactionId_lt?: InputMaybe<Scalars['Int']>;
  transactionId_lte?: InputMaybe<Scalars['Int']>;
  transactionId_not?: InputMaybe<Scalars['Int']>;
  transactionId_not_in?: InputMaybe<Array<Scalars['Int']>>;
  transaction_?: InputMaybe<Transaction_Filter>;
  transaction_contains?: InputMaybe<Scalars['String']>;
  transaction_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_gt?: InputMaybe<Scalars['String']>;
  transaction_gte?: InputMaybe<Scalars['String']>;
  transaction_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_lt?: InputMaybe<Scalars['String']>;
  transaction_lte?: InputMaybe<Scalars['String']>;
  transaction_not?: InputMaybe<Scalars['String']>;
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_not_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
  transaction_starts_with_nocase?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<Scalars['BigInt']>;
  value_gt?: InputMaybe<Scalars['BigInt']>;
  value_gte?: InputMaybe<Scalars['BigInt']>;
  value_in?: InputMaybe<Array<Scalars['BigInt']>>;
  value_lt?: InputMaybe<Scalars['BigInt']>;
  value_lte?: InputMaybe<Scalars['BigInt']>;
  value_not?: InputMaybe<Scalars['BigInt']>;
  value_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export enum MultisigTransaction_OrderBy {
  Confirmations = 'confirmations',
  Data = 'data',
  Destination = 'destination',
  Id = 'id',
  MultisigContract = 'multisigContract',
  Status = 'status',
  Submitter = 'submitter',
  Timestamp = 'timestamp',
  Transaction = 'transaction',
  TransactionId = 'transactionId',
  Value = 'value',
}

export enum Network {
  Mainnet = 'Mainnet',
  Testnet = 'Testnet',
}

export type NewBitcoinTransferIncoming = {
  __typename?: 'NewBitcoinTransferIncoming';
  amountWei: Scalars['BigInt'];
  blockNumber: Scalars['BigInt'];
  blockTimestamp: Scalars['BigInt'];
  btcTxHash: Scalars['Bytes'];
  btcTxVout: Scalars['BigInt'];
  emittedBy: Scalars['Bytes'];
  feeWei: Scalars['BigInt'];
  id: Scalars['ID'];
  rskAddress: Scalars['Bytes'];
  timestamp: Scalars['BigInt'];
  transaction: Transaction;
  transactionHash: Scalars['Bytes'];
};

export type NewBitcoinTransferIncoming_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amountWei?: InputMaybe<Scalars['BigInt']>;
  amountWei_gt?: InputMaybe<Scalars['BigInt']>;
  amountWei_gte?: InputMaybe<Scalars['BigInt']>;
  amountWei_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amountWei_lt?: InputMaybe<Scalars['BigInt']>;
  amountWei_lte?: InputMaybe<Scalars['BigInt']>;
  amountWei_not?: InputMaybe<Scalars['BigInt']>;
  amountWei_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockNumber?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  btcTxHash?: InputMaybe<Scalars['Bytes']>;
  btcTxHash_contains?: InputMaybe<Scalars['Bytes']>;
  btcTxHash_in?: InputMaybe<Array<Scalars['Bytes']>>;
  btcTxHash_not?: InputMaybe<Scalars['Bytes']>;
  btcTxHash_not_contains?: InputMaybe<Scalars['Bytes']>;
  btcTxHash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  btcTxVout?: InputMaybe<Scalars['BigInt']>;
  btcTxVout_gt?: InputMaybe<Scalars['BigInt']>;
  btcTxVout_gte?: InputMaybe<Scalars['BigInt']>;
  btcTxVout_in?: InputMaybe<Array<Scalars['BigInt']>>;
  btcTxVout_lt?: InputMaybe<Scalars['BigInt']>;
  btcTxVout_lte?: InputMaybe<Scalars['BigInt']>;
  btcTxVout_not?: InputMaybe<Scalars['BigInt']>;
  btcTxVout_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  emittedBy?: InputMaybe<Scalars['Bytes']>;
  emittedBy_contains?: InputMaybe<Scalars['Bytes']>;
  emittedBy_in?: InputMaybe<Array<Scalars['Bytes']>>;
  emittedBy_not?: InputMaybe<Scalars['Bytes']>;
  emittedBy_not_contains?: InputMaybe<Scalars['Bytes']>;
  emittedBy_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  feeWei?: InputMaybe<Scalars['BigInt']>;
  feeWei_gt?: InputMaybe<Scalars['BigInt']>;
  feeWei_gte?: InputMaybe<Scalars['BigInt']>;
  feeWei_in?: InputMaybe<Array<Scalars['BigInt']>>;
  feeWei_lt?: InputMaybe<Scalars['BigInt']>;
  feeWei_lte?: InputMaybe<Scalars['BigInt']>;
  feeWei_not?: InputMaybe<Scalars['BigInt']>;
  feeWei_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  rskAddress?: InputMaybe<Scalars['Bytes']>;
  rskAddress_contains?: InputMaybe<Scalars['Bytes']>;
  rskAddress_in?: InputMaybe<Array<Scalars['Bytes']>>;
  rskAddress_not?: InputMaybe<Scalars['Bytes']>;
  rskAddress_not_contains?: InputMaybe<Scalars['Bytes']>;
  rskAddress_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  timestamp?: InputMaybe<Scalars['BigInt']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  transaction?: InputMaybe<Scalars['String']>;
  transactionHash?: InputMaybe<Scalars['Bytes']>;
  transactionHash_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transactionHash_not?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transaction_?: InputMaybe<Transaction_Filter>;
  transaction_contains?: InputMaybe<Scalars['String']>;
  transaction_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_gt?: InputMaybe<Scalars['String']>;
  transaction_gte?: InputMaybe<Scalars['String']>;
  transaction_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_lt?: InputMaybe<Scalars['String']>;
  transaction_lte?: InputMaybe<Scalars['String']>;
  transaction_not?: InputMaybe<Scalars['String']>;
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_not_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
  transaction_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum NewBitcoinTransferIncoming_OrderBy {
  AmountWei = 'amountWei',
  BlockNumber = 'blockNumber',
  BlockTimestamp = 'blockTimestamp',
  BtcTxHash = 'btcTxHash',
  BtcTxVout = 'btcTxVout',
  EmittedBy = 'emittedBy',
  FeeWei = 'feeWei',
  Id = 'id',
  RskAddress = 'rskAddress',
  Timestamp = 'timestamp',
  Transaction = 'transaction',
  TransactionHash = 'transactionHash',
}

export type OrderCanceled = {
  __typename?: 'OrderCanceled';
  emittedBy: Scalars['Bytes'];
  hash: Scalars['Bytes'];
  id: Scalars['ID'];
  maker: Scalars['Bytes'];
  timestamp: Scalars['Int'];
  transaction: Transaction;
};

export type OrderCanceled_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  emittedBy?: InputMaybe<Scalars['Bytes']>;
  emittedBy_contains?: InputMaybe<Scalars['Bytes']>;
  emittedBy_in?: InputMaybe<Array<Scalars['Bytes']>>;
  emittedBy_not?: InputMaybe<Scalars['Bytes']>;
  emittedBy_not_contains?: InputMaybe<Scalars['Bytes']>;
  emittedBy_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  hash?: InputMaybe<Scalars['Bytes']>;
  hash_contains?: InputMaybe<Scalars['Bytes']>;
  hash_in?: InputMaybe<Array<Scalars['Bytes']>>;
  hash_not?: InputMaybe<Scalars['Bytes']>;
  hash_not_contains?: InputMaybe<Scalars['Bytes']>;
  hash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  maker?: InputMaybe<Scalars['Bytes']>;
  maker_contains?: InputMaybe<Scalars['Bytes']>;
  maker_in?: InputMaybe<Array<Scalars['Bytes']>>;
  maker_not?: InputMaybe<Scalars['Bytes']>;
  maker_not_contains?: InputMaybe<Scalars['Bytes']>;
  maker_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  timestamp?: InputMaybe<Scalars['Int']>;
  timestamp_gt?: InputMaybe<Scalars['Int']>;
  timestamp_gte?: InputMaybe<Scalars['Int']>;
  timestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp_lt?: InputMaybe<Scalars['Int']>;
  timestamp_lte?: InputMaybe<Scalars['Int']>;
  timestamp_not?: InputMaybe<Scalars['Int']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
  transaction?: InputMaybe<Scalars['String']>;
  transaction_?: InputMaybe<Transaction_Filter>;
  transaction_contains?: InputMaybe<Scalars['String']>;
  transaction_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_gt?: InputMaybe<Scalars['String']>;
  transaction_gte?: InputMaybe<Scalars['String']>;
  transaction_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_lt?: InputMaybe<Scalars['String']>;
  transaction_lte?: InputMaybe<Scalars['String']>;
  transaction_not?: InputMaybe<Scalars['String']>;
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_not_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
  transaction_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum OrderCanceled_OrderBy {
  EmittedBy = 'emittedBy',
  Hash = 'hash',
  Id = 'id',
  Maker = 'maker',
  Timestamp = 'timestamp',
  Transaction = 'transaction',
}

export type OrderCreated = {
  __typename?: 'OrderCreated';
  emittedBy: Scalars['Bytes'];
  hash: Scalars['Bytes'];
  id: Scalars['ID'];
  /**
   * The price at which the order should be executed.
   * This is a BigInt (usually 1e18), not a human-readable decimal. (See above for explanation)
   *
   */
  limitPrice: Scalars['BigInt'];
  network: Network;
  /**
   * The amountIn is a BigInt (usually 1e18), not a human-readable decimal.
   * This is because both orderbooks are on testnet, and so this subgraph cannot access the correct number of token decimals for mainnet tokens
   *
   */
  order_amountIn: Scalars['BigInt'];
  /**
   * The amountIn is a BigInt (usually 1e18), not a human-readable decimal. (See above for explanation)
   *
   */
  order_amountOutMin: Scalars['BigInt'];
  /**
   * Timestamp when the order was created
   *
   */
  order_created: Scalars['BigInt'];
  /**
   * Timestamp when the order must be filled by
   *
   */
  order_deadline: Scalars['BigInt'];
  order_fromToken: Scalars['Bytes'];
  /**
   * This is the User address. This is not a User entity because of the testnet/mainnet issue (see above comment)
   *
   */
  order_maker: Scalars['Bytes'];
  order_recipient: Scalars['Bytes'];
  order_toToken: Scalars['Bytes'];
  timestamp: Scalars['Int'];
  transaction: Transaction;
};

export type OrderCreated_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  emittedBy?: InputMaybe<Scalars['Bytes']>;
  emittedBy_contains?: InputMaybe<Scalars['Bytes']>;
  emittedBy_in?: InputMaybe<Array<Scalars['Bytes']>>;
  emittedBy_not?: InputMaybe<Scalars['Bytes']>;
  emittedBy_not_contains?: InputMaybe<Scalars['Bytes']>;
  emittedBy_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  hash?: InputMaybe<Scalars['Bytes']>;
  hash_contains?: InputMaybe<Scalars['Bytes']>;
  hash_in?: InputMaybe<Array<Scalars['Bytes']>>;
  hash_not?: InputMaybe<Scalars['Bytes']>;
  hash_not_contains?: InputMaybe<Scalars['Bytes']>;
  hash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  limitPrice?: InputMaybe<Scalars['BigInt']>;
  limitPrice_gt?: InputMaybe<Scalars['BigInt']>;
  limitPrice_gte?: InputMaybe<Scalars['BigInt']>;
  limitPrice_in?: InputMaybe<Array<Scalars['BigInt']>>;
  limitPrice_lt?: InputMaybe<Scalars['BigInt']>;
  limitPrice_lte?: InputMaybe<Scalars['BigInt']>;
  limitPrice_not?: InputMaybe<Scalars['BigInt']>;
  limitPrice_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  network?: InputMaybe<Network>;
  network_in?: InputMaybe<Array<Network>>;
  network_not?: InputMaybe<Network>;
  network_not_in?: InputMaybe<Array<Network>>;
  order_amountIn?: InputMaybe<Scalars['BigInt']>;
  order_amountIn_gt?: InputMaybe<Scalars['BigInt']>;
  order_amountIn_gte?: InputMaybe<Scalars['BigInt']>;
  order_amountIn_in?: InputMaybe<Array<Scalars['BigInt']>>;
  order_amountIn_lt?: InputMaybe<Scalars['BigInt']>;
  order_amountIn_lte?: InputMaybe<Scalars['BigInt']>;
  order_amountIn_not?: InputMaybe<Scalars['BigInt']>;
  order_amountIn_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  order_amountOutMin?: InputMaybe<Scalars['BigInt']>;
  order_amountOutMin_gt?: InputMaybe<Scalars['BigInt']>;
  order_amountOutMin_gte?: InputMaybe<Scalars['BigInt']>;
  order_amountOutMin_in?: InputMaybe<Array<Scalars['BigInt']>>;
  order_amountOutMin_lt?: InputMaybe<Scalars['BigInt']>;
  order_amountOutMin_lte?: InputMaybe<Scalars['BigInt']>;
  order_amountOutMin_not?: InputMaybe<Scalars['BigInt']>;
  order_amountOutMin_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  order_created?: InputMaybe<Scalars['BigInt']>;
  order_created_gt?: InputMaybe<Scalars['BigInt']>;
  order_created_gte?: InputMaybe<Scalars['BigInt']>;
  order_created_in?: InputMaybe<Array<Scalars['BigInt']>>;
  order_created_lt?: InputMaybe<Scalars['BigInt']>;
  order_created_lte?: InputMaybe<Scalars['BigInt']>;
  order_created_not?: InputMaybe<Scalars['BigInt']>;
  order_created_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  order_deadline?: InputMaybe<Scalars['BigInt']>;
  order_deadline_gt?: InputMaybe<Scalars['BigInt']>;
  order_deadline_gte?: InputMaybe<Scalars['BigInt']>;
  order_deadline_in?: InputMaybe<Array<Scalars['BigInt']>>;
  order_deadline_lt?: InputMaybe<Scalars['BigInt']>;
  order_deadline_lte?: InputMaybe<Scalars['BigInt']>;
  order_deadline_not?: InputMaybe<Scalars['BigInt']>;
  order_deadline_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  order_fromToken?: InputMaybe<Scalars['Bytes']>;
  order_fromToken_contains?: InputMaybe<Scalars['Bytes']>;
  order_fromToken_in?: InputMaybe<Array<Scalars['Bytes']>>;
  order_fromToken_not?: InputMaybe<Scalars['Bytes']>;
  order_fromToken_not_contains?: InputMaybe<Scalars['Bytes']>;
  order_fromToken_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  order_maker?: InputMaybe<Scalars['Bytes']>;
  order_maker_contains?: InputMaybe<Scalars['Bytes']>;
  order_maker_in?: InputMaybe<Array<Scalars['Bytes']>>;
  order_maker_not?: InputMaybe<Scalars['Bytes']>;
  order_maker_not_contains?: InputMaybe<Scalars['Bytes']>;
  order_maker_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  order_recipient?: InputMaybe<Scalars['Bytes']>;
  order_recipient_contains?: InputMaybe<Scalars['Bytes']>;
  order_recipient_in?: InputMaybe<Array<Scalars['Bytes']>>;
  order_recipient_not?: InputMaybe<Scalars['Bytes']>;
  order_recipient_not_contains?: InputMaybe<Scalars['Bytes']>;
  order_recipient_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  order_toToken?: InputMaybe<Scalars['Bytes']>;
  order_toToken_contains?: InputMaybe<Scalars['Bytes']>;
  order_toToken_in?: InputMaybe<Array<Scalars['Bytes']>>;
  order_toToken_not?: InputMaybe<Scalars['Bytes']>;
  order_toToken_not_contains?: InputMaybe<Scalars['Bytes']>;
  order_toToken_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  timestamp?: InputMaybe<Scalars['Int']>;
  timestamp_gt?: InputMaybe<Scalars['Int']>;
  timestamp_gte?: InputMaybe<Scalars['Int']>;
  timestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp_lt?: InputMaybe<Scalars['Int']>;
  timestamp_lte?: InputMaybe<Scalars['Int']>;
  timestamp_not?: InputMaybe<Scalars['Int']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
  transaction?: InputMaybe<Scalars['String']>;
  transaction_?: InputMaybe<Transaction_Filter>;
  transaction_contains?: InputMaybe<Scalars['String']>;
  transaction_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_gt?: InputMaybe<Scalars['String']>;
  transaction_gte?: InputMaybe<Scalars['String']>;
  transaction_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_lt?: InputMaybe<Scalars['String']>;
  transaction_lte?: InputMaybe<Scalars['String']>;
  transaction_not?: InputMaybe<Scalars['String']>;
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_not_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
  transaction_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum OrderCreated_OrderBy {
  EmittedBy = 'emittedBy',
  Hash = 'hash',
  Id = 'id',
  LimitPrice = 'limitPrice',
  Network = 'network',
  OrderAmountIn = 'order_amountIn',
  OrderAmountOutMin = 'order_amountOutMin',
  OrderCreated = 'order_created',
  OrderDeadline = 'order_deadline',
  OrderFromToken = 'order_fromToken',
  OrderMaker = 'order_maker',
  OrderRecipient = 'order_recipient',
  OrderToToken = 'order_toToken',
  Timestamp = 'timestamp',
  Transaction = 'transaction',
}

/** Defines the order direction, either ascending or descending */
export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc',
}

export type OrderFilled = {
  __typename?: 'OrderFilled';
  amountIn: Scalars['BigDecimal'];
  amountOut: Scalars['BigDecimal'];
  emittedBy: Scalars['Bytes'];
  filledPrice: Scalars['BigDecimal'];
  hash: Scalars['Bytes'];
  id: Scalars['ID'];
  maker: User;
  path: Array<Scalars['String']>;
  timestamp: Scalars['Int'];
  transaction: Transaction;
};

export type OrderFilled_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amountIn?: InputMaybe<Scalars['BigDecimal']>;
  amountIn_gt?: InputMaybe<Scalars['BigDecimal']>;
  amountIn_gte?: InputMaybe<Scalars['BigDecimal']>;
  amountIn_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  amountIn_lt?: InputMaybe<Scalars['BigDecimal']>;
  amountIn_lte?: InputMaybe<Scalars['BigDecimal']>;
  amountIn_not?: InputMaybe<Scalars['BigDecimal']>;
  amountIn_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  amountOut?: InputMaybe<Scalars['BigDecimal']>;
  amountOut_gt?: InputMaybe<Scalars['BigDecimal']>;
  amountOut_gte?: InputMaybe<Scalars['BigDecimal']>;
  amountOut_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  amountOut_lt?: InputMaybe<Scalars['BigDecimal']>;
  amountOut_lte?: InputMaybe<Scalars['BigDecimal']>;
  amountOut_not?: InputMaybe<Scalars['BigDecimal']>;
  amountOut_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  emittedBy?: InputMaybe<Scalars['Bytes']>;
  emittedBy_contains?: InputMaybe<Scalars['Bytes']>;
  emittedBy_in?: InputMaybe<Array<Scalars['Bytes']>>;
  emittedBy_not?: InputMaybe<Scalars['Bytes']>;
  emittedBy_not_contains?: InputMaybe<Scalars['Bytes']>;
  emittedBy_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  filledPrice?: InputMaybe<Scalars['BigDecimal']>;
  filledPrice_gt?: InputMaybe<Scalars['BigDecimal']>;
  filledPrice_gte?: InputMaybe<Scalars['BigDecimal']>;
  filledPrice_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  filledPrice_lt?: InputMaybe<Scalars['BigDecimal']>;
  filledPrice_lte?: InputMaybe<Scalars['BigDecimal']>;
  filledPrice_not?: InputMaybe<Scalars['BigDecimal']>;
  filledPrice_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  hash?: InputMaybe<Scalars['Bytes']>;
  hash_contains?: InputMaybe<Scalars['Bytes']>;
  hash_in?: InputMaybe<Array<Scalars['Bytes']>>;
  hash_not?: InputMaybe<Scalars['Bytes']>;
  hash_not_contains?: InputMaybe<Scalars['Bytes']>;
  hash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  maker?: InputMaybe<Scalars['String']>;
  maker_?: InputMaybe<User_Filter>;
  maker_contains?: InputMaybe<Scalars['String']>;
  maker_contains_nocase?: InputMaybe<Scalars['String']>;
  maker_ends_with?: InputMaybe<Scalars['String']>;
  maker_ends_with_nocase?: InputMaybe<Scalars['String']>;
  maker_gt?: InputMaybe<Scalars['String']>;
  maker_gte?: InputMaybe<Scalars['String']>;
  maker_in?: InputMaybe<Array<Scalars['String']>>;
  maker_lt?: InputMaybe<Scalars['String']>;
  maker_lte?: InputMaybe<Scalars['String']>;
  maker_not?: InputMaybe<Scalars['String']>;
  maker_not_contains?: InputMaybe<Scalars['String']>;
  maker_not_contains_nocase?: InputMaybe<Scalars['String']>;
  maker_not_ends_with?: InputMaybe<Scalars['String']>;
  maker_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  maker_not_in?: InputMaybe<Array<Scalars['String']>>;
  maker_not_starts_with?: InputMaybe<Scalars['String']>;
  maker_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  maker_starts_with?: InputMaybe<Scalars['String']>;
  maker_starts_with_nocase?: InputMaybe<Scalars['String']>;
  path?: InputMaybe<Array<Scalars['String']>>;
  path_contains?: InputMaybe<Array<Scalars['String']>>;
  path_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  path_not?: InputMaybe<Array<Scalars['String']>>;
  path_not_contains?: InputMaybe<Array<Scalars['String']>>;
  path_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  timestamp?: InputMaybe<Scalars['Int']>;
  timestamp_gt?: InputMaybe<Scalars['Int']>;
  timestamp_gte?: InputMaybe<Scalars['Int']>;
  timestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp_lt?: InputMaybe<Scalars['Int']>;
  timestamp_lte?: InputMaybe<Scalars['Int']>;
  timestamp_not?: InputMaybe<Scalars['Int']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
  transaction?: InputMaybe<Scalars['String']>;
  transaction_?: InputMaybe<Transaction_Filter>;
  transaction_contains?: InputMaybe<Scalars['String']>;
  transaction_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_gt?: InputMaybe<Scalars['String']>;
  transaction_gte?: InputMaybe<Scalars['String']>;
  transaction_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_lt?: InputMaybe<Scalars['String']>;
  transaction_lte?: InputMaybe<Scalars['String']>;
  transaction_not?: InputMaybe<Scalars['String']>;
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_not_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
  transaction_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum OrderFilled_OrderBy {
  AmountIn = 'amountIn',
  AmountOut = 'amountOut',
  EmittedBy = 'emittedBy',
  FilledPrice = 'filledPrice',
  Hash = 'hash',
  Id = 'id',
  Maker = 'maker',
  Path = 'path',
  Timestamp = 'timestamp',
  Transaction = 'transaction',
}

/**
 * Granular event data for the Loan entity. Emitted when a user Borrows and when a loan is rolled over
 *
 */
export type PayBorrowingFee = {
  __typename?: 'PayBorrowingFee';
  amount: Scalars['BigDecimal'];
  emittedBy: Scalars['Bytes'];
  id: Scalars['ID'];
  loanId: Loan;
  payer: Scalars['Bytes'];
  timestamp: Scalars['Int'];
  token: Scalars['Bytes'];
  transaction: Transaction;
};

export type PayBorrowingFee_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars['BigDecimal']>;
  amount_gt?: InputMaybe<Scalars['BigDecimal']>;
  amount_gte?: InputMaybe<Scalars['BigDecimal']>;
  amount_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  amount_lt?: InputMaybe<Scalars['BigDecimal']>;
  amount_lte?: InputMaybe<Scalars['BigDecimal']>;
  amount_not?: InputMaybe<Scalars['BigDecimal']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  emittedBy?: InputMaybe<Scalars['Bytes']>;
  emittedBy_contains?: InputMaybe<Scalars['Bytes']>;
  emittedBy_in?: InputMaybe<Array<Scalars['Bytes']>>;
  emittedBy_not?: InputMaybe<Scalars['Bytes']>;
  emittedBy_not_contains?: InputMaybe<Scalars['Bytes']>;
  emittedBy_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  loanId?: InputMaybe<Scalars['String']>;
  loanId_?: InputMaybe<Loan_Filter>;
  loanId_contains?: InputMaybe<Scalars['String']>;
  loanId_contains_nocase?: InputMaybe<Scalars['String']>;
  loanId_ends_with?: InputMaybe<Scalars['String']>;
  loanId_ends_with_nocase?: InputMaybe<Scalars['String']>;
  loanId_gt?: InputMaybe<Scalars['String']>;
  loanId_gte?: InputMaybe<Scalars['String']>;
  loanId_in?: InputMaybe<Array<Scalars['String']>>;
  loanId_lt?: InputMaybe<Scalars['String']>;
  loanId_lte?: InputMaybe<Scalars['String']>;
  loanId_not?: InputMaybe<Scalars['String']>;
  loanId_not_contains?: InputMaybe<Scalars['String']>;
  loanId_not_contains_nocase?: InputMaybe<Scalars['String']>;
  loanId_not_ends_with?: InputMaybe<Scalars['String']>;
  loanId_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  loanId_not_in?: InputMaybe<Array<Scalars['String']>>;
  loanId_not_starts_with?: InputMaybe<Scalars['String']>;
  loanId_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  loanId_starts_with?: InputMaybe<Scalars['String']>;
  loanId_starts_with_nocase?: InputMaybe<Scalars['String']>;
  payer?: InputMaybe<Scalars['Bytes']>;
  payer_contains?: InputMaybe<Scalars['Bytes']>;
  payer_in?: InputMaybe<Array<Scalars['Bytes']>>;
  payer_not?: InputMaybe<Scalars['Bytes']>;
  payer_not_contains?: InputMaybe<Scalars['Bytes']>;
  payer_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  timestamp?: InputMaybe<Scalars['Int']>;
  timestamp_gt?: InputMaybe<Scalars['Int']>;
  timestamp_gte?: InputMaybe<Scalars['Int']>;
  timestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp_lt?: InputMaybe<Scalars['Int']>;
  timestamp_lte?: InputMaybe<Scalars['Int']>;
  timestamp_not?: InputMaybe<Scalars['Int']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
  token?: InputMaybe<Scalars['Bytes']>;
  token_contains?: InputMaybe<Scalars['Bytes']>;
  token_in?: InputMaybe<Array<Scalars['Bytes']>>;
  token_not?: InputMaybe<Scalars['Bytes']>;
  token_not_contains?: InputMaybe<Scalars['Bytes']>;
  token_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transaction?: InputMaybe<Scalars['String']>;
  transaction_?: InputMaybe<Transaction_Filter>;
  transaction_contains?: InputMaybe<Scalars['String']>;
  transaction_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_gt?: InputMaybe<Scalars['String']>;
  transaction_gte?: InputMaybe<Scalars['String']>;
  transaction_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_lt?: InputMaybe<Scalars['String']>;
  transaction_lte?: InputMaybe<Scalars['String']>;
  transaction_not?: InputMaybe<Scalars['String']>;
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_not_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
  transaction_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum PayBorrowingFee_OrderBy {
  Amount = 'amount',
  EmittedBy = 'emittedBy',
  Id = 'id',
  LoanId = 'loanId',
  Payer = 'payer',
  Timestamp = 'timestamp',
  Token = 'token',
  Transaction = 'transaction',
}

export type PayInterestTransfer = {
  __typename?: 'PayInterestTransfer';
  effectiveInterest: Scalars['BigDecimal'];
  emittedBy: Scalars['String'];
  id: Scalars['ID'];
  interestToken: Token;
  lender: LendingPool;
  timestamp: Scalars['Int'];
  transaction: Transaction;
};

export type PayInterestTransfer_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  effectiveInterest?: InputMaybe<Scalars['BigDecimal']>;
  effectiveInterest_gt?: InputMaybe<Scalars['BigDecimal']>;
  effectiveInterest_gte?: InputMaybe<Scalars['BigDecimal']>;
  effectiveInterest_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  effectiveInterest_lt?: InputMaybe<Scalars['BigDecimal']>;
  effectiveInterest_lte?: InputMaybe<Scalars['BigDecimal']>;
  effectiveInterest_not?: InputMaybe<Scalars['BigDecimal']>;
  effectiveInterest_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  emittedBy?: InputMaybe<Scalars['String']>;
  emittedBy_contains?: InputMaybe<Scalars['String']>;
  emittedBy_contains_nocase?: InputMaybe<Scalars['String']>;
  emittedBy_ends_with?: InputMaybe<Scalars['String']>;
  emittedBy_ends_with_nocase?: InputMaybe<Scalars['String']>;
  emittedBy_gt?: InputMaybe<Scalars['String']>;
  emittedBy_gte?: InputMaybe<Scalars['String']>;
  emittedBy_in?: InputMaybe<Array<Scalars['String']>>;
  emittedBy_lt?: InputMaybe<Scalars['String']>;
  emittedBy_lte?: InputMaybe<Scalars['String']>;
  emittedBy_not?: InputMaybe<Scalars['String']>;
  emittedBy_not_contains?: InputMaybe<Scalars['String']>;
  emittedBy_not_contains_nocase?: InputMaybe<Scalars['String']>;
  emittedBy_not_ends_with?: InputMaybe<Scalars['String']>;
  emittedBy_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  emittedBy_not_in?: InputMaybe<Array<Scalars['String']>>;
  emittedBy_not_starts_with?: InputMaybe<Scalars['String']>;
  emittedBy_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  emittedBy_starts_with?: InputMaybe<Scalars['String']>;
  emittedBy_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  interestToken?: InputMaybe<Scalars['String']>;
  interestToken_?: InputMaybe<Token_Filter>;
  interestToken_contains?: InputMaybe<Scalars['String']>;
  interestToken_contains_nocase?: InputMaybe<Scalars['String']>;
  interestToken_ends_with?: InputMaybe<Scalars['String']>;
  interestToken_ends_with_nocase?: InputMaybe<Scalars['String']>;
  interestToken_gt?: InputMaybe<Scalars['String']>;
  interestToken_gte?: InputMaybe<Scalars['String']>;
  interestToken_in?: InputMaybe<Array<Scalars['String']>>;
  interestToken_lt?: InputMaybe<Scalars['String']>;
  interestToken_lte?: InputMaybe<Scalars['String']>;
  interestToken_not?: InputMaybe<Scalars['String']>;
  interestToken_not_contains?: InputMaybe<Scalars['String']>;
  interestToken_not_contains_nocase?: InputMaybe<Scalars['String']>;
  interestToken_not_ends_with?: InputMaybe<Scalars['String']>;
  interestToken_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  interestToken_not_in?: InputMaybe<Array<Scalars['String']>>;
  interestToken_not_starts_with?: InputMaybe<Scalars['String']>;
  interestToken_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  interestToken_starts_with?: InputMaybe<Scalars['String']>;
  interestToken_starts_with_nocase?: InputMaybe<Scalars['String']>;
  lender?: InputMaybe<Scalars['String']>;
  lender_?: InputMaybe<LendingPool_Filter>;
  lender_contains?: InputMaybe<Scalars['String']>;
  lender_contains_nocase?: InputMaybe<Scalars['String']>;
  lender_ends_with?: InputMaybe<Scalars['String']>;
  lender_ends_with_nocase?: InputMaybe<Scalars['String']>;
  lender_gt?: InputMaybe<Scalars['String']>;
  lender_gte?: InputMaybe<Scalars['String']>;
  lender_in?: InputMaybe<Array<Scalars['String']>>;
  lender_lt?: InputMaybe<Scalars['String']>;
  lender_lte?: InputMaybe<Scalars['String']>;
  lender_not?: InputMaybe<Scalars['String']>;
  lender_not_contains?: InputMaybe<Scalars['String']>;
  lender_not_contains_nocase?: InputMaybe<Scalars['String']>;
  lender_not_ends_with?: InputMaybe<Scalars['String']>;
  lender_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  lender_not_in?: InputMaybe<Array<Scalars['String']>>;
  lender_not_starts_with?: InputMaybe<Scalars['String']>;
  lender_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  lender_starts_with?: InputMaybe<Scalars['String']>;
  lender_starts_with_nocase?: InputMaybe<Scalars['String']>;
  timestamp?: InputMaybe<Scalars['Int']>;
  timestamp_gt?: InputMaybe<Scalars['Int']>;
  timestamp_gte?: InputMaybe<Scalars['Int']>;
  timestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp_lt?: InputMaybe<Scalars['Int']>;
  timestamp_lte?: InputMaybe<Scalars['Int']>;
  timestamp_not?: InputMaybe<Scalars['Int']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
  transaction?: InputMaybe<Scalars['String']>;
  transaction_?: InputMaybe<Transaction_Filter>;
  transaction_contains?: InputMaybe<Scalars['String']>;
  transaction_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_gt?: InputMaybe<Scalars['String']>;
  transaction_gte?: InputMaybe<Scalars['String']>;
  transaction_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_lt?: InputMaybe<Scalars['String']>;
  transaction_lte?: InputMaybe<Scalars['String']>;
  transaction_not?: InputMaybe<Scalars['String']>;
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_not_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
  transaction_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum PayInterestTransfer_OrderBy {
  EffectiveInterest = 'effectiveInterest',
  EmittedBy = 'emittedBy',
  Id = 'id',
  InterestToken = 'interestToken',
  Lender = 'lender',
  Timestamp = 'timestamp',
  Transaction = 'transaction',
}

/**
 * Granular event data for the Loan entity. Emitted when a user Lends or Unlends and when a loan is rolled over
 *
 */
export type PayLendingFee = {
  __typename?: 'PayLendingFee';
  amount: Scalars['BigDecimal'];
  emittedBy: Scalars['Bytes'];
  id: Scalars['ID'];
  payer: Scalars['Bytes'];
  timestamp: Scalars['Int'];
  token: Scalars['Bytes'];
  transaction: Transaction;
};

export type PayLendingFee_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars['BigDecimal']>;
  amount_gt?: InputMaybe<Scalars['BigDecimal']>;
  amount_gte?: InputMaybe<Scalars['BigDecimal']>;
  amount_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  amount_lt?: InputMaybe<Scalars['BigDecimal']>;
  amount_lte?: InputMaybe<Scalars['BigDecimal']>;
  amount_not?: InputMaybe<Scalars['BigDecimal']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  emittedBy?: InputMaybe<Scalars['Bytes']>;
  emittedBy_contains?: InputMaybe<Scalars['Bytes']>;
  emittedBy_in?: InputMaybe<Array<Scalars['Bytes']>>;
  emittedBy_not?: InputMaybe<Scalars['Bytes']>;
  emittedBy_not_contains?: InputMaybe<Scalars['Bytes']>;
  emittedBy_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  payer?: InputMaybe<Scalars['Bytes']>;
  payer_contains?: InputMaybe<Scalars['Bytes']>;
  payer_in?: InputMaybe<Array<Scalars['Bytes']>>;
  payer_not?: InputMaybe<Scalars['Bytes']>;
  payer_not_contains?: InputMaybe<Scalars['Bytes']>;
  payer_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  timestamp?: InputMaybe<Scalars['Int']>;
  timestamp_gt?: InputMaybe<Scalars['Int']>;
  timestamp_gte?: InputMaybe<Scalars['Int']>;
  timestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp_lt?: InputMaybe<Scalars['Int']>;
  timestamp_lte?: InputMaybe<Scalars['Int']>;
  timestamp_not?: InputMaybe<Scalars['Int']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
  token?: InputMaybe<Scalars['Bytes']>;
  token_contains?: InputMaybe<Scalars['Bytes']>;
  token_in?: InputMaybe<Array<Scalars['Bytes']>>;
  token_not?: InputMaybe<Scalars['Bytes']>;
  token_not_contains?: InputMaybe<Scalars['Bytes']>;
  token_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transaction?: InputMaybe<Scalars['String']>;
  transaction_?: InputMaybe<Transaction_Filter>;
  transaction_contains?: InputMaybe<Scalars['String']>;
  transaction_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_gt?: InputMaybe<Scalars['String']>;
  transaction_gte?: InputMaybe<Scalars['String']>;
  transaction_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_lt?: InputMaybe<Scalars['String']>;
  transaction_lte?: InputMaybe<Scalars['String']>;
  transaction_not?: InputMaybe<Scalars['String']>;
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_not_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
  transaction_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum PayLendingFee_OrderBy {
  Amount = 'amount',
  EmittedBy = 'emittedBy',
  Id = 'id',
  Payer = 'payer',
  Timestamp = 'timestamp',
  Token = 'token',
  Transaction = 'transaction',
}

/**
 * Granular event data for the Loan entity. Emitted when a user Margin Trades and when a loan is rolled over
 *
 */
export type PayTradingFee = {
  __typename?: 'PayTradingFee';
  amount: Scalars['BigDecimal'];
  emittedBy: Scalars['Bytes'];
  id: Scalars['ID'];
  loanId: Scalars['String'];
  payer: Scalars['Bytes'];
  timestamp: Scalars['Int'];
  token: Scalars['Bytes'];
  transaction: Transaction;
};

export type PayTradingFee_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars['BigDecimal']>;
  amount_gt?: InputMaybe<Scalars['BigDecimal']>;
  amount_gte?: InputMaybe<Scalars['BigDecimal']>;
  amount_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  amount_lt?: InputMaybe<Scalars['BigDecimal']>;
  amount_lte?: InputMaybe<Scalars['BigDecimal']>;
  amount_not?: InputMaybe<Scalars['BigDecimal']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  emittedBy?: InputMaybe<Scalars['Bytes']>;
  emittedBy_contains?: InputMaybe<Scalars['Bytes']>;
  emittedBy_in?: InputMaybe<Array<Scalars['Bytes']>>;
  emittedBy_not?: InputMaybe<Scalars['Bytes']>;
  emittedBy_not_contains?: InputMaybe<Scalars['Bytes']>;
  emittedBy_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  loanId?: InputMaybe<Scalars['String']>;
  loanId_contains?: InputMaybe<Scalars['String']>;
  loanId_contains_nocase?: InputMaybe<Scalars['String']>;
  loanId_ends_with?: InputMaybe<Scalars['String']>;
  loanId_ends_with_nocase?: InputMaybe<Scalars['String']>;
  loanId_gt?: InputMaybe<Scalars['String']>;
  loanId_gte?: InputMaybe<Scalars['String']>;
  loanId_in?: InputMaybe<Array<Scalars['String']>>;
  loanId_lt?: InputMaybe<Scalars['String']>;
  loanId_lte?: InputMaybe<Scalars['String']>;
  loanId_not?: InputMaybe<Scalars['String']>;
  loanId_not_contains?: InputMaybe<Scalars['String']>;
  loanId_not_contains_nocase?: InputMaybe<Scalars['String']>;
  loanId_not_ends_with?: InputMaybe<Scalars['String']>;
  loanId_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  loanId_not_in?: InputMaybe<Array<Scalars['String']>>;
  loanId_not_starts_with?: InputMaybe<Scalars['String']>;
  loanId_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  loanId_starts_with?: InputMaybe<Scalars['String']>;
  loanId_starts_with_nocase?: InputMaybe<Scalars['String']>;
  payer?: InputMaybe<Scalars['Bytes']>;
  payer_contains?: InputMaybe<Scalars['Bytes']>;
  payer_in?: InputMaybe<Array<Scalars['Bytes']>>;
  payer_not?: InputMaybe<Scalars['Bytes']>;
  payer_not_contains?: InputMaybe<Scalars['Bytes']>;
  payer_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  timestamp?: InputMaybe<Scalars['Int']>;
  timestamp_gt?: InputMaybe<Scalars['Int']>;
  timestamp_gte?: InputMaybe<Scalars['Int']>;
  timestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp_lt?: InputMaybe<Scalars['Int']>;
  timestamp_lte?: InputMaybe<Scalars['Int']>;
  timestamp_not?: InputMaybe<Scalars['Int']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
  token?: InputMaybe<Scalars['Bytes']>;
  token_contains?: InputMaybe<Scalars['Bytes']>;
  token_in?: InputMaybe<Array<Scalars['Bytes']>>;
  token_not?: InputMaybe<Scalars['Bytes']>;
  token_not_contains?: InputMaybe<Scalars['Bytes']>;
  token_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transaction?: InputMaybe<Scalars['String']>;
  transaction_?: InputMaybe<Transaction_Filter>;
  transaction_contains?: InputMaybe<Scalars['String']>;
  transaction_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_gt?: InputMaybe<Scalars['String']>;
  transaction_gte?: InputMaybe<Scalars['String']>;
  transaction_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_lt?: InputMaybe<Scalars['String']>;
  transaction_lte?: InputMaybe<Scalars['String']>;
  transaction_not?: InputMaybe<Scalars['String']>;
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_not_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
  transaction_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum PayTradingFee_OrderBy {
  Amount = 'amount',
  EmittedBy = 'emittedBy',
  Id = 'id',
  LoanId = 'loanId',
  Payer = 'payer',
  Timestamp = 'timestamp',
  Token = 'token',
  Transaction = 'transaction',
}

/**
 * For the V1 pools, the pool token and smart token are the same. However, for V2 pools, there is one pool token per asset and only one smart token for the pool.
 *
 */
export type PoolToken = {
  __typename?: 'PoolToken';
  decimals?: Maybe<Scalars['Int']>;
  id: Scalars['ID'];
  liquidityPool: LiquidityPool;
  name?: Maybe<Scalars['String']>;
  symbol?: Maybe<Scalars['String']>;
  /**
   * For V1 pools, there will be 2 underlying assets, however for V2 pools there will be just one
   *
   */
  underlyingAssets: Array<Token>;
};

/**
 * For the V1 pools, the pool token and smart token are the same. However, for V2 pools, there is one pool token per asset and only one smart token for the pool.
 *
 */
export type PoolTokenUnderlyingAssetsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Token_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Token_Filter>;
};

export type PoolToken_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  decimals?: InputMaybe<Scalars['Int']>;
  decimals_gt?: InputMaybe<Scalars['Int']>;
  decimals_gte?: InputMaybe<Scalars['Int']>;
  decimals_in?: InputMaybe<Array<Scalars['Int']>>;
  decimals_lt?: InputMaybe<Scalars['Int']>;
  decimals_lte?: InputMaybe<Scalars['Int']>;
  decimals_not?: InputMaybe<Scalars['Int']>;
  decimals_not_in?: InputMaybe<Array<Scalars['Int']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  liquidityPool?: InputMaybe<Scalars['String']>;
  liquidityPool_?: InputMaybe<LiquidityPool_Filter>;
  liquidityPool_contains?: InputMaybe<Scalars['String']>;
  liquidityPool_contains_nocase?: InputMaybe<Scalars['String']>;
  liquidityPool_ends_with?: InputMaybe<Scalars['String']>;
  liquidityPool_ends_with_nocase?: InputMaybe<Scalars['String']>;
  liquidityPool_gt?: InputMaybe<Scalars['String']>;
  liquidityPool_gte?: InputMaybe<Scalars['String']>;
  liquidityPool_in?: InputMaybe<Array<Scalars['String']>>;
  liquidityPool_lt?: InputMaybe<Scalars['String']>;
  liquidityPool_lte?: InputMaybe<Scalars['String']>;
  liquidityPool_not?: InputMaybe<Scalars['String']>;
  liquidityPool_not_contains?: InputMaybe<Scalars['String']>;
  liquidityPool_not_contains_nocase?: InputMaybe<Scalars['String']>;
  liquidityPool_not_ends_with?: InputMaybe<Scalars['String']>;
  liquidityPool_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  liquidityPool_not_in?: InputMaybe<Array<Scalars['String']>>;
  liquidityPool_not_starts_with?: InputMaybe<Scalars['String']>;
  liquidityPool_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  liquidityPool_starts_with?: InputMaybe<Scalars['String']>;
  liquidityPool_starts_with_nocase?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  name_contains?: InputMaybe<Scalars['String']>;
  name_contains_nocase?: InputMaybe<Scalars['String']>;
  name_ends_with?: InputMaybe<Scalars['String']>;
  name_ends_with_nocase?: InputMaybe<Scalars['String']>;
  name_gt?: InputMaybe<Scalars['String']>;
  name_gte?: InputMaybe<Scalars['String']>;
  name_in?: InputMaybe<Array<Scalars['String']>>;
  name_lt?: InputMaybe<Scalars['String']>;
  name_lte?: InputMaybe<Scalars['String']>;
  name_not?: InputMaybe<Scalars['String']>;
  name_not_contains?: InputMaybe<Scalars['String']>;
  name_not_contains_nocase?: InputMaybe<Scalars['String']>;
  name_not_ends_with?: InputMaybe<Scalars['String']>;
  name_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  name_not_in?: InputMaybe<Array<Scalars['String']>>;
  name_not_starts_with?: InputMaybe<Scalars['String']>;
  name_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  name_starts_with?: InputMaybe<Scalars['String']>;
  name_starts_with_nocase?: InputMaybe<Scalars['String']>;
  symbol?: InputMaybe<Scalars['String']>;
  symbol_contains?: InputMaybe<Scalars['String']>;
  symbol_contains_nocase?: InputMaybe<Scalars['String']>;
  symbol_ends_with?: InputMaybe<Scalars['String']>;
  symbol_ends_with_nocase?: InputMaybe<Scalars['String']>;
  symbol_gt?: InputMaybe<Scalars['String']>;
  symbol_gte?: InputMaybe<Scalars['String']>;
  symbol_in?: InputMaybe<Array<Scalars['String']>>;
  symbol_lt?: InputMaybe<Scalars['String']>;
  symbol_lte?: InputMaybe<Scalars['String']>;
  symbol_not?: InputMaybe<Scalars['String']>;
  symbol_not_contains?: InputMaybe<Scalars['String']>;
  symbol_not_contains_nocase?: InputMaybe<Scalars['String']>;
  symbol_not_ends_with?: InputMaybe<Scalars['String']>;
  symbol_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  symbol_not_in?: InputMaybe<Array<Scalars['String']>>;
  symbol_not_starts_with?: InputMaybe<Scalars['String']>;
  symbol_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  symbol_starts_with?: InputMaybe<Scalars['String']>;
  symbol_starts_with_nocase?: InputMaybe<Scalars['String']>;
  underlyingAssets?: InputMaybe<Array<Scalars['String']>>;
  underlyingAssets_?: InputMaybe<Token_Filter>;
  underlyingAssets_contains?: InputMaybe<Array<Scalars['String']>>;
  underlyingAssets_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  underlyingAssets_not?: InputMaybe<Array<Scalars['String']>>;
  underlyingAssets_not_contains?: InputMaybe<Array<Scalars['String']>>;
  underlyingAssets_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
};

export enum PoolToken_OrderBy {
  Decimals = 'decimals',
  Id = 'id',
  LiquidityPool = 'liquidityPool',
  Name = 'name',
  Symbol = 'symbol',
  UnderlyingAssets = 'underlyingAssets',
}

export type PoolVolumeItem = {
  __typename?: 'PoolVolumeItem';
  btcAmount: Scalars['BigDecimal'];
  conversion: Conversion;
  id: Scalars['ID'];
  pool: LiquidityPool;
  timestamp: Scalars['Int'];
  transaction: Transaction;
};

export type PoolVolumeItem_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  btcAmount?: InputMaybe<Scalars['BigDecimal']>;
  btcAmount_gt?: InputMaybe<Scalars['BigDecimal']>;
  btcAmount_gte?: InputMaybe<Scalars['BigDecimal']>;
  btcAmount_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  btcAmount_lt?: InputMaybe<Scalars['BigDecimal']>;
  btcAmount_lte?: InputMaybe<Scalars['BigDecimal']>;
  btcAmount_not?: InputMaybe<Scalars['BigDecimal']>;
  btcAmount_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  conversion?: InputMaybe<Scalars['String']>;
  conversion_?: InputMaybe<Conversion_Filter>;
  conversion_contains?: InputMaybe<Scalars['String']>;
  conversion_contains_nocase?: InputMaybe<Scalars['String']>;
  conversion_ends_with?: InputMaybe<Scalars['String']>;
  conversion_ends_with_nocase?: InputMaybe<Scalars['String']>;
  conversion_gt?: InputMaybe<Scalars['String']>;
  conversion_gte?: InputMaybe<Scalars['String']>;
  conversion_in?: InputMaybe<Array<Scalars['String']>>;
  conversion_lt?: InputMaybe<Scalars['String']>;
  conversion_lte?: InputMaybe<Scalars['String']>;
  conversion_not?: InputMaybe<Scalars['String']>;
  conversion_not_contains?: InputMaybe<Scalars['String']>;
  conversion_not_contains_nocase?: InputMaybe<Scalars['String']>;
  conversion_not_ends_with?: InputMaybe<Scalars['String']>;
  conversion_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  conversion_not_in?: InputMaybe<Array<Scalars['String']>>;
  conversion_not_starts_with?: InputMaybe<Scalars['String']>;
  conversion_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  conversion_starts_with?: InputMaybe<Scalars['String']>;
  conversion_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  pool?: InputMaybe<Scalars['String']>;
  pool_?: InputMaybe<LiquidityPool_Filter>;
  pool_contains?: InputMaybe<Scalars['String']>;
  pool_contains_nocase?: InputMaybe<Scalars['String']>;
  pool_ends_with?: InputMaybe<Scalars['String']>;
  pool_ends_with_nocase?: InputMaybe<Scalars['String']>;
  pool_gt?: InputMaybe<Scalars['String']>;
  pool_gte?: InputMaybe<Scalars['String']>;
  pool_in?: InputMaybe<Array<Scalars['String']>>;
  pool_lt?: InputMaybe<Scalars['String']>;
  pool_lte?: InputMaybe<Scalars['String']>;
  pool_not?: InputMaybe<Scalars['String']>;
  pool_not_contains?: InputMaybe<Scalars['String']>;
  pool_not_contains_nocase?: InputMaybe<Scalars['String']>;
  pool_not_ends_with?: InputMaybe<Scalars['String']>;
  pool_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  pool_not_in?: InputMaybe<Array<Scalars['String']>>;
  pool_not_starts_with?: InputMaybe<Scalars['String']>;
  pool_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  pool_starts_with?: InputMaybe<Scalars['String']>;
  pool_starts_with_nocase?: InputMaybe<Scalars['String']>;
  timestamp?: InputMaybe<Scalars['Int']>;
  timestamp_gt?: InputMaybe<Scalars['Int']>;
  timestamp_gte?: InputMaybe<Scalars['Int']>;
  timestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp_lt?: InputMaybe<Scalars['Int']>;
  timestamp_lte?: InputMaybe<Scalars['Int']>;
  timestamp_not?: InputMaybe<Scalars['Int']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
  transaction?: InputMaybe<Scalars['String']>;
  transaction_?: InputMaybe<Transaction_Filter>;
  transaction_contains?: InputMaybe<Scalars['String']>;
  transaction_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_gt?: InputMaybe<Scalars['String']>;
  transaction_gte?: InputMaybe<Scalars['String']>;
  transaction_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_lt?: InputMaybe<Scalars['String']>;
  transaction_lte?: InputMaybe<Scalars['String']>;
  transaction_not?: InputMaybe<Scalars['String']>;
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_not_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
  transaction_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum PoolVolumeItem_OrderBy {
  BtcAmount = 'btcAmount',
  Conversion = 'conversion',
  Id = 'id',
  Pool = 'pool',
  Timestamp = 'timestamp',
  Transaction = 'transaction',
}

/**
 * A Proposal is created each time a SIP (Sovryn Improvement Proposal) is proposed
 * The Proposal is created, voted on, and then executed if it passes
 * To see if a Proposal has been executed, see if the executed property is null or if it has a transaction
 *
 */
export type Proposal = {
  __typename?: 'Proposal';
  calldatas: Array<Scalars['String']>;
  /**
   * If the proposal was canceled, the transaction that canceled it (otherwise null)
   *
   */
  canceled?: Maybe<Transaction>;
  /**
   * Number of unique wallets that voted against this proposal
   *
   */
  countVotersAgainst: Scalars['Int'];
  /**
   * Number of unique wallets that voted for this proposal
   *
   */
  countVotersFor: Scalars['Int'];
  /**
   * Transaction that created the proposal
   *
   */
  created: Transaction;
  /**
   * Brief description of what this SIP is for, sometimes with a link to the github repo and README for this proposal
   *
   */
  description: Scalars['String'];
  /**
   * The contract that emitted this event
   *
   */
  emittedBy: GovernorContract;
  /**
   * Block when voting ends
   *
   */
  endBlock: Scalars['Int'];
  /**
   * The timestamp that the proposal will be available for execution, set once the vote succeeds.
   *
   */
  eta?: Maybe<Scalars['Int']>;
  /**
   * If the proposal was executed, the transaction that executed it (otherwise null)
   *
   */
  executed?: Maybe<Transaction>;
  /**
   * ID is the address of the governor contract that was used to create the proposal, + the id of the proposal
   *
   */
  id: Scalars['ID'];
  /**
   * The majority percentage required for this proposal.
   *
   */
  majorityPercentage: Scalars['BigInt'];
  proposalId: Scalars['Int'];
  /**
   * Address of the user who created this proposal
   *
   */
  proposer: Scalars['Bytes'];
  /**
   * If the proposal was queued, the transaction that queued it (otherwise null)
   *
   */
  queued?: Maybe<Transaction>;
  /**
   * The quorum required for this proposal.
   *
   */
  quorum: Scalars['BigInt'];
  /**
   * Function signatures in the targeted contract that would be affected by this proposal passing
   *
   */
  signatures: Array<Scalars['String']>;
  /**
   * Block when voting starts
   *
   */
  startBlock: Scalars['Int'];
  stateChanges: Array<ProposalStateChange>;
  /**
   * Contract or contracts that this proposal targets
   *
   */
  targets: Array<Scalars['String']>;
  /**
   * Timestamp when this proposal was created. This is also available in the created transaction, but is included here so it is possible to order by timestamp
   *
   */
  timestamp: Scalars['Int'];
  values: Array<Scalars['BigInt']>;
  /**
   * Individual vote transactions
   *
   */
  votes?: Maybe<Array<VoteCast>>;
  /**
   * Number of votes against the proposal (weighted vote, not number of voters)
   *
   */
  votesAgainst: Scalars['BigInt'];
  /**
   * Number of votes for the proposal (weighted vote, not number of voters)
   *
   */
  votesFor: Scalars['BigInt'];
};

/**
 * A Proposal is created each time a SIP (Sovryn Improvement Proposal) is proposed
 * The Proposal is created, voted on, and then executed if it passes
 * To see if a Proposal has been executed, see if the executed property is null or if it has a transaction
 *
 */
export type ProposalStateChangesArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ProposalStateChange_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<ProposalStateChange_Filter>;
};

/**
 * A Proposal is created each time a SIP (Sovryn Improvement Proposal) is proposed
 * The Proposal is created, voted on, and then executed if it passes
 * To see if a Proposal has been executed, see if the executed property is null or if it has a transaction
 *
 */
export type ProposalVotesArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<VoteCast_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<VoteCast_Filter>;
};

export enum ProposalState {
  Canceled = 'Canceled',
  Created = 'Created',
  Executed = 'Executed',
  Queued = 'Queued',
}

export type ProposalStateChange = {
  __typename?: 'ProposalStateChange';
  emittedBy: Scalars['Bytes'];
  id: Scalars['ID'];
  proposal: Proposal;
  state: ProposalState;
  timestamp: Scalars['Int'];
  transaction: Transaction;
};

export type ProposalStateChange_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  emittedBy?: InputMaybe<Scalars['Bytes']>;
  emittedBy_contains?: InputMaybe<Scalars['Bytes']>;
  emittedBy_in?: InputMaybe<Array<Scalars['Bytes']>>;
  emittedBy_not?: InputMaybe<Scalars['Bytes']>;
  emittedBy_not_contains?: InputMaybe<Scalars['Bytes']>;
  emittedBy_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  proposal?: InputMaybe<Scalars['String']>;
  proposal_?: InputMaybe<Proposal_Filter>;
  proposal_contains?: InputMaybe<Scalars['String']>;
  proposal_contains_nocase?: InputMaybe<Scalars['String']>;
  proposal_ends_with?: InputMaybe<Scalars['String']>;
  proposal_ends_with_nocase?: InputMaybe<Scalars['String']>;
  proposal_gt?: InputMaybe<Scalars['String']>;
  proposal_gte?: InputMaybe<Scalars['String']>;
  proposal_in?: InputMaybe<Array<Scalars['String']>>;
  proposal_lt?: InputMaybe<Scalars['String']>;
  proposal_lte?: InputMaybe<Scalars['String']>;
  proposal_not?: InputMaybe<Scalars['String']>;
  proposal_not_contains?: InputMaybe<Scalars['String']>;
  proposal_not_contains_nocase?: InputMaybe<Scalars['String']>;
  proposal_not_ends_with?: InputMaybe<Scalars['String']>;
  proposal_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  proposal_not_in?: InputMaybe<Array<Scalars['String']>>;
  proposal_not_starts_with?: InputMaybe<Scalars['String']>;
  proposal_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  proposal_starts_with?: InputMaybe<Scalars['String']>;
  proposal_starts_with_nocase?: InputMaybe<Scalars['String']>;
  state?: InputMaybe<ProposalState>;
  state_in?: InputMaybe<Array<ProposalState>>;
  state_not?: InputMaybe<ProposalState>;
  state_not_in?: InputMaybe<Array<ProposalState>>;
  timestamp?: InputMaybe<Scalars['Int']>;
  timestamp_gt?: InputMaybe<Scalars['Int']>;
  timestamp_gte?: InputMaybe<Scalars['Int']>;
  timestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp_lt?: InputMaybe<Scalars['Int']>;
  timestamp_lte?: InputMaybe<Scalars['Int']>;
  timestamp_not?: InputMaybe<Scalars['Int']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
  transaction?: InputMaybe<Scalars['String']>;
  transaction_?: InputMaybe<Transaction_Filter>;
  transaction_contains?: InputMaybe<Scalars['String']>;
  transaction_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_gt?: InputMaybe<Scalars['String']>;
  transaction_gte?: InputMaybe<Scalars['String']>;
  transaction_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_lt?: InputMaybe<Scalars['String']>;
  transaction_lte?: InputMaybe<Scalars['String']>;
  transaction_not?: InputMaybe<Scalars['String']>;
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_not_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
  transaction_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum ProposalStateChange_OrderBy {
  EmittedBy = 'emittedBy',
  Id = 'id',
  Proposal = 'proposal',
  State = 'state',
  Timestamp = 'timestamp',
  Transaction = 'transaction',
}

export type Proposal_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  calldatas?: InputMaybe<Array<Scalars['String']>>;
  calldatas_contains?: InputMaybe<Array<Scalars['String']>>;
  calldatas_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  calldatas_not?: InputMaybe<Array<Scalars['String']>>;
  calldatas_not_contains?: InputMaybe<Array<Scalars['String']>>;
  calldatas_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  canceled?: InputMaybe<Scalars['String']>;
  canceled_?: InputMaybe<Transaction_Filter>;
  canceled_contains?: InputMaybe<Scalars['String']>;
  canceled_contains_nocase?: InputMaybe<Scalars['String']>;
  canceled_ends_with?: InputMaybe<Scalars['String']>;
  canceled_ends_with_nocase?: InputMaybe<Scalars['String']>;
  canceled_gt?: InputMaybe<Scalars['String']>;
  canceled_gte?: InputMaybe<Scalars['String']>;
  canceled_in?: InputMaybe<Array<Scalars['String']>>;
  canceled_lt?: InputMaybe<Scalars['String']>;
  canceled_lte?: InputMaybe<Scalars['String']>;
  canceled_not?: InputMaybe<Scalars['String']>;
  canceled_not_contains?: InputMaybe<Scalars['String']>;
  canceled_not_contains_nocase?: InputMaybe<Scalars['String']>;
  canceled_not_ends_with?: InputMaybe<Scalars['String']>;
  canceled_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  canceled_not_in?: InputMaybe<Array<Scalars['String']>>;
  canceled_not_starts_with?: InputMaybe<Scalars['String']>;
  canceled_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  canceled_starts_with?: InputMaybe<Scalars['String']>;
  canceled_starts_with_nocase?: InputMaybe<Scalars['String']>;
  countVotersAgainst?: InputMaybe<Scalars['Int']>;
  countVotersAgainst_gt?: InputMaybe<Scalars['Int']>;
  countVotersAgainst_gte?: InputMaybe<Scalars['Int']>;
  countVotersAgainst_in?: InputMaybe<Array<Scalars['Int']>>;
  countVotersAgainst_lt?: InputMaybe<Scalars['Int']>;
  countVotersAgainst_lte?: InputMaybe<Scalars['Int']>;
  countVotersAgainst_not?: InputMaybe<Scalars['Int']>;
  countVotersAgainst_not_in?: InputMaybe<Array<Scalars['Int']>>;
  countVotersFor?: InputMaybe<Scalars['Int']>;
  countVotersFor_gt?: InputMaybe<Scalars['Int']>;
  countVotersFor_gte?: InputMaybe<Scalars['Int']>;
  countVotersFor_in?: InputMaybe<Array<Scalars['Int']>>;
  countVotersFor_lt?: InputMaybe<Scalars['Int']>;
  countVotersFor_lte?: InputMaybe<Scalars['Int']>;
  countVotersFor_not?: InputMaybe<Scalars['Int']>;
  countVotersFor_not_in?: InputMaybe<Array<Scalars['Int']>>;
  created?: InputMaybe<Scalars['String']>;
  created_?: InputMaybe<Transaction_Filter>;
  created_contains?: InputMaybe<Scalars['String']>;
  created_contains_nocase?: InputMaybe<Scalars['String']>;
  created_ends_with?: InputMaybe<Scalars['String']>;
  created_ends_with_nocase?: InputMaybe<Scalars['String']>;
  created_gt?: InputMaybe<Scalars['String']>;
  created_gte?: InputMaybe<Scalars['String']>;
  created_in?: InputMaybe<Array<Scalars['String']>>;
  created_lt?: InputMaybe<Scalars['String']>;
  created_lte?: InputMaybe<Scalars['String']>;
  created_not?: InputMaybe<Scalars['String']>;
  created_not_contains?: InputMaybe<Scalars['String']>;
  created_not_contains_nocase?: InputMaybe<Scalars['String']>;
  created_not_ends_with?: InputMaybe<Scalars['String']>;
  created_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  created_not_in?: InputMaybe<Array<Scalars['String']>>;
  created_not_starts_with?: InputMaybe<Scalars['String']>;
  created_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  created_starts_with?: InputMaybe<Scalars['String']>;
  created_starts_with_nocase?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  description_contains?: InputMaybe<Scalars['String']>;
  description_contains_nocase?: InputMaybe<Scalars['String']>;
  description_ends_with?: InputMaybe<Scalars['String']>;
  description_ends_with_nocase?: InputMaybe<Scalars['String']>;
  description_gt?: InputMaybe<Scalars['String']>;
  description_gte?: InputMaybe<Scalars['String']>;
  description_in?: InputMaybe<Array<Scalars['String']>>;
  description_lt?: InputMaybe<Scalars['String']>;
  description_lte?: InputMaybe<Scalars['String']>;
  description_not?: InputMaybe<Scalars['String']>;
  description_not_contains?: InputMaybe<Scalars['String']>;
  description_not_contains_nocase?: InputMaybe<Scalars['String']>;
  description_not_ends_with?: InputMaybe<Scalars['String']>;
  description_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  description_not_in?: InputMaybe<Array<Scalars['String']>>;
  description_not_starts_with?: InputMaybe<Scalars['String']>;
  description_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  description_starts_with?: InputMaybe<Scalars['String']>;
  description_starts_with_nocase?: InputMaybe<Scalars['String']>;
  emittedBy?: InputMaybe<Scalars['String']>;
  emittedBy_?: InputMaybe<GovernorContract_Filter>;
  emittedBy_contains?: InputMaybe<Scalars['String']>;
  emittedBy_contains_nocase?: InputMaybe<Scalars['String']>;
  emittedBy_ends_with?: InputMaybe<Scalars['String']>;
  emittedBy_ends_with_nocase?: InputMaybe<Scalars['String']>;
  emittedBy_gt?: InputMaybe<Scalars['String']>;
  emittedBy_gte?: InputMaybe<Scalars['String']>;
  emittedBy_in?: InputMaybe<Array<Scalars['String']>>;
  emittedBy_lt?: InputMaybe<Scalars['String']>;
  emittedBy_lte?: InputMaybe<Scalars['String']>;
  emittedBy_not?: InputMaybe<Scalars['String']>;
  emittedBy_not_contains?: InputMaybe<Scalars['String']>;
  emittedBy_not_contains_nocase?: InputMaybe<Scalars['String']>;
  emittedBy_not_ends_with?: InputMaybe<Scalars['String']>;
  emittedBy_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  emittedBy_not_in?: InputMaybe<Array<Scalars['String']>>;
  emittedBy_not_starts_with?: InputMaybe<Scalars['String']>;
  emittedBy_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  emittedBy_starts_with?: InputMaybe<Scalars['String']>;
  emittedBy_starts_with_nocase?: InputMaybe<Scalars['String']>;
  endBlock?: InputMaybe<Scalars['Int']>;
  endBlock_gt?: InputMaybe<Scalars['Int']>;
  endBlock_gte?: InputMaybe<Scalars['Int']>;
  endBlock_in?: InputMaybe<Array<Scalars['Int']>>;
  endBlock_lt?: InputMaybe<Scalars['Int']>;
  endBlock_lte?: InputMaybe<Scalars['Int']>;
  endBlock_not?: InputMaybe<Scalars['Int']>;
  endBlock_not_in?: InputMaybe<Array<Scalars['Int']>>;
  eta?: InputMaybe<Scalars['Int']>;
  eta_gt?: InputMaybe<Scalars['Int']>;
  eta_gte?: InputMaybe<Scalars['Int']>;
  eta_in?: InputMaybe<Array<Scalars['Int']>>;
  eta_lt?: InputMaybe<Scalars['Int']>;
  eta_lte?: InputMaybe<Scalars['Int']>;
  eta_not?: InputMaybe<Scalars['Int']>;
  eta_not_in?: InputMaybe<Array<Scalars['Int']>>;
  executed?: InputMaybe<Scalars['String']>;
  executed_?: InputMaybe<Transaction_Filter>;
  executed_contains?: InputMaybe<Scalars['String']>;
  executed_contains_nocase?: InputMaybe<Scalars['String']>;
  executed_ends_with?: InputMaybe<Scalars['String']>;
  executed_ends_with_nocase?: InputMaybe<Scalars['String']>;
  executed_gt?: InputMaybe<Scalars['String']>;
  executed_gte?: InputMaybe<Scalars['String']>;
  executed_in?: InputMaybe<Array<Scalars['String']>>;
  executed_lt?: InputMaybe<Scalars['String']>;
  executed_lte?: InputMaybe<Scalars['String']>;
  executed_not?: InputMaybe<Scalars['String']>;
  executed_not_contains?: InputMaybe<Scalars['String']>;
  executed_not_contains_nocase?: InputMaybe<Scalars['String']>;
  executed_not_ends_with?: InputMaybe<Scalars['String']>;
  executed_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  executed_not_in?: InputMaybe<Array<Scalars['String']>>;
  executed_not_starts_with?: InputMaybe<Scalars['String']>;
  executed_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  executed_starts_with?: InputMaybe<Scalars['String']>;
  executed_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  majorityPercentage?: InputMaybe<Scalars['BigInt']>;
  majorityPercentage_gt?: InputMaybe<Scalars['BigInt']>;
  majorityPercentage_gte?: InputMaybe<Scalars['BigInt']>;
  majorityPercentage_in?: InputMaybe<Array<Scalars['BigInt']>>;
  majorityPercentage_lt?: InputMaybe<Scalars['BigInt']>;
  majorityPercentage_lte?: InputMaybe<Scalars['BigInt']>;
  majorityPercentage_not?: InputMaybe<Scalars['BigInt']>;
  majorityPercentage_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  proposalId?: InputMaybe<Scalars['Int']>;
  proposalId_gt?: InputMaybe<Scalars['Int']>;
  proposalId_gte?: InputMaybe<Scalars['Int']>;
  proposalId_in?: InputMaybe<Array<Scalars['Int']>>;
  proposalId_lt?: InputMaybe<Scalars['Int']>;
  proposalId_lte?: InputMaybe<Scalars['Int']>;
  proposalId_not?: InputMaybe<Scalars['Int']>;
  proposalId_not_in?: InputMaybe<Array<Scalars['Int']>>;
  proposer?: InputMaybe<Scalars['Bytes']>;
  proposer_contains?: InputMaybe<Scalars['Bytes']>;
  proposer_in?: InputMaybe<Array<Scalars['Bytes']>>;
  proposer_not?: InputMaybe<Scalars['Bytes']>;
  proposer_not_contains?: InputMaybe<Scalars['Bytes']>;
  proposer_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  queued?: InputMaybe<Scalars['String']>;
  queued_?: InputMaybe<Transaction_Filter>;
  queued_contains?: InputMaybe<Scalars['String']>;
  queued_contains_nocase?: InputMaybe<Scalars['String']>;
  queued_ends_with?: InputMaybe<Scalars['String']>;
  queued_ends_with_nocase?: InputMaybe<Scalars['String']>;
  queued_gt?: InputMaybe<Scalars['String']>;
  queued_gte?: InputMaybe<Scalars['String']>;
  queued_in?: InputMaybe<Array<Scalars['String']>>;
  queued_lt?: InputMaybe<Scalars['String']>;
  queued_lte?: InputMaybe<Scalars['String']>;
  queued_not?: InputMaybe<Scalars['String']>;
  queued_not_contains?: InputMaybe<Scalars['String']>;
  queued_not_contains_nocase?: InputMaybe<Scalars['String']>;
  queued_not_ends_with?: InputMaybe<Scalars['String']>;
  queued_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  queued_not_in?: InputMaybe<Array<Scalars['String']>>;
  queued_not_starts_with?: InputMaybe<Scalars['String']>;
  queued_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  queued_starts_with?: InputMaybe<Scalars['String']>;
  queued_starts_with_nocase?: InputMaybe<Scalars['String']>;
  quorum?: InputMaybe<Scalars['BigInt']>;
  quorum_gt?: InputMaybe<Scalars['BigInt']>;
  quorum_gte?: InputMaybe<Scalars['BigInt']>;
  quorum_in?: InputMaybe<Array<Scalars['BigInt']>>;
  quorum_lt?: InputMaybe<Scalars['BigInt']>;
  quorum_lte?: InputMaybe<Scalars['BigInt']>;
  quorum_not?: InputMaybe<Scalars['BigInt']>;
  quorum_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  signatures?: InputMaybe<Array<Scalars['String']>>;
  signatures_contains?: InputMaybe<Array<Scalars['String']>>;
  signatures_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  signatures_not?: InputMaybe<Array<Scalars['String']>>;
  signatures_not_contains?: InputMaybe<Array<Scalars['String']>>;
  signatures_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  startBlock?: InputMaybe<Scalars['Int']>;
  startBlock_gt?: InputMaybe<Scalars['Int']>;
  startBlock_gte?: InputMaybe<Scalars['Int']>;
  startBlock_in?: InputMaybe<Array<Scalars['Int']>>;
  startBlock_lt?: InputMaybe<Scalars['Int']>;
  startBlock_lte?: InputMaybe<Scalars['Int']>;
  startBlock_not?: InputMaybe<Scalars['Int']>;
  startBlock_not_in?: InputMaybe<Array<Scalars['Int']>>;
  stateChanges_?: InputMaybe<ProposalStateChange_Filter>;
  targets?: InputMaybe<Array<Scalars['String']>>;
  targets_contains?: InputMaybe<Array<Scalars['String']>>;
  targets_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  targets_not?: InputMaybe<Array<Scalars['String']>>;
  targets_not_contains?: InputMaybe<Array<Scalars['String']>>;
  targets_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  timestamp?: InputMaybe<Scalars['Int']>;
  timestamp_gt?: InputMaybe<Scalars['Int']>;
  timestamp_gte?: InputMaybe<Scalars['Int']>;
  timestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp_lt?: InputMaybe<Scalars['Int']>;
  timestamp_lte?: InputMaybe<Scalars['Int']>;
  timestamp_not?: InputMaybe<Scalars['Int']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
  values?: InputMaybe<Array<Scalars['BigInt']>>;
  values_contains?: InputMaybe<Array<Scalars['BigInt']>>;
  values_contains_nocase?: InputMaybe<Array<Scalars['BigInt']>>;
  values_not?: InputMaybe<Array<Scalars['BigInt']>>;
  values_not_contains?: InputMaybe<Array<Scalars['BigInt']>>;
  values_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']>>;
  votesAgainst?: InputMaybe<Scalars['BigInt']>;
  votesAgainst_gt?: InputMaybe<Scalars['BigInt']>;
  votesAgainst_gte?: InputMaybe<Scalars['BigInt']>;
  votesAgainst_in?: InputMaybe<Array<Scalars['BigInt']>>;
  votesAgainst_lt?: InputMaybe<Scalars['BigInt']>;
  votesAgainst_lte?: InputMaybe<Scalars['BigInt']>;
  votesAgainst_not?: InputMaybe<Scalars['BigInt']>;
  votesAgainst_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  votesFor?: InputMaybe<Scalars['BigInt']>;
  votesFor_gt?: InputMaybe<Scalars['BigInt']>;
  votesFor_gte?: InputMaybe<Scalars['BigInt']>;
  votesFor_in?: InputMaybe<Array<Scalars['BigInt']>>;
  votesFor_lt?: InputMaybe<Scalars['BigInt']>;
  votesFor_lte?: InputMaybe<Scalars['BigInt']>;
  votesFor_not?: InputMaybe<Scalars['BigInt']>;
  votesFor_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  votes_?: InputMaybe<VoteCast_Filter>;
};

export enum Proposal_OrderBy {
  Calldatas = 'calldatas',
  Canceled = 'canceled',
  CountVotersAgainst = 'countVotersAgainst',
  CountVotersFor = 'countVotersFor',
  Created = 'created',
  Description = 'description',
  EmittedBy = 'emittedBy',
  EndBlock = 'endBlock',
  Eta = 'eta',
  Executed = 'executed',
  Id = 'id',
  MajorityPercentage = 'majorityPercentage',
  ProposalId = 'proposalId',
  Proposer = 'proposer',
  Queued = 'queued',
  Quorum = 'quorum',
  Signatures = 'signatures',
  StartBlock = 'startBlock',
  StateChanges = 'stateChanges',
  Targets = 'targets',
  Timestamp = 'timestamp',
  Values = 'values',
  Votes = 'votes',
  VotesAgainst = 'votesAgainst',
  VotesFor = 'votesFor',
}

/**
 * This entity will have only one instance and will be used to store protocol-wide data like list of tokens and number or users.
 * The ID of this one entity is "0"
 *
 */
export type ProtocolStats = {
  __typename?: 'ProtocolStats';
  /**
   * Current price of BTC in usdStablecoin
   *
   */
  btcUsdPrice: Scalars['BigDecimal'];
  /**
   * This is SOV staked by vesting contracts. It in incremented when the contracts stake the tokens, and decremented when users claim their unlocked tokens
   *
   */
  currentStakedByVestingSov: Scalars['BigDecimal'];
  /**
   * This is SOV staked by users (not vesting contracts). It is incremented when users stake tokens, and decremented when users withdraw tokens from the staking contract
   *
   */
  currentVoluntarilyStakedSov: Scalars['BigDecimal'];
  /**
   * Only one entity should be created, with ID "0"
   *
   */
  id: Scalars['ID'];
  /**
   * An array of all tokens in the protocol
   *
   */
  tokens: Array<Token>;
  /**
   * Total volume of fees earned by liquidity providers to AMM pools (in usd)
   *
   */
  totalAmmLpFeesUsd: Scalars['BigDecimal'];
  /**
   * Total volume of fees earned by SOV stakers from AMM conversion events (in usd). These fees began after the fee-sharing SIP was executed.
   *
   */
  totalAmmStakerFeesUsd: Scalars['BigDecimal'];
  /**
   * Total volume that has passed through every AMM pool of the Sovryn protocol (in usd)
   *
   */
  totalAmmVolumeUsd: Scalars['BigDecimal'];
  /**
   * Total of collateral property in Trade event (in usd). This may be changed to borrowed amount volume, but collateral keeps it consistent with margin trading
   *
   */
  totalBorrowVolumeUsd: Scalars['BigDecimal'];
  /**
   * Total fees from Borrowing earned by SOV stakers (in usd)
   *
   */
  totalBorrowingFeesUsd: Scalars['BigDecimal'];
  /**
   * Total volume of Borrows closed (in usd)
   *
   */
  totalCloseWithDepositVolumeUsd: Scalars['BigDecimal'];
  /**
   * Total position volume closed for Margin Trades (in usd)
   *
   */
  totalCloseWithSwapVolumeUsd: Scalars['BigDecimal'];
  /**
   * Total additional collateral deposited for Margin Trades and Borrows (in usd)
   *
   */
  totalDepositCollateralVolumeUsd: Scalars['BigDecimal'];
  /**
   * Total volume supplied to Lending Pools over all time (in usd)
   *
   */
  totalLendVolumeUsd: Scalars['BigDecimal'];
  /**
   * Total fees from Lending and Unlending earned by SOV stakers (in usd)
   *
   */
  totalLendingFeesUsd: Scalars['BigDecimal'];
  /**
   * Total Margin Trade and Borrow position size that has been liquidated (in usd)
   *
   */
  totalLiquidateVolumeUsd: Scalars['BigDecimal'];
  /**
   * Total of positionSize property in Trade event (in usd). This includes user collateral and borrowed amount
   *
   */
  totalMarginTradeVolumeUsd: Scalars['BigDecimal'];
  /**
   * Total fees from Margin Trading earned by SOV stakers (in usd)
   *
   */
  totalTradingFeesUsd: Scalars['BigDecimal'];
  /**
   * Total volume withdrawn from Lending Pool over all time (in usd)
   *
   */
  totalUnlendVolumeUsd: Scalars['BigDecimal'];
  /**
   * Total number of users of the protocol. This number is incremented each time a user initiates a transaction with the Protocol.
   * Incremented when a user interacts with any contracts tracked by this subgraph.
   * Does not include the Zero, Mynt and Perperpetual Swaps users (unless they have also used the core protocol)
   *
   */
  totalUsers: Scalars['Int'];
  /**
   * The token currently used as a proxy for USD/BTC prices
   *
   */
  usdStablecoin: Token;
};

/**
 * This entity will have only one instance and will be used to store protocol-wide data like list of tokens and number or users.
 * The ID of this one entity is "0"
 *
 */
export type ProtocolStatsTokensArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Token_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Token_Filter>;
};

export type ProtocolStats_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  btcUsdPrice?: InputMaybe<Scalars['BigDecimal']>;
  btcUsdPrice_gt?: InputMaybe<Scalars['BigDecimal']>;
  btcUsdPrice_gte?: InputMaybe<Scalars['BigDecimal']>;
  btcUsdPrice_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  btcUsdPrice_lt?: InputMaybe<Scalars['BigDecimal']>;
  btcUsdPrice_lte?: InputMaybe<Scalars['BigDecimal']>;
  btcUsdPrice_not?: InputMaybe<Scalars['BigDecimal']>;
  btcUsdPrice_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  currentStakedByVestingSov?: InputMaybe<Scalars['BigDecimal']>;
  currentStakedByVestingSov_gt?: InputMaybe<Scalars['BigDecimal']>;
  currentStakedByVestingSov_gte?: InputMaybe<Scalars['BigDecimal']>;
  currentStakedByVestingSov_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  currentStakedByVestingSov_lt?: InputMaybe<Scalars['BigDecimal']>;
  currentStakedByVestingSov_lte?: InputMaybe<Scalars['BigDecimal']>;
  currentStakedByVestingSov_not?: InputMaybe<Scalars['BigDecimal']>;
  currentStakedByVestingSov_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  currentVoluntarilyStakedSov?: InputMaybe<Scalars['BigDecimal']>;
  currentVoluntarilyStakedSov_gt?: InputMaybe<Scalars['BigDecimal']>;
  currentVoluntarilyStakedSov_gte?: InputMaybe<Scalars['BigDecimal']>;
  currentVoluntarilyStakedSov_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  currentVoluntarilyStakedSov_lt?: InputMaybe<Scalars['BigDecimal']>;
  currentVoluntarilyStakedSov_lte?: InputMaybe<Scalars['BigDecimal']>;
  currentVoluntarilyStakedSov_not?: InputMaybe<Scalars['BigDecimal']>;
  currentVoluntarilyStakedSov_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  tokens?: InputMaybe<Array<Scalars['String']>>;
  tokens_?: InputMaybe<Token_Filter>;
  tokens_contains?: InputMaybe<Array<Scalars['String']>>;
  tokens_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  tokens_not?: InputMaybe<Array<Scalars['String']>>;
  tokens_not_contains?: InputMaybe<Array<Scalars['String']>>;
  tokens_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  totalAmmLpFeesUsd?: InputMaybe<Scalars['BigDecimal']>;
  totalAmmLpFeesUsd_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalAmmLpFeesUsd_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalAmmLpFeesUsd_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalAmmLpFeesUsd_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalAmmLpFeesUsd_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalAmmLpFeesUsd_not?: InputMaybe<Scalars['BigDecimal']>;
  totalAmmLpFeesUsd_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalAmmStakerFeesUsd?: InputMaybe<Scalars['BigDecimal']>;
  totalAmmStakerFeesUsd_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalAmmStakerFeesUsd_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalAmmStakerFeesUsd_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalAmmStakerFeesUsd_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalAmmStakerFeesUsd_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalAmmStakerFeesUsd_not?: InputMaybe<Scalars['BigDecimal']>;
  totalAmmStakerFeesUsd_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalAmmVolumeUsd?: InputMaybe<Scalars['BigDecimal']>;
  totalAmmVolumeUsd_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalAmmVolumeUsd_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalAmmVolumeUsd_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalAmmVolumeUsd_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalAmmVolumeUsd_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalAmmVolumeUsd_not?: InputMaybe<Scalars['BigDecimal']>;
  totalAmmVolumeUsd_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalBorrowVolumeUsd?: InputMaybe<Scalars['BigDecimal']>;
  totalBorrowVolumeUsd_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalBorrowVolumeUsd_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalBorrowVolumeUsd_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalBorrowVolumeUsd_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalBorrowVolumeUsd_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalBorrowVolumeUsd_not?: InputMaybe<Scalars['BigDecimal']>;
  totalBorrowVolumeUsd_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalBorrowingFeesUsd?: InputMaybe<Scalars['BigDecimal']>;
  totalBorrowingFeesUsd_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalBorrowingFeesUsd_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalBorrowingFeesUsd_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalBorrowingFeesUsd_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalBorrowingFeesUsd_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalBorrowingFeesUsd_not?: InputMaybe<Scalars['BigDecimal']>;
  totalBorrowingFeesUsd_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalCloseWithDepositVolumeUsd?: InputMaybe<Scalars['BigDecimal']>;
  totalCloseWithDepositVolumeUsd_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalCloseWithDepositVolumeUsd_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalCloseWithDepositVolumeUsd_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalCloseWithDepositVolumeUsd_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalCloseWithDepositVolumeUsd_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalCloseWithDepositVolumeUsd_not?: InputMaybe<Scalars['BigDecimal']>;
  totalCloseWithDepositVolumeUsd_not_in?: InputMaybe<
    Array<Scalars['BigDecimal']>
  >;
  totalCloseWithSwapVolumeUsd?: InputMaybe<Scalars['BigDecimal']>;
  totalCloseWithSwapVolumeUsd_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalCloseWithSwapVolumeUsd_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalCloseWithSwapVolumeUsd_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalCloseWithSwapVolumeUsd_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalCloseWithSwapVolumeUsd_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalCloseWithSwapVolumeUsd_not?: InputMaybe<Scalars['BigDecimal']>;
  totalCloseWithSwapVolumeUsd_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalDepositCollateralVolumeUsd?: InputMaybe<Scalars['BigDecimal']>;
  totalDepositCollateralVolumeUsd_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalDepositCollateralVolumeUsd_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalDepositCollateralVolumeUsd_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalDepositCollateralVolumeUsd_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalDepositCollateralVolumeUsd_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalDepositCollateralVolumeUsd_not?: InputMaybe<Scalars['BigDecimal']>;
  totalDepositCollateralVolumeUsd_not_in?: InputMaybe<
    Array<Scalars['BigDecimal']>
  >;
  totalLendVolumeUsd?: InputMaybe<Scalars['BigDecimal']>;
  totalLendVolumeUsd_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalLendVolumeUsd_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalLendVolumeUsd_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalLendVolumeUsd_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalLendVolumeUsd_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalLendVolumeUsd_not?: InputMaybe<Scalars['BigDecimal']>;
  totalLendVolumeUsd_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalLendingFeesUsd?: InputMaybe<Scalars['BigDecimal']>;
  totalLendingFeesUsd_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalLendingFeesUsd_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalLendingFeesUsd_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalLendingFeesUsd_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalLendingFeesUsd_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalLendingFeesUsd_not?: InputMaybe<Scalars['BigDecimal']>;
  totalLendingFeesUsd_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalLiquidateVolumeUsd?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidateVolumeUsd_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidateVolumeUsd_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidateVolumeUsd_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalLiquidateVolumeUsd_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidateVolumeUsd_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidateVolumeUsd_not?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidateVolumeUsd_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalMarginTradeVolumeUsd?: InputMaybe<Scalars['BigDecimal']>;
  totalMarginTradeVolumeUsd_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalMarginTradeVolumeUsd_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalMarginTradeVolumeUsd_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalMarginTradeVolumeUsd_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalMarginTradeVolumeUsd_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalMarginTradeVolumeUsd_not?: InputMaybe<Scalars['BigDecimal']>;
  totalMarginTradeVolumeUsd_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalTradingFeesUsd?: InputMaybe<Scalars['BigDecimal']>;
  totalTradingFeesUsd_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalTradingFeesUsd_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalTradingFeesUsd_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalTradingFeesUsd_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalTradingFeesUsd_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalTradingFeesUsd_not?: InputMaybe<Scalars['BigDecimal']>;
  totalTradingFeesUsd_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalUnlendVolumeUsd?: InputMaybe<Scalars['BigDecimal']>;
  totalUnlendVolumeUsd_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalUnlendVolumeUsd_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalUnlendVolumeUsd_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalUnlendVolumeUsd_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalUnlendVolumeUsd_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalUnlendVolumeUsd_not?: InputMaybe<Scalars['BigDecimal']>;
  totalUnlendVolumeUsd_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalUsers?: InputMaybe<Scalars['Int']>;
  totalUsers_gt?: InputMaybe<Scalars['Int']>;
  totalUsers_gte?: InputMaybe<Scalars['Int']>;
  totalUsers_in?: InputMaybe<Array<Scalars['Int']>>;
  totalUsers_lt?: InputMaybe<Scalars['Int']>;
  totalUsers_lte?: InputMaybe<Scalars['Int']>;
  totalUsers_not?: InputMaybe<Scalars['Int']>;
  totalUsers_not_in?: InputMaybe<Array<Scalars['Int']>>;
  usdStablecoin?: InputMaybe<Scalars['String']>;
  usdStablecoin_?: InputMaybe<Token_Filter>;
  usdStablecoin_contains?: InputMaybe<Scalars['String']>;
  usdStablecoin_contains_nocase?: InputMaybe<Scalars['String']>;
  usdStablecoin_ends_with?: InputMaybe<Scalars['String']>;
  usdStablecoin_ends_with_nocase?: InputMaybe<Scalars['String']>;
  usdStablecoin_gt?: InputMaybe<Scalars['String']>;
  usdStablecoin_gte?: InputMaybe<Scalars['String']>;
  usdStablecoin_in?: InputMaybe<Array<Scalars['String']>>;
  usdStablecoin_lt?: InputMaybe<Scalars['String']>;
  usdStablecoin_lte?: InputMaybe<Scalars['String']>;
  usdStablecoin_not?: InputMaybe<Scalars['String']>;
  usdStablecoin_not_contains?: InputMaybe<Scalars['String']>;
  usdStablecoin_not_contains_nocase?: InputMaybe<Scalars['String']>;
  usdStablecoin_not_ends_with?: InputMaybe<Scalars['String']>;
  usdStablecoin_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  usdStablecoin_not_in?: InputMaybe<Array<Scalars['String']>>;
  usdStablecoin_not_starts_with?: InputMaybe<Scalars['String']>;
  usdStablecoin_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  usdStablecoin_starts_with?: InputMaybe<Scalars['String']>;
  usdStablecoin_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum ProtocolStats_OrderBy {
  BtcUsdPrice = 'btcUsdPrice',
  CurrentStakedByVestingSov = 'currentStakedByVestingSov',
  CurrentVoluntarilyStakedSov = 'currentVoluntarilyStakedSov',
  Id = 'id',
  Tokens = 'tokens',
  TotalAmmLpFeesUsd = 'totalAmmLpFeesUsd',
  TotalAmmStakerFeesUsd = 'totalAmmStakerFeesUsd',
  TotalAmmVolumeUsd = 'totalAmmVolumeUsd',
  TotalBorrowVolumeUsd = 'totalBorrowVolumeUsd',
  TotalBorrowingFeesUsd = 'totalBorrowingFeesUsd',
  TotalCloseWithDepositVolumeUsd = 'totalCloseWithDepositVolumeUsd',
  TotalCloseWithSwapVolumeUsd = 'totalCloseWithSwapVolumeUsd',
  TotalDepositCollateralVolumeUsd = 'totalDepositCollateralVolumeUsd',
  TotalLendVolumeUsd = 'totalLendVolumeUsd',
  TotalLendingFeesUsd = 'totalLendingFeesUsd',
  TotalLiquidateVolumeUsd = 'totalLiquidateVolumeUsd',
  TotalMarginTradeVolumeUsd = 'totalMarginTradeVolumeUsd',
  TotalTradingFeesUsd = 'totalTradingFeesUsd',
  TotalUnlendVolumeUsd = 'totalUnlendVolumeUsd',
  TotalUsers = 'totalUsers',
  UsdStablecoin = 'usdStablecoin',
}

export type ProtocolWithdrawFee = {
  __typename?: 'ProtocolWithdrawFee';
  amount: Scalars['BigDecimal'];
  amountUsd: Scalars['BigDecimal'];
  emittedBy: Scalars['String'];
  feeType: FeeType;
  /**
   * ID is txHash-logIndex-tokenSymbol
   *
   */
  id: Scalars['ID'];
  timestamp: Scalars['Int'];
  token: Token;
  transaction: Transaction;
};

export type ProtocolWithdrawFee_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars['BigDecimal']>;
  amountUsd?: InputMaybe<Scalars['BigDecimal']>;
  amountUsd_gt?: InputMaybe<Scalars['BigDecimal']>;
  amountUsd_gte?: InputMaybe<Scalars['BigDecimal']>;
  amountUsd_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  amountUsd_lt?: InputMaybe<Scalars['BigDecimal']>;
  amountUsd_lte?: InputMaybe<Scalars['BigDecimal']>;
  amountUsd_not?: InputMaybe<Scalars['BigDecimal']>;
  amountUsd_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  amount_gt?: InputMaybe<Scalars['BigDecimal']>;
  amount_gte?: InputMaybe<Scalars['BigDecimal']>;
  amount_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  amount_lt?: InputMaybe<Scalars['BigDecimal']>;
  amount_lte?: InputMaybe<Scalars['BigDecimal']>;
  amount_not?: InputMaybe<Scalars['BigDecimal']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  emittedBy?: InputMaybe<Scalars['String']>;
  emittedBy_contains?: InputMaybe<Scalars['String']>;
  emittedBy_contains_nocase?: InputMaybe<Scalars['String']>;
  emittedBy_ends_with?: InputMaybe<Scalars['String']>;
  emittedBy_ends_with_nocase?: InputMaybe<Scalars['String']>;
  emittedBy_gt?: InputMaybe<Scalars['String']>;
  emittedBy_gte?: InputMaybe<Scalars['String']>;
  emittedBy_in?: InputMaybe<Array<Scalars['String']>>;
  emittedBy_lt?: InputMaybe<Scalars['String']>;
  emittedBy_lte?: InputMaybe<Scalars['String']>;
  emittedBy_not?: InputMaybe<Scalars['String']>;
  emittedBy_not_contains?: InputMaybe<Scalars['String']>;
  emittedBy_not_contains_nocase?: InputMaybe<Scalars['String']>;
  emittedBy_not_ends_with?: InputMaybe<Scalars['String']>;
  emittedBy_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  emittedBy_not_in?: InputMaybe<Array<Scalars['String']>>;
  emittedBy_not_starts_with?: InputMaybe<Scalars['String']>;
  emittedBy_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  emittedBy_starts_with?: InputMaybe<Scalars['String']>;
  emittedBy_starts_with_nocase?: InputMaybe<Scalars['String']>;
  feeType?: InputMaybe<FeeType>;
  feeType_in?: InputMaybe<Array<FeeType>>;
  feeType_not?: InputMaybe<FeeType>;
  feeType_not_in?: InputMaybe<Array<FeeType>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  timestamp?: InputMaybe<Scalars['Int']>;
  timestamp_gt?: InputMaybe<Scalars['Int']>;
  timestamp_gte?: InputMaybe<Scalars['Int']>;
  timestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp_lt?: InputMaybe<Scalars['Int']>;
  timestamp_lte?: InputMaybe<Scalars['Int']>;
  timestamp_not?: InputMaybe<Scalars['Int']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
  token?: InputMaybe<Scalars['String']>;
  token_?: InputMaybe<Token_Filter>;
  token_contains?: InputMaybe<Scalars['String']>;
  token_contains_nocase?: InputMaybe<Scalars['String']>;
  token_ends_with?: InputMaybe<Scalars['String']>;
  token_ends_with_nocase?: InputMaybe<Scalars['String']>;
  token_gt?: InputMaybe<Scalars['String']>;
  token_gte?: InputMaybe<Scalars['String']>;
  token_in?: InputMaybe<Array<Scalars['String']>>;
  token_lt?: InputMaybe<Scalars['String']>;
  token_lte?: InputMaybe<Scalars['String']>;
  token_not?: InputMaybe<Scalars['String']>;
  token_not_contains?: InputMaybe<Scalars['String']>;
  token_not_contains_nocase?: InputMaybe<Scalars['String']>;
  token_not_ends_with?: InputMaybe<Scalars['String']>;
  token_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  token_not_in?: InputMaybe<Array<Scalars['String']>>;
  token_not_starts_with?: InputMaybe<Scalars['String']>;
  token_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  token_starts_with?: InputMaybe<Scalars['String']>;
  token_starts_with_nocase?: InputMaybe<Scalars['String']>;
  transaction?: InputMaybe<Scalars['String']>;
  transaction_?: InputMaybe<Transaction_Filter>;
  transaction_contains?: InputMaybe<Scalars['String']>;
  transaction_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_gt?: InputMaybe<Scalars['String']>;
  transaction_gte?: InputMaybe<Scalars['String']>;
  transaction_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_lt?: InputMaybe<Scalars['String']>;
  transaction_lte?: InputMaybe<Scalars['String']>;
  transaction_not?: InputMaybe<Scalars['String']>;
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_not_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
  transaction_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum ProtocolWithdrawFee_OrderBy {
  Amount = 'amount',
  AmountUsd = 'amountUsd',
  EmittedBy = 'emittedBy',
  FeeType = 'feeType',
  Id = 'id',
  Timestamp = 'timestamp',
  Token = 'token',
  Transaction = 'transaction',
}

export type Query = {
  __typename?: 'Query';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  bitcoinTransfer?: Maybe<BitcoinTransfer>;
  bitcoinTransferBatchSending?: Maybe<BitcoinTransferBatchSending>;
  bitcoinTransferBatchSendings: Array<BitcoinTransferBatchSending>;
  bitcoinTransfers: Array<BitcoinTransfer>;
  borrow?: Maybe<Borrow>;
  borrows: Array<Borrow>;
  bridge?: Maybe<Bridge>;
  bridges: Array<Bridge>;
  candleStickDay?: Maybe<CandleStickDay>;
  candleStickDays: Array<CandleStickDay>;
  candleStickFifteenMinute?: Maybe<CandleStickFifteenMinute>;
  candleStickFifteenMinutes: Array<CandleStickFifteenMinute>;
  candleStickFourHour?: Maybe<CandleStickFourHour>;
  candleStickFourHours: Array<CandleStickFourHour>;
  candleStickHour?: Maybe<CandleStickHour>;
  candleStickHours: Array<CandleStickHour>;
  candleStickMinute?: Maybe<CandleStickMinute>;
  candleStickMinutes: Array<CandleStickMinute>;
  closeWithDeposit?: Maybe<CloseWithDeposit>;
  closeWithDeposits: Array<CloseWithDeposit>;
  closeWithSwap?: Maybe<CloseWithSwap>;
  closeWithSwaps: Array<CloseWithSwap>;
  conversion?: Maybe<Conversion>;
  conversions: Array<Conversion>;
  converterRegistries: Array<ConverterRegistry>;
  converterRegistry?: Maybe<ConverterRegistry>;
  crossTransfer?: Maybe<CrossTransfer>;
  crossTransfers: Array<CrossTransfer>;
  debugItem?: Maybe<DebugItem>;
  debugItems: Array<DebugItem>;
  deposit?: Maybe<Deposit>;
  depositCollateral?: Maybe<DepositCollateral>;
  depositCollaterals: Array<DepositCollateral>;
  deposits: Array<Deposit>;
  fastBTCBridgeStat?: Maybe<FastBtcBridgeStat>;
  fastBTCBridgeStats: Array<FastBtcBridgeStat>;
  federation?: Maybe<Federation>;
  federations: Array<Federation>;
  feeSharingTokensTransferred?: Maybe<FeeSharingTokensTransferred>;
  feeSharingTokensTransferreds: Array<FeeSharingTokensTransferred>;
  governorContract?: Maybe<GovernorContract>;
  governorContracts: Array<GovernorContract>;
  icandleStick?: Maybe<ICandleStick>;
  icandleSticks: Array<ICandleStick>;
  lendingHistoryItem?: Maybe<LendingHistoryItem>;
  lendingHistoryItems: Array<LendingHistoryItem>;
  lendingPool?: Maybe<LendingPool>;
  lendingPools: Array<LendingPool>;
  liquidate?: Maybe<Liquidate>;
  liquidates: Array<Liquidate>;
  liquidityHistoryItem?: Maybe<LiquidityHistoryItem>;
  liquidityHistoryItems: Array<LiquidityHistoryItem>;
  liquidityMiningAllocationPoint?: Maybe<LiquidityMiningAllocationPoint>;
  liquidityMiningAllocationPoints: Array<LiquidityMiningAllocationPoint>;
  liquidityMiningGlobal?: Maybe<LiquidityMiningGlobal>;
  liquidityMiningGlobals: Array<LiquidityMiningGlobal>;
  liquidityPool?: Maybe<LiquidityPool>;
  liquidityPoolToken?: Maybe<LiquidityPoolToken>;
  liquidityPoolTokens: Array<LiquidityPoolToken>;
  liquidityPools: Array<LiquidityPool>;
  loan?: Maybe<Loan>;
  loanParamsSetup?: Maybe<LoanParamsSetup>;
  loanParamsSetups: Array<LoanParamsSetup>;
  loans: Array<Loan>;
  marginOrderCanceled?: Maybe<MarginOrderCanceled>;
  marginOrderCanceleds: Array<MarginOrderCanceled>;
  marginOrderFilled?: Maybe<MarginOrderFilled>;
  marginOrderFilleds: Array<MarginOrderFilled>;
  multisigConfirmation?: Maybe<MultisigConfirmation>;
  multisigConfirmations: Array<MultisigConfirmation>;
  multisigContract?: Maybe<MultisigContract>;
  multisigContracts: Array<MultisigContract>;
  multisigTransaction?: Maybe<MultisigTransaction>;
  multisigTransactions: Array<MultisigTransaction>;
  newBitcoinTransferIncoming?: Maybe<NewBitcoinTransferIncoming>;
  newBitcoinTransferIncomings: Array<NewBitcoinTransferIncoming>;
  orderCanceled?: Maybe<OrderCanceled>;
  orderCanceleds: Array<OrderCanceled>;
  orderCreated?: Maybe<OrderCreated>;
  orderCreateds: Array<OrderCreated>;
  orderFilled?: Maybe<OrderFilled>;
  orderFilleds: Array<OrderFilled>;
  payBorrowingFee?: Maybe<PayBorrowingFee>;
  payBorrowingFees: Array<PayBorrowingFee>;
  payInterestTransfer?: Maybe<PayInterestTransfer>;
  payInterestTransfers: Array<PayInterestTransfer>;
  payLendingFee?: Maybe<PayLendingFee>;
  payLendingFees: Array<PayLendingFee>;
  payTradingFee?: Maybe<PayTradingFee>;
  payTradingFees: Array<PayTradingFee>;
  poolToken?: Maybe<PoolToken>;
  poolTokens: Array<PoolToken>;
  poolVolumeItem?: Maybe<PoolVolumeItem>;
  poolVolumeItems: Array<PoolVolumeItem>;
  proposal?: Maybe<Proposal>;
  proposalStateChange?: Maybe<ProposalStateChange>;
  proposalStateChanges: Array<ProposalStateChange>;
  proposals: Array<Proposal>;
  protocolStats: Array<ProtocolStats>;
  protocolWithdrawFee?: Maybe<ProtocolWithdrawFee>;
  protocolWithdrawFees: Array<ProtocolWithdrawFee>;
  rewardsEarnedHistoryItem?: Maybe<RewardsEarnedHistoryItem>;
  rewardsEarnedHistoryItems: Array<RewardsEarnedHistoryItem>;
  rollover?: Maybe<Rollover>;
  rollovers: Array<Rollover>;
  sideToken?: Maybe<SideToken>;
  sideTokens: Array<SideToken>;
  smartToken?: Maybe<SmartToken>;
  smartTokens: Array<SmartToken>;
  stake?: Maybe<Stake>;
  stakeHistoryItem?: Maybe<StakeHistoryItem>;
  stakeHistoryItems: Array<StakeHistoryItem>;
  stakes: Array<Stake>;
  swap?: Maybe<Swap>;
  swapSetting?: Maybe<SwapSetting>;
  swapSettings: Array<SwapSetting>;
  swaps: Array<Swap>;
  token?: Maybe<Token>;
  tokenSmartToken?: Maybe<TokenSmartToken>;
  tokenSmartTokens: Array<TokenSmartToken>;
  tokens: Array<Token>;
  tokensStaked?: Maybe<TokensStaked>;
  tokensStakeds: Array<TokensStaked>;
  trade?: Maybe<Trade>;
  trades: Array<Trade>;
  transaction?: Maybe<Transaction>;
  transactions: Array<Transaction>;
  user?: Maybe<User>;
  userLendingHistories: Array<UserLendingHistory>;
  userLendingHistory?: Maybe<UserLendingHistory>;
  userLiquidityHistories: Array<UserLiquidityHistory>;
  userLiquidityHistory?: Maybe<UserLiquidityHistory>;
  userRewardsEarnedHistories: Array<UserRewardsEarnedHistory>;
  userRewardsEarnedHistory?: Maybe<UserRewardsEarnedHistory>;
  userStakeHistories: Array<UserStakeHistory>;
  userStakeHistory?: Maybe<UserStakeHistory>;
  userTotal?: Maybe<UserTotal>;
  userTotals: Array<UserTotal>;
  users: Array<User>;
  v2DelegateChanged?: Maybe<V2DelegateChanged>;
  v2DelegateChangeds: Array<V2DelegateChanged>;
  v2ExtendedStakingDuration?: Maybe<V2ExtendedStakingDuration>;
  v2ExtendedStakingDurations: Array<V2ExtendedStakingDuration>;
  v2Stake?: Maybe<V2Stake>;
  v2Stakes: Array<V2Stake>;
  v2StakingWithdrawn?: Maybe<V2StakingWithdrawn>;
  v2StakingWithdrawns: Array<V2StakingWithdrawn>;
  v2TokensStaked?: Maybe<V2TokensStaked>;
  v2TokensStakeds: Array<V2TokensStaked>;
  vestingContract?: Maybe<VestingContract>;
  vestingContracts: Array<VestingContract>;
  vestingHistoryItem?: Maybe<VestingHistoryItem>;
  vestingHistoryItems: Array<VestingHistoryItem>;
  voteCast?: Maybe<VoteCast>;
  voteCasts: Array<VoteCast>;
  withdrawal?: Maybe<Withdrawal>;
  withdrawals: Array<Withdrawal>;
};

export type Query_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};

export type QueryBitcoinTransferArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryBitcoinTransferBatchSendingArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryBitcoinTransferBatchSendingsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<BitcoinTransferBatchSending_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<BitcoinTransferBatchSending_Filter>;
};

export type QueryBitcoinTransfersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<BitcoinTransfer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<BitcoinTransfer_Filter>;
};

export type QueryBorrowArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryBorrowsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Borrow_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Borrow_Filter>;
};

export type QueryBridgeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryBridgesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Bridge_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Bridge_Filter>;
};

export type QueryCandleStickDayArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryCandleStickDaysArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<CandleStickDay_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<CandleStickDay_Filter>;
};

export type QueryCandleStickFifteenMinuteArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryCandleStickFifteenMinutesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<CandleStickFifteenMinute_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<CandleStickFifteenMinute_Filter>;
};

export type QueryCandleStickFourHourArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryCandleStickFourHoursArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<CandleStickFourHour_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<CandleStickFourHour_Filter>;
};

export type QueryCandleStickHourArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryCandleStickHoursArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<CandleStickHour_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<CandleStickHour_Filter>;
};

export type QueryCandleStickMinuteArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryCandleStickMinutesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<CandleStickMinute_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<CandleStickMinute_Filter>;
};

export type QueryCloseWithDepositArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryCloseWithDepositsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<CloseWithDeposit_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<CloseWithDeposit_Filter>;
};

export type QueryCloseWithSwapArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryCloseWithSwapsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<CloseWithSwap_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<CloseWithSwap_Filter>;
};

export type QueryConversionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryConversionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Conversion_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Conversion_Filter>;
};

export type QueryConverterRegistriesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ConverterRegistry_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ConverterRegistry_Filter>;
};

export type QueryConverterRegistryArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryCrossTransferArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryCrossTransfersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<CrossTransfer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<CrossTransfer_Filter>;
};

export type QueryDebugItemArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryDebugItemsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<DebugItem_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<DebugItem_Filter>;
};

export type QueryDepositArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryDepositCollateralArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryDepositCollateralsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<DepositCollateral_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<DepositCollateral_Filter>;
};

export type QueryDepositsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Deposit_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Deposit_Filter>;
};

export type QueryFastBtcBridgeStatArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryFastBtcBridgeStatsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<FastBtcBridgeStat_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<FastBtcBridgeStat_Filter>;
};

export type QueryFederationArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryFederationsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Federation_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Federation_Filter>;
};

export type QueryFeeSharingTokensTransferredArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryFeeSharingTokensTransferredsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<FeeSharingTokensTransferred_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<FeeSharingTokensTransferred_Filter>;
};

export type QueryGovernorContractArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryGovernorContractsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<GovernorContract_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<GovernorContract_Filter>;
};

export type QueryIcandleStickArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryIcandleSticksArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ICandleStick_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ICandleStick_Filter>;
};

export type QueryLendingHistoryItemArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryLendingHistoryItemsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<LendingHistoryItem_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<LendingHistoryItem_Filter>;
};

export type QueryLendingPoolArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryLendingPoolsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<LendingPool_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<LendingPool_Filter>;
};

export type QueryLiquidateArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryLiquidatesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Liquidate_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Liquidate_Filter>;
};

export type QueryLiquidityHistoryItemArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryLiquidityHistoryItemsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<LiquidityHistoryItem_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<LiquidityHistoryItem_Filter>;
};

export type QueryLiquidityMiningAllocationPointArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryLiquidityMiningAllocationPointsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<LiquidityMiningAllocationPoint_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<LiquidityMiningAllocationPoint_Filter>;
};

export type QueryLiquidityMiningGlobalArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryLiquidityMiningGlobalsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<LiquidityMiningGlobal_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<LiquidityMiningGlobal_Filter>;
};

export type QueryLiquidityPoolArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryLiquidityPoolTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryLiquidityPoolTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<LiquidityPoolToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<LiquidityPoolToken_Filter>;
};

export type QueryLiquidityPoolsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<LiquidityPool_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<LiquidityPool_Filter>;
};

export type QueryLoanArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryLoanParamsSetupArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryLoanParamsSetupsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<LoanParamsSetup_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<LoanParamsSetup_Filter>;
};

export type QueryLoansArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Loan_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Loan_Filter>;
};

export type QueryMarginOrderCanceledArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryMarginOrderCanceledsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MarginOrderCanceled_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<MarginOrderCanceled_Filter>;
};

export type QueryMarginOrderFilledArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryMarginOrderFilledsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MarginOrderFilled_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<MarginOrderFilled_Filter>;
};

export type QueryMultisigConfirmationArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryMultisigConfirmationsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MultisigConfirmation_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<MultisigConfirmation_Filter>;
};

export type QueryMultisigContractArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryMultisigContractsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MultisigContract_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<MultisigContract_Filter>;
};

export type QueryMultisigTransactionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryMultisigTransactionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MultisigTransaction_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<MultisigTransaction_Filter>;
};

export type QueryNewBitcoinTransferIncomingArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryNewBitcoinTransferIncomingsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<NewBitcoinTransferIncoming_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<NewBitcoinTransferIncoming_Filter>;
};

export type QueryOrderCanceledArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryOrderCanceledsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<OrderCanceled_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<OrderCanceled_Filter>;
};

export type QueryOrderCreatedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryOrderCreatedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<OrderCreated_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<OrderCreated_Filter>;
};

export type QueryOrderFilledArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryOrderFilledsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<OrderFilled_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<OrderFilled_Filter>;
};

export type QueryPayBorrowingFeeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryPayBorrowingFeesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<PayBorrowingFee_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PayBorrowingFee_Filter>;
};

export type QueryPayInterestTransferArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryPayInterestTransfersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<PayInterestTransfer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PayInterestTransfer_Filter>;
};

export type QueryPayLendingFeeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryPayLendingFeesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<PayLendingFee_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PayLendingFee_Filter>;
};

export type QueryPayTradingFeeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryPayTradingFeesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<PayTradingFee_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PayTradingFee_Filter>;
};

export type QueryPoolTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryPoolTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<PoolToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PoolToken_Filter>;
};

export type QueryPoolVolumeItemArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryPoolVolumeItemsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<PoolVolumeItem_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PoolVolumeItem_Filter>;
};

export type QueryProposalArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryProposalStateChangeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryProposalStateChangesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ProposalStateChange_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ProposalStateChange_Filter>;
};

export type QueryProposalsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Proposal_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Proposal_Filter>;
};

export type QueryProtocolStatsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ProtocolStats_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ProtocolStats_Filter>;
};

export type QueryProtocolWithdrawFeeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryProtocolWithdrawFeesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ProtocolWithdrawFee_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ProtocolWithdrawFee_Filter>;
};

export type QueryRewardsEarnedHistoryItemArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryRewardsEarnedHistoryItemsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<RewardsEarnedHistoryItem_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<RewardsEarnedHistoryItem_Filter>;
};

export type QueryRolloverArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryRolloversArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Rollover_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Rollover_Filter>;
};

export type QuerySideTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QuerySideTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<SideToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<SideToken_Filter>;
};

export type QuerySmartTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QuerySmartTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<SmartToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<SmartToken_Filter>;
};

export type QueryStakeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryStakeHistoryItemArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryStakeHistoryItemsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<StakeHistoryItem_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<StakeHistoryItem_Filter>;
};

export type QueryStakesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Stake_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Stake_Filter>;
};

export type QuerySwapArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QuerySwapSettingArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QuerySwapSettingsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<SwapSetting_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<SwapSetting_Filter>;
};

export type QuerySwapsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Swap_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Swap_Filter>;
};

export type QueryTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryTokenSmartTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryTokenSmartTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TokenSmartToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TokenSmartToken_Filter>;
};

export type QueryTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Token_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Token_Filter>;
};

export type QueryTokensStakedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryTokensStakedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TokensStaked_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TokensStaked_Filter>;
};

export type QueryTradeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryTradesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Trade_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Trade_Filter>;
};

export type QueryTransactionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryTransactionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Transaction_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Transaction_Filter>;
};

export type QueryUserArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryUserLendingHistoriesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UserLendingHistory_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<UserLendingHistory_Filter>;
};

export type QueryUserLendingHistoryArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryUserLiquidityHistoriesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UserLiquidityHistory_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<UserLiquidityHistory_Filter>;
};

export type QueryUserLiquidityHistoryArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryUserRewardsEarnedHistoriesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UserRewardsEarnedHistory_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<UserRewardsEarnedHistory_Filter>;
};

export type QueryUserRewardsEarnedHistoryArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryUserStakeHistoriesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UserStakeHistory_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<UserStakeHistory_Filter>;
};

export type QueryUserStakeHistoryArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryUserTotalArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryUserTotalsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UserTotal_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<UserTotal_Filter>;
};

export type QueryUsersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<User_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<User_Filter>;
};

export type QueryV2DelegateChangedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryV2DelegateChangedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<V2DelegateChanged_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<V2DelegateChanged_Filter>;
};

export type QueryV2ExtendedStakingDurationArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryV2ExtendedStakingDurationsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<V2ExtendedStakingDuration_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<V2ExtendedStakingDuration_Filter>;
};

export type QueryV2StakeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryV2StakesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<V2Stake_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<V2Stake_Filter>;
};

export type QueryV2StakingWithdrawnArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryV2StakingWithdrawnsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<V2StakingWithdrawn_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<V2StakingWithdrawn_Filter>;
};

export type QueryV2TokensStakedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryV2TokensStakedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<V2TokensStaked_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<V2TokensStaked_Filter>;
};

export type QueryVestingContractArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryVestingContractsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<VestingContract_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<VestingContract_Filter>;
};

export type QueryVestingHistoryItemArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryVestingHistoryItemsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<VestingHistoryItem_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<VestingHistoryItem_Filter>;
};

export type QueryVoteCastArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryVoteCastsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<VoteCast_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<VoteCast_Filter>;
};

export type QueryWithdrawalArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryWithdrawalsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Withdrawal_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Withdrawal_Filter>;
};

export enum RewardsEarnedAction {
  /**
   * SOV reward earned when a user margin trades or one of their trades is rolled over.
   * The reward is a percentage of the trading fee, paid in SOV.
   *
   */
  EarnReward = 'EarnReward',
  /**
   * When a user claims a liquidity mining reward
   *
   */
  RewardClaimed = 'RewardClaimed',
  /**
   * When SOV is staked by a Rewards vesting contract (eg after it has been claimed by the user)
   *
   */
  RewardSovStaked = 'RewardSovStaked',
  /**
   * When a SOV Staker withdraws their liquid SOV reward for staking
   *
   */
  StakingRewardWithdrawn = 'StakingRewardWithdrawn',
  /**
   * When an SOV Staker withdraws their share of the fees earned by the Protocol
   *
   */
  UserFeeWithdrawn = 'UserFeeWithdrawn',
}

export type RewardsEarnedHistoryItem = {
  __typename?: 'RewardsEarnedHistoryItem';
  action: RewardsEarnedAction;
  amount: Scalars['BigDecimal'];
  id: Scalars['ID'];
  timestamp: Scalars['Int'];
  token?: Maybe<Scalars['String']>;
  transaction: Transaction;
  user: UserRewardsEarnedHistory;
};

export type RewardsEarnedHistoryItem_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  action?: InputMaybe<RewardsEarnedAction>;
  action_in?: InputMaybe<Array<RewardsEarnedAction>>;
  action_not?: InputMaybe<RewardsEarnedAction>;
  action_not_in?: InputMaybe<Array<RewardsEarnedAction>>;
  amount?: InputMaybe<Scalars['BigDecimal']>;
  amount_gt?: InputMaybe<Scalars['BigDecimal']>;
  amount_gte?: InputMaybe<Scalars['BigDecimal']>;
  amount_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  amount_lt?: InputMaybe<Scalars['BigDecimal']>;
  amount_lte?: InputMaybe<Scalars['BigDecimal']>;
  amount_not?: InputMaybe<Scalars['BigDecimal']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  timestamp?: InputMaybe<Scalars['Int']>;
  timestamp_gt?: InputMaybe<Scalars['Int']>;
  timestamp_gte?: InputMaybe<Scalars['Int']>;
  timestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp_lt?: InputMaybe<Scalars['Int']>;
  timestamp_lte?: InputMaybe<Scalars['Int']>;
  timestamp_not?: InputMaybe<Scalars['Int']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
  token?: InputMaybe<Scalars['String']>;
  token_contains?: InputMaybe<Scalars['String']>;
  token_contains_nocase?: InputMaybe<Scalars['String']>;
  token_ends_with?: InputMaybe<Scalars['String']>;
  token_ends_with_nocase?: InputMaybe<Scalars['String']>;
  token_gt?: InputMaybe<Scalars['String']>;
  token_gte?: InputMaybe<Scalars['String']>;
  token_in?: InputMaybe<Array<Scalars['String']>>;
  token_lt?: InputMaybe<Scalars['String']>;
  token_lte?: InputMaybe<Scalars['String']>;
  token_not?: InputMaybe<Scalars['String']>;
  token_not_contains?: InputMaybe<Scalars['String']>;
  token_not_contains_nocase?: InputMaybe<Scalars['String']>;
  token_not_ends_with?: InputMaybe<Scalars['String']>;
  token_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  token_not_in?: InputMaybe<Array<Scalars['String']>>;
  token_not_starts_with?: InputMaybe<Scalars['String']>;
  token_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  token_starts_with?: InputMaybe<Scalars['String']>;
  token_starts_with_nocase?: InputMaybe<Scalars['String']>;
  transaction?: InputMaybe<Scalars['String']>;
  transaction_?: InputMaybe<Transaction_Filter>;
  transaction_contains?: InputMaybe<Scalars['String']>;
  transaction_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_gt?: InputMaybe<Scalars['String']>;
  transaction_gte?: InputMaybe<Scalars['String']>;
  transaction_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_lt?: InputMaybe<Scalars['String']>;
  transaction_lte?: InputMaybe<Scalars['String']>;
  transaction_not?: InputMaybe<Scalars['String']>;
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_not_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
  transaction_starts_with_nocase?: InputMaybe<Scalars['String']>;
  user?: InputMaybe<Scalars['String']>;
  user_?: InputMaybe<UserRewardsEarnedHistory_Filter>;
  user_contains?: InputMaybe<Scalars['String']>;
  user_contains_nocase?: InputMaybe<Scalars['String']>;
  user_ends_with?: InputMaybe<Scalars['String']>;
  user_ends_with_nocase?: InputMaybe<Scalars['String']>;
  user_gt?: InputMaybe<Scalars['String']>;
  user_gte?: InputMaybe<Scalars['String']>;
  user_in?: InputMaybe<Array<Scalars['String']>>;
  user_lt?: InputMaybe<Scalars['String']>;
  user_lte?: InputMaybe<Scalars['String']>;
  user_not?: InputMaybe<Scalars['String']>;
  user_not_contains?: InputMaybe<Scalars['String']>;
  user_not_contains_nocase?: InputMaybe<Scalars['String']>;
  user_not_ends_with?: InputMaybe<Scalars['String']>;
  user_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  user_not_in?: InputMaybe<Array<Scalars['String']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']>;
  user_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  user_starts_with?: InputMaybe<Scalars['String']>;
  user_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum RewardsEarnedHistoryItem_OrderBy {
  Action = 'action',
  Amount = 'amount',
  Id = 'id',
  Timestamp = 'timestamp',
  Token = 'token',
  Transaction = 'transaction',
  User = 'user',
}

/**
 * Granular event data for the Loan entity. Emitted when a Loan is rolled over.
 * This is when the next installment of interest is paid from the collateral, and the trading fee is paid
 * This transaction is initiated by the Sovryn node, which earns a reward for doing this
 *
 */
export type Rollover = {
  __typename?: 'Rollover';
  collateral: Scalars['BigDecimal'];
  emittedBy: Scalars['Bytes'];
  endTimestamp: Scalars['Int'];
  id: Scalars['ID'];
  lender: Scalars['Bytes'];
  loanId: Loan;
  principal: Scalars['BigDecimal'];
  /**
   * The reward received by the User for performing this function
   *
   */
  reward: Scalars['BigDecimal'];
  /**
   * The User running the Sovryn node that made this transaction
   *
   */
  rewardReceiver: User;
  timestamp: Scalars['Int'];
  transaction: Transaction;
  user: User;
};

export type Rollover_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  collateral?: InputMaybe<Scalars['BigDecimal']>;
  collateral_gt?: InputMaybe<Scalars['BigDecimal']>;
  collateral_gte?: InputMaybe<Scalars['BigDecimal']>;
  collateral_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  collateral_lt?: InputMaybe<Scalars['BigDecimal']>;
  collateral_lte?: InputMaybe<Scalars['BigDecimal']>;
  collateral_not?: InputMaybe<Scalars['BigDecimal']>;
  collateral_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  emittedBy?: InputMaybe<Scalars['Bytes']>;
  emittedBy_contains?: InputMaybe<Scalars['Bytes']>;
  emittedBy_in?: InputMaybe<Array<Scalars['Bytes']>>;
  emittedBy_not?: InputMaybe<Scalars['Bytes']>;
  emittedBy_not_contains?: InputMaybe<Scalars['Bytes']>;
  emittedBy_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  endTimestamp?: InputMaybe<Scalars['Int']>;
  endTimestamp_gt?: InputMaybe<Scalars['Int']>;
  endTimestamp_gte?: InputMaybe<Scalars['Int']>;
  endTimestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  endTimestamp_lt?: InputMaybe<Scalars['Int']>;
  endTimestamp_lte?: InputMaybe<Scalars['Int']>;
  endTimestamp_not?: InputMaybe<Scalars['Int']>;
  endTimestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  lender?: InputMaybe<Scalars['Bytes']>;
  lender_contains?: InputMaybe<Scalars['Bytes']>;
  lender_in?: InputMaybe<Array<Scalars['Bytes']>>;
  lender_not?: InputMaybe<Scalars['Bytes']>;
  lender_not_contains?: InputMaybe<Scalars['Bytes']>;
  lender_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  loanId?: InputMaybe<Scalars['String']>;
  loanId_?: InputMaybe<Loan_Filter>;
  loanId_contains?: InputMaybe<Scalars['String']>;
  loanId_contains_nocase?: InputMaybe<Scalars['String']>;
  loanId_ends_with?: InputMaybe<Scalars['String']>;
  loanId_ends_with_nocase?: InputMaybe<Scalars['String']>;
  loanId_gt?: InputMaybe<Scalars['String']>;
  loanId_gte?: InputMaybe<Scalars['String']>;
  loanId_in?: InputMaybe<Array<Scalars['String']>>;
  loanId_lt?: InputMaybe<Scalars['String']>;
  loanId_lte?: InputMaybe<Scalars['String']>;
  loanId_not?: InputMaybe<Scalars['String']>;
  loanId_not_contains?: InputMaybe<Scalars['String']>;
  loanId_not_contains_nocase?: InputMaybe<Scalars['String']>;
  loanId_not_ends_with?: InputMaybe<Scalars['String']>;
  loanId_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  loanId_not_in?: InputMaybe<Array<Scalars['String']>>;
  loanId_not_starts_with?: InputMaybe<Scalars['String']>;
  loanId_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  loanId_starts_with?: InputMaybe<Scalars['String']>;
  loanId_starts_with_nocase?: InputMaybe<Scalars['String']>;
  principal?: InputMaybe<Scalars['BigDecimal']>;
  principal_gt?: InputMaybe<Scalars['BigDecimal']>;
  principal_gte?: InputMaybe<Scalars['BigDecimal']>;
  principal_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  principal_lt?: InputMaybe<Scalars['BigDecimal']>;
  principal_lte?: InputMaybe<Scalars['BigDecimal']>;
  principal_not?: InputMaybe<Scalars['BigDecimal']>;
  principal_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  reward?: InputMaybe<Scalars['BigDecimal']>;
  rewardReceiver?: InputMaybe<Scalars['String']>;
  rewardReceiver_?: InputMaybe<User_Filter>;
  rewardReceiver_contains?: InputMaybe<Scalars['String']>;
  rewardReceiver_contains_nocase?: InputMaybe<Scalars['String']>;
  rewardReceiver_ends_with?: InputMaybe<Scalars['String']>;
  rewardReceiver_ends_with_nocase?: InputMaybe<Scalars['String']>;
  rewardReceiver_gt?: InputMaybe<Scalars['String']>;
  rewardReceiver_gte?: InputMaybe<Scalars['String']>;
  rewardReceiver_in?: InputMaybe<Array<Scalars['String']>>;
  rewardReceiver_lt?: InputMaybe<Scalars['String']>;
  rewardReceiver_lte?: InputMaybe<Scalars['String']>;
  rewardReceiver_not?: InputMaybe<Scalars['String']>;
  rewardReceiver_not_contains?: InputMaybe<Scalars['String']>;
  rewardReceiver_not_contains_nocase?: InputMaybe<Scalars['String']>;
  rewardReceiver_not_ends_with?: InputMaybe<Scalars['String']>;
  rewardReceiver_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  rewardReceiver_not_in?: InputMaybe<Array<Scalars['String']>>;
  rewardReceiver_not_starts_with?: InputMaybe<Scalars['String']>;
  rewardReceiver_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  rewardReceiver_starts_with?: InputMaybe<Scalars['String']>;
  rewardReceiver_starts_with_nocase?: InputMaybe<Scalars['String']>;
  reward_gt?: InputMaybe<Scalars['BigDecimal']>;
  reward_gte?: InputMaybe<Scalars['BigDecimal']>;
  reward_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  reward_lt?: InputMaybe<Scalars['BigDecimal']>;
  reward_lte?: InputMaybe<Scalars['BigDecimal']>;
  reward_not?: InputMaybe<Scalars['BigDecimal']>;
  reward_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  timestamp?: InputMaybe<Scalars['Int']>;
  timestamp_gt?: InputMaybe<Scalars['Int']>;
  timestamp_gte?: InputMaybe<Scalars['Int']>;
  timestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp_lt?: InputMaybe<Scalars['Int']>;
  timestamp_lte?: InputMaybe<Scalars['Int']>;
  timestamp_not?: InputMaybe<Scalars['Int']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
  transaction?: InputMaybe<Scalars['String']>;
  transaction_?: InputMaybe<Transaction_Filter>;
  transaction_contains?: InputMaybe<Scalars['String']>;
  transaction_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_gt?: InputMaybe<Scalars['String']>;
  transaction_gte?: InputMaybe<Scalars['String']>;
  transaction_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_lt?: InputMaybe<Scalars['String']>;
  transaction_lte?: InputMaybe<Scalars['String']>;
  transaction_not?: InputMaybe<Scalars['String']>;
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_not_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
  transaction_starts_with_nocase?: InputMaybe<Scalars['String']>;
  user?: InputMaybe<Scalars['String']>;
  user_?: InputMaybe<User_Filter>;
  user_contains?: InputMaybe<Scalars['String']>;
  user_contains_nocase?: InputMaybe<Scalars['String']>;
  user_ends_with?: InputMaybe<Scalars['String']>;
  user_ends_with_nocase?: InputMaybe<Scalars['String']>;
  user_gt?: InputMaybe<Scalars['String']>;
  user_gte?: InputMaybe<Scalars['String']>;
  user_in?: InputMaybe<Array<Scalars['String']>>;
  user_lt?: InputMaybe<Scalars['String']>;
  user_lte?: InputMaybe<Scalars['String']>;
  user_not?: InputMaybe<Scalars['String']>;
  user_not_contains?: InputMaybe<Scalars['String']>;
  user_not_contains_nocase?: InputMaybe<Scalars['String']>;
  user_not_ends_with?: InputMaybe<Scalars['String']>;
  user_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  user_not_in?: InputMaybe<Array<Scalars['String']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']>;
  user_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  user_starts_with?: InputMaybe<Scalars['String']>;
  user_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum Rollover_OrderBy {
  Collateral = 'collateral',
  EmittedBy = 'emittedBy',
  EndTimestamp = 'endTimestamp',
  Id = 'id',
  Lender = 'lender',
  LoanId = 'loanId',
  Principal = 'principal',
  Reward = 'reward',
  RewardReceiver = 'rewardReceiver',
  Timestamp = 'timestamp',
  Transaction = 'transaction',
  User = 'user',
}

/**
 * SideToken entity - for every token that is passed across the bridge and does not exist on sovryn a side token is created
 *
 */
export type SideToken = {
  __typename?: 'SideToken';
  /**
   * CreatedAtTx - the creation transaction of the side token
   *
   */
  createdAtTx: Transaction;
  /**
   * Granularity - this is the ERC777 granularity value for the side token
   *
   */
  granularity: Scalars['BigInt'];
  /**
   * Id - the side token is stored twice, once with the original token address as id and another with the side token address
   *
   */
  id: Scalars['ID'];
  /**
   * newSymbol - the new symbol given to the side token
   *
   */
  newSymbol: Scalars['String'];
  /**
   * OriginalTokenAddress - the original token address of the side token
   *
   */
  originalTokenAddress: Scalars['Bytes'];
  /**
   * SideTokenAddress - the token address on RSK of the side token
   *
   */
  sideTokenAddress: Scalars['Bytes'];
  /**
   * UpdatedAtTx - The side token was last updated at this transaction
   *
   */
  updatedAtTx: Transaction;
};

export type SideToken_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  createdAtTx?: InputMaybe<Scalars['String']>;
  createdAtTx_?: InputMaybe<Transaction_Filter>;
  createdAtTx_contains?: InputMaybe<Scalars['String']>;
  createdAtTx_contains_nocase?: InputMaybe<Scalars['String']>;
  createdAtTx_ends_with?: InputMaybe<Scalars['String']>;
  createdAtTx_ends_with_nocase?: InputMaybe<Scalars['String']>;
  createdAtTx_gt?: InputMaybe<Scalars['String']>;
  createdAtTx_gte?: InputMaybe<Scalars['String']>;
  createdAtTx_in?: InputMaybe<Array<Scalars['String']>>;
  createdAtTx_lt?: InputMaybe<Scalars['String']>;
  createdAtTx_lte?: InputMaybe<Scalars['String']>;
  createdAtTx_not?: InputMaybe<Scalars['String']>;
  createdAtTx_not_contains?: InputMaybe<Scalars['String']>;
  createdAtTx_not_contains_nocase?: InputMaybe<Scalars['String']>;
  createdAtTx_not_ends_with?: InputMaybe<Scalars['String']>;
  createdAtTx_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  createdAtTx_not_in?: InputMaybe<Array<Scalars['String']>>;
  createdAtTx_not_starts_with?: InputMaybe<Scalars['String']>;
  createdAtTx_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  createdAtTx_starts_with?: InputMaybe<Scalars['String']>;
  createdAtTx_starts_with_nocase?: InputMaybe<Scalars['String']>;
  granularity?: InputMaybe<Scalars['BigInt']>;
  granularity_gt?: InputMaybe<Scalars['BigInt']>;
  granularity_gte?: InputMaybe<Scalars['BigInt']>;
  granularity_in?: InputMaybe<Array<Scalars['BigInt']>>;
  granularity_lt?: InputMaybe<Scalars['BigInt']>;
  granularity_lte?: InputMaybe<Scalars['BigInt']>;
  granularity_not?: InputMaybe<Scalars['BigInt']>;
  granularity_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  newSymbol?: InputMaybe<Scalars['String']>;
  newSymbol_contains?: InputMaybe<Scalars['String']>;
  newSymbol_contains_nocase?: InputMaybe<Scalars['String']>;
  newSymbol_ends_with?: InputMaybe<Scalars['String']>;
  newSymbol_ends_with_nocase?: InputMaybe<Scalars['String']>;
  newSymbol_gt?: InputMaybe<Scalars['String']>;
  newSymbol_gte?: InputMaybe<Scalars['String']>;
  newSymbol_in?: InputMaybe<Array<Scalars['String']>>;
  newSymbol_lt?: InputMaybe<Scalars['String']>;
  newSymbol_lte?: InputMaybe<Scalars['String']>;
  newSymbol_not?: InputMaybe<Scalars['String']>;
  newSymbol_not_contains?: InputMaybe<Scalars['String']>;
  newSymbol_not_contains_nocase?: InputMaybe<Scalars['String']>;
  newSymbol_not_ends_with?: InputMaybe<Scalars['String']>;
  newSymbol_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  newSymbol_not_in?: InputMaybe<Array<Scalars['String']>>;
  newSymbol_not_starts_with?: InputMaybe<Scalars['String']>;
  newSymbol_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  newSymbol_starts_with?: InputMaybe<Scalars['String']>;
  newSymbol_starts_with_nocase?: InputMaybe<Scalars['String']>;
  originalTokenAddress?: InputMaybe<Scalars['Bytes']>;
  originalTokenAddress_contains?: InputMaybe<Scalars['Bytes']>;
  originalTokenAddress_in?: InputMaybe<Array<Scalars['Bytes']>>;
  originalTokenAddress_not?: InputMaybe<Scalars['Bytes']>;
  originalTokenAddress_not_contains?: InputMaybe<Scalars['Bytes']>;
  originalTokenAddress_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  sideTokenAddress?: InputMaybe<Scalars['Bytes']>;
  sideTokenAddress_contains?: InputMaybe<Scalars['Bytes']>;
  sideTokenAddress_in?: InputMaybe<Array<Scalars['Bytes']>>;
  sideTokenAddress_not?: InputMaybe<Scalars['Bytes']>;
  sideTokenAddress_not_contains?: InputMaybe<Scalars['Bytes']>;
  sideTokenAddress_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  updatedAtTx?: InputMaybe<Scalars['String']>;
  updatedAtTx_?: InputMaybe<Transaction_Filter>;
  updatedAtTx_contains?: InputMaybe<Scalars['String']>;
  updatedAtTx_contains_nocase?: InputMaybe<Scalars['String']>;
  updatedAtTx_ends_with?: InputMaybe<Scalars['String']>;
  updatedAtTx_ends_with_nocase?: InputMaybe<Scalars['String']>;
  updatedAtTx_gt?: InputMaybe<Scalars['String']>;
  updatedAtTx_gte?: InputMaybe<Scalars['String']>;
  updatedAtTx_in?: InputMaybe<Array<Scalars['String']>>;
  updatedAtTx_lt?: InputMaybe<Scalars['String']>;
  updatedAtTx_lte?: InputMaybe<Scalars['String']>;
  updatedAtTx_not?: InputMaybe<Scalars['String']>;
  updatedAtTx_not_contains?: InputMaybe<Scalars['String']>;
  updatedAtTx_not_contains_nocase?: InputMaybe<Scalars['String']>;
  updatedAtTx_not_ends_with?: InputMaybe<Scalars['String']>;
  updatedAtTx_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  updatedAtTx_not_in?: InputMaybe<Array<Scalars['String']>>;
  updatedAtTx_not_starts_with?: InputMaybe<Scalars['String']>;
  updatedAtTx_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  updatedAtTx_starts_with?: InputMaybe<Scalars['String']>;
  updatedAtTx_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum SideToken_OrderBy {
  CreatedAtTx = 'createdAtTx',
  Granularity = 'granularity',
  Id = 'id',
  NewSymbol = 'newSymbol',
  OriginalTokenAddress = 'originalTokenAddress',
  SideTokenAddress = 'sideTokenAddress',
  UpdatedAtTx = 'updatedAtTx',
}

/**
 * The smart token represents a single reserve asset on a single pool.
 * For V1 pools, there is 1 smart token representing both reserve assets. For V2 pools, there are 2 smart tokens, one for each reserve asset.
 *
 */
export type SmartToken = {
  __typename?: 'SmartToken';
  addedToRegistryBlockNumber?: Maybe<Scalars['Int']>;
  addedToRegistryTransactionHash?: Maybe<Scalars['Bytes']>;
  /**
   * connectorTokens are the entity that holds the many-to-many relationship between the underlying token asset and the smart token
   *
   */
  connectorTokens?: Maybe<Array<TokenSmartToken>>;
  /**
   * The converter registry this smart token belongs to. Can be null if token is removed from th registry
   *
   */
  currentConverterRegistry?: Maybe<ConverterRegistry>;
  /**
   * Number of decimal places for this token
   *
   */
  decimals?: Maybe<Scalars['Int']>;
  /**
   * ID is smart token contract address
   *
   */
  id: Scalars['ID'];
  /**
   * The AMM pool this smart token "belongs" to
   *
   */
  liquidityPool: LiquidityPool;
  /**
   * Name of the smart token (set on the contract)
   *
   */
  name?: Maybe<Scalars['String']>;
  /**
   * The contract/account that owns the SmartToken contract. This will typically be the converter registry
   *
   */
  owner: Scalars['String'];
  /**
   * smartTokenType can be Relay or Liquid
   *
   */
  smartTokenType?: Maybe<Scalars['String']>;
  /**
   * Symbol for the smart token asset (set on the contract)
   *
   */
  symbol?: Maybe<Scalars['String']>;
};

/**
 * The smart token represents a single reserve asset on a single pool.
 * For V1 pools, there is 1 smart token representing both reserve assets. For V2 pools, there are 2 smart tokens, one for each reserve asset.
 *
 */
export type SmartTokenConnectorTokensArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TokenSmartToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<TokenSmartToken_Filter>;
};

export type SmartToken_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  addedToRegistryBlockNumber?: InputMaybe<Scalars['Int']>;
  addedToRegistryBlockNumber_gt?: InputMaybe<Scalars['Int']>;
  addedToRegistryBlockNumber_gte?: InputMaybe<Scalars['Int']>;
  addedToRegistryBlockNumber_in?: InputMaybe<Array<Scalars['Int']>>;
  addedToRegistryBlockNumber_lt?: InputMaybe<Scalars['Int']>;
  addedToRegistryBlockNumber_lte?: InputMaybe<Scalars['Int']>;
  addedToRegistryBlockNumber_not?: InputMaybe<Scalars['Int']>;
  addedToRegistryBlockNumber_not_in?: InputMaybe<Array<Scalars['Int']>>;
  addedToRegistryTransactionHash?: InputMaybe<Scalars['Bytes']>;
  addedToRegistryTransactionHash_contains?: InputMaybe<Scalars['Bytes']>;
  addedToRegistryTransactionHash_in?: InputMaybe<Array<Scalars['Bytes']>>;
  addedToRegistryTransactionHash_not?: InputMaybe<Scalars['Bytes']>;
  addedToRegistryTransactionHash_not_contains?: InputMaybe<Scalars['Bytes']>;
  addedToRegistryTransactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  connectorTokens_?: InputMaybe<TokenSmartToken_Filter>;
  currentConverterRegistry?: InputMaybe<Scalars['String']>;
  currentConverterRegistry_?: InputMaybe<ConverterRegistry_Filter>;
  currentConverterRegistry_contains?: InputMaybe<Scalars['String']>;
  currentConverterRegistry_contains_nocase?: InputMaybe<Scalars['String']>;
  currentConverterRegistry_ends_with?: InputMaybe<Scalars['String']>;
  currentConverterRegistry_ends_with_nocase?: InputMaybe<Scalars['String']>;
  currentConverterRegistry_gt?: InputMaybe<Scalars['String']>;
  currentConverterRegistry_gte?: InputMaybe<Scalars['String']>;
  currentConverterRegistry_in?: InputMaybe<Array<Scalars['String']>>;
  currentConverterRegistry_lt?: InputMaybe<Scalars['String']>;
  currentConverterRegistry_lte?: InputMaybe<Scalars['String']>;
  currentConverterRegistry_not?: InputMaybe<Scalars['String']>;
  currentConverterRegistry_not_contains?: InputMaybe<Scalars['String']>;
  currentConverterRegistry_not_contains_nocase?: InputMaybe<Scalars['String']>;
  currentConverterRegistry_not_ends_with?: InputMaybe<Scalars['String']>;
  currentConverterRegistry_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  currentConverterRegistry_not_in?: InputMaybe<Array<Scalars['String']>>;
  currentConverterRegistry_not_starts_with?: InputMaybe<Scalars['String']>;
  currentConverterRegistry_not_starts_with_nocase?: InputMaybe<
    Scalars['String']
  >;
  currentConverterRegistry_starts_with?: InputMaybe<Scalars['String']>;
  currentConverterRegistry_starts_with_nocase?: InputMaybe<Scalars['String']>;
  decimals?: InputMaybe<Scalars['Int']>;
  decimals_gt?: InputMaybe<Scalars['Int']>;
  decimals_gte?: InputMaybe<Scalars['Int']>;
  decimals_in?: InputMaybe<Array<Scalars['Int']>>;
  decimals_lt?: InputMaybe<Scalars['Int']>;
  decimals_lte?: InputMaybe<Scalars['Int']>;
  decimals_not?: InputMaybe<Scalars['Int']>;
  decimals_not_in?: InputMaybe<Array<Scalars['Int']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  liquidityPool_?: InputMaybe<LiquidityPool_Filter>;
  name?: InputMaybe<Scalars['String']>;
  name_contains?: InputMaybe<Scalars['String']>;
  name_contains_nocase?: InputMaybe<Scalars['String']>;
  name_ends_with?: InputMaybe<Scalars['String']>;
  name_ends_with_nocase?: InputMaybe<Scalars['String']>;
  name_gt?: InputMaybe<Scalars['String']>;
  name_gte?: InputMaybe<Scalars['String']>;
  name_in?: InputMaybe<Array<Scalars['String']>>;
  name_lt?: InputMaybe<Scalars['String']>;
  name_lte?: InputMaybe<Scalars['String']>;
  name_not?: InputMaybe<Scalars['String']>;
  name_not_contains?: InputMaybe<Scalars['String']>;
  name_not_contains_nocase?: InputMaybe<Scalars['String']>;
  name_not_ends_with?: InputMaybe<Scalars['String']>;
  name_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  name_not_in?: InputMaybe<Array<Scalars['String']>>;
  name_not_starts_with?: InputMaybe<Scalars['String']>;
  name_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  name_starts_with?: InputMaybe<Scalars['String']>;
  name_starts_with_nocase?: InputMaybe<Scalars['String']>;
  owner?: InputMaybe<Scalars['String']>;
  owner_contains?: InputMaybe<Scalars['String']>;
  owner_contains_nocase?: InputMaybe<Scalars['String']>;
  owner_ends_with?: InputMaybe<Scalars['String']>;
  owner_ends_with_nocase?: InputMaybe<Scalars['String']>;
  owner_gt?: InputMaybe<Scalars['String']>;
  owner_gte?: InputMaybe<Scalars['String']>;
  owner_in?: InputMaybe<Array<Scalars['String']>>;
  owner_lt?: InputMaybe<Scalars['String']>;
  owner_lte?: InputMaybe<Scalars['String']>;
  owner_not?: InputMaybe<Scalars['String']>;
  owner_not_contains?: InputMaybe<Scalars['String']>;
  owner_not_contains_nocase?: InputMaybe<Scalars['String']>;
  owner_not_ends_with?: InputMaybe<Scalars['String']>;
  owner_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  owner_not_in?: InputMaybe<Array<Scalars['String']>>;
  owner_not_starts_with?: InputMaybe<Scalars['String']>;
  owner_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  owner_starts_with?: InputMaybe<Scalars['String']>;
  owner_starts_with_nocase?: InputMaybe<Scalars['String']>;
  smartTokenType?: InputMaybe<Scalars['String']>;
  smartTokenType_contains?: InputMaybe<Scalars['String']>;
  smartTokenType_contains_nocase?: InputMaybe<Scalars['String']>;
  smartTokenType_ends_with?: InputMaybe<Scalars['String']>;
  smartTokenType_ends_with_nocase?: InputMaybe<Scalars['String']>;
  smartTokenType_gt?: InputMaybe<Scalars['String']>;
  smartTokenType_gte?: InputMaybe<Scalars['String']>;
  smartTokenType_in?: InputMaybe<Array<Scalars['String']>>;
  smartTokenType_lt?: InputMaybe<Scalars['String']>;
  smartTokenType_lte?: InputMaybe<Scalars['String']>;
  smartTokenType_not?: InputMaybe<Scalars['String']>;
  smartTokenType_not_contains?: InputMaybe<Scalars['String']>;
  smartTokenType_not_contains_nocase?: InputMaybe<Scalars['String']>;
  smartTokenType_not_ends_with?: InputMaybe<Scalars['String']>;
  smartTokenType_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  smartTokenType_not_in?: InputMaybe<Array<Scalars['String']>>;
  smartTokenType_not_starts_with?: InputMaybe<Scalars['String']>;
  smartTokenType_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  smartTokenType_starts_with?: InputMaybe<Scalars['String']>;
  smartTokenType_starts_with_nocase?: InputMaybe<Scalars['String']>;
  symbol?: InputMaybe<Scalars['String']>;
  symbol_contains?: InputMaybe<Scalars['String']>;
  symbol_contains_nocase?: InputMaybe<Scalars['String']>;
  symbol_ends_with?: InputMaybe<Scalars['String']>;
  symbol_ends_with_nocase?: InputMaybe<Scalars['String']>;
  symbol_gt?: InputMaybe<Scalars['String']>;
  symbol_gte?: InputMaybe<Scalars['String']>;
  symbol_in?: InputMaybe<Array<Scalars['String']>>;
  symbol_lt?: InputMaybe<Scalars['String']>;
  symbol_lte?: InputMaybe<Scalars['String']>;
  symbol_not?: InputMaybe<Scalars['String']>;
  symbol_not_contains?: InputMaybe<Scalars['String']>;
  symbol_not_contains_nocase?: InputMaybe<Scalars['String']>;
  symbol_not_ends_with?: InputMaybe<Scalars['String']>;
  symbol_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  symbol_not_in?: InputMaybe<Array<Scalars['String']>>;
  symbol_not_starts_with?: InputMaybe<Scalars['String']>;
  symbol_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  symbol_starts_with?: InputMaybe<Scalars['String']>;
  symbol_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum SmartToken_OrderBy {
  AddedToRegistryBlockNumber = 'addedToRegistryBlockNumber',
  AddedToRegistryTransactionHash = 'addedToRegistryTransactionHash',
  ConnectorTokens = 'connectorTokens',
  CurrentConverterRegistry = 'currentConverterRegistry',
  Decimals = 'decimals',
  Id = 'id',
  LiquidityPool = 'liquidityPool',
  Name = 'name',
  Owner = 'owner',
  SmartTokenType = 'smartTokenType',
  Symbol = 'symbol',
}

export type Stake = {
  __typename?: 'Stake';
  amount?: Maybe<Scalars['BigDecimal']>;
  delegatedAmount: Scalars['BigDecimal'];
  id: Scalars['ID'];
  lockedUntil?: Maybe<Scalars['Int']>;
  user?: Maybe<User>;
  vestingAmount: Scalars['BigDecimal'];
};

export enum StakeHistoryAction {
  /**
   * When a user delegates voting power to another user. This can also be for voting power that the user has through a vesting contract.
   *
   */
  Delegate = 'Delegate',
  DelegateVested = 'DelegateVested',
  /**
   * When a user make an early unstake and the staked amount is slashed
   *
   */
  EarlyUnstakingPenalty = 'EarlyUnstakingPenalty',
  /**
   * Extending an existing stake. The amount of the stake remains the same, but the lockedUntil date increases.
   *
   */
  ExtendStake = 'ExtendStake',
  /**
   * When a user withdraws their share of the Protocol fees that is shared amongst stakers
   *
   */
  FeeWithdrawn = 'FeeWithdrawn',
  /**
   * Increasing the amount of an existing stake. The lockedUntil date of this stake remains the same, but amount increases.
   *
   */
  IncreaseStake = 'IncreaseStake',
  /**
   * Voluntarily staking SOV (ie not staked through a vesting contract)
   *
   */
  Stake = 'Stake',
  /**
   * Unstake is early unstaking, when a user withdraws staked SOV before the lockedUntil date and incurs a slashing penalty.
   *
   */
  Unstake = 'Unstake',
  /**
   * WithdrawStaked is when a user withdraws SOV from the staking contract after the unlock date, when the funds are no longer staked or locked
   *
   */
  WithdrawStaked = 'WithdrawStaked',
}

/**
 * This entity is the granular history of user actions related to voluntary staking
 *
 */
export type StakeHistoryItem = {
  __typename?: 'StakeHistoryItem';
  action: StakeHistoryAction;
  amount?: Maybe<Scalars['BigDecimal']>;
  delegatee?: Maybe<User>;
  emittedBy: Scalars['Bytes'];
  id: Scalars['ID'];
  lockedUntil?: Maybe<Scalars['Int']>;
  timestamp: Scalars['Int'];
  token?: Maybe<Scalars['String']>;
  transaction: Transaction;
  user: UserStakeHistory;
};

export type StakeHistoryItem_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  action?: InputMaybe<StakeHistoryAction>;
  action_in?: InputMaybe<Array<StakeHistoryAction>>;
  action_not?: InputMaybe<StakeHistoryAction>;
  action_not_in?: InputMaybe<Array<StakeHistoryAction>>;
  amount?: InputMaybe<Scalars['BigDecimal']>;
  amount_gt?: InputMaybe<Scalars['BigDecimal']>;
  amount_gte?: InputMaybe<Scalars['BigDecimal']>;
  amount_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  amount_lt?: InputMaybe<Scalars['BigDecimal']>;
  amount_lte?: InputMaybe<Scalars['BigDecimal']>;
  amount_not?: InputMaybe<Scalars['BigDecimal']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  delegatee?: InputMaybe<Scalars['String']>;
  delegatee_?: InputMaybe<User_Filter>;
  delegatee_contains?: InputMaybe<Scalars['String']>;
  delegatee_contains_nocase?: InputMaybe<Scalars['String']>;
  delegatee_ends_with?: InputMaybe<Scalars['String']>;
  delegatee_ends_with_nocase?: InputMaybe<Scalars['String']>;
  delegatee_gt?: InputMaybe<Scalars['String']>;
  delegatee_gte?: InputMaybe<Scalars['String']>;
  delegatee_in?: InputMaybe<Array<Scalars['String']>>;
  delegatee_lt?: InputMaybe<Scalars['String']>;
  delegatee_lte?: InputMaybe<Scalars['String']>;
  delegatee_not?: InputMaybe<Scalars['String']>;
  delegatee_not_contains?: InputMaybe<Scalars['String']>;
  delegatee_not_contains_nocase?: InputMaybe<Scalars['String']>;
  delegatee_not_ends_with?: InputMaybe<Scalars['String']>;
  delegatee_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  delegatee_not_in?: InputMaybe<Array<Scalars['String']>>;
  delegatee_not_starts_with?: InputMaybe<Scalars['String']>;
  delegatee_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  delegatee_starts_with?: InputMaybe<Scalars['String']>;
  delegatee_starts_with_nocase?: InputMaybe<Scalars['String']>;
  emittedBy?: InputMaybe<Scalars['Bytes']>;
  emittedBy_contains?: InputMaybe<Scalars['Bytes']>;
  emittedBy_in?: InputMaybe<Array<Scalars['Bytes']>>;
  emittedBy_not?: InputMaybe<Scalars['Bytes']>;
  emittedBy_not_contains?: InputMaybe<Scalars['Bytes']>;
  emittedBy_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  lockedUntil?: InputMaybe<Scalars['Int']>;
  lockedUntil_gt?: InputMaybe<Scalars['Int']>;
  lockedUntil_gte?: InputMaybe<Scalars['Int']>;
  lockedUntil_in?: InputMaybe<Array<Scalars['Int']>>;
  lockedUntil_lt?: InputMaybe<Scalars['Int']>;
  lockedUntil_lte?: InputMaybe<Scalars['Int']>;
  lockedUntil_not?: InputMaybe<Scalars['Int']>;
  lockedUntil_not_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp?: InputMaybe<Scalars['Int']>;
  timestamp_gt?: InputMaybe<Scalars['Int']>;
  timestamp_gte?: InputMaybe<Scalars['Int']>;
  timestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp_lt?: InputMaybe<Scalars['Int']>;
  timestamp_lte?: InputMaybe<Scalars['Int']>;
  timestamp_not?: InputMaybe<Scalars['Int']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
  token?: InputMaybe<Scalars['String']>;
  token_contains?: InputMaybe<Scalars['String']>;
  token_contains_nocase?: InputMaybe<Scalars['String']>;
  token_ends_with?: InputMaybe<Scalars['String']>;
  token_ends_with_nocase?: InputMaybe<Scalars['String']>;
  token_gt?: InputMaybe<Scalars['String']>;
  token_gte?: InputMaybe<Scalars['String']>;
  token_in?: InputMaybe<Array<Scalars['String']>>;
  token_lt?: InputMaybe<Scalars['String']>;
  token_lte?: InputMaybe<Scalars['String']>;
  token_not?: InputMaybe<Scalars['String']>;
  token_not_contains?: InputMaybe<Scalars['String']>;
  token_not_contains_nocase?: InputMaybe<Scalars['String']>;
  token_not_ends_with?: InputMaybe<Scalars['String']>;
  token_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  token_not_in?: InputMaybe<Array<Scalars['String']>>;
  token_not_starts_with?: InputMaybe<Scalars['String']>;
  token_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  token_starts_with?: InputMaybe<Scalars['String']>;
  token_starts_with_nocase?: InputMaybe<Scalars['String']>;
  transaction?: InputMaybe<Scalars['String']>;
  transaction_?: InputMaybe<Transaction_Filter>;
  transaction_contains?: InputMaybe<Scalars['String']>;
  transaction_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_gt?: InputMaybe<Scalars['String']>;
  transaction_gte?: InputMaybe<Scalars['String']>;
  transaction_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_lt?: InputMaybe<Scalars['String']>;
  transaction_lte?: InputMaybe<Scalars['String']>;
  transaction_not?: InputMaybe<Scalars['String']>;
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_not_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
  transaction_starts_with_nocase?: InputMaybe<Scalars['String']>;
  user?: InputMaybe<Scalars['String']>;
  user_?: InputMaybe<UserStakeHistory_Filter>;
  user_contains?: InputMaybe<Scalars['String']>;
  user_contains_nocase?: InputMaybe<Scalars['String']>;
  user_ends_with?: InputMaybe<Scalars['String']>;
  user_ends_with_nocase?: InputMaybe<Scalars['String']>;
  user_gt?: InputMaybe<Scalars['String']>;
  user_gte?: InputMaybe<Scalars['String']>;
  user_in?: InputMaybe<Array<Scalars['String']>>;
  user_lt?: InputMaybe<Scalars['String']>;
  user_lte?: InputMaybe<Scalars['String']>;
  user_not?: InputMaybe<Scalars['String']>;
  user_not_contains?: InputMaybe<Scalars['String']>;
  user_not_contains_nocase?: InputMaybe<Scalars['String']>;
  user_not_ends_with?: InputMaybe<Scalars['String']>;
  user_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  user_not_in?: InputMaybe<Array<Scalars['String']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']>;
  user_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  user_starts_with?: InputMaybe<Scalars['String']>;
  user_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum StakeHistoryItem_OrderBy {
  Action = 'action',
  Amount = 'amount',
  Delegatee = 'delegatee',
  EmittedBy = 'emittedBy',
  Id = 'id',
  LockedUntil = 'lockedUntil',
  Timestamp = 'timestamp',
  Token = 'token',
  Transaction = 'transaction',
  User = 'user',
}

export type Stake_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars['BigDecimal']>;
  amount_gt?: InputMaybe<Scalars['BigDecimal']>;
  amount_gte?: InputMaybe<Scalars['BigDecimal']>;
  amount_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  amount_lt?: InputMaybe<Scalars['BigDecimal']>;
  amount_lte?: InputMaybe<Scalars['BigDecimal']>;
  amount_not?: InputMaybe<Scalars['BigDecimal']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  delegatedAmount?: InputMaybe<Scalars['BigDecimal']>;
  delegatedAmount_gt?: InputMaybe<Scalars['BigDecimal']>;
  delegatedAmount_gte?: InputMaybe<Scalars['BigDecimal']>;
  delegatedAmount_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  delegatedAmount_lt?: InputMaybe<Scalars['BigDecimal']>;
  delegatedAmount_lte?: InputMaybe<Scalars['BigDecimal']>;
  delegatedAmount_not?: InputMaybe<Scalars['BigDecimal']>;
  delegatedAmount_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  lockedUntil?: InputMaybe<Scalars['Int']>;
  lockedUntil_gt?: InputMaybe<Scalars['Int']>;
  lockedUntil_gte?: InputMaybe<Scalars['Int']>;
  lockedUntil_in?: InputMaybe<Array<Scalars['Int']>>;
  lockedUntil_lt?: InputMaybe<Scalars['Int']>;
  lockedUntil_lte?: InputMaybe<Scalars['Int']>;
  lockedUntil_not?: InputMaybe<Scalars['Int']>;
  lockedUntil_not_in?: InputMaybe<Array<Scalars['Int']>>;
  user?: InputMaybe<Scalars['String']>;
  user_?: InputMaybe<User_Filter>;
  user_contains?: InputMaybe<Scalars['String']>;
  user_contains_nocase?: InputMaybe<Scalars['String']>;
  user_ends_with?: InputMaybe<Scalars['String']>;
  user_ends_with_nocase?: InputMaybe<Scalars['String']>;
  user_gt?: InputMaybe<Scalars['String']>;
  user_gte?: InputMaybe<Scalars['String']>;
  user_in?: InputMaybe<Array<Scalars['String']>>;
  user_lt?: InputMaybe<Scalars['String']>;
  user_lte?: InputMaybe<Scalars['String']>;
  user_not?: InputMaybe<Scalars['String']>;
  user_not_contains?: InputMaybe<Scalars['String']>;
  user_not_contains_nocase?: InputMaybe<Scalars['String']>;
  user_not_ends_with?: InputMaybe<Scalars['String']>;
  user_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  user_not_in?: InputMaybe<Array<Scalars['String']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']>;
  user_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  user_starts_with?: InputMaybe<Scalars['String']>;
  user_starts_with_nocase?: InputMaybe<Scalars['String']>;
  vestingAmount?: InputMaybe<Scalars['BigDecimal']>;
  vestingAmount_gt?: InputMaybe<Scalars['BigDecimal']>;
  vestingAmount_gte?: InputMaybe<Scalars['BigDecimal']>;
  vestingAmount_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  vestingAmount_lt?: InputMaybe<Scalars['BigDecimal']>;
  vestingAmount_lte?: InputMaybe<Scalars['BigDecimal']>;
  vestingAmount_not?: InputMaybe<Scalars['BigDecimal']>;
  vestingAmount_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
};

export enum Stake_OrderBy {
  Amount = 'amount',
  DelegatedAmount = 'delegatedAmount',
  Id = 'id',
  LockedUntil = 'lockedUntil',
  User = 'user',
  VestingAmount = 'vestingAmount',
}

export type Subscription = {
  __typename?: 'Subscription';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  bitcoinTransfer?: Maybe<BitcoinTransfer>;
  bitcoinTransferBatchSending?: Maybe<BitcoinTransferBatchSending>;
  bitcoinTransferBatchSendings: Array<BitcoinTransferBatchSending>;
  bitcoinTransfers: Array<BitcoinTransfer>;
  borrow?: Maybe<Borrow>;
  borrows: Array<Borrow>;
  bridge?: Maybe<Bridge>;
  bridges: Array<Bridge>;
  candleStickDay?: Maybe<CandleStickDay>;
  candleStickDays: Array<CandleStickDay>;
  candleStickFifteenMinute?: Maybe<CandleStickFifteenMinute>;
  candleStickFifteenMinutes: Array<CandleStickFifteenMinute>;
  candleStickFourHour?: Maybe<CandleStickFourHour>;
  candleStickFourHours: Array<CandleStickFourHour>;
  candleStickHour?: Maybe<CandleStickHour>;
  candleStickHours: Array<CandleStickHour>;
  candleStickMinute?: Maybe<CandleStickMinute>;
  candleStickMinutes: Array<CandleStickMinute>;
  closeWithDeposit?: Maybe<CloseWithDeposit>;
  closeWithDeposits: Array<CloseWithDeposit>;
  closeWithSwap?: Maybe<CloseWithSwap>;
  closeWithSwaps: Array<CloseWithSwap>;
  conversion?: Maybe<Conversion>;
  conversions: Array<Conversion>;
  converterRegistries: Array<ConverterRegistry>;
  converterRegistry?: Maybe<ConverterRegistry>;
  crossTransfer?: Maybe<CrossTransfer>;
  crossTransfers: Array<CrossTransfer>;
  debugItem?: Maybe<DebugItem>;
  debugItems: Array<DebugItem>;
  deposit?: Maybe<Deposit>;
  depositCollateral?: Maybe<DepositCollateral>;
  depositCollaterals: Array<DepositCollateral>;
  deposits: Array<Deposit>;
  fastBTCBridgeStat?: Maybe<FastBtcBridgeStat>;
  fastBTCBridgeStats: Array<FastBtcBridgeStat>;
  federation?: Maybe<Federation>;
  federations: Array<Federation>;
  feeSharingTokensTransferred?: Maybe<FeeSharingTokensTransferred>;
  feeSharingTokensTransferreds: Array<FeeSharingTokensTransferred>;
  governorContract?: Maybe<GovernorContract>;
  governorContracts: Array<GovernorContract>;
  icandleStick?: Maybe<ICandleStick>;
  icandleSticks: Array<ICandleStick>;
  lendingHistoryItem?: Maybe<LendingHistoryItem>;
  lendingHistoryItems: Array<LendingHistoryItem>;
  lendingPool?: Maybe<LendingPool>;
  lendingPools: Array<LendingPool>;
  liquidate?: Maybe<Liquidate>;
  liquidates: Array<Liquidate>;
  liquidityHistoryItem?: Maybe<LiquidityHistoryItem>;
  liquidityHistoryItems: Array<LiquidityHistoryItem>;
  liquidityMiningAllocationPoint?: Maybe<LiquidityMiningAllocationPoint>;
  liquidityMiningAllocationPoints: Array<LiquidityMiningAllocationPoint>;
  liquidityMiningGlobal?: Maybe<LiquidityMiningGlobal>;
  liquidityMiningGlobals: Array<LiquidityMiningGlobal>;
  liquidityPool?: Maybe<LiquidityPool>;
  liquidityPoolToken?: Maybe<LiquidityPoolToken>;
  liquidityPoolTokens: Array<LiquidityPoolToken>;
  liquidityPools: Array<LiquidityPool>;
  loan?: Maybe<Loan>;
  loanParamsSetup?: Maybe<LoanParamsSetup>;
  loanParamsSetups: Array<LoanParamsSetup>;
  loans: Array<Loan>;
  marginOrderCanceled?: Maybe<MarginOrderCanceled>;
  marginOrderCanceleds: Array<MarginOrderCanceled>;
  marginOrderFilled?: Maybe<MarginOrderFilled>;
  marginOrderFilleds: Array<MarginOrderFilled>;
  multisigConfirmation?: Maybe<MultisigConfirmation>;
  multisigConfirmations: Array<MultisigConfirmation>;
  multisigContract?: Maybe<MultisigContract>;
  multisigContracts: Array<MultisigContract>;
  multisigTransaction?: Maybe<MultisigTransaction>;
  multisigTransactions: Array<MultisigTransaction>;
  newBitcoinTransferIncoming?: Maybe<NewBitcoinTransferIncoming>;
  newBitcoinTransferIncomings: Array<NewBitcoinTransferIncoming>;
  orderCanceled?: Maybe<OrderCanceled>;
  orderCanceleds: Array<OrderCanceled>;
  orderCreated?: Maybe<OrderCreated>;
  orderCreateds: Array<OrderCreated>;
  orderFilled?: Maybe<OrderFilled>;
  orderFilleds: Array<OrderFilled>;
  payBorrowingFee?: Maybe<PayBorrowingFee>;
  payBorrowingFees: Array<PayBorrowingFee>;
  payInterestTransfer?: Maybe<PayInterestTransfer>;
  payInterestTransfers: Array<PayInterestTransfer>;
  payLendingFee?: Maybe<PayLendingFee>;
  payLendingFees: Array<PayLendingFee>;
  payTradingFee?: Maybe<PayTradingFee>;
  payTradingFees: Array<PayTradingFee>;
  poolToken?: Maybe<PoolToken>;
  poolTokens: Array<PoolToken>;
  poolVolumeItem?: Maybe<PoolVolumeItem>;
  poolVolumeItems: Array<PoolVolumeItem>;
  proposal?: Maybe<Proposal>;
  proposalStateChange?: Maybe<ProposalStateChange>;
  proposalStateChanges: Array<ProposalStateChange>;
  proposals: Array<Proposal>;
  protocolStats: Array<ProtocolStats>;
  protocolWithdrawFee?: Maybe<ProtocolWithdrawFee>;
  protocolWithdrawFees: Array<ProtocolWithdrawFee>;
  rewardsEarnedHistoryItem?: Maybe<RewardsEarnedHistoryItem>;
  rewardsEarnedHistoryItems: Array<RewardsEarnedHistoryItem>;
  rollover?: Maybe<Rollover>;
  rollovers: Array<Rollover>;
  sideToken?: Maybe<SideToken>;
  sideTokens: Array<SideToken>;
  smartToken?: Maybe<SmartToken>;
  smartTokens: Array<SmartToken>;
  stake?: Maybe<Stake>;
  stakeHistoryItem?: Maybe<StakeHistoryItem>;
  stakeHistoryItems: Array<StakeHistoryItem>;
  stakes: Array<Stake>;
  swap?: Maybe<Swap>;
  swapSetting?: Maybe<SwapSetting>;
  swapSettings: Array<SwapSetting>;
  swaps: Array<Swap>;
  token?: Maybe<Token>;
  tokenSmartToken?: Maybe<TokenSmartToken>;
  tokenSmartTokens: Array<TokenSmartToken>;
  tokens: Array<Token>;
  tokensStaked?: Maybe<TokensStaked>;
  tokensStakeds: Array<TokensStaked>;
  trade?: Maybe<Trade>;
  trades: Array<Trade>;
  transaction?: Maybe<Transaction>;
  transactions: Array<Transaction>;
  user?: Maybe<User>;
  userLendingHistories: Array<UserLendingHistory>;
  userLendingHistory?: Maybe<UserLendingHistory>;
  userLiquidityHistories: Array<UserLiquidityHistory>;
  userLiquidityHistory?: Maybe<UserLiquidityHistory>;
  userRewardsEarnedHistories: Array<UserRewardsEarnedHistory>;
  userRewardsEarnedHistory?: Maybe<UserRewardsEarnedHistory>;
  userStakeHistories: Array<UserStakeHistory>;
  userStakeHistory?: Maybe<UserStakeHistory>;
  userTotal?: Maybe<UserTotal>;
  userTotals: Array<UserTotal>;
  users: Array<User>;
  v2DelegateChanged?: Maybe<V2DelegateChanged>;
  v2DelegateChangeds: Array<V2DelegateChanged>;
  v2ExtendedStakingDuration?: Maybe<V2ExtendedStakingDuration>;
  v2ExtendedStakingDurations: Array<V2ExtendedStakingDuration>;
  v2Stake?: Maybe<V2Stake>;
  v2Stakes: Array<V2Stake>;
  v2StakingWithdrawn?: Maybe<V2StakingWithdrawn>;
  v2StakingWithdrawns: Array<V2StakingWithdrawn>;
  v2TokensStaked?: Maybe<V2TokensStaked>;
  v2TokensStakeds: Array<V2TokensStaked>;
  vestingContract?: Maybe<VestingContract>;
  vestingContracts: Array<VestingContract>;
  vestingHistoryItem?: Maybe<VestingHistoryItem>;
  vestingHistoryItems: Array<VestingHistoryItem>;
  voteCast?: Maybe<VoteCast>;
  voteCasts: Array<VoteCast>;
  withdrawal?: Maybe<Withdrawal>;
  withdrawals: Array<Withdrawal>;
};

export type Subscription_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};

export type SubscriptionBitcoinTransferArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionBitcoinTransferBatchSendingArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionBitcoinTransferBatchSendingsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<BitcoinTransferBatchSending_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<BitcoinTransferBatchSending_Filter>;
};

export type SubscriptionBitcoinTransfersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<BitcoinTransfer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<BitcoinTransfer_Filter>;
};

export type SubscriptionBorrowArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionBorrowsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Borrow_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Borrow_Filter>;
};

export type SubscriptionBridgeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionBridgesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Bridge_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Bridge_Filter>;
};

export type SubscriptionCandleStickDayArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionCandleStickDaysArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<CandleStickDay_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<CandleStickDay_Filter>;
};

export type SubscriptionCandleStickFifteenMinuteArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionCandleStickFifteenMinutesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<CandleStickFifteenMinute_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<CandleStickFifteenMinute_Filter>;
};

export type SubscriptionCandleStickFourHourArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionCandleStickFourHoursArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<CandleStickFourHour_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<CandleStickFourHour_Filter>;
};

export type SubscriptionCandleStickHourArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionCandleStickHoursArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<CandleStickHour_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<CandleStickHour_Filter>;
};

export type SubscriptionCandleStickMinuteArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionCandleStickMinutesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<CandleStickMinute_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<CandleStickMinute_Filter>;
};

export type SubscriptionCloseWithDepositArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionCloseWithDepositsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<CloseWithDeposit_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<CloseWithDeposit_Filter>;
};

export type SubscriptionCloseWithSwapArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionCloseWithSwapsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<CloseWithSwap_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<CloseWithSwap_Filter>;
};

export type SubscriptionConversionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionConversionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Conversion_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Conversion_Filter>;
};

export type SubscriptionConverterRegistriesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ConverterRegistry_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ConverterRegistry_Filter>;
};

export type SubscriptionConverterRegistryArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionCrossTransferArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionCrossTransfersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<CrossTransfer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<CrossTransfer_Filter>;
};

export type SubscriptionDebugItemArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionDebugItemsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<DebugItem_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<DebugItem_Filter>;
};

export type SubscriptionDepositArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionDepositCollateralArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionDepositCollateralsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<DepositCollateral_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<DepositCollateral_Filter>;
};

export type SubscriptionDepositsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Deposit_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Deposit_Filter>;
};

export type SubscriptionFastBtcBridgeStatArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionFastBtcBridgeStatsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<FastBtcBridgeStat_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<FastBtcBridgeStat_Filter>;
};

export type SubscriptionFederationArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionFederationsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Federation_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Federation_Filter>;
};

export type SubscriptionFeeSharingTokensTransferredArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionFeeSharingTokensTransferredsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<FeeSharingTokensTransferred_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<FeeSharingTokensTransferred_Filter>;
};

export type SubscriptionGovernorContractArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionGovernorContractsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<GovernorContract_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<GovernorContract_Filter>;
};

export type SubscriptionIcandleStickArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionIcandleSticksArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ICandleStick_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ICandleStick_Filter>;
};

export type SubscriptionLendingHistoryItemArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionLendingHistoryItemsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<LendingHistoryItem_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<LendingHistoryItem_Filter>;
};

export type SubscriptionLendingPoolArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionLendingPoolsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<LendingPool_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<LendingPool_Filter>;
};

export type SubscriptionLiquidateArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionLiquidatesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Liquidate_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Liquidate_Filter>;
};

export type SubscriptionLiquidityHistoryItemArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionLiquidityHistoryItemsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<LiquidityHistoryItem_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<LiquidityHistoryItem_Filter>;
};

export type SubscriptionLiquidityMiningAllocationPointArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionLiquidityMiningAllocationPointsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<LiquidityMiningAllocationPoint_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<LiquidityMiningAllocationPoint_Filter>;
};

export type SubscriptionLiquidityMiningGlobalArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionLiquidityMiningGlobalsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<LiquidityMiningGlobal_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<LiquidityMiningGlobal_Filter>;
};

export type SubscriptionLiquidityPoolArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionLiquidityPoolTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionLiquidityPoolTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<LiquidityPoolToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<LiquidityPoolToken_Filter>;
};

export type SubscriptionLiquidityPoolsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<LiquidityPool_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<LiquidityPool_Filter>;
};

export type SubscriptionLoanArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionLoanParamsSetupArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionLoanParamsSetupsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<LoanParamsSetup_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<LoanParamsSetup_Filter>;
};

export type SubscriptionLoansArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Loan_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Loan_Filter>;
};

export type SubscriptionMarginOrderCanceledArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionMarginOrderCanceledsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MarginOrderCanceled_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<MarginOrderCanceled_Filter>;
};

export type SubscriptionMarginOrderFilledArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionMarginOrderFilledsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MarginOrderFilled_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<MarginOrderFilled_Filter>;
};

export type SubscriptionMultisigConfirmationArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionMultisigConfirmationsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MultisigConfirmation_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<MultisigConfirmation_Filter>;
};

export type SubscriptionMultisigContractArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionMultisigContractsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MultisigContract_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<MultisigContract_Filter>;
};

export type SubscriptionMultisigTransactionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionMultisigTransactionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<MultisigTransaction_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<MultisigTransaction_Filter>;
};

export type SubscriptionNewBitcoinTransferIncomingArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionNewBitcoinTransferIncomingsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<NewBitcoinTransferIncoming_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<NewBitcoinTransferIncoming_Filter>;
};

export type SubscriptionOrderCanceledArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionOrderCanceledsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<OrderCanceled_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<OrderCanceled_Filter>;
};

export type SubscriptionOrderCreatedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionOrderCreatedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<OrderCreated_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<OrderCreated_Filter>;
};

export type SubscriptionOrderFilledArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionOrderFilledsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<OrderFilled_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<OrderFilled_Filter>;
};

export type SubscriptionPayBorrowingFeeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionPayBorrowingFeesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<PayBorrowingFee_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PayBorrowingFee_Filter>;
};

export type SubscriptionPayInterestTransferArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionPayInterestTransfersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<PayInterestTransfer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PayInterestTransfer_Filter>;
};

export type SubscriptionPayLendingFeeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionPayLendingFeesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<PayLendingFee_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PayLendingFee_Filter>;
};

export type SubscriptionPayTradingFeeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionPayTradingFeesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<PayTradingFee_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PayTradingFee_Filter>;
};

export type SubscriptionPoolTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionPoolTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<PoolToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PoolToken_Filter>;
};

export type SubscriptionPoolVolumeItemArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionPoolVolumeItemsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<PoolVolumeItem_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PoolVolumeItem_Filter>;
};

export type SubscriptionProposalArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionProposalStateChangeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionProposalStateChangesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ProposalStateChange_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ProposalStateChange_Filter>;
};

export type SubscriptionProposalsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Proposal_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Proposal_Filter>;
};

export type SubscriptionProtocolStatsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ProtocolStats_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ProtocolStats_Filter>;
};

export type SubscriptionProtocolWithdrawFeeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionProtocolWithdrawFeesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ProtocolWithdrawFee_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ProtocolWithdrawFee_Filter>;
};

export type SubscriptionRewardsEarnedHistoryItemArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionRewardsEarnedHistoryItemsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<RewardsEarnedHistoryItem_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<RewardsEarnedHistoryItem_Filter>;
};

export type SubscriptionRolloverArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionRolloversArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Rollover_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Rollover_Filter>;
};

export type SubscriptionSideTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionSideTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<SideToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<SideToken_Filter>;
};

export type SubscriptionSmartTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionSmartTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<SmartToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<SmartToken_Filter>;
};

export type SubscriptionStakeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionStakeHistoryItemArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionStakeHistoryItemsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<StakeHistoryItem_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<StakeHistoryItem_Filter>;
};

export type SubscriptionStakesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Stake_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Stake_Filter>;
};

export type SubscriptionSwapArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionSwapSettingArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionSwapSettingsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<SwapSetting_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<SwapSetting_Filter>;
};

export type SubscriptionSwapsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Swap_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Swap_Filter>;
};

export type SubscriptionTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionTokenSmartTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionTokenSmartTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TokenSmartToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TokenSmartToken_Filter>;
};

export type SubscriptionTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Token_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Token_Filter>;
};

export type SubscriptionTokensStakedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionTokensStakedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TokensStaked_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TokensStaked_Filter>;
};

export type SubscriptionTradeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionTradesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Trade_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Trade_Filter>;
};

export type SubscriptionTransactionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionTransactionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Transaction_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Transaction_Filter>;
};

export type SubscriptionUserArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionUserLendingHistoriesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UserLendingHistory_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<UserLendingHistory_Filter>;
};

export type SubscriptionUserLendingHistoryArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionUserLiquidityHistoriesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UserLiquidityHistory_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<UserLiquidityHistory_Filter>;
};

export type SubscriptionUserLiquidityHistoryArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionUserRewardsEarnedHistoriesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UserRewardsEarnedHistory_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<UserRewardsEarnedHistory_Filter>;
};

export type SubscriptionUserRewardsEarnedHistoryArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionUserStakeHistoriesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UserStakeHistory_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<UserStakeHistory_Filter>;
};

export type SubscriptionUserStakeHistoryArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionUserTotalArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionUserTotalsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UserTotal_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<UserTotal_Filter>;
};

export type SubscriptionUsersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<User_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<User_Filter>;
};

export type SubscriptionV2DelegateChangedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionV2DelegateChangedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<V2DelegateChanged_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<V2DelegateChanged_Filter>;
};

export type SubscriptionV2ExtendedStakingDurationArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionV2ExtendedStakingDurationsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<V2ExtendedStakingDuration_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<V2ExtendedStakingDuration_Filter>;
};

export type SubscriptionV2StakeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionV2StakesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<V2Stake_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<V2Stake_Filter>;
};

export type SubscriptionV2StakingWithdrawnArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionV2StakingWithdrawnsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<V2StakingWithdrawn_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<V2StakingWithdrawn_Filter>;
};

export type SubscriptionV2TokensStakedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionV2TokensStakedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<V2TokensStaked_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<V2TokensStaked_Filter>;
};

export type SubscriptionVestingContractArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionVestingContractsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<VestingContract_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<VestingContract_Filter>;
};

export type SubscriptionVestingHistoryItemArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionVestingHistoryItemsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<VestingHistoryItem_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<VestingHistoryItem_Filter>;
};

export type SubscriptionVoteCastArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionVoteCastsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<VoteCast_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<VoteCast_Filter>;
};

export type SubscriptionWithdrawalArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionWithdrawalsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Withdrawal_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Withdrawal_Filter>;
};

/**
 * The Swap entity is an aggregated entity of the individual Conversion events in a transaction.
 * For example, if a User swaps XUSD to SOV, there will be 2 Conversion events through 2 AMMs (XUSD-BTC and BTC-SOV) in one transaction. These two Conversions are aggregated here.
 *
 */
export type Swap = {
  __typename?: 'Swap';
  conversionFee?: Maybe<Scalars['BigDecimal']>;
  fromAmount: Scalars['BigDecimal'];
  /**
   * Token the user converted
   *
   */
  fromToken: Token;
  /**
   * Transaction hash of this swap
   *
   */
  id: Scalars['ID'];
  /**
   * Not in use - this property is always false. It is kept for backwards compatibility and will be deprecated
   *
   */
  isLimit: Scalars['Boolean'];
  /**
   * The number of AMM Conversions involved in this swap (this is primarily for debugging purposes)
   *
   */
  numConversions: Scalars['Int'];
  protocolFee?: Maybe<Scalars['BigDecimal']>;
  /**
   * Rate is calculated as toAmount / fromAmount
   *
   */
  rate: Scalars['BigDecimal'];
  swapType?: Maybe<SwapType>;
  timestamp: Scalars['Int'];
  toAmount: Scalars['BigDecimal'];
  /**
   * Token the user received
   *
   */
  toToken: Token;
  transaction: Transaction;
  /**
   * If this swap was initiated by a contract (for example as part of a Margin Trade), User will be null.
   * Otherwise, this is the user that initiated the transaction.
   *
   */
  user?: Maybe<User>;
};

export type SwapSetting = {
  __typename?: 'SwapSetting';
  id: Scalars['ID'];
  protocolFee: Scalars['Int'];
  timestamp: Scalars['Int'];
};

export type SwapSetting_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  protocolFee?: InputMaybe<Scalars['Int']>;
  protocolFee_gt?: InputMaybe<Scalars['Int']>;
  protocolFee_gte?: InputMaybe<Scalars['Int']>;
  protocolFee_in?: InputMaybe<Array<Scalars['Int']>>;
  protocolFee_lt?: InputMaybe<Scalars['Int']>;
  protocolFee_lte?: InputMaybe<Scalars['Int']>;
  protocolFee_not?: InputMaybe<Scalars['Int']>;
  protocolFee_not_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp?: InputMaybe<Scalars['Int']>;
  timestamp_gt?: InputMaybe<Scalars['Int']>;
  timestamp_gte?: InputMaybe<Scalars['Int']>;
  timestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp_lt?: InputMaybe<Scalars['Int']>;
  timestamp_lte?: InputMaybe<Scalars['Int']>;
  timestamp_not?: InputMaybe<Scalars['Int']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
};

export enum SwapSetting_OrderBy {
  Id = 'id',
  ProtocolFee = 'protocolFee',
  Timestamp = 'timestamp',
}

export enum SwapType {
  Limit = 'Limit',
  Market = 'Market',
  Other = 'Other',
}

export type Swap_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  conversionFee?: InputMaybe<Scalars['BigDecimal']>;
  conversionFee_gt?: InputMaybe<Scalars['BigDecimal']>;
  conversionFee_gte?: InputMaybe<Scalars['BigDecimal']>;
  conversionFee_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  conversionFee_lt?: InputMaybe<Scalars['BigDecimal']>;
  conversionFee_lte?: InputMaybe<Scalars['BigDecimal']>;
  conversionFee_not?: InputMaybe<Scalars['BigDecimal']>;
  conversionFee_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  fromAmount?: InputMaybe<Scalars['BigDecimal']>;
  fromAmount_gt?: InputMaybe<Scalars['BigDecimal']>;
  fromAmount_gte?: InputMaybe<Scalars['BigDecimal']>;
  fromAmount_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  fromAmount_lt?: InputMaybe<Scalars['BigDecimal']>;
  fromAmount_lte?: InputMaybe<Scalars['BigDecimal']>;
  fromAmount_not?: InputMaybe<Scalars['BigDecimal']>;
  fromAmount_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  fromToken?: InputMaybe<Scalars['String']>;
  fromToken_?: InputMaybe<Token_Filter>;
  fromToken_contains?: InputMaybe<Scalars['String']>;
  fromToken_contains_nocase?: InputMaybe<Scalars['String']>;
  fromToken_ends_with?: InputMaybe<Scalars['String']>;
  fromToken_ends_with_nocase?: InputMaybe<Scalars['String']>;
  fromToken_gt?: InputMaybe<Scalars['String']>;
  fromToken_gte?: InputMaybe<Scalars['String']>;
  fromToken_in?: InputMaybe<Array<Scalars['String']>>;
  fromToken_lt?: InputMaybe<Scalars['String']>;
  fromToken_lte?: InputMaybe<Scalars['String']>;
  fromToken_not?: InputMaybe<Scalars['String']>;
  fromToken_not_contains?: InputMaybe<Scalars['String']>;
  fromToken_not_contains_nocase?: InputMaybe<Scalars['String']>;
  fromToken_not_ends_with?: InputMaybe<Scalars['String']>;
  fromToken_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  fromToken_not_in?: InputMaybe<Array<Scalars['String']>>;
  fromToken_not_starts_with?: InputMaybe<Scalars['String']>;
  fromToken_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  fromToken_starts_with?: InputMaybe<Scalars['String']>;
  fromToken_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  isLimit?: InputMaybe<Scalars['Boolean']>;
  isLimit_in?: InputMaybe<Array<Scalars['Boolean']>>;
  isLimit_not?: InputMaybe<Scalars['Boolean']>;
  isLimit_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  numConversions?: InputMaybe<Scalars['Int']>;
  numConversions_gt?: InputMaybe<Scalars['Int']>;
  numConversions_gte?: InputMaybe<Scalars['Int']>;
  numConversions_in?: InputMaybe<Array<Scalars['Int']>>;
  numConversions_lt?: InputMaybe<Scalars['Int']>;
  numConversions_lte?: InputMaybe<Scalars['Int']>;
  numConversions_not?: InputMaybe<Scalars['Int']>;
  numConversions_not_in?: InputMaybe<Array<Scalars['Int']>>;
  protocolFee?: InputMaybe<Scalars['BigDecimal']>;
  protocolFee_gt?: InputMaybe<Scalars['BigDecimal']>;
  protocolFee_gte?: InputMaybe<Scalars['BigDecimal']>;
  protocolFee_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  protocolFee_lt?: InputMaybe<Scalars['BigDecimal']>;
  protocolFee_lte?: InputMaybe<Scalars['BigDecimal']>;
  protocolFee_not?: InputMaybe<Scalars['BigDecimal']>;
  protocolFee_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  rate?: InputMaybe<Scalars['BigDecimal']>;
  rate_gt?: InputMaybe<Scalars['BigDecimal']>;
  rate_gte?: InputMaybe<Scalars['BigDecimal']>;
  rate_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  rate_lt?: InputMaybe<Scalars['BigDecimal']>;
  rate_lte?: InputMaybe<Scalars['BigDecimal']>;
  rate_not?: InputMaybe<Scalars['BigDecimal']>;
  rate_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  swapType?: InputMaybe<SwapType>;
  swapType_in?: InputMaybe<Array<SwapType>>;
  swapType_not?: InputMaybe<SwapType>;
  swapType_not_in?: InputMaybe<Array<SwapType>>;
  timestamp?: InputMaybe<Scalars['Int']>;
  timestamp_gt?: InputMaybe<Scalars['Int']>;
  timestamp_gte?: InputMaybe<Scalars['Int']>;
  timestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp_lt?: InputMaybe<Scalars['Int']>;
  timestamp_lte?: InputMaybe<Scalars['Int']>;
  timestamp_not?: InputMaybe<Scalars['Int']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
  toAmount?: InputMaybe<Scalars['BigDecimal']>;
  toAmount_gt?: InputMaybe<Scalars['BigDecimal']>;
  toAmount_gte?: InputMaybe<Scalars['BigDecimal']>;
  toAmount_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  toAmount_lt?: InputMaybe<Scalars['BigDecimal']>;
  toAmount_lte?: InputMaybe<Scalars['BigDecimal']>;
  toAmount_not?: InputMaybe<Scalars['BigDecimal']>;
  toAmount_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  toToken?: InputMaybe<Scalars['String']>;
  toToken_?: InputMaybe<Token_Filter>;
  toToken_contains?: InputMaybe<Scalars['String']>;
  toToken_contains_nocase?: InputMaybe<Scalars['String']>;
  toToken_ends_with?: InputMaybe<Scalars['String']>;
  toToken_ends_with_nocase?: InputMaybe<Scalars['String']>;
  toToken_gt?: InputMaybe<Scalars['String']>;
  toToken_gte?: InputMaybe<Scalars['String']>;
  toToken_in?: InputMaybe<Array<Scalars['String']>>;
  toToken_lt?: InputMaybe<Scalars['String']>;
  toToken_lte?: InputMaybe<Scalars['String']>;
  toToken_not?: InputMaybe<Scalars['String']>;
  toToken_not_contains?: InputMaybe<Scalars['String']>;
  toToken_not_contains_nocase?: InputMaybe<Scalars['String']>;
  toToken_not_ends_with?: InputMaybe<Scalars['String']>;
  toToken_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  toToken_not_in?: InputMaybe<Array<Scalars['String']>>;
  toToken_not_starts_with?: InputMaybe<Scalars['String']>;
  toToken_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  toToken_starts_with?: InputMaybe<Scalars['String']>;
  toToken_starts_with_nocase?: InputMaybe<Scalars['String']>;
  transaction?: InputMaybe<Scalars['String']>;
  transaction_?: InputMaybe<Transaction_Filter>;
  transaction_contains?: InputMaybe<Scalars['String']>;
  transaction_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_gt?: InputMaybe<Scalars['String']>;
  transaction_gte?: InputMaybe<Scalars['String']>;
  transaction_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_lt?: InputMaybe<Scalars['String']>;
  transaction_lte?: InputMaybe<Scalars['String']>;
  transaction_not?: InputMaybe<Scalars['String']>;
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_not_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
  transaction_starts_with_nocase?: InputMaybe<Scalars['String']>;
  user?: InputMaybe<Scalars['String']>;
  user_?: InputMaybe<User_Filter>;
  user_contains?: InputMaybe<Scalars['String']>;
  user_contains_nocase?: InputMaybe<Scalars['String']>;
  user_ends_with?: InputMaybe<Scalars['String']>;
  user_ends_with_nocase?: InputMaybe<Scalars['String']>;
  user_gt?: InputMaybe<Scalars['String']>;
  user_gte?: InputMaybe<Scalars['String']>;
  user_in?: InputMaybe<Array<Scalars['String']>>;
  user_lt?: InputMaybe<Scalars['String']>;
  user_lte?: InputMaybe<Scalars['String']>;
  user_not?: InputMaybe<Scalars['String']>;
  user_not_contains?: InputMaybe<Scalars['String']>;
  user_not_contains_nocase?: InputMaybe<Scalars['String']>;
  user_not_ends_with?: InputMaybe<Scalars['String']>;
  user_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  user_not_in?: InputMaybe<Array<Scalars['String']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']>;
  user_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  user_starts_with?: InputMaybe<Scalars['String']>;
  user_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum Swap_OrderBy {
  ConversionFee = 'conversionFee',
  FromAmount = 'fromAmount',
  FromToken = 'fromToken',
  Id = 'id',
  IsLimit = 'isLimit',
  NumConversions = 'numConversions',
  ProtocolFee = 'protocolFee',
  Rate = 'rate',
  SwapType = 'swapType',
  Timestamp = 'timestamp',
  ToAmount = 'toAmount',
  ToToken = 'toToken',
  Transaction = 'transaction',
  User = 'user',
}

/**
 * This entity represents an ERC20 token traded on the Sovryn Protocol
 *
 */
export type Token = {
  __typename?: 'Token';
  /**
   * The total volume of this token that has been traded through the protocol quoted in BTC
   *
   */
  btcVolume: Scalars['BigDecimal'];
  /**
   * CrossTransfers: cross transfers list (currently only relevant to SOV)
   *
   */
  crossTransfers?: Maybe<Array<CrossTransfer>>;
  currentConverterRegistry?: Maybe<ConverterRegistry>;
  /**
   * Number of decimal places used in the smart contract for this token
   *
   */
  decimals?: Maybe<Scalars['Int']>;
  /**
   * Does this token have an AMM pool with rBTC as the other reserve asset?
   *
   */
  hasBtcPool?: Maybe<Scalars['Boolean']>;
  /**
   * Does this token have an AMM pool with the protocol stablecoin as the other reserve asset?
   *
   */
  hasStablecoinPool?: Maybe<Scalars['Boolean']>;
  /**
   * The ID is the contract address of the token on RSK
   *
   */
  id: Scalars['ID'];
  /**
   * lastPriceBtc is the last traded price of this token in BTC
   *
   */
  lastPriceBtc: Scalars['BigDecimal'];
  /**
   * lastPriceUsd is the last traded price of this token in USD
   *
   */
  lastPriceUsd: Scalars['BigDecimal'];
  /**
   * The addresses of the LiquidityPools where this token is a reserve asset
   *
   */
  liquidityPools?: Maybe<Array<LiquidityPoolToken>>;
  name?: Maybe<Scalars['String']>;
  /**
   * Internal use only - previous BTC price used for candleSticks
   *
   */
  prevPriceBtc: Scalars['BigDecimal'];
  /**
   * Internal use only - previous BTC price used for candleSticks
   *
   */
  prevPriceUsd: Scalars['BigDecimal'];
  /**
   * The smart tokens that have this token as an underlying asset
   *
   */
  smartTokens?: Maybe<Array<TokenSmartToken>>;
  symbol?: Maybe<Scalars['String']>;
  /**
   * The total volume of this token that has been traded through the protocol
   *
   */
  tokenVolume: Scalars['BigDecimal'];
  /**
   * The total volume of this token that has been traded through the protocol quoted in USD
   *
   */
  usdVolume: Scalars['BigDecimal'];
  version?: Maybe<Scalars['Int']>;
};

/**
 * This entity represents an ERC20 token traded on the Sovryn Protocol
 *
 */
export type TokenCrossTransfersArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<CrossTransfer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<CrossTransfer_Filter>;
};

/**
 * This entity represents an ERC20 token traded on the Sovryn Protocol
 *
 */
export type TokenLiquidityPoolsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<LiquidityPoolToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<LiquidityPoolToken_Filter>;
};

/**
 * This entity represents an ERC20 token traded on the Sovryn Protocol
 *
 */
export type TokenSmartTokensArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TokenSmartToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<TokenSmartToken_Filter>;
};

/**
 * This entity is to store a many-to-many relationship between tokens and smart tokens
 *
 */
export type TokenSmartToken = {
  __typename?: 'TokenSmartToken';
  /**
   * ID is token address + smart token address
   *
   */
  id: Scalars['ID'];
  smartToken: SmartToken;
  /**
   * token is the underlying asset represented by the smartToken
   *
   */
  token: Token;
};

export type TokenSmartToken_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  smartToken?: InputMaybe<Scalars['String']>;
  smartToken_?: InputMaybe<SmartToken_Filter>;
  smartToken_contains?: InputMaybe<Scalars['String']>;
  smartToken_contains_nocase?: InputMaybe<Scalars['String']>;
  smartToken_ends_with?: InputMaybe<Scalars['String']>;
  smartToken_ends_with_nocase?: InputMaybe<Scalars['String']>;
  smartToken_gt?: InputMaybe<Scalars['String']>;
  smartToken_gte?: InputMaybe<Scalars['String']>;
  smartToken_in?: InputMaybe<Array<Scalars['String']>>;
  smartToken_lt?: InputMaybe<Scalars['String']>;
  smartToken_lte?: InputMaybe<Scalars['String']>;
  smartToken_not?: InputMaybe<Scalars['String']>;
  smartToken_not_contains?: InputMaybe<Scalars['String']>;
  smartToken_not_contains_nocase?: InputMaybe<Scalars['String']>;
  smartToken_not_ends_with?: InputMaybe<Scalars['String']>;
  smartToken_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  smartToken_not_in?: InputMaybe<Array<Scalars['String']>>;
  smartToken_not_starts_with?: InputMaybe<Scalars['String']>;
  smartToken_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  smartToken_starts_with?: InputMaybe<Scalars['String']>;
  smartToken_starts_with_nocase?: InputMaybe<Scalars['String']>;
  token?: InputMaybe<Scalars['String']>;
  token_?: InputMaybe<Token_Filter>;
  token_contains?: InputMaybe<Scalars['String']>;
  token_contains_nocase?: InputMaybe<Scalars['String']>;
  token_ends_with?: InputMaybe<Scalars['String']>;
  token_ends_with_nocase?: InputMaybe<Scalars['String']>;
  token_gt?: InputMaybe<Scalars['String']>;
  token_gte?: InputMaybe<Scalars['String']>;
  token_in?: InputMaybe<Array<Scalars['String']>>;
  token_lt?: InputMaybe<Scalars['String']>;
  token_lte?: InputMaybe<Scalars['String']>;
  token_not?: InputMaybe<Scalars['String']>;
  token_not_contains?: InputMaybe<Scalars['String']>;
  token_not_contains_nocase?: InputMaybe<Scalars['String']>;
  token_not_ends_with?: InputMaybe<Scalars['String']>;
  token_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  token_not_in?: InputMaybe<Array<Scalars['String']>>;
  token_not_starts_with?: InputMaybe<Scalars['String']>;
  token_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  token_starts_with?: InputMaybe<Scalars['String']>;
  token_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum TokenSmartToken_OrderBy {
  Id = 'id',
  SmartToken = 'smartToken',
  Token = 'token',
}

export type Token_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  btcVolume?: InputMaybe<Scalars['BigDecimal']>;
  btcVolume_gt?: InputMaybe<Scalars['BigDecimal']>;
  btcVolume_gte?: InputMaybe<Scalars['BigDecimal']>;
  btcVolume_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  btcVolume_lt?: InputMaybe<Scalars['BigDecimal']>;
  btcVolume_lte?: InputMaybe<Scalars['BigDecimal']>;
  btcVolume_not?: InputMaybe<Scalars['BigDecimal']>;
  btcVolume_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  crossTransfers_?: InputMaybe<CrossTransfer_Filter>;
  currentConverterRegistry?: InputMaybe<Scalars['String']>;
  currentConverterRegistry_?: InputMaybe<ConverterRegistry_Filter>;
  currentConverterRegistry_contains?: InputMaybe<Scalars['String']>;
  currentConverterRegistry_contains_nocase?: InputMaybe<Scalars['String']>;
  currentConverterRegistry_ends_with?: InputMaybe<Scalars['String']>;
  currentConverterRegistry_ends_with_nocase?: InputMaybe<Scalars['String']>;
  currentConverterRegistry_gt?: InputMaybe<Scalars['String']>;
  currentConverterRegistry_gte?: InputMaybe<Scalars['String']>;
  currentConverterRegistry_in?: InputMaybe<Array<Scalars['String']>>;
  currentConverterRegistry_lt?: InputMaybe<Scalars['String']>;
  currentConverterRegistry_lte?: InputMaybe<Scalars['String']>;
  currentConverterRegistry_not?: InputMaybe<Scalars['String']>;
  currentConverterRegistry_not_contains?: InputMaybe<Scalars['String']>;
  currentConverterRegistry_not_contains_nocase?: InputMaybe<Scalars['String']>;
  currentConverterRegistry_not_ends_with?: InputMaybe<Scalars['String']>;
  currentConverterRegistry_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  currentConverterRegistry_not_in?: InputMaybe<Array<Scalars['String']>>;
  currentConverterRegistry_not_starts_with?: InputMaybe<Scalars['String']>;
  currentConverterRegistry_not_starts_with_nocase?: InputMaybe<
    Scalars['String']
  >;
  currentConverterRegistry_starts_with?: InputMaybe<Scalars['String']>;
  currentConverterRegistry_starts_with_nocase?: InputMaybe<Scalars['String']>;
  decimals?: InputMaybe<Scalars['Int']>;
  decimals_gt?: InputMaybe<Scalars['Int']>;
  decimals_gte?: InputMaybe<Scalars['Int']>;
  decimals_in?: InputMaybe<Array<Scalars['Int']>>;
  decimals_lt?: InputMaybe<Scalars['Int']>;
  decimals_lte?: InputMaybe<Scalars['Int']>;
  decimals_not?: InputMaybe<Scalars['Int']>;
  decimals_not_in?: InputMaybe<Array<Scalars['Int']>>;
  hasBtcPool?: InputMaybe<Scalars['Boolean']>;
  hasBtcPool_in?: InputMaybe<Array<Scalars['Boolean']>>;
  hasBtcPool_not?: InputMaybe<Scalars['Boolean']>;
  hasBtcPool_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  hasStablecoinPool?: InputMaybe<Scalars['Boolean']>;
  hasStablecoinPool_in?: InputMaybe<Array<Scalars['Boolean']>>;
  hasStablecoinPool_not?: InputMaybe<Scalars['Boolean']>;
  hasStablecoinPool_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  lastPriceBtc?: InputMaybe<Scalars['BigDecimal']>;
  lastPriceBtc_gt?: InputMaybe<Scalars['BigDecimal']>;
  lastPriceBtc_gte?: InputMaybe<Scalars['BigDecimal']>;
  lastPriceBtc_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  lastPriceBtc_lt?: InputMaybe<Scalars['BigDecimal']>;
  lastPriceBtc_lte?: InputMaybe<Scalars['BigDecimal']>;
  lastPriceBtc_not?: InputMaybe<Scalars['BigDecimal']>;
  lastPriceBtc_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  lastPriceUsd?: InputMaybe<Scalars['BigDecimal']>;
  lastPriceUsd_gt?: InputMaybe<Scalars['BigDecimal']>;
  lastPriceUsd_gte?: InputMaybe<Scalars['BigDecimal']>;
  lastPriceUsd_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  lastPriceUsd_lt?: InputMaybe<Scalars['BigDecimal']>;
  lastPriceUsd_lte?: InputMaybe<Scalars['BigDecimal']>;
  lastPriceUsd_not?: InputMaybe<Scalars['BigDecimal']>;
  lastPriceUsd_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  liquidityPools_?: InputMaybe<LiquidityPoolToken_Filter>;
  name?: InputMaybe<Scalars['String']>;
  name_contains?: InputMaybe<Scalars['String']>;
  name_contains_nocase?: InputMaybe<Scalars['String']>;
  name_ends_with?: InputMaybe<Scalars['String']>;
  name_ends_with_nocase?: InputMaybe<Scalars['String']>;
  name_gt?: InputMaybe<Scalars['String']>;
  name_gte?: InputMaybe<Scalars['String']>;
  name_in?: InputMaybe<Array<Scalars['String']>>;
  name_lt?: InputMaybe<Scalars['String']>;
  name_lte?: InputMaybe<Scalars['String']>;
  name_not?: InputMaybe<Scalars['String']>;
  name_not_contains?: InputMaybe<Scalars['String']>;
  name_not_contains_nocase?: InputMaybe<Scalars['String']>;
  name_not_ends_with?: InputMaybe<Scalars['String']>;
  name_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  name_not_in?: InputMaybe<Array<Scalars['String']>>;
  name_not_starts_with?: InputMaybe<Scalars['String']>;
  name_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  name_starts_with?: InputMaybe<Scalars['String']>;
  name_starts_with_nocase?: InputMaybe<Scalars['String']>;
  prevPriceBtc?: InputMaybe<Scalars['BigDecimal']>;
  prevPriceBtc_gt?: InputMaybe<Scalars['BigDecimal']>;
  prevPriceBtc_gte?: InputMaybe<Scalars['BigDecimal']>;
  prevPriceBtc_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  prevPriceBtc_lt?: InputMaybe<Scalars['BigDecimal']>;
  prevPriceBtc_lte?: InputMaybe<Scalars['BigDecimal']>;
  prevPriceBtc_not?: InputMaybe<Scalars['BigDecimal']>;
  prevPriceBtc_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  prevPriceUsd?: InputMaybe<Scalars['BigDecimal']>;
  prevPriceUsd_gt?: InputMaybe<Scalars['BigDecimal']>;
  prevPriceUsd_gte?: InputMaybe<Scalars['BigDecimal']>;
  prevPriceUsd_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  prevPriceUsd_lt?: InputMaybe<Scalars['BigDecimal']>;
  prevPriceUsd_lte?: InputMaybe<Scalars['BigDecimal']>;
  prevPriceUsd_not?: InputMaybe<Scalars['BigDecimal']>;
  prevPriceUsd_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  smartTokens_?: InputMaybe<TokenSmartToken_Filter>;
  symbol?: InputMaybe<Scalars['String']>;
  symbol_contains?: InputMaybe<Scalars['String']>;
  symbol_contains_nocase?: InputMaybe<Scalars['String']>;
  symbol_ends_with?: InputMaybe<Scalars['String']>;
  symbol_ends_with_nocase?: InputMaybe<Scalars['String']>;
  symbol_gt?: InputMaybe<Scalars['String']>;
  symbol_gte?: InputMaybe<Scalars['String']>;
  symbol_in?: InputMaybe<Array<Scalars['String']>>;
  symbol_lt?: InputMaybe<Scalars['String']>;
  symbol_lte?: InputMaybe<Scalars['String']>;
  symbol_not?: InputMaybe<Scalars['String']>;
  symbol_not_contains?: InputMaybe<Scalars['String']>;
  symbol_not_contains_nocase?: InputMaybe<Scalars['String']>;
  symbol_not_ends_with?: InputMaybe<Scalars['String']>;
  symbol_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  symbol_not_in?: InputMaybe<Array<Scalars['String']>>;
  symbol_not_starts_with?: InputMaybe<Scalars['String']>;
  symbol_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  symbol_starts_with?: InputMaybe<Scalars['String']>;
  symbol_starts_with_nocase?: InputMaybe<Scalars['String']>;
  tokenVolume?: InputMaybe<Scalars['BigDecimal']>;
  tokenVolume_gt?: InputMaybe<Scalars['BigDecimal']>;
  tokenVolume_gte?: InputMaybe<Scalars['BigDecimal']>;
  tokenVolume_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  tokenVolume_lt?: InputMaybe<Scalars['BigDecimal']>;
  tokenVolume_lte?: InputMaybe<Scalars['BigDecimal']>;
  tokenVolume_not?: InputMaybe<Scalars['BigDecimal']>;
  tokenVolume_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  usdVolume?: InputMaybe<Scalars['BigDecimal']>;
  usdVolume_gt?: InputMaybe<Scalars['BigDecimal']>;
  usdVolume_gte?: InputMaybe<Scalars['BigDecimal']>;
  usdVolume_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  usdVolume_lt?: InputMaybe<Scalars['BigDecimal']>;
  usdVolume_lte?: InputMaybe<Scalars['BigDecimal']>;
  usdVolume_not?: InputMaybe<Scalars['BigDecimal']>;
  usdVolume_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  version?: InputMaybe<Scalars['Int']>;
  version_gt?: InputMaybe<Scalars['Int']>;
  version_gte?: InputMaybe<Scalars['Int']>;
  version_in?: InputMaybe<Array<Scalars['Int']>>;
  version_lt?: InputMaybe<Scalars['Int']>;
  version_lte?: InputMaybe<Scalars['Int']>;
  version_not?: InputMaybe<Scalars['Int']>;
  version_not_in?: InputMaybe<Array<Scalars['Int']>>;
};

export enum Token_OrderBy {
  BtcVolume = 'btcVolume',
  CrossTransfers = 'crossTransfers',
  CurrentConverterRegistry = 'currentConverterRegistry',
  Decimals = 'decimals',
  HasBtcPool = 'hasBtcPool',
  HasStablecoinPool = 'hasStablecoinPool',
  Id = 'id',
  LastPriceBtc = 'lastPriceBtc',
  LastPriceUsd = 'lastPriceUsd',
  LiquidityPools = 'liquidityPools',
  Name = 'name',
  PrevPriceBtc = 'prevPriceBtc',
  PrevPriceUsd = 'prevPriceUsd',
  SmartTokens = 'smartTokens',
  Symbol = 'symbol',
  TokenVolume = 'tokenVolume',
  UsdVolume = 'usdVolume',
  Version = 'version',
}

/**
 * This is an event emitted from the staking contract when tokens are staked, either by a user or by a vesting contract
 * If tokens are staked by a vesting contract, there may be multiple tokens staked event per transaction (eg if tokensa are vested over 10 months, there would be 10 TokensStaked events each with a different lockedUntil date)
 * We have improvements planned to better represent staking on our subgraph.
 *
 */
export type TokensStaked = {
  __typename?: 'TokensStaked';
  /**
   * The amount of SOV staked in this event (as mentioned above, there can be multiple TokensStaked events per transaction)
   *
   */
  amount: Scalars['BigDecimal'];
  emittedBy: Scalars['Bytes'];
  /**
   * ID is transaction hash + log index
   *
   */
  id: Scalars['ID'];
  /**
   * If this is false, the tokens were staked by a vesting contract, and not voluntarily by a user
   *
   */
  isUserStaked: Scalars['Boolean'];
  /**
   * The date when these tokens will unlock
   * A user/vesting contract can have multiple stakes with different lockedUntil dates
   *
   */
  lockedUntil: Scalars['Int'];
  /**
   * The staker is either a user address or a vesting contract address
   *
   */
  staker: Scalars['Bytes'];
  timestamp: Scalars['Int'];
  /**
   * The total amount staked for this specific user until this specific lockedUntil date
   *
   */
  totalStaked: Scalars['BigDecimal'];
  transaction: Transaction;
  /**
   * If tokens were staked by a vesting contract, user property will be null
   *
   */
  user?: Maybe<User>;
};

export type TokensStaked_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars['BigDecimal']>;
  amount_gt?: InputMaybe<Scalars['BigDecimal']>;
  amount_gte?: InputMaybe<Scalars['BigDecimal']>;
  amount_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  amount_lt?: InputMaybe<Scalars['BigDecimal']>;
  amount_lte?: InputMaybe<Scalars['BigDecimal']>;
  amount_not?: InputMaybe<Scalars['BigDecimal']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  emittedBy?: InputMaybe<Scalars['Bytes']>;
  emittedBy_contains?: InputMaybe<Scalars['Bytes']>;
  emittedBy_in?: InputMaybe<Array<Scalars['Bytes']>>;
  emittedBy_not?: InputMaybe<Scalars['Bytes']>;
  emittedBy_not_contains?: InputMaybe<Scalars['Bytes']>;
  emittedBy_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  isUserStaked?: InputMaybe<Scalars['Boolean']>;
  isUserStaked_in?: InputMaybe<Array<Scalars['Boolean']>>;
  isUserStaked_not?: InputMaybe<Scalars['Boolean']>;
  isUserStaked_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  lockedUntil?: InputMaybe<Scalars['Int']>;
  lockedUntil_gt?: InputMaybe<Scalars['Int']>;
  lockedUntil_gte?: InputMaybe<Scalars['Int']>;
  lockedUntil_in?: InputMaybe<Array<Scalars['Int']>>;
  lockedUntil_lt?: InputMaybe<Scalars['Int']>;
  lockedUntil_lte?: InputMaybe<Scalars['Int']>;
  lockedUntil_not?: InputMaybe<Scalars['Int']>;
  lockedUntil_not_in?: InputMaybe<Array<Scalars['Int']>>;
  staker?: InputMaybe<Scalars['Bytes']>;
  staker_contains?: InputMaybe<Scalars['Bytes']>;
  staker_in?: InputMaybe<Array<Scalars['Bytes']>>;
  staker_not?: InputMaybe<Scalars['Bytes']>;
  staker_not_contains?: InputMaybe<Scalars['Bytes']>;
  staker_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  timestamp?: InputMaybe<Scalars['Int']>;
  timestamp_gt?: InputMaybe<Scalars['Int']>;
  timestamp_gte?: InputMaybe<Scalars['Int']>;
  timestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp_lt?: InputMaybe<Scalars['Int']>;
  timestamp_lte?: InputMaybe<Scalars['Int']>;
  timestamp_not?: InputMaybe<Scalars['Int']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
  totalStaked?: InputMaybe<Scalars['BigDecimal']>;
  totalStaked_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalStaked_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalStaked_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalStaked_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalStaked_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalStaked_not?: InputMaybe<Scalars['BigDecimal']>;
  totalStaked_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  transaction?: InputMaybe<Scalars['String']>;
  transaction_?: InputMaybe<Transaction_Filter>;
  transaction_contains?: InputMaybe<Scalars['String']>;
  transaction_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_gt?: InputMaybe<Scalars['String']>;
  transaction_gte?: InputMaybe<Scalars['String']>;
  transaction_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_lt?: InputMaybe<Scalars['String']>;
  transaction_lte?: InputMaybe<Scalars['String']>;
  transaction_not?: InputMaybe<Scalars['String']>;
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_not_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
  transaction_starts_with_nocase?: InputMaybe<Scalars['String']>;
  user?: InputMaybe<Scalars['String']>;
  user_?: InputMaybe<User_Filter>;
  user_contains?: InputMaybe<Scalars['String']>;
  user_contains_nocase?: InputMaybe<Scalars['String']>;
  user_ends_with?: InputMaybe<Scalars['String']>;
  user_ends_with_nocase?: InputMaybe<Scalars['String']>;
  user_gt?: InputMaybe<Scalars['String']>;
  user_gte?: InputMaybe<Scalars['String']>;
  user_in?: InputMaybe<Array<Scalars['String']>>;
  user_lt?: InputMaybe<Scalars['String']>;
  user_lte?: InputMaybe<Scalars['String']>;
  user_not?: InputMaybe<Scalars['String']>;
  user_not_contains?: InputMaybe<Scalars['String']>;
  user_not_contains_nocase?: InputMaybe<Scalars['String']>;
  user_not_ends_with?: InputMaybe<Scalars['String']>;
  user_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  user_not_in?: InputMaybe<Array<Scalars['String']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']>;
  user_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  user_starts_with?: InputMaybe<Scalars['String']>;
  user_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum TokensStaked_OrderBy {
  Amount = 'amount',
  EmittedBy = 'emittedBy',
  Id = 'id',
  IsUserStaked = 'isUserStaked',
  LockedUntil = 'lockedUntil',
  Staker = 'staker',
  Timestamp = 'timestamp',
  TotalStaked = 'totalStaked',
  Transaction = 'transaction',
  User = 'user',
}

/**
 * Granular event data for the Loan entity. Emitted when a user opens a Margin Trade
 *
 */
export type Trade = {
  __typename?: 'Trade';
  borrowedAmount: Scalars['BigDecimal'];
  collateralToken: Token;
  currentLeverage: Scalars['BigDecimal'];
  emittedBy: Scalars['Bytes'];
  entryLeverage: Scalars['BigDecimal'];
  entryPrice: Scalars['BigDecimal'];
  id: Scalars['ID'];
  interestRate: Scalars['BigDecimal'];
  lender: Scalars['Bytes'];
  loanId: Loan;
  loanToken: Token;
  positionSize: Scalars['BigDecimal'];
  settlementDate: Scalars['Int'];
  timestamp: Scalars['Int'];
  transaction: Transaction;
  user: User;
};

export type Trade_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  borrowedAmount?: InputMaybe<Scalars['BigDecimal']>;
  borrowedAmount_gt?: InputMaybe<Scalars['BigDecimal']>;
  borrowedAmount_gte?: InputMaybe<Scalars['BigDecimal']>;
  borrowedAmount_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  borrowedAmount_lt?: InputMaybe<Scalars['BigDecimal']>;
  borrowedAmount_lte?: InputMaybe<Scalars['BigDecimal']>;
  borrowedAmount_not?: InputMaybe<Scalars['BigDecimal']>;
  borrowedAmount_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  collateralToken?: InputMaybe<Scalars['String']>;
  collateralToken_?: InputMaybe<Token_Filter>;
  collateralToken_contains?: InputMaybe<Scalars['String']>;
  collateralToken_contains_nocase?: InputMaybe<Scalars['String']>;
  collateralToken_ends_with?: InputMaybe<Scalars['String']>;
  collateralToken_ends_with_nocase?: InputMaybe<Scalars['String']>;
  collateralToken_gt?: InputMaybe<Scalars['String']>;
  collateralToken_gte?: InputMaybe<Scalars['String']>;
  collateralToken_in?: InputMaybe<Array<Scalars['String']>>;
  collateralToken_lt?: InputMaybe<Scalars['String']>;
  collateralToken_lte?: InputMaybe<Scalars['String']>;
  collateralToken_not?: InputMaybe<Scalars['String']>;
  collateralToken_not_contains?: InputMaybe<Scalars['String']>;
  collateralToken_not_contains_nocase?: InputMaybe<Scalars['String']>;
  collateralToken_not_ends_with?: InputMaybe<Scalars['String']>;
  collateralToken_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  collateralToken_not_in?: InputMaybe<Array<Scalars['String']>>;
  collateralToken_not_starts_with?: InputMaybe<Scalars['String']>;
  collateralToken_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  collateralToken_starts_with?: InputMaybe<Scalars['String']>;
  collateralToken_starts_with_nocase?: InputMaybe<Scalars['String']>;
  currentLeverage?: InputMaybe<Scalars['BigDecimal']>;
  currentLeverage_gt?: InputMaybe<Scalars['BigDecimal']>;
  currentLeverage_gte?: InputMaybe<Scalars['BigDecimal']>;
  currentLeverage_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  currentLeverage_lt?: InputMaybe<Scalars['BigDecimal']>;
  currentLeverage_lte?: InputMaybe<Scalars['BigDecimal']>;
  currentLeverage_not?: InputMaybe<Scalars['BigDecimal']>;
  currentLeverage_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  emittedBy?: InputMaybe<Scalars['Bytes']>;
  emittedBy_contains?: InputMaybe<Scalars['Bytes']>;
  emittedBy_in?: InputMaybe<Array<Scalars['Bytes']>>;
  emittedBy_not?: InputMaybe<Scalars['Bytes']>;
  emittedBy_not_contains?: InputMaybe<Scalars['Bytes']>;
  emittedBy_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  entryLeverage?: InputMaybe<Scalars['BigDecimal']>;
  entryLeverage_gt?: InputMaybe<Scalars['BigDecimal']>;
  entryLeverage_gte?: InputMaybe<Scalars['BigDecimal']>;
  entryLeverage_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  entryLeverage_lt?: InputMaybe<Scalars['BigDecimal']>;
  entryLeverage_lte?: InputMaybe<Scalars['BigDecimal']>;
  entryLeverage_not?: InputMaybe<Scalars['BigDecimal']>;
  entryLeverage_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  entryPrice?: InputMaybe<Scalars['BigDecimal']>;
  entryPrice_gt?: InputMaybe<Scalars['BigDecimal']>;
  entryPrice_gte?: InputMaybe<Scalars['BigDecimal']>;
  entryPrice_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  entryPrice_lt?: InputMaybe<Scalars['BigDecimal']>;
  entryPrice_lte?: InputMaybe<Scalars['BigDecimal']>;
  entryPrice_not?: InputMaybe<Scalars['BigDecimal']>;
  entryPrice_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  interestRate?: InputMaybe<Scalars['BigDecimal']>;
  interestRate_gt?: InputMaybe<Scalars['BigDecimal']>;
  interestRate_gte?: InputMaybe<Scalars['BigDecimal']>;
  interestRate_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  interestRate_lt?: InputMaybe<Scalars['BigDecimal']>;
  interestRate_lte?: InputMaybe<Scalars['BigDecimal']>;
  interestRate_not?: InputMaybe<Scalars['BigDecimal']>;
  interestRate_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  lender?: InputMaybe<Scalars['Bytes']>;
  lender_contains?: InputMaybe<Scalars['Bytes']>;
  lender_in?: InputMaybe<Array<Scalars['Bytes']>>;
  lender_not?: InputMaybe<Scalars['Bytes']>;
  lender_not_contains?: InputMaybe<Scalars['Bytes']>;
  lender_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  loanId?: InputMaybe<Scalars['String']>;
  loanId_?: InputMaybe<Loan_Filter>;
  loanId_contains?: InputMaybe<Scalars['String']>;
  loanId_contains_nocase?: InputMaybe<Scalars['String']>;
  loanId_ends_with?: InputMaybe<Scalars['String']>;
  loanId_ends_with_nocase?: InputMaybe<Scalars['String']>;
  loanId_gt?: InputMaybe<Scalars['String']>;
  loanId_gte?: InputMaybe<Scalars['String']>;
  loanId_in?: InputMaybe<Array<Scalars['String']>>;
  loanId_lt?: InputMaybe<Scalars['String']>;
  loanId_lte?: InputMaybe<Scalars['String']>;
  loanId_not?: InputMaybe<Scalars['String']>;
  loanId_not_contains?: InputMaybe<Scalars['String']>;
  loanId_not_contains_nocase?: InputMaybe<Scalars['String']>;
  loanId_not_ends_with?: InputMaybe<Scalars['String']>;
  loanId_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  loanId_not_in?: InputMaybe<Array<Scalars['String']>>;
  loanId_not_starts_with?: InputMaybe<Scalars['String']>;
  loanId_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  loanId_starts_with?: InputMaybe<Scalars['String']>;
  loanId_starts_with_nocase?: InputMaybe<Scalars['String']>;
  loanToken?: InputMaybe<Scalars['String']>;
  loanToken_?: InputMaybe<Token_Filter>;
  loanToken_contains?: InputMaybe<Scalars['String']>;
  loanToken_contains_nocase?: InputMaybe<Scalars['String']>;
  loanToken_ends_with?: InputMaybe<Scalars['String']>;
  loanToken_ends_with_nocase?: InputMaybe<Scalars['String']>;
  loanToken_gt?: InputMaybe<Scalars['String']>;
  loanToken_gte?: InputMaybe<Scalars['String']>;
  loanToken_in?: InputMaybe<Array<Scalars['String']>>;
  loanToken_lt?: InputMaybe<Scalars['String']>;
  loanToken_lte?: InputMaybe<Scalars['String']>;
  loanToken_not?: InputMaybe<Scalars['String']>;
  loanToken_not_contains?: InputMaybe<Scalars['String']>;
  loanToken_not_contains_nocase?: InputMaybe<Scalars['String']>;
  loanToken_not_ends_with?: InputMaybe<Scalars['String']>;
  loanToken_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  loanToken_not_in?: InputMaybe<Array<Scalars['String']>>;
  loanToken_not_starts_with?: InputMaybe<Scalars['String']>;
  loanToken_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  loanToken_starts_with?: InputMaybe<Scalars['String']>;
  loanToken_starts_with_nocase?: InputMaybe<Scalars['String']>;
  positionSize?: InputMaybe<Scalars['BigDecimal']>;
  positionSize_gt?: InputMaybe<Scalars['BigDecimal']>;
  positionSize_gte?: InputMaybe<Scalars['BigDecimal']>;
  positionSize_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  positionSize_lt?: InputMaybe<Scalars['BigDecimal']>;
  positionSize_lte?: InputMaybe<Scalars['BigDecimal']>;
  positionSize_not?: InputMaybe<Scalars['BigDecimal']>;
  positionSize_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  settlementDate?: InputMaybe<Scalars['Int']>;
  settlementDate_gt?: InputMaybe<Scalars['Int']>;
  settlementDate_gte?: InputMaybe<Scalars['Int']>;
  settlementDate_in?: InputMaybe<Array<Scalars['Int']>>;
  settlementDate_lt?: InputMaybe<Scalars['Int']>;
  settlementDate_lte?: InputMaybe<Scalars['Int']>;
  settlementDate_not?: InputMaybe<Scalars['Int']>;
  settlementDate_not_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp?: InputMaybe<Scalars['Int']>;
  timestamp_gt?: InputMaybe<Scalars['Int']>;
  timestamp_gte?: InputMaybe<Scalars['Int']>;
  timestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp_lt?: InputMaybe<Scalars['Int']>;
  timestamp_lte?: InputMaybe<Scalars['Int']>;
  timestamp_not?: InputMaybe<Scalars['Int']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
  transaction?: InputMaybe<Scalars['String']>;
  transaction_?: InputMaybe<Transaction_Filter>;
  transaction_contains?: InputMaybe<Scalars['String']>;
  transaction_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_gt?: InputMaybe<Scalars['String']>;
  transaction_gte?: InputMaybe<Scalars['String']>;
  transaction_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_lt?: InputMaybe<Scalars['String']>;
  transaction_lte?: InputMaybe<Scalars['String']>;
  transaction_not?: InputMaybe<Scalars['String']>;
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_not_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
  transaction_starts_with_nocase?: InputMaybe<Scalars['String']>;
  user?: InputMaybe<Scalars['String']>;
  user_?: InputMaybe<User_Filter>;
  user_contains?: InputMaybe<Scalars['String']>;
  user_contains_nocase?: InputMaybe<Scalars['String']>;
  user_ends_with?: InputMaybe<Scalars['String']>;
  user_ends_with_nocase?: InputMaybe<Scalars['String']>;
  user_gt?: InputMaybe<Scalars['String']>;
  user_gte?: InputMaybe<Scalars['String']>;
  user_in?: InputMaybe<Array<Scalars['String']>>;
  user_lt?: InputMaybe<Scalars['String']>;
  user_lte?: InputMaybe<Scalars['String']>;
  user_not?: InputMaybe<Scalars['String']>;
  user_not_contains?: InputMaybe<Scalars['String']>;
  user_not_contains_nocase?: InputMaybe<Scalars['String']>;
  user_not_ends_with?: InputMaybe<Scalars['String']>;
  user_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  user_not_in?: InputMaybe<Array<Scalars['String']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']>;
  user_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  user_starts_with?: InputMaybe<Scalars['String']>;
  user_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum Trade_OrderBy {
  BorrowedAmount = 'borrowedAmount',
  CollateralToken = 'collateralToken',
  CurrentLeverage = 'currentLeverage',
  EmittedBy = 'emittedBy',
  EntryLeverage = 'entryLeverage',
  EntryPrice = 'entryPrice',
  Id = 'id',
  InterestRate = 'interestRate',
  Lender = 'lender',
  LoanId = 'loanId',
  LoanToken = 'loanToken',
  PositionSize = 'positionSize',
  SettlementDate = 'settlementDate',
  Timestamp = 'timestamp',
  Transaction = 'transaction',
  User = 'user',
}

/**
 * Transaction data, including hash and timestamp
 *
 */
export type Transaction = {
  __typename?: 'Transaction';
  blockNumber: Scalars['Int'];
  /**
   * The account that initiated this transaction. This must be an Account and not a Contract.
   *
   */
  from: User;
  functionSignature: Scalars['String'];
  gasLimit: Scalars['BigInt'];
  gasPrice: Scalars['BigInt'];
  /**
   * ID is transaction hash
   *
   */
  id: Scalars['ID'];
  /**
   * The index of this transaction within the block
   *
   */
  index: Scalars['Int'];
  /**
   * The timestamp the transaction was confirmed
   *
   */
  timestamp: Scalars['Int'];
  /**
   * The contract the user interacted with
   *
   */
  to?: Maybe<Scalars['Bytes']>;
  value: Scalars['BigInt'];
};

export type Transaction_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  blockNumber?: InputMaybe<Scalars['Int']>;
  blockNumber_gt?: InputMaybe<Scalars['Int']>;
  blockNumber_gte?: InputMaybe<Scalars['Int']>;
  blockNumber_in?: InputMaybe<Array<Scalars['Int']>>;
  blockNumber_lt?: InputMaybe<Scalars['Int']>;
  blockNumber_lte?: InputMaybe<Scalars['Int']>;
  blockNumber_not?: InputMaybe<Scalars['Int']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['Int']>>;
  from?: InputMaybe<Scalars['String']>;
  from_?: InputMaybe<User_Filter>;
  from_contains?: InputMaybe<Scalars['String']>;
  from_contains_nocase?: InputMaybe<Scalars['String']>;
  from_ends_with?: InputMaybe<Scalars['String']>;
  from_ends_with_nocase?: InputMaybe<Scalars['String']>;
  from_gt?: InputMaybe<Scalars['String']>;
  from_gte?: InputMaybe<Scalars['String']>;
  from_in?: InputMaybe<Array<Scalars['String']>>;
  from_lt?: InputMaybe<Scalars['String']>;
  from_lte?: InputMaybe<Scalars['String']>;
  from_not?: InputMaybe<Scalars['String']>;
  from_not_contains?: InputMaybe<Scalars['String']>;
  from_not_contains_nocase?: InputMaybe<Scalars['String']>;
  from_not_ends_with?: InputMaybe<Scalars['String']>;
  from_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  from_not_in?: InputMaybe<Array<Scalars['String']>>;
  from_not_starts_with?: InputMaybe<Scalars['String']>;
  from_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  from_starts_with?: InputMaybe<Scalars['String']>;
  from_starts_with_nocase?: InputMaybe<Scalars['String']>;
  functionSignature?: InputMaybe<Scalars['String']>;
  functionSignature_contains?: InputMaybe<Scalars['String']>;
  functionSignature_contains_nocase?: InputMaybe<Scalars['String']>;
  functionSignature_ends_with?: InputMaybe<Scalars['String']>;
  functionSignature_ends_with_nocase?: InputMaybe<Scalars['String']>;
  functionSignature_gt?: InputMaybe<Scalars['String']>;
  functionSignature_gte?: InputMaybe<Scalars['String']>;
  functionSignature_in?: InputMaybe<Array<Scalars['String']>>;
  functionSignature_lt?: InputMaybe<Scalars['String']>;
  functionSignature_lte?: InputMaybe<Scalars['String']>;
  functionSignature_not?: InputMaybe<Scalars['String']>;
  functionSignature_not_contains?: InputMaybe<Scalars['String']>;
  functionSignature_not_contains_nocase?: InputMaybe<Scalars['String']>;
  functionSignature_not_ends_with?: InputMaybe<Scalars['String']>;
  functionSignature_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  functionSignature_not_in?: InputMaybe<Array<Scalars['String']>>;
  functionSignature_not_starts_with?: InputMaybe<Scalars['String']>;
  functionSignature_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  functionSignature_starts_with?: InputMaybe<Scalars['String']>;
  functionSignature_starts_with_nocase?: InputMaybe<Scalars['String']>;
  gasLimit?: InputMaybe<Scalars['BigInt']>;
  gasLimit_gt?: InputMaybe<Scalars['BigInt']>;
  gasLimit_gte?: InputMaybe<Scalars['BigInt']>;
  gasLimit_in?: InputMaybe<Array<Scalars['BigInt']>>;
  gasLimit_lt?: InputMaybe<Scalars['BigInt']>;
  gasLimit_lte?: InputMaybe<Scalars['BigInt']>;
  gasLimit_not?: InputMaybe<Scalars['BigInt']>;
  gasLimit_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  gasPrice?: InputMaybe<Scalars['BigInt']>;
  gasPrice_gt?: InputMaybe<Scalars['BigInt']>;
  gasPrice_gte?: InputMaybe<Scalars['BigInt']>;
  gasPrice_in?: InputMaybe<Array<Scalars['BigInt']>>;
  gasPrice_lt?: InputMaybe<Scalars['BigInt']>;
  gasPrice_lte?: InputMaybe<Scalars['BigInt']>;
  gasPrice_not?: InputMaybe<Scalars['BigInt']>;
  gasPrice_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  index?: InputMaybe<Scalars['Int']>;
  index_gt?: InputMaybe<Scalars['Int']>;
  index_gte?: InputMaybe<Scalars['Int']>;
  index_in?: InputMaybe<Array<Scalars['Int']>>;
  index_lt?: InputMaybe<Scalars['Int']>;
  index_lte?: InputMaybe<Scalars['Int']>;
  index_not?: InputMaybe<Scalars['Int']>;
  index_not_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp?: InputMaybe<Scalars['Int']>;
  timestamp_gt?: InputMaybe<Scalars['Int']>;
  timestamp_gte?: InputMaybe<Scalars['Int']>;
  timestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp_lt?: InputMaybe<Scalars['Int']>;
  timestamp_lte?: InputMaybe<Scalars['Int']>;
  timestamp_not?: InputMaybe<Scalars['Int']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
  to?: InputMaybe<Scalars['Bytes']>;
  to_contains?: InputMaybe<Scalars['Bytes']>;
  to_in?: InputMaybe<Array<Scalars['Bytes']>>;
  to_not?: InputMaybe<Scalars['Bytes']>;
  to_not_contains?: InputMaybe<Scalars['Bytes']>;
  to_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  value?: InputMaybe<Scalars['BigInt']>;
  value_gt?: InputMaybe<Scalars['BigInt']>;
  value_gte?: InputMaybe<Scalars['BigInt']>;
  value_in?: InputMaybe<Array<Scalars['BigInt']>>;
  value_lt?: InputMaybe<Scalars['BigInt']>;
  value_lte?: InputMaybe<Scalars['BigInt']>;
  value_not?: InputMaybe<Scalars['BigInt']>;
  value_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export enum Transaction_OrderBy {
  BlockNumber = 'blockNumber',
  From = 'from',
  FunctionSignature = 'functionSignature',
  GasLimit = 'gasLimit',
  GasPrice = 'gasPrice',
  Id = 'id',
  Index = 'index',
  Timestamp = 'timestamp',
  To = 'to',
  Value = 'value',
}

/**
 * This entity contains all user-specific data displayed on the dapp, including all user actions
 *
 */
export type User = {
  __typename?: 'User';
  /**
   * FastBTCBridge transfers from BTC to RSK
   *
   */
  bitcoinTransfers?: Maybe<Array<BitcoinTransfer>>;
  /**
   * An array of Borrow events
   *
   */
  borrows?: Maybe<Array<Borrow>>;
  /**
   * Timestamp of User's first interaction with the protocol (first transaction)
   *
   */
  createdAtTimestamp: Scalars['Int'];
  /**
   * EVM Bridge transfers
   *
   */
  crossChainTransfer?: Maybe<Array<CrossTransfer>>;
  /**
   * Stakes the user owns, including stakes from Vesting Contracts
   *
   */
  currentStakes?: Maybe<Array<Stake>>;
  fastBTCBridgeStats?: Maybe<Array<FastBtcBridgeStat>>;
  /**
   * ID is user wallet address
   *
   */
  id: Scalars['ID'];
  /**
   * The lending history of a User, separated into lending pools. Explore the UserLendingHistory entity for more granular events.
   *
   */
  lendingHistory?: Maybe<Array<UserLendingHistory>>;
  /**
   * An array of Liquidation events linked to this user
   *
   */
  liquidations?: Maybe<Array<Liquidate>>;
  /**
   * An array of all LiquidityAdded and LiquidityRemoved events
   *
   */
  liquidityHistory?: Maybe<Array<UserLiquidityHistory>>;
  /**
   * All loans taken out by this user, including for margin trading and for borrowing
   *
   */
  loans?: Maybe<Array<Loan>>;
  /**
   * The Rewards history of one user. This includes actions like EarnReward, RewardSovDeposited, and RewardSovStaked.
   * Explore the UserRewardsEarnedHistory entity for more granular events
   *
   */
  rewardsEarnedHistory?: Maybe<Array<UserRewardsEarnedHistory>>;
  /**
   * The SOV Staking history of a user. This includes withdrawing vested tokens. Explore the UserStakeHistory entity for more granular events.
   *
   */
  stakeHistory?: Maybe<Array<UserStakeHistory>>;
  /**
   * Swaps here refers to only user-triggered swaps. For example, a swap that is part of a margin trade would not be included.
   * Swaps involving multiple amm pools are stored as a single swap, comprised of multiple Conversion events
   *
   */
  swaps?: Maybe<Array<Swap>>;
  /**
   * An array of margin trade Trade events
   *
   */
  trades?: Maybe<Array<Trade>>;
  /**
   * Transactions initiated by this user
   *
   */
  transactions?: Maybe<Array<Transaction>>;
  /**
   * See UserTotals entity for full documentation
   *
   */
  userTotals?: Maybe<UserTotal>;
  /**
   * Vesting contracts owned by User, labelled by type
   *
   */
  vestingContracts?: Maybe<Array<VestingContract>>;
  /**
   * Voting history of User
   *
   */
  votes?: Maybe<Array<VoteCast>>;
};

/**
 * This entity contains all user-specific data displayed on the dapp, including all user actions
 *
 */
export type UserBitcoinTransfersArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<BitcoinTransfer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<BitcoinTransfer_Filter>;
};

/**
 * This entity contains all user-specific data displayed on the dapp, including all user actions
 *
 */
export type UserBorrowsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Borrow_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Borrow_Filter>;
};

/**
 * This entity contains all user-specific data displayed on the dapp, including all user actions
 *
 */
export type UserCrossChainTransferArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<CrossTransfer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<CrossTransfer_Filter>;
};

/**
 * This entity contains all user-specific data displayed on the dapp, including all user actions
 *
 */
export type UserCurrentStakesArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Stake_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Stake_Filter>;
};

/**
 * This entity contains all user-specific data displayed on the dapp, including all user actions
 *
 */
export type UserFastBtcBridgeStatsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<FastBtcBridgeStat_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<FastBtcBridgeStat_Filter>;
};

/**
 * This entity contains all user-specific data displayed on the dapp, including all user actions
 *
 */
export type UserLendingHistoryArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UserLendingHistory_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<UserLendingHistory_Filter>;
};

/**
 * This entity contains all user-specific data displayed on the dapp, including all user actions
 *
 */
export type UserLiquidationsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Liquidate_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Liquidate_Filter>;
};

/**
 * This entity contains all user-specific data displayed on the dapp, including all user actions
 *
 */
export type UserLiquidityHistoryArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UserLiquidityHistory_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<UserLiquidityHistory_Filter>;
};

/**
 * This entity contains all user-specific data displayed on the dapp, including all user actions
 *
 */
export type UserLoansArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Loan_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Loan_Filter>;
};

/**
 * This entity contains all user-specific data displayed on the dapp, including all user actions
 *
 */
export type UserRewardsEarnedHistoryArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UserRewardsEarnedHistory_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<UserRewardsEarnedHistory_Filter>;
};

/**
 * This entity contains all user-specific data displayed on the dapp, including all user actions
 *
 */
export type UserStakeHistoryArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UserStakeHistory_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<UserStakeHistory_Filter>;
};

/**
 * This entity contains all user-specific data displayed on the dapp, including all user actions
 *
 */
export type UserSwapsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Swap_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Swap_Filter>;
};

/**
 * This entity contains all user-specific data displayed on the dapp, including all user actions
 *
 */
export type UserTradesArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Trade_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Trade_Filter>;
};

/**
 * This entity contains all user-specific data displayed on the dapp, including all user actions
 *
 */
export type UserTransactionsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Transaction_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Transaction_Filter>;
};

/**
 * This entity contains all user-specific data displayed on the dapp, including all user actions
 *
 */
export type UserVestingContractsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<VestingContract_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<VestingContract_Filter>;
};

/**
 * This entity contains all user-specific data displayed on the dapp, including all user actions
 *
 */
export type UserVotesArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<VoteCast_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<VoteCast_Filter>;
};

/**
 * This entity contains the lending and unlending history of one User
 *
 */
export type UserLendingHistory = {
  __typename?: 'UserLendingHistory';
  /**
   * ID is userAddress + lendingPoolAddress (lendingPool in this case is the lending pool token)
   *
   */
  id: Scalars['ID'];
  /**
   * Granular Lend/UnLend events. Derived from Mint/Burn events on the contracts
   *
   */
  lendingHistory?: Maybe<Array<LendingHistoryItem>>;
  lendingPool: LendingPool;
  /**
   * Total volume this User has lent to this pool over all time (in the underlying asset currency, ie rBTC for the rBTC lending pool)
   *
   */
  totalLendVolume: Scalars['BigDecimal'];
  /**
   * Total volume this User has withdrawn from this pool over all time
   *
   */
  totalUnlendVolume: Scalars['BigDecimal'];
  user: User;
};

/**
 * This entity contains the lending and unlending history of one User
 *
 */
export type UserLendingHistoryLendingHistoryArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<LendingHistoryItem_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<LendingHistoryItem_Filter>;
};

export type UserLendingHistory_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  lendingHistory_?: InputMaybe<LendingHistoryItem_Filter>;
  lendingPool?: InputMaybe<Scalars['String']>;
  lendingPool_?: InputMaybe<LendingPool_Filter>;
  lendingPool_contains?: InputMaybe<Scalars['String']>;
  lendingPool_contains_nocase?: InputMaybe<Scalars['String']>;
  lendingPool_ends_with?: InputMaybe<Scalars['String']>;
  lendingPool_ends_with_nocase?: InputMaybe<Scalars['String']>;
  lendingPool_gt?: InputMaybe<Scalars['String']>;
  lendingPool_gte?: InputMaybe<Scalars['String']>;
  lendingPool_in?: InputMaybe<Array<Scalars['String']>>;
  lendingPool_lt?: InputMaybe<Scalars['String']>;
  lendingPool_lte?: InputMaybe<Scalars['String']>;
  lendingPool_not?: InputMaybe<Scalars['String']>;
  lendingPool_not_contains?: InputMaybe<Scalars['String']>;
  lendingPool_not_contains_nocase?: InputMaybe<Scalars['String']>;
  lendingPool_not_ends_with?: InputMaybe<Scalars['String']>;
  lendingPool_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  lendingPool_not_in?: InputMaybe<Array<Scalars['String']>>;
  lendingPool_not_starts_with?: InputMaybe<Scalars['String']>;
  lendingPool_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  lendingPool_starts_with?: InputMaybe<Scalars['String']>;
  lendingPool_starts_with_nocase?: InputMaybe<Scalars['String']>;
  totalLendVolume?: InputMaybe<Scalars['BigDecimal']>;
  totalLendVolume_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalLendVolume_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalLendVolume_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalLendVolume_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalLendVolume_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalLendVolume_not?: InputMaybe<Scalars['BigDecimal']>;
  totalLendVolume_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalUnlendVolume?: InputMaybe<Scalars['BigDecimal']>;
  totalUnlendVolume_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalUnlendVolume_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalUnlendVolume_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalUnlendVolume_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalUnlendVolume_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalUnlendVolume_not?: InputMaybe<Scalars['BigDecimal']>;
  totalUnlendVolume_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  user?: InputMaybe<Scalars['String']>;
  user_?: InputMaybe<User_Filter>;
  user_contains?: InputMaybe<Scalars['String']>;
  user_contains_nocase?: InputMaybe<Scalars['String']>;
  user_ends_with?: InputMaybe<Scalars['String']>;
  user_ends_with_nocase?: InputMaybe<Scalars['String']>;
  user_gt?: InputMaybe<Scalars['String']>;
  user_gte?: InputMaybe<Scalars['String']>;
  user_in?: InputMaybe<Array<Scalars['String']>>;
  user_lt?: InputMaybe<Scalars['String']>;
  user_lte?: InputMaybe<Scalars['String']>;
  user_not?: InputMaybe<Scalars['String']>;
  user_not_contains?: InputMaybe<Scalars['String']>;
  user_not_contains_nocase?: InputMaybe<Scalars['String']>;
  user_not_ends_with?: InputMaybe<Scalars['String']>;
  user_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  user_not_in?: InputMaybe<Array<Scalars['String']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']>;
  user_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  user_starts_with?: InputMaybe<Scalars['String']>;
  user_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum UserLendingHistory_OrderBy {
  Id = 'id',
  LendingHistory = 'lendingHistory',
  LendingPool = 'lendingPool',
  TotalLendVolume = 'totalLendVolume',
  TotalUnlendVolume = 'totalUnlendVolume',
  User = 'user',
}

/**
 * This entity stores one User's history of adding and removing liquidity from one AMM pool
 *
 */
export type UserLiquidityHistory = {
  __typename?: 'UserLiquidityHistory';
  /**
   * The ID is userAddress + '-' + smartToken
   * Liquidity Pool address is not used here because when a liquidity pool is updated the address changes, but the smart token address remains the same.
   *
   */
  id: Scalars['ID'];
  /**
   * Granular transaction history for transactions adding or removing liquidity from an AMM pool
   *
   */
  liquidityHistory?: Maybe<Array<LiquidityHistoryItem>>;
  /**
   * This is the pool token (sometimes called smart token), not the liquidity pool address
   *
   */
  poolToken: PoolToken;
  /**
   * Asset0 is defined on the LiquidityPool.
   * These totals are amounts added and removed over all time. These values are used to calculate a user's PnL from liquidity provision.
   *
   */
  totalAsset0LiquidityAdded: Scalars['BigDecimal'];
  totalAsset0LiquidityRemoved: Scalars['BigDecimal'];
  /**
   * Asset1 is defined on the LiquidityPool
   * These totals are amounts added and removed over all time. These values are used to calculate a user's PnL from liquidity provision.
   *
   */
  totalAsset1LiquidityAdded: Scalars['BigDecimal'];
  totalAsset1LiquidityRemoved: Scalars['BigDecimal'];
  user: User;
};

/**
 * This entity stores one User's history of adding and removing liquidity from one AMM pool
 *
 */
export type UserLiquidityHistoryLiquidityHistoryArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<LiquidityHistoryItem_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<LiquidityHistoryItem_Filter>;
};

export type UserLiquidityHistory_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  liquidityHistory_?: InputMaybe<LiquidityHistoryItem_Filter>;
  poolToken?: InputMaybe<Scalars['String']>;
  poolToken_?: InputMaybe<PoolToken_Filter>;
  poolToken_contains?: InputMaybe<Scalars['String']>;
  poolToken_contains_nocase?: InputMaybe<Scalars['String']>;
  poolToken_ends_with?: InputMaybe<Scalars['String']>;
  poolToken_ends_with_nocase?: InputMaybe<Scalars['String']>;
  poolToken_gt?: InputMaybe<Scalars['String']>;
  poolToken_gte?: InputMaybe<Scalars['String']>;
  poolToken_in?: InputMaybe<Array<Scalars['String']>>;
  poolToken_lt?: InputMaybe<Scalars['String']>;
  poolToken_lte?: InputMaybe<Scalars['String']>;
  poolToken_not?: InputMaybe<Scalars['String']>;
  poolToken_not_contains?: InputMaybe<Scalars['String']>;
  poolToken_not_contains_nocase?: InputMaybe<Scalars['String']>;
  poolToken_not_ends_with?: InputMaybe<Scalars['String']>;
  poolToken_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  poolToken_not_in?: InputMaybe<Array<Scalars['String']>>;
  poolToken_not_starts_with?: InputMaybe<Scalars['String']>;
  poolToken_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  poolToken_starts_with?: InputMaybe<Scalars['String']>;
  poolToken_starts_with_nocase?: InputMaybe<Scalars['String']>;
  totalAsset0LiquidityAdded?: InputMaybe<Scalars['BigDecimal']>;
  totalAsset0LiquidityAdded_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalAsset0LiquidityAdded_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalAsset0LiquidityAdded_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalAsset0LiquidityAdded_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalAsset0LiquidityAdded_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalAsset0LiquidityAdded_not?: InputMaybe<Scalars['BigDecimal']>;
  totalAsset0LiquidityAdded_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalAsset0LiquidityRemoved?: InputMaybe<Scalars['BigDecimal']>;
  totalAsset0LiquidityRemoved_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalAsset0LiquidityRemoved_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalAsset0LiquidityRemoved_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalAsset0LiquidityRemoved_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalAsset0LiquidityRemoved_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalAsset0LiquidityRemoved_not?: InputMaybe<Scalars['BigDecimal']>;
  totalAsset0LiquidityRemoved_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalAsset1LiquidityAdded?: InputMaybe<Scalars['BigDecimal']>;
  totalAsset1LiquidityAdded_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalAsset1LiquidityAdded_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalAsset1LiquidityAdded_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalAsset1LiquidityAdded_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalAsset1LiquidityAdded_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalAsset1LiquidityAdded_not?: InputMaybe<Scalars['BigDecimal']>;
  totalAsset1LiquidityAdded_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalAsset1LiquidityRemoved?: InputMaybe<Scalars['BigDecimal']>;
  totalAsset1LiquidityRemoved_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalAsset1LiquidityRemoved_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalAsset1LiquidityRemoved_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalAsset1LiquidityRemoved_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalAsset1LiquidityRemoved_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalAsset1LiquidityRemoved_not?: InputMaybe<Scalars['BigDecimal']>;
  totalAsset1LiquidityRemoved_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  user?: InputMaybe<Scalars['String']>;
  user_?: InputMaybe<User_Filter>;
  user_contains?: InputMaybe<Scalars['String']>;
  user_contains_nocase?: InputMaybe<Scalars['String']>;
  user_ends_with?: InputMaybe<Scalars['String']>;
  user_ends_with_nocase?: InputMaybe<Scalars['String']>;
  user_gt?: InputMaybe<Scalars['String']>;
  user_gte?: InputMaybe<Scalars['String']>;
  user_in?: InputMaybe<Array<Scalars['String']>>;
  user_lt?: InputMaybe<Scalars['String']>;
  user_lte?: InputMaybe<Scalars['String']>;
  user_not?: InputMaybe<Scalars['String']>;
  user_not_contains?: InputMaybe<Scalars['String']>;
  user_not_contains_nocase?: InputMaybe<Scalars['String']>;
  user_not_ends_with?: InputMaybe<Scalars['String']>;
  user_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  user_not_in?: InputMaybe<Array<Scalars['String']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']>;
  user_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  user_starts_with?: InputMaybe<Scalars['String']>;
  user_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum UserLiquidityHistory_OrderBy {
  Id = 'id',
  LiquidityHistory = 'liquidityHistory',
  PoolToken = 'poolToken',
  TotalAsset0LiquidityAdded = 'totalAsset0LiquidityAdded',
  TotalAsset0LiquidityRemoved = 'totalAsset0LiquidityRemoved',
  TotalAsset1LiquidityAdded = 'totalAsset1LiquidityAdded',
  TotalAsset1LiquidityRemoved = 'totalAsset1LiquidityRemoved',
  User = 'user',
}

/**
 * This entity contains the history, fees and totals regarding one users' SOV rewards
 *
 */
export type UserRewardsEarnedHistory = {
  __typename?: 'UserRewardsEarnedHistory';
  /**
   * SOV rewards earned from margin trading, but not yet claimed and vested
   * Incremented by EarnReward events, and set to 0 by TokensStaked events on the LockedSOV contract
   *
   */
  availableTradingRewards: Scalars['BigDecimal'];
  id: Scalars['ID'];
  /**
   * Granular events for transaction where a reward is earned
   *
   */
  rewardsEarnedHistory?: Maybe<Array<RewardsEarnedHistoryItem>>;
  /**
   * The total protocol fees this user has earned and withdrawn, quoted in RBTC.
   * Fees can be paid out in different tokens (usually RBTC and SOV).
   * This is the total amount, converted to RBTC using the rate at the time of transaction.
   * Incremented by UserFeeWithdrawn
   *
   */
  totalFeeWithdrawn: Scalars['BigDecimal'];
  /**
   * This is the total of all EarnReward and RewardClaimed events
   *
   */
  totalFeesAndRewardsEarned: Scalars['BigDecimal'];
  /**
   * The total liquidity mining rewards the user has claimed, earned from the lending pools.
   * Incremented by RewardClaimed, where poolToken is a lending pool token
   *
   */
  totalLendingRewards: Scalars['BigDecimal'];
  /**
   * The total liquidity mining rewards the user has claimed, earned from the amm pools.
   * Incremented by RewardClaimed, where poolToken is an amm pool token
   *
   */
  totalLiquidityRewards: Scalars['BigDecimal'];
  /**
   * Total liquid SOV rewards the user has earned through staking.
   * Incremented by RewardWithdrawn
   *
   */
  totalStakingRewards: Scalars['BigDecimal'];
  /**
   * Sum of all SOV rewards earned from margin trading.
   * Incremented by EarnReward events
   *
   */
  totalTradingRewards: Scalars['BigDecimal'];
  user: User;
};

/**
 * This entity contains the history, fees and totals regarding one users' SOV rewards
 *
 */
export type UserRewardsEarnedHistoryRewardsEarnedHistoryArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<RewardsEarnedHistoryItem_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<RewardsEarnedHistoryItem_Filter>;
};

export type UserRewardsEarnedHistory_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  availableTradingRewards?: InputMaybe<Scalars['BigDecimal']>;
  availableTradingRewards_gt?: InputMaybe<Scalars['BigDecimal']>;
  availableTradingRewards_gte?: InputMaybe<Scalars['BigDecimal']>;
  availableTradingRewards_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  availableTradingRewards_lt?: InputMaybe<Scalars['BigDecimal']>;
  availableTradingRewards_lte?: InputMaybe<Scalars['BigDecimal']>;
  availableTradingRewards_not?: InputMaybe<Scalars['BigDecimal']>;
  availableTradingRewards_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  rewardsEarnedHistory_?: InputMaybe<RewardsEarnedHistoryItem_Filter>;
  totalFeeWithdrawn?: InputMaybe<Scalars['BigDecimal']>;
  totalFeeWithdrawn_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalFeeWithdrawn_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalFeeWithdrawn_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalFeeWithdrawn_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalFeeWithdrawn_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalFeeWithdrawn_not?: InputMaybe<Scalars['BigDecimal']>;
  totalFeeWithdrawn_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalFeesAndRewardsEarned?: InputMaybe<Scalars['BigDecimal']>;
  totalFeesAndRewardsEarned_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalFeesAndRewardsEarned_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalFeesAndRewardsEarned_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalFeesAndRewardsEarned_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalFeesAndRewardsEarned_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalFeesAndRewardsEarned_not?: InputMaybe<Scalars['BigDecimal']>;
  totalFeesAndRewardsEarned_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalLendingRewards?: InputMaybe<Scalars['BigDecimal']>;
  totalLendingRewards_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalLendingRewards_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalLendingRewards_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalLendingRewards_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalLendingRewards_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalLendingRewards_not?: InputMaybe<Scalars['BigDecimal']>;
  totalLendingRewards_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalLiquidityRewards?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidityRewards_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidityRewards_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidityRewards_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalLiquidityRewards_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidityRewards_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidityRewards_not?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidityRewards_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalStakingRewards?: InputMaybe<Scalars['BigDecimal']>;
  totalStakingRewards_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalStakingRewards_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalStakingRewards_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalStakingRewards_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalStakingRewards_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalStakingRewards_not?: InputMaybe<Scalars['BigDecimal']>;
  totalStakingRewards_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalTradingRewards?: InputMaybe<Scalars['BigDecimal']>;
  totalTradingRewards_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalTradingRewards_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalTradingRewards_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalTradingRewards_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalTradingRewards_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalTradingRewards_not?: InputMaybe<Scalars['BigDecimal']>;
  totalTradingRewards_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  user?: InputMaybe<Scalars['String']>;
  user_?: InputMaybe<User_Filter>;
  user_contains?: InputMaybe<Scalars['String']>;
  user_contains_nocase?: InputMaybe<Scalars['String']>;
  user_ends_with?: InputMaybe<Scalars['String']>;
  user_ends_with_nocase?: InputMaybe<Scalars['String']>;
  user_gt?: InputMaybe<Scalars['String']>;
  user_gte?: InputMaybe<Scalars['String']>;
  user_in?: InputMaybe<Array<Scalars['String']>>;
  user_lt?: InputMaybe<Scalars['String']>;
  user_lte?: InputMaybe<Scalars['String']>;
  user_not?: InputMaybe<Scalars['String']>;
  user_not_contains?: InputMaybe<Scalars['String']>;
  user_not_contains_nocase?: InputMaybe<Scalars['String']>;
  user_not_ends_with?: InputMaybe<Scalars['String']>;
  user_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  user_not_in?: InputMaybe<Array<Scalars['String']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']>;
  user_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  user_starts_with?: InputMaybe<Scalars['String']>;
  user_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum UserRewardsEarnedHistory_OrderBy {
  AvailableTradingRewards = 'availableTradingRewards',
  Id = 'id',
  RewardsEarnedHistory = 'rewardsEarnedHistory',
  TotalFeeWithdrawn = 'totalFeeWithdrawn',
  TotalFeesAndRewardsEarned = 'totalFeesAndRewardsEarned',
  TotalLendingRewards = 'totalLendingRewards',
  TotalLiquidityRewards = 'totalLiquidityRewards',
  TotalStakingRewards = 'totalStakingRewards',
  TotalTradingRewards = 'totalTradingRewards',
  User = 'user',
}

/**
 * This entity holds the voluntary staking history (ie not staking by a vesting contract) of one user
 *
 */
export type UserStakeHistory = {
  __typename?: 'UserStakeHistory';
  /**
   * ID is the user address
   *
   */
  id: Scalars['ID'];
  /**
   * Granular history of the user's voluntary staking activity
   *
   */
  stakeHistory?: Maybe<Array<StakeHistoryItem>>;
  /**
   * totalRemaining is the amount the user currently has staked.
   * It should be the same as the result of calling the balanceOf(USER_ADDRESS) method on the staking contract.
   *
   */
  totalRemaining: Scalars['BigDecimal'];
  /**
   * totalStaked is the total amount the user has EVER staked (over all time).
   * Eg if they stake 10 SOV and then withdraw it and stake it again, totalStaked is 20 SOV
   *
   */
  totalStaked: Scalars['BigDecimal'];
  /**
   * totalWithdrawn is the total amount the user has ever withdrawn from voluntary staking (over all time)
   *
   */
  totalWithdrawn: Scalars['BigDecimal'];
  user: User;
};

/**
 * This entity holds the voluntary staking history (ie not staking by a vesting contract) of one user
 *
 */
export type UserStakeHistoryStakeHistoryArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<StakeHistoryItem_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<StakeHistoryItem_Filter>;
};

export type UserStakeHistory_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  stakeHistory_?: InputMaybe<StakeHistoryItem_Filter>;
  totalRemaining?: InputMaybe<Scalars['BigDecimal']>;
  totalRemaining_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalRemaining_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalRemaining_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalRemaining_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalRemaining_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalRemaining_not?: InputMaybe<Scalars['BigDecimal']>;
  totalRemaining_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalStaked?: InputMaybe<Scalars['BigDecimal']>;
  totalStaked_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalStaked_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalStaked_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalStaked_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalStaked_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalStaked_not?: InputMaybe<Scalars['BigDecimal']>;
  totalStaked_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalWithdrawn?: InputMaybe<Scalars['BigDecimal']>;
  totalWithdrawn_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalWithdrawn_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalWithdrawn_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalWithdrawn_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalWithdrawn_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalWithdrawn_not?: InputMaybe<Scalars['BigDecimal']>;
  totalWithdrawn_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  user?: InputMaybe<Scalars['String']>;
  user_?: InputMaybe<User_Filter>;
  user_contains?: InputMaybe<Scalars['String']>;
  user_contains_nocase?: InputMaybe<Scalars['String']>;
  user_ends_with?: InputMaybe<Scalars['String']>;
  user_ends_with_nocase?: InputMaybe<Scalars['String']>;
  user_gt?: InputMaybe<Scalars['String']>;
  user_gte?: InputMaybe<Scalars['String']>;
  user_in?: InputMaybe<Array<Scalars['String']>>;
  user_lt?: InputMaybe<Scalars['String']>;
  user_lte?: InputMaybe<Scalars['String']>;
  user_not?: InputMaybe<Scalars['String']>;
  user_not_contains?: InputMaybe<Scalars['String']>;
  user_not_contains_nocase?: InputMaybe<Scalars['String']>;
  user_not_ends_with?: InputMaybe<Scalars['String']>;
  user_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  user_not_in?: InputMaybe<Array<Scalars['String']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']>;
  user_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  user_starts_with?: InputMaybe<Scalars['String']>;
  user_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum UserStakeHistory_OrderBy {
  Id = 'id',
  StakeHistory = 'stakeHistory',
  TotalRemaining = 'totalRemaining',
  TotalStaked = 'totalStaked',
  TotalWithdrawn = 'totalWithdrawn',
  User = 'user',
}

/**
 * This is the total volumes of different actions for one user. See ProtocolStats entity for full descriptions.
 *
 */
export type UserTotal = {
  __typename?: 'UserTotal';
  id: Scalars['ID'];
  totalAmmLpFeesUsd: Scalars['BigDecimal'];
  totalAmmStakerFeesUsd: Scalars['BigDecimal'];
  totalAmmVolumeUsd: Scalars['BigDecimal'];
  totalBorrowVolumeUsd: Scalars['BigDecimal'];
  totalBorrowingFeesUsd: Scalars['BigDecimal'];
  totalCloseWithDepositVolumeUsd: Scalars['BigDecimal'];
  totalCloseWithSwapVolumeUsd: Scalars['BigDecimal'];
  totalDepositCollateralVolumeUsd: Scalars['BigDecimal'];
  totalLendVolumeUsd: Scalars['BigDecimal'];
  totalLendingFeesUsd: Scalars['BigDecimal'];
  totalLiquidateVolumeUsd: Scalars['BigDecimal'];
  totalMarginTradeVolumeUsd: Scalars['BigDecimal'];
  totalTradingFeesUsd: Scalars['BigDecimal'];
  totalUnlendVolumeUsd: Scalars['BigDecimal'];
  user: User;
};

export type UserTotal_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  totalAmmLpFeesUsd?: InputMaybe<Scalars['BigDecimal']>;
  totalAmmLpFeesUsd_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalAmmLpFeesUsd_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalAmmLpFeesUsd_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalAmmLpFeesUsd_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalAmmLpFeesUsd_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalAmmLpFeesUsd_not?: InputMaybe<Scalars['BigDecimal']>;
  totalAmmLpFeesUsd_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalAmmStakerFeesUsd?: InputMaybe<Scalars['BigDecimal']>;
  totalAmmStakerFeesUsd_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalAmmStakerFeesUsd_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalAmmStakerFeesUsd_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalAmmStakerFeesUsd_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalAmmStakerFeesUsd_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalAmmStakerFeesUsd_not?: InputMaybe<Scalars['BigDecimal']>;
  totalAmmStakerFeesUsd_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalAmmVolumeUsd?: InputMaybe<Scalars['BigDecimal']>;
  totalAmmVolumeUsd_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalAmmVolumeUsd_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalAmmVolumeUsd_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalAmmVolumeUsd_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalAmmVolumeUsd_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalAmmVolumeUsd_not?: InputMaybe<Scalars['BigDecimal']>;
  totalAmmVolumeUsd_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalBorrowVolumeUsd?: InputMaybe<Scalars['BigDecimal']>;
  totalBorrowVolumeUsd_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalBorrowVolumeUsd_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalBorrowVolumeUsd_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalBorrowVolumeUsd_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalBorrowVolumeUsd_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalBorrowVolumeUsd_not?: InputMaybe<Scalars['BigDecimal']>;
  totalBorrowVolumeUsd_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalBorrowingFeesUsd?: InputMaybe<Scalars['BigDecimal']>;
  totalBorrowingFeesUsd_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalBorrowingFeesUsd_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalBorrowingFeesUsd_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalBorrowingFeesUsd_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalBorrowingFeesUsd_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalBorrowingFeesUsd_not?: InputMaybe<Scalars['BigDecimal']>;
  totalBorrowingFeesUsd_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalCloseWithDepositVolumeUsd?: InputMaybe<Scalars['BigDecimal']>;
  totalCloseWithDepositVolumeUsd_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalCloseWithDepositVolumeUsd_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalCloseWithDepositVolumeUsd_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalCloseWithDepositVolumeUsd_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalCloseWithDepositVolumeUsd_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalCloseWithDepositVolumeUsd_not?: InputMaybe<Scalars['BigDecimal']>;
  totalCloseWithDepositVolumeUsd_not_in?: InputMaybe<
    Array<Scalars['BigDecimal']>
  >;
  totalCloseWithSwapVolumeUsd?: InputMaybe<Scalars['BigDecimal']>;
  totalCloseWithSwapVolumeUsd_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalCloseWithSwapVolumeUsd_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalCloseWithSwapVolumeUsd_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalCloseWithSwapVolumeUsd_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalCloseWithSwapVolumeUsd_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalCloseWithSwapVolumeUsd_not?: InputMaybe<Scalars['BigDecimal']>;
  totalCloseWithSwapVolumeUsd_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalDepositCollateralVolumeUsd?: InputMaybe<Scalars['BigDecimal']>;
  totalDepositCollateralVolumeUsd_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalDepositCollateralVolumeUsd_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalDepositCollateralVolumeUsd_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalDepositCollateralVolumeUsd_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalDepositCollateralVolumeUsd_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalDepositCollateralVolumeUsd_not?: InputMaybe<Scalars['BigDecimal']>;
  totalDepositCollateralVolumeUsd_not_in?: InputMaybe<
    Array<Scalars['BigDecimal']>
  >;
  totalLendVolumeUsd?: InputMaybe<Scalars['BigDecimal']>;
  totalLendVolumeUsd_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalLendVolumeUsd_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalLendVolumeUsd_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalLendVolumeUsd_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalLendVolumeUsd_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalLendVolumeUsd_not?: InputMaybe<Scalars['BigDecimal']>;
  totalLendVolumeUsd_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalLendingFeesUsd?: InputMaybe<Scalars['BigDecimal']>;
  totalLendingFeesUsd_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalLendingFeesUsd_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalLendingFeesUsd_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalLendingFeesUsd_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalLendingFeesUsd_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalLendingFeesUsd_not?: InputMaybe<Scalars['BigDecimal']>;
  totalLendingFeesUsd_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalLiquidateVolumeUsd?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidateVolumeUsd_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidateVolumeUsd_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidateVolumeUsd_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalLiquidateVolumeUsd_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidateVolumeUsd_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidateVolumeUsd_not?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidateVolumeUsd_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalMarginTradeVolumeUsd?: InputMaybe<Scalars['BigDecimal']>;
  totalMarginTradeVolumeUsd_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalMarginTradeVolumeUsd_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalMarginTradeVolumeUsd_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalMarginTradeVolumeUsd_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalMarginTradeVolumeUsd_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalMarginTradeVolumeUsd_not?: InputMaybe<Scalars['BigDecimal']>;
  totalMarginTradeVolumeUsd_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalTradingFeesUsd?: InputMaybe<Scalars['BigDecimal']>;
  totalTradingFeesUsd_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalTradingFeesUsd_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalTradingFeesUsd_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalTradingFeesUsd_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalTradingFeesUsd_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalTradingFeesUsd_not?: InputMaybe<Scalars['BigDecimal']>;
  totalTradingFeesUsd_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalUnlendVolumeUsd?: InputMaybe<Scalars['BigDecimal']>;
  totalUnlendVolumeUsd_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalUnlendVolumeUsd_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalUnlendVolumeUsd_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalUnlendVolumeUsd_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalUnlendVolumeUsd_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalUnlendVolumeUsd_not?: InputMaybe<Scalars['BigDecimal']>;
  totalUnlendVolumeUsd_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  user?: InputMaybe<Scalars['String']>;
  user_?: InputMaybe<User_Filter>;
  user_contains?: InputMaybe<Scalars['String']>;
  user_contains_nocase?: InputMaybe<Scalars['String']>;
  user_ends_with?: InputMaybe<Scalars['String']>;
  user_ends_with_nocase?: InputMaybe<Scalars['String']>;
  user_gt?: InputMaybe<Scalars['String']>;
  user_gte?: InputMaybe<Scalars['String']>;
  user_in?: InputMaybe<Array<Scalars['String']>>;
  user_lt?: InputMaybe<Scalars['String']>;
  user_lte?: InputMaybe<Scalars['String']>;
  user_not?: InputMaybe<Scalars['String']>;
  user_not_contains?: InputMaybe<Scalars['String']>;
  user_not_contains_nocase?: InputMaybe<Scalars['String']>;
  user_not_ends_with?: InputMaybe<Scalars['String']>;
  user_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  user_not_in?: InputMaybe<Array<Scalars['String']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']>;
  user_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  user_starts_with?: InputMaybe<Scalars['String']>;
  user_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum UserTotal_OrderBy {
  Id = 'id',
  TotalAmmLpFeesUsd = 'totalAmmLpFeesUsd',
  TotalAmmStakerFeesUsd = 'totalAmmStakerFeesUsd',
  TotalAmmVolumeUsd = 'totalAmmVolumeUsd',
  TotalBorrowVolumeUsd = 'totalBorrowVolumeUsd',
  TotalBorrowingFeesUsd = 'totalBorrowingFeesUsd',
  TotalCloseWithDepositVolumeUsd = 'totalCloseWithDepositVolumeUsd',
  TotalCloseWithSwapVolumeUsd = 'totalCloseWithSwapVolumeUsd',
  TotalDepositCollateralVolumeUsd = 'totalDepositCollateralVolumeUsd',
  TotalLendVolumeUsd = 'totalLendVolumeUsd',
  TotalLendingFeesUsd = 'totalLendingFeesUsd',
  TotalLiquidateVolumeUsd = 'totalLiquidateVolumeUsd',
  TotalMarginTradeVolumeUsd = 'totalMarginTradeVolumeUsd',
  TotalTradingFeesUsd = 'totalTradingFeesUsd',
  TotalUnlendVolumeUsd = 'totalUnlendVolumeUsd',
  User = 'user',
}

export type User_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  bitcoinTransfers_?: InputMaybe<BitcoinTransfer_Filter>;
  borrows_?: InputMaybe<Borrow_Filter>;
  createdAtTimestamp?: InputMaybe<Scalars['Int']>;
  createdAtTimestamp_gt?: InputMaybe<Scalars['Int']>;
  createdAtTimestamp_gte?: InputMaybe<Scalars['Int']>;
  createdAtTimestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  createdAtTimestamp_lt?: InputMaybe<Scalars['Int']>;
  createdAtTimestamp_lte?: InputMaybe<Scalars['Int']>;
  createdAtTimestamp_not?: InputMaybe<Scalars['Int']>;
  createdAtTimestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
  crossChainTransfer_?: InputMaybe<CrossTransfer_Filter>;
  currentStakes_?: InputMaybe<Stake_Filter>;
  fastBTCBridgeStats_?: InputMaybe<FastBtcBridgeStat_Filter>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  lendingHistory_?: InputMaybe<UserLendingHistory_Filter>;
  liquidations_?: InputMaybe<Liquidate_Filter>;
  liquidityHistory_?: InputMaybe<UserLiquidityHistory_Filter>;
  loans_?: InputMaybe<Loan_Filter>;
  rewardsEarnedHistory_?: InputMaybe<UserRewardsEarnedHistory_Filter>;
  stakeHistory_?: InputMaybe<UserStakeHistory_Filter>;
  swaps_?: InputMaybe<Swap_Filter>;
  trades_?: InputMaybe<Trade_Filter>;
  transactions_?: InputMaybe<Transaction_Filter>;
  userTotals_?: InputMaybe<UserTotal_Filter>;
  vestingContracts_?: InputMaybe<VestingContract_Filter>;
  votes_?: InputMaybe<VoteCast_Filter>;
};

export enum User_OrderBy {
  BitcoinTransfers = 'bitcoinTransfers',
  Borrows = 'borrows',
  CreatedAtTimestamp = 'createdAtTimestamp',
  CrossChainTransfer = 'crossChainTransfer',
  CurrentStakes = 'currentStakes',
  FastBtcBridgeStats = 'fastBTCBridgeStats',
  Id = 'id',
  LendingHistory = 'lendingHistory',
  Liquidations = 'liquidations',
  LiquidityHistory = 'liquidityHistory',
  Loans = 'loans',
  RewardsEarnedHistory = 'rewardsEarnedHistory',
  StakeHistory = 'stakeHistory',
  Swaps = 'swaps',
  Trades = 'trades',
  Transactions = 'transactions',
  UserTotals = 'userTotals',
  VestingContracts = 'vestingContracts',
  Votes = 'votes',
}

/**
 * Event is emitted when stake owner delegates voting power to another user
 *
 */
export type V2DelegateChanged = {
  __typename?: 'V2DelegateChanged';
  /**
   * Address of the new delegatee
   *
   */
  delegate?: Maybe<User>;
  id: Scalars['ID'];
  /**
   * lockedUntil date of the stake
   *
   */
  lockedUntil: Scalars['Int'];
  /**
   * Address of the previous delegatee
   *
   */
  previousDelegate?: Maybe<User>;
  /**
   * Timestamp of the transaction
   *
   */
  timestamp: Scalars['Int'];
  /**
   * The user who staked the tokens
   *
   */
  user: User;
};

export type V2DelegateChanged_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  delegate?: InputMaybe<Scalars['String']>;
  delegate_?: InputMaybe<User_Filter>;
  delegate_contains?: InputMaybe<Scalars['String']>;
  delegate_contains_nocase?: InputMaybe<Scalars['String']>;
  delegate_ends_with?: InputMaybe<Scalars['String']>;
  delegate_ends_with_nocase?: InputMaybe<Scalars['String']>;
  delegate_gt?: InputMaybe<Scalars['String']>;
  delegate_gte?: InputMaybe<Scalars['String']>;
  delegate_in?: InputMaybe<Array<Scalars['String']>>;
  delegate_lt?: InputMaybe<Scalars['String']>;
  delegate_lte?: InputMaybe<Scalars['String']>;
  delegate_not?: InputMaybe<Scalars['String']>;
  delegate_not_contains?: InputMaybe<Scalars['String']>;
  delegate_not_contains_nocase?: InputMaybe<Scalars['String']>;
  delegate_not_ends_with?: InputMaybe<Scalars['String']>;
  delegate_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  delegate_not_in?: InputMaybe<Array<Scalars['String']>>;
  delegate_not_starts_with?: InputMaybe<Scalars['String']>;
  delegate_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  delegate_starts_with?: InputMaybe<Scalars['String']>;
  delegate_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  lockedUntil?: InputMaybe<Scalars['Int']>;
  lockedUntil_gt?: InputMaybe<Scalars['Int']>;
  lockedUntil_gte?: InputMaybe<Scalars['Int']>;
  lockedUntil_in?: InputMaybe<Array<Scalars['Int']>>;
  lockedUntil_lt?: InputMaybe<Scalars['Int']>;
  lockedUntil_lte?: InputMaybe<Scalars['Int']>;
  lockedUntil_not?: InputMaybe<Scalars['Int']>;
  lockedUntil_not_in?: InputMaybe<Array<Scalars['Int']>>;
  previousDelegate?: InputMaybe<Scalars['String']>;
  previousDelegate_?: InputMaybe<User_Filter>;
  previousDelegate_contains?: InputMaybe<Scalars['String']>;
  previousDelegate_contains_nocase?: InputMaybe<Scalars['String']>;
  previousDelegate_ends_with?: InputMaybe<Scalars['String']>;
  previousDelegate_ends_with_nocase?: InputMaybe<Scalars['String']>;
  previousDelegate_gt?: InputMaybe<Scalars['String']>;
  previousDelegate_gte?: InputMaybe<Scalars['String']>;
  previousDelegate_in?: InputMaybe<Array<Scalars['String']>>;
  previousDelegate_lt?: InputMaybe<Scalars['String']>;
  previousDelegate_lte?: InputMaybe<Scalars['String']>;
  previousDelegate_not?: InputMaybe<Scalars['String']>;
  previousDelegate_not_contains?: InputMaybe<Scalars['String']>;
  previousDelegate_not_contains_nocase?: InputMaybe<Scalars['String']>;
  previousDelegate_not_ends_with?: InputMaybe<Scalars['String']>;
  previousDelegate_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  previousDelegate_not_in?: InputMaybe<Array<Scalars['String']>>;
  previousDelegate_not_starts_with?: InputMaybe<Scalars['String']>;
  previousDelegate_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  previousDelegate_starts_with?: InputMaybe<Scalars['String']>;
  previousDelegate_starts_with_nocase?: InputMaybe<Scalars['String']>;
  timestamp?: InputMaybe<Scalars['Int']>;
  timestamp_gt?: InputMaybe<Scalars['Int']>;
  timestamp_gte?: InputMaybe<Scalars['Int']>;
  timestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp_lt?: InputMaybe<Scalars['Int']>;
  timestamp_lte?: InputMaybe<Scalars['Int']>;
  timestamp_not?: InputMaybe<Scalars['Int']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
  user?: InputMaybe<Scalars['String']>;
  user_?: InputMaybe<User_Filter>;
  user_contains?: InputMaybe<Scalars['String']>;
  user_contains_nocase?: InputMaybe<Scalars['String']>;
  user_ends_with?: InputMaybe<Scalars['String']>;
  user_ends_with_nocase?: InputMaybe<Scalars['String']>;
  user_gt?: InputMaybe<Scalars['String']>;
  user_gte?: InputMaybe<Scalars['String']>;
  user_in?: InputMaybe<Array<Scalars['String']>>;
  user_lt?: InputMaybe<Scalars['String']>;
  user_lte?: InputMaybe<Scalars['String']>;
  user_not?: InputMaybe<Scalars['String']>;
  user_not_contains?: InputMaybe<Scalars['String']>;
  user_not_contains_nocase?: InputMaybe<Scalars['String']>;
  user_not_ends_with?: InputMaybe<Scalars['String']>;
  user_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  user_not_in?: InputMaybe<Array<Scalars['String']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']>;
  user_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  user_starts_with?: InputMaybe<Scalars['String']>;
  user_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum V2DelegateChanged_OrderBy {
  Delegate = 'delegate',
  Id = 'id',
  LockedUntil = 'lockedUntil',
  PreviousDelegate = 'previousDelegate',
  Timestamp = 'timestamp',
  User = 'user',
}

/**
 * Event is emitted when voluntary staked token lockedUntil date is extended
 *
 */
export type V2ExtendedStakingDuration = {
  __typename?: 'V2ExtendedStakingDuration';
  /**
   * Amount that was moved to the new lockedUntil date
   *
   */
  amountStaked: Scalars['BigDecimal'];
  id: Scalars['ID'];
  /**
   * New lockedUntil date
   *
   */
  newDate: Scalars['Int'];
  /**
   * LockedUntil date of original stake
   *
   */
  previousDate: Scalars['Int'];
  /**
   * Timestamp of the transaction
   *
   */
  timestamp: Scalars['Int'];
  /**
   * The user who staked the tokens
   *
   */
  user: User;
};

export type V2ExtendedStakingDuration_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amountStaked?: InputMaybe<Scalars['BigDecimal']>;
  amountStaked_gt?: InputMaybe<Scalars['BigDecimal']>;
  amountStaked_gte?: InputMaybe<Scalars['BigDecimal']>;
  amountStaked_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  amountStaked_lt?: InputMaybe<Scalars['BigDecimal']>;
  amountStaked_lte?: InputMaybe<Scalars['BigDecimal']>;
  amountStaked_not?: InputMaybe<Scalars['BigDecimal']>;
  amountStaked_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  newDate?: InputMaybe<Scalars['Int']>;
  newDate_gt?: InputMaybe<Scalars['Int']>;
  newDate_gte?: InputMaybe<Scalars['Int']>;
  newDate_in?: InputMaybe<Array<Scalars['Int']>>;
  newDate_lt?: InputMaybe<Scalars['Int']>;
  newDate_lte?: InputMaybe<Scalars['Int']>;
  newDate_not?: InputMaybe<Scalars['Int']>;
  newDate_not_in?: InputMaybe<Array<Scalars['Int']>>;
  previousDate?: InputMaybe<Scalars['Int']>;
  previousDate_gt?: InputMaybe<Scalars['Int']>;
  previousDate_gte?: InputMaybe<Scalars['Int']>;
  previousDate_in?: InputMaybe<Array<Scalars['Int']>>;
  previousDate_lt?: InputMaybe<Scalars['Int']>;
  previousDate_lte?: InputMaybe<Scalars['Int']>;
  previousDate_not?: InputMaybe<Scalars['Int']>;
  previousDate_not_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp?: InputMaybe<Scalars['Int']>;
  timestamp_gt?: InputMaybe<Scalars['Int']>;
  timestamp_gte?: InputMaybe<Scalars['Int']>;
  timestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp_lt?: InputMaybe<Scalars['Int']>;
  timestamp_lte?: InputMaybe<Scalars['Int']>;
  timestamp_not?: InputMaybe<Scalars['Int']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
  user?: InputMaybe<Scalars['String']>;
  user_?: InputMaybe<User_Filter>;
  user_contains?: InputMaybe<Scalars['String']>;
  user_contains_nocase?: InputMaybe<Scalars['String']>;
  user_ends_with?: InputMaybe<Scalars['String']>;
  user_ends_with_nocase?: InputMaybe<Scalars['String']>;
  user_gt?: InputMaybe<Scalars['String']>;
  user_gte?: InputMaybe<Scalars['String']>;
  user_in?: InputMaybe<Array<Scalars['String']>>;
  user_lt?: InputMaybe<Scalars['String']>;
  user_lte?: InputMaybe<Scalars['String']>;
  user_not?: InputMaybe<Scalars['String']>;
  user_not_contains?: InputMaybe<Scalars['String']>;
  user_not_contains_nocase?: InputMaybe<Scalars['String']>;
  user_not_ends_with?: InputMaybe<Scalars['String']>;
  user_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  user_not_in?: InputMaybe<Array<Scalars['String']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']>;
  user_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  user_starts_with?: InputMaybe<Scalars['String']>;
  user_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum V2ExtendedStakingDuration_OrderBy {
  AmountStaked = 'amountStaked',
  Id = 'id',
  NewDate = 'newDate',
  PreviousDate = 'previousDate',
  Timestamp = 'timestamp',
  User = 'user',
}

/**
 * Voluntary staked tokens grouped by lockedUntil date
 *
 */
export type V2Stake = {
  __typename?: 'V2Stake';
  /**
   * The total amount staked for this specific user until this specific lockedUntil date
   *
   */
  amount: Scalars['BigDecimal'];
  /**
   * If tokens delegated to another user, this is the address of the delegatee
   *
   */
  delegate?: Maybe<User>;
  /**
   * ID is the user address + lockedUntil date.
   *
   */
  id: Scalars['ID'];
  /**
   * The date when these tokens will unlock
   *
   */
  lockedUntil: Scalars['Int'];
  /**
   * Timestamp of a date when the stake was created
   *
   */
  timestamp: Scalars['Int'];
  /**
   * The user who staked the tokens
   *
   */
  user: User;
};

export type V2Stake_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars['BigDecimal']>;
  amount_gt?: InputMaybe<Scalars['BigDecimal']>;
  amount_gte?: InputMaybe<Scalars['BigDecimal']>;
  amount_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  amount_lt?: InputMaybe<Scalars['BigDecimal']>;
  amount_lte?: InputMaybe<Scalars['BigDecimal']>;
  amount_not?: InputMaybe<Scalars['BigDecimal']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  delegate?: InputMaybe<Scalars['String']>;
  delegate_?: InputMaybe<User_Filter>;
  delegate_contains?: InputMaybe<Scalars['String']>;
  delegate_contains_nocase?: InputMaybe<Scalars['String']>;
  delegate_ends_with?: InputMaybe<Scalars['String']>;
  delegate_ends_with_nocase?: InputMaybe<Scalars['String']>;
  delegate_gt?: InputMaybe<Scalars['String']>;
  delegate_gte?: InputMaybe<Scalars['String']>;
  delegate_in?: InputMaybe<Array<Scalars['String']>>;
  delegate_lt?: InputMaybe<Scalars['String']>;
  delegate_lte?: InputMaybe<Scalars['String']>;
  delegate_not?: InputMaybe<Scalars['String']>;
  delegate_not_contains?: InputMaybe<Scalars['String']>;
  delegate_not_contains_nocase?: InputMaybe<Scalars['String']>;
  delegate_not_ends_with?: InputMaybe<Scalars['String']>;
  delegate_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  delegate_not_in?: InputMaybe<Array<Scalars['String']>>;
  delegate_not_starts_with?: InputMaybe<Scalars['String']>;
  delegate_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  delegate_starts_with?: InputMaybe<Scalars['String']>;
  delegate_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  lockedUntil?: InputMaybe<Scalars['Int']>;
  lockedUntil_gt?: InputMaybe<Scalars['Int']>;
  lockedUntil_gte?: InputMaybe<Scalars['Int']>;
  lockedUntil_in?: InputMaybe<Array<Scalars['Int']>>;
  lockedUntil_lt?: InputMaybe<Scalars['Int']>;
  lockedUntil_lte?: InputMaybe<Scalars['Int']>;
  lockedUntil_not?: InputMaybe<Scalars['Int']>;
  lockedUntil_not_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp?: InputMaybe<Scalars['Int']>;
  timestamp_gt?: InputMaybe<Scalars['Int']>;
  timestamp_gte?: InputMaybe<Scalars['Int']>;
  timestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp_lt?: InputMaybe<Scalars['Int']>;
  timestamp_lte?: InputMaybe<Scalars['Int']>;
  timestamp_not?: InputMaybe<Scalars['Int']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
  user?: InputMaybe<Scalars['String']>;
  user_?: InputMaybe<User_Filter>;
  user_contains?: InputMaybe<Scalars['String']>;
  user_contains_nocase?: InputMaybe<Scalars['String']>;
  user_ends_with?: InputMaybe<Scalars['String']>;
  user_ends_with_nocase?: InputMaybe<Scalars['String']>;
  user_gt?: InputMaybe<Scalars['String']>;
  user_gte?: InputMaybe<Scalars['String']>;
  user_in?: InputMaybe<Array<Scalars['String']>>;
  user_lt?: InputMaybe<Scalars['String']>;
  user_lte?: InputMaybe<Scalars['String']>;
  user_not?: InputMaybe<Scalars['String']>;
  user_not_contains?: InputMaybe<Scalars['String']>;
  user_not_contains_nocase?: InputMaybe<Scalars['String']>;
  user_not_ends_with?: InputMaybe<Scalars['String']>;
  user_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  user_not_in?: InputMaybe<Array<Scalars['String']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']>;
  user_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  user_starts_with?: InputMaybe<Scalars['String']>;
  user_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum V2Stake_OrderBy {
  Amount = 'amount',
  Delegate = 'delegate',
  Id = 'id',
  LockedUntil = 'lockedUntil',
  Timestamp = 'timestamp',
  User = 'user',
}

/**
 * Event is emitted when voluntary or vested staked tokens are withdrawn
 *
 */
export type V2StakingWithdrawn = {
  __typename?: 'V2StakingWithdrawn';
  /**
   * Amount of tokens withdrawn (does not include slashed amount)
   *
   */
  amount: Scalars['BigDecimal'];
  id: Scalars['ID'];
  /**
   * If this is true, tokens were withdrawn by governance (eg revoked vesting contract)
   *
   */
  isGovernance: Scalars['Boolean'];
  /**
   * Address who received the tokens
   *
   */
  receiver?: Maybe<User>;
  /**
   * Slashed amount when tokens are withdrawn before lockedUntil date
   *
   */
  slashedAmount: Scalars['BigDecimal'];
  /**
   * Timestamp of the transaction
   *
   */
  timestamp: Scalars['Int'];
  /**
   * lockedUntil date of the stake from which tokens were withdrawn
   *
   */
  until: Scalars['Int'];
  /**
   * The user who staked the tokens (owner of tokens)
   *
   */
  user: User;
};

export type V2StakingWithdrawn_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars['BigDecimal']>;
  amount_gt?: InputMaybe<Scalars['BigDecimal']>;
  amount_gte?: InputMaybe<Scalars['BigDecimal']>;
  amount_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  amount_lt?: InputMaybe<Scalars['BigDecimal']>;
  amount_lte?: InputMaybe<Scalars['BigDecimal']>;
  amount_not?: InputMaybe<Scalars['BigDecimal']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  isGovernance?: InputMaybe<Scalars['Boolean']>;
  isGovernance_in?: InputMaybe<Array<Scalars['Boolean']>>;
  isGovernance_not?: InputMaybe<Scalars['Boolean']>;
  isGovernance_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  receiver?: InputMaybe<Scalars['String']>;
  receiver_?: InputMaybe<User_Filter>;
  receiver_contains?: InputMaybe<Scalars['String']>;
  receiver_contains_nocase?: InputMaybe<Scalars['String']>;
  receiver_ends_with?: InputMaybe<Scalars['String']>;
  receiver_ends_with_nocase?: InputMaybe<Scalars['String']>;
  receiver_gt?: InputMaybe<Scalars['String']>;
  receiver_gte?: InputMaybe<Scalars['String']>;
  receiver_in?: InputMaybe<Array<Scalars['String']>>;
  receiver_lt?: InputMaybe<Scalars['String']>;
  receiver_lte?: InputMaybe<Scalars['String']>;
  receiver_not?: InputMaybe<Scalars['String']>;
  receiver_not_contains?: InputMaybe<Scalars['String']>;
  receiver_not_contains_nocase?: InputMaybe<Scalars['String']>;
  receiver_not_ends_with?: InputMaybe<Scalars['String']>;
  receiver_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  receiver_not_in?: InputMaybe<Array<Scalars['String']>>;
  receiver_not_starts_with?: InputMaybe<Scalars['String']>;
  receiver_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  receiver_starts_with?: InputMaybe<Scalars['String']>;
  receiver_starts_with_nocase?: InputMaybe<Scalars['String']>;
  slashedAmount?: InputMaybe<Scalars['BigDecimal']>;
  slashedAmount_gt?: InputMaybe<Scalars['BigDecimal']>;
  slashedAmount_gte?: InputMaybe<Scalars['BigDecimal']>;
  slashedAmount_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  slashedAmount_lt?: InputMaybe<Scalars['BigDecimal']>;
  slashedAmount_lte?: InputMaybe<Scalars['BigDecimal']>;
  slashedAmount_not?: InputMaybe<Scalars['BigDecimal']>;
  slashedAmount_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  timestamp?: InputMaybe<Scalars['Int']>;
  timestamp_gt?: InputMaybe<Scalars['Int']>;
  timestamp_gte?: InputMaybe<Scalars['Int']>;
  timestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp_lt?: InputMaybe<Scalars['Int']>;
  timestamp_lte?: InputMaybe<Scalars['Int']>;
  timestamp_not?: InputMaybe<Scalars['Int']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
  until?: InputMaybe<Scalars['Int']>;
  until_gt?: InputMaybe<Scalars['Int']>;
  until_gte?: InputMaybe<Scalars['Int']>;
  until_in?: InputMaybe<Array<Scalars['Int']>>;
  until_lt?: InputMaybe<Scalars['Int']>;
  until_lte?: InputMaybe<Scalars['Int']>;
  until_not?: InputMaybe<Scalars['Int']>;
  until_not_in?: InputMaybe<Array<Scalars['Int']>>;
  user?: InputMaybe<Scalars['String']>;
  user_?: InputMaybe<User_Filter>;
  user_contains?: InputMaybe<Scalars['String']>;
  user_contains_nocase?: InputMaybe<Scalars['String']>;
  user_ends_with?: InputMaybe<Scalars['String']>;
  user_ends_with_nocase?: InputMaybe<Scalars['String']>;
  user_gt?: InputMaybe<Scalars['String']>;
  user_gte?: InputMaybe<Scalars['String']>;
  user_in?: InputMaybe<Array<Scalars['String']>>;
  user_lt?: InputMaybe<Scalars['String']>;
  user_lte?: InputMaybe<Scalars['String']>;
  user_not?: InputMaybe<Scalars['String']>;
  user_not_contains?: InputMaybe<Scalars['String']>;
  user_not_contains_nocase?: InputMaybe<Scalars['String']>;
  user_not_ends_with?: InputMaybe<Scalars['String']>;
  user_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  user_not_in?: InputMaybe<Array<Scalars['String']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']>;
  user_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  user_starts_with?: InputMaybe<Scalars['String']>;
  user_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum V2StakingWithdrawn_OrderBy {
  Amount = 'amount',
  Id = 'id',
  IsGovernance = 'isGovernance',
  Receiver = 'receiver',
  SlashedAmount = 'slashedAmount',
  Timestamp = 'timestamp',
  Until = 'until',
  User = 'user',
}

/**
 * This event is emitted when tokens are staked, either by a user or by a vesting contract.
 *
 */
export type V2TokensStaked = {
  __typename?: 'V2TokensStaked';
  /**
   * Amount of SOV staked in this event
   *
   */
  amount: Scalars['BigDecimal'];
  id: Scalars['ID'];
  /**
   * The date when these tokens will unlock
   *
   */
  lockedUntil: Scalars['Int'];
  /**
   * Timestamp of the transaction
   *
   */
  timestamp: Scalars['Int'];
  /**
   * The total amount staked for this specific user until this specific lockedUntil date. As of the time of this event.
   *
   */
  totalStaked: Scalars['BigDecimal'];
  /**
   * The user who staked the tokens (if tokens were staked by a vesting contract, user will be staking contract)
   *
   */
  user: User;
};

export type V2TokensStaked_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars['BigDecimal']>;
  amount_gt?: InputMaybe<Scalars['BigDecimal']>;
  amount_gte?: InputMaybe<Scalars['BigDecimal']>;
  amount_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  amount_lt?: InputMaybe<Scalars['BigDecimal']>;
  amount_lte?: InputMaybe<Scalars['BigDecimal']>;
  amount_not?: InputMaybe<Scalars['BigDecimal']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  lockedUntil?: InputMaybe<Scalars['Int']>;
  lockedUntil_gt?: InputMaybe<Scalars['Int']>;
  lockedUntil_gte?: InputMaybe<Scalars['Int']>;
  lockedUntil_in?: InputMaybe<Array<Scalars['Int']>>;
  lockedUntil_lt?: InputMaybe<Scalars['Int']>;
  lockedUntil_lte?: InputMaybe<Scalars['Int']>;
  lockedUntil_not?: InputMaybe<Scalars['Int']>;
  lockedUntil_not_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp?: InputMaybe<Scalars['Int']>;
  timestamp_gt?: InputMaybe<Scalars['Int']>;
  timestamp_gte?: InputMaybe<Scalars['Int']>;
  timestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp_lt?: InputMaybe<Scalars['Int']>;
  timestamp_lte?: InputMaybe<Scalars['Int']>;
  timestamp_not?: InputMaybe<Scalars['Int']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
  totalStaked?: InputMaybe<Scalars['BigDecimal']>;
  totalStaked_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalStaked_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalStaked_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalStaked_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalStaked_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalStaked_not?: InputMaybe<Scalars['BigDecimal']>;
  totalStaked_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  user?: InputMaybe<Scalars['String']>;
  user_?: InputMaybe<User_Filter>;
  user_contains?: InputMaybe<Scalars['String']>;
  user_contains_nocase?: InputMaybe<Scalars['String']>;
  user_ends_with?: InputMaybe<Scalars['String']>;
  user_ends_with_nocase?: InputMaybe<Scalars['String']>;
  user_gt?: InputMaybe<Scalars['String']>;
  user_gte?: InputMaybe<Scalars['String']>;
  user_in?: InputMaybe<Array<Scalars['String']>>;
  user_lt?: InputMaybe<Scalars['String']>;
  user_lte?: InputMaybe<Scalars['String']>;
  user_not?: InputMaybe<Scalars['String']>;
  user_not_contains?: InputMaybe<Scalars['String']>;
  user_not_contains_nocase?: InputMaybe<Scalars['String']>;
  user_not_ends_with?: InputMaybe<Scalars['String']>;
  user_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  user_not_in?: InputMaybe<Array<Scalars['String']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']>;
  user_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  user_starts_with?: InputMaybe<Scalars['String']>;
  user_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum V2TokensStaked_OrderBy {
  Amount = 'amount',
  Id = 'id',
  LockedUntil = 'lockedUntil',
  Timestamp = 'timestamp',
  TotalStaked = 'totalStaked',
  User = 'user',
}

/**
 * This entity represents one vesting contract
 * A User can have multiple vesting contracts
 *
 */
export type VestingContract = {
  __typename?: 'VestingContract';
  /**
   * The cliff is the period (in seconds) until the first tokens become liquid on this contract
   *
   */
  cliff?: Maybe<Scalars['Int']>;
  /**
   * Date that the vesting contract was created
   *
   */
  createdAtTimestamp: Scalars['Int'];
  createdAtTransaction: Transaction;
  /**
   * Current balance of tokens on the contract, including locked and liquid tokens that have not been withdrawn.
   * Incremented on TokensStaked actions, decremented on TokensWithdrawn actions
   *
   */
  currentBalance: Scalars['BigDecimal'];
  /**
   * Delegated too
   *
   */
  delegate?: Maybe<User>;
  /**
   * The total duration of the vesting contract, including the cliff, in seconds.
   * For example, a 9 month vesting contract with a 1 month cliff would have a duration of 26280000 (10 months in seconds)
   *
   */
  duration?: Maybe<Scalars['Int']>;
  emittedBy: Scalars['Bytes'];
  /**
   * ID is the vesting contract address
   *
   */
  id: Scalars['ID'];
  /**
   * A granular history of every action involving this vesting contract
   *
   */
  stakeHistory?: Maybe<Array<VestingHistoryItem>>;
  /**
   * Staking contract address
   *
   */
  staking: Scalars['Bytes'];
  /**
   * The initial balance when this contract was created. This is often 0, as tokens can be added to the contract after contract creation
   *
   */
  startingBalance: Scalars['BigDecimal'];
  /**
   * Token staked in this vesting contract
   *
   */
  token: Scalars['Bytes'];
  /**
   * Type of contract (see VestingContractType docs for more details)
   *
   */
  type: VestingContractType;
  /**
   * The owner of the vesting contract
   *
   */
  user: User;
};

/**
 * This entity represents one vesting contract
 * A User can have multiple vesting contracts
 *
 */
export type VestingContractStakeHistoryArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<VestingHistoryItem_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<VestingHistoryItem_Filter>;
};

export enum VestingContractType {
  /**
   * FISH (Babelfish governance token) vesting contracts
   *
   */
  Fish = 'Fish',
  /**
   * Babelfish team vesting contracts
   *
   */
  FishTeam = 'FishTeam',
  /**
   * Vesting contracts for strategic investors with a four-year lockup
   *
   */
  FourYearVesting = 'FourYearVesting',
  /**
   * Vesting contracts for investors who participated in the Sovryn Genesis sale
   *
   */
  Genesis = 'Genesis',
  /**
   * Vesting contracts for investors who participated in the Sovryn Origin sale
   *
   */
  Origins = 'Origins',
  /**
   * Vesting contracts for vested rewards
   *
   */
  Rewards = 'Rewards',
  /**
   * Vesting contracts for early strategic investors
   *
   */
  Strategic = 'Strategic',
  /**
   * Sovryn team vesting contracts
   *
   */
  Team = 'Team',
}

export type VestingContract_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  cliff?: InputMaybe<Scalars['Int']>;
  cliff_gt?: InputMaybe<Scalars['Int']>;
  cliff_gte?: InputMaybe<Scalars['Int']>;
  cliff_in?: InputMaybe<Array<Scalars['Int']>>;
  cliff_lt?: InputMaybe<Scalars['Int']>;
  cliff_lte?: InputMaybe<Scalars['Int']>;
  cliff_not?: InputMaybe<Scalars['Int']>;
  cliff_not_in?: InputMaybe<Array<Scalars['Int']>>;
  createdAtTimestamp?: InputMaybe<Scalars['Int']>;
  createdAtTimestamp_gt?: InputMaybe<Scalars['Int']>;
  createdAtTimestamp_gte?: InputMaybe<Scalars['Int']>;
  createdAtTimestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  createdAtTimestamp_lt?: InputMaybe<Scalars['Int']>;
  createdAtTimestamp_lte?: InputMaybe<Scalars['Int']>;
  createdAtTimestamp_not?: InputMaybe<Scalars['Int']>;
  createdAtTimestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
  createdAtTransaction?: InputMaybe<Scalars['String']>;
  createdAtTransaction_?: InputMaybe<Transaction_Filter>;
  createdAtTransaction_contains?: InputMaybe<Scalars['String']>;
  createdAtTransaction_contains_nocase?: InputMaybe<Scalars['String']>;
  createdAtTransaction_ends_with?: InputMaybe<Scalars['String']>;
  createdAtTransaction_ends_with_nocase?: InputMaybe<Scalars['String']>;
  createdAtTransaction_gt?: InputMaybe<Scalars['String']>;
  createdAtTransaction_gte?: InputMaybe<Scalars['String']>;
  createdAtTransaction_in?: InputMaybe<Array<Scalars['String']>>;
  createdAtTransaction_lt?: InputMaybe<Scalars['String']>;
  createdAtTransaction_lte?: InputMaybe<Scalars['String']>;
  createdAtTransaction_not?: InputMaybe<Scalars['String']>;
  createdAtTransaction_not_contains?: InputMaybe<Scalars['String']>;
  createdAtTransaction_not_contains_nocase?: InputMaybe<Scalars['String']>;
  createdAtTransaction_not_ends_with?: InputMaybe<Scalars['String']>;
  createdAtTransaction_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  createdAtTransaction_not_in?: InputMaybe<Array<Scalars['String']>>;
  createdAtTransaction_not_starts_with?: InputMaybe<Scalars['String']>;
  createdAtTransaction_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  createdAtTransaction_starts_with?: InputMaybe<Scalars['String']>;
  createdAtTransaction_starts_with_nocase?: InputMaybe<Scalars['String']>;
  currentBalance?: InputMaybe<Scalars['BigDecimal']>;
  currentBalance_gt?: InputMaybe<Scalars['BigDecimal']>;
  currentBalance_gte?: InputMaybe<Scalars['BigDecimal']>;
  currentBalance_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  currentBalance_lt?: InputMaybe<Scalars['BigDecimal']>;
  currentBalance_lte?: InputMaybe<Scalars['BigDecimal']>;
  currentBalance_not?: InputMaybe<Scalars['BigDecimal']>;
  currentBalance_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  delegate?: InputMaybe<Scalars['String']>;
  delegate_?: InputMaybe<User_Filter>;
  delegate_contains?: InputMaybe<Scalars['String']>;
  delegate_contains_nocase?: InputMaybe<Scalars['String']>;
  delegate_ends_with?: InputMaybe<Scalars['String']>;
  delegate_ends_with_nocase?: InputMaybe<Scalars['String']>;
  delegate_gt?: InputMaybe<Scalars['String']>;
  delegate_gte?: InputMaybe<Scalars['String']>;
  delegate_in?: InputMaybe<Array<Scalars['String']>>;
  delegate_lt?: InputMaybe<Scalars['String']>;
  delegate_lte?: InputMaybe<Scalars['String']>;
  delegate_not?: InputMaybe<Scalars['String']>;
  delegate_not_contains?: InputMaybe<Scalars['String']>;
  delegate_not_contains_nocase?: InputMaybe<Scalars['String']>;
  delegate_not_ends_with?: InputMaybe<Scalars['String']>;
  delegate_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  delegate_not_in?: InputMaybe<Array<Scalars['String']>>;
  delegate_not_starts_with?: InputMaybe<Scalars['String']>;
  delegate_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  delegate_starts_with?: InputMaybe<Scalars['String']>;
  delegate_starts_with_nocase?: InputMaybe<Scalars['String']>;
  duration?: InputMaybe<Scalars['Int']>;
  duration_gt?: InputMaybe<Scalars['Int']>;
  duration_gte?: InputMaybe<Scalars['Int']>;
  duration_in?: InputMaybe<Array<Scalars['Int']>>;
  duration_lt?: InputMaybe<Scalars['Int']>;
  duration_lte?: InputMaybe<Scalars['Int']>;
  duration_not?: InputMaybe<Scalars['Int']>;
  duration_not_in?: InputMaybe<Array<Scalars['Int']>>;
  emittedBy?: InputMaybe<Scalars['Bytes']>;
  emittedBy_contains?: InputMaybe<Scalars['Bytes']>;
  emittedBy_in?: InputMaybe<Array<Scalars['Bytes']>>;
  emittedBy_not?: InputMaybe<Scalars['Bytes']>;
  emittedBy_not_contains?: InputMaybe<Scalars['Bytes']>;
  emittedBy_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  stakeHistory_?: InputMaybe<VestingHistoryItem_Filter>;
  staking?: InputMaybe<Scalars['Bytes']>;
  staking_contains?: InputMaybe<Scalars['Bytes']>;
  staking_in?: InputMaybe<Array<Scalars['Bytes']>>;
  staking_not?: InputMaybe<Scalars['Bytes']>;
  staking_not_contains?: InputMaybe<Scalars['Bytes']>;
  staking_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  startingBalance?: InputMaybe<Scalars['BigDecimal']>;
  startingBalance_gt?: InputMaybe<Scalars['BigDecimal']>;
  startingBalance_gte?: InputMaybe<Scalars['BigDecimal']>;
  startingBalance_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  startingBalance_lt?: InputMaybe<Scalars['BigDecimal']>;
  startingBalance_lte?: InputMaybe<Scalars['BigDecimal']>;
  startingBalance_not?: InputMaybe<Scalars['BigDecimal']>;
  startingBalance_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  token?: InputMaybe<Scalars['Bytes']>;
  token_contains?: InputMaybe<Scalars['Bytes']>;
  token_in?: InputMaybe<Array<Scalars['Bytes']>>;
  token_not?: InputMaybe<Scalars['Bytes']>;
  token_not_contains?: InputMaybe<Scalars['Bytes']>;
  token_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  type?: InputMaybe<VestingContractType>;
  type_in?: InputMaybe<Array<VestingContractType>>;
  type_not?: InputMaybe<VestingContractType>;
  type_not_in?: InputMaybe<Array<VestingContractType>>;
  user?: InputMaybe<Scalars['String']>;
  user_?: InputMaybe<User_Filter>;
  user_contains?: InputMaybe<Scalars['String']>;
  user_contains_nocase?: InputMaybe<Scalars['String']>;
  user_ends_with?: InputMaybe<Scalars['String']>;
  user_ends_with_nocase?: InputMaybe<Scalars['String']>;
  user_gt?: InputMaybe<Scalars['String']>;
  user_gte?: InputMaybe<Scalars['String']>;
  user_in?: InputMaybe<Array<Scalars['String']>>;
  user_lt?: InputMaybe<Scalars['String']>;
  user_lte?: InputMaybe<Scalars['String']>;
  user_not?: InputMaybe<Scalars['String']>;
  user_not_contains?: InputMaybe<Scalars['String']>;
  user_not_contains_nocase?: InputMaybe<Scalars['String']>;
  user_not_ends_with?: InputMaybe<Scalars['String']>;
  user_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  user_not_in?: InputMaybe<Array<Scalars['String']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']>;
  user_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  user_starts_with?: InputMaybe<Scalars['String']>;
  user_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum VestingContract_OrderBy {
  Cliff = 'cliff',
  CreatedAtTimestamp = 'createdAtTimestamp',
  CreatedAtTransaction = 'createdAtTransaction',
  CurrentBalance = 'currentBalance',
  Delegate = 'delegate',
  Duration = 'duration',
  EmittedBy = 'emittedBy',
  Id = 'id',
  StakeHistory = 'stakeHistory',
  Staking = 'staking',
  StartingBalance = 'startingBalance',
  Token = 'token',
  Type = 'type',
  User = 'user',
}

/**
 * Granular data for each vesting contract, and any actions involving that contract
 *
 */
export type VestingHistoryItem = {
  __typename?: 'VestingHistoryItem';
  action: VestingHistoryItemAction;
  /**
   * Amount being staked
   *
   */
  amount: Scalars['BigDecimal'];
  /**
   * Delegated too
   *
   */
  delegatee?: Maybe<User>;
  emittedBy: Scalars['Bytes'];
  /**
   * ID is transaction hash + "-" + log index
   * For TokensStaked actions, there can be multiple actions per transactions, and each will create a new entity
   *
   */
  id: Scalars['ID'];
  /**
   * The date when the tokens become unlocked
   *
   */
  lockedUntil?: Maybe<Scalars['Int']>;
  /**
   * The staker here will always be the vesting contract
   *
   */
  staker: VestingContract;
  timestamp: Scalars['Int'];
  /**
   * Total number of tokens staked until this lockedUntil date
   *
   */
  totalStaked: Scalars['BigDecimal'];
  transaction: Transaction;
};

export enum VestingHistoryItemAction {
  /**
   * When a user delegates their vesting contract to another user
   *
   */
  DelegateChanged = 'DelegateChanged',
  /**
   * This is only relevant to Team tokens. For Team contracts, a vesting contract can be revoked by governance if a team member leaves the project.
   * If this happens, all tokens still locked are returned to the exchequer.
   * This is ONLY possible with Team or FishTeam vesting contracts.
   *
   */
  TeamTokensRevoked = 'TeamTokensRevoked',
  /**
   * Tokens are staked by the Vesting contract. This happens when the Vesting contract receives funds.
   *
   */
  TokensStaked = 'TokensStaked',
  /**
   * When a user withdraws unlocked tokens from the vesting contract
   *
   */
  TokensWithdrawn = 'TokensWithdrawn',
}

export type VestingHistoryItem_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  action?: InputMaybe<VestingHistoryItemAction>;
  action_in?: InputMaybe<Array<VestingHistoryItemAction>>;
  action_not?: InputMaybe<VestingHistoryItemAction>;
  action_not_in?: InputMaybe<Array<VestingHistoryItemAction>>;
  amount?: InputMaybe<Scalars['BigDecimal']>;
  amount_gt?: InputMaybe<Scalars['BigDecimal']>;
  amount_gte?: InputMaybe<Scalars['BigDecimal']>;
  amount_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  amount_lt?: InputMaybe<Scalars['BigDecimal']>;
  amount_lte?: InputMaybe<Scalars['BigDecimal']>;
  amount_not?: InputMaybe<Scalars['BigDecimal']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  delegatee?: InputMaybe<Scalars['String']>;
  delegatee_?: InputMaybe<User_Filter>;
  delegatee_contains?: InputMaybe<Scalars['String']>;
  delegatee_contains_nocase?: InputMaybe<Scalars['String']>;
  delegatee_ends_with?: InputMaybe<Scalars['String']>;
  delegatee_ends_with_nocase?: InputMaybe<Scalars['String']>;
  delegatee_gt?: InputMaybe<Scalars['String']>;
  delegatee_gte?: InputMaybe<Scalars['String']>;
  delegatee_in?: InputMaybe<Array<Scalars['String']>>;
  delegatee_lt?: InputMaybe<Scalars['String']>;
  delegatee_lte?: InputMaybe<Scalars['String']>;
  delegatee_not?: InputMaybe<Scalars['String']>;
  delegatee_not_contains?: InputMaybe<Scalars['String']>;
  delegatee_not_contains_nocase?: InputMaybe<Scalars['String']>;
  delegatee_not_ends_with?: InputMaybe<Scalars['String']>;
  delegatee_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  delegatee_not_in?: InputMaybe<Array<Scalars['String']>>;
  delegatee_not_starts_with?: InputMaybe<Scalars['String']>;
  delegatee_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  delegatee_starts_with?: InputMaybe<Scalars['String']>;
  delegatee_starts_with_nocase?: InputMaybe<Scalars['String']>;
  emittedBy?: InputMaybe<Scalars['Bytes']>;
  emittedBy_contains?: InputMaybe<Scalars['Bytes']>;
  emittedBy_in?: InputMaybe<Array<Scalars['Bytes']>>;
  emittedBy_not?: InputMaybe<Scalars['Bytes']>;
  emittedBy_not_contains?: InputMaybe<Scalars['Bytes']>;
  emittedBy_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  lockedUntil?: InputMaybe<Scalars['Int']>;
  lockedUntil_gt?: InputMaybe<Scalars['Int']>;
  lockedUntil_gte?: InputMaybe<Scalars['Int']>;
  lockedUntil_in?: InputMaybe<Array<Scalars['Int']>>;
  lockedUntil_lt?: InputMaybe<Scalars['Int']>;
  lockedUntil_lte?: InputMaybe<Scalars['Int']>;
  lockedUntil_not?: InputMaybe<Scalars['Int']>;
  lockedUntil_not_in?: InputMaybe<Array<Scalars['Int']>>;
  staker?: InputMaybe<Scalars['String']>;
  staker_?: InputMaybe<VestingContract_Filter>;
  staker_contains?: InputMaybe<Scalars['String']>;
  staker_contains_nocase?: InputMaybe<Scalars['String']>;
  staker_ends_with?: InputMaybe<Scalars['String']>;
  staker_ends_with_nocase?: InputMaybe<Scalars['String']>;
  staker_gt?: InputMaybe<Scalars['String']>;
  staker_gte?: InputMaybe<Scalars['String']>;
  staker_in?: InputMaybe<Array<Scalars['String']>>;
  staker_lt?: InputMaybe<Scalars['String']>;
  staker_lte?: InputMaybe<Scalars['String']>;
  staker_not?: InputMaybe<Scalars['String']>;
  staker_not_contains?: InputMaybe<Scalars['String']>;
  staker_not_contains_nocase?: InputMaybe<Scalars['String']>;
  staker_not_ends_with?: InputMaybe<Scalars['String']>;
  staker_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  staker_not_in?: InputMaybe<Array<Scalars['String']>>;
  staker_not_starts_with?: InputMaybe<Scalars['String']>;
  staker_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  staker_starts_with?: InputMaybe<Scalars['String']>;
  staker_starts_with_nocase?: InputMaybe<Scalars['String']>;
  timestamp?: InputMaybe<Scalars['Int']>;
  timestamp_gt?: InputMaybe<Scalars['Int']>;
  timestamp_gte?: InputMaybe<Scalars['Int']>;
  timestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp_lt?: InputMaybe<Scalars['Int']>;
  timestamp_lte?: InputMaybe<Scalars['Int']>;
  timestamp_not?: InputMaybe<Scalars['Int']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
  totalStaked?: InputMaybe<Scalars['BigDecimal']>;
  totalStaked_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalStaked_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalStaked_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalStaked_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalStaked_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalStaked_not?: InputMaybe<Scalars['BigDecimal']>;
  totalStaked_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  transaction?: InputMaybe<Scalars['String']>;
  transaction_?: InputMaybe<Transaction_Filter>;
  transaction_contains?: InputMaybe<Scalars['String']>;
  transaction_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_gt?: InputMaybe<Scalars['String']>;
  transaction_gte?: InputMaybe<Scalars['String']>;
  transaction_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_lt?: InputMaybe<Scalars['String']>;
  transaction_lte?: InputMaybe<Scalars['String']>;
  transaction_not?: InputMaybe<Scalars['String']>;
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_not_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
  transaction_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum VestingHistoryItem_OrderBy {
  Action = 'action',
  Amount = 'amount',
  Delegatee = 'delegatee',
  EmittedBy = 'emittedBy',
  Id = 'id',
  LockedUntil = 'lockedUntil',
  Staker = 'staker',
  Timestamp = 'timestamp',
  TotalStaked = 'totalStaked',
  Transaction = 'transaction',
}

/**
 * This is the event emitted when a user votes for or against a proposed SIP
 *
 */
export type VoteCast = {
  __typename?: 'VoteCast';
  emittedBy: Scalars['Bytes'];
  /**
   * ID is transaction hash + log index
   *
   */
  id: Scalars['ID'];
  /**
   * The ID of the Proposal entity that this vote is for/against
   *
   */
  proposal: Proposal;
  /**
   * The ID of the proposal
   *
   */
  proposalId: Scalars['Int'];
  /**
   * True if the vote is for the proposal, False if it is against
   *
   */
  support: Scalars['Boolean'];
  timestamp: Scalars['Int'];
  transaction: Transaction;
  voter: User;
  /**
   * The number of votes the user cast (the voting power of that user)
   *
   */
  votes: Scalars['BigInt'];
};

export type VoteCast_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  emittedBy?: InputMaybe<Scalars['Bytes']>;
  emittedBy_contains?: InputMaybe<Scalars['Bytes']>;
  emittedBy_in?: InputMaybe<Array<Scalars['Bytes']>>;
  emittedBy_not?: InputMaybe<Scalars['Bytes']>;
  emittedBy_not_contains?: InputMaybe<Scalars['Bytes']>;
  emittedBy_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  proposal?: InputMaybe<Scalars['String']>;
  proposalId?: InputMaybe<Scalars['Int']>;
  proposalId_gt?: InputMaybe<Scalars['Int']>;
  proposalId_gte?: InputMaybe<Scalars['Int']>;
  proposalId_in?: InputMaybe<Array<Scalars['Int']>>;
  proposalId_lt?: InputMaybe<Scalars['Int']>;
  proposalId_lte?: InputMaybe<Scalars['Int']>;
  proposalId_not?: InputMaybe<Scalars['Int']>;
  proposalId_not_in?: InputMaybe<Array<Scalars['Int']>>;
  proposal_?: InputMaybe<Proposal_Filter>;
  proposal_contains?: InputMaybe<Scalars['String']>;
  proposal_contains_nocase?: InputMaybe<Scalars['String']>;
  proposal_ends_with?: InputMaybe<Scalars['String']>;
  proposal_ends_with_nocase?: InputMaybe<Scalars['String']>;
  proposal_gt?: InputMaybe<Scalars['String']>;
  proposal_gte?: InputMaybe<Scalars['String']>;
  proposal_in?: InputMaybe<Array<Scalars['String']>>;
  proposal_lt?: InputMaybe<Scalars['String']>;
  proposal_lte?: InputMaybe<Scalars['String']>;
  proposal_not?: InputMaybe<Scalars['String']>;
  proposal_not_contains?: InputMaybe<Scalars['String']>;
  proposal_not_contains_nocase?: InputMaybe<Scalars['String']>;
  proposal_not_ends_with?: InputMaybe<Scalars['String']>;
  proposal_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  proposal_not_in?: InputMaybe<Array<Scalars['String']>>;
  proposal_not_starts_with?: InputMaybe<Scalars['String']>;
  proposal_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  proposal_starts_with?: InputMaybe<Scalars['String']>;
  proposal_starts_with_nocase?: InputMaybe<Scalars['String']>;
  support?: InputMaybe<Scalars['Boolean']>;
  support_in?: InputMaybe<Array<Scalars['Boolean']>>;
  support_not?: InputMaybe<Scalars['Boolean']>;
  support_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  timestamp?: InputMaybe<Scalars['Int']>;
  timestamp_gt?: InputMaybe<Scalars['Int']>;
  timestamp_gte?: InputMaybe<Scalars['Int']>;
  timestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp_lt?: InputMaybe<Scalars['Int']>;
  timestamp_lte?: InputMaybe<Scalars['Int']>;
  timestamp_not?: InputMaybe<Scalars['Int']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
  transaction?: InputMaybe<Scalars['String']>;
  transaction_?: InputMaybe<Transaction_Filter>;
  transaction_contains?: InputMaybe<Scalars['String']>;
  transaction_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_gt?: InputMaybe<Scalars['String']>;
  transaction_gte?: InputMaybe<Scalars['String']>;
  transaction_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_lt?: InputMaybe<Scalars['String']>;
  transaction_lte?: InputMaybe<Scalars['String']>;
  transaction_not?: InputMaybe<Scalars['String']>;
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_not_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
  transaction_starts_with_nocase?: InputMaybe<Scalars['String']>;
  voter?: InputMaybe<Scalars['String']>;
  voter_?: InputMaybe<User_Filter>;
  voter_contains?: InputMaybe<Scalars['String']>;
  voter_contains_nocase?: InputMaybe<Scalars['String']>;
  voter_ends_with?: InputMaybe<Scalars['String']>;
  voter_ends_with_nocase?: InputMaybe<Scalars['String']>;
  voter_gt?: InputMaybe<Scalars['String']>;
  voter_gte?: InputMaybe<Scalars['String']>;
  voter_in?: InputMaybe<Array<Scalars['String']>>;
  voter_lt?: InputMaybe<Scalars['String']>;
  voter_lte?: InputMaybe<Scalars['String']>;
  voter_not?: InputMaybe<Scalars['String']>;
  voter_not_contains?: InputMaybe<Scalars['String']>;
  voter_not_contains_nocase?: InputMaybe<Scalars['String']>;
  voter_not_ends_with?: InputMaybe<Scalars['String']>;
  voter_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  voter_not_in?: InputMaybe<Array<Scalars['String']>>;
  voter_not_starts_with?: InputMaybe<Scalars['String']>;
  voter_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  voter_starts_with?: InputMaybe<Scalars['String']>;
  voter_starts_with_nocase?: InputMaybe<Scalars['String']>;
  votes?: InputMaybe<Scalars['BigInt']>;
  votes_gt?: InputMaybe<Scalars['BigInt']>;
  votes_gte?: InputMaybe<Scalars['BigInt']>;
  votes_in?: InputMaybe<Array<Scalars['BigInt']>>;
  votes_lt?: InputMaybe<Scalars['BigInt']>;
  votes_lte?: InputMaybe<Scalars['BigInt']>;
  votes_not?: InputMaybe<Scalars['BigInt']>;
  votes_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export enum VoteCast_OrderBy {
  EmittedBy = 'emittedBy',
  Id = 'id',
  Proposal = 'proposal',
  ProposalId = 'proposalId',
  Support = 'support',
  Timestamp = 'timestamp',
  Transaction = 'transaction',
  Voter = 'voter',
  Votes = 'votes',
}

export type Withdrawal = {
  __typename?: 'Withdrawal';
  amount: Scalars['BigDecimal'];
  emittedBy: Scalars['Bytes'];
  id: Scalars['ID'];
  receiver: Scalars['Bytes'];
  timestamp: Scalars['Int'];
  transaction: Transaction;
};

export type Withdrawal_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars['BigDecimal']>;
  amount_gt?: InputMaybe<Scalars['BigDecimal']>;
  amount_gte?: InputMaybe<Scalars['BigDecimal']>;
  amount_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  amount_lt?: InputMaybe<Scalars['BigDecimal']>;
  amount_lte?: InputMaybe<Scalars['BigDecimal']>;
  amount_not?: InputMaybe<Scalars['BigDecimal']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  emittedBy?: InputMaybe<Scalars['Bytes']>;
  emittedBy_contains?: InputMaybe<Scalars['Bytes']>;
  emittedBy_in?: InputMaybe<Array<Scalars['Bytes']>>;
  emittedBy_not?: InputMaybe<Scalars['Bytes']>;
  emittedBy_not_contains?: InputMaybe<Scalars['Bytes']>;
  emittedBy_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  receiver?: InputMaybe<Scalars['Bytes']>;
  receiver_contains?: InputMaybe<Scalars['Bytes']>;
  receiver_in?: InputMaybe<Array<Scalars['Bytes']>>;
  receiver_not?: InputMaybe<Scalars['Bytes']>;
  receiver_not_contains?: InputMaybe<Scalars['Bytes']>;
  receiver_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  timestamp?: InputMaybe<Scalars['Int']>;
  timestamp_gt?: InputMaybe<Scalars['Int']>;
  timestamp_gte?: InputMaybe<Scalars['Int']>;
  timestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp_lt?: InputMaybe<Scalars['Int']>;
  timestamp_lte?: InputMaybe<Scalars['Int']>;
  timestamp_not?: InputMaybe<Scalars['Int']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
  transaction?: InputMaybe<Scalars['String']>;
  transaction_?: InputMaybe<Transaction_Filter>;
  transaction_contains?: InputMaybe<Scalars['String']>;
  transaction_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_gt?: InputMaybe<Scalars['String']>;
  transaction_gte?: InputMaybe<Scalars['String']>;
  transaction_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_lt?: InputMaybe<Scalars['String']>;
  transaction_lte?: InputMaybe<Scalars['String']>;
  transaction_not?: InputMaybe<Scalars['String']>;
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_not_contains_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
  transaction_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum Withdrawal_OrderBy {
  Amount = 'amount',
  EmittedBy = 'emittedBy',
  Id = 'id',
  Receiver = 'receiver',
  Timestamp = 'timestamp',
  Transaction = 'transaction',
}

export type _Block_ = {
  __typename?: '_Block_';
  /** The hash of the block */
  hash?: Maybe<Scalars['Bytes']>;
  /** The block number */
  number: Scalars['Int'];
};

/** The type for the top-level _meta field */
export type _Meta_ = {
  __typename?: '_Meta_';
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   *
   */
  block: _Block_;
  /** The deployment ID */
  deployment: Scalars['String'];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars['Boolean'];
};

export enum _SubgraphErrorPolicy_ {
  /** Data will be returned even if the subgraph has indexing errors */
  Allow = 'allow',
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  Deny = 'deny',
}

export type GetActiveLoansQueryVariables = Exact<{
  user?: InputMaybe<Scalars['String']>;
}>;

export type GetActiveLoansQuery = {
  __typename?: 'Query';
  loans: Array<{
    __typename?: 'Loan';
    id: string;
    borrowedAmount: string;
    positionSize: string;
    nextRollover?: number | null;
    loanToken: {
      __typename?: 'Token';
      id: string;
      lastPriceBtc: string;
      lastPriceUsd: string;
      symbol?: string | null;
    };
    collateralToken: {
      __typename?: 'Token';
      id: string;
      lastPriceBtc: string;
      lastPriceUsd: string;
      symbol?: string | null;
    };
    borrow?: Array<{ __typename?: 'Borrow'; interestRate: string }> | null;
  }>;
};

export type GetBitcoinTxIdQueryVariables = Exact<{
  createdAtTx?: InputMaybe<Scalars['String']>;
}>;

export type GetBitcoinTxIdQuery = {
  __typename?: 'Query';
  bitcoinTransfers: Array<{
    __typename?: 'BitcoinTransfer';
    bitcoinTxHash?: string | null;
  }>;
};

export type GetBorrowHistoryQueryVariables = Exact<{
  user?: InputMaybe<Scalars['String']>;
  skip: Scalars['Int'];
  pageSize: Scalars['Int'];
  orderBy?: InputMaybe<Borrow_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
}>;

export type GetBorrowHistoryQuery = {
  __typename?: 'Query';
  borrows: Array<{
    __typename?: 'Borrow';
    loanToken: string;
    collateralToken: string;
    newPrincipal: string;
    newCollateral: string;
    interestRate: string;
    interestDuration: string;
    collateralToLoanRate: string;
    timestamp: number;
    loanId: {
      __typename?: 'Loan';
      id: string;
      collateralToken: {
        __typename?: 'Token';
        id: string;
        symbol?: string | null;
      };
      loanToken: { __typename?: 'Token'; id: string; symbol?: string | null };
    };
    transaction: { __typename?: 'Transaction'; id: string };
  }>;
};

export type GetCloseWithDepositsQueryVariables = Exact<{
  loanIds?: InputMaybe<Array<Scalars['String']> | Scalars['String']>;
  skip: Scalars['Int'];
  pageSize: Scalars['Int'];
  orderBy?: InputMaybe<CloseWithDeposit_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
}>;

export type GetCloseWithDepositsQuery = {
  __typename?: 'Query';
  closeWithDeposits: Array<{
    __typename?: 'CloseWithDeposit';
    collateralToken: string;
    loanToken: string;
    repayAmount: string;
    collateralWithdrawAmount: string;
    timestamp: number;
    loanId: {
      __typename?: 'Loan';
      id: string;
      collateralToken: {
        __typename?: 'Token';
        id: string;
        symbol?: string | null;
      };
      loanToken: { __typename?: 'Token'; id: string; symbol?: string | null };
    };
    transaction: { __typename?: 'Transaction'; id: string };
  }>;
};

export type GetCloseWithSwapsQueryVariables = Exact<{
  loanIds?: InputMaybe<Array<Scalars['String']> | Scalars['String']>;
  skip: Scalars['Int'];
  pageSize: Scalars['Int'];
  orderBy?: InputMaybe<CloseWithSwap_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
}>;

export type GetCloseWithSwapsQuery = {
  __typename?: 'Query';
  closeWithSwaps: Array<{
    __typename?: 'CloseWithSwap';
    collateralToken: string;
    loanToken: string;
    positionCloseSize: string;
    loanCloseAmount: string;
    timestamp: number;
    loanId: {
      __typename?: 'Loan';
      id: string;
      collateralToken: {
        __typename?: 'Token';
        id: string;
        symbol?: string | null;
      };
      loanToken: { __typename?: 'Token'; id: string; symbol?: string | null };
    };
    transaction: { __typename?: 'Transaction'; id: string };
  }>;
};

export type GetConversionFeeQueryVariables = Exact<{
  smartToken?: InputMaybe<Scalars['String']>;
}>;

export type GetConversionFeeQuery = {
  __typename?: 'Query';
  liquidityPools: Array<{
    __typename?: 'LiquidityPool';
    conversionFee?: string | null;
    maxConversionFee?: string | null;
  }>;
};

export type GetDelegateChangesQueryVariables = Exact<{
  user?: InputMaybe<Scalars['String']>;
  skip: Scalars['Int'];
  pageSize: Scalars['Int'];
  orderBy?: InputMaybe<V2DelegateChanged_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
}>;

export type GetDelegateChangesQuery = {
  __typename?: 'Query';
  v2DelegateChangeds: Array<{
    __typename?: 'V2DelegateChanged';
    id: string;
    timestamp: number;
    lockedUntil: number;
    delegate?: { __typename?: 'User'; id: string } | null;
    previousDelegate?: { __typename?: 'User'; id: string } | null;
    user: { __typename?: 'User'; id: string };
  }>;
};

export type GetDepositCollateralsQueryVariables = Exact<{
  loanIds?: InputMaybe<Array<Scalars['String']> | Scalars['String']>;
  skip: Scalars['Int'];
  pageSize: Scalars['Int'];
  orderBy?: InputMaybe<DepositCollateral_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
}>;

export type GetDepositCollateralsQuery = {
  __typename?: 'Query';
  depositCollaterals: Array<{
    __typename?: 'DepositCollateral';
    depositAmount: string;
    rate?: string | null;
    timestamp: number;
    emittedBy: string;
    loanId: {
      __typename?: 'Loan';
      id: string;
      collateralToken: {
        __typename?: 'Token';
        id: string;
        symbol?: string | null;
      };
      loanToken: { __typename?: 'Token'; id: string; symbol?: string | null };
    };
    transaction: { __typename?: 'Transaction'; id: string };
  }>;
};

export type GetExtendedStakingDurationsQueryVariables = Exact<{
  user?: InputMaybe<Scalars['String']>;
  skip: Scalars['Int'];
  pageSize: Scalars['Int'];
  orderBy?: InputMaybe<V2ExtendedStakingDuration_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
}>;

export type GetExtendedStakingDurationsQuery = {
  __typename?: 'Query';
  v2ExtendedStakingDurations: Array<{
    __typename?: 'V2ExtendedStakingDuration';
    id: string;
    amountStaked: string;
    newDate: number;
    previousDate: number;
    timestamp: number;
    user: { __typename?: 'User'; id: string };
  }>;
};

export type GetFastBtcDepositRskTransactionQueryVariables = Exact<{
  bitcoinTxHash?: InputMaybe<Scalars['String']>;
  user?: InputMaybe<Scalars['String']>;
}>;

export type GetFastBtcDepositRskTransactionQuery = {
  __typename?: 'Query';
  bitcoinTransfers: Array<{
    __typename?: 'BitcoinTransfer';
    updatedAtTx: { __typename?: 'Transaction'; id: string };
  }>;
};

export type GetFundingQueryVariables = Exact<{
  user?: InputMaybe<Scalars['String']>;
  skip: Scalars['Int'];
  pageSize: Scalars['Int'];
  orderBy?: InputMaybe<BitcoinTransfer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
}>;

export type GetFundingQuery = {
  __typename?: 'Query';
  bitcoinTransfers: Array<{
    __typename?: 'BitcoinTransfer';
    createdAtTimestamp: number;
    bitcoinTxHash?: string | null;
    direction: BitcoinTransferDirection;
    amountBTC: string;
    feeBTC: string;
    totalAmountBTC: string;
    user: { __typename?: 'User'; id: string };
    createdAtTx: { __typename?: 'Transaction'; id: string };
  }>;
};

export type GetLastVestingWithdrawQueryVariables = Exact<{
  vestingAddress?: InputMaybe<Scalars['ID']>;
}>;

export type GetLastVestingWithdrawQuery = {
  __typename?: 'Query';
  vestingContracts: Array<{
    __typename?: 'VestingContract';
    id: string;
    stakeHistory?: Array<{
      __typename?: 'VestingHistoryItem';
      timestamp: number;
    }> | null;
  }>;
};

export type GetLendHistoryQueryVariables = Exact<{
  user: Scalars['ID'];
}>;

export type GetLendHistoryQuery = {
  __typename?: 'Query';
  user?: {
    __typename?: 'User';
    lendingHistory?: Array<{
      __typename?: 'UserLendingHistory';
      lendingHistory?: Array<{
        __typename?: 'LendingHistoryItem';
        type: LendingHistoryType;
        timestamp: number;
        amount: string;
        loanTokenAmount: string;
        emittedBy: string;
        asset?: {
          __typename?: 'Token';
          id: string;
          symbol?: string | null;
        } | null;
        transaction: {
          __typename?: 'Transaction';
          id: string;
          timestamp: number;
        };
      }> | null;
    }> | null;
  } | null;
};

export type GetLiquidatesQueryVariables = Exact<{
  loanIds?: InputMaybe<Array<Scalars['String']> | Scalars['String']>;
  skip: Scalars['Int'];
  pageSize: Scalars['Int'];
  orderBy?: InputMaybe<Liquidate_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
}>;

export type GetLiquidatesQuery = {
  __typename?: 'Query';
  liquidates: Array<{
    __typename?: 'Liquidate';
    collateralToken: string;
    loanToken: string;
    repayAmount: string;
    collateralWithdrawAmount: string;
    timestamp: number;
    loanId: {
      __typename?: 'Loan';
      id: string;
      collateralToken: {
        __typename?: 'Token';
        id: string;
        symbol?: string | null;
      };
      loanToken: { __typename?: 'Token'; id: string; symbol?: string | null };
    };
    transaction: { __typename?: 'Transaction'; id: string };
  }>;
};

export type GetLiquidityHistoryQueryVariables = Exact<{
  user?: InputMaybe<Scalars['String']>;
  skip: Scalars['Int'];
  pageSize: Scalars['Int'];
  orderDirection?: InputMaybe<OrderDirection>;
}>;

export type GetLiquidityHistoryQuery = {
  __typename?: 'Query';
  liquidityHistoryItems: Array<{
    __typename?: 'LiquidityHistoryItem';
    amount: string;
    type: LiquidityHistoryType;
    emittedBy: string;
    timestamp: number;
    reserveToken: { __typename?: 'Token'; id: string; symbol?: string | null };
    transaction: { __typename?: 'Transaction'; id: string };
    liquidityPool: { __typename?: 'LiquidityPool'; id: string };
  }>;
};

export type GetLiquidityMiningAllocationPointsQueryVariables = Exact<{
  [key: string]: never;
}>;

export type GetLiquidityMiningAllocationPointsQuery = {
  __typename?: 'Query';
  liquidityMiningAllocationPoints: Array<{
    __typename?: 'LiquidityMiningAllocationPoint';
    id: string;
    rewardPerBlock: string;
    ammPoolToken?: {
      __typename?: 'SmartToken';
      id: string;
      symbol?: string | null;
    } | null;
    lendingPoolToken?: { __typename?: 'LendingPool'; id: string } | null;
  }>;
};

export type GetLoanParamsSetupsQueryVariables = Exact<{
  loanToken?: InputMaybe<Scalars['String']>;
}>;

export type GetLoanParamsSetupsQuery = {
  __typename?: 'Query';
  loanParamsSetups: Array<{
    __typename?: 'LoanParamsSetup';
    id: string;
    maintenanceMargin: string;
    minInitialMargin: string;
    maxLoanTerm: number;
    owner: string;
    timestamp: number;
    collateralToken: { __typename?: 'Token'; id: string };
    loanToken: { __typename?: 'Token'; id: string };
    transaction: { __typename?: 'Transaction'; id: string };
  }>;
};

export type GetLoansQueryVariables = Exact<{
  user?: InputMaybe<Scalars['String']>;
}>;

export type GetLoansQuery = {
  __typename?: 'Query';
  loans: Array<{
    __typename?: 'Loan';
    id: string;
    borrowedAmount: string;
    positionSize: string;
    nextRollover?: number | null;
    loanToken: { __typename?: 'Token'; id: string; symbol?: string | null };
    collateralToken: {
      __typename?: 'Token';
      id: string;
      symbol?: string | null;
    };
    borrow?: Array<{ __typename?: 'Borrow'; interestRate: string }> | null;
  }>;
};

export type GetProposalQueryVariables = Exact<{
  id: Scalars['ID'];
}>;

export type GetProposalQuery = {
  __typename?: 'Query';
  proposal?: {
    __typename?: 'Proposal';
    id: string;
    votesFor: string;
    votesAgainst: string;
    countVotersFor: number;
    countVotersAgainst: number;
    quorum: string;
    proposer: string;
    majorityPercentage: string;
    eta?: number | null;
    proposalId: number;
    targets: Array<string>;
    values: Array<string>;
    signatures: Array<string>;
    calldatas: Array<string>;
    startBlock: number;
    endBlock: number;
    description: string;
    timestamp: number;
    canceled?: { __typename?: 'Transaction'; id: string } | null;
    executed?: { __typename?: 'Transaction'; id: string } | null;
    queued?: { __typename?: 'Transaction'; id: string } | null;
    created: { __typename?: 'Transaction'; id: string };
    votes?: Array<{
      __typename?: 'VoteCast';
      votes: string;
      support: boolean;
      timestamp: number;
      voter: { __typename?: 'User'; id: string };
      transaction: { __typename?: 'Transaction'; id: string };
    }> | null;
    emittedBy: {
      __typename?: 'GovernorContract';
      id: string;
      votingDelay: number;
      votingPeriod: number;
      quorumPercentageVotes: number;
      majorityPercentageVotes: number;
    };
    stateChanges: Array<{
      __typename?: 'ProposalStateChange';
      id: string;
      state: ProposalState;
      timestamp: number;
    }>;
  } | null;
};

export type GetProposalsQueryVariables = Exact<{ [key: string]: never }>;

export type GetProposalsQuery = {
  __typename?: 'Query';
  proposals: Array<{
    __typename?: 'Proposal';
    id: string;
    votesFor: string;
    votesAgainst: string;
    countVotersFor: number;
    countVotersAgainst: number;
    quorum: string;
    majorityPercentage: string;
    eta?: number | null;
    proposalId: number;
    proposer: string;
    targets: Array<string>;
    values: Array<string>;
    signatures: Array<string>;
    calldatas: Array<string>;
    startBlock: number;
    endBlock: number;
    description: string;
    timestamp: number;
    canceled?: { __typename?: 'Transaction'; id: string } | null;
    executed?: { __typename?: 'Transaction'; id: string } | null;
    queued?: { __typename?: 'Transaction'; id: string } | null;
    created: { __typename?: 'Transaction'; id: string };
    votes?: Array<{
      __typename?: 'VoteCast';
      votes: string;
      support: boolean;
      voter: { __typename?: 'User'; id: string };
      transaction: { __typename?: 'Transaction'; id: string };
    }> | null;
    emittedBy: {
      __typename?: 'GovernorContract';
      id: string;
      votingDelay: number;
      votingPeriod: number;
      quorumPercentageVotes: number;
      majorityPercentageVotes: number;
    };
    stateChanges: Array<{
      __typename?: 'ProposalStateChange';
      id: string;
      state: ProposalState;
      timestamp: number;
    }>;
  }>;
};

export type GetProtocolFeeQueryVariables = Exact<{ [key: string]: never }>;

export type GetProtocolFeeQuery = {
  __typename?: 'Query';
  swapSettings: Array<{ __typename?: 'SwapSetting'; protocolFee: number }>;
};

export type GetRewardsEarnedHistoryQueryVariables = Exact<{
  user?: InputMaybe<Scalars['String']>;
  skip: Scalars['Int'];
  pageSize: Scalars['Int'];
  orderBy?: InputMaybe<RewardsEarnedHistoryItem_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  actions?: InputMaybe<Array<RewardsEarnedAction> | RewardsEarnedAction>;
}>;

export type GetRewardsEarnedHistoryQuery = {
  __typename?: 'Query';
  rewardsEarnedHistoryItems: Array<{
    __typename?: 'RewardsEarnedHistoryItem';
    id: string;
    action: RewardsEarnedAction;
    amount: string;
    token?: string | null;
    timestamp: number;
    transaction: { __typename?: 'Transaction'; id: string };
  }>;
};

export type GetRolloversQueryVariables = Exact<{
  loanIds?: InputMaybe<Array<Scalars['String']> | Scalars['String']>;
  skip: Scalars['Int'];
  pageSize: Scalars['Int'];
  orderBy?: InputMaybe<Rollover_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
}>;

export type GetRolloversQuery = {
  __typename?: 'Query';
  rollovers: Array<{
    __typename?: 'Rollover';
    id: string;
    lender: string;
    principal: string;
    collateral: string;
    endTimestamp: number;
    reward: string;
    timestamp: number;
    emittedBy: string;
    user: { __typename?: 'User'; id: string };
    loanId: {
      __typename?: 'Loan';
      id: string;
      collateralToken: {
        __typename?: 'Token';
        id: string;
        symbol?: string | null;
      };
      loanToken: { __typename?: 'Token'; id: string; symbol?: string | null };
    };
    rewardReceiver: { __typename?: 'User'; id: string };
    transaction: { __typename?: 'Transaction'; id: string };
  }>;
};

export type GetSmartTokensQueryVariables = Exact<{
  skip: Scalars['Int'];
  pageSize: Scalars['Int'];
  orderBy?: InputMaybe<SmartToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  filters?: InputMaybe<SmartToken_Filter>;
}>;

export type GetSmartTokensQuery = {
  __typename?: 'Query';
  smartTokens: Array<{
    __typename?: 'SmartToken';
    id: string;
    name?: string | null;
    decimals?: number | null;
    symbol?: string | null;
    owner: string;
    addedToRegistryBlockNumber?: number | null;
  }>;
};

export type GetStakeHistoryQueryVariables = Exact<{
  user?: InputMaybe<Scalars['String']>;
  skip: Scalars['Int'];
  pageSize: Scalars['Int'];
  orderBy?: InputMaybe<V2TokensStaked_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
}>;

export type GetStakeHistoryQuery = {
  __typename?: 'Query';
  v2TokensStakeds: Array<{
    __typename?: 'V2TokensStaked';
    id: string;
    amount: string;
    totalStaked: string;
    timestamp: number;
    lockedUntil: number;
    user: { __typename?: 'User'; id: string };
  }>;
};

export type GetStakingWithdrawsQueryVariables = Exact<{
  user?: InputMaybe<Scalars['String']>;
  skip: Scalars['Int'];
  pageSize: Scalars['Int'];
  orderBy?: InputMaybe<V2StakingWithdrawn_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
}>;

export type GetStakingWithdrawsQuery = {
  __typename?: 'Query';
  v2StakingWithdrawns: Array<{
    __typename?: 'V2StakingWithdrawn';
    id: string;
    amount: string;
    slashedAmount: string;
    isGovernance: boolean;
    timestamp: number;
    until: number;
    receiver?: { __typename?: 'User'; id: string } | null;
    user: { __typename?: 'User'; id: string };
  }>;
};

export type GetSwapHistoryQueryVariables = Exact<{
  user?: InputMaybe<Scalars['String']>;
  skip: Scalars['Int'];
  pageSize: Scalars['Int'];
  orderBy?: InputMaybe<Swap_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
}>;

export type GetSwapHistoryQuery = {
  __typename?: 'Query';
  swaps: Array<{
    __typename?: 'Swap';
    fromAmount: string;
    toAmount: string;
    conversionFee?: string | null;
    protocolFee?: string | null;
    fromToken: { __typename?: 'Token'; id: string; symbol?: string | null };
    toToken: { __typename?: 'Token'; id: string; symbol?: string | null };
    transaction: { __typename?: 'Transaction'; id: string; timestamp: number };
  }>;
};

export type GetTokenQueryVariables = Exact<{
  id: Scalars['ID'];
}>;

export type GetTokenQuery = {
  __typename?: 'Query';
  token?: {
    __typename?: 'Token';
    lastPriceUsd: string;
    lastPriceBtc: string;
  } | null;
};

export type GetTokenRatesQueryVariables = Exact<{ [key: string]: never }>;

export type GetTokenRatesQuery = {
  __typename?: 'Query';
  tokens: Array<{
    __typename?: 'Token';
    id: string;
    symbol?: string | null;
    lastPriceBtc: string;
    lastPriceUsd: string;
  }>;
};

export type GetTradeVolumeQueryVariables = Exact<{
  pool?: InputMaybe<Scalars['String']>;
  timestamp: Scalars['Int'];
}>;

export type GetTradeVolumeQuery = {
  __typename?: 'Query';
  poolVolumeItems: Array<{ __typename?: 'PoolVolumeItem'; btcAmount: string }>;
};

export type GetTradingRewardsQueryVariables = Exact<{
  id: Scalars['ID'];
}>;

export type GetTradingRewardsQuery = {
  __typename?: 'Query';
  userRewardsEarnedHistory?: {
    __typename?: 'UserRewardsEarnedHistory';
    availableTradingRewards: string;
    totalTradingRewards: string;
    totalLendingRewards: string;
    totalLiquidityRewards: string;
    totalStakingRewards: string;
    totalFeeWithdrawn: string;
  } | null;
};

export type GetTransactionsQueryVariables = Exact<{
  limit: Scalars['Int'];
}>;

export type GetTransactionsQuery = {
  __typename?: 'Query';
  transactions: Array<{
    __typename?: 'Transaction';
    id: string;
    gasPrice: string;
    gasLimit: string;
    to?: string | null;
    blockNumber: number;
    timestamp: number;
    from: { __typename?: 'User'; id: string };
  }>;
};

export type GetUserRewardsEarnedHistoryQueryVariables = Exact<{
  user: Scalars['ID'];
}>;

export type GetUserRewardsEarnedHistoryQuery = {
  __typename?: 'Query';
  userRewardsEarnedHistory?: {
    __typename?: 'UserRewardsEarnedHistory';
    totalFeeWithdrawn: string;
  } | null;
};

export type GetVestingContractsQueryVariables = Exact<{
  user?: InputMaybe<Scalars['String']>;
  skip: Scalars['Int'];
  pageSize: Scalars['Int'];
}>;

export type GetVestingContractsQuery = {
  __typename?: 'Query';
  vestingContracts: Array<{
    __typename?: 'VestingContract';
    id: string;
    cliff?: number | null;
    duration?: number | null;
    currentBalance: string;
    type: VestingContractType;
    createdAtTimestamp: number;
  }>;
};

export type GetVestingContractsIdQueryVariables = Exact<{
  user?: InputMaybe<Scalars['String']>;
}>;

export type GetVestingContractsIdQuery = {
  __typename?: 'Query';
  vestingContracts: Array<{ __typename?: 'VestingContract'; id: string }>;
};

export type GetUserVestingContractsQueryVariables = Exact<{
  userAddress: Scalars['String'];
}>;

export type GetUserVestingContractsQuery = {
  __typename?: 'Query';
  vestingContracts: Array<{ __typename?: 'VestingContract'; id: string }>;
};

export type GetDelegateChangesForVestingsQueryVariables = Exact<{
  vestingContracts?: InputMaybe<Array<Scalars['String']> | Scalars['String']>;
  skip: Scalars['Int'];
  pageSize: Scalars['Int'];
  orderBy?: InputMaybe<VestingHistoryItem_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
}>;

export type GetDelegateChangesForVestingsQuery = {
  __typename?: 'Query';
  vestingHistoryItems: Array<{
    __typename?: 'VestingHistoryItem';
    id: string;
    amount: string;
    timestamp: number;
    delegatee?: { __typename?: 'User'; id: string } | null;
    transaction: { __typename?: 'Transaction'; id: string };
  }>;
};

export type GetVestingHistoryQueryVariables = Exact<{
  vestingAddress?: InputMaybe<Scalars['ID']>;
}>;

export type GetVestingHistoryQuery = {
  __typename?: 'Query';
  vestingContracts: Array<{
    __typename?: 'VestingContract';
    id: string;
    stakeHistory?: Array<{
      __typename?: 'VestingHistoryItem';
      id: string;
      amount: string;
      lockedUntil?: number | null;
    }> | null;
  }>;
};

export type GetUserVestingsOfTypeQueryVariables = Exact<{
  user?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<VestingContractType>;
}>;

export type GetUserVestingsOfTypeQuery = {
  __typename?: 'Query';
  vestingContracts: Array<{
    __typename?: 'VestingContract';
    id: string;
    stakeHistory?: Array<{
      __typename?: 'VestingHistoryItem';
      id: string;
      amount: string;
      lockedUntil?: number | null;
    }> | null;
  }>;
};

export type GetVestingHistoryItemsQueryVariables = Exact<{
  stakers?: InputMaybe<Array<Scalars['String']> | Scalars['String']>;
  skip: Scalars['Int'];
  pageSize: Scalars['Int'];
  orderBy?: InputMaybe<VestingHistoryItem_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
}>;

export type GetVestingHistoryItemsQuery = {
  __typename?: 'Query';
  vestingHistoryItems: Array<{
    __typename?: 'VestingHistoryItem';
    timestamp: number;
    action: VestingHistoryItemAction;
    amount: string;
    transaction: { __typename?: 'Transaction'; id: string };
  }>;
};

export type GetVestingUnlockBalanceQueryVariables = Exact<{
  vestingAddress?: InputMaybe<Scalars['ID']>;
  timestamp?: InputMaybe<Scalars['Int']>;
  currentTimestamp?: InputMaybe<Scalars['Int']>;
}>;

export type GetVestingUnlockBalanceQuery = {
  __typename?: 'Query';
  vestingContracts: Array<{
    __typename?: 'VestingContract';
    id: string;
    stakeHistory?: Array<{
      __typename?: 'VestingHistoryItem';
      timestamp: number;
      amount: string;
      lockedUntil?: number | null;
    }> | null;
  }>;
};

export type GetVoteQueryVariables = Exact<{
  id?: InputMaybe<Scalars['String']>;
  voter?: InputMaybe<Scalars['String']>;
}>;

export type GetVoteQuery = {
  __typename?: 'Query';
  voteCasts: Array<{
    __typename?: 'VoteCast';
    emittedBy: string;
    id: string;
    proposalId: number;
    support: boolean;
    timestamp: number;
    votes: string;
    transaction: { __typename?: 'Transaction'; id: string };
    voter: { __typename?: 'User'; id: string };
  }>;
};

export const GetActiveLoansDocument = gql`
  query getActiveLoans($user: String) {
    loans(where: { user: $user, type: Borrow }) {
      id
      loanToken {
        id
        lastPriceBtc
        lastPriceUsd
        symbol
      }
      collateralToken {
        id
        lastPriceBtc
        lastPriceUsd
        symbol
      }
      borrowedAmount
      positionSize
      nextRollover
      borrow(first: 1, orderBy: timestamp, orderDirection: desc) {
        interestRate
      }
    }
  }
`;

/**
 * __useGetActiveLoansQuery__
 *
 * To run a query within a React component, call `useGetActiveLoansQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetActiveLoansQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetActiveLoansQuery({
 *   variables: {
 *      user: // value for 'user'
 *   },
 * });
 */
export function useGetActiveLoansQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetActiveLoansQuery,
    GetActiveLoansQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetActiveLoansQuery, GetActiveLoansQueryVariables>(
    GetActiveLoansDocument,
    options,
  );
}
export function useGetActiveLoansLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetActiveLoansQuery,
    GetActiveLoansQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetActiveLoansQuery, GetActiveLoansQueryVariables>(
    GetActiveLoansDocument,
    options,
  );
}
export type GetActiveLoansQueryHookResult = ReturnType<
  typeof useGetActiveLoansQuery
>;
export type GetActiveLoansLazyQueryHookResult = ReturnType<
  typeof useGetActiveLoansLazyQuery
>;
export type GetActiveLoansQueryResult = Apollo.QueryResult<
  GetActiveLoansQuery,
  GetActiveLoansQueryVariables
>;
export const GetBitcoinTxIdDocument = gql`
  query getBitcoinTxId($createdAtTx: String) {
    bitcoinTransfers(where: { createdAtTx: $createdAtTx }, first: 1) {
      bitcoinTxHash
    }
  }
`;

/**
 * __useGetBitcoinTxIdQuery__
 *
 * To run a query within a React component, call `useGetBitcoinTxIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBitcoinTxIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBitcoinTxIdQuery({
 *   variables: {
 *      createdAtTx: // value for 'createdAtTx'
 *   },
 * });
 */
export function useGetBitcoinTxIdQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetBitcoinTxIdQuery,
    GetBitcoinTxIdQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetBitcoinTxIdQuery, GetBitcoinTxIdQueryVariables>(
    GetBitcoinTxIdDocument,
    options,
  );
}
export function useGetBitcoinTxIdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetBitcoinTxIdQuery,
    GetBitcoinTxIdQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetBitcoinTxIdQuery, GetBitcoinTxIdQueryVariables>(
    GetBitcoinTxIdDocument,
    options,
  );
}
export type GetBitcoinTxIdQueryHookResult = ReturnType<
  typeof useGetBitcoinTxIdQuery
>;
export type GetBitcoinTxIdLazyQueryHookResult = ReturnType<
  typeof useGetBitcoinTxIdLazyQuery
>;
export type GetBitcoinTxIdQueryResult = Apollo.QueryResult<
  GetBitcoinTxIdQuery,
  GetBitcoinTxIdQueryVariables
>;
export const GetBorrowHistoryDocument = gql`
  query getBorrowHistory(
    $user: String
    $skip: Int!
    $pageSize: Int!
    $orderBy: Borrow_orderBy
    $orderDirection: OrderDirection
  ) {
    borrows(
      where: { user: $user }
      first: $pageSize
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
    ) {
      loanId {
        id
        collateralToken {
          id
          symbol
        }
        loanToken {
          id
          symbol
        }
      }
      loanToken
      collateralToken
      newPrincipal
      newCollateral
      interestRate
      interestDuration
      collateralToLoanRate
      timestamp
      transaction {
        id
      }
    }
  }
`;

/**
 * __useGetBorrowHistoryQuery__
 *
 * To run a query within a React component, call `useGetBorrowHistoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBorrowHistoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBorrowHistoryQuery({
 *   variables: {
 *      user: // value for 'user'
 *      skip: // value for 'skip'
 *      pageSize: // value for 'pageSize'
 *      orderBy: // value for 'orderBy'
 *      orderDirection: // value for 'orderDirection'
 *   },
 * });
 */
export function useGetBorrowHistoryQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetBorrowHistoryQuery,
    GetBorrowHistoryQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetBorrowHistoryQuery, GetBorrowHistoryQueryVariables>(
    GetBorrowHistoryDocument,
    options,
  );
}
export function useGetBorrowHistoryLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetBorrowHistoryQuery,
    GetBorrowHistoryQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetBorrowHistoryQuery,
    GetBorrowHistoryQueryVariables
  >(GetBorrowHistoryDocument, options);
}
export type GetBorrowHistoryQueryHookResult = ReturnType<
  typeof useGetBorrowHistoryQuery
>;
export type GetBorrowHistoryLazyQueryHookResult = ReturnType<
  typeof useGetBorrowHistoryLazyQuery
>;
export type GetBorrowHistoryQueryResult = Apollo.QueryResult<
  GetBorrowHistoryQuery,
  GetBorrowHistoryQueryVariables
>;
export const GetCloseWithDepositsDocument = gql`
  query getCloseWithDeposits(
    $loanIds: [String!]
    $skip: Int!
    $pageSize: Int!
    $orderBy: CloseWithDeposit_orderBy
    $orderDirection: OrderDirection
  ) {
    closeWithDeposits(
      where: { loanId_in: $loanIds }
      first: $pageSize
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
    ) {
      loanId {
        id
        collateralToken {
          id
          symbol
        }
        loanToken {
          id
          symbol
        }
      }
      collateralToken
      loanToken
      repayAmount
      collateralWithdrawAmount
      timestamp
      transaction {
        id
      }
    }
  }
`;

/**
 * __useGetCloseWithDepositsQuery__
 *
 * To run a query within a React component, call `useGetCloseWithDepositsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCloseWithDepositsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCloseWithDepositsQuery({
 *   variables: {
 *      loanIds: // value for 'loanIds'
 *      skip: // value for 'skip'
 *      pageSize: // value for 'pageSize'
 *      orderBy: // value for 'orderBy'
 *      orderDirection: // value for 'orderDirection'
 *   },
 * });
 */
export function useGetCloseWithDepositsQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetCloseWithDepositsQuery,
    GetCloseWithDepositsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetCloseWithDepositsQuery,
    GetCloseWithDepositsQueryVariables
  >(GetCloseWithDepositsDocument, options);
}
export function useGetCloseWithDepositsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetCloseWithDepositsQuery,
    GetCloseWithDepositsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetCloseWithDepositsQuery,
    GetCloseWithDepositsQueryVariables
  >(GetCloseWithDepositsDocument, options);
}
export type GetCloseWithDepositsQueryHookResult = ReturnType<
  typeof useGetCloseWithDepositsQuery
>;
export type GetCloseWithDepositsLazyQueryHookResult = ReturnType<
  typeof useGetCloseWithDepositsLazyQuery
>;
export type GetCloseWithDepositsQueryResult = Apollo.QueryResult<
  GetCloseWithDepositsQuery,
  GetCloseWithDepositsQueryVariables
>;
export const GetCloseWithSwapsDocument = gql`
  query getCloseWithSwaps(
    $loanIds: [String!]
    $skip: Int!
    $pageSize: Int!
    $orderBy: CloseWithSwap_orderBy
    $orderDirection: OrderDirection
  ) {
    closeWithSwaps(
      where: { loanId_in: $loanIds }
      first: $pageSize
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
    ) {
      loanId {
        id
        collateralToken {
          id
          symbol
        }
        loanToken {
          id
          symbol
        }
      }
      collateralToken
      loanToken
      positionCloseSize
      loanCloseAmount
      timestamp
      transaction {
        id
      }
    }
  }
`;

/**
 * __useGetCloseWithSwapsQuery__
 *
 * To run a query within a React component, call `useGetCloseWithSwapsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCloseWithSwapsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCloseWithSwapsQuery({
 *   variables: {
 *      loanIds: // value for 'loanIds'
 *      skip: // value for 'skip'
 *      pageSize: // value for 'pageSize'
 *      orderBy: // value for 'orderBy'
 *      orderDirection: // value for 'orderDirection'
 *   },
 * });
 */
export function useGetCloseWithSwapsQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetCloseWithSwapsQuery,
    GetCloseWithSwapsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetCloseWithSwapsQuery,
    GetCloseWithSwapsQueryVariables
  >(GetCloseWithSwapsDocument, options);
}
export function useGetCloseWithSwapsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetCloseWithSwapsQuery,
    GetCloseWithSwapsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetCloseWithSwapsQuery,
    GetCloseWithSwapsQueryVariables
  >(GetCloseWithSwapsDocument, options);
}
export type GetCloseWithSwapsQueryHookResult = ReturnType<
  typeof useGetCloseWithSwapsQuery
>;
export type GetCloseWithSwapsLazyQueryHookResult = ReturnType<
  typeof useGetCloseWithSwapsLazyQuery
>;
export type GetCloseWithSwapsQueryResult = Apollo.QueryResult<
  GetCloseWithSwapsQuery,
  GetCloseWithSwapsQueryVariables
>;
export const GetConversionFeeDocument = gql`
  query getConversionFee($smartToken: String) {
    liquidityPools(where: { smartToken_contains: $smartToken }) {
      conversionFee
      maxConversionFee
    }
  }
`;

/**
 * __useGetConversionFeeQuery__
 *
 * To run a query within a React component, call `useGetConversionFeeQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetConversionFeeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetConversionFeeQuery({
 *   variables: {
 *      smartToken: // value for 'smartToken'
 *   },
 * });
 */
export function useGetConversionFeeQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetConversionFeeQuery,
    GetConversionFeeQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetConversionFeeQuery, GetConversionFeeQueryVariables>(
    GetConversionFeeDocument,
    options,
  );
}
export function useGetConversionFeeLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetConversionFeeQuery,
    GetConversionFeeQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetConversionFeeQuery,
    GetConversionFeeQueryVariables
  >(GetConversionFeeDocument, options);
}
export type GetConversionFeeQueryHookResult = ReturnType<
  typeof useGetConversionFeeQuery
>;
export type GetConversionFeeLazyQueryHookResult = ReturnType<
  typeof useGetConversionFeeLazyQuery
>;
export type GetConversionFeeQueryResult = Apollo.QueryResult<
  GetConversionFeeQuery,
  GetConversionFeeQueryVariables
>;
export const GetDelegateChangesDocument = gql`
  query getDelegateChanges(
    $user: String
    $skip: Int!
    $pageSize: Int!
    $orderBy: V2DelegateChanged_orderBy
    $orderDirection: OrderDirection
  ) {
    v2DelegateChangeds(
      where: { user: $user, previousDelegate_not: null }
      first: $pageSize
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
    ) {
      id
      delegate {
        id
      }
      timestamp
      previousDelegate {
        id
      }
      user {
        id
      }
      lockedUntil
    }
  }
`;

/**
 * __useGetDelegateChangesQuery__
 *
 * To run a query within a React component, call `useGetDelegateChangesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDelegateChangesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDelegateChangesQuery({
 *   variables: {
 *      user: // value for 'user'
 *      skip: // value for 'skip'
 *      pageSize: // value for 'pageSize'
 *      orderBy: // value for 'orderBy'
 *      orderDirection: // value for 'orderDirection'
 *   },
 * });
 */
export function useGetDelegateChangesQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetDelegateChangesQuery,
    GetDelegateChangesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetDelegateChangesQuery,
    GetDelegateChangesQueryVariables
  >(GetDelegateChangesDocument, options);
}
export function useGetDelegateChangesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetDelegateChangesQuery,
    GetDelegateChangesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetDelegateChangesQuery,
    GetDelegateChangesQueryVariables
  >(GetDelegateChangesDocument, options);
}
export type GetDelegateChangesQueryHookResult = ReturnType<
  typeof useGetDelegateChangesQuery
>;
export type GetDelegateChangesLazyQueryHookResult = ReturnType<
  typeof useGetDelegateChangesLazyQuery
>;
export type GetDelegateChangesQueryResult = Apollo.QueryResult<
  GetDelegateChangesQuery,
  GetDelegateChangesQueryVariables
>;
export const GetDepositCollateralsDocument = gql`
  query getDepositCollaterals(
    $loanIds: [String!]
    $skip: Int!
    $pageSize: Int!
    $orderBy: DepositCollateral_orderBy
    $orderDirection: OrderDirection
  ) {
    depositCollaterals(
      where: { loanId_in: $loanIds }
      first: $pageSize
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
    ) {
      loanId {
        id
        collateralToken {
          id
          symbol
        }
        loanToken {
          id
          symbol
        }
      }
      depositAmount
      rate
      timestamp
      emittedBy
      transaction {
        id
      }
    }
  }
`;

/**
 * __useGetDepositCollateralsQuery__
 *
 * To run a query within a React component, call `useGetDepositCollateralsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDepositCollateralsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDepositCollateralsQuery({
 *   variables: {
 *      loanIds: // value for 'loanIds'
 *      skip: // value for 'skip'
 *      pageSize: // value for 'pageSize'
 *      orderBy: // value for 'orderBy'
 *      orderDirection: // value for 'orderDirection'
 *   },
 * });
 */
export function useGetDepositCollateralsQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetDepositCollateralsQuery,
    GetDepositCollateralsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetDepositCollateralsQuery,
    GetDepositCollateralsQueryVariables
  >(GetDepositCollateralsDocument, options);
}
export function useGetDepositCollateralsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetDepositCollateralsQuery,
    GetDepositCollateralsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetDepositCollateralsQuery,
    GetDepositCollateralsQueryVariables
  >(GetDepositCollateralsDocument, options);
}
export type GetDepositCollateralsQueryHookResult = ReturnType<
  typeof useGetDepositCollateralsQuery
>;
export type GetDepositCollateralsLazyQueryHookResult = ReturnType<
  typeof useGetDepositCollateralsLazyQuery
>;
export type GetDepositCollateralsQueryResult = Apollo.QueryResult<
  GetDepositCollateralsQuery,
  GetDepositCollateralsQueryVariables
>;
export const GetExtendedStakingDurationsDocument = gql`
  query getExtendedStakingDurations(
    $user: String
    $skip: Int!
    $pageSize: Int!
    $orderBy: V2ExtendedStakingDuration_orderBy
    $orderDirection: OrderDirection
  ) {
    v2ExtendedStakingDurations(
      where: { user: $user }
      first: $pageSize
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
    ) {
      id
      amountStaked
      newDate
      previousDate
      timestamp
      user {
        id
      }
    }
  }
`;

/**
 * __useGetExtendedStakingDurationsQuery__
 *
 * To run a query within a React component, call `useGetExtendedStakingDurationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetExtendedStakingDurationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetExtendedStakingDurationsQuery({
 *   variables: {
 *      user: // value for 'user'
 *      skip: // value for 'skip'
 *      pageSize: // value for 'pageSize'
 *      orderBy: // value for 'orderBy'
 *      orderDirection: // value for 'orderDirection'
 *   },
 * });
 */
export function useGetExtendedStakingDurationsQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetExtendedStakingDurationsQuery,
    GetExtendedStakingDurationsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetExtendedStakingDurationsQuery,
    GetExtendedStakingDurationsQueryVariables
  >(GetExtendedStakingDurationsDocument, options);
}
export function useGetExtendedStakingDurationsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetExtendedStakingDurationsQuery,
    GetExtendedStakingDurationsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetExtendedStakingDurationsQuery,
    GetExtendedStakingDurationsQueryVariables
  >(GetExtendedStakingDurationsDocument, options);
}
export type GetExtendedStakingDurationsQueryHookResult = ReturnType<
  typeof useGetExtendedStakingDurationsQuery
>;
export type GetExtendedStakingDurationsLazyQueryHookResult = ReturnType<
  typeof useGetExtendedStakingDurationsLazyQuery
>;
export type GetExtendedStakingDurationsQueryResult = Apollo.QueryResult<
  GetExtendedStakingDurationsQuery,
  GetExtendedStakingDurationsQueryVariables
>;
export const GetFastBtcDepositRskTransactionDocument = gql`
  query getFastBtcDepositRskTransaction($bitcoinTxHash: String, $user: String) {
    bitcoinTransfers(where: { bitcoinTxHash: $bitcoinTxHash, user: $user }) {
      updatedAtTx {
        id
      }
    }
  }
`;

/**
 * __useGetFastBtcDepositRskTransactionQuery__
 *
 * To run a query within a React component, call `useGetFastBtcDepositRskTransactionQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFastBtcDepositRskTransactionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFastBtcDepositRskTransactionQuery({
 *   variables: {
 *      bitcoinTxHash: // value for 'bitcoinTxHash'
 *      user: // value for 'user'
 *   },
 * });
 */
export function useGetFastBtcDepositRskTransactionQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetFastBtcDepositRskTransactionQuery,
    GetFastBtcDepositRskTransactionQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetFastBtcDepositRskTransactionQuery,
    GetFastBtcDepositRskTransactionQueryVariables
  >(GetFastBtcDepositRskTransactionDocument, options);
}
export function useGetFastBtcDepositRskTransactionLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetFastBtcDepositRskTransactionQuery,
    GetFastBtcDepositRskTransactionQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetFastBtcDepositRskTransactionQuery,
    GetFastBtcDepositRskTransactionQueryVariables
  >(GetFastBtcDepositRskTransactionDocument, options);
}
export type GetFastBtcDepositRskTransactionQueryHookResult = ReturnType<
  typeof useGetFastBtcDepositRskTransactionQuery
>;
export type GetFastBtcDepositRskTransactionLazyQueryHookResult = ReturnType<
  typeof useGetFastBtcDepositRskTransactionLazyQuery
>;
export type GetFastBtcDepositRskTransactionQueryResult = Apollo.QueryResult<
  GetFastBtcDepositRskTransactionQuery,
  GetFastBtcDepositRskTransactionQueryVariables
>;
export const GetFundingDocument = gql`
  query getFunding(
    $user: String
    $skip: Int!
    $pageSize: Int!
    $orderBy: BitcoinTransfer_orderBy
    $orderDirection: OrderDirection
  ) {
    bitcoinTransfers(
      where: { user: $user }
      first: $pageSize
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
    ) {
      user {
        id
      }
      createdAtTx {
        id
      }
      createdAtTimestamp
      bitcoinTxHash
      direction
      amountBTC
      feeBTC
      totalAmountBTC
    }
  }
`;

/**
 * __useGetFundingQuery__
 *
 * To run a query within a React component, call `useGetFundingQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFundingQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFundingQuery({
 *   variables: {
 *      user: // value for 'user'
 *      skip: // value for 'skip'
 *      pageSize: // value for 'pageSize'
 *      orderBy: // value for 'orderBy'
 *      orderDirection: // value for 'orderDirection'
 *   },
 * });
 */
export function useGetFundingQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetFundingQuery,
    GetFundingQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetFundingQuery, GetFundingQueryVariables>(
    GetFundingDocument,
    options,
  );
}
export function useGetFundingLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetFundingQuery,
    GetFundingQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetFundingQuery, GetFundingQueryVariables>(
    GetFundingDocument,
    options,
  );
}
export type GetFundingQueryHookResult = ReturnType<typeof useGetFundingQuery>;
export type GetFundingLazyQueryHookResult = ReturnType<
  typeof useGetFundingLazyQuery
>;
export type GetFundingQueryResult = Apollo.QueryResult<
  GetFundingQuery,
  GetFundingQueryVariables
>;
export const GetLastVestingWithdrawDocument = gql`
  query getLastVestingWithdraw($vestingAddress: ID) {
    vestingContracts(where: { id: $vestingAddress }) {
      id
      stakeHistory(
        where: { action: TokensWithdrawn }
        orderBy: timestamp
        orderDirection: desc
        first: 1
      ) {
        timestamp
      }
    }
  }
`;

/**
 * __useGetLastVestingWithdrawQuery__
 *
 * To run a query within a React component, call `useGetLastVestingWithdrawQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLastVestingWithdrawQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLastVestingWithdrawQuery({
 *   variables: {
 *      vestingAddress: // value for 'vestingAddress'
 *   },
 * });
 */
export function useGetLastVestingWithdrawQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetLastVestingWithdrawQuery,
    GetLastVestingWithdrawQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetLastVestingWithdrawQuery,
    GetLastVestingWithdrawQueryVariables
  >(GetLastVestingWithdrawDocument, options);
}
export function useGetLastVestingWithdrawLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetLastVestingWithdrawQuery,
    GetLastVestingWithdrawQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetLastVestingWithdrawQuery,
    GetLastVestingWithdrawQueryVariables
  >(GetLastVestingWithdrawDocument, options);
}
export type GetLastVestingWithdrawQueryHookResult = ReturnType<
  typeof useGetLastVestingWithdrawQuery
>;
export type GetLastVestingWithdrawLazyQueryHookResult = ReturnType<
  typeof useGetLastVestingWithdrawLazyQuery
>;
export type GetLastVestingWithdrawQueryResult = Apollo.QueryResult<
  GetLastVestingWithdrawQuery,
  GetLastVestingWithdrawQueryVariables
>;
export const GetLendHistoryDocument = gql`
  query getLendHistory($user: ID!) {
    user(id: $user) {
      lendingHistory {
        lendingHistory(orderBy: timestamp) {
          type
          timestamp
          asset {
            id
            symbol
          }
          amount
          loanTokenAmount
          emittedBy
          transaction {
            id
            timestamp
          }
        }
      }
    }
  }
`;

/**
 * __useGetLendHistoryQuery__
 *
 * To run a query within a React component, call `useGetLendHistoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLendHistoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLendHistoryQuery({
 *   variables: {
 *      user: // value for 'user'
 *   },
 * });
 */
export function useGetLendHistoryQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetLendHistoryQuery,
    GetLendHistoryQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetLendHistoryQuery, GetLendHistoryQueryVariables>(
    GetLendHistoryDocument,
    options,
  );
}
export function useGetLendHistoryLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetLendHistoryQuery,
    GetLendHistoryQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetLendHistoryQuery, GetLendHistoryQueryVariables>(
    GetLendHistoryDocument,
    options,
  );
}
export type GetLendHistoryQueryHookResult = ReturnType<
  typeof useGetLendHistoryQuery
>;
export type GetLendHistoryLazyQueryHookResult = ReturnType<
  typeof useGetLendHistoryLazyQuery
>;
export type GetLendHistoryQueryResult = Apollo.QueryResult<
  GetLendHistoryQuery,
  GetLendHistoryQueryVariables
>;
export const GetLiquidatesDocument = gql`
  query getLiquidates(
    $loanIds: [String!]
    $skip: Int!
    $pageSize: Int!
    $orderBy: Liquidate_orderBy
    $orderDirection: OrderDirection
  ) {
    liquidates(
      where: { loanId_in: $loanIds }
      first: $pageSize
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
    ) {
      loanId {
        id
        collateralToken {
          id
          symbol
        }
        loanToken {
          id
          symbol
        }
      }
      collateralToken
      loanToken
      repayAmount
      collateralWithdrawAmount
      timestamp
      transaction {
        id
      }
    }
  }
`;

/**
 * __useGetLiquidatesQuery__
 *
 * To run a query within a React component, call `useGetLiquidatesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLiquidatesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLiquidatesQuery({
 *   variables: {
 *      loanIds: // value for 'loanIds'
 *      skip: // value for 'skip'
 *      pageSize: // value for 'pageSize'
 *      orderBy: // value for 'orderBy'
 *      orderDirection: // value for 'orderDirection'
 *   },
 * });
 */
export function useGetLiquidatesQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetLiquidatesQuery,
    GetLiquidatesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetLiquidatesQuery, GetLiquidatesQueryVariables>(
    GetLiquidatesDocument,
    options,
  );
}
export function useGetLiquidatesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetLiquidatesQuery,
    GetLiquidatesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetLiquidatesQuery, GetLiquidatesQueryVariables>(
    GetLiquidatesDocument,
    options,
  );
}
export type GetLiquidatesQueryHookResult = ReturnType<
  typeof useGetLiquidatesQuery
>;
export type GetLiquidatesLazyQueryHookResult = ReturnType<
  typeof useGetLiquidatesLazyQuery
>;
export type GetLiquidatesQueryResult = Apollo.QueryResult<
  GetLiquidatesQuery,
  GetLiquidatesQueryVariables
>;
export const GetLiquidityHistoryDocument = gql`
  query getLiquidityHistory(
    $user: String
    $skip: Int!
    $pageSize: Int!
    $orderDirection: OrderDirection
  ) {
    liquidityHistoryItems(
      where: { user: $user }
      first: $pageSize
      skip: $skip
      orderBy: timestamp
      orderDirection: $orderDirection
    ) {
      amount
      type
      emittedBy
      timestamp
      reserveToken {
        id
        symbol
      }
      transaction {
        id
      }
      liquidityPool {
        id
      }
    }
  }
`;

/**
 * __useGetLiquidityHistoryQuery__
 *
 * To run a query within a React component, call `useGetLiquidityHistoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLiquidityHistoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLiquidityHistoryQuery({
 *   variables: {
 *      user: // value for 'user'
 *      skip: // value for 'skip'
 *      pageSize: // value for 'pageSize'
 *      orderDirection: // value for 'orderDirection'
 *   },
 * });
 */
export function useGetLiquidityHistoryQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetLiquidityHistoryQuery,
    GetLiquidityHistoryQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetLiquidityHistoryQuery,
    GetLiquidityHistoryQueryVariables
  >(GetLiquidityHistoryDocument, options);
}
export function useGetLiquidityHistoryLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetLiquidityHistoryQuery,
    GetLiquidityHistoryQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetLiquidityHistoryQuery,
    GetLiquidityHistoryQueryVariables
  >(GetLiquidityHistoryDocument, options);
}
export type GetLiquidityHistoryQueryHookResult = ReturnType<
  typeof useGetLiquidityHistoryQuery
>;
export type GetLiquidityHistoryLazyQueryHookResult = ReturnType<
  typeof useGetLiquidityHistoryLazyQuery
>;
export type GetLiquidityHistoryQueryResult = Apollo.QueryResult<
  GetLiquidityHistoryQuery,
  GetLiquidityHistoryQueryVariables
>;
export const GetLiquidityMiningAllocationPointsDocument = gql`
  query getLiquidityMiningAllocationPoints {
    liquidityMiningAllocationPoints {
      id
      rewardPerBlock
      ammPoolToken {
        id
        symbol
      }
      lendingPoolToken {
        id
      }
    }
  }
`;

/**
 * __useGetLiquidityMiningAllocationPointsQuery__
 *
 * To run a query within a React component, call `useGetLiquidityMiningAllocationPointsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLiquidityMiningAllocationPointsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLiquidityMiningAllocationPointsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetLiquidityMiningAllocationPointsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetLiquidityMiningAllocationPointsQuery,
    GetLiquidityMiningAllocationPointsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetLiquidityMiningAllocationPointsQuery,
    GetLiquidityMiningAllocationPointsQueryVariables
  >(GetLiquidityMiningAllocationPointsDocument, options);
}
export function useGetLiquidityMiningAllocationPointsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetLiquidityMiningAllocationPointsQuery,
    GetLiquidityMiningAllocationPointsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetLiquidityMiningAllocationPointsQuery,
    GetLiquidityMiningAllocationPointsQueryVariables
  >(GetLiquidityMiningAllocationPointsDocument, options);
}
export type GetLiquidityMiningAllocationPointsQueryHookResult = ReturnType<
  typeof useGetLiquidityMiningAllocationPointsQuery
>;
export type GetLiquidityMiningAllocationPointsLazyQueryHookResult = ReturnType<
  typeof useGetLiquidityMiningAllocationPointsLazyQuery
>;
export type GetLiquidityMiningAllocationPointsQueryResult = Apollo.QueryResult<
  GetLiquidityMiningAllocationPointsQuery,
  GetLiquidityMiningAllocationPointsQueryVariables
>;
export const GetLoanParamsSetupsDocument = gql`
  query getLoanParamsSetups($loanToken: String) {
    loanParamsSetups(
      orderBy: timestamp
      orderDirection: desc
      where: { loanToken: $loanToken }
    ) {
      collateralToken {
        id
      }
      id
      loanToken {
        id
      }
      maintenanceMargin
      minInitialMargin
      maxLoanTerm
      owner
      timestamp
      transaction {
        id
      }
    }
  }
`;

/**
 * __useGetLoanParamsSetupsQuery__
 *
 * To run a query within a React component, call `useGetLoanParamsSetupsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLoanParamsSetupsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLoanParamsSetupsQuery({
 *   variables: {
 *      loanToken: // value for 'loanToken'
 *   },
 * });
 */
export function useGetLoanParamsSetupsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetLoanParamsSetupsQuery,
    GetLoanParamsSetupsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetLoanParamsSetupsQuery,
    GetLoanParamsSetupsQueryVariables
  >(GetLoanParamsSetupsDocument, options);
}
export function useGetLoanParamsSetupsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetLoanParamsSetupsQuery,
    GetLoanParamsSetupsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetLoanParamsSetupsQuery,
    GetLoanParamsSetupsQueryVariables
  >(GetLoanParamsSetupsDocument, options);
}
export type GetLoanParamsSetupsQueryHookResult = ReturnType<
  typeof useGetLoanParamsSetupsQuery
>;
export type GetLoanParamsSetupsLazyQueryHookResult = ReturnType<
  typeof useGetLoanParamsSetupsLazyQuery
>;
export type GetLoanParamsSetupsQueryResult = Apollo.QueryResult<
  GetLoanParamsSetupsQuery,
  GetLoanParamsSetupsQueryVariables
>;
export const GetLoansDocument = gql`
  query getLoans($user: String) {
    loans(where: { user: $user, type: Borrow }) {
      id
      loanToken {
        id
        symbol
      }
      collateralToken {
        id
        symbol
      }
      borrowedAmount
      positionSize
      nextRollover
      borrow(first: 1, orderBy: timestamp, orderDirection: desc) {
        interestRate
      }
    }
  }
`;

/**
 * __useGetLoansQuery__
 *
 * To run a query within a React component, call `useGetLoansQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLoansQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLoansQuery({
 *   variables: {
 *      user: // value for 'user'
 *   },
 * });
 */
export function useGetLoansQuery(
  baseOptions?: Apollo.QueryHookOptions<GetLoansQuery, GetLoansQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetLoansQuery, GetLoansQueryVariables>(
    GetLoansDocument,
    options,
  );
}
export function useGetLoansLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetLoansQuery,
    GetLoansQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetLoansQuery, GetLoansQueryVariables>(
    GetLoansDocument,
    options,
  );
}
export type GetLoansQueryHookResult = ReturnType<typeof useGetLoansQuery>;
export type GetLoansLazyQueryHookResult = ReturnType<
  typeof useGetLoansLazyQuery
>;
export type GetLoansQueryResult = Apollo.QueryResult<
  GetLoansQuery,
  GetLoansQueryVariables
>;
export const GetProposalDocument = gql`
  query getProposal($id: ID!) {
    proposal(id: $id) {
      id
      canceled {
        id
      }
      executed {
        id
      }
      queued {
        id
      }
      created {
        id
      }
      votesFor
      votesAgainst
      countVotersFor
      countVotersAgainst
      quorum
      proposer
      majorityPercentage
      eta
      proposalId
      targets
      values
      signatures
      calldatas
      startBlock
      endBlock
      description
      timestamp
      votes {
        voter {
          id
        }
        votes
        support
        transaction {
          id
        }
        timestamp
      }
      emittedBy {
        id
        votingDelay
        votingPeriod
        quorumPercentageVotes
        majorityPercentageVotes
      }
      stateChanges {
        id
        state
        timestamp
      }
    }
  }
`;

/**
 * __useGetProposalQuery__
 *
 * To run a query within a React component, call `useGetProposalQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProposalQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProposalQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetProposalQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetProposalQuery,
    GetProposalQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetProposalQuery, GetProposalQueryVariables>(
    GetProposalDocument,
    options,
  );
}
export function useGetProposalLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetProposalQuery,
    GetProposalQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetProposalQuery, GetProposalQueryVariables>(
    GetProposalDocument,
    options,
  );
}
export type GetProposalQueryHookResult = ReturnType<typeof useGetProposalQuery>;
export type GetProposalLazyQueryHookResult = ReturnType<
  typeof useGetProposalLazyQuery
>;
export type GetProposalQueryResult = Apollo.QueryResult<
  GetProposalQuery,
  GetProposalQueryVariables
>;
export const GetProposalsDocument = gql`
  query getProposals {
    proposals(orderBy: timestamp, orderDirection: desc) {
      id
      canceled {
        id
      }
      executed {
        id
      }
      queued {
        id
      }
      created {
        id
      }
      votesFor
      votesAgainst
      countVotersFor
      countVotersAgainst
      quorum
      majorityPercentage
      eta
      proposalId
      proposer
      targets
      values
      signatures
      calldatas
      startBlock
      endBlock
      description
      timestamp
      votes {
        voter {
          id
        }
        votes
        support
        transaction {
          id
        }
      }
      emittedBy {
        id
        votingDelay
        votingPeriod
        quorumPercentageVotes
        majorityPercentageVotes
      }
      stateChanges {
        id
        state
        timestamp
      }
    }
  }
`;

/**
 * __useGetProposalsQuery__
 *
 * To run a query within a React component, call `useGetProposalsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProposalsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProposalsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetProposalsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetProposalsQuery,
    GetProposalsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetProposalsQuery, GetProposalsQueryVariables>(
    GetProposalsDocument,
    options,
  );
}
export function useGetProposalsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetProposalsQuery,
    GetProposalsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetProposalsQuery, GetProposalsQueryVariables>(
    GetProposalsDocument,
    options,
  );
}
export type GetProposalsQueryHookResult = ReturnType<
  typeof useGetProposalsQuery
>;
export type GetProposalsLazyQueryHookResult = ReturnType<
  typeof useGetProposalsLazyQuery
>;
export type GetProposalsQueryResult = Apollo.QueryResult<
  GetProposalsQuery,
  GetProposalsQueryVariables
>;
export const GetProtocolFeeDocument = gql`
  query getProtocolFee {
    swapSettings {
      protocolFee
    }
  }
`;

/**
 * __useGetProtocolFeeQuery__
 *
 * To run a query within a React component, call `useGetProtocolFeeQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProtocolFeeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProtocolFeeQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetProtocolFeeQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetProtocolFeeQuery,
    GetProtocolFeeQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetProtocolFeeQuery, GetProtocolFeeQueryVariables>(
    GetProtocolFeeDocument,
    options,
  );
}
export function useGetProtocolFeeLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetProtocolFeeQuery,
    GetProtocolFeeQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetProtocolFeeQuery, GetProtocolFeeQueryVariables>(
    GetProtocolFeeDocument,
    options,
  );
}
export type GetProtocolFeeQueryHookResult = ReturnType<
  typeof useGetProtocolFeeQuery
>;
export type GetProtocolFeeLazyQueryHookResult = ReturnType<
  typeof useGetProtocolFeeLazyQuery
>;
export type GetProtocolFeeQueryResult = Apollo.QueryResult<
  GetProtocolFeeQuery,
  GetProtocolFeeQueryVariables
>;
export const GetRewardsEarnedHistoryDocument = gql`
  query getRewardsEarnedHistory(
    $user: String
    $skip: Int!
    $pageSize: Int!
    $orderBy: RewardsEarnedHistoryItem_orderBy
    $orderDirection: OrderDirection
    $actions: [RewardsEarnedAction!]
  ) {
    rewardsEarnedHistoryItems(
      where: { user: $user, amount_gt: 0, action_in: $actions }
      first: $pageSize
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
    ) {
      id
      action
      amount
      token
      timestamp
      transaction {
        id
      }
    }
  }
`;

/**
 * __useGetRewardsEarnedHistoryQuery__
 *
 * To run a query within a React component, call `useGetRewardsEarnedHistoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRewardsEarnedHistoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRewardsEarnedHistoryQuery({
 *   variables: {
 *      user: // value for 'user'
 *      skip: // value for 'skip'
 *      pageSize: // value for 'pageSize'
 *      orderBy: // value for 'orderBy'
 *      orderDirection: // value for 'orderDirection'
 *      actions: // value for 'actions'
 *   },
 * });
 */
export function useGetRewardsEarnedHistoryQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetRewardsEarnedHistoryQuery,
    GetRewardsEarnedHistoryQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetRewardsEarnedHistoryQuery,
    GetRewardsEarnedHistoryQueryVariables
  >(GetRewardsEarnedHistoryDocument, options);
}
export function useGetRewardsEarnedHistoryLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetRewardsEarnedHistoryQuery,
    GetRewardsEarnedHistoryQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetRewardsEarnedHistoryQuery,
    GetRewardsEarnedHistoryQueryVariables
  >(GetRewardsEarnedHistoryDocument, options);
}
export type GetRewardsEarnedHistoryQueryHookResult = ReturnType<
  typeof useGetRewardsEarnedHistoryQuery
>;
export type GetRewardsEarnedHistoryLazyQueryHookResult = ReturnType<
  typeof useGetRewardsEarnedHistoryLazyQuery
>;
export type GetRewardsEarnedHistoryQueryResult = Apollo.QueryResult<
  GetRewardsEarnedHistoryQuery,
  GetRewardsEarnedHistoryQueryVariables
>;
export const GetRolloversDocument = gql`
  query getRollovers(
    $loanIds: [String!]
    $skip: Int!
    $pageSize: Int!
    $orderBy: Rollover_orderBy
    $orderDirection: OrderDirection
  ) {
    rollovers(
      where: { loanId_in: $loanIds }
      first: $pageSize
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
    ) {
      id
      user {
        id
      }
      loanId {
        id
        collateralToken {
          id
          symbol
        }
        loanToken {
          id
          symbol
        }
      }
      lender
      principal
      collateral
      endTimestamp
      rewardReceiver {
        id
      }
      reward
      timestamp
      emittedBy
      transaction {
        id
      }
    }
  }
`;

/**
 * __useGetRolloversQuery__
 *
 * To run a query within a React component, call `useGetRolloversQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRolloversQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRolloversQuery({
 *   variables: {
 *      loanIds: // value for 'loanIds'
 *      skip: // value for 'skip'
 *      pageSize: // value for 'pageSize'
 *      orderBy: // value for 'orderBy'
 *      orderDirection: // value for 'orderDirection'
 *   },
 * });
 */
export function useGetRolloversQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetRolloversQuery,
    GetRolloversQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetRolloversQuery, GetRolloversQueryVariables>(
    GetRolloversDocument,
    options,
  );
}
export function useGetRolloversLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetRolloversQuery,
    GetRolloversQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetRolloversQuery, GetRolloversQueryVariables>(
    GetRolloversDocument,
    options,
  );
}
export type GetRolloversQueryHookResult = ReturnType<
  typeof useGetRolloversQuery
>;
export type GetRolloversLazyQueryHookResult = ReturnType<
  typeof useGetRolloversLazyQuery
>;
export type GetRolloversQueryResult = Apollo.QueryResult<
  GetRolloversQuery,
  GetRolloversQueryVariables
>;
export const GetSmartTokensDocument = gql`
  query getSmartTokens(
    $skip: Int!
    $pageSize: Int!
    $orderBy: SmartToken_orderBy
    $orderDirection: OrderDirection
    $filters: SmartToken_filter
  ) {
    smartTokens(
      first: $pageSize
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
      where: $filters
    ) {
      id
      name
      decimals
      symbol
      owner
      addedToRegistryBlockNumber
    }
  }
`;

/**
 * __useGetSmartTokensQuery__
 *
 * To run a query within a React component, call `useGetSmartTokensQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSmartTokensQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSmartTokensQuery({
 *   variables: {
 *      skip: // value for 'skip'
 *      pageSize: // value for 'pageSize'
 *      orderBy: // value for 'orderBy'
 *      orderDirection: // value for 'orderDirection'
 *      filters: // value for 'filters'
 *   },
 * });
 */
export function useGetSmartTokensQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetSmartTokensQuery,
    GetSmartTokensQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetSmartTokensQuery, GetSmartTokensQueryVariables>(
    GetSmartTokensDocument,
    options,
  );
}
export function useGetSmartTokensLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetSmartTokensQuery,
    GetSmartTokensQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetSmartTokensQuery, GetSmartTokensQueryVariables>(
    GetSmartTokensDocument,
    options,
  );
}
export type GetSmartTokensQueryHookResult = ReturnType<
  typeof useGetSmartTokensQuery
>;
export type GetSmartTokensLazyQueryHookResult = ReturnType<
  typeof useGetSmartTokensLazyQuery
>;
export type GetSmartTokensQueryResult = Apollo.QueryResult<
  GetSmartTokensQuery,
  GetSmartTokensQueryVariables
>;
export const GetStakeHistoryDocument = gql`
  query getStakeHistory(
    $user: String
    $skip: Int!
    $pageSize: Int!
    $orderBy: V2TokensStaked_orderBy
    $orderDirection: OrderDirection
  ) {
    v2TokensStakeds(
      where: { user: $user }
      first: $pageSize
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
    ) {
      id
      amount
      totalStaked
      timestamp
      lockedUntil
      user {
        id
      }
    }
  }
`;

/**
 * __useGetStakeHistoryQuery__
 *
 * To run a query within a React component, call `useGetStakeHistoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetStakeHistoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetStakeHistoryQuery({
 *   variables: {
 *      user: // value for 'user'
 *      skip: // value for 'skip'
 *      pageSize: // value for 'pageSize'
 *      orderBy: // value for 'orderBy'
 *      orderDirection: // value for 'orderDirection'
 *   },
 * });
 */
export function useGetStakeHistoryQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetStakeHistoryQuery,
    GetStakeHistoryQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetStakeHistoryQuery, GetStakeHistoryQueryVariables>(
    GetStakeHistoryDocument,
    options,
  );
}
export function useGetStakeHistoryLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetStakeHistoryQuery,
    GetStakeHistoryQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetStakeHistoryQuery,
    GetStakeHistoryQueryVariables
  >(GetStakeHistoryDocument, options);
}
export type GetStakeHistoryQueryHookResult = ReturnType<
  typeof useGetStakeHistoryQuery
>;
export type GetStakeHistoryLazyQueryHookResult = ReturnType<
  typeof useGetStakeHistoryLazyQuery
>;
export type GetStakeHistoryQueryResult = Apollo.QueryResult<
  GetStakeHistoryQuery,
  GetStakeHistoryQueryVariables
>;
export const GetStakingWithdrawsDocument = gql`
  query getStakingWithdraws(
    $user: String
    $skip: Int!
    $pageSize: Int!
    $orderBy: V2StakingWithdrawn_orderBy
    $orderDirection: OrderDirection
  ) {
    v2StakingWithdrawns(
      where: { user: $user }
      first: $pageSize
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
    ) {
      id
      amount
      slashedAmount
      isGovernance
      receiver {
        id
      }
      user {
        id
      }
      timestamp
      until
    }
  }
`;

/**
 * __useGetStakingWithdrawsQuery__
 *
 * To run a query within a React component, call `useGetStakingWithdrawsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetStakingWithdrawsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetStakingWithdrawsQuery({
 *   variables: {
 *      user: // value for 'user'
 *      skip: // value for 'skip'
 *      pageSize: // value for 'pageSize'
 *      orderBy: // value for 'orderBy'
 *      orderDirection: // value for 'orderDirection'
 *   },
 * });
 */
export function useGetStakingWithdrawsQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetStakingWithdrawsQuery,
    GetStakingWithdrawsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetStakingWithdrawsQuery,
    GetStakingWithdrawsQueryVariables
  >(GetStakingWithdrawsDocument, options);
}
export function useGetStakingWithdrawsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetStakingWithdrawsQuery,
    GetStakingWithdrawsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetStakingWithdrawsQuery,
    GetStakingWithdrawsQueryVariables
  >(GetStakingWithdrawsDocument, options);
}
export type GetStakingWithdrawsQueryHookResult = ReturnType<
  typeof useGetStakingWithdrawsQuery
>;
export type GetStakingWithdrawsLazyQueryHookResult = ReturnType<
  typeof useGetStakingWithdrawsLazyQuery
>;
export type GetStakingWithdrawsQueryResult = Apollo.QueryResult<
  GetStakingWithdrawsQuery,
  GetStakingWithdrawsQueryVariables
>;
export const GetSwapHistoryDocument = gql`
  query getSwapHistory(
    $user: String
    $skip: Int!
    $pageSize: Int!
    $orderBy: Swap_orderBy
    $orderDirection: OrderDirection
  ) {
    swaps(
      where: { user: $user }
      first: $pageSize
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
    ) {
      fromToken {
        id
        symbol
      }
      toToken {
        id
        symbol
      }
      transaction {
        id
        timestamp
      }
      fromAmount
      toAmount
      conversionFee
      protocolFee
    }
  }
`;

/**
 * __useGetSwapHistoryQuery__
 *
 * To run a query within a React component, call `useGetSwapHistoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSwapHistoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSwapHistoryQuery({
 *   variables: {
 *      user: // value for 'user'
 *      skip: // value for 'skip'
 *      pageSize: // value for 'pageSize'
 *      orderBy: // value for 'orderBy'
 *      orderDirection: // value for 'orderDirection'
 *   },
 * });
 */
export function useGetSwapHistoryQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetSwapHistoryQuery,
    GetSwapHistoryQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetSwapHistoryQuery, GetSwapHistoryQueryVariables>(
    GetSwapHistoryDocument,
    options,
  );
}
export function useGetSwapHistoryLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetSwapHistoryQuery,
    GetSwapHistoryQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetSwapHistoryQuery, GetSwapHistoryQueryVariables>(
    GetSwapHistoryDocument,
    options,
  );
}
export type GetSwapHistoryQueryHookResult = ReturnType<
  typeof useGetSwapHistoryQuery
>;
export type GetSwapHistoryLazyQueryHookResult = ReturnType<
  typeof useGetSwapHistoryLazyQuery
>;
export type GetSwapHistoryQueryResult = Apollo.QueryResult<
  GetSwapHistoryQuery,
  GetSwapHistoryQueryVariables
>;
export const GetTokenDocument = gql`
  query getToken($id: ID!) {
    token(id: $id) {
      lastPriceUsd
      lastPriceBtc
    }
  }
`;

/**
 * __useGetTokenQuery__
 *
 * To run a query within a React component, call `useGetTokenQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTokenQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTokenQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetTokenQuery(
  baseOptions: Apollo.QueryHookOptions<GetTokenQuery, GetTokenQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetTokenQuery, GetTokenQueryVariables>(
    GetTokenDocument,
    options,
  );
}
export function useGetTokenLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetTokenQuery,
    GetTokenQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetTokenQuery, GetTokenQueryVariables>(
    GetTokenDocument,
    options,
  );
}
export type GetTokenQueryHookResult = ReturnType<typeof useGetTokenQuery>;
export type GetTokenLazyQueryHookResult = ReturnType<
  typeof useGetTokenLazyQuery
>;
export type GetTokenQueryResult = Apollo.QueryResult<
  GetTokenQuery,
  GetTokenQueryVariables
>;
export const GetTokenRatesDocument = gql`
  query getTokenRates {
    tokens {
      id
      symbol
      lastPriceBtc
      lastPriceUsd
    }
  }
`;

/**
 * __useGetTokenRatesQuery__
 *
 * To run a query within a React component, call `useGetTokenRatesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTokenRatesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTokenRatesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetTokenRatesQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetTokenRatesQuery,
    GetTokenRatesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetTokenRatesQuery, GetTokenRatesQueryVariables>(
    GetTokenRatesDocument,
    options,
  );
}
export function useGetTokenRatesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetTokenRatesQuery,
    GetTokenRatesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetTokenRatesQuery, GetTokenRatesQueryVariables>(
    GetTokenRatesDocument,
    options,
  );
}
export type GetTokenRatesQueryHookResult = ReturnType<
  typeof useGetTokenRatesQuery
>;
export type GetTokenRatesLazyQueryHookResult = ReturnType<
  typeof useGetTokenRatesLazyQuery
>;
export type GetTokenRatesQueryResult = Apollo.QueryResult<
  GetTokenRatesQuery,
  GetTokenRatesQueryVariables
>;
export const GetTradeVolumeDocument = gql`
  query getTradeVolume($pool: String, $timestamp: Int!) {
    poolVolumeItems(where: { pool: $pool, timestamp_gt: $timestamp }) {
      btcAmount
    }
  }
`;

/**
 * __useGetTradeVolumeQuery__
 *
 * To run a query within a React component, call `useGetTradeVolumeQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTradeVolumeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTradeVolumeQuery({
 *   variables: {
 *      pool: // value for 'pool'
 *      timestamp: // value for 'timestamp'
 *   },
 * });
 */
export function useGetTradeVolumeQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetTradeVolumeQuery,
    GetTradeVolumeQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetTradeVolumeQuery, GetTradeVolumeQueryVariables>(
    GetTradeVolumeDocument,
    options,
  );
}
export function useGetTradeVolumeLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetTradeVolumeQuery,
    GetTradeVolumeQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetTradeVolumeQuery, GetTradeVolumeQueryVariables>(
    GetTradeVolumeDocument,
    options,
  );
}
export type GetTradeVolumeQueryHookResult = ReturnType<
  typeof useGetTradeVolumeQuery
>;
export type GetTradeVolumeLazyQueryHookResult = ReturnType<
  typeof useGetTradeVolumeLazyQuery
>;
export type GetTradeVolumeQueryResult = Apollo.QueryResult<
  GetTradeVolumeQuery,
  GetTradeVolumeQueryVariables
>;
export const GetTradingRewardsDocument = gql`
  query getTradingRewards($id: ID!) {
    userRewardsEarnedHistory(id: $id) {
      availableTradingRewards
      totalTradingRewards
      totalLendingRewards
      totalLiquidityRewards
      totalStakingRewards
      totalFeeWithdrawn
    }
  }
`;

/**
 * __useGetTradingRewardsQuery__
 *
 * To run a query within a React component, call `useGetTradingRewardsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTradingRewardsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTradingRewardsQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetTradingRewardsQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetTradingRewardsQuery,
    GetTradingRewardsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetTradingRewardsQuery,
    GetTradingRewardsQueryVariables
  >(GetTradingRewardsDocument, options);
}
export function useGetTradingRewardsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetTradingRewardsQuery,
    GetTradingRewardsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetTradingRewardsQuery,
    GetTradingRewardsQueryVariables
  >(GetTradingRewardsDocument, options);
}
export type GetTradingRewardsQueryHookResult = ReturnType<
  typeof useGetTradingRewardsQuery
>;
export type GetTradingRewardsLazyQueryHookResult = ReturnType<
  typeof useGetTradingRewardsLazyQuery
>;
export type GetTradingRewardsQueryResult = Apollo.QueryResult<
  GetTradingRewardsQuery,
  GetTradingRewardsQueryVariables
>;
export const GetTransactionsDocument = gql`
  query getTransactions($limit: Int!) {
    transactions(first: $limit) {
      id
      gasPrice
      gasLimit
      to
      blockNumber
      timestamp
      from {
        id
      }
    }
  }
`;

/**
 * __useGetTransactionsQuery__
 *
 * To run a query within a React component, call `useGetTransactionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTransactionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTransactionsQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useGetTransactionsQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetTransactionsQuery,
    GetTransactionsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetTransactionsQuery, GetTransactionsQueryVariables>(
    GetTransactionsDocument,
    options,
  );
}
export function useGetTransactionsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetTransactionsQuery,
    GetTransactionsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetTransactionsQuery,
    GetTransactionsQueryVariables
  >(GetTransactionsDocument, options);
}
export type GetTransactionsQueryHookResult = ReturnType<
  typeof useGetTransactionsQuery
>;
export type GetTransactionsLazyQueryHookResult = ReturnType<
  typeof useGetTransactionsLazyQuery
>;
export type GetTransactionsQueryResult = Apollo.QueryResult<
  GetTransactionsQuery,
  GetTransactionsQueryVariables
>;
export const GetUserRewardsEarnedHistoryDocument = gql`
  query getUserRewardsEarnedHistory($user: ID!) {
    userRewardsEarnedHistory(id: $user) {
      totalFeeWithdrawn
    }
  }
`;

/**
 * __useGetUserRewardsEarnedHistoryQuery__
 *
 * To run a query within a React component, call `useGetUserRewardsEarnedHistoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserRewardsEarnedHistoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserRewardsEarnedHistoryQuery({
 *   variables: {
 *      user: // value for 'user'
 *   },
 * });
 */
export function useGetUserRewardsEarnedHistoryQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetUserRewardsEarnedHistoryQuery,
    GetUserRewardsEarnedHistoryQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetUserRewardsEarnedHistoryQuery,
    GetUserRewardsEarnedHistoryQueryVariables
  >(GetUserRewardsEarnedHistoryDocument, options);
}
export function useGetUserRewardsEarnedHistoryLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetUserRewardsEarnedHistoryQuery,
    GetUserRewardsEarnedHistoryQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetUserRewardsEarnedHistoryQuery,
    GetUserRewardsEarnedHistoryQueryVariables
  >(GetUserRewardsEarnedHistoryDocument, options);
}
export type GetUserRewardsEarnedHistoryQueryHookResult = ReturnType<
  typeof useGetUserRewardsEarnedHistoryQuery
>;
export type GetUserRewardsEarnedHistoryLazyQueryHookResult = ReturnType<
  typeof useGetUserRewardsEarnedHistoryLazyQuery
>;
export type GetUserRewardsEarnedHistoryQueryResult = Apollo.QueryResult<
  GetUserRewardsEarnedHistoryQuery,
  GetUserRewardsEarnedHistoryQueryVariables
>;
export const GetVestingContractsDocument = gql`
  query getVestingContracts($user: String, $skip: Int!, $pageSize: Int!) {
    vestingContracts(
      where: { user: $user }
      first: $pageSize
      skip: $skip
      orderBy: currentBalance
      orderDirection: desc
    ) {
      id
      cliff
      duration
      currentBalance
      type
      createdAtTimestamp
    }
  }
`;

/**
 * __useGetVestingContractsQuery__
 *
 * To run a query within a React component, call `useGetVestingContractsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetVestingContractsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetVestingContractsQuery({
 *   variables: {
 *      user: // value for 'user'
 *      skip: // value for 'skip'
 *      pageSize: // value for 'pageSize'
 *   },
 * });
 */
export function useGetVestingContractsQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetVestingContractsQuery,
    GetVestingContractsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetVestingContractsQuery,
    GetVestingContractsQueryVariables
  >(GetVestingContractsDocument, options);
}
export function useGetVestingContractsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetVestingContractsQuery,
    GetVestingContractsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetVestingContractsQuery,
    GetVestingContractsQueryVariables
  >(GetVestingContractsDocument, options);
}
export type GetVestingContractsQueryHookResult = ReturnType<
  typeof useGetVestingContractsQuery
>;
export type GetVestingContractsLazyQueryHookResult = ReturnType<
  typeof useGetVestingContractsLazyQuery
>;
export type GetVestingContractsQueryResult = Apollo.QueryResult<
  GetVestingContractsQuery,
  GetVestingContractsQueryVariables
>;
export const GetVestingContractsIdDocument = gql`
  query getVestingContractsId($user: String) {
    vestingContracts(where: { user: $user }) {
      id
    }
  }
`;

/**
 * __useGetVestingContractsIdQuery__
 *
 * To run a query within a React component, call `useGetVestingContractsIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetVestingContractsIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetVestingContractsIdQuery({
 *   variables: {
 *      user: // value for 'user'
 *   },
 * });
 */
export function useGetVestingContractsIdQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetVestingContractsIdQuery,
    GetVestingContractsIdQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetVestingContractsIdQuery,
    GetVestingContractsIdQueryVariables
  >(GetVestingContractsIdDocument, options);
}
export function useGetVestingContractsIdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetVestingContractsIdQuery,
    GetVestingContractsIdQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetVestingContractsIdQuery,
    GetVestingContractsIdQueryVariables
  >(GetVestingContractsIdDocument, options);
}
export type GetVestingContractsIdQueryHookResult = ReturnType<
  typeof useGetVestingContractsIdQuery
>;
export type GetVestingContractsIdLazyQueryHookResult = ReturnType<
  typeof useGetVestingContractsIdLazyQuery
>;
export type GetVestingContractsIdQueryResult = Apollo.QueryResult<
  GetVestingContractsIdQuery,
  GetVestingContractsIdQueryVariables
>;
export const GetUserVestingContractsDocument = gql`
  query getUserVestingContracts($userAddress: String!) {
    vestingContracts(where: { user: $userAddress }) {
      id
    }
  }
`;

/**
 * __useGetUserVestingContractsQuery__
 *
 * To run a query within a React component, call `useGetUserVestingContractsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserVestingContractsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserVestingContractsQuery({
 *   variables: {
 *      userAddress: // value for 'userAddress'
 *   },
 * });
 */
export function useGetUserVestingContractsQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetUserVestingContractsQuery,
    GetUserVestingContractsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetUserVestingContractsQuery,
    GetUserVestingContractsQueryVariables
  >(GetUserVestingContractsDocument, options);
}
export function useGetUserVestingContractsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetUserVestingContractsQuery,
    GetUserVestingContractsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetUserVestingContractsQuery,
    GetUserVestingContractsQueryVariables
  >(GetUserVestingContractsDocument, options);
}
export type GetUserVestingContractsQueryHookResult = ReturnType<
  typeof useGetUserVestingContractsQuery
>;
export type GetUserVestingContractsLazyQueryHookResult = ReturnType<
  typeof useGetUserVestingContractsLazyQuery
>;
export type GetUserVestingContractsQueryResult = Apollo.QueryResult<
  GetUserVestingContractsQuery,
  GetUserVestingContractsQueryVariables
>;
export const GetDelegateChangesForVestingsDocument = gql`
  query getDelegateChangesForVestings(
    $vestingContracts: [String!]
    $skip: Int!
    $pageSize: Int!
    $orderBy: VestingHistoryItem_orderBy
    $orderDirection: OrderDirection
  ) {
    vestingHistoryItems(
      where: { staker_in: $vestingContracts, action: DelegateChanged }
      orderBy: $orderBy
      orderDirection: $orderDirection
      first: $pageSize
      skip: $skip
    ) {
      id
      delegatee {
        id
      }
      amount
      timestamp
      transaction {
        id
      }
    }
  }
`;

/**
 * __useGetDelegateChangesForVestingsQuery__
 *
 * To run a query within a React component, call `useGetDelegateChangesForVestingsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDelegateChangesForVestingsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDelegateChangesForVestingsQuery({
 *   variables: {
 *      vestingContracts: // value for 'vestingContracts'
 *      skip: // value for 'skip'
 *      pageSize: // value for 'pageSize'
 *      orderBy: // value for 'orderBy'
 *      orderDirection: // value for 'orderDirection'
 *   },
 * });
 */
export function useGetDelegateChangesForVestingsQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetDelegateChangesForVestingsQuery,
    GetDelegateChangesForVestingsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetDelegateChangesForVestingsQuery,
    GetDelegateChangesForVestingsQueryVariables
  >(GetDelegateChangesForVestingsDocument, options);
}
export function useGetDelegateChangesForVestingsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetDelegateChangesForVestingsQuery,
    GetDelegateChangesForVestingsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetDelegateChangesForVestingsQuery,
    GetDelegateChangesForVestingsQueryVariables
  >(GetDelegateChangesForVestingsDocument, options);
}
export type GetDelegateChangesForVestingsQueryHookResult = ReturnType<
  typeof useGetDelegateChangesForVestingsQuery
>;
export type GetDelegateChangesForVestingsLazyQueryHookResult = ReturnType<
  typeof useGetDelegateChangesForVestingsLazyQuery
>;
export type GetDelegateChangesForVestingsQueryResult = Apollo.QueryResult<
  GetDelegateChangesForVestingsQuery,
  GetDelegateChangesForVestingsQueryVariables
>;
export const GetVestingHistoryDocument = gql`
  query getVestingHistory($vestingAddress: ID) {
    vestingContracts(where: { id: $vestingAddress }) {
      id
      stakeHistory(
        where: { action: TokensStaked }
        orderBy: lockedUntil
        orderDirection: desc
        first: 250
      ) {
        id
        amount
        lockedUntil
      }
    }
  }
`;

/**
 * __useGetVestingHistoryQuery__
 *
 * To run a query within a React component, call `useGetVestingHistoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetVestingHistoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetVestingHistoryQuery({
 *   variables: {
 *      vestingAddress: // value for 'vestingAddress'
 *   },
 * });
 */
export function useGetVestingHistoryQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetVestingHistoryQuery,
    GetVestingHistoryQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetVestingHistoryQuery,
    GetVestingHistoryQueryVariables
  >(GetVestingHistoryDocument, options);
}
export function useGetVestingHistoryLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetVestingHistoryQuery,
    GetVestingHistoryQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetVestingHistoryQuery,
    GetVestingHistoryQueryVariables
  >(GetVestingHistoryDocument, options);
}
export type GetVestingHistoryQueryHookResult = ReturnType<
  typeof useGetVestingHistoryQuery
>;
export type GetVestingHistoryLazyQueryHookResult = ReturnType<
  typeof useGetVestingHistoryLazyQuery
>;
export type GetVestingHistoryQueryResult = Apollo.QueryResult<
  GetVestingHistoryQuery,
  GetVestingHistoryQueryVariables
>;
export const GetUserVestingsOfTypeDocument = gql`
  query getUserVestingsOfType($user: String, $type: VestingContractType) {
    vestingContracts(where: { user: $user, type: $type }) {
      id
      stakeHistory(
        where: { action: TokensStaked }
        orderBy: lockedUntil
        orderDirection: desc
        first: 250
      ) {
        id
        amount
        lockedUntil
      }
    }
  }
`;

/**
 * __useGetUserVestingsOfTypeQuery__
 *
 * To run a query within a React component, call `useGetUserVestingsOfTypeQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserVestingsOfTypeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserVestingsOfTypeQuery({
 *   variables: {
 *      user: // value for 'user'
 *      type: // value for 'type'
 *   },
 * });
 */
export function useGetUserVestingsOfTypeQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetUserVestingsOfTypeQuery,
    GetUserVestingsOfTypeQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetUserVestingsOfTypeQuery,
    GetUserVestingsOfTypeQueryVariables
  >(GetUserVestingsOfTypeDocument, options);
}
export function useGetUserVestingsOfTypeLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetUserVestingsOfTypeQuery,
    GetUserVestingsOfTypeQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetUserVestingsOfTypeQuery,
    GetUserVestingsOfTypeQueryVariables
  >(GetUserVestingsOfTypeDocument, options);
}
export type GetUserVestingsOfTypeQueryHookResult = ReturnType<
  typeof useGetUserVestingsOfTypeQuery
>;
export type GetUserVestingsOfTypeLazyQueryHookResult = ReturnType<
  typeof useGetUserVestingsOfTypeLazyQuery
>;
export type GetUserVestingsOfTypeQueryResult = Apollo.QueryResult<
  GetUserVestingsOfTypeQuery,
  GetUserVestingsOfTypeQueryVariables
>;
export const GetVestingHistoryItemsDocument = gql`
  query getVestingHistoryItems(
    $stakers: [String!]
    $skip: Int!
    $pageSize: Int!
    $orderBy: VestingHistoryItem_orderBy
    $orderDirection: OrderDirection
  ) {
    vestingHistoryItems(
      where: { action: TokensWithdrawn, staker_in: $stakers }
      first: $pageSize
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
    ) {
      timestamp
      action
      amount
      transaction {
        id
      }
    }
  }
`;

/**
 * __useGetVestingHistoryItemsQuery__
 *
 * To run a query within a React component, call `useGetVestingHistoryItemsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetVestingHistoryItemsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetVestingHistoryItemsQuery({
 *   variables: {
 *      stakers: // value for 'stakers'
 *      skip: // value for 'skip'
 *      pageSize: // value for 'pageSize'
 *      orderBy: // value for 'orderBy'
 *      orderDirection: // value for 'orderDirection'
 *   },
 * });
 */
export function useGetVestingHistoryItemsQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetVestingHistoryItemsQuery,
    GetVestingHistoryItemsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetVestingHistoryItemsQuery,
    GetVestingHistoryItemsQueryVariables
  >(GetVestingHistoryItemsDocument, options);
}
export function useGetVestingHistoryItemsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetVestingHistoryItemsQuery,
    GetVestingHistoryItemsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetVestingHistoryItemsQuery,
    GetVestingHistoryItemsQueryVariables
  >(GetVestingHistoryItemsDocument, options);
}
export type GetVestingHistoryItemsQueryHookResult = ReturnType<
  typeof useGetVestingHistoryItemsQuery
>;
export type GetVestingHistoryItemsLazyQueryHookResult = ReturnType<
  typeof useGetVestingHistoryItemsLazyQuery
>;
export type GetVestingHistoryItemsQueryResult = Apollo.QueryResult<
  GetVestingHistoryItemsQuery,
  GetVestingHistoryItemsQueryVariables
>;
export const GetVestingUnlockBalanceDocument = gql`
  query getVestingUnlockBalance(
    $vestingAddress: ID
    $timestamp: Int
    $currentTimestamp: Int
  ) {
    vestingContracts(where: { id: $vestingAddress }) {
      id
      stakeHistory(
        where: {
          action: TokensStaked
          lockedUntil_gt: $timestamp
          lockedUntil_lte: $currentTimestamp
        }
        orderBy: lockedUntil
        orderDirection: asc
        first: 250
      ) {
        timestamp
        amount
        lockedUntil
      }
    }
  }
`;

/**
 * __useGetVestingUnlockBalanceQuery__
 *
 * To run a query within a React component, call `useGetVestingUnlockBalanceQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetVestingUnlockBalanceQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetVestingUnlockBalanceQuery({
 *   variables: {
 *      vestingAddress: // value for 'vestingAddress'
 *      timestamp: // value for 'timestamp'
 *      currentTimestamp: // value for 'currentTimestamp'
 *   },
 * });
 */
export function useGetVestingUnlockBalanceQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetVestingUnlockBalanceQuery,
    GetVestingUnlockBalanceQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetVestingUnlockBalanceQuery,
    GetVestingUnlockBalanceQueryVariables
  >(GetVestingUnlockBalanceDocument, options);
}
export function useGetVestingUnlockBalanceLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetVestingUnlockBalanceQuery,
    GetVestingUnlockBalanceQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetVestingUnlockBalanceQuery,
    GetVestingUnlockBalanceQueryVariables
  >(GetVestingUnlockBalanceDocument, options);
}
export type GetVestingUnlockBalanceQueryHookResult = ReturnType<
  typeof useGetVestingUnlockBalanceQuery
>;
export type GetVestingUnlockBalanceLazyQueryHookResult = ReturnType<
  typeof useGetVestingUnlockBalanceLazyQuery
>;
export type GetVestingUnlockBalanceQueryResult = Apollo.QueryResult<
  GetVestingUnlockBalanceQuery,
  GetVestingUnlockBalanceQueryVariables
>;
export const GetVoteDocument = gql`
  query getVote($id: String, $voter: String) {
    voteCasts(where: { proposal: $id, voter: $voter }) {
      emittedBy
      id
      proposalId
      support
      timestamp
      transaction {
        id
      }
      voter {
        id
      }
      votes
    }
  }
`;

/**
 * __useGetVoteQuery__
 *
 * To run a query within a React component, call `useGetVoteQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetVoteQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetVoteQuery({
 *   variables: {
 *      id: // value for 'id'
 *      voter: // value for 'voter'
 *   },
 * });
 */
export function useGetVoteQuery(
  baseOptions?: Apollo.QueryHookOptions<GetVoteQuery, GetVoteQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetVoteQuery, GetVoteQueryVariables>(
    GetVoteDocument,
    options,
  );
}
export function useGetVoteLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetVoteQuery,
    GetVoteQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetVoteQuery, GetVoteQueryVariables>(
    GetVoteDocument,
    options,
  );
}
export type GetVoteQueryHookResult = ReturnType<typeof useGetVoteQuery>;
export type GetVoteLazyQueryHookResult = ReturnType<typeof useGetVoteLazyQuery>;
export type GetVoteQueryResult = Apollo.QueryResult<
  GetVoteQuery,
  GetVoteQueryVariables
>;
