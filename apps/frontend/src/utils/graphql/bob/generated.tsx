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

/**
 * Reflects sequences of changes necessary to accurately calculate aggregate statistics
 * such as volume, TVL and fees collected
 *
 */
export type AggEvent = {
  __typename?: 'AggEvent';
  askTick?: Maybe<Scalars['Int']>;
  baseFlow?: Maybe<Scalars['BigInt']>;
  bidTick?: Maybe<Scalars['Int']>;
  block: Scalars['BigInt'];
  eventIndex: Scalars['Int'];
  feeRate?: Maybe<Scalars['Int']>;
  flowsAtMarket: Scalars['Boolean'];
  id: Scalars['Bytes'];
  inBaseQty: Scalars['Boolean'];
  isFeeChange: Scalars['Boolean'];
  isLiq: Scalars['Boolean'];
  isSwap: Scalars['Boolean'];
  isTickSkewed: Scalars['Boolean'];
  pool: Pool;
  quoteFlow?: Maybe<Scalars['BigInt']>;
  swapPrice?: Maybe<Scalars['BigDecimal']>;
  time: Scalars['BigInt'];
  transactionHash: Scalars['Bytes'];
};

export type AggEvent_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  askTick?: InputMaybe<Scalars['Int']>;
  askTick_gt?: InputMaybe<Scalars['Int']>;
  askTick_gte?: InputMaybe<Scalars['Int']>;
  askTick_in?: InputMaybe<Array<Scalars['Int']>>;
  askTick_lt?: InputMaybe<Scalars['Int']>;
  askTick_lte?: InputMaybe<Scalars['Int']>;
  askTick_not?: InputMaybe<Scalars['Int']>;
  askTick_not_in?: InputMaybe<Array<Scalars['Int']>>;
  baseFlow?: InputMaybe<Scalars['BigInt']>;
  baseFlow_gt?: InputMaybe<Scalars['BigInt']>;
  baseFlow_gte?: InputMaybe<Scalars['BigInt']>;
  baseFlow_in?: InputMaybe<Array<Scalars['BigInt']>>;
  baseFlow_lt?: InputMaybe<Scalars['BigInt']>;
  baseFlow_lte?: InputMaybe<Scalars['BigInt']>;
  baseFlow_not?: InputMaybe<Scalars['BigInt']>;
  baseFlow_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  bidTick?: InputMaybe<Scalars['Int']>;
  bidTick_gt?: InputMaybe<Scalars['Int']>;
  bidTick_gte?: InputMaybe<Scalars['Int']>;
  bidTick_in?: InputMaybe<Array<Scalars['Int']>>;
  bidTick_lt?: InputMaybe<Scalars['Int']>;
  bidTick_lte?: InputMaybe<Scalars['Int']>;
  bidTick_not?: InputMaybe<Scalars['Int']>;
  bidTick_not_in?: InputMaybe<Array<Scalars['Int']>>;
  block?: InputMaybe<Scalars['BigInt']>;
  block_gt?: InputMaybe<Scalars['BigInt']>;
  block_gte?: InputMaybe<Scalars['BigInt']>;
  block_in?: InputMaybe<Array<Scalars['BigInt']>>;
  block_lt?: InputMaybe<Scalars['BigInt']>;
  block_lte?: InputMaybe<Scalars['BigInt']>;
  block_not?: InputMaybe<Scalars['BigInt']>;
  block_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  eventIndex?: InputMaybe<Scalars['Int']>;
  eventIndex_gt?: InputMaybe<Scalars['Int']>;
  eventIndex_gte?: InputMaybe<Scalars['Int']>;
  eventIndex_in?: InputMaybe<Array<Scalars['Int']>>;
  eventIndex_lt?: InputMaybe<Scalars['Int']>;
  eventIndex_lte?: InputMaybe<Scalars['Int']>;
  eventIndex_not?: InputMaybe<Scalars['Int']>;
  eventIndex_not_in?: InputMaybe<Array<Scalars['Int']>>;
  feeRate?: InputMaybe<Scalars['Int']>;
  feeRate_gt?: InputMaybe<Scalars['Int']>;
  feeRate_gte?: InputMaybe<Scalars['Int']>;
  feeRate_in?: InputMaybe<Array<Scalars['Int']>>;
  feeRate_lt?: InputMaybe<Scalars['Int']>;
  feeRate_lte?: InputMaybe<Scalars['Int']>;
  feeRate_not?: InputMaybe<Scalars['Int']>;
  feeRate_not_in?: InputMaybe<Array<Scalars['Int']>>;
  flowsAtMarket?: InputMaybe<Scalars['Boolean']>;
  flowsAtMarket_in?: InputMaybe<Array<Scalars['Boolean']>>;
  flowsAtMarket_not?: InputMaybe<Scalars['Boolean']>;
  flowsAtMarket_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  id?: InputMaybe<Scalars['Bytes']>;
  id_contains?: InputMaybe<Scalars['Bytes']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id_not?: InputMaybe<Scalars['Bytes']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  inBaseQty?: InputMaybe<Scalars['Boolean']>;
  inBaseQty_in?: InputMaybe<Array<Scalars['Boolean']>>;
  inBaseQty_not?: InputMaybe<Scalars['Boolean']>;
  inBaseQty_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  isFeeChange?: InputMaybe<Scalars['Boolean']>;
  isFeeChange_in?: InputMaybe<Array<Scalars['Boolean']>>;
  isFeeChange_not?: InputMaybe<Scalars['Boolean']>;
  isFeeChange_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  isLiq?: InputMaybe<Scalars['Boolean']>;
  isLiq_in?: InputMaybe<Array<Scalars['Boolean']>>;
  isLiq_not?: InputMaybe<Scalars['Boolean']>;
  isLiq_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  isSwap?: InputMaybe<Scalars['Boolean']>;
  isSwap_in?: InputMaybe<Array<Scalars['Boolean']>>;
  isSwap_not?: InputMaybe<Scalars['Boolean']>;
  isSwap_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  isTickSkewed?: InputMaybe<Scalars['Boolean']>;
  isTickSkewed_in?: InputMaybe<Array<Scalars['Boolean']>>;
  isTickSkewed_not?: InputMaybe<Scalars['Boolean']>;
  isTickSkewed_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  pool?: InputMaybe<Scalars['String']>;
  pool_?: InputMaybe<Pool_Filter>;
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
  quoteFlow?: InputMaybe<Scalars['BigInt']>;
  quoteFlow_gt?: InputMaybe<Scalars['BigInt']>;
  quoteFlow_gte?: InputMaybe<Scalars['BigInt']>;
  quoteFlow_in?: InputMaybe<Array<Scalars['BigInt']>>;
  quoteFlow_lt?: InputMaybe<Scalars['BigInt']>;
  quoteFlow_lte?: InputMaybe<Scalars['BigInt']>;
  quoteFlow_not?: InputMaybe<Scalars['BigInt']>;
  quoteFlow_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  swapPrice?: InputMaybe<Scalars['BigDecimal']>;
  swapPrice_gt?: InputMaybe<Scalars['BigDecimal']>;
  swapPrice_gte?: InputMaybe<Scalars['BigDecimal']>;
  swapPrice_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  swapPrice_lt?: InputMaybe<Scalars['BigDecimal']>;
  swapPrice_lte?: InputMaybe<Scalars['BigDecimal']>;
  swapPrice_not?: InputMaybe<Scalars['BigDecimal']>;
  swapPrice_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  time?: InputMaybe<Scalars['BigInt']>;
  time_gt?: InputMaybe<Scalars['BigInt']>;
  time_gte?: InputMaybe<Scalars['BigInt']>;
  time_in?: InputMaybe<Array<Scalars['BigInt']>>;
  time_lt?: InputMaybe<Scalars['BigInt']>;
  time_lte?: InputMaybe<Scalars['BigInt']>;
  time_not?: InputMaybe<Scalars['BigInt']>;
  time_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  transactionHash?: InputMaybe<Scalars['Bytes']>;
  transactionHash_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transactionHash_not?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum AggEvent_OrderBy {
  AskTick = 'askTick',
  BaseFlow = 'baseFlow',
  BidTick = 'bidTick',
  Block = 'block',
  EventIndex = 'eventIndex',
  FeeRate = 'feeRate',
  FlowsAtMarket = 'flowsAtMarket',
  Id = 'id',
  InBaseQty = 'inBaseQty',
  IsFeeChange = 'isFeeChange',
  IsLiq = 'isLiq',
  IsSwap = 'isSwap',
  IsTickSkewed = 'isTickSkewed',
  Pool = 'pool',
  QuoteFlow = 'quoteFlow',
  SwapPrice = 'swapPrice',
  Time = 'time',
  TransactionHash = 'transactionHash',
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
 * A FeeChange represents an update to the swap fee setting on a given SdexSwap
 * liquidity pool.
 *
 */
export type FeeChange = {
  __typename?: 'FeeChange';
  block: Scalars['BigInt'];
  callIndex: Scalars['Int'];
  feeRate: Scalars['Int'];
  id: Scalars['Bytes'];
  pool: Pool;
  time: Scalars['BigInt'];
  transactionHash: Scalars['Bytes'];
};

export type FeeChange_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  block?: InputMaybe<Scalars['BigInt']>;
  block_gt?: InputMaybe<Scalars['BigInt']>;
  block_gte?: InputMaybe<Scalars['BigInt']>;
  block_in?: InputMaybe<Array<Scalars['BigInt']>>;
  block_lt?: InputMaybe<Scalars['BigInt']>;
  block_lte?: InputMaybe<Scalars['BigInt']>;
  block_not?: InputMaybe<Scalars['BigInt']>;
  block_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  callIndex?: InputMaybe<Scalars['Int']>;
  callIndex_gt?: InputMaybe<Scalars['Int']>;
  callIndex_gte?: InputMaybe<Scalars['Int']>;
  callIndex_in?: InputMaybe<Array<Scalars['Int']>>;
  callIndex_lt?: InputMaybe<Scalars['Int']>;
  callIndex_lte?: InputMaybe<Scalars['Int']>;
  callIndex_not?: InputMaybe<Scalars['Int']>;
  callIndex_not_in?: InputMaybe<Array<Scalars['Int']>>;
  feeRate?: InputMaybe<Scalars['Int']>;
  feeRate_gt?: InputMaybe<Scalars['Int']>;
  feeRate_gte?: InputMaybe<Scalars['Int']>;
  feeRate_in?: InputMaybe<Array<Scalars['Int']>>;
  feeRate_lt?: InputMaybe<Scalars['Int']>;
  feeRate_lte?: InputMaybe<Scalars['Int']>;
  feeRate_not?: InputMaybe<Scalars['Int']>;
  feeRate_not_in?: InputMaybe<Array<Scalars['Int']>>;
  id?: InputMaybe<Scalars['Bytes']>;
  id_contains?: InputMaybe<Scalars['Bytes']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id_not?: InputMaybe<Scalars['Bytes']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  pool?: InputMaybe<Scalars['String']>;
  pool_?: InputMaybe<Pool_Filter>;
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
  time?: InputMaybe<Scalars['BigInt']>;
  time_gt?: InputMaybe<Scalars['BigInt']>;
  time_gte?: InputMaybe<Scalars['BigInt']>;
  time_in?: InputMaybe<Array<Scalars['BigInt']>>;
  time_lt?: InputMaybe<Scalars['BigInt']>;
  time_lte?: InputMaybe<Scalars['BigInt']>;
  time_not?: InputMaybe<Scalars['BigInt']>;
  time_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  transactionHash?: InputMaybe<Scalars['Bytes']>;
  transactionHash_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transactionHash_not?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum FeeChange_OrderBy {
  Block = 'block',
  CallIndex = 'callIndex',
  FeeRate = 'feeRate',
  Id = 'id',
  Pool = 'pool',
  Time = 'time',
  TransactionHash = 'transactionHash',
}

/**
 * A KnockoutCross is an exact copy of the data emitted in a KnockoutCross event
 * emitted by the SdexSwap DEX. There is an exact 1:1 correspondence between
 * emitted events and KnockoutCross entities created by the subgraph.
 *
 */
export type KnockoutCross = {
  __typename?: 'KnockoutCross';
  block: Scalars['BigInt'];
  feeMileage: Scalars['BigInt'];
  id: Scalars['Bytes'];
  isBid: Scalars['Boolean'];
  pivotTime: Scalars['BigInt'];
  pool: Pool;
  tick: Scalars['Int'];
  time: Scalars['BigInt'];
  transactionHash: Scalars['Bytes'];
};

export type KnockoutCross_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  block?: InputMaybe<Scalars['BigInt']>;
  block_gt?: InputMaybe<Scalars['BigInt']>;
  block_gte?: InputMaybe<Scalars['BigInt']>;
  block_in?: InputMaybe<Array<Scalars['BigInt']>>;
  block_lt?: InputMaybe<Scalars['BigInt']>;
  block_lte?: InputMaybe<Scalars['BigInt']>;
  block_not?: InputMaybe<Scalars['BigInt']>;
  block_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  feeMileage?: InputMaybe<Scalars['BigInt']>;
  feeMileage_gt?: InputMaybe<Scalars['BigInt']>;
  feeMileage_gte?: InputMaybe<Scalars['BigInt']>;
  feeMileage_in?: InputMaybe<Array<Scalars['BigInt']>>;
  feeMileage_lt?: InputMaybe<Scalars['BigInt']>;
  feeMileage_lte?: InputMaybe<Scalars['BigInt']>;
  feeMileage_not?: InputMaybe<Scalars['BigInt']>;
  feeMileage_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['Bytes']>;
  id_contains?: InputMaybe<Scalars['Bytes']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id_not?: InputMaybe<Scalars['Bytes']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  isBid?: InputMaybe<Scalars['Boolean']>;
  isBid_in?: InputMaybe<Array<Scalars['Boolean']>>;
  isBid_not?: InputMaybe<Scalars['Boolean']>;
  isBid_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  pivotTime?: InputMaybe<Scalars['BigInt']>;
  pivotTime_gt?: InputMaybe<Scalars['BigInt']>;
  pivotTime_gte?: InputMaybe<Scalars['BigInt']>;
  pivotTime_in?: InputMaybe<Array<Scalars['BigInt']>>;
  pivotTime_lt?: InputMaybe<Scalars['BigInt']>;
  pivotTime_lte?: InputMaybe<Scalars['BigInt']>;
  pivotTime_not?: InputMaybe<Scalars['BigInt']>;
  pivotTime_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  pool?: InputMaybe<Scalars['String']>;
  pool_?: InputMaybe<Pool_Filter>;
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
  tick?: InputMaybe<Scalars['Int']>;
  tick_gt?: InputMaybe<Scalars['Int']>;
  tick_gte?: InputMaybe<Scalars['Int']>;
  tick_in?: InputMaybe<Array<Scalars['Int']>>;
  tick_lt?: InputMaybe<Scalars['Int']>;
  tick_lte?: InputMaybe<Scalars['Int']>;
  tick_not?: InputMaybe<Scalars['Int']>;
  tick_not_in?: InputMaybe<Array<Scalars['Int']>>;
  time?: InputMaybe<Scalars['BigInt']>;
  time_gt?: InputMaybe<Scalars['BigInt']>;
  time_gte?: InputMaybe<Scalars['BigInt']>;
  time_in?: InputMaybe<Array<Scalars['BigInt']>>;
  time_lt?: InputMaybe<Scalars['BigInt']>;
  time_lte?: InputMaybe<Scalars['BigInt']>;
  time_not?: InputMaybe<Scalars['BigInt']>;
  time_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  transactionHash?: InputMaybe<Scalars['Bytes']>;
  transactionHash_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transactionHash_not?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum KnockoutCross_OrderBy {
  Block = 'block',
  FeeMileage = 'feeMileage',
  Id = 'id',
  IsBid = 'isBid',
  PivotTime = 'pivotTime',
  Pool = 'pool',
  Tick = 'tick',
  Time = 'time',
  TransactionHash = 'transactionHash',
}

/**
 * LatestIndex entities are used to help perform bookkeeping related to the
 * generation of unique event IDs in the case where multiple identical entities
 * would otherwise be created within the same transaction.
 *
 */
export type LatestIndex = {
  __typename?: 'LatestIndex';
  callIndex: Scalars['Int'];
  id: Scalars['Bytes'];
};

export type LatestIndex_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  callIndex?: InputMaybe<Scalars['Int']>;
  callIndex_gt?: InputMaybe<Scalars['Int']>;
  callIndex_gte?: InputMaybe<Scalars['Int']>;
  callIndex_in?: InputMaybe<Array<Scalars['Int']>>;
  callIndex_lt?: InputMaybe<Scalars['Int']>;
  callIndex_lte?: InputMaybe<Scalars['Int']>;
  callIndex_not?: InputMaybe<Scalars['Int']>;
  callIndex_not_in?: InputMaybe<Array<Scalars['Int']>>;
  id?: InputMaybe<Scalars['Bytes']>;
  id_contains?: InputMaybe<Scalars['Bytes']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id_not?: InputMaybe<Scalars['Bytes']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum LatestIndex_OrderBy {
  CallIndex = 'callIndex',
  Id = 'id',
}

/**
 * A LiquidityChange entity represents a single modification to a single
 * liquidity position made on SdexSwap. LiquidityChanges are categorized
 * according to their changeType, which can be equal to mint, burn, harvest,
 * claim, or recover.
 *
 */
export type LiquidityChange = {
  __typename?: 'LiquidityChange';
  askTick?: Maybe<Scalars['Int']>;
  baseFlow?: Maybe<Scalars['BigInt']>;
  bidTick?: Maybe<Scalars['Int']>;
  block: Scalars['BigInt'];
  callIndex: Scalars['Int'];
  callSource: Scalars['String'];
  changeType: Scalars['String'];
  id: Scalars['Bytes'];
  isBid: Scalars['Boolean'];
  liq?: Maybe<Scalars['BigInt']>;
  pivotTime?: Maybe<Scalars['BigInt']>;
  pool: Pool;
  positionType: Scalars['String'];
  quoteFlow?: Maybe<Scalars['BigInt']>;
  time: Scalars['BigInt'];
  transactionHash: Scalars['Bytes'];
  user: Scalars['Bytes'];
};

export type LiquidityChange_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  askTick?: InputMaybe<Scalars['Int']>;
  askTick_gt?: InputMaybe<Scalars['Int']>;
  askTick_gte?: InputMaybe<Scalars['Int']>;
  askTick_in?: InputMaybe<Array<Scalars['Int']>>;
  askTick_lt?: InputMaybe<Scalars['Int']>;
  askTick_lte?: InputMaybe<Scalars['Int']>;
  askTick_not?: InputMaybe<Scalars['Int']>;
  askTick_not_in?: InputMaybe<Array<Scalars['Int']>>;
  baseFlow?: InputMaybe<Scalars['BigInt']>;
  baseFlow_gt?: InputMaybe<Scalars['BigInt']>;
  baseFlow_gte?: InputMaybe<Scalars['BigInt']>;
  baseFlow_in?: InputMaybe<Array<Scalars['BigInt']>>;
  baseFlow_lt?: InputMaybe<Scalars['BigInt']>;
  baseFlow_lte?: InputMaybe<Scalars['BigInt']>;
  baseFlow_not?: InputMaybe<Scalars['BigInt']>;
  baseFlow_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  bidTick?: InputMaybe<Scalars['Int']>;
  bidTick_gt?: InputMaybe<Scalars['Int']>;
  bidTick_gte?: InputMaybe<Scalars['Int']>;
  bidTick_in?: InputMaybe<Array<Scalars['Int']>>;
  bidTick_lt?: InputMaybe<Scalars['Int']>;
  bidTick_lte?: InputMaybe<Scalars['Int']>;
  bidTick_not?: InputMaybe<Scalars['Int']>;
  bidTick_not_in?: InputMaybe<Array<Scalars['Int']>>;
  block?: InputMaybe<Scalars['BigInt']>;
  block_gt?: InputMaybe<Scalars['BigInt']>;
  block_gte?: InputMaybe<Scalars['BigInt']>;
  block_in?: InputMaybe<Array<Scalars['BigInt']>>;
  block_lt?: InputMaybe<Scalars['BigInt']>;
  block_lte?: InputMaybe<Scalars['BigInt']>;
  block_not?: InputMaybe<Scalars['BigInt']>;
  block_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  callIndex?: InputMaybe<Scalars['Int']>;
  callIndex_gt?: InputMaybe<Scalars['Int']>;
  callIndex_gte?: InputMaybe<Scalars['Int']>;
  callIndex_in?: InputMaybe<Array<Scalars['Int']>>;
  callIndex_lt?: InputMaybe<Scalars['Int']>;
  callIndex_lte?: InputMaybe<Scalars['Int']>;
  callIndex_not?: InputMaybe<Scalars['Int']>;
  callIndex_not_in?: InputMaybe<Array<Scalars['Int']>>;
  callSource?: InputMaybe<Scalars['String']>;
  callSource_contains?: InputMaybe<Scalars['String']>;
  callSource_contains_nocase?: InputMaybe<Scalars['String']>;
  callSource_ends_with?: InputMaybe<Scalars['String']>;
  callSource_ends_with_nocase?: InputMaybe<Scalars['String']>;
  callSource_gt?: InputMaybe<Scalars['String']>;
  callSource_gte?: InputMaybe<Scalars['String']>;
  callSource_in?: InputMaybe<Array<Scalars['String']>>;
  callSource_lt?: InputMaybe<Scalars['String']>;
  callSource_lte?: InputMaybe<Scalars['String']>;
  callSource_not?: InputMaybe<Scalars['String']>;
  callSource_not_contains?: InputMaybe<Scalars['String']>;
  callSource_not_contains_nocase?: InputMaybe<Scalars['String']>;
  callSource_not_ends_with?: InputMaybe<Scalars['String']>;
  callSource_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  callSource_not_in?: InputMaybe<Array<Scalars['String']>>;
  callSource_not_starts_with?: InputMaybe<Scalars['String']>;
  callSource_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  callSource_starts_with?: InputMaybe<Scalars['String']>;
  callSource_starts_with_nocase?: InputMaybe<Scalars['String']>;
  changeType?: InputMaybe<Scalars['String']>;
  changeType_contains?: InputMaybe<Scalars['String']>;
  changeType_contains_nocase?: InputMaybe<Scalars['String']>;
  changeType_ends_with?: InputMaybe<Scalars['String']>;
  changeType_ends_with_nocase?: InputMaybe<Scalars['String']>;
  changeType_gt?: InputMaybe<Scalars['String']>;
  changeType_gte?: InputMaybe<Scalars['String']>;
  changeType_in?: InputMaybe<Array<Scalars['String']>>;
  changeType_lt?: InputMaybe<Scalars['String']>;
  changeType_lte?: InputMaybe<Scalars['String']>;
  changeType_not?: InputMaybe<Scalars['String']>;
  changeType_not_contains?: InputMaybe<Scalars['String']>;
  changeType_not_contains_nocase?: InputMaybe<Scalars['String']>;
  changeType_not_ends_with?: InputMaybe<Scalars['String']>;
  changeType_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  changeType_not_in?: InputMaybe<Array<Scalars['String']>>;
  changeType_not_starts_with?: InputMaybe<Scalars['String']>;
  changeType_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  changeType_starts_with?: InputMaybe<Scalars['String']>;
  changeType_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['Bytes']>;
  id_contains?: InputMaybe<Scalars['Bytes']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id_not?: InputMaybe<Scalars['Bytes']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  isBid?: InputMaybe<Scalars['Boolean']>;
  isBid_in?: InputMaybe<Array<Scalars['Boolean']>>;
  isBid_not?: InputMaybe<Scalars['Boolean']>;
  isBid_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  liq?: InputMaybe<Scalars['BigInt']>;
  liq_gt?: InputMaybe<Scalars['BigInt']>;
  liq_gte?: InputMaybe<Scalars['BigInt']>;
  liq_in?: InputMaybe<Array<Scalars['BigInt']>>;
  liq_lt?: InputMaybe<Scalars['BigInt']>;
  liq_lte?: InputMaybe<Scalars['BigInt']>;
  liq_not?: InputMaybe<Scalars['BigInt']>;
  liq_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  pivotTime?: InputMaybe<Scalars['BigInt']>;
  pivotTime_gt?: InputMaybe<Scalars['BigInt']>;
  pivotTime_gte?: InputMaybe<Scalars['BigInt']>;
  pivotTime_in?: InputMaybe<Array<Scalars['BigInt']>>;
  pivotTime_lt?: InputMaybe<Scalars['BigInt']>;
  pivotTime_lte?: InputMaybe<Scalars['BigInt']>;
  pivotTime_not?: InputMaybe<Scalars['BigInt']>;
  pivotTime_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  pool?: InputMaybe<Scalars['String']>;
  pool_?: InputMaybe<Pool_Filter>;
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
  positionType?: InputMaybe<Scalars['String']>;
  positionType_contains?: InputMaybe<Scalars['String']>;
  positionType_contains_nocase?: InputMaybe<Scalars['String']>;
  positionType_ends_with?: InputMaybe<Scalars['String']>;
  positionType_ends_with_nocase?: InputMaybe<Scalars['String']>;
  positionType_gt?: InputMaybe<Scalars['String']>;
  positionType_gte?: InputMaybe<Scalars['String']>;
  positionType_in?: InputMaybe<Array<Scalars['String']>>;
  positionType_lt?: InputMaybe<Scalars['String']>;
  positionType_lte?: InputMaybe<Scalars['String']>;
  positionType_not?: InputMaybe<Scalars['String']>;
  positionType_not_contains?: InputMaybe<Scalars['String']>;
  positionType_not_contains_nocase?: InputMaybe<Scalars['String']>;
  positionType_not_ends_with?: InputMaybe<Scalars['String']>;
  positionType_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  positionType_not_in?: InputMaybe<Array<Scalars['String']>>;
  positionType_not_starts_with?: InputMaybe<Scalars['String']>;
  positionType_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  positionType_starts_with?: InputMaybe<Scalars['String']>;
  positionType_starts_with_nocase?: InputMaybe<Scalars['String']>;
  quoteFlow?: InputMaybe<Scalars['BigInt']>;
  quoteFlow_gt?: InputMaybe<Scalars['BigInt']>;
  quoteFlow_gte?: InputMaybe<Scalars['BigInt']>;
  quoteFlow_in?: InputMaybe<Array<Scalars['BigInt']>>;
  quoteFlow_lt?: InputMaybe<Scalars['BigInt']>;
  quoteFlow_lte?: InputMaybe<Scalars['BigInt']>;
  quoteFlow_not?: InputMaybe<Scalars['BigInt']>;
  quoteFlow_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  time?: InputMaybe<Scalars['BigInt']>;
  time_gt?: InputMaybe<Scalars['BigInt']>;
  time_gte?: InputMaybe<Scalars['BigInt']>;
  time_in?: InputMaybe<Array<Scalars['BigInt']>>;
  time_lt?: InputMaybe<Scalars['BigInt']>;
  time_lte?: InputMaybe<Scalars['BigInt']>;
  time_not?: InputMaybe<Scalars['BigInt']>;
  time_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  transactionHash?: InputMaybe<Scalars['Bytes']>;
  transactionHash_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transactionHash_not?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  user?: InputMaybe<Scalars['Bytes']>;
  user_contains?: InputMaybe<Scalars['Bytes']>;
  user_in?: InputMaybe<Array<Scalars['Bytes']>>;
  user_not?: InputMaybe<Scalars['Bytes']>;
  user_not_contains?: InputMaybe<Scalars['Bytes']>;
  user_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum LiquidityChange_OrderBy {
  AskTick = 'askTick',
  BaseFlow = 'baseFlow',
  BidTick = 'bidTick',
  Block = 'block',
  CallIndex = 'callIndex',
  CallSource = 'callSource',
  ChangeType = 'changeType',
  Id = 'id',
  IsBid = 'isBid',
  Liq = 'liq',
  PivotTime = 'pivotTime',
  Pool = 'pool',
  PositionType = 'positionType',
  QuoteFlow = 'quoteFlow',
  Time = 'time',
  TransactionHash = 'transactionHash',
  User = 'user',
}

/** Defines the order direction, either ascending or descending */
export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc',
}

