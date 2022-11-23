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
  BigDecimal: any;
  BigInt: any;
  Bytes: any;
};

export type AddAmmGovernanceAddress = {
  __typename?: 'AddAmmGovernanceAddress';
  gAddress: Scalars['Bytes'];
  id: Scalars['ID'];
};

export type AddAmmGovernanceAddress_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  gAddress?: InputMaybe<Scalars['Bytes']>;
  gAddress_contains?: InputMaybe<Scalars['Bytes']>;
  gAddress_in?: InputMaybe<Array<Scalars['Bytes']>>;
  gAddress_not?: InputMaybe<Scalars['Bytes']>;
  gAddress_not_contains?: InputMaybe<Scalars['Bytes']>;
  gAddress_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
};

export enum AddAmmGovernanceAddress_OrderBy {
  GAddress = 'gAddress',
  Id = 'id',
}

export type AnswerUpdated = {
  __typename?: 'AnswerUpdated';
  current: Scalars['BigInt'];
  id: Scalars['ID'];
  roundId: Scalars['BigInt'];
  updatedAt: Scalars['BigInt'];
};

export type AnswerUpdated_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  current?: InputMaybe<Scalars['BigInt']>;
  current_gt?: InputMaybe<Scalars['BigInt']>;
  current_gte?: InputMaybe<Scalars['BigInt']>;
  current_in?: InputMaybe<Array<Scalars['BigInt']>>;
  current_lt?: InputMaybe<Scalars['BigInt']>;
  current_lte?: InputMaybe<Scalars['BigInt']>;
  current_not?: InputMaybe<Scalars['BigInt']>;
  current_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  roundId?: InputMaybe<Scalars['BigInt']>;
  roundId_gt?: InputMaybe<Scalars['BigInt']>;
  roundId_gte?: InputMaybe<Scalars['BigInt']>;
  roundId_in?: InputMaybe<Array<Scalars['BigInt']>>;
  roundId_lt?: InputMaybe<Scalars['BigInt']>;
  roundId_lte?: InputMaybe<Scalars['BigInt']>;
  roundId_not?: InputMaybe<Scalars['BigInt']>;
  roundId_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  updatedAt?: InputMaybe<Scalars['BigInt']>;
  updatedAt_gt?: InputMaybe<Scalars['BigInt']>;
  updatedAt_gte?: InputMaybe<Scalars['BigInt']>;
  updatedAt_in?: InputMaybe<Array<Scalars['BigInt']>>;
  updatedAt_lt?: InputMaybe<Scalars['BigInt']>;
  updatedAt_lte?: InputMaybe<Scalars['BigInt']>;
  updatedAt_not?: InputMaybe<Scalars['BigInt']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export enum AnswerUpdated_OrderBy {
  Current = 'current',
  Id = 'id',
  RoundId = 'roundId',
  UpdatedAt = 'updatedAt',
}

export type AtomicYield = {
  __typename?: 'AtomicYield';
  calculatedYield: Scalars['BigInt'];
  createdAtTx: Transaction;
  endTimestamp: Scalars['BigInt'];
  id: Scalars['ID'];
  liquidityPool: LiquidityPool;
  startTimestamp: Scalars['BigInt'];
};

export type AtomicYield_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  calculatedYield?: InputMaybe<Scalars['BigInt']>;
  calculatedYield_gt?: InputMaybe<Scalars['BigInt']>;
  calculatedYield_gte?: InputMaybe<Scalars['BigInt']>;
  calculatedYield_in?: InputMaybe<Array<Scalars['BigInt']>>;
  calculatedYield_lt?: InputMaybe<Scalars['BigInt']>;
  calculatedYield_lte?: InputMaybe<Scalars['BigInt']>;
  calculatedYield_not?: InputMaybe<Scalars['BigInt']>;
  calculatedYield_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
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
  endTimestamp?: InputMaybe<Scalars['BigInt']>;
  endTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  endTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  endTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  endTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  endTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  endTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  endTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
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
  startTimestamp?: InputMaybe<Scalars['BigInt']>;
  startTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  startTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  startTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  startTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  startTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  startTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  startTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export enum AtomicYield_OrderBy {
  CalculatedYield = 'calculatedYield',
  CreatedAtTx = 'createdAtTx',
  EndTimestamp = 'endTimestamp',
  Id = 'id',
  LiquidityPool = 'liquidityPool',
  StartTimestamp = 'startTimestamp',
}

export type BlockChangedFilter = {
  number_gte: Scalars['Int'];
};

export type Block_Height = {
  hash?: InputMaybe<Scalars['Bytes']>;
  number?: InputMaybe<Scalars['Int']>;
  number_gte?: InputMaybe<Scalars['Int']>;
};

export type CandleSticksDay = {
  __typename?: 'CandleSticksDay';
  close: Scalars['BigDecimal'];
  high: Scalars['BigDecimal'];
  id: Scalars['ID'];
  longVolume: Scalars['BigDecimal'];
  low: Scalars['BigDecimal'];
  open?: Maybe<Scalars['BigDecimal']>;
  oraclePriceClose: Scalars['BigDecimal'];
  oraclePriceHigh: Scalars['BigDecimal'];
  oraclePriceLow: Scalars['BigDecimal'];
  oraclePriceOpen: Scalars['BigDecimal'];
  periodStartUnix: Scalars['Int'];
  perpetual: Perpetual;
  shortVolume: Scalars['BigDecimal'];
  totalVolume: Scalars['BigDecimal'];
  txCount: Scalars['Int'];
};

export type CandleSticksDay_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
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
  longVolume?: InputMaybe<Scalars['BigDecimal']>;
  longVolume_gt?: InputMaybe<Scalars['BigDecimal']>;
  longVolume_gte?: InputMaybe<Scalars['BigDecimal']>;
  longVolume_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  longVolume_lt?: InputMaybe<Scalars['BigDecimal']>;
  longVolume_lte?: InputMaybe<Scalars['BigDecimal']>;
  longVolume_not?: InputMaybe<Scalars['BigDecimal']>;
  longVolume_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
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
  oraclePriceClose?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceClose_gt?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceClose_gte?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceClose_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  oraclePriceClose_lt?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceClose_lte?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceClose_not?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceClose_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  oraclePriceHigh?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceHigh_gt?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceHigh_gte?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceHigh_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  oraclePriceHigh_lt?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceHigh_lte?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceHigh_not?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceHigh_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  oraclePriceLow?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceLow_gt?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceLow_gte?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceLow_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  oraclePriceLow_lt?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceLow_lte?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceLow_not?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceLow_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  oraclePriceOpen?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceOpen_gt?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceOpen_gte?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceOpen_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  oraclePriceOpen_lt?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceOpen_lte?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceOpen_not?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceOpen_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  periodStartUnix?: InputMaybe<Scalars['Int']>;
  periodStartUnix_gt?: InputMaybe<Scalars['Int']>;
  periodStartUnix_gte?: InputMaybe<Scalars['Int']>;
  periodStartUnix_in?: InputMaybe<Array<Scalars['Int']>>;
  periodStartUnix_lt?: InputMaybe<Scalars['Int']>;
  periodStartUnix_lte?: InputMaybe<Scalars['Int']>;
  periodStartUnix_not?: InputMaybe<Scalars['Int']>;
  periodStartUnix_not_in?: InputMaybe<Array<Scalars['Int']>>;
  perpetual?: InputMaybe<Scalars['String']>;
  perpetual_?: InputMaybe<Perpetual_Filter>;
  perpetual_contains?: InputMaybe<Scalars['String']>;
  perpetual_contains_nocase?: InputMaybe<Scalars['String']>;
  perpetual_ends_with?: InputMaybe<Scalars['String']>;
  perpetual_ends_with_nocase?: InputMaybe<Scalars['String']>;
  perpetual_gt?: InputMaybe<Scalars['String']>;
  perpetual_gte?: InputMaybe<Scalars['String']>;
  perpetual_in?: InputMaybe<Array<Scalars['String']>>;
  perpetual_lt?: InputMaybe<Scalars['String']>;
  perpetual_lte?: InputMaybe<Scalars['String']>;
  perpetual_not?: InputMaybe<Scalars['String']>;
  perpetual_not_contains?: InputMaybe<Scalars['String']>;
  perpetual_not_contains_nocase?: InputMaybe<Scalars['String']>;
  perpetual_not_ends_with?: InputMaybe<Scalars['String']>;
  perpetual_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  perpetual_not_in?: InputMaybe<Array<Scalars['String']>>;
  perpetual_not_starts_with?: InputMaybe<Scalars['String']>;
  perpetual_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  perpetual_starts_with?: InputMaybe<Scalars['String']>;
  perpetual_starts_with_nocase?: InputMaybe<Scalars['String']>;
  shortVolume?: InputMaybe<Scalars['BigDecimal']>;
  shortVolume_gt?: InputMaybe<Scalars['BigDecimal']>;
  shortVolume_gte?: InputMaybe<Scalars['BigDecimal']>;
  shortVolume_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  shortVolume_lt?: InputMaybe<Scalars['BigDecimal']>;
  shortVolume_lte?: InputMaybe<Scalars['BigDecimal']>;
  shortVolume_not?: InputMaybe<Scalars['BigDecimal']>;
  shortVolume_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
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

export enum CandleSticksDay_OrderBy {
  Close = 'close',
  High = 'high',
  Id = 'id',
  LongVolume = 'longVolume',
  Low = 'low',
  Open = 'open',
  OraclePriceClose = 'oraclePriceClose',
  OraclePriceHigh = 'oraclePriceHigh',
  OraclePriceLow = 'oraclePriceLow',
  OraclePriceOpen = 'oraclePriceOpen',
  PeriodStartUnix = 'periodStartUnix',
  Perpetual = 'perpetual',
  ShortVolume = 'shortVolume',
  TotalVolume = 'totalVolume',
  TxCount = 'txCount',
}

export type CandleSticksFifteenMinute = {
  __typename?: 'CandleSticksFifteenMinute';
  close: Scalars['BigDecimal'];
  high: Scalars['BigDecimal'];
  id: Scalars['ID'];
  longVolume: Scalars['BigDecimal'];
  low: Scalars['BigDecimal'];
  open?: Maybe<Scalars['BigDecimal']>;
  oraclePriceClose: Scalars['BigDecimal'];
  oraclePriceHigh: Scalars['BigDecimal'];
  oraclePriceLow: Scalars['BigDecimal'];
  oraclePriceOpen: Scalars['BigDecimal'];
  periodStartUnix: Scalars['Int'];
  perpetual: Perpetual;
  shortVolume: Scalars['BigDecimal'];
  totalVolume: Scalars['BigDecimal'];
  txCount: Scalars['Int'];
};

export type CandleSticksFifteenMinute_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
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
  longVolume?: InputMaybe<Scalars['BigDecimal']>;
  longVolume_gt?: InputMaybe<Scalars['BigDecimal']>;
  longVolume_gte?: InputMaybe<Scalars['BigDecimal']>;
  longVolume_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  longVolume_lt?: InputMaybe<Scalars['BigDecimal']>;
  longVolume_lte?: InputMaybe<Scalars['BigDecimal']>;
  longVolume_not?: InputMaybe<Scalars['BigDecimal']>;
  longVolume_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
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
  oraclePriceClose?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceClose_gt?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceClose_gte?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceClose_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  oraclePriceClose_lt?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceClose_lte?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceClose_not?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceClose_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  oraclePriceHigh?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceHigh_gt?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceHigh_gte?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceHigh_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  oraclePriceHigh_lt?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceHigh_lte?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceHigh_not?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceHigh_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  oraclePriceLow?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceLow_gt?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceLow_gte?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceLow_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  oraclePriceLow_lt?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceLow_lte?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceLow_not?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceLow_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  oraclePriceOpen?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceOpen_gt?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceOpen_gte?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceOpen_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  oraclePriceOpen_lt?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceOpen_lte?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceOpen_not?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceOpen_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  periodStartUnix?: InputMaybe<Scalars['Int']>;
  periodStartUnix_gt?: InputMaybe<Scalars['Int']>;
  periodStartUnix_gte?: InputMaybe<Scalars['Int']>;
  periodStartUnix_in?: InputMaybe<Array<Scalars['Int']>>;
  periodStartUnix_lt?: InputMaybe<Scalars['Int']>;
  periodStartUnix_lte?: InputMaybe<Scalars['Int']>;
  periodStartUnix_not?: InputMaybe<Scalars['Int']>;
  periodStartUnix_not_in?: InputMaybe<Array<Scalars['Int']>>;
  perpetual?: InputMaybe<Scalars['String']>;
  perpetual_?: InputMaybe<Perpetual_Filter>;
  perpetual_contains?: InputMaybe<Scalars['String']>;
  perpetual_contains_nocase?: InputMaybe<Scalars['String']>;
  perpetual_ends_with?: InputMaybe<Scalars['String']>;
  perpetual_ends_with_nocase?: InputMaybe<Scalars['String']>;
  perpetual_gt?: InputMaybe<Scalars['String']>;
  perpetual_gte?: InputMaybe<Scalars['String']>;
  perpetual_in?: InputMaybe<Array<Scalars['String']>>;
  perpetual_lt?: InputMaybe<Scalars['String']>;
  perpetual_lte?: InputMaybe<Scalars['String']>;
  perpetual_not?: InputMaybe<Scalars['String']>;
  perpetual_not_contains?: InputMaybe<Scalars['String']>;
  perpetual_not_contains_nocase?: InputMaybe<Scalars['String']>;
  perpetual_not_ends_with?: InputMaybe<Scalars['String']>;
  perpetual_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  perpetual_not_in?: InputMaybe<Array<Scalars['String']>>;
  perpetual_not_starts_with?: InputMaybe<Scalars['String']>;
  perpetual_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  perpetual_starts_with?: InputMaybe<Scalars['String']>;
  perpetual_starts_with_nocase?: InputMaybe<Scalars['String']>;
  shortVolume?: InputMaybe<Scalars['BigDecimal']>;
  shortVolume_gt?: InputMaybe<Scalars['BigDecimal']>;
  shortVolume_gte?: InputMaybe<Scalars['BigDecimal']>;
  shortVolume_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  shortVolume_lt?: InputMaybe<Scalars['BigDecimal']>;
  shortVolume_lte?: InputMaybe<Scalars['BigDecimal']>;
  shortVolume_not?: InputMaybe<Scalars['BigDecimal']>;
  shortVolume_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
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

export enum CandleSticksFifteenMinute_OrderBy {
  Close = 'close',
  High = 'high',
  Id = 'id',
  LongVolume = 'longVolume',
  Low = 'low',
  Open = 'open',
  OraclePriceClose = 'oraclePriceClose',
  OraclePriceHigh = 'oraclePriceHigh',
  OraclePriceLow = 'oraclePriceLow',
  OraclePriceOpen = 'oraclePriceOpen',
  PeriodStartUnix = 'periodStartUnix',
  Perpetual = 'perpetual',
  ShortVolume = 'shortVolume',
  TotalVolume = 'totalVolume',
  TxCount = 'txCount',
}

export type CandleSticksFourHour = {
  __typename?: 'CandleSticksFourHour';
  close: Scalars['BigDecimal'];
  high: Scalars['BigDecimal'];
  id: Scalars['ID'];
  longVolume: Scalars['BigDecimal'];
  low: Scalars['BigDecimal'];
  open?: Maybe<Scalars['BigDecimal']>;
  oraclePriceClose: Scalars['BigDecimal'];
  oraclePriceHigh: Scalars['BigDecimal'];
  oraclePriceLow: Scalars['BigDecimal'];
  oraclePriceOpen: Scalars['BigDecimal'];
  periodStartUnix: Scalars['Int'];
  perpetual: Perpetual;
  shortVolume: Scalars['BigDecimal'];
  totalVolume: Scalars['BigDecimal'];
  txCount: Scalars['Int'];
};

export type CandleSticksFourHour_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
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
  longVolume?: InputMaybe<Scalars['BigDecimal']>;
  longVolume_gt?: InputMaybe<Scalars['BigDecimal']>;
  longVolume_gte?: InputMaybe<Scalars['BigDecimal']>;
  longVolume_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  longVolume_lt?: InputMaybe<Scalars['BigDecimal']>;
  longVolume_lte?: InputMaybe<Scalars['BigDecimal']>;
  longVolume_not?: InputMaybe<Scalars['BigDecimal']>;
  longVolume_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
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
  oraclePriceClose?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceClose_gt?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceClose_gte?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceClose_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  oraclePriceClose_lt?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceClose_lte?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceClose_not?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceClose_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  oraclePriceHigh?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceHigh_gt?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceHigh_gte?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceHigh_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  oraclePriceHigh_lt?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceHigh_lte?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceHigh_not?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceHigh_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  oraclePriceLow?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceLow_gt?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceLow_gte?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceLow_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  oraclePriceLow_lt?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceLow_lte?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceLow_not?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceLow_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  oraclePriceOpen?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceOpen_gt?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceOpen_gte?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceOpen_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  oraclePriceOpen_lt?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceOpen_lte?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceOpen_not?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceOpen_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  periodStartUnix?: InputMaybe<Scalars['Int']>;
  periodStartUnix_gt?: InputMaybe<Scalars['Int']>;
  periodStartUnix_gte?: InputMaybe<Scalars['Int']>;
  periodStartUnix_in?: InputMaybe<Array<Scalars['Int']>>;
  periodStartUnix_lt?: InputMaybe<Scalars['Int']>;
  periodStartUnix_lte?: InputMaybe<Scalars['Int']>;
  periodStartUnix_not?: InputMaybe<Scalars['Int']>;
  periodStartUnix_not_in?: InputMaybe<Array<Scalars['Int']>>;
  perpetual?: InputMaybe<Scalars['String']>;
  perpetual_?: InputMaybe<Perpetual_Filter>;
  perpetual_contains?: InputMaybe<Scalars['String']>;
  perpetual_contains_nocase?: InputMaybe<Scalars['String']>;
  perpetual_ends_with?: InputMaybe<Scalars['String']>;
  perpetual_ends_with_nocase?: InputMaybe<Scalars['String']>;
  perpetual_gt?: InputMaybe<Scalars['String']>;
  perpetual_gte?: InputMaybe<Scalars['String']>;
  perpetual_in?: InputMaybe<Array<Scalars['String']>>;
  perpetual_lt?: InputMaybe<Scalars['String']>;
  perpetual_lte?: InputMaybe<Scalars['String']>;
  perpetual_not?: InputMaybe<Scalars['String']>;
  perpetual_not_contains?: InputMaybe<Scalars['String']>;
  perpetual_not_contains_nocase?: InputMaybe<Scalars['String']>;
  perpetual_not_ends_with?: InputMaybe<Scalars['String']>;
  perpetual_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  perpetual_not_in?: InputMaybe<Array<Scalars['String']>>;
  perpetual_not_starts_with?: InputMaybe<Scalars['String']>;
  perpetual_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  perpetual_starts_with?: InputMaybe<Scalars['String']>;
  perpetual_starts_with_nocase?: InputMaybe<Scalars['String']>;
  shortVolume?: InputMaybe<Scalars['BigDecimal']>;
  shortVolume_gt?: InputMaybe<Scalars['BigDecimal']>;
  shortVolume_gte?: InputMaybe<Scalars['BigDecimal']>;
  shortVolume_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  shortVolume_lt?: InputMaybe<Scalars['BigDecimal']>;
  shortVolume_lte?: InputMaybe<Scalars['BigDecimal']>;
  shortVolume_not?: InputMaybe<Scalars['BigDecimal']>;
  shortVolume_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
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

export enum CandleSticksFourHour_OrderBy {
  Close = 'close',
  High = 'high',
  Id = 'id',
  LongVolume = 'longVolume',
  Low = 'low',
  Open = 'open',
  OraclePriceClose = 'oraclePriceClose',
  OraclePriceHigh = 'oraclePriceHigh',
  OraclePriceLow = 'oraclePriceLow',
  OraclePriceOpen = 'oraclePriceOpen',
  PeriodStartUnix = 'periodStartUnix',
  Perpetual = 'perpetual',
  ShortVolume = 'shortVolume',
  TotalVolume = 'totalVolume',
  TxCount = 'txCount',
}

export type CandleSticksHour = {
  __typename?: 'CandleSticksHour';
  close: Scalars['BigDecimal'];
  high: Scalars['BigDecimal'];
  id: Scalars['ID'];
  longVolume: Scalars['BigDecimal'];
  low: Scalars['BigDecimal'];
  open?: Maybe<Scalars['BigDecimal']>;
  oraclePriceClose: Scalars['BigDecimal'];
  oraclePriceHigh: Scalars['BigDecimal'];
  oraclePriceLow: Scalars['BigDecimal'];
  oraclePriceOpen: Scalars['BigDecimal'];
  periodStartUnix: Scalars['Int'];
  perpetual: Perpetual;
  shortVolume: Scalars['BigDecimal'];
  totalVolume: Scalars['BigDecimal'];
  txCount: Scalars['Int'];
};

export type CandleSticksHour_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
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
  longVolume?: InputMaybe<Scalars['BigDecimal']>;
  longVolume_gt?: InputMaybe<Scalars['BigDecimal']>;
  longVolume_gte?: InputMaybe<Scalars['BigDecimal']>;
  longVolume_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  longVolume_lt?: InputMaybe<Scalars['BigDecimal']>;
  longVolume_lte?: InputMaybe<Scalars['BigDecimal']>;
  longVolume_not?: InputMaybe<Scalars['BigDecimal']>;
  longVolume_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
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
  oraclePriceClose?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceClose_gt?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceClose_gte?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceClose_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  oraclePriceClose_lt?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceClose_lte?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceClose_not?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceClose_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  oraclePriceHigh?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceHigh_gt?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceHigh_gte?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceHigh_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  oraclePriceHigh_lt?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceHigh_lte?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceHigh_not?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceHigh_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  oraclePriceLow?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceLow_gt?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceLow_gte?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceLow_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  oraclePriceLow_lt?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceLow_lte?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceLow_not?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceLow_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  oraclePriceOpen?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceOpen_gt?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceOpen_gte?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceOpen_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  oraclePriceOpen_lt?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceOpen_lte?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceOpen_not?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceOpen_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  periodStartUnix?: InputMaybe<Scalars['Int']>;
  periodStartUnix_gt?: InputMaybe<Scalars['Int']>;
  periodStartUnix_gte?: InputMaybe<Scalars['Int']>;
  periodStartUnix_in?: InputMaybe<Array<Scalars['Int']>>;
  periodStartUnix_lt?: InputMaybe<Scalars['Int']>;
  periodStartUnix_lte?: InputMaybe<Scalars['Int']>;
  periodStartUnix_not?: InputMaybe<Scalars['Int']>;
  periodStartUnix_not_in?: InputMaybe<Array<Scalars['Int']>>;
  perpetual?: InputMaybe<Scalars['String']>;
  perpetual_?: InputMaybe<Perpetual_Filter>;
  perpetual_contains?: InputMaybe<Scalars['String']>;
  perpetual_contains_nocase?: InputMaybe<Scalars['String']>;
  perpetual_ends_with?: InputMaybe<Scalars['String']>;
  perpetual_ends_with_nocase?: InputMaybe<Scalars['String']>;
  perpetual_gt?: InputMaybe<Scalars['String']>;
  perpetual_gte?: InputMaybe<Scalars['String']>;
  perpetual_in?: InputMaybe<Array<Scalars['String']>>;
  perpetual_lt?: InputMaybe<Scalars['String']>;
  perpetual_lte?: InputMaybe<Scalars['String']>;
  perpetual_not?: InputMaybe<Scalars['String']>;
  perpetual_not_contains?: InputMaybe<Scalars['String']>;
  perpetual_not_contains_nocase?: InputMaybe<Scalars['String']>;
  perpetual_not_ends_with?: InputMaybe<Scalars['String']>;
  perpetual_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  perpetual_not_in?: InputMaybe<Array<Scalars['String']>>;
  perpetual_not_starts_with?: InputMaybe<Scalars['String']>;
  perpetual_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  perpetual_starts_with?: InputMaybe<Scalars['String']>;
  perpetual_starts_with_nocase?: InputMaybe<Scalars['String']>;
  shortVolume?: InputMaybe<Scalars['BigDecimal']>;
  shortVolume_gt?: InputMaybe<Scalars['BigDecimal']>;
  shortVolume_gte?: InputMaybe<Scalars['BigDecimal']>;
  shortVolume_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  shortVolume_lt?: InputMaybe<Scalars['BigDecimal']>;
  shortVolume_lte?: InputMaybe<Scalars['BigDecimal']>;
  shortVolume_not?: InputMaybe<Scalars['BigDecimal']>;
  shortVolume_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
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

export enum CandleSticksHour_OrderBy {
  Close = 'close',
  High = 'high',
  Id = 'id',
  LongVolume = 'longVolume',
  Low = 'low',
  Open = 'open',
  OraclePriceClose = 'oraclePriceClose',
  OraclePriceHigh = 'oraclePriceHigh',
  OraclePriceLow = 'oraclePriceLow',
  OraclePriceOpen = 'oraclePriceOpen',
  PeriodStartUnix = 'periodStartUnix',
  Perpetual = 'perpetual',
  ShortVolume = 'shortVolume',
  TotalVolume = 'totalVolume',
  TxCount = 'txCount',
}

export type CandleSticksMinute = {
  __typename?: 'CandleSticksMinute';
  close: Scalars['BigDecimal'];
  high: Scalars['BigDecimal'];
  id: Scalars['ID'];
  longVolume: Scalars['BigDecimal'];
  low: Scalars['BigDecimal'];
  open?: Maybe<Scalars['BigDecimal']>;
  oraclePriceClose: Scalars['BigDecimal'];
  oraclePriceHigh: Scalars['BigDecimal'];
  oraclePriceLow: Scalars['BigDecimal'];
  oraclePriceOpen: Scalars['BigDecimal'];
  periodStartUnix: Scalars['Int'];
  perpetual: Perpetual;
  shortVolume: Scalars['BigDecimal'];
  totalVolume: Scalars['BigDecimal'];
  txCount: Scalars['Int'];
};

export type CandleSticksMinute_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
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
  longVolume?: InputMaybe<Scalars['BigDecimal']>;
  longVolume_gt?: InputMaybe<Scalars['BigDecimal']>;
  longVolume_gte?: InputMaybe<Scalars['BigDecimal']>;
  longVolume_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  longVolume_lt?: InputMaybe<Scalars['BigDecimal']>;
  longVolume_lte?: InputMaybe<Scalars['BigDecimal']>;
  longVolume_not?: InputMaybe<Scalars['BigDecimal']>;
  longVolume_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
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
  oraclePriceClose?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceClose_gt?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceClose_gte?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceClose_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  oraclePriceClose_lt?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceClose_lte?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceClose_not?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceClose_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  oraclePriceHigh?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceHigh_gt?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceHigh_gte?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceHigh_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  oraclePriceHigh_lt?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceHigh_lte?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceHigh_not?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceHigh_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  oraclePriceLow?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceLow_gt?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceLow_gte?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceLow_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  oraclePriceLow_lt?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceLow_lte?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceLow_not?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceLow_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  oraclePriceOpen?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceOpen_gt?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceOpen_gte?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceOpen_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  oraclePriceOpen_lt?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceOpen_lte?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceOpen_not?: InputMaybe<Scalars['BigDecimal']>;
  oraclePriceOpen_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  periodStartUnix?: InputMaybe<Scalars['Int']>;
  periodStartUnix_gt?: InputMaybe<Scalars['Int']>;
  periodStartUnix_gte?: InputMaybe<Scalars['Int']>;
  periodStartUnix_in?: InputMaybe<Array<Scalars['Int']>>;
  periodStartUnix_lt?: InputMaybe<Scalars['Int']>;
  periodStartUnix_lte?: InputMaybe<Scalars['Int']>;
  periodStartUnix_not?: InputMaybe<Scalars['Int']>;
  periodStartUnix_not_in?: InputMaybe<Array<Scalars['Int']>>;
  perpetual?: InputMaybe<Scalars['String']>;
  perpetual_?: InputMaybe<Perpetual_Filter>;
  perpetual_contains?: InputMaybe<Scalars['String']>;
  perpetual_contains_nocase?: InputMaybe<Scalars['String']>;
  perpetual_ends_with?: InputMaybe<Scalars['String']>;
  perpetual_ends_with_nocase?: InputMaybe<Scalars['String']>;
  perpetual_gt?: InputMaybe<Scalars['String']>;
  perpetual_gte?: InputMaybe<Scalars['String']>;
  perpetual_in?: InputMaybe<Array<Scalars['String']>>;
  perpetual_lt?: InputMaybe<Scalars['String']>;
  perpetual_lte?: InputMaybe<Scalars['String']>;
  perpetual_not?: InputMaybe<Scalars['String']>;
  perpetual_not_contains?: InputMaybe<Scalars['String']>;
  perpetual_not_contains_nocase?: InputMaybe<Scalars['String']>;
  perpetual_not_ends_with?: InputMaybe<Scalars['String']>;
  perpetual_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  perpetual_not_in?: InputMaybe<Array<Scalars['String']>>;
  perpetual_not_starts_with?: InputMaybe<Scalars['String']>;
  perpetual_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  perpetual_starts_with?: InputMaybe<Scalars['String']>;
  perpetual_starts_with_nocase?: InputMaybe<Scalars['String']>;
  shortVolume?: InputMaybe<Scalars['BigDecimal']>;
  shortVolume_gt?: InputMaybe<Scalars['BigDecimal']>;
  shortVolume_gte?: InputMaybe<Scalars['BigDecimal']>;
  shortVolume_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  shortVolume_lt?: InputMaybe<Scalars['BigDecimal']>;
  shortVolume_lte?: InputMaybe<Scalars['BigDecimal']>;
  shortVolume_not?: InputMaybe<Scalars['BigDecimal']>;
  shortVolume_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
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

export enum CandleSticksMinute_OrderBy {
  Close = 'close',
  High = 'high',
  Id = 'id',
  LongVolume = 'longVolume',
  Low = 'low',
  Open = 'open',
  OraclePriceClose = 'oraclePriceClose',
  OraclePriceHigh = 'oraclePriceHigh',
  OraclePriceLow = 'oraclePriceLow',
  OraclePriceOpen = 'oraclePriceOpen',
  PeriodStartUnix = 'periodStartUnix',
  Perpetual = 'perpetual',
  ShortVolume = 'shortVolume',
  TotalVolume = 'totalVolume',
  TxCount = 'txCount',
}

export type Clear = {
  __typename?: 'Clear';
  id: Scalars['ID'];
  perpetualId: Scalars['Bytes'];
  trader: Scalars['Bytes'];
};

export type Clear_Filter = {
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
  perpetualId?: InputMaybe<Scalars['Bytes']>;
  perpetualId_contains?: InputMaybe<Scalars['Bytes']>;
  perpetualId_in?: InputMaybe<Array<Scalars['Bytes']>>;
  perpetualId_not?: InputMaybe<Scalars['Bytes']>;
  perpetualId_not_contains?: InputMaybe<Scalars['Bytes']>;
  perpetualId_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  trader?: InputMaybe<Scalars['Bytes']>;
  trader_contains?: InputMaybe<Scalars['Bytes']>;
  trader_in?: InputMaybe<Array<Scalars['Bytes']>>;
  trader_not?: InputMaybe<Scalars['Bytes']>;
  trader_not_contains?: InputMaybe<Scalars['Bytes']>;
  trader_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum Clear_OrderBy {
  Id = 'id',
  PerpetualId = 'perpetualId',
  Trader = 'trader',
}

export type DistributeFee = {
  __typename?: 'DistributeFee';
  blockTimestamp: Scalars['BigInt'];
  id: Scalars['ID'];
  liquidityPool: LiquidityPool;
  participationFundFeeCC: Scalars['BigInt'];
  perpetual: Perpetual;
  protocolFeeCC: Scalars['BigInt'];
  trader: Trader;
};

export type DistributeFee_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
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
  participationFundFeeCC?: InputMaybe<Scalars['BigInt']>;
  participationFundFeeCC_gt?: InputMaybe<Scalars['BigInt']>;
  participationFundFeeCC_gte?: InputMaybe<Scalars['BigInt']>;
  participationFundFeeCC_in?: InputMaybe<Array<Scalars['BigInt']>>;
  participationFundFeeCC_lt?: InputMaybe<Scalars['BigInt']>;
  participationFundFeeCC_lte?: InputMaybe<Scalars['BigInt']>;
  participationFundFeeCC_not?: InputMaybe<Scalars['BigInt']>;
  participationFundFeeCC_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  perpetual?: InputMaybe<Scalars['String']>;
  perpetual_?: InputMaybe<Perpetual_Filter>;
  perpetual_contains?: InputMaybe<Scalars['String']>;
  perpetual_contains_nocase?: InputMaybe<Scalars['String']>;
  perpetual_ends_with?: InputMaybe<Scalars['String']>;
  perpetual_ends_with_nocase?: InputMaybe<Scalars['String']>;
  perpetual_gt?: InputMaybe<Scalars['String']>;
  perpetual_gte?: InputMaybe<Scalars['String']>;
  perpetual_in?: InputMaybe<Array<Scalars['String']>>;
  perpetual_lt?: InputMaybe<Scalars['String']>;
  perpetual_lte?: InputMaybe<Scalars['String']>;
  perpetual_not?: InputMaybe<Scalars['String']>;
  perpetual_not_contains?: InputMaybe<Scalars['String']>;
  perpetual_not_contains_nocase?: InputMaybe<Scalars['String']>;
  perpetual_not_ends_with?: InputMaybe<Scalars['String']>;
  perpetual_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  perpetual_not_in?: InputMaybe<Array<Scalars['String']>>;
  perpetual_not_starts_with?: InputMaybe<Scalars['String']>;
  perpetual_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  perpetual_starts_with?: InputMaybe<Scalars['String']>;
  perpetual_starts_with_nocase?: InputMaybe<Scalars['String']>;
  protocolFeeCC?: InputMaybe<Scalars['BigInt']>;
  protocolFeeCC_gt?: InputMaybe<Scalars['BigInt']>;
  protocolFeeCC_gte?: InputMaybe<Scalars['BigInt']>;
  protocolFeeCC_in?: InputMaybe<Array<Scalars['BigInt']>>;
  protocolFeeCC_lt?: InputMaybe<Scalars['BigInt']>;
  protocolFeeCC_lte?: InputMaybe<Scalars['BigInt']>;
  protocolFeeCC_not?: InputMaybe<Scalars['BigInt']>;
  protocolFeeCC_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  trader?: InputMaybe<Scalars['String']>;
  trader_?: InputMaybe<Trader_Filter>;
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
};

export enum DistributeFee_OrderBy {
  BlockTimestamp = 'blockTimestamp',
  Id = 'id',
  LiquidityPool = 'liquidityPool',
  ParticipationFundFeeCc = 'participationFundFeeCC',
  Perpetual = 'perpetual',
  ProtocolFeeCc = 'protocolFeeCC',
  Trader = 'trader',
}

export type Fund = {
  __typename?: 'Fund';
  cash: Scalars['BigInt'];
  createdAtBlockNumber: Scalars['BigInt'];
  createdAtTimestamp: Scalars['BigInt'];
  id: Scalars['ID'];
  liquidityPool?: Maybe<LiquidityPool>;
  targetSize: Scalars['BigInt'];
  type: FundType;
  updatedAtBlockNumber: Scalars['BigInt'];
  updatedAtTimestamp: Scalars['BigInt'];
};

export enum FundType {
  AmmFund = 'AMMFund',
  DefaultFund = 'DefaultFund',
  ParticipationFund = 'ParticipationFund',
}

export type Fund_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  cash?: InputMaybe<Scalars['BigInt']>;
  cash_gt?: InputMaybe<Scalars['BigInt']>;
  cash_gte?: InputMaybe<Scalars['BigInt']>;
  cash_in?: InputMaybe<Array<Scalars['BigInt']>>;
  cash_lt?: InputMaybe<Scalars['BigInt']>;
  cash_lte?: InputMaybe<Scalars['BigInt']>;
  cash_not?: InputMaybe<Scalars['BigInt']>;
  cash_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  createdAtBlockNumber?: InputMaybe<Scalars['BigInt']>;
  createdAtBlockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  createdAtBlockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  createdAtBlockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  createdAtBlockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  createdAtBlockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  createdAtBlockNumber_not?: InputMaybe<Scalars['BigInt']>;
  createdAtBlockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  createdAtTimestamp?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  createdAtTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
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
  targetSize?: InputMaybe<Scalars['BigInt']>;
  targetSize_gt?: InputMaybe<Scalars['BigInt']>;
  targetSize_gte?: InputMaybe<Scalars['BigInt']>;
  targetSize_in?: InputMaybe<Array<Scalars['BigInt']>>;
  targetSize_lt?: InputMaybe<Scalars['BigInt']>;
  targetSize_lte?: InputMaybe<Scalars['BigInt']>;
  targetSize_not?: InputMaybe<Scalars['BigInt']>;
  targetSize_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  type?: InputMaybe<FundType>;
  type_in?: InputMaybe<Array<FundType>>;
  type_not?: InputMaybe<FundType>;
  type_not_in?: InputMaybe<Array<FundType>>;
  updatedAtBlockNumber?: InputMaybe<Scalars['BigInt']>;
  updatedAtBlockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  updatedAtBlockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  updatedAtBlockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  updatedAtBlockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  updatedAtBlockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  updatedAtBlockNumber_not?: InputMaybe<Scalars['BigInt']>;
  updatedAtBlockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  updatedAtTimestamp?: InputMaybe<Scalars['BigInt']>;
  updatedAtTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  updatedAtTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  updatedAtTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  updatedAtTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  updatedAtTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  updatedAtTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  updatedAtTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export enum Fund_OrderBy {
  Cash = 'cash',
  CreatedAtBlockNumber = 'createdAtBlockNumber',
  CreatedAtTimestamp = 'createdAtTimestamp',
  Id = 'id',
  LiquidityPool = 'liquidityPool',
  TargetSize = 'targetSize',
  Type = 'type',
  UpdatedAtBlockNumber = 'updatedAtBlockNumber',
  UpdatedAtTimestamp = 'updatedAtTimestamp',
}