/**
 * A Pool represents a single liquidity pool on SdexSwap, which is uniquely
 * specified by a base token, a quote token, and a poolIdx. The ID of the Pool
 * is the same as the poolHash used internally in SdexSwap contracts.
 *
 */
export type Pool = {
  __typename?: 'Pool';
  base: Scalars['Bytes'];
  blockCreate: Scalars['BigInt'];
  id: Scalars['Bytes'];
  liquidityChanges: Array<LiquidityChange>;
  poolIdx: Scalars['BigInt'];
  quote: Scalars['Bytes'];
  swaps: Array<Swap>;
  template?: Maybe<PoolTemplate>;
  timeCreate: Scalars['BigInt'];
};

/**
 * A Pool represents a single liquidity pool on SdexSwap, which is uniquely
 * specified by a base token, a quote token, and a poolIdx. The ID of the Pool
 * is the same as the poolHash used internally in SdexSwap contracts.
 *
 */
export type PoolLiquidityChangesArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<LiquidityChange_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<LiquidityChange_Filter>;
};

/**
 * A Pool represents a single liquidity pool on SdexSwap, which is uniquely
 * specified by a base token, a quote token, and a poolIdx. The ID of the Pool
 * is the same as the poolHash used internally in SdexSwap contracts.
 *
 */
export type PoolSwapsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Swap_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Swap_Filter>;
};

/**
 * PoolTemplate represents a pool type pattern to create new pools
 *
 */
export type PoolTemplate = {
  __typename?: 'PoolTemplate';
  blockInit: Scalars['BigInt'];
  blockRevise: Scalars['BigInt'];
  enabled: Scalars['Boolean'];
  feeRate: Scalars['Int'];
  id: Scalars['Bytes'];
  poolIdx: Scalars['BigInt'];
  pools: Array<Pool>;
  timeInit: Scalars['BigInt'];
  timeRevise: Scalars['BigInt'];
};

/**
 * PoolTemplate represents a pool type pattern to create new pools
 *
 */
export type PoolTemplatePoolsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Pool_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Pool_Filter>;
};

export type PoolTemplate_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  blockInit?: InputMaybe<Scalars['BigInt']>;
  blockInit_gt?: InputMaybe<Scalars['BigInt']>;
  blockInit_gte?: InputMaybe<Scalars['BigInt']>;
  blockInit_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockInit_lt?: InputMaybe<Scalars['BigInt']>;
  blockInit_lte?: InputMaybe<Scalars['BigInt']>;
  blockInit_not?: InputMaybe<Scalars['BigInt']>;
  blockInit_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockRevise?: InputMaybe<Scalars['BigInt']>;
  blockRevise_gt?: InputMaybe<Scalars['BigInt']>;
  blockRevise_gte?: InputMaybe<Scalars['BigInt']>;
  blockRevise_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockRevise_lt?: InputMaybe<Scalars['BigInt']>;
  blockRevise_lte?: InputMaybe<Scalars['BigInt']>;
  blockRevise_not?: InputMaybe<Scalars['BigInt']>;
  blockRevise_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  enabled?: InputMaybe<Scalars['Boolean']>;
  enabled_in?: InputMaybe<Array<Scalars['Boolean']>>;
  enabled_not?: InputMaybe<Scalars['Boolean']>;
  enabled_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  feeRate?: InputMaybe<Scalars['Int']>;
  feeRate_gt?: InputMaybe<Scalars['Int']>;
  feeRate_gte?: InputMaybe<Scalars['Int']>;
  feeRate_in?: InputMaybe<Array<Scalars['Int']>>;
  feeRate_lt?: InputMaybe<Scalars['Int']>;
  feeRate_lte?: InputMaybe<Scalars['Int']>;
  feeRate_not?: InputMaybe<Scalars['Int']>;
  feeRate_not_in?: InputMaybe<Array<Scalars['Int']>>;
  id?: InputMaybe<Scalars['Bytes']>;
  id_contains?: InputMaybe<Scalars['Bytes']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id_not?: InputMaybe<Scalars['Bytes']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  poolIdx?: InputMaybe<Scalars['BigInt']>;
  poolIdx_gt?: InputMaybe<Scalars['BigInt']>;
  poolIdx_gte?: InputMaybe<Scalars['BigInt']>;
  poolIdx_in?: InputMaybe<Array<Scalars['BigInt']>>;
  poolIdx_lt?: InputMaybe<Scalars['BigInt']>;
  poolIdx_lte?: InputMaybe<Scalars['BigInt']>;
  poolIdx_not?: InputMaybe<Scalars['BigInt']>;
  poolIdx_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  pools_?: InputMaybe<Pool_Filter>;
  timeInit?: InputMaybe<Scalars['BigInt']>;
  timeInit_gt?: InputMaybe<Scalars['BigInt']>;
  timeInit_gte?: InputMaybe<Scalars['BigInt']>;
  timeInit_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timeInit_lt?: InputMaybe<Scalars['BigInt']>;
  timeInit_lte?: InputMaybe<Scalars['BigInt']>;
  timeInit_not?: InputMaybe<Scalars['BigInt']>;
  timeInit_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timeRevise?: InputMaybe<Scalars['BigInt']>;
  timeRevise_gt?: InputMaybe<Scalars['BigInt']>;
  timeRevise_gte?: InputMaybe<Scalars['BigInt']>;
  timeRevise_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timeRevise_lt?: InputMaybe<Scalars['BigInt']>;
  timeRevise_lte?: InputMaybe<Scalars['BigInt']>;
  timeRevise_not?: InputMaybe<Scalars['BigInt']>;
  timeRevise_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export enum PoolTemplate_OrderBy {
  BlockInit = 'blockInit',
  BlockRevise = 'blockRevise',
  Enabled = 'enabled',
  FeeRate = 'feeRate',
  Id = 'id',
  PoolIdx = 'poolIdx',
  Pools = 'pools',
  TimeInit = 'timeInit',
  TimeRevise = 'timeRevise',
}