export type FundingPayment = {
  __typename?: 'FundingPayment';
  fundingRates?: Maybe<Array<FundingRate>>;
  id: Scalars['ID'];
  lastBlockTimestamp: Scalars['BigInt'];
  position: Position;
  trader: Trader;
};

export type FundingPaymentFundingRatesArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<FundingRate_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<FundingRate_Filter>;
};

export type FundingPayment_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  fundingRates_?: InputMaybe<FundingRate_Filter>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  lastBlockTimestamp?: InputMaybe<Scalars['BigInt']>;
  lastBlockTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  lastBlockTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  lastBlockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  lastBlockTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  lastBlockTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  lastBlockTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  lastBlockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  position?: InputMaybe<Scalars['String']>;
  position_?: InputMaybe<Position_Filter>;
  position_contains?: InputMaybe<Scalars['String']>;
  position_contains_nocase?: InputMaybe<Scalars['String']>;
  position_ends_with?: InputMaybe<Scalars['String']>;
  position_ends_with_nocase?: InputMaybe<Scalars['String']>;
  position_gt?: InputMaybe<Scalars['String']>;
  position_gte?: InputMaybe<Scalars['String']>;
  position_in?: InputMaybe<Array<Scalars['String']>>;
  position_lt?: InputMaybe<Scalars['String']>;
  position_lte?: InputMaybe<Scalars['String']>;
  position_not?: InputMaybe<Scalars['String']>;
  position_not_contains?: InputMaybe<Scalars['String']>;
  position_not_contains_nocase?: InputMaybe<Scalars['String']>;
  position_not_ends_with?: InputMaybe<Scalars['String']>;
  position_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  position_not_in?: InputMaybe<Array<Scalars['String']>>;
  position_not_starts_with?: InputMaybe<Scalars['String']>;
  position_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  position_starts_with?: InputMaybe<Scalars['String']>;
  position_starts_with_nocase?: InputMaybe<Scalars['String']>;
  trader?: InputMaybe<Scalars['String']>;
  trader_?: InputMaybe<Trader_Filter>;
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
};

export enum FundingPayment_OrderBy {
  FundingRates = 'fundingRates',
  Id = 'id',
  LastBlockTimestamp = 'lastBlockTimestamp',
  Position = 'position',
  Trader = 'trader',
}

export type FundingRate = {
  __typename?: 'FundingRate';
  blockTimestamp: Scalars['BigInt'];
  deltaTime: Scalars['BigInt'];
  fFundingPaymentCC: Scalars['BigInt'];
  fPositionBC: Scalars['BigInt'];
  fundingPayment: FundingPayment;
  fundingRate: Scalars['BigInt'];
  fundingTime: Scalars['BigInt'];
  id: Scalars['ID'];
  rate8h: Scalars['BigInt'];
  trader: Trader;
};

export type FundingRate_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  deltaTime?: InputMaybe<Scalars['BigInt']>;
  deltaTime_gt?: InputMaybe<Scalars['BigInt']>;
  deltaTime_gte?: InputMaybe<Scalars['BigInt']>;
  deltaTime_in?: InputMaybe<Array<Scalars['BigInt']>>;
  deltaTime_lt?: InputMaybe<Scalars['BigInt']>;
  deltaTime_lte?: InputMaybe<Scalars['BigInt']>;
  deltaTime_not?: InputMaybe<Scalars['BigInt']>;
  deltaTime_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fFundingPaymentCC?: InputMaybe<Scalars['BigInt']>;
  fFundingPaymentCC_gt?: InputMaybe<Scalars['BigInt']>;
  fFundingPaymentCC_gte?: InputMaybe<Scalars['BigInt']>;
  fFundingPaymentCC_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fFundingPaymentCC_lt?: InputMaybe<Scalars['BigInt']>;
  fFundingPaymentCC_lte?: InputMaybe<Scalars['BigInt']>;
  fFundingPaymentCC_not?: InputMaybe<Scalars['BigInt']>;
  fFundingPaymentCC_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fPositionBC?: InputMaybe<Scalars['BigInt']>;
  fPositionBC_gt?: InputMaybe<Scalars['BigInt']>;
  fPositionBC_gte?: InputMaybe<Scalars['BigInt']>;
  fPositionBC_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fPositionBC_lt?: InputMaybe<Scalars['BigInt']>;
  fPositionBC_lte?: InputMaybe<Scalars['BigInt']>;
  fPositionBC_not?: InputMaybe<Scalars['BigInt']>;
  fPositionBC_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fundingPayment?: InputMaybe<Scalars['String']>;
  fundingPayment_?: InputMaybe<FundingPayment_Filter>;
  fundingPayment_contains?: InputMaybe<Scalars['String']>;
  fundingPayment_contains_nocase?: InputMaybe<Scalars['String']>;
  fundingPayment_ends_with?: InputMaybe<Scalars['String']>;
  fundingPayment_ends_with_nocase?: InputMaybe<Scalars['String']>;
  fundingPayment_gt?: InputMaybe<Scalars['String']>;
  fundingPayment_gte?: InputMaybe<Scalars['String']>;
  fundingPayment_in?: InputMaybe<Array<Scalars['String']>>;
  fundingPayment_lt?: InputMaybe<Scalars['String']>;
  fundingPayment_lte?: InputMaybe<Scalars['String']>;
  fundingPayment_not?: InputMaybe<Scalars['String']>;
  fundingPayment_not_contains?: InputMaybe<Scalars['String']>;
  fundingPayment_not_contains_nocase?: InputMaybe<Scalars['String']>;
  fundingPayment_not_ends_with?: InputMaybe<Scalars['String']>;
  fundingPayment_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  fundingPayment_not_in?: InputMaybe<Array<Scalars['String']>>;
  fundingPayment_not_starts_with?: InputMaybe<Scalars['String']>;
  fundingPayment_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  fundingPayment_starts_with?: InputMaybe<Scalars['String']>;
  fundingPayment_starts_with_nocase?: InputMaybe<Scalars['String']>;
  fundingRate?: InputMaybe<Scalars['BigInt']>;
  fundingRate_gt?: InputMaybe<Scalars['BigInt']>;
  fundingRate_gte?: InputMaybe<Scalars['BigInt']>;
  fundingRate_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fundingRate_lt?: InputMaybe<Scalars['BigInt']>;
  fundingRate_lte?: InputMaybe<Scalars['BigInt']>;
  fundingRate_not?: InputMaybe<Scalars['BigInt']>;
  fundingRate_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fundingTime?: InputMaybe<Scalars['BigInt']>;
  fundingTime_gt?: InputMaybe<Scalars['BigInt']>;
  fundingTime_gte?: InputMaybe<Scalars['BigInt']>;
  fundingTime_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fundingTime_lt?: InputMaybe<Scalars['BigInt']>;
  fundingTime_lte?: InputMaybe<Scalars['BigInt']>;
  fundingTime_not?: InputMaybe<Scalars['BigInt']>;
  fundingTime_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  rate8h?: InputMaybe<Scalars['BigInt']>;
  rate8h_gt?: InputMaybe<Scalars['BigInt']>;
  rate8h_gte?: InputMaybe<Scalars['BigInt']>;
  rate8h_in?: InputMaybe<Array<Scalars['BigInt']>>;
  rate8h_lt?: InputMaybe<Scalars['BigInt']>;
  rate8h_lte?: InputMaybe<Scalars['BigInt']>;
  rate8h_not?: InputMaybe<Scalars['BigInt']>;
  rate8h_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  trader?: InputMaybe<Scalars['String']>;
  trader_?: InputMaybe<Trader_Filter>;
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
};

export enum FundingRate_OrderBy {
  BlockTimestamp = 'blockTimestamp',
  DeltaTime = 'deltaTime',
  FFundingPaymentCc = 'fFundingPaymentCC',
  FPositionBc = 'fPositionBC',
  FundingPayment = 'fundingPayment',
  FundingRate = 'fundingRate',
  FundingTime = 'fundingTime',
  Id = 'id',
  Rate8h = 'rate8h',
  Trader = 'trader',
}

export type ImplementationChanged = {
  __typename?: 'ImplementationChanged';
  _newImplementation: Scalars['Bytes'];
  _oldImplementation: Scalars['Bytes'];
  _sig: Scalars['Bytes'];
  id: Scalars['ID'];
};

export type ImplementationChanged_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  _newImplementation?: InputMaybe<Scalars['Bytes']>;
  _newImplementation_contains?: InputMaybe<Scalars['Bytes']>;
  _newImplementation_in?: InputMaybe<Array<Scalars['Bytes']>>;
  _newImplementation_not?: InputMaybe<Scalars['Bytes']>;
  _newImplementation_not_contains?: InputMaybe<Scalars['Bytes']>;
  _newImplementation_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  _oldImplementation?: InputMaybe<Scalars['Bytes']>;
  _oldImplementation_contains?: InputMaybe<Scalars['Bytes']>;
  _oldImplementation_in?: InputMaybe<Array<Scalars['Bytes']>>;
  _oldImplementation_not?: InputMaybe<Scalars['Bytes']>;
  _oldImplementation_not_contains?: InputMaybe<Scalars['Bytes']>;
  _oldImplementation_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  _sig?: InputMaybe<Scalars['Bytes']>;
  _sig_contains?: InputMaybe<Scalars['Bytes']>;
  _sig_in?: InputMaybe<Array<Scalars['Bytes']>>;
  _sig_not?: InputMaybe<Scalars['Bytes']>;
  _sig_not_contains?: InputMaybe<Scalars['Bytes']>;
  _sig_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
};

export enum ImplementationChanged_OrderBy {
  NewImplementation = '_newImplementation',
  OldImplementation = '_oldImplementation',
  Sig = '_sig',
  Id = 'id',
}

export type LimitOrder = {
  __typename?: 'LimitOrder';
  createdTimestamp: Scalars['BigInt'];
  createdTransactionHash: Scalars['Bytes'];
  deadline: Scalars['BigInt'];
  digest: Scalars['Bytes'];
  flags: Scalars['BigInt'];
  id: Scalars['ID'];
  leverage: Scalars['BigInt'];
  limitPrice: Scalars['BigInt'];
  perpetual: Perpetual;
  referrerAddr?: Maybe<Trader>;
  state: LimitOrderState;
  tradeAmount: Scalars['BigInt'];
  trader: Trader;
  triggerPrice: Scalars['BigInt'];
};

export enum LimitOrderState {
  Active = 'Active',
  Cancelled = 'Cancelled',
  Filled = 'Filled',
}

export type LimitOrder_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  createdTimestamp?: InputMaybe<Scalars['BigInt']>;
  createdTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  createdTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  createdTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  createdTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  createdTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  createdTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  createdTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  createdTransactionHash?: InputMaybe<Scalars['Bytes']>;
  createdTransactionHash_contains?: InputMaybe<Scalars['Bytes']>;
  createdTransactionHash_in?: InputMaybe<Array<Scalars['Bytes']>>;
  createdTransactionHash_not?: InputMaybe<Scalars['Bytes']>;
  createdTransactionHash_not_contains?: InputMaybe<Scalars['Bytes']>;
  createdTransactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  deadline?: InputMaybe<Scalars['BigInt']>;
  deadline_gt?: InputMaybe<Scalars['BigInt']>;
  deadline_gte?: InputMaybe<Scalars['BigInt']>;
  deadline_in?: InputMaybe<Array<Scalars['BigInt']>>;
  deadline_lt?: InputMaybe<Scalars['BigInt']>;
  deadline_lte?: InputMaybe<Scalars['BigInt']>;
  deadline_not?: InputMaybe<Scalars['BigInt']>;
  deadline_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  digest?: InputMaybe<Scalars['Bytes']>;
  digest_contains?: InputMaybe<Scalars['Bytes']>;
  digest_in?: InputMaybe<Array<Scalars['Bytes']>>;
  digest_not?: InputMaybe<Scalars['Bytes']>;
  digest_not_contains?: InputMaybe<Scalars['Bytes']>;
  digest_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  flags?: InputMaybe<Scalars['BigInt']>;
  flags_gt?: InputMaybe<Scalars['BigInt']>;
  flags_gte?: InputMaybe<Scalars['BigInt']>;
  flags_in?: InputMaybe<Array<Scalars['BigInt']>>;
  flags_lt?: InputMaybe<Scalars['BigInt']>;
  flags_lte?: InputMaybe<Scalars['BigInt']>;
  flags_not?: InputMaybe<Scalars['BigInt']>;
  flags_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  leverage?: InputMaybe<Scalars['BigInt']>;
  leverage_gt?: InputMaybe<Scalars['BigInt']>;
  leverage_gte?: InputMaybe<Scalars['BigInt']>;
  leverage_in?: InputMaybe<Array<Scalars['BigInt']>>;
  leverage_lt?: InputMaybe<Scalars['BigInt']>;
  leverage_lte?: InputMaybe<Scalars['BigInt']>;
  leverage_not?: InputMaybe<Scalars['BigInt']>;
  leverage_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  limitPrice?: InputMaybe<Scalars['BigInt']>;
  limitPrice_gt?: InputMaybe<Scalars['BigInt']>;
  limitPrice_gte?: InputMaybe<Scalars['BigInt']>;
  limitPrice_in?: InputMaybe<Array<Scalars['BigInt']>>;
  limitPrice_lt?: InputMaybe<Scalars['BigInt']>;
  limitPrice_lte?: InputMaybe<Scalars['BigInt']>;
  limitPrice_not?: InputMaybe<Scalars['BigInt']>;
  limitPrice_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  perpetual?: InputMaybe<Scalars['String']>;
  perpetual_?: InputMaybe<Perpetual_Filter>;
  perpetual_contains?: InputMaybe<Scalars['String']>;
  perpetual_contains_nocase?: InputMaybe<Scalars['String']>;
  perpetual_ends_with?: InputMaybe<Scalars['String']>;
  perpetual_ends_with_nocase?: InputMaybe<Scalars['String']>;
  perpetual_gt?: InputMaybe<Scalars['String']>;
  perpetual_gte?: InputMaybe<Scalars['String']>;
  perpetual_in?: InputMaybe<Array<Scalars['String']>>;
  perpetual_lt?: InputMaybe<Scalars['String']>;
  perpetual_lte?: InputMaybe<Scalars['String']>;
  perpetual_not?: InputMaybe<Scalars['String']>;
  perpetual_not_contains?: InputMaybe<Scalars['String']>;
  perpetual_not_contains_nocase?: InputMaybe<Scalars['String']>;
  perpetual_not_ends_with?: InputMaybe<Scalars['String']>;
  perpetual_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  perpetual_not_in?: InputMaybe<Array<Scalars['String']>>;
  perpetual_not_starts_with?: InputMaybe<Scalars['String']>;
  perpetual_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  perpetual_starts_with?: InputMaybe<Scalars['String']>;
  perpetual_starts_with_nocase?: InputMaybe<Scalars['String']>;
  referrerAddr?: InputMaybe<Scalars['String']>;
  referrerAddr_?: InputMaybe<Trader_Filter>;
  referrerAddr_contains?: InputMaybe<Scalars['String']>;
  referrerAddr_contains_nocase?: InputMaybe<Scalars['String']>;
  referrerAddr_ends_with?: InputMaybe<Scalars['String']>;
  referrerAddr_ends_with_nocase?: InputMaybe<Scalars['String']>;
  referrerAddr_gt?: InputMaybe<Scalars['String']>;
  referrerAddr_gte?: InputMaybe<Scalars['String']>;
  referrerAddr_in?: InputMaybe<Array<Scalars['String']>>;
  referrerAddr_lt?: InputMaybe<Scalars['String']>;
  referrerAddr_lte?: InputMaybe<Scalars['String']>;
  referrerAddr_not?: InputMaybe<Scalars['String']>;
  referrerAddr_not_contains?: InputMaybe<Scalars['String']>;
  referrerAddr_not_contains_nocase?: InputMaybe<Scalars['String']>;
  referrerAddr_not_ends_with?: InputMaybe<Scalars['String']>;
  referrerAddr_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  referrerAddr_not_in?: InputMaybe<Array<Scalars['String']>>;
  referrerAddr_not_starts_with?: InputMaybe<Scalars['String']>;
  referrerAddr_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  referrerAddr_starts_with?: InputMaybe<Scalars['String']>;
  referrerAddr_starts_with_nocase?: InputMaybe<Scalars['String']>;
  state?: InputMaybe<LimitOrderState>;
  state_in?: InputMaybe<Array<LimitOrderState>>;
  state_not?: InputMaybe<LimitOrderState>;
  state_not_in?: InputMaybe<Array<LimitOrderState>>;
  tradeAmount?: InputMaybe<Scalars['BigInt']>;
  tradeAmount_gt?: InputMaybe<Scalars['BigInt']>;
  tradeAmount_gte?: InputMaybe<Scalars['BigInt']>;
  tradeAmount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  tradeAmount_lt?: InputMaybe<Scalars['BigInt']>;
  tradeAmount_lte?: InputMaybe<Scalars['BigInt']>;
  tradeAmount_not?: InputMaybe<Scalars['BigInt']>;
  tradeAmount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  trader?: InputMaybe<Scalars['String']>;
  trader_?: InputMaybe<Trader_Filter>;
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
  triggerPrice?: InputMaybe<Scalars['BigInt']>;
  triggerPrice_gt?: InputMaybe<Scalars['BigInt']>;
  triggerPrice_gte?: InputMaybe<Scalars['BigInt']>;
  triggerPrice_in?: InputMaybe<Array<Scalars['BigInt']>>;
  triggerPrice_lt?: InputMaybe<Scalars['BigInt']>;
  triggerPrice_lte?: InputMaybe<Scalars['BigInt']>;
  triggerPrice_not?: InputMaybe<Scalars['BigInt']>;
  triggerPrice_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export enum LimitOrder_OrderBy {
  CreatedTimestamp = 'createdTimestamp',
  CreatedTransactionHash = 'createdTransactionHash',
  Deadline = 'deadline',
  Digest = 'digest',
  Flags = 'flags',
  Id = 'id',
  Leverage = 'leverage',
  LimitPrice = 'limitPrice',
  Perpetual = 'perpetual',
  ReferrerAddr = 'referrerAddr',
  State = 'state',
  TradeAmount = 'tradeAmount',
  Trader = 'trader',
  TriggerPrice = 'triggerPrice',
}

export type Liquidate = {
  __typename?: 'Liquidate';
  amountLiquidatedBC: Scalars['BigInt'];
  blockTimestamp: Scalars['BigInt'];
  id: Scalars['ID'];
  liquidationPrice: Scalars['BigInt'];
  liquidator: Trader;
  newPositionSizeBC: Scalars['BigInt'];
  perpetual: Perpetual;
  position: Position;
  trader: Trader;
  transaction: Transaction;
};

export type Liquidate_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amountLiquidatedBC?: InputMaybe<Scalars['BigInt']>;
  amountLiquidatedBC_gt?: InputMaybe<Scalars['BigInt']>;
  amountLiquidatedBC_gte?: InputMaybe<Scalars['BigInt']>;
  amountLiquidatedBC_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amountLiquidatedBC_lt?: InputMaybe<Scalars['BigInt']>;
  amountLiquidatedBC_lte?: InputMaybe<Scalars['BigInt']>;
  amountLiquidatedBC_not?: InputMaybe<Scalars['BigInt']>;
  amountLiquidatedBC_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  liquidationPrice?: InputMaybe<Scalars['BigInt']>;
  liquidationPrice_gt?: InputMaybe<Scalars['BigInt']>;
  liquidationPrice_gte?: InputMaybe<Scalars['BigInt']>;
  liquidationPrice_in?: InputMaybe<Array<Scalars['BigInt']>>;
  liquidationPrice_lt?: InputMaybe<Scalars['BigInt']>;
  liquidationPrice_lte?: InputMaybe<Scalars['BigInt']>;
  liquidationPrice_not?: InputMaybe<Scalars['BigInt']>;
  liquidationPrice_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  liquidator?: InputMaybe<Scalars['String']>;
  liquidator_?: InputMaybe<Trader_Filter>;
  liquidator_contains?: InputMaybe<Scalars['String']>;
  liquidator_contains_nocase?: InputMaybe<Scalars['String']>;
  liquidator_ends_with?: InputMaybe<Scalars['String']>;
  liquidator_ends_with_nocase?: InputMaybe<Scalars['String']>;
  liquidator_gt?: InputMaybe<Scalars['String']>;
  liquidator_gte?: InputMaybe<Scalars['String']>;
  liquidator_in?: InputMaybe<Array<Scalars['String']>>;
  liquidator_lt?: InputMaybe<Scalars['String']>;
  liquidator_lte?: InputMaybe<Scalars['String']>;
  liquidator_not?: InputMaybe<Scalars['String']>;
  liquidator_not_contains?: InputMaybe<Scalars['String']>;
  liquidator_not_contains_nocase?: InputMaybe<Scalars['String']>;
  liquidator_not_ends_with?: InputMaybe<Scalars['String']>;
  liquidator_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  liquidator_not_in?: InputMaybe<Array<Scalars['String']>>;
  liquidator_not_starts_with?: InputMaybe<Scalars['String']>;
  liquidator_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  liquidator_starts_with?: InputMaybe<Scalars['String']>;
  liquidator_starts_with_nocase?: InputMaybe<Scalars['String']>;
  newPositionSizeBC?: InputMaybe<Scalars['BigInt']>;
  newPositionSizeBC_gt?: InputMaybe<Scalars['BigInt']>;
  newPositionSizeBC_gte?: InputMaybe<Scalars['BigInt']>;
  newPositionSizeBC_in?: InputMaybe<Array<Scalars['BigInt']>>;
  newPositionSizeBC_lt?: InputMaybe<Scalars['BigInt']>;
  newPositionSizeBC_lte?: InputMaybe<Scalars['BigInt']>;
  newPositionSizeBC_not?: InputMaybe<Scalars['BigInt']>;
  newPositionSizeBC_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  perpetual?: InputMaybe<Scalars['String']>;
  perpetual_?: InputMaybe<Perpetual_Filter>;
  perpetual_contains?: InputMaybe<Scalars['String']>;
  perpetual_contains_nocase?: InputMaybe<Scalars['String']>;
  perpetual_ends_with?: InputMaybe<Scalars['String']>;
  perpetual_ends_with_nocase?: InputMaybe<Scalars['String']>;
  perpetual_gt?: InputMaybe<Scalars['String']>;
  perpetual_gte?: InputMaybe<Scalars['String']>;
  perpetual_in?: InputMaybe<Array<Scalars['String']>>;
  perpetual_lt?: InputMaybe<Scalars['String']>;
  perpetual_lte?: InputMaybe<Scalars['String']>;
  perpetual_not?: InputMaybe<Scalars['String']>;
  perpetual_not_contains?: InputMaybe<Scalars['String']>;
  perpetual_not_contains_nocase?: InputMaybe<Scalars['String']>;
  perpetual_not_ends_with?: InputMaybe<Scalars['String']>;
  perpetual_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  perpetual_not_in?: InputMaybe<Array<Scalars['String']>>;
  perpetual_not_starts_with?: InputMaybe<Scalars['String']>;
  perpetual_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  perpetual_starts_with?: InputMaybe<Scalars['String']>;
  perpetual_starts_with_nocase?: InputMaybe<Scalars['String']>;
  position?: InputMaybe<Scalars['String']>;
  position_?: InputMaybe<Position_Filter>;
  position_contains?: InputMaybe<Scalars['String']>;
  position_contains_nocase?: InputMaybe<Scalars['String']>;
  position_ends_with?: InputMaybe<Scalars['String']>;
  position_ends_with_nocase?: InputMaybe<Scalars['String']>;
  position_gt?: InputMaybe<Scalars['String']>;
  position_gte?: InputMaybe<Scalars['String']>;
  position_in?: InputMaybe<Array<Scalars['String']>>;
  position_lt?: InputMaybe<Scalars['String']>;
  position_lte?: InputMaybe<Scalars['String']>;
  position_not?: InputMaybe<Scalars['String']>;
  position_not_contains?: InputMaybe<Scalars['String']>;
  position_not_contains_nocase?: InputMaybe<Scalars['String']>;
  position_not_ends_with?: InputMaybe<Scalars['String']>;
  position_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  position_not_in?: InputMaybe<Array<Scalars['String']>>;
  position_not_starts_with?: InputMaybe<Scalars['String']>;
  position_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  position_starts_with?: InputMaybe<Scalars['String']>;
  position_starts_with_nocase?: InputMaybe<Scalars['String']>;
  trader?: InputMaybe<Scalars['String']>;
  trader_?: InputMaybe<Trader_Filter>;
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

export enum Liquidate_OrderBy {
  AmountLiquidatedBc = 'amountLiquidatedBC',
  BlockTimestamp = 'blockTimestamp',
  Id = 'id',
  LiquidationPrice = 'liquidationPrice',
  Liquidator = 'liquidator',
  NewPositionSizeBc = 'newPositionSizeBC',
  Perpetual = 'perpetual',
  Position = 'position',
  Trader = 'trader',
  Transaction = 'transaction',
}

export type LiquidityAdded = {
  __typename?: 'LiquidityAdded';
  id: Scalars['ID'];
  poolId: Scalars['BigInt'];
  shareAmount: Scalars['BigInt'];
  tokenAmount: Scalars['BigInt'];
  user: Trader;
};

export type LiquidityAdded_Filter = {
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
  poolId?: InputMaybe<Scalars['BigInt']>;
  poolId_gt?: InputMaybe<Scalars['BigInt']>;
  poolId_gte?: InputMaybe<Scalars['BigInt']>;
  poolId_in?: InputMaybe<Array<Scalars['BigInt']>>;
  poolId_lt?: InputMaybe<Scalars['BigInt']>;
  poolId_lte?: InputMaybe<Scalars['BigInt']>;
  poolId_not?: InputMaybe<Scalars['BigInt']>;
  poolId_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  shareAmount?: InputMaybe<Scalars['BigInt']>;
  shareAmount_gt?: InputMaybe<Scalars['BigInt']>;
  shareAmount_gte?: InputMaybe<Scalars['BigInt']>;
  shareAmount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  shareAmount_lt?: InputMaybe<Scalars['BigInt']>;
  shareAmount_lte?: InputMaybe<Scalars['BigInt']>;
  shareAmount_not?: InputMaybe<Scalars['BigInt']>;
  shareAmount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  tokenAmount?: InputMaybe<Scalars['BigInt']>;
  tokenAmount_gt?: InputMaybe<Scalars['BigInt']>;
  tokenAmount_gte?: InputMaybe<Scalars['BigInt']>;
  tokenAmount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  tokenAmount_lt?: InputMaybe<Scalars['BigInt']>;
  tokenAmount_lte?: InputMaybe<Scalars['BigInt']>;
  tokenAmount_not?: InputMaybe<Scalars['BigInt']>;
  tokenAmount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  user?: InputMaybe<Scalars['String']>;
  user_?: InputMaybe<Trader_Filter>;
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

export enum LiquidityAdded_OrderBy {
  Id = 'id',
  PoolId = 'poolId',
  ShareAmount = 'shareAmount',
  TokenAmount = 'tokenAmount',
  User = 'user',
}

export type LiquidityPool = {
  __typename?: 'LiquidityPool';
  atomicYields?: Maybe<Array<AtomicYield>>;
  createdAtTx: Transaction;
  distributeFees?: Maybe<Array<DistributeFee>>;
  fMaxTotalTraderFunds: Scalars['BigInt'];
  fPnLparticipantWithdrawalMinAmountLimit: Scalars['BigInt'];
  fPnLparticipantWithdrawalPercentageLimit: Scalars['BigInt'];
  fPnLparticipantsCashCC: Scalars['BigInt'];
  fRedemptionRate: Scalars['BigInt'];
  funds?: Maybe<Array<Fund>>;
  iActivePerpetualCount: Scalars['Int'];
  iPerpetualCount: Scalars['Int'];
  iPnLparticipantWithdrawalPeriod: Scalars['BigInt'];
  iPriceUpdateTimeSec: Scalars['BigInt'];
  iTargetPoolSizeUpdateTime: Scalars['BigInt'];
  id: Scalars['ID'];
  isRunning: Scalars['Boolean'];
  marginToken: Token;
  participationFundLastUpdated: Scalars['BigInt'];
  perpetuals?: Maybe<Array<Perpetual>>;
  shareToken: Token;
  totalAmountDeposited: Scalars['BigInt'];
  traderPools?: Maybe<Array<TraderPool>>;
  treasuryAddress: Scalars['Bytes'];
  updatedAtTx: Transaction;
};

export type LiquidityPoolAtomicYieldsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<AtomicYield_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<AtomicYield_Filter>;
};

export type LiquidityPoolDistributeFeesArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<DistributeFee_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<DistributeFee_Filter>;
};

export type LiquidityPoolFundsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Fund_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Fund_Filter>;
};

export type LiquidityPoolPerpetualsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Perpetual_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Perpetual_Filter>;
};

export type LiquidityPoolTraderPoolsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TraderPool_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<TraderPool_Filter>;
};

export type LiquidityPoolCreated = {
  __typename?: 'LiquidityPoolCreated';
  fPnLparticipantWithdrawalMinAmountLimit: Scalars['BigInt'];
  fPnLparticipantWithdrawalPercentageLimit: Scalars['BigInt'];
  iPnLparticipantWithdrawalPeriod: Scalars['BigInt'];
  iTargetPoolSizeUpdateTime: Scalars['BigInt'];
  id: Scalars['ID'];
  marginToken: Token;
  poolId: Scalars['Int'];
  shareToken: Token;
  treasuryAddress: Scalars['Bytes'];
};

export type LiquidityPoolCreated_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  fPnLparticipantWithdrawalMinAmountLimit?: InputMaybe<Scalars['BigInt']>;
  fPnLparticipantWithdrawalMinAmountLimit_gt?: InputMaybe<Scalars['BigInt']>;
  fPnLparticipantWithdrawalMinAmountLimit_gte?: InputMaybe<Scalars['BigInt']>;
  fPnLparticipantWithdrawalMinAmountLimit_in?: InputMaybe<
    Array<Scalars['BigInt']>
  >;
  fPnLparticipantWithdrawalMinAmountLimit_lt?: InputMaybe<Scalars['BigInt']>;
  fPnLparticipantWithdrawalMinAmountLimit_lte?: InputMaybe<Scalars['BigInt']>;
  fPnLparticipantWithdrawalMinAmountLimit_not?: InputMaybe<Scalars['BigInt']>;
  fPnLparticipantWithdrawalMinAmountLimit_not_in?: InputMaybe<
    Array<Scalars['BigInt']>
  >;
  fPnLparticipantWithdrawalPercentageLimit?: InputMaybe<Scalars['BigInt']>;
  fPnLparticipantWithdrawalPercentageLimit_gt?: InputMaybe<Scalars['BigInt']>;
  fPnLparticipantWithdrawalPercentageLimit_gte?: InputMaybe<Scalars['BigInt']>;
  fPnLparticipantWithdrawalPercentageLimit_in?: InputMaybe<
    Array<Scalars['BigInt']>
  >;
  fPnLparticipantWithdrawalPercentageLimit_lt?: InputMaybe<Scalars['BigInt']>;
  fPnLparticipantWithdrawalPercentageLimit_lte?: InputMaybe<Scalars['BigInt']>;
  fPnLparticipantWithdrawalPercentageLimit_not?: InputMaybe<Scalars['BigInt']>;
  fPnLparticipantWithdrawalPercentageLimit_not_in?: InputMaybe<
    Array<Scalars['BigInt']>
  >;
  iPnLparticipantWithdrawalPeriod?: InputMaybe<Scalars['BigInt']>;
  iPnLparticipantWithdrawalPeriod_gt?: InputMaybe<Scalars['BigInt']>;
  iPnLparticipantWithdrawalPeriod_gte?: InputMaybe<Scalars['BigInt']>;
  iPnLparticipantWithdrawalPeriod_in?: InputMaybe<Array<Scalars['BigInt']>>;
  iPnLparticipantWithdrawalPeriod_lt?: InputMaybe<Scalars['BigInt']>;
  iPnLparticipantWithdrawalPeriod_lte?: InputMaybe<Scalars['BigInt']>;
  iPnLparticipantWithdrawalPeriod_not?: InputMaybe<Scalars['BigInt']>;
  iPnLparticipantWithdrawalPeriod_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  iTargetPoolSizeUpdateTime?: InputMaybe<Scalars['BigInt']>;
  iTargetPoolSizeUpdateTime_gt?: InputMaybe<Scalars['BigInt']>;
  iTargetPoolSizeUpdateTime_gte?: InputMaybe<Scalars['BigInt']>;
  iTargetPoolSizeUpdateTime_in?: InputMaybe<Array<Scalars['BigInt']>>;
  iTargetPoolSizeUpdateTime_lt?: InputMaybe<Scalars['BigInt']>;
  iTargetPoolSizeUpdateTime_lte?: InputMaybe<Scalars['BigInt']>;
  iTargetPoolSizeUpdateTime_not?: InputMaybe<Scalars['BigInt']>;
  iTargetPoolSizeUpdateTime_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  marginToken?: InputMaybe<Scalars['String']>;
  marginToken_?: InputMaybe<Token_Filter>;
  marginToken_contains?: InputMaybe<Scalars['String']>;
  marginToken_contains_nocase?: InputMaybe<Scalars['String']>;
  marginToken_ends_with?: InputMaybe<Scalars['String']>;
  marginToken_ends_with_nocase?: InputMaybe<Scalars['String']>;
  marginToken_gt?: InputMaybe<Scalars['String']>;
  marginToken_gte?: InputMaybe<Scalars['String']>;
  marginToken_in?: InputMaybe<Array<Scalars['String']>>;
  marginToken_lt?: InputMaybe<Scalars['String']>;
  marginToken_lte?: InputMaybe<Scalars['String']>;
  marginToken_not?: InputMaybe<Scalars['String']>;
  marginToken_not_contains?: InputMaybe<Scalars['String']>;
  marginToken_not_contains_nocase?: InputMaybe<Scalars['String']>;
  marginToken_not_ends_with?: InputMaybe<Scalars['String']>;
  marginToken_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  marginToken_not_in?: InputMaybe<Array<Scalars['String']>>;
  marginToken_not_starts_with?: InputMaybe<Scalars['String']>;
  marginToken_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  marginToken_starts_with?: InputMaybe<Scalars['String']>;
  marginToken_starts_with_nocase?: InputMaybe<Scalars['String']>;
  poolId?: InputMaybe<Scalars['Int']>;
  poolId_gt?: InputMaybe<Scalars['Int']>;
  poolId_gte?: InputMaybe<Scalars['Int']>;
  poolId_in?: InputMaybe<Array<Scalars['Int']>>;
  poolId_lt?: InputMaybe<Scalars['Int']>;
  poolId_lte?: InputMaybe<Scalars['Int']>;
  poolId_not?: InputMaybe<Scalars['Int']>;
  poolId_not_in?: InputMaybe<Array<Scalars['Int']>>;
  shareToken?: InputMaybe<Scalars['String']>;
  shareToken_?: InputMaybe<Token_Filter>;
  shareToken_contains?: InputMaybe<Scalars['String']>;
  shareToken_contains_nocase?: InputMaybe<Scalars['String']>;
  shareToken_ends_with?: InputMaybe<Scalars['String']>;
  shareToken_ends_with_nocase?: InputMaybe<Scalars['String']>;
  shareToken_gt?: InputMaybe<Scalars['String']>;
  shareToken_gte?: InputMaybe<Scalars['String']>;
  shareToken_in?: InputMaybe<Array<Scalars['String']>>;
  shareToken_lt?: InputMaybe<Scalars['String']>;
  shareToken_lte?: InputMaybe<Scalars['String']>;
  shareToken_not?: InputMaybe<Scalars['String']>;
  shareToken_not_contains?: InputMaybe<Scalars['String']>;
  shareToken_not_contains_nocase?: InputMaybe<Scalars['String']>;
  shareToken_not_ends_with?: InputMaybe<Scalars['String']>;
  shareToken_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  shareToken_not_in?: InputMaybe<Array<Scalars['String']>>;
  shareToken_not_starts_with?: InputMaybe<Scalars['String']>;
  shareToken_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  shareToken_starts_with?: InputMaybe<Scalars['String']>;
  shareToken_starts_with_nocase?: InputMaybe<Scalars['String']>;
  treasuryAddress?: InputMaybe<Scalars['Bytes']>;
  treasuryAddress_contains?: InputMaybe<Scalars['Bytes']>;
  treasuryAddress_in?: InputMaybe<Array<Scalars['Bytes']>>;
  treasuryAddress_not?: InputMaybe<Scalars['Bytes']>;
  treasuryAddress_not_contains?: InputMaybe<Scalars['Bytes']>;
  treasuryAddress_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum LiquidityPoolCreated_OrderBy {
  FPnLparticipantWithdrawalMinAmountLimit = 'fPnLparticipantWithdrawalMinAmountLimit',
  FPnLparticipantWithdrawalPercentageLimit = 'fPnLparticipantWithdrawalPercentageLimit',
  IPnLparticipantWithdrawalPeriod = 'iPnLparticipantWithdrawalPeriod',
  ITargetPoolSizeUpdateTime = 'iTargetPoolSizeUpdateTime',
  Id = 'id',
  MarginToken = 'marginToken',
  PoolId = 'poolId',
  ShareToken = 'shareToken',
  TreasuryAddress = 'treasuryAddress',
}