export type Pool_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  base?: InputMaybe<Scalars['Bytes']>;
  base_contains?: InputMaybe<Scalars['Bytes']>;
  base_in?: InputMaybe<Array<Scalars['Bytes']>>;
  base_not?: InputMaybe<Scalars['Bytes']>;
  base_not_contains?: InputMaybe<Scalars['Bytes']>;
  base_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  blockCreate?: InputMaybe<Scalars['BigInt']>;
  blockCreate_gt?: InputMaybe<Scalars['BigInt']>;
  blockCreate_gte?: InputMaybe<Scalars['BigInt']>;
  blockCreate_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockCreate_lt?: InputMaybe<Scalars['BigInt']>;
  blockCreate_lte?: InputMaybe<Scalars['BigInt']>;
  blockCreate_not?: InputMaybe<Scalars['BigInt']>;
  blockCreate_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['Bytes']>;
  id_contains?: InputMaybe<Scalars['Bytes']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id_not?: InputMaybe<Scalars['Bytes']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  liquidityChanges_?: InputMaybe<LiquidityChange_Filter>;
  poolIdx?: InputMaybe<Scalars['BigInt']>;
  poolIdx_gt?: InputMaybe<Scalars['BigInt']>;
  poolIdx_gte?: InputMaybe<Scalars['BigInt']>;
  poolIdx_in?: InputMaybe<Array<Scalars['BigInt']>>;
  poolIdx_lt?: InputMaybe<Scalars['BigInt']>;
  poolIdx_lte?: InputMaybe<Scalars['BigInt']>;
  poolIdx_not?: InputMaybe<Scalars['BigInt']>;
  poolIdx_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  quote?: InputMaybe<Scalars['Bytes']>;
  quote_contains?: InputMaybe<Scalars['Bytes']>;
  quote_in?: InputMaybe<Array<Scalars['Bytes']>>;
  quote_not?: InputMaybe<Scalars['Bytes']>;
  quote_not_contains?: InputMaybe<Scalars['Bytes']>;
  quote_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  swaps_?: InputMaybe<Swap_Filter>;
  template?: InputMaybe<Scalars['String']>;
  template_?: InputMaybe<PoolTemplate_Filter>;
  template_contains?: InputMaybe<Scalars['String']>;
  template_contains_nocase?: InputMaybe<Scalars['String']>;
  template_ends_with?: InputMaybe<Scalars['String']>;
  template_ends_with_nocase?: InputMaybe<Scalars['String']>;
  template_gt?: InputMaybe<Scalars['String']>;
  template_gte?: InputMaybe<Scalars['String']>;
  template_in?: InputMaybe<Array<Scalars['String']>>;
  template_lt?: InputMaybe<Scalars['String']>;
  template_lte?: InputMaybe<Scalars['String']>;
  template_not?: InputMaybe<Scalars['String']>;
  template_not_contains?: InputMaybe<Scalars['String']>;
  template_not_contains_nocase?: InputMaybe<Scalars['String']>;
  template_not_ends_with?: InputMaybe<Scalars['String']>;
  template_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  template_not_in?: InputMaybe<Array<Scalars['String']>>;
  template_not_starts_with?: InputMaybe<Scalars['String']>;
  template_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  template_starts_with?: InputMaybe<Scalars['String']>;
  template_starts_with_nocase?: InputMaybe<Scalars['String']>;
  timeCreate?: InputMaybe<Scalars['BigInt']>;
  timeCreate_gt?: InputMaybe<Scalars['BigInt']>;
  timeCreate_gte?: InputMaybe<Scalars['BigInt']>;
  timeCreate_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timeCreate_lt?: InputMaybe<Scalars['BigInt']>;
  timeCreate_lte?: InputMaybe<Scalars['BigInt']>;
  timeCreate_not?: InputMaybe<Scalars['BigInt']>;
  timeCreate_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export enum Pool_OrderBy {
  Base = 'base',
  BlockCreate = 'blockCreate',
  Id = 'id',
  LiquidityChanges = 'liquidityChanges',
  PoolIdx = 'poolIdx',
  Quote = 'quote',
  Swaps = 'swaps',
  Template = 'template',
  TimeCreate = 'timeCreate',
}

export type Query = {
  __typename?: 'Query';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  aggEvent?: Maybe<AggEvent>;
  aggEvents: Array<AggEvent>;
  feeChange?: Maybe<FeeChange>;
  feeChanges: Array<FeeChange>;
  knockoutCross?: Maybe<KnockoutCross>;
  knockoutCrosses: Array<KnockoutCross>;
  latestIndex?: Maybe<LatestIndex>;
  latestIndexes: Array<LatestIndex>;
  liquidityChange?: Maybe<LiquidityChange>;
  liquidityChanges: Array<LiquidityChange>;
  pool?: Maybe<Pool>;
  poolTemplate?: Maybe<PoolTemplate>;
  poolTemplates: Array<PoolTemplate>;
  pools: Array<Pool>;
  swap?: Maybe<Swap>;
  swaps: Array<Swap>;
  userBalance?: Maybe<UserBalance>;
  userBalances: Array<UserBalance>;
};

export type Query_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};

export type QueryAggEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryAggEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<AggEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<AggEvent_Filter>;
};

export type QueryFeeChangeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryFeeChangesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<FeeChange_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<FeeChange_Filter>;
};

export type QueryKnockoutCrossArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryKnockoutCrossesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<KnockoutCross_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<KnockoutCross_Filter>;
};