export type LiquidityPool_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  atomicYields_?: InputMaybe<AtomicYield_Filter>;
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
  distributeFees_?: InputMaybe<DistributeFee_Filter>;
  fMaxTotalTraderFunds?: InputMaybe<Scalars['BigInt']>;
  fMaxTotalTraderFunds_gt?: InputMaybe<Scalars['BigInt']>;
  fMaxTotalTraderFunds_gte?: InputMaybe<Scalars['BigInt']>;
  fMaxTotalTraderFunds_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fMaxTotalTraderFunds_lt?: InputMaybe<Scalars['BigInt']>;
  fMaxTotalTraderFunds_lte?: InputMaybe<Scalars['BigInt']>;
  fMaxTotalTraderFunds_not?: InputMaybe<Scalars['BigInt']>;
  fMaxTotalTraderFunds_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fPnLparticipantWithdrawalMinAmountLimit?: InputMaybe<Scalars['BigInt']>;
  fPnLparticipantWithdrawalMinAmountLimit_gt?: InputMaybe<Scalars['BigInt']>;
  fPnLparticipantWithdrawalMinAmountLimit_gte?: InputMaybe<Scalars['BigInt']>;
  fPnLparticipantWithdrawalMinAmountLimit_in?: InputMaybe<
    Array<Scalars['BigInt']>
  >;
  fPnLparticipantWithdrawalMinAmountLimit_lt?: InputMaybe<Scalars['BigInt']>;
  fPnLparticipantWithdrawalMinAmountLimit_lte?: InputMaybe<Scalars['BigInt']>;
  fPnLparticipantWithdrawalMinAmountLimit_not?: InputMaybe<Scalars['BigInt']>;
  fPnLparticipantWithdrawalMinAmountLimit_not_in?: InputMaybe<
    Array<Scalars['BigInt']>
  >;
  fPnLparticipantWithdrawalPercentageLimit?: InputMaybe<Scalars['BigInt']>;
  fPnLparticipantWithdrawalPercentageLimit_gt?: InputMaybe<Scalars['BigInt']>;
  fPnLparticipantWithdrawalPercentageLimit_gte?: InputMaybe<Scalars['BigInt']>;
  fPnLparticipantWithdrawalPercentageLimit_in?: InputMaybe<
    Array<Scalars['BigInt']>
  >;
  fPnLparticipantWithdrawalPercentageLimit_lt?: InputMaybe<Scalars['BigInt']>;
  fPnLparticipantWithdrawalPercentageLimit_lte?: InputMaybe<Scalars['BigInt']>;
  fPnLparticipantWithdrawalPercentageLimit_not?: InputMaybe<Scalars['BigInt']>;
  fPnLparticipantWithdrawalPercentageLimit_not_in?: InputMaybe<
    Array<Scalars['BigInt']>
  >;
  fPnLparticipantsCashCC?: InputMaybe<Scalars['BigInt']>;
  fPnLparticipantsCashCC_gt?: InputMaybe<Scalars['BigInt']>;
  fPnLparticipantsCashCC_gte?: InputMaybe<Scalars['BigInt']>;
  fPnLparticipantsCashCC_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fPnLparticipantsCashCC_lt?: InputMaybe<Scalars['BigInt']>;
  fPnLparticipantsCashCC_lte?: InputMaybe<Scalars['BigInt']>;
  fPnLparticipantsCashCC_not?: InputMaybe<Scalars['BigInt']>;
  fPnLparticipantsCashCC_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fRedemptionRate?: InputMaybe<Scalars['BigInt']>;
  fRedemptionRate_gt?: InputMaybe<Scalars['BigInt']>;
  fRedemptionRate_gte?: InputMaybe<Scalars['BigInt']>;
  fRedemptionRate_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fRedemptionRate_lt?: InputMaybe<Scalars['BigInt']>;
  fRedemptionRate_lte?: InputMaybe<Scalars['BigInt']>;
  fRedemptionRate_not?: InputMaybe<Scalars['BigInt']>;
  fRedemptionRate_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  funds_?: InputMaybe<Fund_Filter>;
  iActivePerpetualCount?: InputMaybe<Scalars['Int']>;
  iActivePerpetualCount_gt?: InputMaybe<Scalars['Int']>;
  iActivePerpetualCount_gte?: InputMaybe<Scalars['Int']>;
  iActivePerpetualCount_in?: InputMaybe<Array<Scalars['Int']>>;
  iActivePerpetualCount_lt?: InputMaybe<Scalars['Int']>;
  iActivePerpetualCount_lte?: InputMaybe<Scalars['Int']>;
  iActivePerpetualCount_not?: InputMaybe<Scalars['Int']>;
  iActivePerpetualCount_not_in?: InputMaybe<Array<Scalars['Int']>>;
  iPerpetualCount?: InputMaybe<Scalars['Int']>;
  iPerpetualCount_gt?: InputMaybe<Scalars['Int']>;
  iPerpetualCount_gte?: InputMaybe<Scalars['Int']>;
  iPerpetualCount_in?: InputMaybe<Array<Scalars['Int']>>;
  iPerpetualCount_lt?: InputMaybe<Scalars['Int']>;
  iPerpetualCount_lte?: InputMaybe<Scalars['Int']>;
  iPerpetualCount_not?: InputMaybe<Scalars['Int']>;
  iPerpetualCount_not_in?: InputMaybe<Array<Scalars['Int']>>;
  iPnLparticipantWithdrawalPeriod?: InputMaybe<Scalars['BigInt']>;
  iPnLparticipantWithdrawalPeriod_gt?: InputMaybe<Scalars['BigInt']>;
  iPnLparticipantWithdrawalPeriod_gte?: InputMaybe<Scalars['BigInt']>;
  iPnLparticipantWithdrawalPeriod_in?: InputMaybe<Array<Scalars['BigInt']>>;
  iPnLparticipantWithdrawalPeriod_lt?: InputMaybe<Scalars['BigInt']>;
  iPnLparticipantWithdrawalPeriod_lte?: InputMaybe<Scalars['BigInt']>;
  iPnLparticipantWithdrawalPeriod_not?: InputMaybe<Scalars['BigInt']>;
  iPnLparticipantWithdrawalPeriod_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  iPriceUpdateTimeSec?: InputMaybe<Scalars['BigInt']>;
  iPriceUpdateTimeSec_gt?: InputMaybe<Scalars['BigInt']>;
  iPriceUpdateTimeSec_gte?: InputMaybe<Scalars['BigInt']>;
  iPriceUpdateTimeSec_in?: InputMaybe<Array<Scalars['BigInt']>>;
  iPriceUpdateTimeSec_lt?: InputMaybe<Scalars['BigInt']>;
  iPriceUpdateTimeSec_lte?: InputMaybe<Scalars['BigInt']>;
  iPriceUpdateTimeSec_not?: InputMaybe<Scalars['BigInt']>;
  iPriceUpdateTimeSec_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  iTargetPoolSizeUpdateTime?: InputMaybe<Scalars['BigInt']>;
  iTargetPoolSizeUpdateTime_gt?: InputMaybe<Scalars['BigInt']>;
  iTargetPoolSizeUpdateTime_gte?: InputMaybe<Scalars['BigInt']>;
  iTargetPoolSizeUpdateTime_in?: InputMaybe<Array<Scalars['BigInt']>>;
  iTargetPoolSizeUpdateTime_lt?: InputMaybe<Scalars['BigInt']>;
  iTargetPoolSizeUpdateTime_lte?: InputMaybe<Scalars['BigInt']>;
  iTargetPoolSizeUpdateTime_not?: InputMaybe<Scalars['BigInt']>;
  iTargetPoolSizeUpdateTime_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  isRunning?: InputMaybe<Scalars['Boolean']>;
  isRunning_in?: InputMaybe<Array<Scalars['Boolean']>>;
  isRunning_not?: InputMaybe<Scalars['Boolean']>;
  isRunning_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  marginToken?: InputMaybe<Scalars['String']>;
  marginToken_?: InputMaybe<Token_Filter>;
  marginToken_contains?: InputMaybe<Scalars['String']>;
  marginToken_contains_nocase?: InputMaybe<Scalars['String']>;
  marginToken_ends_with?: InputMaybe<Scalars['String']>;
  marginToken_ends_with_nocase?: InputMaybe<Scalars['String']>;
  marginToken_gt?: InputMaybe<Scalars['String']>;
  marginToken_gte?: InputMaybe<Scalars['String']>;
  marginToken_in?: InputMaybe<Array<Scalars['String']>>;
  marginToken_lt?: InputMaybe<Scalars['String']>;
  marginToken_lte?: InputMaybe<Scalars['String']>;
  marginToken_not?: InputMaybe<Scalars['String']>;
  marginToken_not_contains?: InputMaybe<Scalars['String']>;
  marginToken_not_contains_nocase?: InputMaybe<Scalars['String']>;
  marginToken_not_ends_with?: InputMaybe<Scalars['String']>;
  marginToken_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  marginToken_not_in?: InputMaybe<Array<Scalars['String']>>;
  marginToken_not_starts_with?: InputMaybe<Scalars['String']>;
  marginToken_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  marginToken_starts_with?: InputMaybe<Scalars['String']>;
  marginToken_starts_with_nocase?: InputMaybe<Scalars['String']>;
  participationFundLastUpdated?: InputMaybe<Scalars['BigInt']>;
  participationFundLastUpdated_gt?: InputMaybe<Scalars['BigInt']>;
  participationFundLastUpdated_gte?: InputMaybe<Scalars['BigInt']>;
  participationFundLastUpdated_in?: InputMaybe<Array<Scalars['BigInt']>>;
  participationFundLastUpdated_lt?: InputMaybe<Scalars['BigInt']>;
  participationFundLastUpdated_lte?: InputMaybe<Scalars['BigInt']>;
  participationFundLastUpdated_not?: InputMaybe<Scalars['BigInt']>;
  participationFundLastUpdated_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  perpetuals_?: InputMaybe<Perpetual_Filter>;
  shareToken?: InputMaybe<Scalars['String']>;
  shareToken_?: InputMaybe<Token_Filter>;
  shareToken_contains?: InputMaybe<Scalars['String']>;
  shareToken_contains_nocase?: InputMaybe<Scalars['String']>;
  shareToken_ends_with?: InputMaybe<Scalars['String']>;
  shareToken_ends_with_nocase?: InputMaybe<Scalars['String']>;
  shareToken_gt?: InputMaybe<Scalars['String']>;
  shareToken_gte?: InputMaybe<Scalars['String']>;
  shareToken_in?: InputMaybe<Array<Scalars['String']>>;
  shareToken_lt?: InputMaybe<Scalars['String']>;
  shareToken_lte?: InputMaybe<Scalars['String']>;
  shareToken_not?: InputMaybe<Scalars['String']>;
  shareToken_not_contains?: InputMaybe<Scalars['String']>;
  shareToken_not_contains_nocase?: InputMaybe<Scalars['String']>;
  shareToken_not_ends_with?: InputMaybe<Scalars['String']>;
  shareToken_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  shareToken_not_in?: InputMaybe<Array<Scalars['String']>>;
  shareToken_not_starts_with?: InputMaybe<Scalars['String']>;
  shareToken_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  shareToken_starts_with?: InputMaybe<Scalars['String']>;
  shareToken_starts_with_nocase?: InputMaybe<Scalars['String']>;
  totalAmountDeposited?: InputMaybe<Scalars['BigInt']>;
  totalAmountDeposited_gt?: InputMaybe<Scalars['BigInt']>;
  totalAmountDeposited_gte?: InputMaybe<Scalars['BigInt']>;
  totalAmountDeposited_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalAmountDeposited_lt?: InputMaybe<Scalars['BigInt']>;
  totalAmountDeposited_lte?: InputMaybe<Scalars['BigInt']>;
  totalAmountDeposited_not?: InputMaybe<Scalars['BigInt']>;
  totalAmountDeposited_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  traderPools_?: InputMaybe<TraderPool_Filter>;
  treasuryAddress?: InputMaybe<Scalars['Bytes']>;
  treasuryAddress_contains?: InputMaybe<Scalars['Bytes']>;
  treasuryAddress_in?: InputMaybe<Array<Scalars['Bytes']>>;
  treasuryAddress_not?: InputMaybe<Scalars['Bytes']>;
  treasuryAddress_not_contains?: InputMaybe<Scalars['Bytes']>;
  treasuryAddress_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
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

export enum LiquidityPool_OrderBy {
  AtomicYields = 'atomicYields',
  CreatedAtTx = 'createdAtTx',
  DistributeFees = 'distributeFees',
  FMaxTotalTraderFunds = 'fMaxTotalTraderFunds',
  FPnLparticipantWithdrawalMinAmountLimit = 'fPnLparticipantWithdrawalMinAmountLimit',
  FPnLparticipantWithdrawalPercentageLimit = 'fPnLparticipantWithdrawalPercentageLimit',
  FPnLparticipantsCashCc = 'fPnLparticipantsCashCC',
  FRedemptionRate = 'fRedemptionRate',
  Funds = 'funds',
  IActivePerpetualCount = 'iActivePerpetualCount',
  IPerpetualCount = 'iPerpetualCount',
  IPnLparticipantWithdrawalPeriod = 'iPnLparticipantWithdrawalPeriod',
  IPriceUpdateTimeSec = 'iPriceUpdateTimeSec',
  ITargetPoolSizeUpdateTime = 'iTargetPoolSizeUpdateTime',
  Id = 'id',
  IsRunning = 'isRunning',
  MarginToken = 'marginToken',
  ParticipationFundLastUpdated = 'participationFundLastUpdated',
  Perpetuals = 'perpetuals',
  ShareToken = 'shareToken',
  TotalAmountDeposited = 'totalAmountDeposited',
  TraderPools = 'traderPools',
  TreasuryAddress = 'treasuryAddress',
  UpdatedAtTx = 'updatedAtTx',
}

export type LiquidityRemoved = {
  __typename?: 'LiquidityRemoved';
  id: Scalars['ID'];
  poolId: Scalars['BigInt'];
  shareAmount: Scalars['BigInt'];
  tokenAmount: Scalars['BigInt'];
  user: Trader;
};

export type LiquidityRemoved_Filter = {
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
  poolId?: InputMaybe<Scalars['BigInt']>;
  poolId_gt?: InputMaybe<Scalars['BigInt']>;
  poolId_gte?: InputMaybe<Scalars['BigInt']>;
  poolId_in?: InputMaybe<Array<Scalars['BigInt']>>;
  poolId_lt?: InputMaybe<Scalars['BigInt']>;
  poolId_lte?: InputMaybe<Scalars['BigInt']>;
  poolId_not?: InputMaybe<Scalars['BigInt']>;
  poolId_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  shareAmount?: InputMaybe<Scalars['BigInt']>;
  shareAmount_gt?: InputMaybe<Scalars['BigInt']>;
  shareAmount_gte?: InputMaybe<Scalars['BigInt']>;
  shareAmount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  shareAmount_lt?: InputMaybe<Scalars['BigInt']>;
  shareAmount_lte?: InputMaybe<Scalars['BigInt']>;
  shareAmount_not?: InputMaybe<Scalars['BigInt']>;
  shareAmount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  tokenAmount?: InputMaybe<Scalars['BigInt']>;
  tokenAmount_gt?: InputMaybe<Scalars['BigInt']>;
  tokenAmount_gte?: InputMaybe<Scalars['BigInt']>;
  tokenAmount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  tokenAmount_lt?: InputMaybe<Scalars['BigInt']>;
  tokenAmount_lte?: InputMaybe<Scalars['BigInt']>;
  tokenAmount_not?: InputMaybe<Scalars['BigInt']>;
  tokenAmount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  user?: InputMaybe<Scalars['String']>;
  user_?: InputMaybe<Trader_Filter>;
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

export enum LiquidityRemoved_OrderBy {
  Id = 'id',
  PoolId = 'poolId',
  ShareAmount = 'shareAmount',
  TokenAmount = 'tokenAmount',
  User = 'user',
}

/** Defines the order direction, either ascending or descending */
export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc',
}

export type OwnershipTransferred = {
  __typename?: 'OwnershipTransferred';
  id: Scalars['ID'];
  newOwner: Scalars['Bytes'];
  previousOwner: Scalars['Bytes'];
};

export type OwnershipTransferred_Filter = {
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
  newOwner?: InputMaybe<Scalars['Bytes']>;
  newOwner_contains?: InputMaybe<Scalars['Bytes']>;
  newOwner_in?: InputMaybe<Array<Scalars['Bytes']>>;
  newOwner_not?: InputMaybe<Scalars['Bytes']>;
  newOwner_not_contains?: InputMaybe<Scalars['Bytes']>;
  newOwner_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  previousOwner?: InputMaybe<Scalars['Bytes']>;
  previousOwner_contains?: InputMaybe<Scalars['Bytes']>;
  previousOwner_in?: InputMaybe<Array<Scalars['Bytes']>>;
  previousOwner_not?: InputMaybe<Scalars['Bytes']>;
  previousOwner_not_contains?: InputMaybe<Scalars['Bytes']>;
  previousOwner_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum OwnershipTransferred_OrderBy {
  Id = 'id',
  NewOwner = 'newOwner',
  PreviousOwner = 'previousOwner',
}

export type Perpetual = {
  __typename?: 'Perpetual';
  ammFund?: Maybe<Fund>;
  createdAtTx: Transaction;
  /**
   * avarage long positions sizes for the amm over time
   *
   */
  currentAMMExposureEMALong: Scalars['BigInt'];
  /**
   * avarage short positions sizes for the amm over time
   *
   */
  currentAMMExposureEMAShort: Scalars['BigInt'];
  /**
   * avarage positions sizes over time
   *
   */
  currentTraderExposureEMA: Scalars['BigInt'];
  distributeFees?: Maybe<Array<DistributeFee>>;
  eCollateralCurrency: Scalars['Int'];
  fAMMFundCashCC?: Maybe<Scalars['BigInt']>;
  fAMMMinSizeCC: Scalars['BigInt'];
  fAMMTargetDDBaseline: Scalars['BigInt'];
  fAMMTargetDDStress: Scalars['BigInt'];
  fDFCoverNRate: Scalars['BigInt'];
  /**
   * Risk parameters for default fund / AMM pool
   *
   */
  fFundingRate?: Maybe<Scalars['BigInt']>;
  /**
   * Base parameters
   *
   */
  fFundingRateClamp: Scalars['BigInt'];
  fInitialMarginRateAlpha: Scalars['BigInt'];
  fInitialMarginRateCap: Scalars['BigInt'];
  fLiquidationPenaltyRate: Scalars['BigInt'];
  fLotSizeBC: Scalars['BigInt'];
  fMaintenanceMarginRateAlpha: Scalars['BigInt'];
  fMarginRateBeta: Scalars['BigInt'];
  fMarkPriceEMALambda: Scalars['BigInt'];
  fMaximalTradeSizeBumpUp: Scalars['BigInt'];
  fMinimalAMMExposureEMA: Scalars['BigInt'];
  fMinimalSpread: Scalars['BigInt'];
  fMinimalSpreadInStress: Scalars['BigInt'];
  fMinimalTraderExposureEMA: Scalars['BigInt'];
  fPnLPartRate: Scalars['BigInt'];
  fReferralRebateCC: Scalars['BigInt'];
  fRho23: Scalars['BigInt'];
  fSigma2: Scalars['BigInt'];
  fSigma3: Scalars['BigInt'];
  fSpotIndexPrice?: Maybe<Scalars['BigInt']>;
  /**
   * Risk parameters for underlying instruments
   *
   */
  fStressReturnS2Negative: Scalars['BigInt'];
  fStressReturnS2Positive: Scalars['BigInt'];
  fStressReturnS3Negative: Scalars['BigInt'];
  fStressReturnS3Positive: Scalars['BigInt'];
  fTreasuryFeeRate: Scalars['BigInt'];
  id: Scalars['ID'];
  lastTradedPrice: Scalars['BigInt'];
  liquidates?: Maybe<Array<Liquidate>>;
  markIndexPricePremium: Scalars['BigInt'];
  openInterestBC: Scalars['BigInt'];
  oracleS2: SpotOracle;
  oracleS3?: Maybe<SpotOracle>;
  pool: LiquidityPool;
  positions?: Maybe<Array<Position>>;
  positionsTotalCount: Scalars['Int'];
  state: PerpetualState;
  totalAmountDeposited: Scalars['BigInt'];
  totalAmountLiquidatedBC: Scalars['BigInt'];
  totalAmountSettled: Scalars['BigInt'];
  totalTradingPnLCC: Scalars['BigInt'];
  traderStates?: Maybe<Array<TraderState>>;
  trades?: Maybe<Array<Trade>>;
  tradesTotalCount: Scalars['Int'];
  /**
   * accumulated funding rate per unit of index since the begining of time
   *
   */
  unitAccumulativeFunding: Scalars['BigInt'];
  updatedAtTx: Transaction;
};

export type PerpetualDistributeFeesArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<DistributeFee_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<DistributeFee_Filter>;
};

export type PerpetualLiquidatesArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Liquidate_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Liquidate_Filter>;
};

export type PerpetualPositionsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Position_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Position_Filter>;
};

export type PerpetualTraderStatesArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TraderState_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<TraderState_Filter>;
};

export type PerpetualTradesArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Trade_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Trade_Filter>;
};

export type PerpetualCreated = {
  __typename?: 'PerpetualCreated';
  eCollateralCurrency: Scalars['BigInt'];
  id: Scalars['ID'];
  perpetualId: Scalars['Bytes'];
  poolId: Scalars['Int'];
};

export type PerpetualCreated_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  eCollateralCurrency?: InputMaybe<Scalars['BigInt']>;
  eCollateralCurrency_gt?: InputMaybe<Scalars['BigInt']>;
  eCollateralCurrency_gte?: InputMaybe<Scalars['BigInt']>;
  eCollateralCurrency_in?: InputMaybe<Array<Scalars['BigInt']>>;
  eCollateralCurrency_lt?: InputMaybe<Scalars['BigInt']>;
  eCollateralCurrency_lte?: InputMaybe<Scalars['BigInt']>;
  eCollateralCurrency_not?: InputMaybe<Scalars['BigInt']>;
  eCollateralCurrency_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  perpetualId?: InputMaybe<Scalars['Bytes']>;
  perpetualId_contains?: InputMaybe<Scalars['Bytes']>;
  perpetualId_in?: InputMaybe<Array<Scalars['Bytes']>>;
  perpetualId_not?: InputMaybe<Scalars['Bytes']>;
  perpetualId_not_contains?: InputMaybe<Scalars['Bytes']>;
  perpetualId_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  poolId?: InputMaybe<Scalars['Int']>;
  poolId_gt?: InputMaybe<Scalars['Int']>;
  poolId_gte?: InputMaybe<Scalars['Int']>;
  poolId_in?: InputMaybe<Array<Scalars['Int']>>;
  poolId_lt?: InputMaybe<Scalars['Int']>;
  poolId_lte?: InputMaybe<Scalars['Int']>;
  poolId_not?: InputMaybe<Scalars['Int']>;
  poolId_not_in?: InputMaybe<Array<Scalars['Int']>>;
};

export enum PerpetualCreated_OrderBy {
  ECollateralCurrency = 'eCollateralCurrency',
  Id = 'id',
  PerpetualId = 'perpetualId',
  PoolId = 'poolId',
}

export type PerpetualLimitOrderBookDeployed = {
  __typename?: 'PerpetualLimitOrderBookDeployed';
  id: Scalars['ID'];
  limitOrderBookAddress: Scalars['Bytes'];
  perpManagerAddress: Scalars['Bytes'];
  perpetualId: Scalars['Bytes'];
};

export type PerpetualLimitOrderBookDeployed_Filter = {
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
  limitOrderBookAddress?: InputMaybe<Scalars['Bytes']>;
  limitOrderBookAddress_contains?: InputMaybe<Scalars['Bytes']>;
  limitOrderBookAddress_in?: InputMaybe<Array<Scalars['Bytes']>>;
  limitOrderBookAddress_not?: InputMaybe<Scalars['Bytes']>;
  limitOrderBookAddress_not_contains?: InputMaybe<Scalars['Bytes']>;
  limitOrderBookAddress_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  perpManagerAddress?: InputMaybe<Scalars['Bytes']>;
  perpManagerAddress_contains?: InputMaybe<Scalars['Bytes']>;
  perpManagerAddress_in?: InputMaybe<Array<Scalars['Bytes']>>;
  perpManagerAddress_not?: InputMaybe<Scalars['Bytes']>;
  perpManagerAddress_not_contains?: InputMaybe<Scalars['Bytes']>;
  perpManagerAddress_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  perpetualId?: InputMaybe<Scalars['Bytes']>;
  perpetualId_contains?: InputMaybe<Scalars['Bytes']>;
  perpetualId_in?: InputMaybe<Array<Scalars['Bytes']>>;
  perpetualId_not?: InputMaybe<Scalars['Bytes']>;
  perpetualId_not_contains?: InputMaybe<Scalars['Bytes']>;
  perpetualId_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum PerpetualLimitOrderBookDeployed_OrderBy {
  Id = 'id',
  LimitOrderBookAddress = 'limitOrderBookAddress',
  PerpManagerAddress = 'perpManagerAddress',
  PerpetualId = 'perpetualId',
}

export type PerpetualLimitOrderCancelled = {
  __typename?: 'PerpetualLimitOrderCancelled';
  id: Scalars['ID'];
  orderHash: Scalars['Bytes'];
};

export type PerpetualLimitOrderCancelled_Filter = {
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
  orderHash?: InputMaybe<Scalars['Bytes']>;
  orderHash_contains?: InputMaybe<Scalars['Bytes']>;
  orderHash_in?: InputMaybe<Array<Scalars['Bytes']>>;
  orderHash_not?: InputMaybe<Scalars['Bytes']>;
  orderHash_not_contains?: InputMaybe<Scalars['Bytes']>;
  orderHash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum PerpetualLimitOrderCancelled_OrderBy {
  Id = 'id',
  OrderHash = 'orderHash',
}

export type PerpetualLimitOrderCreated = {
  __typename?: 'PerpetualLimitOrderCreated';
  createdTimestamp: Scalars['BigInt'];
  deadline: Scalars['BigInt'];
  digest: Scalars['Bytes'];
  flags: Scalars['BigInt'];
  id: Scalars['ID'];
  leverage: Scalars['BigInt'];
  limitPrice: Scalars['BigInt'];
  perpetualId: Scalars['Bytes'];
  referrerAddr: Scalars['Bytes'];
  tradeAmount: Scalars['BigInt'];
  trader: Scalars['Bytes'];
  triggerPrice: Scalars['BigInt'];
};

export type PerpetualLimitOrderCreated_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  createdTimestamp?: InputMaybe<Scalars['BigInt']>;
  createdTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  createdTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  createdTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  createdTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  createdTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  createdTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  createdTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  deadline?: InputMaybe<Scalars['BigInt']>;
  deadline_gt?: InputMaybe<Scalars['BigInt']>;
  deadline_gte?: InputMaybe<Scalars['BigInt']>;
  deadline_in?: InputMaybe<Array<Scalars['BigInt']>>;
  deadline_lt?: InputMaybe<Scalars['BigInt']>;
  deadline_lte?: InputMaybe<Scalars['BigInt']>;
  deadline_not?: InputMaybe<Scalars['BigInt']>;
  deadline_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  digest?: InputMaybe<Scalars['Bytes']>;
  digest_contains?: InputMaybe<Scalars['Bytes']>;
  digest_in?: InputMaybe<Array<Scalars['Bytes']>>;
  digest_not?: InputMaybe<Scalars['Bytes']>;
  digest_not_contains?: InputMaybe<Scalars['Bytes']>;
  digest_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  flags?: InputMaybe<Scalars['BigInt']>;
  flags_gt?: InputMaybe<Scalars['BigInt']>;
  flags_gte?: InputMaybe<Scalars['BigInt']>;
  flags_in?: InputMaybe<Array<Scalars['BigInt']>>;
  flags_lt?: InputMaybe<Scalars['BigInt']>;
  flags_lte?: InputMaybe<Scalars['BigInt']>;
  flags_not?: InputMaybe<Scalars['BigInt']>;
  flags_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  leverage?: InputMaybe<Scalars['BigInt']>;
  leverage_gt?: InputMaybe<Scalars['BigInt']>;
  leverage_gte?: InputMaybe<Scalars['BigInt']>;
  leverage_in?: InputMaybe<Array<Scalars['BigInt']>>;
  leverage_lt?: InputMaybe<Scalars['BigInt']>;
  leverage_lte?: InputMaybe<Scalars['BigInt']>;
  leverage_not?: InputMaybe<Scalars['BigInt']>;
  leverage_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  limitPrice?: InputMaybe<Scalars['BigInt']>;
  limitPrice_gt?: InputMaybe<Scalars['BigInt']>;
  limitPrice_gte?: InputMaybe<Scalars['BigInt']>;
  limitPrice_in?: InputMaybe<Array<Scalars['BigInt']>>;
  limitPrice_lt?: InputMaybe<Scalars['BigInt']>;
  limitPrice_lte?: InputMaybe<Scalars['BigInt']>;
  limitPrice_not?: InputMaybe<Scalars['BigInt']>;
  limitPrice_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  perpetualId?: InputMaybe<Scalars['Bytes']>;
  perpetualId_contains?: InputMaybe<Scalars['Bytes']>;
  perpetualId_in?: InputMaybe<Array<Scalars['Bytes']>>;
  perpetualId_not?: InputMaybe<Scalars['Bytes']>;
  perpetualId_not_contains?: InputMaybe<Scalars['Bytes']>;
  perpetualId_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  referrerAddr?: InputMaybe<Scalars['Bytes']>;
  referrerAddr_contains?: InputMaybe<Scalars['Bytes']>;
  referrerAddr_in?: InputMaybe<Array<Scalars['Bytes']>>;
  referrerAddr_not?: InputMaybe<Scalars['Bytes']>;
  referrerAddr_not_contains?: InputMaybe<Scalars['Bytes']>;
  referrerAddr_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  tradeAmount?: InputMaybe<Scalars['BigInt']>;
  tradeAmount_gt?: InputMaybe<Scalars['BigInt']>;
  tradeAmount_gte?: InputMaybe<Scalars['BigInt']>;
  tradeAmount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  tradeAmount_lt?: InputMaybe<Scalars['BigInt']>;
  tradeAmount_lte?: InputMaybe<Scalars['BigInt']>;
  tradeAmount_not?: InputMaybe<Scalars['BigInt']>;
  tradeAmount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  trader?: InputMaybe<Scalars['Bytes']>;
  trader_contains?: InputMaybe<Scalars['Bytes']>;
  trader_in?: InputMaybe<Array<Scalars['Bytes']>>;
  trader_not?: InputMaybe<Scalars['Bytes']>;
  trader_not_contains?: InputMaybe<Scalars['Bytes']>;
  trader_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  triggerPrice?: InputMaybe<Scalars['BigInt']>;
  triggerPrice_gt?: InputMaybe<Scalars['BigInt']>;
  triggerPrice_gte?: InputMaybe<Scalars['BigInt']>;
  triggerPrice_in?: InputMaybe<Array<Scalars['BigInt']>>;
  triggerPrice_lt?: InputMaybe<Scalars['BigInt']>;
  triggerPrice_lte?: InputMaybe<Scalars['BigInt']>;
  triggerPrice_not?: InputMaybe<Scalars['BigInt']>;
  triggerPrice_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export enum PerpetualLimitOrderCreated_OrderBy {
  CreatedTimestamp = 'createdTimestamp',
  Deadline = 'deadline',
  Digest = 'digest',
  Flags = 'flags',
  Id = 'id',
  Leverage = 'leverage',
  LimitPrice = 'limitPrice',
  PerpetualId = 'perpetualId',
  ReferrerAddr = 'referrerAddr',
  TradeAmount = 'tradeAmount',
  Trader = 'trader',
  TriggerPrice = 'triggerPrice',
}

export enum PerpetualState {
  Cleared = 'Cleared',
  Clearing = 'Clearing',
  Emergency = 'Emergency',
  Normal = 'Normal',
}

export type Perpetual_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  ammFund?: InputMaybe<Scalars['String']>;
  ammFund_?: InputMaybe<Fund_Filter>;
  ammFund_contains?: InputMaybe<Scalars['String']>;
  ammFund_contains_nocase?: InputMaybe<Scalars['String']>;
  ammFund_ends_with?: InputMaybe<Scalars['String']>;
  ammFund_ends_with_nocase?: InputMaybe<Scalars['String']>;
  ammFund_gt?: InputMaybe<Scalars['String']>;
  ammFund_gte?: InputMaybe<Scalars['String']>;
  ammFund_in?: InputMaybe<Array<Scalars['String']>>;
  ammFund_lt?: InputMaybe<Scalars['String']>;
  ammFund_lte?: InputMaybe<Scalars['String']>;
  ammFund_not?: InputMaybe<Scalars['String']>;
  ammFund_not_contains?: InputMaybe<Scalars['String']>;
  ammFund_not_contains_nocase?: InputMaybe<Scalars['String']>;
  ammFund_not_ends_with?: InputMaybe<Scalars['String']>;
  ammFund_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  ammFund_not_in?: InputMaybe<Array<Scalars['String']>>;
  ammFund_not_starts_with?: InputMaybe<Scalars['String']>;
  ammFund_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  ammFund_starts_with?: InputMaybe<Scalars['String']>;
  ammFund_starts_with_nocase?: InputMaybe<Scalars['String']>;
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
  currentAMMExposureEMALong?: InputMaybe<Scalars['BigInt']>;
  currentAMMExposureEMALong_gt?: InputMaybe<Scalars['BigInt']>;
  currentAMMExposureEMALong_gte?: InputMaybe<Scalars['BigInt']>;
  currentAMMExposureEMALong_in?: InputMaybe<Array<Scalars['BigInt']>>;
  currentAMMExposureEMALong_lt?: InputMaybe<Scalars['BigInt']>;
  currentAMMExposureEMALong_lte?: InputMaybe<Scalars['BigInt']>;
  currentAMMExposureEMALong_not?: InputMaybe<Scalars['BigInt']>;
  currentAMMExposureEMALong_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  currentAMMExposureEMAShort?: InputMaybe<Scalars['BigInt']>;
  currentAMMExposureEMAShort_gt?: InputMaybe<Scalars['BigInt']>;
  currentAMMExposureEMAShort_gte?: InputMaybe<Scalars['BigInt']>;
  currentAMMExposureEMAShort_in?: InputMaybe<Array<Scalars['BigInt']>>;
  currentAMMExposureEMAShort_lt?: InputMaybe<Scalars['BigInt']>;
  currentAMMExposureEMAShort_lte?: InputMaybe<Scalars['BigInt']>;
  currentAMMExposureEMAShort_not?: InputMaybe<Scalars['BigInt']>;
  currentAMMExposureEMAShort_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  currentTraderExposureEMA?: InputMaybe<Scalars['BigInt']>;
  currentTraderExposureEMA_gt?: InputMaybe<Scalars['BigInt']>;
  currentTraderExposureEMA_gte?: InputMaybe<Scalars['BigInt']>;
  currentTraderExposureEMA_in?: InputMaybe<Array<Scalars['BigInt']>>;
  currentTraderExposureEMA_lt?: InputMaybe<Scalars['BigInt']>;
  currentTraderExposureEMA_lte?: InputMaybe<Scalars['BigInt']>;
  currentTraderExposureEMA_not?: InputMaybe<Scalars['BigInt']>;
  currentTraderExposureEMA_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  distributeFees_?: InputMaybe<DistributeFee_Filter>;
  eCollateralCurrency?: InputMaybe<Scalars['Int']>;
  eCollateralCurrency_gt?: InputMaybe<Scalars['Int']>;
  eCollateralCurrency_gte?: InputMaybe<Scalars['Int']>;
  eCollateralCurrency_in?: InputMaybe<Array<Scalars['Int']>>;
  eCollateralCurrency_lt?: InputMaybe<Scalars['Int']>;
  eCollateralCurrency_lte?: InputMaybe<Scalars['Int']>;
  eCollateralCurrency_not?: InputMaybe<Scalars['Int']>;
  eCollateralCurrency_not_in?: InputMaybe<Array<Scalars['Int']>>;
  fAMMFundCashCC?: InputMaybe<Scalars['BigInt']>;
  fAMMFundCashCC_gt?: InputMaybe<Scalars['BigInt']>;
  fAMMFundCashCC_gte?: InputMaybe<Scalars['BigInt']>;
  fAMMFundCashCC_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fAMMFundCashCC_lt?: InputMaybe<Scalars['BigInt']>;
  fAMMFundCashCC_lte?: InputMaybe<Scalars['BigInt']>;
  fAMMFundCashCC_not?: InputMaybe<Scalars['BigInt']>;
  fAMMFundCashCC_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fAMMMinSizeCC?: InputMaybe<Scalars['BigInt']>;
  fAMMMinSizeCC_gt?: InputMaybe<Scalars['BigInt']>;
  fAMMMinSizeCC_gte?: InputMaybe<Scalars['BigInt']>;
  fAMMMinSizeCC_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fAMMMinSizeCC_lt?: InputMaybe<Scalars['BigInt']>;
  fAMMMinSizeCC_lte?: InputMaybe<Scalars['BigInt']>;
  fAMMMinSizeCC_not?: InputMaybe<Scalars['BigInt']>;
  fAMMMinSizeCC_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fAMMTargetDDBaseline?: InputMaybe<Scalars['BigInt']>;
  fAMMTargetDDBaseline_gt?: InputMaybe<Scalars['BigInt']>;
  fAMMTargetDDBaseline_gte?: InputMaybe<Scalars['BigInt']>;
  fAMMTargetDDBaseline_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fAMMTargetDDBaseline_lt?: InputMaybe<Scalars['BigInt']>;
  fAMMTargetDDBaseline_lte?: InputMaybe<Scalars['BigInt']>;
  fAMMTargetDDBaseline_not?: InputMaybe<Scalars['BigInt']>;
  fAMMTargetDDBaseline_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fAMMTargetDDStress?: InputMaybe<Scalars['BigInt']>;
  fAMMTargetDDStress_gt?: InputMaybe<Scalars['BigInt']>;
  fAMMTargetDDStress_gte?: InputMaybe<Scalars['BigInt']>;
  fAMMTargetDDStress_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fAMMTargetDDStress_lt?: InputMaybe<Scalars['BigInt']>;
  fAMMTargetDDStress_lte?: InputMaybe<Scalars['BigInt']>;
  fAMMTargetDDStress_not?: InputMaybe<Scalars['BigInt']>;
  fAMMTargetDDStress_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fDFCoverNRate?: InputMaybe<Scalars['BigInt']>;
  fDFCoverNRate_gt?: InputMaybe<Scalars['BigInt']>;
  fDFCoverNRate_gte?: InputMaybe<Scalars['BigInt']>;
  fDFCoverNRate_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fDFCoverNRate_lt?: InputMaybe<Scalars['BigInt']>;
  fDFCoverNRate_lte?: InputMaybe<Scalars['BigInt']>;
  fDFCoverNRate_not?: InputMaybe<Scalars['BigInt']>;
  fDFCoverNRate_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fFundingRate?: InputMaybe<Scalars['BigInt']>;
  fFundingRateClamp?: InputMaybe<Scalars['BigInt']>;
  fFundingRateClamp_gt?: InputMaybe<Scalars['BigInt']>;
  fFundingRateClamp_gte?: InputMaybe<Scalars['BigInt']>;
  fFundingRateClamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fFundingRateClamp_lt?: InputMaybe<Scalars['BigInt']>;
  fFundingRateClamp_lte?: InputMaybe<Scalars['BigInt']>;
  fFundingRateClamp_not?: InputMaybe<Scalars['BigInt']>;
  fFundingRateClamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fFundingRate_gt?: InputMaybe<Scalars['BigInt']>;
  fFundingRate_gte?: InputMaybe<Scalars['BigInt']>;
  fFundingRate_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fFundingRate_lt?: InputMaybe<Scalars['BigInt']>;
  fFundingRate_lte?: InputMaybe<Scalars['BigInt']>;
  fFundingRate_not?: InputMaybe<Scalars['BigInt']>;
  fFundingRate_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fInitialMarginRateAlpha?: InputMaybe<Scalars['BigInt']>;
  fInitialMarginRateAlpha_gt?: InputMaybe<Scalars['BigInt']>;
  fInitialMarginRateAlpha_gte?: InputMaybe<Scalars['BigInt']>;
  fInitialMarginRateAlpha_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fInitialMarginRateAlpha_lt?: InputMaybe<Scalars['BigInt']>;
  fInitialMarginRateAlpha_lte?: InputMaybe<Scalars['BigInt']>;
  fInitialMarginRateAlpha_not?: InputMaybe<Scalars['BigInt']>;
  fInitialMarginRateAlpha_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fInitialMarginRateCap?: InputMaybe<Scalars['BigInt']>;
  fInitialMarginRateCap_gt?: InputMaybe<Scalars['BigInt']>;
  fInitialMarginRateCap_gte?: InputMaybe<Scalars['BigInt']>;
  fInitialMarginRateCap_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fInitialMarginRateCap_lt?: InputMaybe<Scalars['BigInt']>;
  fInitialMarginRateCap_lte?: InputMaybe<Scalars['BigInt']>;
  fInitialMarginRateCap_not?: InputMaybe<Scalars['BigInt']>;
  fInitialMarginRateCap_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fLiquidationPenaltyRate?: InputMaybe<Scalars['BigInt']>;
  fLiquidationPenaltyRate_gt?: InputMaybe<Scalars['BigInt']>;
  fLiquidationPenaltyRate_gte?: InputMaybe<Scalars['BigInt']>;
  fLiquidationPenaltyRate_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fLiquidationPenaltyRate_lt?: InputMaybe<Scalars['BigInt']>;
  fLiquidationPenaltyRate_lte?: InputMaybe<Scalars['BigInt']>;
  fLiquidationPenaltyRate_not?: InputMaybe<Scalars['BigInt']>;
  fLiquidationPenaltyRate_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fLotSizeBC?: InputMaybe<Scalars['BigInt']>;
  fLotSizeBC_gt?: InputMaybe<Scalars['BigInt']>;
  fLotSizeBC_gte?: InputMaybe<Scalars['BigInt']>;
  fLotSizeBC_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fLotSizeBC_lt?: InputMaybe<Scalars['BigInt']>;
  fLotSizeBC_lte?: InputMaybe<Scalars['BigInt']>;
  fLotSizeBC_not?: InputMaybe<Scalars['BigInt']>;
  fLotSizeBC_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fMaintenanceMarginRateAlpha?: InputMaybe<Scalars['BigInt']>;
  fMaintenanceMarginRateAlpha_gt?: InputMaybe<Scalars['BigInt']>;
  fMaintenanceMarginRateAlpha_gte?: InputMaybe<Scalars['BigInt']>;
  fMaintenanceMarginRateAlpha_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fMaintenanceMarginRateAlpha_lt?: InputMaybe<Scalars['BigInt']>;
  fMaintenanceMarginRateAlpha_lte?: InputMaybe<Scalars['BigInt']>;
  fMaintenanceMarginRateAlpha_not?: InputMaybe<Scalars['BigInt']>;
  fMaintenanceMarginRateAlpha_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fMarginRateBeta?: InputMaybe<Scalars['BigInt']>;
  fMarginRateBeta_gt?: InputMaybe<Scalars['BigInt']>;
  fMarginRateBeta_gte?: InputMaybe<Scalars['BigInt']>;
  fMarginRateBeta_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fMarginRateBeta_lt?: InputMaybe<Scalars['BigInt']>;
  fMarginRateBeta_lte?: InputMaybe<Scalars['BigInt']>;
  fMarginRateBeta_not?: InputMaybe<Scalars['BigInt']>;
  fMarginRateBeta_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fMarkPriceEMALambda?: InputMaybe<Scalars['BigInt']>;
  fMarkPriceEMALambda_gt?: InputMaybe<Scalars['BigInt']>;
  fMarkPriceEMALambda_gte?: InputMaybe<Scalars['BigInt']>;
  fMarkPriceEMALambda_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fMarkPriceEMALambda_lt?: InputMaybe<Scalars['BigInt']>;
  fMarkPriceEMALambda_lte?: InputMaybe<Scalars['BigInt']>;
  fMarkPriceEMALambda_not?: InputMaybe<Scalars['BigInt']>;
  fMarkPriceEMALambda_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fMaximalTradeSizeBumpUp?: InputMaybe<Scalars['BigInt']>;
  fMaximalTradeSizeBumpUp_gt?: InputMaybe<Scalars['BigInt']>;
  fMaximalTradeSizeBumpUp_gte?: InputMaybe<Scalars['BigInt']>;
  fMaximalTradeSizeBumpUp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fMaximalTradeSizeBumpUp_lt?: InputMaybe<Scalars['BigInt']>;
  fMaximalTradeSizeBumpUp_lte?: InputMaybe<Scalars['BigInt']>;
  fMaximalTradeSizeBumpUp_not?: InputMaybe<Scalars['BigInt']>;
  fMaximalTradeSizeBumpUp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fMinimalAMMExposureEMA?: InputMaybe<Scalars['BigInt']>;
  fMinimalAMMExposureEMA_gt?: InputMaybe<Scalars['BigInt']>;
  fMinimalAMMExposureEMA_gte?: InputMaybe<Scalars['BigInt']>;
  fMinimalAMMExposureEMA_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fMinimalAMMExposureEMA_lt?: InputMaybe<Scalars['BigInt']>;
  fMinimalAMMExposureEMA_lte?: InputMaybe<Scalars['BigInt']>;
  fMinimalAMMExposureEMA_not?: InputMaybe<Scalars['BigInt']>;
  fMinimalAMMExposureEMA_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fMinimalSpread?: InputMaybe<Scalars['BigInt']>;
  fMinimalSpreadInStress?: InputMaybe<Scalars['BigInt']>;
  fMinimalSpreadInStress_gt?: InputMaybe<Scalars['BigInt']>;
  fMinimalSpreadInStress_gte?: InputMaybe<Scalars['BigInt']>;
  fMinimalSpreadInStress_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fMinimalSpreadInStress_lt?: InputMaybe<Scalars['BigInt']>;
  fMinimalSpreadInStress_lte?: InputMaybe<Scalars['BigInt']>;
  fMinimalSpreadInStress_not?: InputMaybe<Scalars['BigInt']>;
  fMinimalSpreadInStress_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fMinimalSpread_gt?: InputMaybe<Scalars['BigInt']>;
  fMinimalSpread_gte?: InputMaybe<Scalars['BigInt']>;
  fMinimalSpread_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fMinimalSpread_lt?: InputMaybe<Scalars['BigInt']>;
  fMinimalSpread_lte?: InputMaybe<Scalars['BigInt']>;
  fMinimalSpread_not?: InputMaybe<Scalars['BigInt']>;
  fMinimalSpread_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fMinimalTraderExposureEMA?: InputMaybe<Scalars['BigInt']>;
  fMinimalTraderExposureEMA_gt?: InputMaybe<Scalars['BigInt']>;
  fMinimalTraderExposureEMA_gte?: InputMaybe<Scalars['BigInt']>;
  fMinimalTraderExposureEMA_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fMinimalTraderExposureEMA_lt?: InputMaybe<Scalars['BigInt']>;
  fMinimalTraderExposureEMA_lte?: InputMaybe<Scalars['BigInt']>;
  fMinimalTraderExposureEMA_not?: InputMaybe<Scalars['BigInt']>;
  fMinimalTraderExposureEMA_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fPnLPartRate?: InputMaybe<Scalars['BigInt']>;
  fPnLPartRate_gt?: InputMaybe<Scalars['BigInt']>;
  fPnLPartRate_gte?: InputMaybe<Scalars['BigInt']>;
  fPnLPartRate_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fPnLPartRate_lt?: InputMaybe<Scalars['BigInt']>;
  fPnLPartRate_lte?: InputMaybe<Scalars['BigInt']>;
  fPnLPartRate_not?: InputMaybe<Scalars['BigInt']>;
  fPnLPartRate_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fReferralRebateCC?: InputMaybe<Scalars['BigInt']>;
  fReferralRebateCC_gt?: InputMaybe<Scalars['BigInt']>;
  fReferralRebateCC_gte?: InputMaybe<Scalars['BigInt']>;
  fReferralRebateCC_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fReferralRebateCC_lt?: InputMaybe<Scalars['BigInt']>;
  fReferralRebateCC_lte?: InputMaybe<Scalars['BigInt']>;
  fReferralRebateCC_not?: InputMaybe<Scalars['BigInt']>;
  fReferralRebateCC_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fRho23?: InputMaybe<Scalars['BigInt']>;
  fRho23_gt?: InputMaybe<Scalars['BigInt']>;
  fRho23_gte?: InputMaybe<Scalars['BigInt']>;
  fRho23_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fRho23_lt?: InputMaybe<Scalars['BigInt']>;
  fRho23_lte?: InputMaybe<Scalars['BigInt']>;
  fRho23_not?: InputMaybe<Scalars['BigInt']>;
  fRho23_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fSigma2?: InputMaybe<Scalars['BigInt']>;
  fSigma2_gt?: InputMaybe<Scalars['BigInt']>;
  fSigma2_gte?: InputMaybe<Scalars['BigInt']>;
  fSigma2_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fSigma2_lt?: InputMaybe<Scalars['BigInt']>;
  fSigma2_lte?: InputMaybe<Scalars['BigInt']>;
  fSigma2_not?: InputMaybe<Scalars['BigInt']>;
  fSigma2_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fSigma3?: InputMaybe<Scalars['BigInt']>;
  fSigma3_gt?: InputMaybe<Scalars['BigInt']>;
  fSigma3_gte?: InputMaybe<Scalars['BigInt']>;
  fSigma3_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fSigma3_lt?: InputMaybe<Scalars['BigInt']>;
  fSigma3_lte?: InputMaybe<Scalars['BigInt']>;
  fSigma3_not?: InputMaybe<Scalars['BigInt']>;
  fSigma3_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fSpotIndexPrice?: InputMaybe<Scalars['BigInt']>;
  fSpotIndexPrice_gt?: InputMaybe<Scalars['BigInt']>;
  fSpotIndexPrice_gte?: InputMaybe<Scalars['BigInt']>;
  fSpotIndexPrice_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fSpotIndexPrice_lt?: InputMaybe<Scalars['BigInt']>;
  fSpotIndexPrice_lte?: InputMaybe<Scalars['BigInt']>;
  fSpotIndexPrice_not?: InputMaybe<Scalars['BigInt']>;
  fSpotIndexPrice_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fStressReturnS2Negative?: InputMaybe<Scalars['BigInt']>;
  fStressReturnS2Negative_gt?: InputMaybe<Scalars['BigInt']>;
  fStressReturnS2Negative_gte?: InputMaybe<Scalars['BigInt']>;
  fStressReturnS2Negative_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fStressReturnS2Negative_lt?: InputMaybe<Scalars['BigInt']>;
  fStressReturnS2Negative_lte?: InputMaybe<Scalars['BigInt']>;
  fStressReturnS2Negative_not?: InputMaybe<Scalars['BigInt']>;
  fStressReturnS2Negative_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fStressReturnS2Positive?: InputMaybe<Scalars['BigInt']>;
  fStressReturnS2Positive_gt?: InputMaybe<Scalars['BigInt']>;
  fStressReturnS2Positive_gte?: InputMaybe<Scalars['BigInt']>;
  fStressReturnS2Positive_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fStressReturnS2Positive_lt?: InputMaybe<Scalars['BigInt']>;
  fStressReturnS2Positive_lte?: InputMaybe<Scalars['BigInt']>;
  fStressReturnS2Positive_not?: InputMaybe<Scalars['BigInt']>;
  fStressReturnS2Positive_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fStressReturnS3Negative?: InputMaybe<Scalars['BigInt']>;
  fStressReturnS3Negative_gt?: InputMaybe<Scalars['BigInt']>;
  fStressReturnS3Negative_gte?: InputMaybe<Scalars['BigInt']>;
  fStressReturnS3Negative_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fStressReturnS3Negative_lt?: InputMaybe<Scalars['BigInt']>;
  fStressReturnS3Negative_lte?: InputMaybe<Scalars['BigInt']>;
  fStressReturnS3Negative_not?: InputMaybe<Scalars['BigInt']>;
  fStressReturnS3Negative_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fStressReturnS3Positive?: InputMaybe<Scalars['BigInt']>;
  fStressReturnS3Positive_gt?: InputMaybe<Scalars['BigInt']>;
  fStressReturnS3Positive_gte?: InputMaybe<Scalars['BigInt']>;
  fStressReturnS3Positive_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fStressReturnS3Positive_lt?: InputMaybe<Scalars['BigInt']>;
  fStressReturnS3Positive_lte?: InputMaybe<Scalars['BigInt']>;
  fStressReturnS3Positive_not?: InputMaybe<Scalars['BigInt']>;
  fStressReturnS3Positive_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fTreasuryFeeRate?: InputMaybe<Scalars['BigInt']>;
  fTreasuryFeeRate_gt?: InputMaybe<Scalars['BigInt']>;
  fTreasuryFeeRate_gte?: InputMaybe<Scalars['BigInt']>;
  fTreasuryFeeRate_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fTreasuryFeeRate_lt?: InputMaybe<Scalars['BigInt']>;
  fTreasuryFeeRate_lte?: InputMaybe<Scalars['BigInt']>;
  fTreasuryFeeRate_not?: InputMaybe<Scalars['BigInt']>;
  fTreasuryFeeRate_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  lastTradedPrice?: InputMaybe<Scalars['BigInt']>;
  lastTradedPrice_gt?: InputMaybe<Scalars['BigInt']>;
  lastTradedPrice_gte?: InputMaybe<Scalars['BigInt']>;
  lastTradedPrice_in?: InputMaybe<Array<Scalars['BigInt']>>;
  lastTradedPrice_lt?: InputMaybe<Scalars['BigInt']>;
  lastTradedPrice_lte?: InputMaybe<Scalars['BigInt']>;
  lastTradedPrice_not?: InputMaybe<Scalars['BigInt']>;
  lastTradedPrice_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  liquidates_?: InputMaybe<Liquidate_Filter>;
  markIndexPricePremium?: InputMaybe<Scalars['BigInt']>;
  markIndexPricePremium_gt?: InputMaybe<Scalars['BigInt']>;
  markIndexPricePremium_gte?: InputMaybe<Scalars['BigInt']>;
  markIndexPricePremium_in?: InputMaybe<Array<Scalars['BigInt']>>;
  markIndexPricePremium_lt?: InputMaybe<Scalars['BigInt']>;
  markIndexPricePremium_lte?: InputMaybe<Scalars['BigInt']>;
  markIndexPricePremium_not?: InputMaybe<Scalars['BigInt']>;
  markIndexPricePremium_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  openInterestBC?: InputMaybe<Scalars['BigInt']>;
  openInterestBC_gt?: InputMaybe<Scalars['BigInt']>;
  openInterestBC_gte?: InputMaybe<Scalars['BigInt']>;
  openInterestBC_in?: InputMaybe<Array<Scalars['BigInt']>>;
  openInterestBC_lt?: InputMaybe<Scalars['BigInt']>;
  openInterestBC_lte?: InputMaybe<Scalars['BigInt']>;
  openInterestBC_not?: InputMaybe<Scalars['BigInt']>;
  openInterestBC_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  oracleS2?: InputMaybe<Scalars['String']>;
  oracleS2_?: InputMaybe<SpotOracle_Filter>;
  oracleS2_contains?: InputMaybe<Scalars['String']>;
  oracleS2_contains_nocase?: InputMaybe<Scalars['String']>;
  oracleS2_ends_with?: InputMaybe<Scalars['String']>;
  oracleS2_ends_with_nocase?: InputMaybe<Scalars['String']>;
  oracleS2_gt?: InputMaybe<Scalars['String']>;
  oracleS2_gte?: InputMaybe<Scalars['String']>;
  oracleS2_in?: InputMaybe<Array<Scalars['String']>>;
  oracleS2_lt?: InputMaybe<Scalars['String']>;
  oracleS2_lte?: InputMaybe<Scalars['String']>;
  oracleS2_not?: InputMaybe<Scalars['String']>;
  oracleS2_not_contains?: InputMaybe<Scalars['String']>;
  oracleS2_not_contains_nocase?: InputMaybe<Scalars['String']>;
  oracleS2_not_ends_with?: InputMaybe<Scalars['String']>;
  oracleS2_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  oracleS2_not_in?: InputMaybe<Array<Scalars['String']>>;
  oracleS2_not_starts_with?: InputMaybe<Scalars['String']>;
  oracleS2_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  oracleS2_starts_with?: InputMaybe<Scalars['String']>;
  oracleS2_starts_with_nocase?: InputMaybe<Scalars['String']>;
  oracleS3?: InputMaybe<Scalars['String']>;
  oracleS3_?: InputMaybe<SpotOracle_Filter>;
  oracleS3_contains?: InputMaybe<Scalars['String']>;
  oracleS3_contains_nocase?: InputMaybe<Scalars['String']>;
  oracleS3_ends_with?: InputMaybe<Scalars['String']>;
  oracleS3_ends_with_nocase?: InputMaybe<Scalars['String']>;
  oracleS3_gt?: InputMaybe<Scalars['String']>;
  oracleS3_gte?: InputMaybe<Scalars['String']>;
  oracleS3_in?: InputMaybe<Array<Scalars['String']>>;
  oracleS3_lt?: InputMaybe<Scalars['String']>;
  oracleS3_lte?: InputMaybe<Scalars['String']>;
  oracleS3_not?: InputMaybe<Scalars['String']>;
  oracleS3_not_contains?: InputMaybe<Scalars['String']>;
  oracleS3_not_contains_nocase?: InputMaybe<Scalars['String']>;
  oracleS3_not_ends_with?: InputMaybe<Scalars['String']>;
  oracleS3_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  oracleS3_not_in?: InputMaybe<Array<Scalars['String']>>;
  oracleS3_not_starts_with?: InputMaybe<Scalars['String']>;
  oracleS3_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  oracleS3_starts_with?: InputMaybe<Scalars['String']>;
  oracleS3_starts_with_nocase?: InputMaybe<Scalars['String']>;
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
  positionsTotalCount?: InputMaybe<Scalars['Int']>;
  positionsTotalCount_gt?: InputMaybe<Scalars['Int']>;
  positionsTotalCount_gte?: InputMaybe<Scalars['Int']>;
  positionsTotalCount_in?: InputMaybe<Array<Scalars['Int']>>;
  positionsTotalCount_lt?: InputMaybe<Scalars['Int']>;
  positionsTotalCount_lte?: InputMaybe<Scalars['Int']>;
  positionsTotalCount_not?: InputMaybe<Scalars['Int']>;
  positionsTotalCount_not_in?: InputMaybe<Array<Scalars['Int']>>;
  positions_?: InputMaybe<Position_Filter>;
  state?: InputMaybe<PerpetualState>;
  state_in?: InputMaybe<Array<PerpetualState>>;
  state_not?: InputMaybe<PerpetualState>;
  state_not_in?: InputMaybe<Array<PerpetualState>>;
  totalAmountDeposited?: InputMaybe<Scalars['BigInt']>;
  totalAmountDeposited_gt?: InputMaybe<Scalars['BigInt']>;
  totalAmountDeposited_gte?: InputMaybe<Scalars['BigInt']>;
  totalAmountDeposited_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalAmountDeposited_lt?: InputMaybe<Scalars['BigInt']>;
  totalAmountDeposited_lte?: InputMaybe<Scalars['BigInt']>;
  totalAmountDeposited_not?: InputMaybe<Scalars['BigInt']>;
  totalAmountDeposited_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalAmountLiquidatedBC?: InputMaybe<Scalars['BigInt']>;
  totalAmountLiquidatedBC_gt?: InputMaybe<Scalars['BigInt']>;
  totalAmountLiquidatedBC_gte?: InputMaybe<Scalars['BigInt']>;
  totalAmountLiquidatedBC_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalAmountLiquidatedBC_lt?: InputMaybe<Scalars['BigInt']>;
  totalAmountLiquidatedBC_lte?: InputMaybe<Scalars['BigInt']>;
  totalAmountLiquidatedBC_not?: InputMaybe<Scalars['BigInt']>;
  totalAmountLiquidatedBC_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalAmountSettled?: InputMaybe<Scalars['BigInt']>;
  totalAmountSettled_gt?: InputMaybe<Scalars['BigInt']>;
  totalAmountSettled_gte?: InputMaybe<Scalars['BigInt']>;
  totalAmountSettled_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalAmountSettled_lt?: InputMaybe<Scalars['BigInt']>;
  totalAmountSettled_lte?: InputMaybe<Scalars['BigInt']>;
  totalAmountSettled_not?: InputMaybe<Scalars['BigInt']>;
  totalAmountSettled_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalTradingPnLCC?: InputMaybe<Scalars['BigInt']>;
  totalTradingPnLCC_gt?: InputMaybe<Scalars['BigInt']>;
  totalTradingPnLCC_gte?: InputMaybe<Scalars['BigInt']>;
  totalTradingPnLCC_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalTradingPnLCC_lt?: InputMaybe<Scalars['BigInt']>;
  totalTradingPnLCC_lte?: InputMaybe<Scalars['BigInt']>;
  totalTradingPnLCC_not?: InputMaybe<Scalars['BigInt']>;
  totalTradingPnLCC_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  traderStates_?: InputMaybe<TraderState_Filter>;
  tradesTotalCount?: InputMaybe<Scalars['Int']>;
  tradesTotalCount_gt?: InputMaybe<Scalars['Int']>;
  tradesTotalCount_gte?: InputMaybe<Scalars['Int']>;
  tradesTotalCount_in?: InputMaybe<Array<Scalars['Int']>>;
  tradesTotalCount_lt?: InputMaybe<Scalars['Int']>;
  tradesTotalCount_lte?: InputMaybe<Scalars['Int']>;
  tradesTotalCount_not?: InputMaybe<Scalars['Int']>;
  tradesTotalCount_not_in?: InputMaybe<Array<Scalars['Int']>>;
  trades_?: InputMaybe<Trade_Filter>;
  unitAccumulativeFunding?: InputMaybe<Scalars['BigInt']>;
  unitAccumulativeFunding_gt?: InputMaybe<Scalars['BigInt']>;
  unitAccumulativeFunding_gte?: InputMaybe<Scalars['BigInt']>;
  unitAccumulativeFunding_in?: InputMaybe<Array<Scalars['BigInt']>>;
  unitAccumulativeFunding_lt?: InputMaybe<Scalars['BigInt']>;
  unitAccumulativeFunding_lte?: InputMaybe<Scalars['BigInt']>;
  unitAccumulativeFunding_not?: InputMaybe<Scalars['BigInt']>;
  unitAccumulativeFunding_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
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

export enum Perpetual_OrderBy {
  AmmFund = 'ammFund',
  CreatedAtTx = 'createdAtTx',
  CurrentAmmExposureEmaLong = 'currentAMMExposureEMALong',
  CurrentAmmExposureEmaShort = 'currentAMMExposureEMAShort',
  CurrentTraderExposureEma = 'currentTraderExposureEMA',
  DistributeFees = 'distributeFees',
  ECollateralCurrency = 'eCollateralCurrency',
  FAmmFundCashCc = 'fAMMFundCashCC',
  FAmmMinSizeCc = 'fAMMMinSizeCC',
  FAmmTargetDdBaseline = 'fAMMTargetDDBaseline',
  FAmmTargetDdStress = 'fAMMTargetDDStress',
  FDfCoverNRate = 'fDFCoverNRate',
  FFundingRate = 'fFundingRate',
  FFundingRateClamp = 'fFundingRateClamp',
  FInitialMarginRateAlpha = 'fInitialMarginRateAlpha',
  FInitialMarginRateCap = 'fInitialMarginRateCap',
  FLiquidationPenaltyRate = 'fLiquidationPenaltyRate',
  FLotSizeBc = 'fLotSizeBC',
  FMaintenanceMarginRateAlpha = 'fMaintenanceMarginRateAlpha',
  FMarginRateBeta = 'fMarginRateBeta',
  FMarkPriceEmaLambda = 'fMarkPriceEMALambda',
  FMaximalTradeSizeBumpUp = 'fMaximalTradeSizeBumpUp',
  FMinimalAmmExposureEma = 'fMinimalAMMExposureEMA',
  FMinimalSpread = 'fMinimalSpread',
  FMinimalSpreadInStress = 'fMinimalSpreadInStress',
  FMinimalTraderExposureEma = 'fMinimalTraderExposureEMA',
  FPnLPartRate = 'fPnLPartRate',
  FReferralRebateCc = 'fReferralRebateCC',
  FRho23 = 'fRho23',
  FSigma2 = 'fSigma2',
  FSigma3 = 'fSigma3',
  FSpotIndexPrice = 'fSpotIndexPrice',
  FStressReturnS2Negative = 'fStressReturnS2Negative',
  FStressReturnS2Positive = 'fStressReturnS2Positive',
  FStressReturnS3Negative = 'fStressReturnS3Negative',
  FStressReturnS3Positive = 'fStressReturnS3Positive',
  FTreasuryFeeRate = 'fTreasuryFeeRate',
  Id = 'id',
  LastTradedPrice = 'lastTradedPrice',
  Liquidates = 'liquidates',
  MarkIndexPricePremium = 'markIndexPricePremium',
  OpenInterestBc = 'openInterestBC',
  OracleS2 = 'oracleS2',
  OracleS3 = 'oracleS3',
  Pool = 'pool',
  Positions = 'positions',
  PositionsTotalCount = 'positionsTotalCount',
  State = 'state',
  TotalAmountDeposited = 'totalAmountDeposited',
  TotalAmountLiquidatedBc = 'totalAmountLiquidatedBC',
  TotalAmountSettled = 'totalAmountSettled',
  TotalTradingPnLcc = 'totalTradingPnLCC',
  TraderStates = 'traderStates',
  Trades = 'trades',
  TradesTotalCount = 'tradesTotalCount',
  UnitAccumulativeFunding = 'unitAccumulativeFunding',
  UpdatedAtTx = 'updatedAtTx',
}

export type Position = {
  __typename?: 'Position';
  currentPositionSizeBC: Scalars['BigInt'];
  endDate?: Maybe<Scalars['BigInt']>;
  highestSizeBC: Scalars['BigInt'];
  id: Scalars['ID'];
  isClosed: Scalars['Boolean'];
  lastChanged: Scalars['BigInt'];
  liquidations?: Maybe<Array<Liquidate>>;
  lockedInValueQC: Scalars['BigInt'];
  lowestSizeBC: Scalars['BigInt'];
  perpetual: Perpetual;
  realizedPnLs?: Maybe<Array<RealizedPnL>>;
  startDate: Scalars['BigInt'];
  startPositionSizeBC: Scalars['BigInt'];
  totalAmountLiquidatedBC: Scalars['BigInt'];
  totalPnLCC: Scalars['BigInt'];
  trader: Trader;
  traderState: TraderState;
  trades?: Maybe<Array<Trade>>;
  tradesTotalCount: Scalars['Int'];
};

export type PositionLiquidationsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Liquidate_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Liquidate_Filter>;
};

export type PositionRealizedPnLsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<RealizedPnL_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<RealizedPnL_Filter>;
};

export type PositionTradesArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Trade_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Trade_Filter>;
};

export type Position_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  currentPositionSizeBC?: InputMaybe<Scalars['BigInt']>;
  currentPositionSizeBC_gt?: InputMaybe<Scalars['BigInt']>;
  currentPositionSizeBC_gte?: InputMaybe<Scalars['BigInt']>;
  currentPositionSizeBC_in?: InputMaybe<Array<Scalars['BigInt']>>;
  currentPositionSizeBC_lt?: InputMaybe<Scalars['BigInt']>;
  currentPositionSizeBC_lte?: InputMaybe<Scalars['BigInt']>;
  currentPositionSizeBC_not?: InputMaybe<Scalars['BigInt']>;
  currentPositionSizeBC_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  endDate?: InputMaybe<Scalars['BigInt']>;
  endDate_gt?: InputMaybe<Scalars['BigInt']>;
  endDate_gte?: InputMaybe<Scalars['BigInt']>;
  endDate_in?: InputMaybe<Array<Scalars['BigInt']>>;
  endDate_lt?: InputMaybe<Scalars['BigInt']>;
  endDate_lte?: InputMaybe<Scalars['BigInt']>;
  endDate_not?: InputMaybe<Scalars['BigInt']>;
  endDate_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  highestSizeBC?: InputMaybe<Scalars['BigInt']>;
  highestSizeBC_gt?: InputMaybe<Scalars['BigInt']>;
  highestSizeBC_gte?: InputMaybe<Scalars['BigInt']>;
  highestSizeBC_in?: InputMaybe<Array<Scalars['BigInt']>>;
  highestSizeBC_lt?: InputMaybe<Scalars['BigInt']>;
  highestSizeBC_lte?: InputMaybe<Scalars['BigInt']>;
  highestSizeBC_not?: InputMaybe<Scalars['BigInt']>;
  highestSizeBC_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  isClosed?: InputMaybe<Scalars['Boolean']>;
  isClosed_in?: InputMaybe<Array<Scalars['Boolean']>>;
  isClosed_not?: InputMaybe<Scalars['Boolean']>;
  isClosed_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  lastChanged?: InputMaybe<Scalars['BigInt']>;
  lastChanged_gt?: InputMaybe<Scalars['BigInt']>;
  lastChanged_gte?: InputMaybe<Scalars['BigInt']>;
  lastChanged_in?: InputMaybe<Array<Scalars['BigInt']>>;
  lastChanged_lt?: InputMaybe<Scalars['BigInt']>;
  lastChanged_lte?: InputMaybe<Scalars['BigInt']>;
  lastChanged_not?: InputMaybe<Scalars['BigInt']>;
  lastChanged_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  liquidations_?: InputMaybe<Liquidate_Filter>;
  lockedInValueQC?: InputMaybe<Scalars['BigInt']>;
  lockedInValueQC_gt?: InputMaybe<Scalars['BigInt']>;
  lockedInValueQC_gte?: InputMaybe<Scalars['BigInt']>;
  lockedInValueQC_in?: InputMaybe<Array<Scalars['BigInt']>>;
  lockedInValueQC_lt?: InputMaybe<Scalars['BigInt']>;
  lockedInValueQC_lte?: InputMaybe<Scalars['BigInt']>;
  lockedInValueQC_not?: InputMaybe<Scalars['BigInt']>;
  lockedInValueQC_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  lowestSizeBC?: InputMaybe<Scalars['BigInt']>;
  lowestSizeBC_gt?: InputMaybe<Scalars['BigInt']>;
  lowestSizeBC_gte?: InputMaybe<Scalars['BigInt']>;
  lowestSizeBC_in?: InputMaybe<Array<Scalars['BigInt']>>;
  lowestSizeBC_lt?: InputMaybe<Scalars['BigInt']>;
  lowestSizeBC_lte?: InputMaybe<Scalars['BigInt']>;
  lowestSizeBC_not?: InputMaybe<Scalars['BigInt']>;
  lowestSizeBC_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  perpetual?: InputMaybe<Scalars['String']>;
  perpetual_?: InputMaybe<Perpetual_Filter>;
  perpetual_contains?: InputMaybe<Scalars['String']>;
  perpetual_contains_nocase?: InputMaybe<Scalars['String']>;
  perpetual_ends_with?: InputMaybe<Scalars['String']>;
  perpetual_ends_with_nocase?: InputMaybe<Scalars['String']>;
  perpetual_gt?: InputMaybe<Scalars['String']>;
  perpetual_gte?: InputMaybe<Scalars['String']>;
  perpetual_in?: InputMaybe<Array<Scalars['String']>>;
  perpetual_lt?: InputMaybe<Scalars['String']>;
  perpetual_lte?: InputMaybe<Scalars['String']>;
  perpetual_not?: InputMaybe<Scalars['String']>;
  perpetual_not_contains?: InputMaybe<Scalars['String']>;
  perpetual_not_contains_nocase?: InputMaybe<Scalars['String']>;
  perpetual_not_ends_with?: InputMaybe<Scalars['String']>;
  perpetual_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  perpetual_not_in?: InputMaybe<Array<Scalars['String']>>;
  perpetual_not_starts_with?: InputMaybe<Scalars['String']>;
  perpetual_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  perpetual_starts_with?: InputMaybe<Scalars['String']>;
  perpetual_starts_with_nocase?: InputMaybe<Scalars['String']>;
  realizedPnLs_?: InputMaybe<RealizedPnL_Filter>;
  startDate?: InputMaybe<Scalars['BigInt']>;
  startDate_gt?: InputMaybe<Scalars['BigInt']>;
  startDate_gte?: InputMaybe<Scalars['BigInt']>;
  startDate_in?: InputMaybe<Array<Scalars['BigInt']>>;
  startDate_lt?: InputMaybe<Scalars['BigInt']>;
  startDate_lte?: InputMaybe<Scalars['BigInt']>;
  startDate_not?: InputMaybe<Scalars['BigInt']>;
  startDate_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  startPositionSizeBC?: InputMaybe<Scalars['BigInt']>;
  startPositionSizeBC_gt?: InputMaybe<Scalars['BigInt']>;
  startPositionSizeBC_gte?: InputMaybe<Scalars['BigInt']>;
  startPositionSizeBC_in?: InputMaybe<Array<Scalars['BigInt']>>;
  startPositionSizeBC_lt?: InputMaybe<Scalars['BigInt']>;
  startPositionSizeBC_lte?: InputMaybe<Scalars['BigInt']>;
  startPositionSizeBC_not?: InputMaybe<Scalars['BigInt']>;
  startPositionSizeBC_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalAmountLiquidatedBC?: InputMaybe<Scalars['BigInt']>;
  totalAmountLiquidatedBC_gt?: InputMaybe<Scalars['BigInt']>;
  totalAmountLiquidatedBC_gte?: InputMaybe<Scalars['BigInt']>;
  totalAmountLiquidatedBC_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalAmountLiquidatedBC_lt?: InputMaybe<Scalars['BigInt']>;
  totalAmountLiquidatedBC_lte?: InputMaybe<Scalars['BigInt']>;
  totalAmountLiquidatedBC_not?: InputMaybe<Scalars['BigInt']>;
  totalAmountLiquidatedBC_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalPnLCC?: InputMaybe<Scalars['BigInt']>;
  totalPnLCC_gt?: InputMaybe<Scalars['BigInt']>;
  totalPnLCC_gte?: InputMaybe<Scalars['BigInt']>;
  totalPnLCC_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalPnLCC_lt?: InputMaybe<Scalars['BigInt']>;
  totalPnLCC_lte?: InputMaybe<Scalars['BigInt']>;
  totalPnLCC_not?: InputMaybe<Scalars['BigInt']>;
  totalPnLCC_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  trader?: InputMaybe<Scalars['String']>;
  traderState?: InputMaybe<Scalars['String']>;
  traderState_?: InputMaybe<TraderState_Filter>;
  traderState_contains?: InputMaybe<Scalars['String']>;
  traderState_contains_nocase?: InputMaybe<Scalars['String']>;
  traderState_ends_with?: InputMaybe<Scalars['String']>;
  traderState_ends_with_nocase?: InputMaybe<Scalars['String']>;
  traderState_gt?: InputMaybe<Scalars['String']>;
  traderState_gte?: InputMaybe<Scalars['String']>;
  traderState_in?: InputMaybe<Array<Scalars['String']>>;
  traderState_lt?: InputMaybe<Scalars['String']>;
  traderState_lte?: InputMaybe<Scalars['String']>;
  traderState_not?: InputMaybe<Scalars['String']>;
  traderState_not_contains?: InputMaybe<Scalars['String']>;
  traderState_not_contains_nocase?: InputMaybe<Scalars['String']>;
  traderState_not_ends_with?: InputMaybe<Scalars['String']>;
  traderState_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  traderState_not_in?: InputMaybe<Array<Scalars['String']>>;
  traderState_not_starts_with?: InputMaybe<Scalars['String']>;
  traderState_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  traderState_starts_with?: InputMaybe<Scalars['String']>;
  traderState_starts_with_nocase?: InputMaybe<Scalars['String']>;
  trader_?: InputMaybe<Trader_Filter>;
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
  tradesTotalCount?: InputMaybe<Scalars['Int']>;
  tradesTotalCount_gt?: InputMaybe<Scalars['Int']>;
  tradesTotalCount_gte?: InputMaybe<Scalars['Int']>;
  tradesTotalCount_in?: InputMaybe<Array<Scalars['Int']>>;
  tradesTotalCount_lt?: InputMaybe<Scalars['Int']>;
  tradesTotalCount_lte?: InputMaybe<Scalars['Int']>;
  tradesTotalCount_not?: InputMaybe<Scalars['Int']>;
  tradesTotalCount_not_in?: InputMaybe<Array<Scalars['Int']>>;
  trades_?: InputMaybe<Trade_Filter>;
};