export type QueryLatestIndexArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryLatestIndexesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<LatestIndex_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<LatestIndex_Filter>;
};

export type QueryLiquidityChangeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryLiquidityChangesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<LiquidityChange_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<LiquidityChange_Filter>;
};

export type QueryPoolArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryPoolTemplateArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryPoolTemplatesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<PoolTemplate_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PoolTemplate_Filter>;
};

export type QueryPoolsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Pool_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Pool_Filter>;
};

export type QuerySwapArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
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

export type QueryUserBalanceArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryUserBalancesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UserBalance_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<UserBalance_Filter>;
};

export type Subscription = {
  __typename?: 'Subscription';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  aggEvent?: Maybe<AggEvent>;
  aggEvents: Array<AggEvent>;
  feeChange?: Maybe<FeeChange>;
  feeChanges: Array<FeeChange>;
  knockoutCross?: Maybe<KnockoutCross>;
  knockoutCrosses: Array<KnockoutCross>;
  latestIndex?: Maybe<LatestIndex>;
  latestIndexes: Array<LatestIndex>;
  liquidityChange?: Maybe<LiquidityChange>;
  liquidityChanges: Array<LiquidityChange>;
  pool?: Maybe<Pool>;
  poolTemplate?: Maybe<PoolTemplate>;
  poolTemplates: Array<PoolTemplate>;
  pools: Array<Pool>;
  swap?: Maybe<Swap>;
  swaps: Array<Swap>;
  userBalance?: Maybe<UserBalance>;
  userBalances: Array<UserBalance>;
};

export type Subscription_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};

export type SubscriptionAggEventArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionAggEventsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<AggEvent_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<AggEvent_Filter>;
};

export type SubscriptionFeeChangeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionFeeChangesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<FeeChange_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<FeeChange_Filter>;
};

export type SubscriptionKnockoutCrossArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionKnockoutCrossesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<KnockoutCross_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<KnockoutCross_Filter>;
};

export type SubscriptionLatestIndexArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionLatestIndexesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<LatestIndex_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<LatestIndex_Filter>;
};

export type SubscriptionLiquidityChangeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionLiquidityChangesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<LiquidityChange_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<LiquidityChange_Filter>;
};

export type SubscriptionPoolArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionPoolTemplateArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionPoolTemplatesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<PoolTemplate_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PoolTemplate_Filter>;
};

export type SubscriptionPoolsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Pool_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Pool_Filter>;
};

export type SubscriptionSwapArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
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

export type SubscriptionUserBalanceArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionUserBalancesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UserBalance_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<UserBalance_Filter>;
};

/**
 * A Swap entity represents an atomic swap of a base token for a quote token
 * made on either SdexSwap or Uniswap V3.
 *
 */
export type Swap = {
  __typename?: 'Swap';
  baseFlow: Scalars['BigInt'];
  block: Scalars['BigInt'];
  callIndex: Scalars['Int'];
  callSource: Scalars['String'];
  dex: Scalars['String'];
  id: Scalars['Bytes'];
  inBaseQty: Scalars['Boolean'];
  isBuy: Scalars['Boolean'];
  limitPrice?: Maybe<Scalars['BigDecimal']>;
  minOut?: Maybe<Scalars['BigInt']>;
  pool: Pool;
  price?: Maybe<Scalars['BigDecimal']>;
  qty: Scalars['BigInt'];
  quoteFlow: Scalars['BigInt'];
  time: Scalars['BigInt'];
  transactionHash: Scalars['Bytes'];
  transactionIndex: Scalars['BigInt'];
  user: Scalars['Bytes'];
};