export enum Position_OrderBy {
  CurrentPositionSizeBc = 'currentPositionSizeBC',
  EndDate = 'endDate',
  HighestSizeBc = 'highestSizeBC',
  Id = 'id',
  IsClosed = 'isClosed',
  LastChanged = 'lastChanged',
  Liquidations = 'liquidations',
  LockedInValueQc = 'lockedInValueQC',
  LowestSizeBc = 'lowestSizeBC',
  Perpetual = 'perpetual',
  RealizedPnLs = 'realizedPnLs',
  StartDate = 'startDate',
  StartPositionSizeBc = 'startPositionSizeBC',
  TotalAmountLiquidatedBc = 'totalAmountLiquidatedBC',
  TotalPnLcc = 'totalPnLCC',
  Trader = 'trader',
  TraderState = 'traderState',
  Trades = 'trades',
  TradesTotalCount = 'tradesTotalCount',
}

export type ProxyOwnershipTransferred = {
  __typename?: 'ProxyOwnershipTransferred';
  _newOwner: Scalars['Bytes'];
  _oldOwner: Scalars['Bytes'];
  id: Scalars['ID'];
};

export type ProxyOwnershipTransferred_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  _newOwner?: InputMaybe<Scalars['Bytes']>;
  _newOwner_contains?: InputMaybe<Scalars['Bytes']>;
  _newOwner_in?: InputMaybe<Array<Scalars['Bytes']>>;
  _newOwner_not?: InputMaybe<Scalars['Bytes']>;
  _newOwner_not_contains?: InputMaybe<Scalars['Bytes']>;
  _newOwner_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  _oldOwner?: InputMaybe<Scalars['Bytes']>;
  _oldOwner_contains?: InputMaybe<Scalars['Bytes']>;
  _oldOwner_in?: InputMaybe<Array<Scalars['Bytes']>>;
  _oldOwner_not?: InputMaybe<Scalars['Bytes']>;
  _oldOwner_not_contains?: InputMaybe<Scalars['Bytes']>;
  _oldOwner_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
};

export enum ProxyOwnershipTransferred_OrderBy {
  NewOwner = '_newOwner',
  OldOwner = '_oldOwner',
  Id = 'id',
}

export type Query = {
  __typename?: 'Query';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  addAmmGovernanceAddress?: Maybe<AddAmmGovernanceAddress>;
  addAmmGovernanceAddresses: Array<AddAmmGovernanceAddress>;
  answerUpdated?: Maybe<AnswerUpdated>;
  answerUpdateds: Array<AnswerUpdated>;
  atomicYield?: Maybe<AtomicYield>;
  atomicYields: Array<AtomicYield>;
  candleSticksDay?: Maybe<CandleSticksDay>;
  candleSticksDays: Array<CandleSticksDay>;
  candleSticksFifteenMinute?: Maybe<CandleSticksFifteenMinute>;
  candleSticksFifteenMinutes: Array<CandleSticksFifteenMinute>;
  candleSticksFourHour?: Maybe<CandleSticksFourHour>;
  candleSticksFourHours: Array<CandleSticksFourHour>;
  candleSticksHour?: Maybe<CandleSticksHour>;
  candleSticksHours: Array<CandleSticksHour>;
  candleSticksMinute?: Maybe<CandleSticksMinute>;
  candleSticksMinutes: Array<CandleSticksMinute>;
  clear?: Maybe<Clear>;
  clears: Array<Clear>;
  distributeFee?: Maybe<DistributeFee>;
  distributeFees: Array<DistributeFee>;
  fund?: Maybe<Fund>;
  fundingPayment?: Maybe<FundingPayment>;
  fundingPayments: Array<FundingPayment>;
  fundingRate?: Maybe<FundingRate>;
  fundingRates: Array<FundingRate>;
  funds: Array<Fund>;
  implementationChanged?: Maybe<ImplementationChanged>;
  implementationChangeds: Array<ImplementationChanged>;
  limitOrder?: Maybe<LimitOrder>;
  limitOrders: Array<LimitOrder>;
  liquidate?: Maybe<Liquidate>;
  liquidates: Array<Liquidate>;
  liquidityAdded?: Maybe<LiquidityAdded>;
  liquidityAddeds: Array<LiquidityAdded>;
  liquidityPool?: Maybe<LiquidityPool>;
  liquidityPoolCreated?: Maybe<LiquidityPoolCreated>;
  liquidityPoolCreateds: Array<LiquidityPoolCreated>;
  liquidityPools: Array<LiquidityPool>;
  liquidityRemoved?: Maybe<LiquidityRemoved>;
  liquidityRemoveds: Array<LiquidityRemoved>;
  ownershipTransferred?: Maybe<OwnershipTransferred>;
  ownershipTransferreds: Array<OwnershipTransferred>;
  perpetual?: Maybe<Perpetual>;
  perpetualCreated?: Maybe<PerpetualCreated>;
  perpetualCreateds: Array<PerpetualCreated>;
  perpetualLimitOrderBookDeployed?: Maybe<PerpetualLimitOrderBookDeployed>;
  perpetualLimitOrderBookDeployeds: Array<PerpetualLimitOrderBookDeployed>;
  perpetualLimitOrderCancelled?: Maybe<PerpetualLimitOrderCancelled>;
  perpetualLimitOrderCancelleds: Array<PerpetualLimitOrderCancelled>;
  perpetualLimitOrderCreated?: Maybe<PerpetualLimitOrderCreated>;
  perpetualLimitOrderCreateds: Array<PerpetualLimitOrderCreated>;
  perpetuals: Array<Perpetual>;
  position?: Maybe<Position>;
  positions: Array<Position>;
  proxyOwnershipTransferred?: Maybe<ProxyOwnershipTransferred>;
  proxyOwnershipTransferreds: Array<ProxyOwnershipTransferred>;
  realizedPnL?: Maybe<RealizedPnL>;
  realizedPnLs: Array<RealizedPnL>;
  removeAmmGovernanceAddress?: Maybe<RemoveAmmGovernanceAddress>;
  removeAmmGovernanceAddresses: Array<RemoveAmmGovernanceAddress>;
  runLiquidityPool?: Maybe<RunLiquidityPool>;
  runLiquidityPools: Array<RunLiquidityPool>;
  setClearedState?: Maybe<SetClearedState>;
  setClearedStates: Array<SetClearedState>;
  setEmergencyState?: Maybe<SetEmergencyState>;
  setEmergencyStates: Array<SetEmergencyState>;
  setNormalState?: Maybe<SetNormalState>;
  setNormalStates: Array<SetNormalState>;
  setOracles: Array<SetOracles>;
  setParameter?: Maybe<SetParameter>;
  setParameterPair?: Maybe<SetParameterPair>;
  setParameterPairs: Array<SetParameterPair>;
  setParameters: Array<SetParameter>;
  setPerpetualBaseParameters: Array<SetPerpetualBaseParameters>;
  setPerpetualRiskParameters: Array<SetPerpetualRiskParameters>;
  setTargetPoolSizeUpdateTime?: Maybe<SetTargetPoolSizeUpdateTime>;
  setTargetPoolSizeUpdateTimes: Array<SetTargetPoolSizeUpdateTime>;
  setWithdrawalLimit?: Maybe<SetWithdrawalLimit>;
  setWithdrawalLimits: Array<SetWithdrawalLimit>;
  settle?: Maybe<Settle>;
  settles: Array<Settle>;
  spotOracle?: Maybe<SpotOracle>;
  spotOracles: Array<SpotOracle>;
  token?: Maybe<Token>;
  tokens: Array<Token>;
  tokensDeposited?: Maybe<TokensDeposited>;
  tokensDepositeds: Array<TokensDeposited>;
  tokensWithdrawn?: Maybe<TokensWithdrawn>;
  tokensWithdrawns: Array<TokensWithdrawn>;
  trade?: Maybe<Trade>;
  trader?: Maybe<Trader>;
  traderPool?: Maybe<TraderPool>;
  traderPools: Array<TraderPool>;
  traderState?: Maybe<TraderState>;
  traderStates: Array<TraderState>;
  traders: Array<Trader>;
  trades: Array<Trade>;
  transaction?: Maybe<Transaction>;
  transactions: Array<Transaction>;
  transferEarningsToTreasuries: Array<TransferEarningsToTreasury>;
  transferEarningsToTreasury?: Maybe<TransferEarningsToTreasury>;
  transferFeeToReferrer?: Maybe<TransferFeeToReferrer>;
  transferFeeToReferrers: Array<TransferFeeToReferrer>;
  transferTreasuryTo?: Maybe<TransferTreasuryTo>;
  transferTreasuryTos: Array<TransferTreasuryTo>;
  updateAMMFundCash?: Maybe<UpdateAmmFundCash>;
  updateAMMFundCashes: Array<UpdateAmmFundCash>;
  updateAMMFundTargetSize?: Maybe<UpdateAmmFundTargetSize>;
  updateAMMFundTargetSizes: Array<UpdateAmmFundTargetSize>;
  updateDefaultFundCash?: Maybe<UpdateDefaultFundCash>;
  updateDefaultFundCashes: Array<UpdateDefaultFundCash>;
  updateDefaultFundTargetSize?: Maybe<UpdateDefaultFundTargetSize>;
  updateDefaultFundTargetSizes: Array<UpdateDefaultFundTargetSize>;
  updateFundingRate?: Maybe<UpdateFundingRate>;
  updateFundingRates: Array<UpdateFundingRate>;
  updateMarginAccount?: Maybe<UpdateMarginAccount>;
  updateMarginAccounts: Array<UpdateMarginAccount>;
  updateMarkPrice?: Maybe<UpdateMarkPrice>;
  updateMarkPrices: Array<UpdateMarkPrice>;
  updateParticipationFundCash?: Maybe<UpdateParticipationFundCash>;
  updateParticipationFundCashes: Array<UpdateParticipationFundCash>;
  updatePrice?: Maybe<UpdatePrice>;
  updatePrices: Array<UpdatePrice>;
  updateReprTradeSizes: Array<UpdateReprTradeSizes>;
  updateUnitAccumulatedFunding?: Maybe<UpdateUnitAccumulatedFunding>;
  updateUnitAccumulatedFundings: Array<UpdateUnitAccumulatedFunding>;
};

export type Query_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};

export type QueryAddAmmGovernanceAddressArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryAddAmmGovernanceAddressesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<AddAmmGovernanceAddress_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<AddAmmGovernanceAddress_Filter>;
};

export type QueryAnswerUpdatedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryAnswerUpdatedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<AnswerUpdated_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<AnswerUpdated_Filter>;
};

export type QueryAtomicYieldArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryAtomicYieldsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<AtomicYield_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<AtomicYield_Filter>;
};

export type QueryCandleSticksDayArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryCandleSticksDaysArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<CandleSticksDay_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<CandleSticksDay_Filter>;
};

export type QueryCandleSticksFifteenMinuteArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryCandleSticksFifteenMinutesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<CandleSticksFifteenMinute_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<CandleSticksFifteenMinute_Filter>;
};

export type QueryCandleSticksFourHourArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryCandleSticksFourHoursArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<CandleSticksFourHour_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<CandleSticksFourHour_Filter>;
};

export type QueryCandleSticksHourArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryCandleSticksHoursArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<CandleSticksHour_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<CandleSticksHour_Filter>;
};

export type QueryCandleSticksMinuteArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryCandleSticksMinutesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<CandleSticksMinute_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<CandleSticksMinute_Filter>;
};

export type QueryClearArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryClearsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Clear_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Clear_Filter>;
};

export type QueryDistributeFeeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryDistributeFeesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<DistributeFee_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<DistributeFee_Filter>;
};

export type QueryFundArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryFundingPaymentArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryFundingPaymentsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<FundingPayment_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<FundingPayment_Filter>;
};

export type QueryFundingRateArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryFundingRatesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<FundingRate_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<FundingRate_Filter>;
};

export type QueryFundsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Fund_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Fund_Filter>;
};

export type QueryImplementationChangedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryImplementationChangedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ImplementationChanged_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ImplementationChanged_Filter>;
};

export type QueryLimitOrderArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryLimitOrdersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<LimitOrder_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<LimitOrder_Filter>;
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

export type QueryLiquidityAddedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryLiquidityAddedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<LiquidityAdded_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<LiquidityAdded_Filter>;
};

export type QueryLiquidityPoolArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryLiquidityPoolCreatedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryLiquidityPoolCreatedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<LiquidityPoolCreated_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<LiquidityPoolCreated_Filter>;
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

export type QueryLiquidityRemovedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryLiquidityRemovedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<LiquidityRemoved_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<LiquidityRemoved_Filter>;
};

export type QueryOwnershipTransferredArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryOwnershipTransferredsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<OwnershipTransferred_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<OwnershipTransferred_Filter>;
};

export type QueryPerpetualArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryPerpetualCreatedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryPerpetualCreatedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<PerpetualCreated_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PerpetualCreated_Filter>;
};

export type QueryPerpetualLimitOrderBookDeployedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryPerpetualLimitOrderBookDeployedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<PerpetualLimitOrderBookDeployed_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PerpetualLimitOrderBookDeployed_Filter>;
};

export type QueryPerpetualLimitOrderCancelledArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryPerpetualLimitOrderCancelledsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<PerpetualLimitOrderCancelled_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PerpetualLimitOrderCancelled_Filter>;
};

export type QueryPerpetualLimitOrderCreatedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryPerpetualLimitOrderCreatedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<PerpetualLimitOrderCreated_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PerpetualLimitOrderCreated_Filter>;
};

export type QueryPerpetualsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Perpetual_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Perpetual_Filter>;
};

export type QueryPositionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryPositionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Position_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Position_Filter>;
};

export type QueryProxyOwnershipTransferredArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryProxyOwnershipTransferredsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ProxyOwnershipTransferred_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ProxyOwnershipTransferred_Filter>;
};

export type QueryRealizedPnLArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryRealizedPnLsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<RealizedPnL_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<RealizedPnL_Filter>;
};

export type QueryRemoveAmmGovernanceAddressArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryRemoveAmmGovernanceAddressesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<RemoveAmmGovernanceAddress_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<RemoveAmmGovernanceAddress_Filter>;
};

export type QueryRunLiquidityPoolArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryRunLiquidityPoolsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<RunLiquidityPool_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<RunLiquidityPool_Filter>;
};

export type QuerySetClearedStateArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QuerySetClearedStatesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<SetClearedState_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<SetClearedState_Filter>;
};

export type QuerySetEmergencyStateArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QuerySetEmergencyStatesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<SetEmergencyState_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<SetEmergencyState_Filter>;
};

export type QuerySetNormalStateArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QuerySetNormalStatesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<SetNormalState_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<SetNormalState_Filter>;
};

export type QuerySetOraclesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<SetOracles_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<SetOracles_Filter>;
};

export type QuerySetParameterArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QuerySetParameterPairArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QuerySetParameterPairsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<SetParameterPair_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<SetParameterPair_Filter>;
};

export type QuerySetParametersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<SetParameter_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<SetParameter_Filter>;
};

export type QuerySetPerpetualBaseParametersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<SetPerpetualBaseParameters_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<SetPerpetualBaseParameters_Filter>;
};

export type QuerySetPerpetualRiskParametersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<SetPerpetualRiskParameters_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<SetPerpetualRiskParameters_Filter>;
};

export type QuerySetTargetPoolSizeUpdateTimeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QuerySetTargetPoolSizeUpdateTimesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<SetTargetPoolSizeUpdateTime_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<SetTargetPoolSizeUpdateTime_Filter>;
};

export type QuerySetWithdrawalLimitArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QuerySetWithdrawalLimitsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<SetWithdrawalLimit_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<SetWithdrawalLimit_Filter>;
};

export type QuerySettleArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QuerySettlesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Settle_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Settle_Filter>;
};

export type QuerySpotOracleArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QuerySpotOraclesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<SpotOracle_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<SpotOracle_Filter>;
};

export type QueryTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
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

export type QueryTokensDepositedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryTokensDepositedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TokensDeposited_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TokensDeposited_Filter>;
};

export type QueryTokensWithdrawnArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryTokensWithdrawnsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TokensWithdrawn_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TokensWithdrawn_Filter>;
};

export type QueryTradeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryTraderArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryTraderPoolArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryTraderPoolsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TraderPool_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TraderPool_Filter>;
};

export type QueryTraderStateArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryTraderStatesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TraderState_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TraderState_Filter>;
};

export type QueryTradersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Trader_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Trader_Filter>;
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

export type QueryTransferEarningsToTreasuriesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TransferEarningsToTreasury_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TransferEarningsToTreasury_Filter>;
};

export type QueryTransferEarningsToTreasuryArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryTransferFeeToReferrerArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryTransferFeeToReferrersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TransferFeeToReferrer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TransferFeeToReferrer_Filter>;
};

export type QueryTransferTreasuryToArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryTransferTreasuryTosArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TransferTreasuryTo_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TransferTreasuryTo_Filter>;
};

export type QueryUpdateAmmFundCashArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryUpdateAmmFundCashesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UpdateAmmFundCash_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<UpdateAmmFundCash_Filter>;
};

export type QueryUpdateAmmFundTargetSizeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryUpdateAmmFundTargetSizesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UpdateAmmFundTargetSize_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<UpdateAmmFundTargetSize_Filter>;
};

export type QueryUpdateDefaultFundCashArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryUpdateDefaultFundCashesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UpdateDefaultFundCash_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<UpdateDefaultFundCash_Filter>;
};

export type QueryUpdateDefaultFundTargetSizeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryUpdateDefaultFundTargetSizesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UpdateDefaultFundTargetSize_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<UpdateDefaultFundTargetSize_Filter>;
};

export type QueryUpdateFundingRateArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryUpdateFundingRatesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UpdateFundingRate_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<UpdateFundingRate_Filter>;
};

export type QueryUpdateMarginAccountArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryUpdateMarginAccountsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UpdateMarginAccount_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<UpdateMarginAccount_Filter>;
};

export type QueryUpdateMarkPriceArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryUpdateMarkPricesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UpdateMarkPrice_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<UpdateMarkPrice_Filter>;
};

export type QueryUpdateParticipationFundCashArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryUpdateParticipationFundCashesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UpdateParticipationFundCash_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<UpdateParticipationFundCash_Filter>;
};

export type QueryUpdatePriceArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryUpdatePricesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UpdatePrice_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<UpdatePrice_Filter>;
};

export type QueryUpdateReprTradeSizesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UpdateReprTradeSizes_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<UpdateReprTradeSizes_Filter>;
};

export type QueryUpdateUnitAccumulatedFundingArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryUpdateUnitAccumulatedFundingsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UpdateUnitAccumulatedFunding_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<UpdateUnitAccumulatedFunding_Filter>;
};

export type RealizedPnL = {
  __typename?: 'RealizedPnL';
  blockTimestamp: Scalars['BigInt'];
  id: Scalars['ID'];
  perpetual: Perpetual;
  pnlCC: Scalars['BigInt'];
  position: Position;
  trader: Trader;
};

export type RealizedPnL_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  perpetual?: InputMaybe<Scalars['String']>;
  perpetual_?: InputMaybe<Perpetual_Filter>;
  perpetual_contains?: InputMaybe<Scalars['String']>;
  perpetual_contains_nocase?: InputMaybe<Scalars['String']>;
  perpetual_ends_with?: InputMaybe<Scalars['String']>;
  perpetual_ends_with_nocase?: InputMaybe<Scalars['String']>;
  perpetual_gt?: InputMaybe<Scalars['String']>;
  perpetual_gte?: InputMaybe<Scalars['String']>;
  perpetual_in?: InputMaybe<Array<Scalars['String']>>;
  perpetual_lt?: InputMaybe<Scalars['String']>;
  perpetual_lte?: InputMaybe<Scalars['String']>;
  perpetual_not?: InputMaybe<Scalars['String']>;
  perpetual_not_contains?: InputMaybe<Scalars['String']>;
  perpetual_not_contains_nocase?: InputMaybe<Scalars['String']>;
  perpetual_not_ends_with?: InputMaybe<Scalars['String']>;
  perpetual_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  perpetual_not_in?: InputMaybe<Array<Scalars['String']>>;
  perpetual_not_starts_with?: InputMaybe<Scalars['String']>;
  perpetual_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  perpetual_starts_with?: InputMaybe<Scalars['String']>;
  perpetual_starts_with_nocase?: InputMaybe<Scalars['String']>;
  pnlCC?: InputMaybe<Scalars['BigInt']>;
  pnlCC_gt?: InputMaybe<Scalars['BigInt']>;
  pnlCC_gte?: InputMaybe<Scalars['BigInt']>;
  pnlCC_in?: InputMaybe<Array<Scalars['BigInt']>>;
  pnlCC_lt?: InputMaybe<Scalars['BigInt']>;
  pnlCC_lte?: InputMaybe<Scalars['BigInt']>;
  pnlCC_not?: InputMaybe<Scalars['BigInt']>;
  pnlCC_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  position?: InputMaybe<Scalars['String']>;
  position_?: InputMaybe<Position_Filter>;
  position_contains?: InputMaybe<Scalars['String']>;
  position_contains_nocase?: InputMaybe<Scalars['String']>;
  position_ends_with?: InputMaybe<Scalars['String']>;
  position_ends_with_nocase?: InputMaybe<Scalars['String']>;
  position_gt?: InputMaybe<Scalars['String']>;
  position_gte?: InputMaybe<Scalars['String']>;
  position_in?: InputMaybe<Array<Scalars['String']>>;
  position_lt?: InputMaybe<Scalars['String']>;
  position_lte?: InputMaybe<Scalars['String']>;
  position_not?: InputMaybe<Scalars['String']>;
  position_not_contains?: InputMaybe<Scalars['String']>;
  position_not_contains_nocase?: InputMaybe<Scalars['String']>;
  position_not_ends_with?: InputMaybe<Scalars['String']>;
  position_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  position_not_in?: InputMaybe<Array<Scalars['String']>>;
  position_not_starts_with?: InputMaybe<Scalars['String']>;
  position_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  position_starts_with?: InputMaybe<Scalars['String']>;
  position_starts_with_nocase?: InputMaybe<Scalars['String']>;
  trader?: InputMaybe<Scalars['String']>;
  trader_?: InputMaybe<Trader_Filter>;
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
};

export enum RealizedPnL_OrderBy {
  BlockTimestamp = 'blockTimestamp',
  Id = 'id',
  Perpetual = 'perpetual',
  PnlCc = 'pnlCC',
  Position = 'position',
  Trader = 'trader',
}

export type RemoveAmmGovernanceAddress = {
  __typename?: 'RemoveAmmGovernanceAddress';
  gAddress: Scalars['Bytes'];
  id: Scalars['ID'];
};

export type RemoveAmmGovernanceAddress_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  gAddress?: InputMaybe<Scalars['Bytes']>;
  gAddress_contains?: InputMaybe<Scalars['Bytes']>;
  gAddress_in?: InputMaybe<Array<Scalars['Bytes']>>;
  gAddress_not?: InputMaybe<Scalars['Bytes']>;
  gAddress_not_contains?: InputMaybe<Scalars['Bytes']>;
  gAddress_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
};

export enum RemoveAmmGovernanceAddress_OrderBy {
  GAddress = 'gAddress',
  Id = 'id',
}

export type RunLiquidityPool = {
  __typename?: 'RunLiquidityPool';
  _liqPoolID: Scalars['Int'];
  id: Scalars['ID'];
};

export type RunLiquidityPool_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  _liqPoolID?: InputMaybe<Scalars['Int']>;
  _liqPoolID_gt?: InputMaybe<Scalars['Int']>;
  _liqPoolID_gte?: InputMaybe<Scalars['Int']>;
  _liqPoolID_in?: InputMaybe<Array<Scalars['Int']>>;
  _liqPoolID_lt?: InputMaybe<Scalars['Int']>;
  _liqPoolID_lte?: InputMaybe<Scalars['Int']>;
  _liqPoolID_not?: InputMaybe<Scalars['Int']>;
  _liqPoolID_not_in?: InputMaybe<Array<Scalars['Int']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
};

export enum RunLiquidityPool_OrderBy {
  LiqPoolId = '_liqPoolID',
  Id = 'id',
}

export type SetClearedState = {
  __typename?: 'SetClearedState';
  id: Scalars['ID'];
  perpetualId: Scalars['Bytes'];
};

export type SetClearedState_Filter = {
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
  perpetualId?: InputMaybe<Scalars['Bytes']>;
  perpetualId_contains?: InputMaybe<Scalars['Bytes']>;
  perpetualId_in?: InputMaybe<Array<Scalars['Bytes']>>;
  perpetualId_not?: InputMaybe<Scalars['Bytes']>;
  perpetualId_not_contains?: InputMaybe<Scalars['Bytes']>;
  perpetualId_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum SetClearedState_OrderBy {
  Id = 'id',
  PerpetualId = 'perpetualId',
}

export type SetEmergencyState = {
  __typename?: 'SetEmergencyState';
  fSettlementMarkPremiumRate: Scalars['BigInt'];
  fSettlementS2Price: Scalars['BigInt'];
  fSettlementS3Price: Scalars['BigInt'];
  id: Scalars['ID'];
  perpetualId: Scalars['Bytes'];
};

export type SetEmergencyState_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  fSettlementMarkPremiumRate?: InputMaybe<Scalars['BigInt']>;
  fSettlementMarkPremiumRate_gt?: InputMaybe<Scalars['BigInt']>;
  fSettlementMarkPremiumRate_gte?: InputMaybe<Scalars['BigInt']>;
  fSettlementMarkPremiumRate_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fSettlementMarkPremiumRate_lt?: InputMaybe<Scalars['BigInt']>;
  fSettlementMarkPremiumRate_lte?: InputMaybe<Scalars['BigInt']>;
  fSettlementMarkPremiumRate_not?: InputMaybe<Scalars['BigInt']>;
  fSettlementMarkPremiumRate_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fSettlementS2Price?: InputMaybe<Scalars['BigInt']>;
  fSettlementS2Price_gt?: InputMaybe<Scalars['BigInt']>;
  fSettlementS2Price_gte?: InputMaybe<Scalars['BigInt']>;
  fSettlementS2Price_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fSettlementS2Price_lt?: InputMaybe<Scalars['BigInt']>;
  fSettlementS2Price_lte?: InputMaybe<Scalars['BigInt']>;
  fSettlementS2Price_not?: InputMaybe<Scalars['BigInt']>;
  fSettlementS2Price_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fSettlementS3Price?: InputMaybe<Scalars['BigInt']>;
  fSettlementS3Price_gt?: InputMaybe<Scalars['BigInt']>;
  fSettlementS3Price_gte?: InputMaybe<Scalars['BigInt']>;
  fSettlementS3Price_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fSettlementS3Price_lt?: InputMaybe<Scalars['BigInt']>;
  fSettlementS3Price_lte?: InputMaybe<Scalars['BigInt']>;
  fSettlementS3Price_not?: InputMaybe<Scalars['BigInt']>;
  fSettlementS3Price_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  perpetualId?: InputMaybe<Scalars['Bytes']>;
  perpetualId_contains?: InputMaybe<Scalars['Bytes']>;
  perpetualId_in?: InputMaybe<Array<Scalars['Bytes']>>;
  perpetualId_not?: InputMaybe<Scalars['Bytes']>;
  perpetualId_not_contains?: InputMaybe<Scalars['Bytes']>;
  perpetualId_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum SetEmergencyState_OrderBy {
  FSettlementMarkPremiumRate = 'fSettlementMarkPremiumRate',
  FSettlementS2Price = 'fSettlementS2Price',
  FSettlementS3Price = 'fSettlementS3Price',
  Id = 'id',
  PerpetualId = 'perpetualId',
}

export type SetNormalState = {
  __typename?: 'SetNormalState';
  id: Scalars['ID'];
  perpetualId: Scalars['Bytes'];
};

export type SetNormalState_Filter = {
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
  perpetualId?: InputMaybe<Scalars['Bytes']>;
  perpetualId_contains?: InputMaybe<Scalars['Bytes']>;
  perpetualId_in?: InputMaybe<Array<Scalars['Bytes']>>;
  perpetualId_not?: InputMaybe<Scalars['Bytes']>;
  perpetualId_not_contains?: InputMaybe<Scalars['Bytes']>;
  perpetualId_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum SetNormalState_OrderBy {
  Id = 'id',
  PerpetualId = 'perpetualId',
}

export type SetOracles = {
  __typename?: 'SetOracles';
  id: Scalars['ID'];
  perpetualId: Scalars['Bytes'];
};

export type SetOracles_Filter = {
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
  perpetualId?: InputMaybe<Scalars['Bytes']>;
  perpetualId_contains?: InputMaybe<Scalars['Bytes']>;
  perpetualId_in?: InputMaybe<Array<Scalars['Bytes']>>;
  perpetualId_not?: InputMaybe<Scalars['Bytes']>;
  perpetualId_not_contains?: InputMaybe<Scalars['Bytes']>;
  perpetualId_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum SetOracles_OrderBy {
  Id = 'id',
  PerpetualId = 'perpetualId',
}

export type SetParameter = {
  __typename?: 'SetParameter';
  id: Scalars['ID'];
  name: Scalars['String'];
  perpetual: Perpetual;
  value: Scalars['BigInt'];
};

export type SetParameterPair = {
  __typename?: 'SetParameterPair';
  id: Scalars['ID'];
  name: Scalars['String'];
  perpetualId: Scalars['Bytes'];
  value1: Scalars['BigInt'];
  value2: Scalars['BigInt'];
};

export type SetParameterPair_Filter = {
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
  perpetualId?: InputMaybe<Scalars['Bytes']>;
  perpetualId_contains?: InputMaybe<Scalars['Bytes']>;
  perpetualId_in?: InputMaybe<Array<Scalars['Bytes']>>;
  perpetualId_not?: InputMaybe<Scalars['Bytes']>;
  perpetualId_not_contains?: InputMaybe<Scalars['Bytes']>;
  perpetualId_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  value1?: InputMaybe<Scalars['BigInt']>;
  value1_gt?: InputMaybe<Scalars['BigInt']>;
  value1_gte?: InputMaybe<Scalars['BigInt']>;
  value1_in?: InputMaybe<Array<Scalars['BigInt']>>;
  value1_lt?: InputMaybe<Scalars['BigInt']>;
  value1_lte?: InputMaybe<Scalars['BigInt']>;
  value1_not?: InputMaybe<Scalars['BigInt']>;
  value1_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  value2?: InputMaybe<Scalars['BigInt']>;
  value2_gt?: InputMaybe<Scalars['BigInt']>;
  value2_gte?: InputMaybe<Scalars['BigInt']>;
  value2_in?: InputMaybe<Array<Scalars['BigInt']>>;
  value2_lt?: InputMaybe<Scalars['BigInt']>;
  value2_lte?: InputMaybe<Scalars['BigInt']>;
  value2_not?: InputMaybe<Scalars['BigInt']>;
  value2_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export enum SetParameterPair_OrderBy {
  Id = 'id',
  Name = 'name',
  PerpetualId = 'perpetualId',
  Value1 = 'value1',
  Value2 = 'value2',
}

export type SetParameter_Filter = {
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
  perpetual?: InputMaybe<Scalars['String']>;
  perpetual_?: InputMaybe<Perpetual_Filter>;
  perpetual_contains?: InputMaybe<Scalars['String']>;
  perpetual_contains_nocase?: InputMaybe<Scalars['String']>;
  perpetual_ends_with?: InputMaybe<Scalars['String']>;
  perpetual_ends_with_nocase?: InputMaybe<Scalars['String']>;
  perpetual_gt?: InputMaybe<Scalars['String']>;
  perpetual_gte?: InputMaybe<Scalars['String']>;
  perpetual_in?: InputMaybe<Array<Scalars['String']>>;
  perpetual_lt?: InputMaybe<Scalars['String']>;
  perpetual_lte?: InputMaybe<Scalars['String']>;
  perpetual_not?: InputMaybe<Scalars['String']>;
  perpetual_not_contains?: InputMaybe<Scalars['String']>;
  perpetual_not_contains_nocase?: InputMaybe<Scalars['String']>;
  perpetual_not_ends_with?: InputMaybe<Scalars['String']>;
  perpetual_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  perpetual_not_in?: InputMaybe<Array<Scalars['String']>>;
  perpetual_not_starts_with?: InputMaybe<Scalars['String']>;
  perpetual_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  perpetual_starts_with?: InputMaybe<Scalars['String']>;
  perpetual_starts_with_nocase?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<Scalars['BigInt']>;
  value_gt?: InputMaybe<Scalars['BigInt']>;
  value_gte?: InputMaybe<Scalars['BigInt']>;
  value_in?: InputMaybe<Array<Scalars['BigInt']>>;
  value_lt?: InputMaybe<Scalars['BigInt']>;
  value_lte?: InputMaybe<Scalars['BigInt']>;
  value_not?: InputMaybe<Scalars['BigInt']>;
  value_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export enum SetParameter_OrderBy {
  Id = 'id',
  Name = 'name',
  Perpetual = 'perpetual',
  Value = 'value',
}

export type SetPerpetualBaseParameters = {
  __typename?: 'SetPerpetualBaseParameters';
  id: Scalars['ID'];
  perpetualId: Scalars['Bytes'];
};

export type SetPerpetualBaseParameters_Filter = {
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
  perpetualId?: InputMaybe<Scalars['Bytes']>;
  perpetualId_contains?: InputMaybe<Scalars['Bytes']>;
  perpetualId_in?: InputMaybe<Array<Scalars['Bytes']>>;
  perpetualId_not?: InputMaybe<Scalars['Bytes']>;
  perpetualId_not_contains?: InputMaybe<Scalars['Bytes']>;
  perpetualId_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum SetPerpetualBaseParameters_OrderBy {
  Id = 'id',
  PerpetualId = 'perpetualId',
}

export type SetPerpetualRiskParameters = {
  __typename?: 'SetPerpetualRiskParameters';
  id: Scalars['ID'];
  perpetualId: Scalars['Bytes'];
};

export type SetPerpetualRiskParameters_Filter = {
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
  perpetualId?: InputMaybe<Scalars['Bytes']>;
  perpetualId_contains?: InputMaybe<Scalars['Bytes']>;
  perpetualId_in?: InputMaybe<Array<Scalars['Bytes']>>;
  perpetualId_not?: InputMaybe<Scalars['Bytes']>;
  perpetualId_not_contains?: InputMaybe<Scalars['Bytes']>;
  perpetualId_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum SetPerpetualRiskParameters_OrderBy {
  Id = 'id',
  PerpetualId = 'perpetualId',
}

export type SetTargetPoolSizeUpdateTime = {
  __typename?: 'SetTargetPoolSizeUpdateTime';
  id: Scalars['ID'];
  poolId: Scalars['Int'];
  targetPoolSizeUpdateTime: Scalars['BigInt'];
};

export type SetTargetPoolSizeUpdateTime_Filter = {
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
  poolId?: InputMaybe<Scalars['Int']>;
  poolId_gt?: InputMaybe<Scalars['Int']>;
  poolId_gte?: InputMaybe<Scalars['Int']>;
  poolId_in?: InputMaybe<Array<Scalars['Int']>>;
  poolId_lt?: InputMaybe<Scalars['Int']>;
  poolId_lte?: InputMaybe<Scalars['Int']>;
  poolId_not?: InputMaybe<Scalars['Int']>;
  poolId_not_in?: InputMaybe<Array<Scalars['Int']>>;
  targetPoolSizeUpdateTime?: InputMaybe<Scalars['BigInt']>;
  targetPoolSizeUpdateTime_gt?: InputMaybe<Scalars['BigInt']>;
  targetPoolSizeUpdateTime_gte?: InputMaybe<Scalars['BigInt']>;
  targetPoolSizeUpdateTime_in?: InputMaybe<Array<Scalars['BigInt']>>;
  targetPoolSizeUpdateTime_lt?: InputMaybe<Scalars['BigInt']>;
  targetPoolSizeUpdateTime_lte?: InputMaybe<Scalars['BigInt']>;
  targetPoolSizeUpdateTime_not?: InputMaybe<Scalars['BigInt']>;
  targetPoolSizeUpdateTime_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export enum SetTargetPoolSizeUpdateTime_OrderBy {
  Id = 'id',
  PoolId = 'poolId',
  TargetPoolSizeUpdateTime = 'targetPoolSizeUpdateTime',
}

export type SetWithdrawalLimit = {
  __typename?: 'SetWithdrawalLimit';
  PnLparticipantWithdrawalMinAmountLimit: Scalars['BigInt'];
  PnLparticipantWithdrawalPercentageLimit: Scalars['BigInt'];
  PnLparticipantWithdrawalPeriod: Scalars['BigInt'];
  id: Scalars['ID'];
  poolId: Scalars['Int'];
};

export type SetWithdrawalLimit_Filter = {
  PnLparticipantWithdrawalMinAmountLimit?: InputMaybe<Scalars['BigInt']>;
  PnLparticipantWithdrawalMinAmountLimit_gt?: InputMaybe<Scalars['BigInt']>;
  PnLparticipantWithdrawalMinAmountLimit_gte?: InputMaybe<Scalars['BigInt']>;
  PnLparticipantWithdrawalMinAmountLimit_in?: InputMaybe<
    Array<Scalars['BigInt']>
  >;
  PnLparticipantWithdrawalMinAmountLimit_lt?: InputMaybe<Scalars['BigInt']>;
  PnLparticipantWithdrawalMinAmountLimit_lte?: InputMaybe<Scalars['BigInt']>;
  PnLparticipantWithdrawalMinAmountLimit_not?: InputMaybe<Scalars['BigInt']>;
  PnLparticipantWithdrawalMinAmountLimit_not_in?: InputMaybe<
    Array<Scalars['BigInt']>
  >;
  PnLparticipantWithdrawalPercentageLimit?: InputMaybe<Scalars['BigInt']>;
  PnLparticipantWithdrawalPercentageLimit_gt?: InputMaybe<Scalars['BigInt']>;
  PnLparticipantWithdrawalPercentageLimit_gte?: InputMaybe<Scalars['BigInt']>;
  PnLparticipantWithdrawalPercentageLimit_in?: InputMaybe<
    Array<Scalars['BigInt']>
  >;
  PnLparticipantWithdrawalPercentageLimit_lt?: InputMaybe<Scalars['BigInt']>;
  PnLparticipantWithdrawalPercentageLimit_lte?: InputMaybe<Scalars['BigInt']>;
  PnLparticipantWithdrawalPercentageLimit_not?: InputMaybe<Scalars['BigInt']>;
  PnLparticipantWithdrawalPercentageLimit_not_in?: InputMaybe<
    Array<Scalars['BigInt']>
  >;
  PnLparticipantWithdrawalPeriod?: InputMaybe<Scalars['BigInt']>;
  PnLparticipantWithdrawalPeriod_gt?: InputMaybe<Scalars['BigInt']>;
  PnLparticipantWithdrawalPeriod_gte?: InputMaybe<Scalars['BigInt']>;
  PnLparticipantWithdrawalPeriod_in?: InputMaybe<Array<Scalars['BigInt']>>;
  PnLparticipantWithdrawalPeriod_lt?: InputMaybe<Scalars['BigInt']>;
  PnLparticipantWithdrawalPeriod_lte?: InputMaybe<Scalars['BigInt']>;
  PnLparticipantWithdrawalPeriod_not?: InputMaybe<Scalars['BigInt']>;
  PnLparticipantWithdrawalPeriod_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
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
  poolId?: InputMaybe<Scalars['Int']>;
  poolId_gt?: InputMaybe<Scalars['Int']>;
  poolId_gte?: InputMaybe<Scalars['Int']>;
  poolId_in?: InputMaybe<Array<Scalars['Int']>>;
  poolId_lt?: InputMaybe<Scalars['Int']>;
  poolId_lte?: InputMaybe<Scalars['Int']>;
  poolId_not?: InputMaybe<Scalars['Int']>;
  poolId_not_in?: InputMaybe<Array<Scalars['Int']>>;
};

export enum SetWithdrawalLimit_OrderBy {
  PnLparticipantWithdrawalMinAmountLimit = 'PnLparticipantWithdrawalMinAmountLimit',
  PnLparticipantWithdrawalPercentageLimit = 'PnLparticipantWithdrawalPercentageLimit',
  PnLparticipantWithdrawalPeriod = 'PnLparticipantWithdrawalPeriod',
  Id = 'id',
  PoolId = 'poolId',
}

export type Settle = {
  __typename?: 'Settle';
  amount: Scalars['BigInt'];
  id: Scalars['ID'];
  perpetualId: Scalars['Bytes'];
  trader: Trader;
};

export type Settle_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars['BigInt']>;
  amount_gt?: InputMaybe<Scalars['BigInt']>;
  amount_gte?: InputMaybe<Scalars['BigInt']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']>;
  amount_lte?: InputMaybe<Scalars['BigInt']>;
  amount_not?: InputMaybe<Scalars['BigInt']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  perpetualId?: InputMaybe<Scalars['Bytes']>;
  perpetualId_contains?: InputMaybe<Scalars['Bytes']>;
  perpetualId_in?: InputMaybe<Array<Scalars['Bytes']>>;
  perpetualId_not?: InputMaybe<Scalars['Bytes']>;
  perpetualId_not_contains?: InputMaybe<Scalars['Bytes']>;
  perpetualId_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  trader?: InputMaybe<Scalars['String']>;
  trader_?: InputMaybe<Trader_Filter>;
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
};

export enum Settle_OrderBy {
  Amount = 'amount',
  Id = 'id',
  PerpetualId = 'perpetualId',
  Trader = 'trader',
}

export type SpotOracle = {
  __typename?: 'SpotOracle';
  answerUpdated: Scalars['BigInt'];
  answerUpdatedDecimals: Scalars['Int'];
  answerUpdatedTime: Scalars['Int'];
  baseCurrency: Scalars['String'];
  createdAtTimestamp: Scalars['Int'];
  /**
   * SpotOracle ID is the oracle address
   *
   */
  id: Scalars['ID'];
  perpetuals: Array<Perpetual>;
  priceFeed: Scalars['Bytes'];
  quoteCurrency: Scalars['String'];
  spotPrice: Scalars['BigInt'];
  timePrice: Scalars['Int'];
  updatedAtTimestamp: Scalars['Int'];
};

export type SpotOraclePerpetualsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Perpetual_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Perpetual_Filter>;
};

export type SpotOracle_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  answerUpdated?: InputMaybe<Scalars['BigInt']>;
  answerUpdatedDecimals?: InputMaybe<Scalars['Int']>;
  answerUpdatedDecimals_gt?: InputMaybe<Scalars['Int']>;
  answerUpdatedDecimals_gte?: InputMaybe<Scalars['Int']>;
  answerUpdatedDecimals_in?: InputMaybe<Array<Scalars['Int']>>;
  answerUpdatedDecimals_lt?: InputMaybe<Scalars['Int']>;
  answerUpdatedDecimals_lte?: InputMaybe<Scalars['Int']>;
  answerUpdatedDecimals_not?: InputMaybe<Scalars['Int']>;
  answerUpdatedDecimals_not_in?: InputMaybe<Array<Scalars['Int']>>;
  answerUpdatedTime?: InputMaybe<Scalars['Int']>;
  answerUpdatedTime_gt?: InputMaybe<Scalars['Int']>;
  answerUpdatedTime_gte?: InputMaybe<Scalars['Int']>;
  answerUpdatedTime_in?: InputMaybe<Array<Scalars['Int']>>;
  answerUpdatedTime_lt?: InputMaybe<Scalars['Int']>;
  answerUpdatedTime_lte?: InputMaybe<Scalars['Int']>;
  answerUpdatedTime_not?: InputMaybe<Scalars['Int']>;
  answerUpdatedTime_not_in?: InputMaybe<Array<Scalars['Int']>>;
  answerUpdated_gt?: InputMaybe<Scalars['BigInt']>;
  answerUpdated_gte?: InputMaybe<Scalars['BigInt']>;
  answerUpdated_in?: InputMaybe<Array<Scalars['BigInt']>>;
  answerUpdated_lt?: InputMaybe<Scalars['BigInt']>;
  answerUpdated_lte?: InputMaybe<Scalars['BigInt']>;
  answerUpdated_not?: InputMaybe<Scalars['BigInt']>;
  answerUpdated_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  baseCurrency?: InputMaybe<Scalars['String']>;
  baseCurrency_contains?: InputMaybe<Scalars['String']>;
  baseCurrency_contains_nocase?: InputMaybe<Scalars['String']>;
  baseCurrency_ends_with?: InputMaybe<Scalars['String']>;
  baseCurrency_ends_with_nocase?: InputMaybe<Scalars['String']>;
  baseCurrency_gt?: InputMaybe<Scalars['String']>;
  baseCurrency_gte?: InputMaybe<Scalars['String']>;
  baseCurrency_in?: InputMaybe<Array<Scalars['String']>>;
  baseCurrency_lt?: InputMaybe<Scalars['String']>;
  baseCurrency_lte?: InputMaybe<Scalars['String']>;
  baseCurrency_not?: InputMaybe<Scalars['String']>;
  baseCurrency_not_contains?: InputMaybe<Scalars['String']>;
  baseCurrency_not_contains_nocase?: InputMaybe<Scalars['String']>;
  baseCurrency_not_ends_with?: InputMaybe<Scalars['String']>;
  baseCurrency_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  baseCurrency_not_in?: InputMaybe<Array<Scalars['String']>>;
  baseCurrency_not_starts_with?: InputMaybe<Scalars['String']>;
  baseCurrency_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  baseCurrency_starts_with?: InputMaybe<Scalars['String']>;
  baseCurrency_starts_with_nocase?: InputMaybe<Scalars['String']>;
  createdAtTimestamp?: InputMaybe<Scalars['Int']>;
  createdAtTimestamp_gt?: InputMaybe<Scalars['Int']>;
  createdAtTimestamp_gte?: InputMaybe<Scalars['Int']>;
  createdAtTimestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  createdAtTimestamp_lt?: InputMaybe<Scalars['Int']>;
  createdAtTimestamp_lte?: InputMaybe<Scalars['Int']>;
  createdAtTimestamp_not?: InputMaybe<Scalars['Int']>;
  createdAtTimestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  perpetuals?: InputMaybe<Array<Scalars['String']>>;
  perpetuals_?: InputMaybe<Perpetual_Filter>;
  perpetuals_contains?: InputMaybe<Array<Scalars['String']>>;
  perpetuals_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  perpetuals_not?: InputMaybe<Array<Scalars['String']>>;
  perpetuals_not_contains?: InputMaybe<Array<Scalars['String']>>;
  perpetuals_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  priceFeed?: InputMaybe<Scalars['Bytes']>;
  priceFeed_contains?: InputMaybe<Scalars['Bytes']>;
  priceFeed_in?: InputMaybe<Array<Scalars['Bytes']>>;
  priceFeed_not?: InputMaybe<Scalars['Bytes']>;
  priceFeed_not_contains?: InputMaybe<Scalars['Bytes']>;
  priceFeed_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  quoteCurrency?: InputMaybe<Scalars['String']>;
  quoteCurrency_contains?: InputMaybe<Scalars['String']>;
  quoteCurrency_contains_nocase?: InputMaybe<Scalars['String']>;
  quoteCurrency_ends_with?: InputMaybe<Scalars['String']>;
  quoteCurrency_ends_with_nocase?: InputMaybe<Scalars['String']>;
  quoteCurrency_gt?: InputMaybe<Scalars['String']>;
  quoteCurrency_gte?: InputMaybe<Scalars['String']>;
  quoteCurrency_in?: InputMaybe<Array<Scalars['String']>>;
  quoteCurrency_lt?: InputMaybe<Scalars['String']>;
  quoteCurrency_lte?: InputMaybe<Scalars['String']>;
  quoteCurrency_not?: InputMaybe<Scalars['String']>;
  quoteCurrency_not_contains?: InputMaybe<Scalars['String']>;
  quoteCurrency_not_contains_nocase?: InputMaybe<Scalars['String']>;
  quoteCurrency_not_ends_with?: InputMaybe<Scalars['String']>;
  quoteCurrency_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  quoteCurrency_not_in?: InputMaybe<Array<Scalars['String']>>;
  quoteCurrency_not_starts_with?: InputMaybe<Scalars['String']>;
  quoteCurrency_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  quoteCurrency_starts_with?: InputMaybe<Scalars['String']>;
  quoteCurrency_starts_with_nocase?: InputMaybe<Scalars['String']>;
  spotPrice?: InputMaybe<Scalars['BigInt']>;
  spotPrice_gt?: InputMaybe<Scalars['BigInt']>;
  spotPrice_gte?: InputMaybe<Scalars['BigInt']>;
  spotPrice_in?: InputMaybe<Array<Scalars['BigInt']>>;
  spotPrice_lt?: InputMaybe<Scalars['BigInt']>;
  spotPrice_lte?: InputMaybe<Scalars['BigInt']>;
  spotPrice_not?: InputMaybe<Scalars['BigInt']>;
  spotPrice_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timePrice?: InputMaybe<Scalars['Int']>;
  timePrice_gt?: InputMaybe<Scalars['Int']>;
  timePrice_gte?: InputMaybe<Scalars['Int']>;
  timePrice_in?: InputMaybe<Array<Scalars['Int']>>;
  timePrice_lt?: InputMaybe<Scalars['Int']>;
  timePrice_lte?: InputMaybe<Scalars['Int']>;
  timePrice_not?: InputMaybe<Scalars['Int']>;
  timePrice_not_in?: InputMaybe<Array<Scalars['Int']>>;
  updatedAtTimestamp?: InputMaybe<Scalars['Int']>;
  updatedAtTimestamp_gt?: InputMaybe<Scalars['Int']>;
  updatedAtTimestamp_gte?: InputMaybe<Scalars['Int']>;
  updatedAtTimestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  updatedAtTimestamp_lt?: InputMaybe<Scalars['Int']>;
  updatedAtTimestamp_lte?: InputMaybe<Scalars['Int']>;
  updatedAtTimestamp_not?: InputMaybe<Scalars['Int']>;
  updatedAtTimestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
};

export enum SpotOracle_OrderBy {
  AnswerUpdated = 'answerUpdated',
  AnswerUpdatedDecimals = 'answerUpdatedDecimals',
  AnswerUpdatedTime = 'answerUpdatedTime',
  BaseCurrency = 'baseCurrency',
  CreatedAtTimestamp = 'createdAtTimestamp',
  Id = 'id',
  Perpetuals = 'perpetuals',
  PriceFeed = 'priceFeed',
  QuoteCurrency = 'quoteCurrency',
  SpotPrice = 'spotPrice',
  TimePrice = 'timePrice',
  UpdatedAtTimestamp = 'updatedAtTimestamp',
}

export type Subscription = {
  __typename?: 'Subscription';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  addAmmGovernanceAddress?: Maybe<AddAmmGovernanceAddress>;
  addAmmGovernanceAddresses: Array<AddAmmGovernanceAddress>;
  answerUpdated?: Maybe<AnswerUpdated>;
  answerUpdateds: Array<AnswerUpdated>;
  atomicYield?: Maybe<AtomicYield>;
  atomicYields: Array<AtomicYield>;
  candleSticksDay?: Maybe<CandleSticksDay>;
  candleSticksDays: Array<CandleSticksDay>;
  candleSticksFifteenMinute?: Maybe<CandleSticksFifteenMinute>;
  candleSticksFifteenMinutes: Array<CandleSticksFifteenMinute>;
  candleSticksFourHour?: Maybe<CandleSticksFourHour>;
  candleSticksFourHours: Array<CandleSticksFourHour>;
  candleSticksHour?: Maybe<CandleSticksHour>;
  candleSticksHours: Array<CandleSticksHour>;
  candleSticksMinute?: Maybe<CandleSticksMinute>;
  candleSticksMinutes: Array<CandleSticksMinute>;
  clear?: Maybe<Clear>;
  clears: Array<Clear>;
  distributeFee?: Maybe<DistributeFee>;
  distributeFees: Array<DistributeFee>;
  fund?: Maybe<Fund>;
  fundingPayment?: Maybe<FundingPayment>;
  fundingPayments: Array<FundingPayment>;
  fundingRate?: Maybe<FundingRate>;
  fundingRates: Array<FundingRate>;
  funds: Array<Fund>;
  implementationChanged?: Maybe<ImplementationChanged>;
  implementationChangeds: Array<ImplementationChanged>;
  limitOrder?: Maybe<LimitOrder>;
  limitOrders: Array<LimitOrder>;
  liquidate?: Maybe<Liquidate>;
  liquidates: Array<Liquidate>;
  liquidityAdded?: Maybe<LiquidityAdded>;
  liquidityAddeds: Array<LiquidityAdded>;
  liquidityPool?: Maybe<LiquidityPool>;
  liquidityPoolCreated?: Maybe<LiquidityPoolCreated>;
  liquidityPoolCreateds: Array<LiquidityPoolCreated>;
  liquidityPools: Array<LiquidityPool>;
  liquidityRemoved?: Maybe<LiquidityRemoved>;
  liquidityRemoveds: Array<LiquidityRemoved>;
  ownershipTransferred?: Maybe<OwnershipTransferred>;
  ownershipTransferreds: Array<OwnershipTransferred>;
  perpetual?: Maybe<Perpetual>;
  perpetualCreated?: Maybe<PerpetualCreated>;
  perpetualCreateds: Array<PerpetualCreated>;
  perpetualLimitOrderBookDeployed?: Maybe<PerpetualLimitOrderBookDeployed>;
  perpetualLimitOrderBookDeployeds: Array<PerpetualLimitOrderBookDeployed>;
  perpetualLimitOrderCancelled?: Maybe<PerpetualLimitOrderCancelled>;
  perpetualLimitOrderCancelleds: Array<PerpetualLimitOrderCancelled>;
  perpetualLimitOrderCreated?: Maybe<PerpetualLimitOrderCreated>;
  perpetualLimitOrderCreateds: Array<PerpetualLimitOrderCreated>;
  perpetuals: Array<Perpetual>;
  position?: Maybe<Position>;
  positions: Array<Position>;
  proxyOwnershipTransferred?: Maybe<ProxyOwnershipTransferred>;
  proxyOwnershipTransferreds: Array<ProxyOwnershipTransferred>;
  realizedPnL?: Maybe<RealizedPnL>;
  realizedPnLs: Array<RealizedPnL>;
  removeAmmGovernanceAddress?: Maybe<RemoveAmmGovernanceAddress>;
  removeAmmGovernanceAddresses: Array<RemoveAmmGovernanceAddress>;
  runLiquidityPool?: Maybe<RunLiquidityPool>;
  runLiquidityPools: Array<RunLiquidityPool>;
  setClearedState?: Maybe<SetClearedState>;
  setClearedStates: Array<SetClearedState>;
  setEmergencyState?: Maybe<SetEmergencyState>;
  setEmergencyStates: Array<SetEmergencyState>;
  setNormalState?: Maybe<SetNormalState>;
  setNormalStates: Array<SetNormalState>;
  setOracles: Array<SetOracles>;
  setParameter?: Maybe<SetParameter>;
  setParameterPair?: Maybe<SetParameterPair>;
  setParameterPairs: Array<SetParameterPair>;
  setParameters: Array<SetParameter>;
  setPerpetualBaseParameters: Array<SetPerpetualBaseParameters>;
  setPerpetualRiskParameters: Array<SetPerpetualRiskParameters>;
  setTargetPoolSizeUpdateTime?: Maybe<SetTargetPoolSizeUpdateTime>;
  setTargetPoolSizeUpdateTimes: Array<SetTargetPoolSizeUpdateTime>;
  setWithdrawalLimit?: Maybe<SetWithdrawalLimit>;
  setWithdrawalLimits: Array<SetWithdrawalLimit>;
  settle?: Maybe<Settle>;
  settles: Array<Settle>;
  spotOracle?: Maybe<SpotOracle>;
  spotOracles: Array<SpotOracle>;
  token?: Maybe<Token>;
  tokens: Array<Token>;
  tokensDeposited?: Maybe<TokensDeposited>;
  tokensDepositeds: Array<TokensDeposited>;
  tokensWithdrawn?: Maybe<TokensWithdrawn>;
  tokensWithdrawns: Array<TokensWithdrawn>;
  trade?: Maybe<Trade>;
  trader?: Maybe<Trader>;
  traderPool?: Maybe<TraderPool>;
  traderPools: Array<TraderPool>;
  traderState?: Maybe<TraderState>;
  traderStates: Array<TraderState>;
  traders: Array<Trader>;
  trades: Array<Trade>;
  transaction?: Maybe<Transaction>;
  transactions: Array<Transaction>;
  transferEarningsToTreasuries: Array<TransferEarningsToTreasury>;
  transferEarningsToTreasury?: Maybe<TransferEarningsToTreasury>;
  transferFeeToReferrer?: Maybe<TransferFeeToReferrer>;
  transferFeeToReferrers: Array<TransferFeeToReferrer>;
  transferTreasuryTo?: Maybe<TransferTreasuryTo>;
  transferTreasuryTos: Array<TransferTreasuryTo>;
  updateAMMFundCash?: Maybe<UpdateAmmFundCash>;
  updateAMMFundCashes: Array<UpdateAmmFundCash>;
  updateAMMFundTargetSize?: Maybe<UpdateAmmFundTargetSize>;
  updateAMMFundTargetSizes: Array<UpdateAmmFundTargetSize>;
  updateDefaultFundCash?: Maybe<UpdateDefaultFundCash>;
  updateDefaultFundCashes: Array<UpdateDefaultFundCash>;
  updateDefaultFundTargetSize?: Maybe<UpdateDefaultFundTargetSize>;
  updateDefaultFundTargetSizes: Array<UpdateDefaultFundTargetSize>;
  updateFundingRate?: Maybe<UpdateFundingRate>;
  updateFundingRates: Array<UpdateFundingRate>;
  updateMarginAccount?: Maybe<UpdateMarginAccount>;
  updateMarginAccounts: Array<UpdateMarginAccount>;
  updateMarkPrice?: Maybe<UpdateMarkPrice>;
  updateMarkPrices: Array<UpdateMarkPrice>;
  updateParticipationFundCash?: Maybe<UpdateParticipationFundCash>;
  updateParticipationFundCashes: Array<UpdateParticipationFundCash>;
  updatePrice?: Maybe<UpdatePrice>;
  updatePrices: Array<UpdatePrice>;
  updateReprTradeSizes: Array<UpdateReprTradeSizes>;
  updateUnitAccumulatedFunding?: Maybe<UpdateUnitAccumulatedFunding>;
  updateUnitAccumulatedFundings: Array<UpdateUnitAccumulatedFunding>;
};

export type Subscription_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};

export type SubscriptionAddAmmGovernanceAddressArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionAddAmmGovernanceAddressesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<AddAmmGovernanceAddress_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<AddAmmGovernanceAddress_Filter>;
};

export type SubscriptionAnswerUpdatedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionAnswerUpdatedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<AnswerUpdated_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<AnswerUpdated_Filter>;
};

export type SubscriptionAtomicYieldArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionAtomicYieldsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<AtomicYield_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<AtomicYield_Filter>;
};

export type SubscriptionCandleSticksDayArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionCandleSticksDaysArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<CandleSticksDay_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<CandleSticksDay_Filter>;
};

export type SubscriptionCandleSticksFifteenMinuteArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionCandleSticksFifteenMinutesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<CandleSticksFifteenMinute_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<CandleSticksFifteenMinute_Filter>;
};

export type SubscriptionCandleSticksFourHourArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionCandleSticksFourHoursArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<CandleSticksFourHour_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<CandleSticksFourHour_Filter>;
};

export type SubscriptionCandleSticksHourArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionCandleSticksHoursArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<CandleSticksHour_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<CandleSticksHour_Filter>;
};

export type SubscriptionCandleSticksMinuteArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionCandleSticksMinutesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<CandleSticksMinute_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<CandleSticksMinute_Filter>;
};

export type SubscriptionClearArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionClearsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Clear_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Clear_Filter>;
};

export type SubscriptionDistributeFeeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionDistributeFeesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<DistributeFee_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<DistributeFee_Filter>;
};

export type SubscriptionFundArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionFundingPaymentArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionFundingPaymentsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<FundingPayment_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<FundingPayment_Filter>;
};

export type SubscriptionFundingRateArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionFundingRatesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<FundingRate_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<FundingRate_Filter>;
};

export type SubscriptionFundsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Fund_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Fund_Filter>;
};

export type SubscriptionImplementationChangedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionImplementationChangedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ImplementationChanged_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ImplementationChanged_Filter>;
};

export type SubscriptionLimitOrderArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionLimitOrdersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<LimitOrder_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<LimitOrder_Filter>;
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

export type SubscriptionLiquidityAddedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionLiquidityAddedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<LiquidityAdded_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<LiquidityAdded_Filter>;
};

export type SubscriptionLiquidityPoolArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionLiquidityPoolCreatedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionLiquidityPoolCreatedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<LiquidityPoolCreated_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<LiquidityPoolCreated_Filter>;
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

export type SubscriptionLiquidityRemovedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionLiquidityRemovedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<LiquidityRemoved_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<LiquidityRemoved_Filter>;
};

export type SubscriptionOwnershipTransferredArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionOwnershipTransferredsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<OwnershipTransferred_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<OwnershipTransferred_Filter>;
};

export type SubscriptionPerpetualArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionPerpetualCreatedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionPerpetualCreatedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<PerpetualCreated_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PerpetualCreated_Filter>;
};

export type SubscriptionPerpetualLimitOrderBookDeployedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionPerpetualLimitOrderBookDeployedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<PerpetualLimitOrderBookDeployed_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PerpetualLimitOrderBookDeployed_Filter>;
};

export type SubscriptionPerpetualLimitOrderCancelledArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionPerpetualLimitOrderCancelledsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<PerpetualLimitOrderCancelled_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PerpetualLimitOrderCancelled_Filter>;
};

export type SubscriptionPerpetualLimitOrderCreatedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionPerpetualLimitOrderCreatedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<PerpetualLimitOrderCreated_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PerpetualLimitOrderCreated_Filter>;
};

export type SubscriptionPerpetualsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Perpetual_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Perpetual_Filter>;
};

export type SubscriptionPositionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionPositionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Position_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Position_Filter>;
};

export type SubscriptionProxyOwnershipTransferredArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionProxyOwnershipTransferredsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ProxyOwnershipTransferred_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ProxyOwnershipTransferred_Filter>;
};

export type SubscriptionRealizedPnLArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionRealizedPnLsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<RealizedPnL_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<RealizedPnL_Filter>;
};

export type SubscriptionRemoveAmmGovernanceAddressArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionRemoveAmmGovernanceAddressesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<RemoveAmmGovernanceAddress_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<RemoveAmmGovernanceAddress_Filter>;
};

export type SubscriptionRunLiquidityPoolArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionRunLiquidityPoolsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<RunLiquidityPool_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<RunLiquidityPool_Filter>;
};

export type SubscriptionSetClearedStateArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionSetClearedStatesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<SetClearedState_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<SetClearedState_Filter>;
};

export type SubscriptionSetEmergencyStateArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionSetEmergencyStatesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<SetEmergencyState_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<SetEmergencyState_Filter>;
};

export type SubscriptionSetNormalStateArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionSetNormalStatesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<SetNormalState_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<SetNormalState_Filter>;
};

export type SubscriptionSetOraclesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<SetOracles_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<SetOracles_Filter>;
};

export type SubscriptionSetParameterArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionSetParameterPairArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionSetParameterPairsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<SetParameterPair_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<SetParameterPair_Filter>;
};

export type SubscriptionSetParametersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<SetParameter_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<SetParameter_Filter>;
};

export type SubscriptionSetPerpetualBaseParametersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<SetPerpetualBaseParameters_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<SetPerpetualBaseParameters_Filter>;
};

export type SubscriptionSetPerpetualRiskParametersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<SetPerpetualRiskParameters_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<SetPerpetualRiskParameters_Filter>;
};

export type SubscriptionSetTargetPoolSizeUpdateTimeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionSetTargetPoolSizeUpdateTimesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<SetTargetPoolSizeUpdateTime_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<SetTargetPoolSizeUpdateTime_Filter>;
};

export type SubscriptionSetWithdrawalLimitArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionSetWithdrawalLimitsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<SetWithdrawalLimit_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<SetWithdrawalLimit_Filter>;
};

export type SubscriptionSettleArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionSettlesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Settle_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Settle_Filter>;
};

export type SubscriptionSpotOracleArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionSpotOraclesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<SpotOracle_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<SpotOracle_Filter>;
};

export type SubscriptionTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
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

export type SubscriptionTokensDepositedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionTokensDepositedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TokensDeposited_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TokensDeposited_Filter>;
};

export type SubscriptionTokensWithdrawnArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionTokensWithdrawnsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TokensWithdrawn_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TokensWithdrawn_Filter>;
};

export type SubscriptionTradeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionTraderArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionTraderPoolArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionTraderPoolsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TraderPool_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TraderPool_Filter>;
};

export type SubscriptionTraderStateArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionTraderStatesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TraderState_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TraderState_Filter>;
};

export type SubscriptionTradersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Trader_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Trader_Filter>;
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

export type SubscriptionTransferEarningsToTreasuriesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TransferEarningsToTreasury_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TransferEarningsToTreasury_Filter>;
};

export type SubscriptionTransferEarningsToTreasuryArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionTransferFeeToReferrerArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionTransferFeeToReferrersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TransferFeeToReferrer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TransferFeeToReferrer_Filter>;
};

export type SubscriptionTransferTreasuryToArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionTransferTreasuryTosArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TransferTreasuryTo_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TransferTreasuryTo_Filter>;
};

export type SubscriptionUpdateAmmFundCashArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionUpdateAmmFundCashesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UpdateAmmFundCash_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<UpdateAmmFundCash_Filter>;
};

export type SubscriptionUpdateAmmFundTargetSizeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionUpdateAmmFundTargetSizesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UpdateAmmFundTargetSize_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<UpdateAmmFundTargetSize_Filter>;
};

export type SubscriptionUpdateDefaultFundCashArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionUpdateDefaultFundCashesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UpdateDefaultFundCash_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<UpdateDefaultFundCash_Filter>;
};

export type SubscriptionUpdateDefaultFundTargetSizeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionUpdateDefaultFundTargetSizesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UpdateDefaultFundTargetSize_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<UpdateDefaultFundTargetSize_Filter>;
};

export type SubscriptionUpdateFundingRateArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionUpdateFundingRatesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UpdateFundingRate_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<UpdateFundingRate_Filter>;
};

export type SubscriptionUpdateMarginAccountArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionUpdateMarginAccountsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UpdateMarginAccount_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<UpdateMarginAccount_Filter>;
};

export type SubscriptionUpdateMarkPriceArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionUpdateMarkPricesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UpdateMarkPrice_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<UpdateMarkPrice_Filter>;
};

export type SubscriptionUpdateParticipationFundCashArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionUpdateParticipationFundCashesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UpdateParticipationFundCash_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<UpdateParticipationFundCash_Filter>;
};

export type SubscriptionUpdatePriceArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionUpdatePricesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UpdatePrice_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<UpdatePrice_Filter>;
};

export type SubscriptionUpdateReprTradeSizesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UpdateReprTradeSizes_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<UpdateReprTradeSizes_Filter>;
};

export type SubscriptionUpdateUnitAccumulatedFundingArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionUpdateUnitAccumulatedFundingsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UpdateUnitAccumulatedFunding_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<UpdateUnitAccumulatedFunding_Filter>;
};

export type Token = {
  __typename?: 'Token';
  decimals: Scalars['Int'];
  id: Scalars['ID'];
  name: Scalars['String'];
  symbol: Scalars['String'];
  totalSupply: Scalars['BigInt'];
};