export type Swap_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  baseFlow?: InputMaybe<Scalars['BigInt']>;
  baseFlow_gt?: InputMaybe<Scalars['BigInt']>;
  baseFlow_gte?: InputMaybe<Scalars['BigInt']>;
  baseFlow_in?: InputMaybe<Array<Scalars['BigInt']>>;
  baseFlow_lt?: InputMaybe<Scalars['BigInt']>;
  baseFlow_lte?: InputMaybe<Scalars['BigInt']>;
  baseFlow_not?: InputMaybe<Scalars['BigInt']>;
  baseFlow_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  block?: InputMaybe<Scalars['BigInt']>;
  block_gt?: InputMaybe<Scalars['BigInt']>;
  block_gte?: InputMaybe<Scalars['BigInt']>;
  block_in?: InputMaybe<Array<Scalars['BigInt']>>;
  block_lt?: InputMaybe<Scalars['BigInt']>;
  block_lte?: InputMaybe<Scalars['BigInt']>;
  block_not?: InputMaybe<Scalars['BigInt']>;
  block_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  callIndex?: InputMaybe<Scalars['Int']>;
  callIndex_gt?: InputMaybe<Scalars['Int']>;
  callIndex_gte?: InputMaybe<Scalars['Int']>;
  callIndex_in?: InputMaybe<Array<Scalars['Int']>>;
  callIndex_lt?: InputMaybe<Scalars['Int']>;
  callIndex_lte?: InputMaybe<Scalars['Int']>;
  callIndex_not?: InputMaybe<Scalars['Int']>;
  callIndex_not_in?: InputMaybe<Array<Scalars['Int']>>;
  callSource?: InputMaybe<Scalars['String']>;
  callSource_contains?: InputMaybe<Scalars['String']>;
  callSource_contains_nocase?: InputMaybe<Scalars['String']>;
  callSource_ends_with?: InputMaybe<Scalars['String']>;
  callSource_ends_with_nocase?: InputMaybe<Scalars['String']>;
  callSource_gt?: InputMaybe<Scalars['String']>;
  callSource_gte?: InputMaybe<Scalars['String']>;
  callSource_in?: InputMaybe<Array<Scalars['String']>>;
  callSource_lt?: InputMaybe<Scalars['String']>;
  callSource_lte?: InputMaybe<Scalars['String']>;
  callSource_not?: InputMaybe<Scalars['String']>;
  callSource_not_contains?: InputMaybe<Scalars['String']>;
  callSource_not_contains_nocase?: InputMaybe<Scalars['String']>;
  callSource_not_ends_with?: InputMaybe<Scalars['String']>;
  callSource_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  callSource_not_in?: InputMaybe<Array<Scalars['String']>>;
  callSource_not_starts_with?: InputMaybe<Scalars['String']>;
  callSource_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  callSource_starts_with?: InputMaybe<Scalars['String']>;
  callSource_starts_with_nocase?: InputMaybe<Scalars['String']>;
  dex?: InputMaybe<Scalars['String']>;
  dex_contains?: InputMaybe<Scalars['String']>;
  dex_contains_nocase?: InputMaybe<Scalars['String']>;
  dex_ends_with?: InputMaybe<Scalars['String']>;
  dex_ends_with_nocase?: InputMaybe<Scalars['String']>;
  dex_gt?: InputMaybe<Scalars['String']>;
  dex_gte?: InputMaybe<Scalars['String']>;
  dex_in?: InputMaybe<Array<Scalars['String']>>;
  dex_lt?: InputMaybe<Scalars['String']>;
  dex_lte?: InputMaybe<Scalars['String']>;
  dex_not?: InputMaybe<Scalars['String']>;
  dex_not_contains?: InputMaybe<Scalars['String']>;
  dex_not_contains_nocase?: InputMaybe<Scalars['String']>;
  dex_not_ends_with?: InputMaybe<Scalars['String']>;
  dex_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  dex_not_in?: InputMaybe<Array<Scalars['String']>>;
  dex_not_starts_with?: InputMaybe<Scalars['String']>;
  dex_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  dex_starts_with?: InputMaybe<Scalars['String']>;
  dex_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['Bytes']>;
  id_contains?: InputMaybe<Scalars['Bytes']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id_not?: InputMaybe<Scalars['Bytes']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  inBaseQty?: InputMaybe<Scalars['Boolean']>;
  inBaseQty_in?: InputMaybe<Array<Scalars['Boolean']>>;
  inBaseQty_not?: InputMaybe<Scalars['Boolean']>;
  inBaseQty_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  isBuy?: InputMaybe<Scalars['Boolean']>;
  isBuy_in?: InputMaybe<Array<Scalars['Boolean']>>;
  isBuy_not?: InputMaybe<Scalars['Boolean']>;
  isBuy_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  limitPrice?: InputMaybe<Scalars['BigDecimal']>;
  limitPrice_gt?: InputMaybe<Scalars['BigDecimal']>;
  limitPrice_gte?: InputMaybe<Scalars['BigDecimal']>;
  limitPrice_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  limitPrice_lt?: InputMaybe<Scalars['BigDecimal']>;
  limitPrice_lte?: InputMaybe<Scalars['BigDecimal']>;
  limitPrice_not?: InputMaybe<Scalars['BigDecimal']>;
  limitPrice_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  minOut?: InputMaybe<Scalars['BigInt']>;
  minOut_gt?: InputMaybe<Scalars['BigInt']>;
  minOut_gte?: InputMaybe<Scalars['BigInt']>;
  minOut_in?: InputMaybe<Array<Scalars['BigInt']>>;
  minOut_lt?: InputMaybe<Scalars['BigInt']>;
  minOut_lte?: InputMaybe<Scalars['BigInt']>;
  minOut_not?: InputMaybe<Scalars['BigInt']>;
  minOut_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  pool?: InputMaybe<Scalars['String']>;
  pool_?: InputMaybe<Pool_Filter>;
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
  price?: InputMaybe<Scalars['BigDecimal']>;
  price_gt?: InputMaybe<Scalars['BigDecimal']>;
  price_gte?: InputMaybe<Scalars['BigDecimal']>;
  price_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  price_lt?: InputMaybe<Scalars['BigDecimal']>;
  price_lte?: InputMaybe<Scalars['BigDecimal']>;
  price_not?: InputMaybe<Scalars['BigDecimal']>;
  price_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  qty?: InputMaybe<Scalars['BigInt']>;
  qty_gt?: InputMaybe<Scalars['BigInt']>;
  qty_gte?: InputMaybe<Scalars['BigInt']>;
  qty_in?: InputMaybe<Array<Scalars['BigInt']>>;
  qty_lt?: InputMaybe<Scalars['BigInt']>;
  qty_lte?: InputMaybe<Scalars['BigInt']>;
  qty_not?: InputMaybe<Scalars['BigInt']>;
  qty_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  quoteFlow?: InputMaybe<Scalars['BigInt']>;
  quoteFlow_gt?: InputMaybe<Scalars['BigInt']>;
  quoteFlow_gte?: InputMaybe<Scalars['BigInt']>;
  quoteFlow_in?: InputMaybe<Array<Scalars['BigInt']>>;
  quoteFlow_lt?: InputMaybe<Scalars['BigInt']>;
  quoteFlow_lte?: InputMaybe<Scalars['BigInt']>;
  quoteFlow_not?: InputMaybe<Scalars['BigInt']>;
  quoteFlow_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  time?: InputMaybe<Scalars['BigInt']>;
  time_gt?: InputMaybe<Scalars['BigInt']>;
  time_gte?: InputMaybe<Scalars['BigInt']>;
  time_in?: InputMaybe<Array<Scalars['BigInt']>>;
  time_lt?: InputMaybe<Scalars['BigInt']>;
  time_lte?: InputMaybe<Scalars['BigInt']>;
  time_not?: InputMaybe<Scalars['BigInt']>;
  time_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  transactionHash?: InputMaybe<Scalars['Bytes']>;
  transactionHash_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transactionHash_not?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transactionIndex?: InputMaybe<Scalars['BigInt']>;
  transactionIndex_gt?: InputMaybe<Scalars['BigInt']>;
  transactionIndex_gte?: InputMaybe<Scalars['BigInt']>;
  transactionIndex_in?: InputMaybe<Array<Scalars['BigInt']>>;
  transactionIndex_lt?: InputMaybe<Scalars['BigInt']>;
  transactionIndex_lte?: InputMaybe<Scalars['BigInt']>;
  transactionIndex_not?: InputMaybe<Scalars['BigInt']>;
  transactionIndex_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  user?: InputMaybe<Scalars['Bytes']>;
  user_contains?: InputMaybe<Scalars['Bytes']>;
  user_in?: InputMaybe<Array<Scalars['Bytes']>>;
  user_not?: InputMaybe<Scalars['Bytes']>;
  user_not_contains?: InputMaybe<Scalars['Bytes']>;
  user_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum Swap_OrderBy {
  BaseFlow = 'baseFlow',
  Block = 'block',
  CallIndex = 'callIndex',
  CallSource = 'callSource',
  Dex = 'dex',
  Id = 'id',
  InBaseQty = 'inBaseQty',
  IsBuy = 'isBuy',
  LimitPrice = 'limitPrice',
  MinOut = 'minOut',
  Pool = 'pool',
  Price = 'price',
  Qty = 'qty',
  QuoteFlow = 'quoteFlow',
  Time = 'time',
  TransactionHash = 'transactionHash',
  TransactionIndex = 'transactionIndex',
  User = 'user',
}