export type Token_Filter = {
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
  totalSupply?: InputMaybe<Scalars['BigInt']>;
  totalSupply_gt?: InputMaybe<Scalars['BigInt']>;
  totalSupply_gte?: InputMaybe<Scalars['BigInt']>;
  totalSupply_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalSupply_lt?: InputMaybe<Scalars['BigInt']>;
  totalSupply_lte?: InputMaybe<Scalars['BigInt']>;
  totalSupply_not?: InputMaybe<Scalars['BigInt']>;
  totalSupply_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export enum Token_OrderBy {
  Decimals = 'decimals',
  Id = 'id',
  Name = 'name',
  Symbol = 'symbol',
  TotalSupply = 'totalSupply',
}

export type TokensDeposited = {
  __typename?: 'TokensDeposited';
  amount: Scalars['BigInt'];
  blockTimestamp: Scalars['BigInt'];
  id: Scalars['ID'];
  perpetualId: Scalars['Bytes'];
  trader: Trader;
  transaction: Transaction;
};

export type TokensDeposited_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars['BigInt']>;
  amount_gt?: InputMaybe<Scalars['BigInt']>;
  amount_gte?: InputMaybe<Scalars['BigInt']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']>;
  amount_lte?: InputMaybe<Scalars['BigInt']>;
  amount_not?: InputMaybe<Scalars['BigInt']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  perpetualId?: InputMaybe<Scalars['Bytes']>;
  perpetualId_contains?: InputMaybe<Scalars['Bytes']>;
  perpetualId_in?: InputMaybe<Array<Scalars['Bytes']>>;
  perpetualId_not?: InputMaybe<Scalars['Bytes']>;
  perpetualId_not_contains?: InputMaybe<Scalars['Bytes']>;
  perpetualId_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  trader?: InputMaybe<Scalars['String']>;
  trader_?: InputMaybe<Trader_Filter>;
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

export enum TokensDeposited_OrderBy {
  Amount = 'amount',
  BlockTimestamp = 'blockTimestamp',
  Id = 'id',
  PerpetualId = 'perpetualId',
  Trader = 'trader',
  Transaction = 'transaction',
}

export type TokensWithdrawn = {
  __typename?: 'TokensWithdrawn';
  amount: Scalars['BigInt'];
  blockTimestamp: Scalars['BigInt'];
  id: Scalars['ID'];
  perpetualId: Scalars['Bytes'];
  trader: Trader;
  transaction: Transaction;
};

export type TokensWithdrawn_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars['BigInt']>;
  amount_gt?: InputMaybe<Scalars['BigInt']>;
  amount_gte?: InputMaybe<Scalars['BigInt']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']>;
  amount_lte?: InputMaybe<Scalars['BigInt']>;
  amount_not?: InputMaybe<Scalars['BigInt']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  perpetualId?: InputMaybe<Scalars['Bytes']>;
  perpetualId_contains?: InputMaybe<Scalars['Bytes']>;
  perpetualId_in?: InputMaybe<Array<Scalars['Bytes']>>;
  perpetualId_not?: InputMaybe<Scalars['Bytes']>;
  perpetualId_not_contains?: InputMaybe<Scalars['Bytes']>;
  perpetualId_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  trader?: InputMaybe<Scalars['String']>;
  trader_?: InputMaybe<Trader_Filter>;
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

export enum TokensWithdrawn_OrderBy {
  Amount = 'amount',
  BlockTimestamp = 'blockTimestamp',
  Id = 'id',
  PerpetualId = 'perpetualId',
  Trader = 'trader',
  Transaction = 'transaction',
}

export type Trade = {
  __typename?: 'Trade';
  blockTimestamp: Scalars['BigInt'];
  id: Scalars['ID'];
  isClose: Scalars['Boolean'];
  limitPrice: Scalars['BigInt'];
  newPositionSizeBC: Scalars['BigInt'];
  orderDigest: Scalars['Bytes'];
  orderFlags: Scalars['BigInt'];
  perpetual: Perpetual;
  position: Position;
  price: Scalars['BigInt'];
  tradeAmountBC: Scalars['BigInt'];
  trader: Trader;
  traderState: TraderState;
  transaction: Transaction;
};

export type Trade_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  isClose?: InputMaybe<Scalars['Boolean']>;
  isClose_in?: InputMaybe<Array<Scalars['Boolean']>>;
  isClose_not?: InputMaybe<Scalars['Boolean']>;
  isClose_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  limitPrice?: InputMaybe<Scalars['BigInt']>;
  limitPrice_gt?: InputMaybe<Scalars['BigInt']>;
  limitPrice_gte?: InputMaybe<Scalars['BigInt']>;
  limitPrice_in?: InputMaybe<Array<Scalars['BigInt']>>;
  limitPrice_lt?: InputMaybe<Scalars['BigInt']>;
  limitPrice_lte?: InputMaybe<Scalars['BigInt']>;
  limitPrice_not?: InputMaybe<Scalars['BigInt']>;
  limitPrice_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  newPositionSizeBC?: InputMaybe<Scalars['BigInt']>;
  newPositionSizeBC_gt?: InputMaybe<Scalars['BigInt']>;
  newPositionSizeBC_gte?: InputMaybe<Scalars['BigInt']>;
  newPositionSizeBC_in?: InputMaybe<Array<Scalars['BigInt']>>;
  newPositionSizeBC_lt?: InputMaybe<Scalars['BigInt']>;
  newPositionSizeBC_lte?: InputMaybe<Scalars['BigInt']>;
  newPositionSizeBC_not?: InputMaybe<Scalars['BigInt']>;
  newPositionSizeBC_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  orderDigest?: InputMaybe<Scalars['Bytes']>;
  orderDigest_contains?: InputMaybe<Scalars['Bytes']>;
  orderDigest_in?: InputMaybe<Array<Scalars['Bytes']>>;
  orderDigest_not?: InputMaybe<Scalars['Bytes']>;
  orderDigest_not_contains?: InputMaybe<Scalars['Bytes']>;
  orderDigest_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  orderFlags?: InputMaybe<Scalars['BigInt']>;
  orderFlags_gt?: InputMaybe<Scalars['BigInt']>;
  orderFlags_gte?: InputMaybe<Scalars['BigInt']>;
  orderFlags_in?: InputMaybe<Array<Scalars['BigInt']>>;
  orderFlags_lt?: InputMaybe<Scalars['BigInt']>;
  orderFlags_lte?: InputMaybe<Scalars['BigInt']>;
  orderFlags_not?: InputMaybe<Scalars['BigInt']>;
  orderFlags_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  perpetual?: InputMaybe<Scalars['String']>;
  perpetual_?: InputMaybe<Perpetual_Filter>;
  perpetual_contains?: InputMaybe<Scalars['String']>;
  perpetual_contains_nocase?: InputMaybe<Scalars['String']>;
  perpetual_ends_with?: InputMaybe<Scalars['String']>;
  perpetual_ends_with_nocase?: InputMaybe<Scalars['String']>;
  perpetual_gt?: InputMaybe<Scalars['String']>;
  perpetual_gte?: InputMaybe<Scalars['String']>;
  perpetual_in?: InputMaybe<Array<Scalars['String']>>;
  perpetual_lt?: InputMaybe<Scalars['String']>;
  perpetual_lte?: InputMaybe<Scalars['String']>;
  perpetual_not?: InputMaybe<Scalars['String']>;
  perpetual_not_contains?: InputMaybe<Scalars['String']>;
  perpetual_not_contains_nocase?: InputMaybe<Scalars['String']>;
  perpetual_not_ends_with?: InputMaybe<Scalars['String']>;
  perpetual_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  perpetual_not_in?: InputMaybe<Array<Scalars['String']>>;
  perpetual_not_starts_with?: InputMaybe<Scalars['String']>;
  perpetual_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  perpetual_starts_with?: InputMaybe<Scalars['String']>;
  perpetual_starts_with_nocase?: InputMaybe<Scalars['String']>;
  position?: InputMaybe<Scalars['String']>;
  position_?: InputMaybe<Position_Filter>;
  position_contains?: InputMaybe<Scalars['String']>;
  position_contains_nocase?: InputMaybe<Scalars['String']>;
  position_ends_with?: InputMaybe<Scalars['String']>;
  position_ends_with_nocase?: InputMaybe<Scalars['String']>;
  position_gt?: InputMaybe<Scalars['String']>;
  position_gte?: InputMaybe<Scalars['String']>;
  position_in?: InputMaybe<Array<Scalars['String']>>;
  position_lt?: InputMaybe<Scalars['String']>;
  position_lte?: InputMaybe<Scalars['String']>;
  position_not?: InputMaybe<Scalars['String']>;
  position_not_contains?: InputMaybe<Scalars['String']>;
  position_not_contains_nocase?: InputMaybe<Scalars['String']>;
  position_not_ends_with?: InputMaybe<Scalars['String']>;
  position_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  position_not_in?: InputMaybe<Array<Scalars['String']>>;
  position_not_starts_with?: InputMaybe<Scalars['String']>;
  position_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  position_starts_with?: InputMaybe<Scalars['String']>;
  position_starts_with_nocase?: InputMaybe<Scalars['String']>;
  price?: InputMaybe<Scalars['BigInt']>;
  price_gt?: InputMaybe<Scalars['BigInt']>;
  price_gte?: InputMaybe<Scalars['BigInt']>;
  price_in?: InputMaybe<Array<Scalars['BigInt']>>;
  price_lt?: InputMaybe<Scalars['BigInt']>;
  price_lte?: InputMaybe<Scalars['BigInt']>;
  price_not?: InputMaybe<Scalars['BigInt']>;
  price_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  tradeAmountBC?: InputMaybe<Scalars['BigInt']>;
  tradeAmountBC_gt?: InputMaybe<Scalars['BigInt']>;
  tradeAmountBC_gte?: InputMaybe<Scalars['BigInt']>;
  tradeAmountBC_in?: InputMaybe<Array<Scalars['BigInt']>>;
  tradeAmountBC_lt?: InputMaybe<Scalars['BigInt']>;
  tradeAmountBC_lte?: InputMaybe<Scalars['BigInt']>;
  tradeAmountBC_not?: InputMaybe<Scalars['BigInt']>;
  tradeAmountBC_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  trader?: InputMaybe<Scalars['String']>;
  traderState?: InputMaybe<Scalars['String']>;
  traderState_?: InputMaybe<TraderState_Filter>;
  traderState_contains?: InputMaybe<Scalars['String']>;
  traderState_contains_nocase?: InputMaybe<Scalars['String']>;
  traderState_ends_with?: InputMaybe<Scalars['String']>;
  traderState_ends_with_nocase?: InputMaybe<Scalars['String']>;
  traderState_gt?: InputMaybe<Scalars['String']>;
  traderState_gte?: InputMaybe<Scalars['String']>;
  traderState_in?: InputMaybe<Array<Scalars['String']>>;
  traderState_lt?: InputMaybe<Scalars['String']>;
  traderState_lte?: InputMaybe<Scalars['String']>;
  traderState_not?: InputMaybe<Scalars['String']>;
  traderState_not_contains?: InputMaybe<Scalars['String']>;
  traderState_not_contains_nocase?: InputMaybe<Scalars['String']>;
  traderState_not_ends_with?: InputMaybe<Scalars['String']>;
  traderState_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  traderState_not_in?: InputMaybe<Array<Scalars['String']>>;
  traderState_not_starts_with?: InputMaybe<Scalars['String']>;
  traderState_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  traderState_starts_with?: InputMaybe<Scalars['String']>;
  traderState_starts_with_nocase?: InputMaybe<Scalars['String']>;
  trader_?: InputMaybe<Trader_Filter>;
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

export enum Trade_OrderBy {
  BlockTimestamp = 'blockTimestamp',
  Id = 'id',
  IsClose = 'isClose',
  LimitPrice = 'limitPrice',
  NewPositionSizeBc = 'newPositionSizeBC',
  OrderDigest = 'orderDigest',
  OrderFlags = 'orderFlags',
  Perpetual = 'perpetual',
  Position = 'position',
  Price = 'price',
  TradeAmountBc = 'tradeAmountBC',
  Trader = 'trader',
  TraderState = 'traderState',
  Transaction = 'transaction',
}

export type Trader = {
  __typename?: 'Trader';
  distributeFees?: Maybe<Array<DistributeFee>>;
  fundingPayments?: Maybe<Array<FundingPayment>>;
  fundingRates?: Maybe<Array<FundingRate>>;
  fundingRatesTotalCount?: Maybe<Scalars['Int']>;
  id: Scalars['ID'];
  limitOrders?: Maybe<Array<LimitOrder>>;
  liquidates?: Maybe<Array<Liquidate>>;
  liquidator?: Maybe<Array<Liquidate>>;
  liquidityAdded?: Maybe<Array<LiquidityAdded>>;
  liquidityRemoved?: Maybe<Array<LiquidityRemoved>>;
  positions?: Maybe<Array<Position>>;
  positionsTotalCount?: Maybe<Scalars['Int']>;
  realizedPnLs?: Maybe<Array<RealizedPnL>>;
  settles?: Maybe<Array<Settle>>;
  tokensDeposits?: Maybe<Array<TokensDeposited>>;
  tokensWithdraws?: Maybe<Array<TokensWithdrawn>>;
  totalFundingPaymentCC: Scalars['BigInt'];
  traderPool?: Maybe<Array<TraderPool>>;
  traderStates?: Maybe<Array<TraderState>>;
  trades?: Maybe<Array<Trade>>;
  tradesTotalCount?: Maybe<Scalars['Int']>;
  updateMarginAccount?: Maybe<Array<UpdateMarginAccount>>;
};

export type TraderDistributeFeesArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<DistributeFee_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<DistributeFee_Filter>;
};

export type TraderFundingPaymentsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<FundingPayment_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<FundingPayment_Filter>;
};

export type TraderFundingRatesArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<FundingRate_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<FundingRate_Filter>;
};

export type TraderLimitOrdersArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<LimitOrder_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<LimitOrder_Filter>;
};

export type TraderLiquidatesArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Liquidate_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Liquidate_Filter>;
};

export type TraderLiquidatorArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Liquidate_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Liquidate_Filter>;
};

export type TraderLiquidityAddedArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<LiquidityAdded_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<LiquidityAdded_Filter>;
};

export type TraderLiquidityRemovedArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<LiquidityRemoved_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<LiquidityRemoved_Filter>;
};

export type TraderPositionsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Position_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Position_Filter>;
};

export type TraderRealizedPnLsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<RealizedPnL_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<RealizedPnL_Filter>;
};

export type TraderSettlesArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Settle_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Settle_Filter>;
};

export type TraderTokensDepositsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TokensDeposited_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<TokensDeposited_Filter>;
};

export type TraderTokensWithdrawsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TokensWithdrawn_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<TokensWithdrawn_Filter>;
};

export type TraderTraderPoolArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TraderPool_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<TraderPool_Filter>;
};

export type TraderTraderStatesArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TraderState_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<TraderState_Filter>;
};

export type TraderTradesArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Trade_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Trade_Filter>;
};

export type TraderUpdateMarginAccountArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UpdateMarginAccount_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<UpdateMarginAccount_Filter>;
};

export type TraderPool = {
  __typename?: 'TraderPool';
  id: Scalars['ID'];
  liquidityPool: LiquidityPool;
  totalLiquidityAddedAmountCC: Scalars['BigInt'];
  totalShareAddedAmountCC: Scalars['BigInt'];
  trader: Trader;
};

export type TraderPool_Filter = {
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
  totalLiquidityAddedAmountCC?: InputMaybe<Scalars['BigInt']>;
  totalLiquidityAddedAmountCC_gt?: InputMaybe<Scalars['BigInt']>;
  totalLiquidityAddedAmountCC_gte?: InputMaybe<Scalars['BigInt']>;
  totalLiquidityAddedAmountCC_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalLiquidityAddedAmountCC_lt?: InputMaybe<Scalars['BigInt']>;
  totalLiquidityAddedAmountCC_lte?: InputMaybe<Scalars['BigInt']>;
  totalLiquidityAddedAmountCC_not?: InputMaybe<Scalars['BigInt']>;
  totalLiquidityAddedAmountCC_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalShareAddedAmountCC?: InputMaybe<Scalars['BigInt']>;
  totalShareAddedAmountCC_gt?: InputMaybe<Scalars['BigInt']>;
  totalShareAddedAmountCC_gte?: InputMaybe<Scalars['BigInt']>;
  totalShareAddedAmountCC_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalShareAddedAmountCC_lt?: InputMaybe<Scalars['BigInt']>;
  totalShareAddedAmountCC_lte?: InputMaybe<Scalars['BigInt']>;
  totalShareAddedAmountCC_not?: InputMaybe<Scalars['BigInt']>;
  totalShareAddedAmountCC_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  trader?: InputMaybe<Scalars['String']>;
  trader_?: InputMaybe<Trader_Filter>;
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
};

export enum TraderPool_OrderBy {
  Id = 'id',
  LiquidityPool = 'liquidityPool',
  TotalLiquidityAddedAmountCc = 'totalLiquidityAddedAmountCC',
  TotalShareAddedAmountCc = 'totalShareAddedAmountCC',
  Trader = 'trader',
}

export type TraderState = {
  __typename?: 'TraderState';
  amountSettled: Scalars['BigInt'];
  availableCashCC: Scalars['BigInt'];
  availableMarginCC: Scalars['BigInt'];
  balance: Scalars['BigInt'];
  blockTimestamp: Scalars['BigInt'];
  capitalUsed: Scalars['BigInt'];
  fUnitAccumulatedFundingStart: Scalars['BigInt'];
  fundingRatesTotalCount: Scalars['Int'];
  id: Scalars['ID'];
  liquidatorTotalAmount: Scalars['BigInt'];
  marginAccountCashCC: Scalars['BigInt'];
  marginAccountLockedInValueQC: Scalars['BigInt'];
  marginAccountPositionBC: Scalars['BigInt'];
  marginBalanceCC: Scalars['BigInt'];
  perpetual: Perpetual;
  positions: Array<Position>;
  positionsTotalCount: Scalars['Int'];
  state: Scalars['String'];
  totalAmountLiquidated: Scalars['BigInt'];
  totalAmountTraded: Scalars['BigInt'];
  totalFees: Scalars['BigInt'];
  totalPnLCC: Scalars['BigInt'];
  trader: Trader;
  trades?: Maybe<Array<Trade>>;
  tradesTotalCount: Scalars['Int'];
};

export type TraderStatePositionsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Position_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Position_Filter>;
};

export type TraderStateTradesArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Trade_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Trade_Filter>;
};

export type TraderState_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amountSettled?: InputMaybe<Scalars['BigInt']>;
  amountSettled_gt?: InputMaybe<Scalars['BigInt']>;
  amountSettled_gte?: InputMaybe<Scalars['BigInt']>;
  amountSettled_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amountSettled_lt?: InputMaybe<Scalars['BigInt']>;
  amountSettled_lte?: InputMaybe<Scalars['BigInt']>;
  amountSettled_not?: InputMaybe<Scalars['BigInt']>;
  amountSettled_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  availableCashCC?: InputMaybe<Scalars['BigInt']>;
  availableCashCC_gt?: InputMaybe<Scalars['BigInt']>;
  availableCashCC_gte?: InputMaybe<Scalars['BigInt']>;
  availableCashCC_in?: InputMaybe<Array<Scalars['BigInt']>>;
  availableCashCC_lt?: InputMaybe<Scalars['BigInt']>;
  availableCashCC_lte?: InputMaybe<Scalars['BigInt']>;
  availableCashCC_not?: InputMaybe<Scalars['BigInt']>;
  availableCashCC_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  availableMarginCC?: InputMaybe<Scalars['BigInt']>;
  availableMarginCC_gt?: InputMaybe<Scalars['BigInt']>;
  availableMarginCC_gte?: InputMaybe<Scalars['BigInt']>;
  availableMarginCC_in?: InputMaybe<Array<Scalars['BigInt']>>;
  availableMarginCC_lt?: InputMaybe<Scalars['BigInt']>;
  availableMarginCC_lte?: InputMaybe<Scalars['BigInt']>;
  availableMarginCC_not?: InputMaybe<Scalars['BigInt']>;
  availableMarginCC_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  balance?: InputMaybe<Scalars['BigInt']>;
  balance_gt?: InputMaybe<Scalars['BigInt']>;
  balance_gte?: InputMaybe<Scalars['BigInt']>;
  balance_in?: InputMaybe<Array<Scalars['BigInt']>>;
  balance_lt?: InputMaybe<Scalars['BigInt']>;
  balance_lte?: InputMaybe<Scalars['BigInt']>;
  balance_not?: InputMaybe<Scalars['BigInt']>;
  balance_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  capitalUsed?: InputMaybe<Scalars['BigInt']>;
  capitalUsed_gt?: InputMaybe<Scalars['BigInt']>;
  capitalUsed_gte?: InputMaybe<Scalars['BigInt']>;
  capitalUsed_in?: InputMaybe<Array<Scalars['BigInt']>>;
  capitalUsed_lt?: InputMaybe<Scalars['BigInt']>;
  capitalUsed_lte?: InputMaybe<Scalars['BigInt']>;
  capitalUsed_not?: InputMaybe<Scalars['BigInt']>;
  capitalUsed_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fUnitAccumulatedFundingStart?: InputMaybe<Scalars['BigInt']>;
  fUnitAccumulatedFundingStart_gt?: InputMaybe<Scalars['BigInt']>;
  fUnitAccumulatedFundingStart_gte?: InputMaybe<Scalars['BigInt']>;
  fUnitAccumulatedFundingStart_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fUnitAccumulatedFundingStart_lt?: InputMaybe<Scalars['BigInt']>;
  fUnitAccumulatedFundingStart_lte?: InputMaybe<Scalars['BigInt']>;
  fUnitAccumulatedFundingStart_not?: InputMaybe<Scalars['BigInt']>;
  fUnitAccumulatedFundingStart_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fundingRatesTotalCount?: InputMaybe<Scalars['Int']>;
  fundingRatesTotalCount_gt?: InputMaybe<Scalars['Int']>;
  fundingRatesTotalCount_gte?: InputMaybe<Scalars['Int']>;
  fundingRatesTotalCount_in?: InputMaybe<Array<Scalars['Int']>>;
  fundingRatesTotalCount_lt?: InputMaybe<Scalars['Int']>;
  fundingRatesTotalCount_lte?: InputMaybe<Scalars['Int']>;
  fundingRatesTotalCount_not?: InputMaybe<Scalars['Int']>;
  fundingRatesTotalCount_not_in?: InputMaybe<Array<Scalars['Int']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  liquidatorTotalAmount?: InputMaybe<Scalars['BigInt']>;
  liquidatorTotalAmount_gt?: InputMaybe<Scalars['BigInt']>;
  liquidatorTotalAmount_gte?: InputMaybe<Scalars['BigInt']>;
  liquidatorTotalAmount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  liquidatorTotalAmount_lt?: InputMaybe<Scalars['BigInt']>;
  liquidatorTotalAmount_lte?: InputMaybe<Scalars['BigInt']>;
  liquidatorTotalAmount_not?: InputMaybe<Scalars['BigInt']>;
  liquidatorTotalAmount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  marginAccountCashCC?: InputMaybe<Scalars['BigInt']>;
  marginAccountCashCC_gt?: InputMaybe<Scalars['BigInt']>;
  marginAccountCashCC_gte?: InputMaybe<Scalars['BigInt']>;
  marginAccountCashCC_in?: InputMaybe<Array<Scalars['BigInt']>>;
  marginAccountCashCC_lt?: InputMaybe<Scalars['BigInt']>;
  marginAccountCashCC_lte?: InputMaybe<Scalars['BigInt']>;
  marginAccountCashCC_not?: InputMaybe<Scalars['BigInt']>;
  marginAccountCashCC_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  marginAccountLockedInValueQC?: InputMaybe<Scalars['BigInt']>;
  marginAccountLockedInValueQC_gt?: InputMaybe<Scalars['BigInt']>;
  marginAccountLockedInValueQC_gte?: InputMaybe<Scalars['BigInt']>;
  marginAccountLockedInValueQC_in?: InputMaybe<Array<Scalars['BigInt']>>;
  marginAccountLockedInValueQC_lt?: InputMaybe<Scalars['BigInt']>;
  marginAccountLockedInValueQC_lte?: InputMaybe<Scalars['BigInt']>;
  marginAccountLockedInValueQC_not?: InputMaybe<Scalars['BigInt']>;
  marginAccountLockedInValueQC_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  marginAccountPositionBC?: InputMaybe<Scalars['BigInt']>;
  marginAccountPositionBC_gt?: InputMaybe<Scalars['BigInt']>;
  marginAccountPositionBC_gte?: InputMaybe<Scalars['BigInt']>;
  marginAccountPositionBC_in?: InputMaybe<Array<Scalars['BigInt']>>;
  marginAccountPositionBC_lt?: InputMaybe<Scalars['BigInt']>;
  marginAccountPositionBC_lte?: InputMaybe<Scalars['BigInt']>;
  marginAccountPositionBC_not?: InputMaybe<Scalars['BigInt']>;
  marginAccountPositionBC_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  marginBalanceCC?: InputMaybe<Scalars['BigInt']>;
  marginBalanceCC_gt?: InputMaybe<Scalars['BigInt']>;
  marginBalanceCC_gte?: InputMaybe<Scalars['BigInt']>;
  marginBalanceCC_in?: InputMaybe<Array<Scalars['BigInt']>>;
  marginBalanceCC_lt?: InputMaybe<Scalars['BigInt']>;
  marginBalanceCC_lte?: InputMaybe<Scalars['BigInt']>;
  marginBalanceCC_not?: InputMaybe<Scalars['BigInt']>;
  marginBalanceCC_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  perpetual?: InputMaybe<Scalars['String']>;
  perpetual_?: InputMaybe<Perpetual_Filter>;
  perpetual_contains?: InputMaybe<Scalars['String']>;
  perpetual_contains_nocase?: InputMaybe<Scalars['String']>;
  perpetual_ends_with?: InputMaybe<Scalars['String']>;
  perpetual_ends_with_nocase?: InputMaybe<Scalars['String']>;
  perpetual_gt?: InputMaybe<Scalars['String']>;
  perpetual_gte?: InputMaybe<Scalars['String']>;
  perpetual_in?: InputMaybe<Array<Scalars['String']>>;
  perpetual_lt?: InputMaybe<Scalars['String']>;
  perpetual_lte?: InputMaybe<Scalars['String']>;
  perpetual_not?: InputMaybe<Scalars['String']>;
  perpetual_not_contains?: InputMaybe<Scalars['String']>;
  perpetual_not_contains_nocase?: InputMaybe<Scalars['String']>;
  perpetual_not_ends_with?: InputMaybe<Scalars['String']>;
  perpetual_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  perpetual_not_in?: InputMaybe<Array<Scalars['String']>>;
  perpetual_not_starts_with?: InputMaybe<Scalars['String']>;
  perpetual_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  perpetual_starts_with?: InputMaybe<Scalars['String']>;
  perpetual_starts_with_nocase?: InputMaybe<Scalars['String']>;
  positionsTotalCount?: InputMaybe<Scalars['Int']>;
  positionsTotalCount_gt?: InputMaybe<Scalars['Int']>;
  positionsTotalCount_gte?: InputMaybe<Scalars['Int']>;
  positionsTotalCount_in?: InputMaybe<Array<Scalars['Int']>>;
  positionsTotalCount_lt?: InputMaybe<Scalars['Int']>;
  positionsTotalCount_lte?: InputMaybe<Scalars['Int']>;
  positionsTotalCount_not?: InputMaybe<Scalars['Int']>;
  positionsTotalCount_not_in?: InputMaybe<Array<Scalars['Int']>>;
  positions_?: InputMaybe<Position_Filter>;
  state?: InputMaybe<Scalars['String']>;
  state_contains?: InputMaybe<Scalars['String']>;
  state_contains_nocase?: InputMaybe<Scalars['String']>;
  state_ends_with?: InputMaybe<Scalars['String']>;
  state_ends_with_nocase?: InputMaybe<Scalars['String']>;
  state_gt?: InputMaybe<Scalars['String']>;
  state_gte?: InputMaybe<Scalars['String']>;
  state_in?: InputMaybe<Array<Scalars['String']>>;
  state_lt?: InputMaybe<Scalars['String']>;
  state_lte?: InputMaybe<Scalars['String']>;
  state_not?: InputMaybe<Scalars['String']>;
  state_not_contains?: InputMaybe<Scalars['String']>;
  state_not_contains_nocase?: InputMaybe<Scalars['String']>;
  state_not_ends_with?: InputMaybe<Scalars['String']>;
  state_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  state_not_in?: InputMaybe<Array<Scalars['String']>>;
  state_not_starts_with?: InputMaybe<Scalars['String']>;
  state_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  state_starts_with?: InputMaybe<Scalars['String']>;
  state_starts_with_nocase?: InputMaybe<Scalars['String']>;
  totalAmountLiquidated?: InputMaybe<Scalars['BigInt']>;
  totalAmountLiquidated_gt?: InputMaybe<Scalars['BigInt']>;
  totalAmountLiquidated_gte?: InputMaybe<Scalars['BigInt']>;
  totalAmountLiquidated_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalAmountLiquidated_lt?: InputMaybe<Scalars['BigInt']>;
  totalAmountLiquidated_lte?: InputMaybe<Scalars['BigInt']>;
  totalAmountLiquidated_not?: InputMaybe<Scalars['BigInt']>;
  totalAmountLiquidated_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalAmountTraded?: InputMaybe<Scalars['BigInt']>;
  totalAmountTraded_gt?: InputMaybe<Scalars['BigInt']>;
  totalAmountTraded_gte?: InputMaybe<Scalars['BigInt']>;
  totalAmountTraded_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalAmountTraded_lt?: InputMaybe<Scalars['BigInt']>;
  totalAmountTraded_lte?: InputMaybe<Scalars['BigInt']>;
  totalAmountTraded_not?: InputMaybe<Scalars['BigInt']>;
  totalAmountTraded_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalFees?: InputMaybe<Scalars['BigInt']>;
  totalFees_gt?: InputMaybe<Scalars['BigInt']>;
  totalFees_gte?: InputMaybe<Scalars['BigInt']>;
  totalFees_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalFees_lt?: InputMaybe<Scalars['BigInt']>;
  totalFees_lte?: InputMaybe<Scalars['BigInt']>;
  totalFees_not?: InputMaybe<Scalars['BigInt']>;
  totalFees_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalPnLCC?: InputMaybe<Scalars['BigInt']>;
  totalPnLCC_gt?: InputMaybe<Scalars['BigInt']>;
  totalPnLCC_gte?: InputMaybe<Scalars['BigInt']>;
  totalPnLCC_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalPnLCC_lt?: InputMaybe<Scalars['BigInt']>;
  totalPnLCC_lte?: InputMaybe<Scalars['BigInt']>;
  totalPnLCC_not?: InputMaybe<Scalars['BigInt']>;
  totalPnLCC_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  trader?: InputMaybe<Scalars['String']>;
  trader_?: InputMaybe<Trader_Filter>;
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
  tradesTotalCount?: InputMaybe<Scalars['Int']>;
  tradesTotalCount_gt?: InputMaybe<Scalars['Int']>;
  tradesTotalCount_gte?: InputMaybe<Scalars['Int']>;
  tradesTotalCount_in?: InputMaybe<Array<Scalars['Int']>>;
  tradesTotalCount_lt?: InputMaybe<Scalars['Int']>;
  tradesTotalCount_lte?: InputMaybe<Scalars['Int']>;
  tradesTotalCount_not?: InputMaybe<Scalars['Int']>;
  tradesTotalCount_not_in?: InputMaybe<Array<Scalars['Int']>>;
  trades_?: InputMaybe<Trade_Filter>;
};

export enum TraderState_OrderBy {
  AmountSettled = 'amountSettled',
  AvailableCashCc = 'availableCashCC',
  AvailableMarginCc = 'availableMarginCC',
  Balance = 'balance',
  BlockTimestamp = 'blockTimestamp',
  CapitalUsed = 'capitalUsed',
  FUnitAccumulatedFundingStart = 'fUnitAccumulatedFundingStart',
  FundingRatesTotalCount = 'fundingRatesTotalCount',
  Id = 'id',
  LiquidatorTotalAmount = 'liquidatorTotalAmount',
  MarginAccountCashCc = 'marginAccountCashCC',
  MarginAccountLockedInValueQc = 'marginAccountLockedInValueQC',
  MarginAccountPositionBc = 'marginAccountPositionBC',
  MarginBalanceCc = 'marginBalanceCC',
  Perpetual = 'perpetual',
  Positions = 'positions',
  PositionsTotalCount = 'positionsTotalCount',
  State = 'state',
  TotalAmountLiquidated = 'totalAmountLiquidated',
  TotalAmountTraded = 'totalAmountTraded',
  TotalFees = 'totalFees',
  TotalPnLcc = 'totalPnLCC',
  Trader = 'trader',
  Trades = 'trades',
  TradesTotalCount = 'tradesTotalCount',
}

export type Trader_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  distributeFees_?: InputMaybe<DistributeFee_Filter>;
  fundingPayments_?: InputMaybe<FundingPayment_Filter>;
  fundingRatesTotalCount?: InputMaybe<Scalars['Int']>;
  fundingRatesTotalCount_gt?: InputMaybe<Scalars['Int']>;
  fundingRatesTotalCount_gte?: InputMaybe<Scalars['Int']>;
  fundingRatesTotalCount_in?: InputMaybe<Array<Scalars['Int']>>;
  fundingRatesTotalCount_lt?: InputMaybe<Scalars['Int']>;
  fundingRatesTotalCount_lte?: InputMaybe<Scalars['Int']>;
  fundingRatesTotalCount_not?: InputMaybe<Scalars['Int']>;
  fundingRatesTotalCount_not_in?: InputMaybe<Array<Scalars['Int']>>;
  fundingRates_?: InputMaybe<FundingRate_Filter>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  limitOrders_?: InputMaybe<LimitOrder_Filter>;
  liquidates_?: InputMaybe<Liquidate_Filter>;
  liquidator_?: InputMaybe<Liquidate_Filter>;
  liquidityAdded_?: InputMaybe<LiquidityAdded_Filter>;
  liquidityRemoved_?: InputMaybe<LiquidityRemoved_Filter>;
  positionsTotalCount?: InputMaybe<Scalars['Int']>;
  positionsTotalCount_gt?: InputMaybe<Scalars['Int']>;
  positionsTotalCount_gte?: InputMaybe<Scalars['Int']>;
  positionsTotalCount_in?: InputMaybe<Array<Scalars['Int']>>;
  positionsTotalCount_lt?: InputMaybe<Scalars['Int']>;
  positionsTotalCount_lte?: InputMaybe<Scalars['Int']>;
  positionsTotalCount_not?: InputMaybe<Scalars['Int']>;
  positionsTotalCount_not_in?: InputMaybe<Array<Scalars['Int']>>;
  positions_?: InputMaybe<Position_Filter>;
  realizedPnLs_?: InputMaybe<RealizedPnL_Filter>;
  settles_?: InputMaybe<Settle_Filter>;
  tokensDeposits_?: InputMaybe<TokensDeposited_Filter>;
  tokensWithdraws_?: InputMaybe<TokensWithdrawn_Filter>;
  totalFundingPaymentCC?: InputMaybe<Scalars['BigInt']>;
  totalFundingPaymentCC_gt?: InputMaybe<Scalars['BigInt']>;
  totalFundingPaymentCC_gte?: InputMaybe<Scalars['BigInt']>;
  totalFundingPaymentCC_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalFundingPaymentCC_lt?: InputMaybe<Scalars['BigInt']>;
  totalFundingPaymentCC_lte?: InputMaybe<Scalars['BigInt']>;
  totalFundingPaymentCC_not?: InputMaybe<Scalars['BigInt']>;
  totalFundingPaymentCC_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  traderPool_?: InputMaybe<TraderPool_Filter>;
  traderStates_?: InputMaybe<TraderState_Filter>;
  tradesTotalCount?: InputMaybe<Scalars['Int']>;
  tradesTotalCount_gt?: InputMaybe<Scalars['Int']>;
  tradesTotalCount_gte?: InputMaybe<Scalars['Int']>;
  tradesTotalCount_in?: InputMaybe<Array<Scalars['Int']>>;
  tradesTotalCount_lt?: InputMaybe<Scalars['Int']>;
  tradesTotalCount_lte?: InputMaybe<Scalars['Int']>;
  tradesTotalCount_not?: InputMaybe<Scalars['Int']>;
  tradesTotalCount_not_in?: InputMaybe<Array<Scalars['Int']>>;
  trades_?: InputMaybe<Trade_Filter>;
  updateMarginAccount_?: InputMaybe<UpdateMarginAccount_Filter>;
};

export enum Trader_OrderBy {
  DistributeFees = 'distributeFees',
  FundingPayments = 'fundingPayments',
  FundingRates = 'fundingRates',
  FundingRatesTotalCount = 'fundingRatesTotalCount',
  Id = 'id',
  LimitOrders = 'limitOrders',
  Liquidates = 'liquidates',
  Liquidator = 'liquidator',
  LiquidityAdded = 'liquidityAdded',
  LiquidityRemoved = 'liquidityRemoved',
  Positions = 'positions',
  PositionsTotalCount = 'positionsTotalCount',
  RealizedPnLs = 'realizedPnLs',
  Settles = 'settles',
  TokensDeposits = 'tokensDeposits',
  TokensWithdraws = 'tokensWithdraws',
  TotalFundingPaymentCc = 'totalFundingPaymentCC',
  TraderPool = 'traderPool',
  TraderStates = 'traderStates',
  Trades = 'trades',
  TradesTotalCount = 'tradesTotalCount',
  UpdateMarginAccount = 'updateMarginAccount',
}

export type Transaction = {
  __typename?: 'Transaction';
  atomicYields?: Maybe<Array<AtomicYield>>;
  blockNumber: Scalars['BigInt'];
  from: Scalars['Bytes'];
  gasLimit: Scalars['BigInt'];
  gasPrice: Scalars['BigInt'];
  id: Scalars['ID'];
  index: Scalars['BigInt'];
  liquidates?: Maybe<Array<Liquidate>>;
  timestamp: Scalars['BigInt'];
  to?: Maybe<Scalars['Bytes']>;
  tokensDeposits?: Maybe<Array<TokensDeposited>>;
  tokensWithdraws?: Maybe<Array<TokensWithdrawn>>;
  trades?: Maybe<Array<Trade>>;
  value: Scalars['BigInt'];
};

export type TransactionAtomicYieldsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<AtomicYield_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<AtomicYield_Filter>;
};

export type TransactionLiquidatesArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Liquidate_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Liquidate_Filter>;
};

export type TransactionTokensDepositsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TokensDeposited_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<TokensDeposited_Filter>;
};

export type TransactionTokensWithdrawsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TokensWithdrawn_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<TokensWithdrawn_Filter>;
};

export type TransactionTradesArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Trade_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Trade_Filter>;
};

export type Transaction_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  atomicYields_?: InputMaybe<AtomicYield_Filter>;
  blockNumber?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  from?: InputMaybe<Scalars['Bytes']>;
  from_contains?: InputMaybe<Scalars['Bytes']>;
  from_in?: InputMaybe<Array<Scalars['Bytes']>>;
  from_not?: InputMaybe<Scalars['Bytes']>;
  from_not_contains?: InputMaybe<Scalars['Bytes']>;
  from_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
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
  index?: InputMaybe<Scalars['BigInt']>;
  index_gt?: InputMaybe<Scalars['BigInt']>;
  index_gte?: InputMaybe<Scalars['BigInt']>;
  index_in?: InputMaybe<Array<Scalars['BigInt']>>;
  index_lt?: InputMaybe<Scalars['BigInt']>;
  index_lte?: InputMaybe<Scalars['BigInt']>;
  index_not?: InputMaybe<Scalars['BigInt']>;
  index_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  liquidates_?: InputMaybe<Liquidate_Filter>;
  timestamp?: InputMaybe<Scalars['BigInt']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  to?: InputMaybe<Scalars['Bytes']>;
  to_contains?: InputMaybe<Scalars['Bytes']>;
  to_in?: InputMaybe<Array<Scalars['Bytes']>>;
  to_not?: InputMaybe<Scalars['Bytes']>;
  to_not_contains?: InputMaybe<Scalars['Bytes']>;
  to_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  tokensDeposits_?: InputMaybe<TokensDeposited_Filter>;
  tokensWithdraws_?: InputMaybe<TokensWithdrawn_Filter>;
  trades_?: InputMaybe<Trade_Filter>;
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
  AtomicYields = 'atomicYields',
  BlockNumber = 'blockNumber',
  From = 'from',
  GasLimit = 'gasLimit',
  GasPrice = 'gasPrice',
  Id = 'id',
  Index = 'index',
  Liquidates = 'liquidates',
  Timestamp = 'timestamp',
  To = 'to',
  TokensDeposits = 'tokensDeposits',
  TokensWithdraws = 'tokensWithdraws',
  Trades = 'trades',
  Value = 'value',
}

export type TransferEarningsToTreasury = {
  __typename?: 'TransferEarningsToTreasury';
  _poolId: Scalars['Int'];
  blockTimestamp: Scalars['BigInt'];
  fEarnings: Scalars['BigInt'];
  id: Scalars['ID'];
  newDefaultFundSize: Scalars['BigInt'];
};

export type TransferEarningsToTreasury_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  _poolId?: InputMaybe<Scalars['Int']>;
  _poolId_gt?: InputMaybe<Scalars['Int']>;
  _poolId_gte?: InputMaybe<Scalars['Int']>;
  _poolId_in?: InputMaybe<Array<Scalars['Int']>>;
  _poolId_lt?: InputMaybe<Scalars['Int']>;
  _poolId_lte?: InputMaybe<Scalars['Int']>;
  _poolId_not?: InputMaybe<Scalars['Int']>;
  _poolId_not_in?: InputMaybe<Array<Scalars['Int']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fEarnings?: InputMaybe<Scalars['BigInt']>;
  fEarnings_gt?: InputMaybe<Scalars['BigInt']>;
  fEarnings_gte?: InputMaybe<Scalars['BigInt']>;
  fEarnings_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fEarnings_lt?: InputMaybe<Scalars['BigInt']>;
  fEarnings_lte?: InputMaybe<Scalars['BigInt']>;
  fEarnings_not?: InputMaybe<Scalars['BigInt']>;
  fEarnings_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  newDefaultFundSize?: InputMaybe<Scalars['BigInt']>;
  newDefaultFundSize_gt?: InputMaybe<Scalars['BigInt']>;
  newDefaultFundSize_gte?: InputMaybe<Scalars['BigInt']>;
  newDefaultFundSize_in?: InputMaybe<Array<Scalars['BigInt']>>;
  newDefaultFundSize_lt?: InputMaybe<Scalars['BigInt']>;
  newDefaultFundSize_lte?: InputMaybe<Scalars['BigInt']>;
  newDefaultFundSize_not?: InputMaybe<Scalars['BigInt']>;
  newDefaultFundSize_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export enum TransferEarningsToTreasury_OrderBy {
  PoolId = '_poolId',
  BlockTimestamp = 'blockTimestamp',
  FEarnings = 'fEarnings',
  Id = 'id',
  NewDefaultFundSize = 'newDefaultFundSize',
}

export type TransferFeeToReferrer = {
  __typename?: 'TransferFeeToReferrer';
  id: Scalars['ID'];
  perpetualId: Scalars['Bytes'];
  referralRebate: Scalars['BigInt'];
  referrer: Scalars['Bytes'];
  trader: Scalars['Bytes'];
};

export type TransferFeeToReferrer_Filter = {
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
  perpetualId?: InputMaybe<Scalars['Bytes']>;
  perpetualId_contains?: InputMaybe<Scalars['Bytes']>;
  perpetualId_in?: InputMaybe<Array<Scalars['Bytes']>>;
  perpetualId_not?: InputMaybe<Scalars['Bytes']>;
  perpetualId_not_contains?: InputMaybe<Scalars['Bytes']>;
  perpetualId_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  referralRebate?: InputMaybe<Scalars['BigInt']>;
  referralRebate_gt?: InputMaybe<Scalars['BigInt']>;
  referralRebate_gte?: InputMaybe<Scalars['BigInt']>;
  referralRebate_in?: InputMaybe<Array<Scalars['BigInt']>>;
  referralRebate_lt?: InputMaybe<Scalars['BigInt']>;
  referralRebate_lte?: InputMaybe<Scalars['BigInt']>;
  referralRebate_not?: InputMaybe<Scalars['BigInt']>;
  referralRebate_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  referrer?: InputMaybe<Scalars['Bytes']>;
  referrer_contains?: InputMaybe<Scalars['Bytes']>;
  referrer_in?: InputMaybe<Array<Scalars['Bytes']>>;
  referrer_not?: InputMaybe<Scalars['Bytes']>;
  referrer_not_contains?: InputMaybe<Scalars['Bytes']>;
  referrer_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  trader?: InputMaybe<Scalars['Bytes']>;
  trader_contains?: InputMaybe<Scalars['Bytes']>;
  trader_in?: InputMaybe<Array<Scalars['Bytes']>>;
  trader_not?: InputMaybe<Scalars['Bytes']>;
  trader_not_contains?: InputMaybe<Scalars['Bytes']>;
  trader_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum TransferFeeToReferrer_OrderBy {
  Id = 'id',
  PerpetualId = 'perpetualId',
  ReferralRebate = 'referralRebate',
  Referrer = 'referrer',
  Trader = 'trader',
}

export type TransferTreasuryTo = {
  __typename?: 'TransferTreasuryTo';
  id: Scalars['ID'];
  newTreasury: Scalars['Bytes'];
  oldTreasury: Scalars['Bytes'];
  poolId: Scalars['BigInt'];
};

export type TransferTreasuryTo_Filter = {
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
  newTreasury?: InputMaybe<Scalars['Bytes']>;
  newTreasury_contains?: InputMaybe<Scalars['Bytes']>;
  newTreasury_in?: InputMaybe<Array<Scalars['Bytes']>>;
  newTreasury_not?: InputMaybe<Scalars['Bytes']>;
  newTreasury_not_contains?: InputMaybe<Scalars['Bytes']>;
  newTreasury_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  oldTreasury?: InputMaybe<Scalars['Bytes']>;
  oldTreasury_contains?: InputMaybe<Scalars['Bytes']>;
  oldTreasury_in?: InputMaybe<Array<Scalars['Bytes']>>;
  oldTreasury_not?: InputMaybe<Scalars['Bytes']>;
  oldTreasury_not_contains?: InputMaybe<Scalars['Bytes']>;
  oldTreasury_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  poolId?: InputMaybe<Scalars['BigInt']>;
  poolId_gt?: InputMaybe<Scalars['BigInt']>;
  poolId_gte?: InputMaybe<Scalars['BigInt']>;
  poolId_in?: InputMaybe<Array<Scalars['BigInt']>>;
  poolId_lt?: InputMaybe<Scalars['BigInt']>;
  poolId_lte?: InputMaybe<Scalars['BigInt']>;
  poolId_not?: InputMaybe<Scalars['BigInt']>;
  poolId_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export enum TransferTreasuryTo_OrderBy {
  Id = 'id',
  NewTreasury = 'newTreasury',
  OldTreasury = 'oldTreasury',
  PoolId = 'poolId',
}

export type UpdateAmmFundCash = {
  __typename?: 'UpdateAMMFundCash';
  blockTimestamp: Scalars['BigInt'];
  fNewAMMFundCash: Scalars['BigInt'];
  fNewLiqPoolTotalAMMFundsCash: Scalars['BigInt'];
  id: Scalars['ID'];
  perpetualId: Scalars['Bytes'];
};

export type UpdateAmmFundCash_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fNewAMMFundCash?: InputMaybe<Scalars['BigInt']>;
  fNewAMMFundCash_gt?: InputMaybe<Scalars['BigInt']>;
  fNewAMMFundCash_gte?: InputMaybe<Scalars['BigInt']>;
  fNewAMMFundCash_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fNewAMMFundCash_lt?: InputMaybe<Scalars['BigInt']>;
  fNewAMMFundCash_lte?: InputMaybe<Scalars['BigInt']>;
  fNewAMMFundCash_not?: InputMaybe<Scalars['BigInt']>;
  fNewAMMFundCash_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fNewLiqPoolTotalAMMFundsCash?: InputMaybe<Scalars['BigInt']>;
  fNewLiqPoolTotalAMMFundsCash_gt?: InputMaybe<Scalars['BigInt']>;
  fNewLiqPoolTotalAMMFundsCash_gte?: InputMaybe<Scalars['BigInt']>;
  fNewLiqPoolTotalAMMFundsCash_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fNewLiqPoolTotalAMMFundsCash_lt?: InputMaybe<Scalars['BigInt']>;
  fNewLiqPoolTotalAMMFundsCash_lte?: InputMaybe<Scalars['BigInt']>;
  fNewLiqPoolTotalAMMFundsCash_not?: InputMaybe<Scalars['BigInt']>;
  fNewLiqPoolTotalAMMFundsCash_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  perpetualId?: InputMaybe<Scalars['Bytes']>;
  perpetualId_contains?: InputMaybe<Scalars['Bytes']>;
  perpetualId_in?: InputMaybe<Array<Scalars['Bytes']>>;
  perpetualId_not?: InputMaybe<Scalars['Bytes']>;
  perpetualId_not_contains?: InputMaybe<Scalars['Bytes']>;
  perpetualId_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum UpdateAmmFundCash_OrderBy {
  BlockTimestamp = 'blockTimestamp',
  FNewAmmFundCash = 'fNewAMMFundCash',
  FNewLiqPoolTotalAmmFundsCash = 'fNewLiqPoolTotalAMMFundsCash',
  Id = 'id',
  PerpetualId = 'perpetualId',
}

export type UpdateAmmFundTargetSize = {
  __typename?: 'UpdateAMMFundTargetSize';
  blockTimestamp: Scalars['BigInt'];
  fAMMFundCashCCInPerpetual: Scalars['BigInt'];
  fAMMFundCashCCInPool: Scalars['BigInt'];
  fTargetAMMFundSizeInPerpetual: Scalars['BigInt'];
  fTargetAMMFundSizeInPool: Scalars['BigInt'];
  id: Scalars['ID'];
  liquidityPoolId: Scalars['Int'];
  perpetualId: Scalars['Bytes'];
};

export type UpdateAmmFundTargetSize_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fAMMFundCashCCInPerpetual?: InputMaybe<Scalars['BigInt']>;
  fAMMFundCashCCInPerpetual_gt?: InputMaybe<Scalars['BigInt']>;
  fAMMFundCashCCInPerpetual_gte?: InputMaybe<Scalars['BigInt']>;
  fAMMFundCashCCInPerpetual_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fAMMFundCashCCInPerpetual_lt?: InputMaybe<Scalars['BigInt']>;
  fAMMFundCashCCInPerpetual_lte?: InputMaybe<Scalars['BigInt']>;
  fAMMFundCashCCInPerpetual_not?: InputMaybe<Scalars['BigInt']>;
  fAMMFundCashCCInPerpetual_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fAMMFundCashCCInPool?: InputMaybe<Scalars['BigInt']>;
  fAMMFundCashCCInPool_gt?: InputMaybe<Scalars['BigInt']>;
  fAMMFundCashCCInPool_gte?: InputMaybe<Scalars['BigInt']>;
  fAMMFundCashCCInPool_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fAMMFundCashCCInPool_lt?: InputMaybe<Scalars['BigInt']>;
  fAMMFundCashCCInPool_lte?: InputMaybe<Scalars['BigInt']>;
  fAMMFundCashCCInPool_not?: InputMaybe<Scalars['BigInt']>;
  fAMMFundCashCCInPool_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fTargetAMMFundSizeInPerpetual?: InputMaybe<Scalars['BigInt']>;
  fTargetAMMFundSizeInPerpetual_gt?: InputMaybe<Scalars['BigInt']>;
  fTargetAMMFundSizeInPerpetual_gte?: InputMaybe<Scalars['BigInt']>;
  fTargetAMMFundSizeInPerpetual_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fTargetAMMFundSizeInPerpetual_lt?: InputMaybe<Scalars['BigInt']>;
  fTargetAMMFundSizeInPerpetual_lte?: InputMaybe<Scalars['BigInt']>;
  fTargetAMMFundSizeInPerpetual_not?: InputMaybe<Scalars['BigInt']>;
  fTargetAMMFundSizeInPerpetual_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fTargetAMMFundSizeInPool?: InputMaybe<Scalars['BigInt']>;
  fTargetAMMFundSizeInPool_gt?: InputMaybe<Scalars['BigInt']>;
  fTargetAMMFundSizeInPool_gte?: InputMaybe<Scalars['BigInt']>;
  fTargetAMMFundSizeInPool_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fTargetAMMFundSizeInPool_lt?: InputMaybe<Scalars['BigInt']>;
  fTargetAMMFundSizeInPool_lte?: InputMaybe<Scalars['BigInt']>;
  fTargetAMMFundSizeInPool_not?: InputMaybe<Scalars['BigInt']>;
  fTargetAMMFundSizeInPool_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  liquidityPoolId?: InputMaybe<Scalars['Int']>;
  liquidityPoolId_gt?: InputMaybe<Scalars['Int']>;
  liquidityPoolId_gte?: InputMaybe<Scalars['Int']>;
  liquidityPoolId_in?: InputMaybe<Array<Scalars['Int']>>;
  liquidityPoolId_lt?: InputMaybe<Scalars['Int']>;
  liquidityPoolId_lte?: InputMaybe<Scalars['Int']>;
  liquidityPoolId_not?: InputMaybe<Scalars['Int']>;
  liquidityPoolId_not_in?: InputMaybe<Array<Scalars['Int']>>;
  perpetualId?: InputMaybe<Scalars['Bytes']>;
  perpetualId_contains?: InputMaybe<Scalars['Bytes']>;
  perpetualId_in?: InputMaybe<Array<Scalars['Bytes']>>;
  perpetualId_not?: InputMaybe<Scalars['Bytes']>;
  perpetualId_not_contains?: InputMaybe<Scalars['Bytes']>;
  perpetualId_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum UpdateAmmFundTargetSize_OrderBy {
  BlockTimestamp = 'blockTimestamp',
  FAmmFundCashCcInPerpetual = 'fAMMFundCashCCInPerpetual',
  FAmmFundCashCcInPool = 'fAMMFundCashCCInPool',
  FTargetAmmFundSizeInPerpetual = 'fTargetAMMFundSizeInPerpetual',
  FTargetAmmFundSizeInPool = 'fTargetAMMFundSizeInPool',
  Id = 'id',
  LiquidityPoolId = 'liquidityPoolId',
  PerpetualId = 'perpetualId',
}

export type UpdateDefaultFundCash = {
  __typename?: 'UpdateDefaultFundCash';
  fDeltaAmountCC: Scalars['BigInt'];
  fNewFundCash: Scalars['BigInt'];
  id: Scalars['ID'];
  poolId: Scalars['Int'];
};

export type UpdateDefaultFundCash_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  fDeltaAmountCC?: InputMaybe<Scalars['BigInt']>;
  fDeltaAmountCC_gt?: InputMaybe<Scalars['BigInt']>;
  fDeltaAmountCC_gte?: InputMaybe<Scalars['BigInt']>;
  fDeltaAmountCC_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fDeltaAmountCC_lt?: InputMaybe<Scalars['BigInt']>;
  fDeltaAmountCC_lte?: InputMaybe<Scalars['BigInt']>;
  fDeltaAmountCC_not?: InputMaybe<Scalars['BigInt']>;
  fDeltaAmountCC_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fNewFundCash?: InputMaybe<Scalars['BigInt']>;
  fNewFundCash_gt?: InputMaybe<Scalars['BigInt']>;
  fNewFundCash_gte?: InputMaybe<Scalars['BigInt']>;
  fNewFundCash_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fNewFundCash_lt?: InputMaybe<Scalars['BigInt']>;
  fNewFundCash_lte?: InputMaybe<Scalars['BigInt']>;
  fNewFundCash_not?: InputMaybe<Scalars['BigInt']>;
  fNewFundCash_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  poolId?: InputMaybe<Scalars['Int']>;
  poolId_gt?: InputMaybe<Scalars['Int']>;
  poolId_gte?: InputMaybe<Scalars['Int']>;
  poolId_in?: InputMaybe<Array<Scalars['Int']>>;
  poolId_lt?: InputMaybe<Scalars['Int']>;
  poolId_lte?: InputMaybe<Scalars['Int']>;
  poolId_not?: InputMaybe<Scalars['Int']>;
  poolId_not_in?: InputMaybe<Array<Scalars['Int']>>;
};

export enum UpdateDefaultFundCash_OrderBy {
  FDeltaAmountCc = 'fDeltaAmountCC',
  FNewFundCash = 'fNewFundCash',
  Id = 'id',
  PoolId = 'poolId',
}

export type UpdateDefaultFundTargetSize = {
  __typename?: 'UpdateDefaultFundTargetSize';
  blockTimestamp: Scalars['BigInt'];
  fDefaultFundCashCC: Scalars['BigInt'];
  fTargetDFSize: Scalars['BigInt'];
  id: Scalars['ID'];
  liquidityPoolId: Scalars['Int'];
};

export type UpdateDefaultFundTargetSize_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fDefaultFundCashCC?: InputMaybe<Scalars['BigInt']>;
  fDefaultFundCashCC_gt?: InputMaybe<Scalars['BigInt']>;
  fDefaultFundCashCC_gte?: InputMaybe<Scalars['BigInt']>;
  fDefaultFundCashCC_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fDefaultFundCashCC_lt?: InputMaybe<Scalars['BigInt']>;
  fDefaultFundCashCC_lte?: InputMaybe<Scalars['BigInt']>;
  fDefaultFundCashCC_not?: InputMaybe<Scalars['BigInt']>;
  fDefaultFundCashCC_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fTargetDFSize?: InputMaybe<Scalars['BigInt']>;
  fTargetDFSize_gt?: InputMaybe<Scalars['BigInt']>;
  fTargetDFSize_gte?: InputMaybe<Scalars['BigInt']>;
  fTargetDFSize_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fTargetDFSize_lt?: InputMaybe<Scalars['BigInt']>;
  fTargetDFSize_lte?: InputMaybe<Scalars['BigInt']>;
  fTargetDFSize_not?: InputMaybe<Scalars['BigInt']>;
  fTargetDFSize_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  liquidityPoolId?: InputMaybe<Scalars['Int']>;
  liquidityPoolId_gt?: InputMaybe<Scalars['Int']>;
  liquidityPoolId_gte?: InputMaybe<Scalars['Int']>;
  liquidityPoolId_in?: InputMaybe<Array<Scalars['Int']>>;
  liquidityPoolId_lt?: InputMaybe<Scalars['Int']>;
  liquidityPoolId_lte?: InputMaybe<Scalars['Int']>;
  liquidityPoolId_not?: InputMaybe<Scalars['Int']>;
  liquidityPoolId_not_in?: InputMaybe<Array<Scalars['Int']>>;
};

export enum UpdateDefaultFundTargetSize_OrderBy {
  BlockTimestamp = 'blockTimestamp',
  FDefaultFundCashCc = 'fDefaultFundCashCC',
  FTargetDfSize = 'fTargetDFSize',
  Id = 'id',
  LiquidityPoolId = 'liquidityPoolId',
}

export type UpdateFundingRate = {
  __typename?: 'UpdateFundingRate';
  blockTimestamp: Scalars['BigInt'];
  fFundingRate: Scalars['BigInt'];
  id: Scalars['ID'];
  perpetualId: Scalars['Bytes'];
};

export type UpdateFundingRate_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fFundingRate?: InputMaybe<Scalars['BigInt']>;
  fFundingRate_gt?: InputMaybe<Scalars['BigInt']>;
  fFundingRate_gte?: InputMaybe<Scalars['BigInt']>;
  fFundingRate_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fFundingRate_lt?: InputMaybe<Scalars['BigInt']>;
  fFundingRate_lte?: InputMaybe<Scalars['BigInt']>;
  fFundingRate_not?: InputMaybe<Scalars['BigInt']>;
  fFundingRate_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  perpetualId?: InputMaybe<Scalars['Bytes']>;
  perpetualId_contains?: InputMaybe<Scalars['Bytes']>;
  perpetualId_in?: InputMaybe<Array<Scalars['Bytes']>>;
  perpetualId_not?: InputMaybe<Scalars['Bytes']>;
  perpetualId_not_contains?: InputMaybe<Scalars['Bytes']>;
  perpetualId_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum UpdateFundingRate_OrderBy {
  BlockTimestamp = 'blockTimestamp',
  FFundingRate = 'fFundingRate',
  Id = 'id',
  PerpetualId = 'perpetualId',
}

export type UpdateMarginAccount = {
  __typename?: 'UpdateMarginAccount';
  blockTimestamp: Scalars['BigInt'];
  fCashCC: Scalars['BigInt'];
  fFundingPaymentCC: Scalars['BigInt'];
  fLockedInValueQC: Scalars['BigInt'];
  fOpenInterestBC: Scalars['BigInt'];
  fPositionBC: Scalars['BigInt'];
  id: Scalars['ID'];
  perpetualId: Scalars['Bytes'];
  positionId: Scalars['Bytes'];
  trader?: Maybe<Trader>;
};

export type UpdateMarginAccount_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fCashCC?: InputMaybe<Scalars['BigInt']>;
  fCashCC_gt?: InputMaybe<Scalars['BigInt']>;
  fCashCC_gte?: InputMaybe<Scalars['BigInt']>;
  fCashCC_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fCashCC_lt?: InputMaybe<Scalars['BigInt']>;
  fCashCC_lte?: InputMaybe<Scalars['BigInt']>;
  fCashCC_not?: InputMaybe<Scalars['BigInt']>;
  fCashCC_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fFundingPaymentCC?: InputMaybe<Scalars['BigInt']>;
  fFundingPaymentCC_gt?: InputMaybe<Scalars['BigInt']>;
  fFundingPaymentCC_gte?: InputMaybe<Scalars['BigInt']>;
  fFundingPaymentCC_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fFundingPaymentCC_lt?: InputMaybe<Scalars['BigInt']>;
  fFundingPaymentCC_lte?: InputMaybe<Scalars['BigInt']>;
  fFundingPaymentCC_not?: InputMaybe<Scalars['BigInt']>;
  fFundingPaymentCC_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fLockedInValueQC?: InputMaybe<Scalars['BigInt']>;
  fLockedInValueQC_gt?: InputMaybe<Scalars['BigInt']>;
  fLockedInValueQC_gte?: InputMaybe<Scalars['BigInt']>;
  fLockedInValueQC_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fLockedInValueQC_lt?: InputMaybe<Scalars['BigInt']>;
  fLockedInValueQC_lte?: InputMaybe<Scalars['BigInt']>;
  fLockedInValueQC_not?: InputMaybe<Scalars['BigInt']>;
  fLockedInValueQC_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fOpenInterestBC?: InputMaybe<Scalars['BigInt']>;
  fOpenInterestBC_gt?: InputMaybe<Scalars['BigInt']>;
  fOpenInterestBC_gte?: InputMaybe<Scalars['BigInt']>;
  fOpenInterestBC_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fOpenInterestBC_lt?: InputMaybe<Scalars['BigInt']>;
  fOpenInterestBC_lte?: InputMaybe<Scalars['BigInt']>;
  fOpenInterestBC_not?: InputMaybe<Scalars['BigInt']>;
  fOpenInterestBC_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fPositionBC?: InputMaybe<Scalars['BigInt']>;
  fPositionBC_gt?: InputMaybe<Scalars['BigInt']>;
  fPositionBC_gte?: InputMaybe<Scalars['BigInt']>;
  fPositionBC_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fPositionBC_lt?: InputMaybe<Scalars['BigInt']>;
  fPositionBC_lte?: InputMaybe<Scalars['BigInt']>;
  fPositionBC_not?: InputMaybe<Scalars['BigInt']>;
  fPositionBC_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  perpetualId?: InputMaybe<Scalars['Bytes']>;
  perpetualId_contains?: InputMaybe<Scalars['Bytes']>;
  perpetualId_in?: InputMaybe<Array<Scalars['Bytes']>>;
  perpetualId_not?: InputMaybe<Scalars['Bytes']>;
  perpetualId_not_contains?: InputMaybe<Scalars['Bytes']>;
  perpetualId_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  positionId?: InputMaybe<Scalars['Bytes']>;
  positionId_contains?: InputMaybe<Scalars['Bytes']>;
  positionId_in?: InputMaybe<Array<Scalars['Bytes']>>;
  positionId_not?: InputMaybe<Scalars['Bytes']>;
  positionId_not_contains?: InputMaybe<Scalars['Bytes']>;
  positionId_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  trader?: InputMaybe<Scalars['String']>;
  trader_?: InputMaybe<Trader_Filter>;
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
};

export enum UpdateMarginAccount_OrderBy {
  BlockTimestamp = 'blockTimestamp',
  FCashCc = 'fCashCC',
  FFundingPaymentCc = 'fFundingPaymentCC',
  FLockedInValueQc = 'fLockedInValueQC',
  FOpenInterestBc = 'fOpenInterestBC',
  FPositionBc = 'fPositionBC',
  Id = 'id',
  PerpetualId = 'perpetualId',
  PositionId = 'positionId',
  Trader = 'trader',
}

export type UpdateMarkPrice = {
  __typename?: 'UpdateMarkPrice';
  blockTimestamp: Scalars['BigInt'];
  fMarkPricePremium: Scalars['BigInt'];
  fSpotIndexPrice: Scalars['BigInt'];
  id: Scalars['ID'];
  perpetualId: Scalars['Bytes'];
};

export type UpdateMarkPrice_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fMarkPricePremium?: InputMaybe<Scalars['BigInt']>;
  fMarkPricePremium_gt?: InputMaybe<Scalars['BigInt']>;
  fMarkPricePremium_gte?: InputMaybe<Scalars['BigInt']>;
  fMarkPricePremium_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fMarkPricePremium_lt?: InputMaybe<Scalars['BigInt']>;
  fMarkPricePremium_lte?: InputMaybe<Scalars['BigInt']>;
  fMarkPricePremium_not?: InputMaybe<Scalars['BigInt']>;
  fMarkPricePremium_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fSpotIndexPrice?: InputMaybe<Scalars['BigInt']>;
  fSpotIndexPrice_gt?: InputMaybe<Scalars['BigInt']>;
  fSpotIndexPrice_gte?: InputMaybe<Scalars['BigInt']>;
  fSpotIndexPrice_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fSpotIndexPrice_lt?: InputMaybe<Scalars['BigInt']>;
  fSpotIndexPrice_lte?: InputMaybe<Scalars['BigInt']>;
  fSpotIndexPrice_not?: InputMaybe<Scalars['BigInt']>;
  fSpotIndexPrice_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  perpetualId?: InputMaybe<Scalars['Bytes']>;
  perpetualId_contains?: InputMaybe<Scalars['Bytes']>;
  perpetualId_in?: InputMaybe<Array<Scalars['Bytes']>>;
  perpetualId_not?: InputMaybe<Scalars['Bytes']>;
  perpetualId_not_contains?: InputMaybe<Scalars['Bytes']>;
  perpetualId_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum UpdateMarkPrice_OrderBy {
  BlockTimestamp = 'blockTimestamp',
  FMarkPricePremium = 'fMarkPricePremium',
  FSpotIndexPrice = 'fSpotIndexPrice',
  Id = 'id',
  PerpetualId = 'perpetualId',
}

export type UpdateParticipationFundCash = {
  __typename?: 'UpdateParticipationFundCash';
  blockTimestamp: Scalars['BigInt'];
  fDeltaAmountCC: Scalars['BigInt'];
  fNewFundCash: Scalars['BigInt'];
  id: Scalars['ID'];
  poolId: Scalars['Int'];
};

export type UpdateParticipationFundCash_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fDeltaAmountCC?: InputMaybe<Scalars['BigInt']>;
  fDeltaAmountCC_gt?: InputMaybe<Scalars['BigInt']>;
  fDeltaAmountCC_gte?: InputMaybe<Scalars['BigInt']>;
  fDeltaAmountCC_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fDeltaAmountCC_lt?: InputMaybe<Scalars['BigInt']>;
  fDeltaAmountCC_lte?: InputMaybe<Scalars['BigInt']>;
  fDeltaAmountCC_not?: InputMaybe<Scalars['BigInt']>;
  fDeltaAmountCC_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fNewFundCash?: InputMaybe<Scalars['BigInt']>;
  fNewFundCash_gt?: InputMaybe<Scalars['BigInt']>;
  fNewFundCash_gte?: InputMaybe<Scalars['BigInt']>;
  fNewFundCash_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fNewFundCash_lt?: InputMaybe<Scalars['BigInt']>;
  fNewFundCash_lte?: InputMaybe<Scalars['BigInt']>;
  fNewFundCash_not?: InputMaybe<Scalars['BigInt']>;
  fNewFundCash_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  poolId?: InputMaybe<Scalars['Int']>;
  poolId_gt?: InputMaybe<Scalars['Int']>;
  poolId_gte?: InputMaybe<Scalars['Int']>;
  poolId_in?: InputMaybe<Array<Scalars['Int']>>;
  poolId_lt?: InputMaybe<Scalars['Int']>;
  poolId_lte?: InputMaybe<Scalars['Int']>;
  poolId_not?: InputMaybe<Scalars['Int']>;
  poolId_not_in?: InputMaybe<Array<Scalars['Int']>>;
};

export enum UpdateParticipationFundCash_OrderBy {
  BlockTimestamp = 'blockTimestamp',
  FDeltaAmountCc = 'fDeltaAmountCC',
  FNewFundCash = 'fNewFundCash',
  Id = 'id',
  PoolId = 'poolId',
}

export type UpdatePrice = {
  __typename?: 'UpdatePrice';
  id: Scalars['ID'];
  oracleS2Addr: Scalars['Bytes'];
  oracleS3Addr: Scalars['Bytes'];
  perpetualId: Scalars['Bytes'];
  spotPriceS2: Scalars['BigInt'];
  spotPriceS3: Scalars['BigInt'];
  timePriceS2: Scalars['BigInt'];
  timePriceS3: Scalars['BigInt'];
};

export type UpdatePrice_Filter = {
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
  oracleS2Addr?: InputMaybe<Scalars['Bytes']>;
  oracleS2Addr_contains?: InputMaybe<Scalars['Bytes']>;
  oracleS2Addr_in?: InputMaybe<Array<Scalars['Bytes']>>;
  oracleS2Addr_not?: InputMaybe<Scalars['Bytes']>;
  oracleS2Addr_not_contains?: InputMaybe<Scalars['Bytes']>;
  oracleS2Addr_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  oracleS3Addr?: InputMaybe<Scalars['Bytes']>;
  oracleS3Addr_contains?: InputMaybe<Scalars['Bytes']>;
  oracleS3Addr_in?: InputMaybe<Array<Scalars['Bytes']>>;
  oracleS3Addr_not?: InputMaybe<Scalars['Bytes']>;
  oracleS3Addr_not_contains?: InputMaybe<Scalars['Bytes']>;
  oracleS3Addr_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  perpetualId?: InputMaybe<Scalars['Bytes']>;
  perpetualId_contains?: InputMaybe<Scalars['Bytes']>;
  perpetualId_in?: InputMaybe<Array<Scalars['Bytes']>>;
  perpetualId_not?: InputMaybe<Scalars['Bytes']>;
  perpetualId_not_contains?: InputMaybe<Scalars['Bytes']>;
  perpetualId_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  spotPriceS2?: InputMaybe<Scalars['BigInt']>;
  spotPriceS2_gt?: InputMaybe<Scalars['BigInt']>;
  spotPriceS2_gte?: InputMaybe<Scalars['BigInt']>;
  spotPriceS2_in?: InputMaybe<Array<Scalars['BigInt']>>;
  spotPriceS2_lt?: InputMaybe<Scalars['BigInt']>;
  spotPriceS2_lte?: InputMaybe<Scalars['BigInt']>;
  spotPriceS2_not?: InputMaybe<Scalars['BigInt']>;
  spotPriceS2_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  spotPriceS3?: InputMaybe<Scalars['BigInt']>;
  spotPriceS3_gt?: InputMaybe<Scalars['BigInt']>;
  spotPriceS3_gte?: InputMaybe<Scalars['BigInt']>;
  spotPriceS3_in?: InputMaybe<Array<Scalars['BigInt']>>;
  spotPriceS3_lt?: InputMaybe<Scalars['BigInt']>;
  spotPriceS3_lte?: InputMaybe<Scalars['BigInt']>;
  spotPriceS3_not?: InputMaybe<Scalars['BigInt']>;
  spotPriceS3_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timePriceS2?: InputMaybe<Scalars['BigInt']>;
  timePriceS2_gt?: InputMaybe<Scalars['BigInt']>;
  timePriceS2_gte?: InputMaybe<Scalars['BigInt']>;
  timePriceS2_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timePriceS2_lt?: InputMaybe<Scalars['BigInt']>;
  timePriceS2_lte?: InputMaybe<Scalars['BigInt']>;
  timePriceS2_not?: InputMaybe<Scalars['BigInt']>;
  timePriceS2_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timePriceS3?: InputMaybe<Scalars['BigInt']>;
  timePriceS3_gt?: InputMaybe<Scalars['BigInt']>;
  timePriceS3_gte?: InputMaybe<Scalars['BigInt']>;
  timePriceS3_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timePriceS3_lt?: InputMaybe<Scalars['BigInt']>;
  timePriceS3_lte?: InputMaybe<Scalars['BigInt']>;
  timePriceS3_not?: InputMaybe<Scalars['BigInt']>;
  timePriceS3_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export enum UpdatePrice_OrderBy {
  Id = 'id',
  OracleS2Addr = 'oracleS2Addr',
  OracleS3Addr = 'oracleS3Addr',
  PerpetualId = 'perpetualId',
  SpotPriceS2 = 'spotPriceS2',
  SpotPriceS3 = 'spotPriceS3',
  TimePriceS2 = 'timePriceS2',
  TimePriceS3 = 'timePriceS3',
}

export type UpdateReprTradeSizes = {
  __typename?: 'UpdateReprTradeSizes';
  blockTimestamp: Scalars['BigInt'];
  fCurrentAMMExposureEMALong: Scalars['BigInt'];
  fCurrentAMMExposureEMAShort: Scalars['BigInt'];
  fCurrentTraderExposureEMA: Scalars['BigInt'];
  id: Scalars['ID'];
  perpetualId: Scalars['Bytes'];
};

export type UpdateReprTradeSizes_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fCurrentAMMExposureEMALong?: InputMaybe<Scalars['BigInt']>;
  fCurrentAMMExposureEMALong_gt?: InputMaybe<Scalars['BigInt']>;
  fCurrentAMMExposureEMALong_gte?: InputMaybe<Scalars['BigInt']>;
  fCurrentAMMExposureEMALong_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fCurrentAMMExposureEMALong_lt?: InputMaybe<Scalars['BigInt']>;
  fCurrentAMMExposureEMALong_lte?: InputMaybe<Scalars['BigInt']>;
  fCurrentAMMExposureEMALong_not?: InputMaybe<Scalars['BigInt']>;
  fCurrentAMMExposureEMALong_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fCurrentAMMExposureEMAShort?: InputMaybe<Scalars['BigInt']>;
  fCurrentAMMExposureEMAShort_gt?: InputMaybe<Scalars['BigInt']>;
  fCurrentAMMExposureEMAShort_gte?: InputMaybe<Scalars['BigInt']>;
  fCurrentAMMExposureEMAShort_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fCurrentAMMExposureEMAShort_lt?: InputMaybe<Scalars['BigInt']>;
  fCurrentAMMExposureEMAShort_lte?: InputMaybe<Scalars['BigInt']>;
  fCurrentAMMExposureEMAShort_not?: InputMaybe<Scalars['BigInt']>;
  fCurrentAMMExposureEMAShort_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fCurrentTraderExposureEMA?: InputMaybe<Scalars['BigInt']>;
  fCurrentTraderExposureEMA_gt?: InputMaybe<Scalars['BigInt']>;
  fCurrentTraderExposureEMA_gte?: InputMaybe<Scalars['BigInt']>;
  fCurrentTraderExposureEMA_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fCurrentTraderExposureEMA_lt?: InputMaybe<Scalars['BigInt']>;
  fCurrentTraderExposureEMA_lte?: InputMaybe<Scalars['BigInt']>;
  fCurrentTraderExposureEMA_not?: InputMaybe<Scalars['BigInt']>;
  fCurrentTraderExposureEMA_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  perpetualId?: InputMaybe<Scalars['Bytes']>;
  perpetualId_contains?: InputMaybe<Scalars['Bytes']>;
  perpetualId_in?: InputMaybe<Array<Scalars['Bytes']>>;
  perpetualId_not?: InputMaybe<Scalars['Bytes']>;
  perpetualId_not_contains?: InputMaybe<Scalars['Bytes']>;
  perpetualId_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum UpdateReprTradeSizes_OrderBy {
  BlockTimestamp = 'blockTimestamp',
  FCurrentAmmExposureEmaLong = 'fCurrentAMMExposureEMALong',
  FCurrentAmmExposureEmaShort = 'fCurrentAMMExposureEMAShort',
  FCurrentTraderExposureEma = 'fCurrentTraderExposureEMA',
  Id = 'id',
  PerpetualId = 'perpetualId',
}

export type UpdateUnitAccumulatedFunding = {
  __typename?: 'UpdateUnitAccumulatedFunding';
  id: Scalars['ID'];
  perpetualId: Scalars['Bytes'];
  unitAccumulativeFunding: Scalars['BigInt'];
};

export type UpdateUnitAccumulatedFunding_Filter = {
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
  perpetualId?: InputMaybe<Scalars['Bytes']>;
  perpetualId_contains?: InputMaybe<Scalars['Bytes']>;
  perpetualId_in?: InputMaybe<Array<Scalars['Bytes']>>;
  perpetualId_not?: InputMaybe<Scalars['Bytes']>;
  perpetualId_not_contains?: InputMaybe<Scalars['Bytes']>;
  perpetualId_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  unitAccumulativeFunding?: InputMaybe<Scalars['BigInt']>;
  unitAccumulativeFunding_gt?: InputMaybe<Scalars['BigInt']>;
  unitAccumulativeFunding_gte?: InputMaybe<Scalars['BigInt']>;
  unitAccumulativeFunding_in?: InputMaybe<Array<Scalars['BigInt']>>;
  unitAccumulativeFunding_lt?: InputMaybe<Scalars['BigInt']>;
  unitAccumulativeFunding_lte?: InputMaybe<Scalars['BigInt']>;
  unitAccumulativeFunding_not?: InputMaybe<Scalars['BigInt']>;
  unitAccumulativeFunding_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export enum UpdateUnitAccumulatedFunding_OrderBy {
  Id = 'id',
  PerpetualId = 'perpetualId',
  UnitAccumulativeFunding = 'unitAccumulativeFunding',
}

export type _Block_ = {
  __typename?: '_Block_';
  /** The hash of the block */
  hash?: Maybe<Scalars['Bytes']>;
  /** The block number */
  number: Scalars['Int'];
  /** Integer representation of the timestamp stored in blocks for the chain */
  timestamp?: Maybe<Scalars['Int']>;
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

export type GetTradesQueryVariables = Exact<{ [key: string]: never }>;

export type GetTradesQuery = {
  __typename?: 'Query';
  trades: Array<{
    __typename?: 'Trade';
    id: string;
    price: any;
    trader: { __typename?: 'Trader'; id: string };
  }>;
};

export const GetTradesDocument = gql`
  query getTrades {
    trades {
      id
      trader {
        id
      }
      price
    }
  }
`;

/**
 * __useGetTradesQuery__
 *
 * To run a query within a React component, call `useGetTradesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTradesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTradesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetTradesQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetTradesQuery,
    GetTradesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetTradesQuery, GetTradesQueryVariables>(
    GetTradesDocument,
    options,
  );
}
export function useGetTradesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetTradesQuery,
    GetTradesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetTradesQuery, GetTradesQueryVariables>(
    GetTradesDocument,
    options,
  );
}
export type GetTradesQueryHookResult = ReturnType<typeof useGetTradesQuery>;
export type GetTradesLazyQueryHookResult = ReturnType<
  typeof useGetTradesLazyQuery
>;
export type GetTradesQueryResult = Apollo.QueryResult<
  GetTradesQuery,
  GetTradesQueryVariables
>;