/**
 * A UserBalance entity represents the first time that a user might have
 * conceivably "received" a given token from the SdexSwap DEX, such as via
 * the output of a swap or via the burning of a liquidity position. These
 * entities collectively represent the universe of tokens for which users
 * might have nonzero internal DEX balances.
 *
 */
export type UserBalance = {
  __typename?: 'UserBalance';
  block: Scalars['BigInt'];
  id: Scalars['Bytes'];
  time: Scalars['BigInt'];
  token: Scalars['Bytes'];
  transactionHash: Scalars['Bytes'];
  user: Scalars['Bytes'];
};

export type UserBalance_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  block?: InputMaybe<Scalars['BigInt']>;
  block_gt?: InputMaybe<Scalars['BigInt']>;
  block_gte?: InputMaybe<Scalars['BigInt']>;
  block_in?: InputMaybe<Array<Scalars['BigInt']>>;
  block_lt?: InputMaybe<Scalars['BigInt']>;
  block_lte?: InputMaybe<Scalars['BigInt']>;
  block_not?: InputMaybe<Scalars['BigInt']>;
  block_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['Bytes']>;
  id_contains?: InputMaybe<Scalars['Bytes']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id_not?: InputMaybe<Scalars['Bytes']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  time?: InputMaybe<Scalars['BigInt']>;
  time_gt?: InputMaybe<Scalars['BigInt']>;
  time_gte?: InputMaybe<Scalars['BigInt']>;
  time_in?: InputMaybe<Array<Scalars['BigInt']>>;
  time_lt?: InputMaybe<Scalars['BigInt']>;
  time_lte?: InputMaybe<Scalars['BigInt']>;
  time_not?: InputMaybe<Scalars['BigInt']>;
  time_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  token?: InputMaybe<Scalars['Bytes']>;
  token_contains?: InputMaybe<Scalars['Bytes']>;
  token_in?: InputMaybe<Array<Scalars['Bytes']>>;
  token_not?: InputMaybe<Scalars['Bytes']>;
  token_not_contains?: InputMaybe<Scalars['Bytes']>;
  token_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transactionHash?: InputMaybe<Scalars['Bytes']>;
  transactionHash_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transactionHash_not?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  user?: InputMaybe<Scalars['Bytes']>;
  user_contains?: InputMaybe<Scalars['Bytes']>;
  user_in?: InputMaybe<Array<Scalars['Bytes']>>;
  user_not?: InputMaybe<Scalars['Bytes']>;
  user_not_contains?: InputMaybe<Scalars['Bytes']>;
  user_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum UserBalance_OrderBy {
  Block = 'block',
  Id = 'id',
  Time = 'time',
  Token = 'token',
  TransactionHash = 'transactionHash',
  User = 'user',
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

export type GetLiquidityChangesQueryVariables = Exact<{
  user?: InputMaybe<Scalars['Bytes']>;
  skip: Scalars['Int'];
  pageSize: Scalars['Int'];
  orderBy?: InputMaybe<LiquidityChange_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
}>;

export type GetLiquidityChangesQuery = {
  __typename?: 'Query';
  liquidityChanges: Array<{
    __typename?: 'LiquidityChange';
    changeType: string;
    baseFlow?: string | null;
    quoteFlow?: string | null;
    time: string;
    transactionHash: string;
    positionType: string;
    liq?: string | null;
    pool: { __typename?: 'Pool'; base: string; quote: string };
  }>;
};

export type GetSwapHistoryQueryVariables = Exact<{
  user?: InputMaybe<Scalars['Bytes']>;
  skip: Scalars['Int'];
  pageSize: Scalars['Int'];
  orderBy?: InputMaybe<Swap_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
}>;

export type GetSwapHistoryQuery = {
  __typename?: 'Query';
  swaps: Array<{
    __typename?: 'Swap';
    transactionHash: string;
    time: string;
    baseFlow: string;
    quoteFlow: string;
    qty: string;
    inBaseQty: boolean;
    isBuy: boolean;
    pool: { __typename?: 'Pool'; base: string; quote: string };
  }>;
};

export const GetLiquidityChangesDocument = gql`
  query getLiquidityChanges(
    $user: Bytes
    $skip: Int!
    $pageSize: Int!
    $orderBy: LiquidityChange_orderBy
    $orderDirection: OrderDirection
  ) {
    liquidityChanges(
      where: { user: $user }
      first: $pageSize
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
    ) {
      pool {
        base
        quote
      }
      changeType
      baseFlow
      quoteFlow
      time
      transactionHash
      positionType
      liq
    }
  }
`;

/**
 * __useGetLiquidityChangesQuery__
 *
 * To run a query within a React component, call `useGetLiquidityChangesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLiquidityChangesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLiquidityChangesQuery({
 *   variables: {
 *      user: // value for 'user'
 *      skip: // value for 'skip'
 *      pageSize: // value for 'pageSize'
 *      orderBy: // value for 'orderBy'
 *      orderDirection: // value for 'orderDirection'
 *   },
 * });
 */
export function useGetLiquidityChangesQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetLiquidityChangesQuery,
    GetLiquidityChangesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetLiquidityChangesQuery,
    GetLiquidityChangesQueryVariables
  >(GetLiquidityChangesDocument, options);
}
export function useGetLiquidityChangesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetLiquidityChangesQuery,
    GetLiquidityChangesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetLiquidityChangesQuery,
    GetLiquidityChangesQueryVariables
  >(GetLiquidityChangesDocument, options);
}
export type GetLiquidityChangesQueryHookResult = ReturnType<
  typeof useGetLiquidityChangesQuery
>;
export type GetLiquidityChangesLazyQueryHookResult = ReturnType<
  typeof useGetLiquidityChangesLazyQuery
>;
export type GetLiquidityChangesQueryResult = Apollo.QueryResult<
  GetLiquidityChangesQuery,
  GetLiquidityChangesQueryVariables
>;
export const GetSwapHistoryDocument = gql`
  query getSwapHistory(
    $user: Bytes
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
      transactionHash
      time
      pool {
        base
        quote
      }
      baseFlow
      quoteFlow
      qty
      inBaseQty
      isBuy
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
