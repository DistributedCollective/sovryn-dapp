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

export type BlockChangedFilter = {
  number_gte: Scalars['Int'];
};

export type Block_Height = {
  hash?: InputMaybe<Scalars['Bytes']>;
  number?: InputMaybe<Scalars['Int']>;
  number_gte?: InputMaybe<Scalars['Int']>;
};

export type Change = {
  /** Same as sequence number, but as an ID (string) */
  id: Scalars['ID'];
  /** Can be used to correctly sort changes even if they were made by the same transaction */
  sequenceNumber: Scalars['Int'];
  systemStateAfter?: Maybe<SystemState>;
  systemStateBefore: SystemState;
  /** Transaction that made this change */
  transaction: Transaction;
};

export type Change_Filter = {
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
  sequenceNumber?: InputMaybe<Scalars['Int']>;
  sequenceNumber_gt?: InputMaybe<Scalars['Int']>;
  sequenceNumber_gte?: InputMaybe<Scalars['Int']>;
  sequenceNumber_in?: InputMaybe<Array<Scalars['Int']>>;
  sequenceNumber_lt?: InputMaybe<Scalars['Int']>;
  sequenceNumber_lte?: InputMaybe<Scalars['Int']>;
  sequenceNumber_not?: InputMaybe<Scalars['Int']>;
  sequenceNumber_not_in?: InputMaybe<Array<Scalars['Int']>>;
  systemStateAfter?: InputMaybe<Scalars['String']>;
  systemStateAfter_?: InputMaybe<SystemState_Filter>;
  systemStateAfter_contains?: InputMaybe<Scalars['String']>;
  systemStateAfter_contains_nocase?: InputMaybe<Scalars['String']>;
  systemStateAfter_ends_with?: InputMaybe<Scalars['String']>;
  systemStateAfter_ends_with_nocase?: InputMaybe<Scalars['String']>;
  systemStateAfter_gt?: InputMaybe<Scalars['String']>;
  systemStateAfter_gte?: InputMaybe<Scalars['String']>;
  systemStateAfter_in?: InputMaybe<Array<Scalars['String']>>;
  systemStateAfter_lt?: InputMaybe<Scalars['String']>;
  systemStateAfter_lte?: InputMaybe<Scalars['String']>;
  systemStateAfter_not?: InputMaybe<Scalars['String']>;
  systemStateAfter_not_contains?: InputMaybe<Scalars['String']>;
  systemStateAfter_not_contains_nocase?: InputMaybe<Scalars['String']>;
  systemStateAfter_not_ends_with?: InputMaybe<Scalars['String']>;
  systemStateAfter_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  systemStateAfter_not_in?: InputMaybe<Array<Scalars['String']>>;
  systemStateAfter_not_starts_with?: InputMaybe<Scalars['String']>;
  systemStateAfter_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  systemStateAfter_starts_with?: InputMaybe<Scalars['String']>;
  systemStateAfter_starts_with_nocase?: InputMaybe<Scalars['String']>;
  systemStateBefore?: InputMaybe<Scalars['String']>;
  systemStateBefore_?: InputMaybe<SystemState_Filter>;
  systemStateBefore_contains?: InputMaybe<Scalars['String']>;
  systemStateBefore_contains_nocase?: InputMaybe<Scalars['String']>;
  systemStateBefore_ends_with?: InputMaybe<Scalars['String']>;
  systemStateBefore_ends_with_nocase?: InputMaybe<Scalars['String']>;
  systemStateBefore_gt?: InputMaybe<Scalars['String']>;
  systemStateBefore_gte?: InputMaybe<Scalars['String']>;
  systemStateBefore_in?: InputMaybe<Array<Scalars['String']>>;
  systemStateBefore_lt?: InputMaybe<Scalars['String']>;
  systemStateBefore_lte?: InputMaybe<Scalars['String']>;
  systemStateBefore_not?: InputMaybe<Scalars['String']>;
  systemStateBefore_not_contains?: InputMaybe<Scalars['String']>;
  systemStateBefore_not_contains_nocase?: InputMaybe<Scalars['String']>;
  systemStateBefore_not_ends_with?: InputMaybe<Scalars['String']>;
  systemStateBefore_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  systemStateBefore_not_in?: InputMaybe<Array<Scalars['String']>>;
  systemStateBefore_not_starts_with?: InputMaybe<Scalars['String']>;
  systemStateBefore_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  systemStateBefore_starts_with?: InputMaybe<Scalars['String']>;
  systemStateBefore_starts_with_nocase?: InputMaybe<Scalars['String']>;
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

export enum Change_OrderBy {
  Id = 'id',
  SequenceNumber = 'sequenceNumber',
  SystemStateAfter = 'systemStateAfter',
  SystemStateBefore = 'systemStateBefore',
  Transaction = 'transaction',
}

export type CollSurplusChange = Change & {
  __typename?: 'CollSurplusChange';
  collSurplusAfter: Scalars['BigDecimal'];
  collSurplusBefore: Scalars['BigDecimal'];
  collSurplusChange: Scalars['BigDecimal'];
  id: Scalars['ID'];
  sequenceNumber: Scalars['Int'];
  systemStateAfter?: Maybe<SystemState>;
  systemStateBefore: SystemState;
  transaction: Transaction;
  user: User;
};

export type CollSurplusChange_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  collSurplusAfter?: InputMaybe<Scalars['BigDecimal']>;
  collSurplusAfter_gt?: InputMaybe<Scalars['BigDecimal']>;
  collSurplusAfter_gte?: InputMaybe<Scalars['BigDecimal']>;
  collSurplusAfter_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  collSurplusAfter_lt?: InputMaybe<Scalars['BigDecimal']>;
  collSurplusAfter_lte?: InputMaybe<Scalars['BigDecimal']>;
  collSurplusAfter_not?: InputMaybe<Scalars['BigDecimal']>;
  collSurplusAfter_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  collSurplusBefore?: InputMaybe<Scalars['BigDecimal']>;
  collSurplusBefore_gt?: InputMaybe<Scalars['BigDecimal']>;
  collSurplusBefore_gte?: InputMaybe<Scalars['BigDecimal']>;
  collSurplusBefore_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  collSurplusBefore_lt?: InputMaybe<Scalars['BigDecimal']>;
  collSurplusBefore_lte?: InputMaybe<Scalars['BigDecimal']>;
  collSurplusBefore_not?: InputMaybe<Scalars['BigDecimal']>;
  collSurplusBefore_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  collSurplusChange?: InputMaybe<Scalars['BigDecimal']>;
  collSurplusChange_gt?: InputMaybe<Scalars['BigDecimal']>;
  collSurplusChange_gte?: InputMaybe<Scalars['BigDecimal']>;
  collSurplusChange_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  collSurplusChange_lt?: InputMaybe<Scalars['BigDecimal']>;
  collSurplusChange_lte?: InputMaybe<Scalars['BigDecimal']>;
  collSurplusChange_not?: InputMaybe<Scalars['BigDecimal']>;
  collSurplusChange_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  sequenceNumber?: InputMaybe<Scalars['Int']>;
  sequenceNumber_gt?: InputMaybe<Scalars['Int']>;
  sequenceNumber_gte?: InputMaybe<Scalars['Int']>;
  sequenceNumber_in?: InputMaybe<Array<Scalars['Int']>>;
  sequenceNumber_lt?: InputMaybe<Scalars['Int']>;
  sequenceNumber_lte?: InputMaybe<Scalars['Int']>;
  sequenceNumber_not?: InputMaybe<Scalars['Int']>;
  sequenceNumber_not_in?: InputMaybe<Array<Scalars['Int']>>;
  systemStateAfter?: InputMaybe<Scalars['String']>;
  systemStateAfter_?: InputMaybe<SystemState_Filter>;
  systemStateAfter_contains?: InputMaybe<Scalars['String']>;
  systemStateAfter_contains_nocase?: InputMaybe<Scalars['String']>;
  systemStateAfter_ends_with?: InputMaybe<Scalars['String']>;
  systemStateAfter_ends_with_nocase?: InputMaybe<Scalars['String']>;
  systemStateAfter_gt?: InputMaybe<Scalars['String']>;
  systemStateAfter_gte?: InputMaybe<Scalars['String']>;
  systemStateAfter_in?: InputMaybe<Array<Scalars['String']>>;
  systemStateAfter_lt?: InputMaybe<Scalars['String']>;
  systemStateAfter_lte?: InputMaybe<Scalars['String']>;
  systemStateAfter_not?: InputMaybe<Scalars['String']>;
  systemStateAfter_not_contains?: InputMaybe<Scalars['String']>;
  systemStateAfter_not_contains_nocase?: InputMaybe<Scalars['String']>;
  systemStateAfter_not_ends_with?: InputMaybe<Scalars['String']>;
  systemStateAfter_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  systemStateAfter_not_in?: InputMaybe<Array<Scalars['String']>>;
  systemStateAfter_not_starts_with?: InputMaybe<Scalars['String']>;
  systemStateAfter_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  systemStateAfter_starts_with?: InputMaybe<Scalars['String']>;
  systemStateAfter_starts_with_nocase?: InputMaybe<Scalars['String']>;
  systemStateBefore?: InputMaybe<Scalars['String']>;
  systemStateBefore_?: InputMaybe<SystemState_Filter>;
  systemStateBefore_contains?: InputMaybe<Scalars['String']>;
  systemStateBefore_contains_nocase?: InputMaybe<Scalars['String']>;
  systemStateBefore_ends_with?: InputMaybe<Scalars['String']>;
  systemStateBefore_ends_with_nocase?: InputMaybe<Scalars['String']>;
  systemStateBefore_gt?: InputMaybe<Scalars['String']>;
  systemStateBefore_gte?: InputMaybe<Scalars['String']>;
  systemStateBefore_in?: InputMaybe<Array<Scalars['String']>>;
  systemStateBefore_lt?: InputMaybe<Scalars['String']>;
  systemStateBefore_lte?: InputMaybe<Scalars['String']>;
  systemStateBefore_not?: InputMaybe<Scalars['String']>;
  systemStateBefore_not_contains?: InputMaybe<Scalars['String']>;
  systemStateBefore_not_contains_nocase?: InputMaybe<Scalars['String']>;
  systemStateBefore_not_ends_with?: InputMaybe<Scalars['String']>;
  systemStateBefore_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  systemStateBefore_not_in?: InputMaybe<Array<Scalars['String']>>;
  systemStateBefore_not_starts_with?: InputMaybe<Scalars['String']>;
  systemStateBefore_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  systemStateBefore_starts_with?: InputMaybe<Scalars['String']>;
  systemStateBefore_starts_with_nocase?: InputMaybe<Scalars['String']>;
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

export enum CollSurplusChange_OrderBy {
  CollSurplusAfter = 'collSurplusAfter',
  CollSurplusBefore = 'collSurplusBefore',
  CollSurplusChange = 'collSurplusChange',
  Id = 'id',
  SequenceNumber = 'sequenceNumber',
  SystemStateAfter = 'systemStateAfter',
  SystemStateBefore = 'systemStateBefore',
  Transaction = 'transaction',
  User = 'user',
}

export type Global = {
  __typename?: 'Global';
  changeCount: Scalars['Int'];
  /** Only used internally as temporary storage. Will always be null in queries */
  currentLiquidation?: Maybe<Liquidation>;
  /** Only used internally as temporary storage. Will always be null in queries */
  currentRedemption?: Maybe<Redemption>;
  currentSystemState?: Maybe<SystemState>;
  /** There should be only one System entity with an ID of 'only' */
  id: Scalars['ID'];
  liquidationCount: Scalars['Int'];
  numberOfLiquidatedTroves: Scalars['Int'];
  numberOfOpenTroves: Scalars['Int'];
  numberOfRedeemedTroves: Scalars['Int'];
  numberOfTrovesClosedByOwner: Scalars['Int'];
  /** Total redistributed per-stake collateral */
  rawTotalRedistributedCollateral: Scalars['BigInt'];
  /** Total redistributed per-stake debt */
  rawTotalRedistributedDebt: Scalars['BigInt'];
  redemptionCount: Scalars['Int'];
  systemStateCount: Scalars['Int'];
  /** Only used internally as temporary storage. Will always be null in queries */
  tmpDepositUpdate?: Maybe<Scalars['BigInt']>;
  /** Total amount of ZUSD paid as borrowing fees converted to RBTC */
  totalBorrowingFeesPaidRBTC: Scalars['BigDecimal'];
  /** Total amount of ZUSD paid as borrowing fees */
  totalBorrowingFeesPaidZUSD: Scalars['BigDecimal'];
  totalLiquidationCompensation: Scalars['BigDecimal'];
  totalLiquidationVolume: Scalars['BigDecimal'];
  totalNumberOfTroves: Scalars['Int'];
  /** Total amount of RBTC paid as redemption fees */
  totalRedemptionFeesPaidRBTC: Scalars['BigDecimal'];
  /** Total amount of RBTC paid as redemption fees converted to ZUSD */
  totalRedemptionFeesPaidZUSD: Scalars['BigDecimal'];
  totalStabilityPoolProfits: Scalars['BigDecimal'];
  transactionCount: Scalars['Int'];
};

export type Global_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  changeCount?: InputMaybe<Scalars['Int']>;
  changeCount_gt?: InputMaybe<Scalars['Int']>;
  changeCount_gte?: InputMaybe<Scalars['Int']>;
  changeCount_in?: InputMaybe<Array<Scalars['Int']>>;
  changeCount_lt?: InputMaybe<Scalars['Int']>;
  changeCount_lte?: InputMaybe<Scalars['Int']>;
  changeCount_not?: InputMaybe<Scalars['Int']>;
  changeCount_not_in?: InputMaybe<Array<Scalars['Int']>>;
  currentLiquidation?: InputMaybe<Scalars['String']>;
  currentLiquidation_?: InputMaybe<Liquidation_Filter>;
  currentLiquidation_contains?: InputMaybe<Scalars['String']>;
  currentLiquidation_contains_nocase?: InputMaybe<Scalars['String']>;
  currentLiquidation_ends_with?: InputMaybe<Scalars['String']>;
  currentLiquidation_ends_with_nocase?: InputMaybe<Scalars['String']>;
  currentLiquidation_gt?: InputMaybe<Scalars['String']>;
  currentLiquidation_gte?: InputMaybe<Scalars['String']>;
  currentLiquidation_in?: InputMaybe<Array<Scalars['String']>>;
  currentLiquidation_lt?: InputMaybe<Scalars['String']>;
  currentLiquidation_lte?: InputMaybe<Scalars['String']>;
  currentLiquidation_not?: InputMaybe<Scalars['String']>;
  currentLiquidation_not_contains?: InputMaybe<Scalars['String']>;
  currentLiquidation_not_contains_nocase?: InputMaybe<Scalars['String']>;
  currentLiquidation_not_ends_with?: InputMaybe<Scalars['String']>;
  currentLiquidation_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  currentLiquidation_not_in?: InputMaybe<Array<Scalars['String']>>;
  currentLiquidation_not_starts_with?: InputMaybe<Scalars['String']>;
  currentLiquidation_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  currentLiquidation_starts_with?: InputMaybe<Scalars['String']>;
  currentLiquidation_starts_with_nocase?: InputMaybe<Scalars['String']>;
  currentRedemption?: InputMaybe<Scalars['String']>;
  currentRedemption_?: InputMaybe<Redemption_Filter>;
  currentRedemption_contains?: InputMaybe<Scalars['String']>;
  currentRedemption_contains_nocase?: InputMaybe<Scalars['String']>;
  currentRedemption_ends_with?: InputMaybe<Scalars['String']>;
  currentRedemption_ends_with_nocase?: InputMaybe<Scalars['String']>;
  currentRedemption_gt?: InputMaybe<Scalars['String']>;
  currentRedemption_gte?: InputMaybe<Scalars['String']>;
  currentRedemption_in?: InputMaybe<Array<Scalars['String']>>;
  currentRedemption_lt?: InputMaybe<Scalars['String']>;
  currentRedemption_lte?: InputMaybe<Scalars['String']>;
  currentRedemption_not?: InputMaybe<Scalars['String']>;
  currentRedemption_not_contains?: InputMaybe<Scalars['String']>;
  currentRedemption_not_contains_nocase?: InputMaybe<Scalars['String']>;
  currentRedemption_not_ends_with?: InputMaybe<Scalars['String']>;
  currentRedemption_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  currentRedemption_not_in?: InputMaybe<Array<Scalars['String']>>;
  currentRedemption_not_starts_with?: InputMaybe<Scalars['String']>;
  currentRedemption_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  currentRedemption_starts_with?: InputMaybe<Scalars['String']>;
  currentRedemption_starts_with_nocase?: InputMaybe<Scalars['String']>;
  currentSystemState?: InputMaybe<Scalars['String']>;
  currentSystemState_?: InputMaybe<SystemState_Filter>;
  currentSystemState_contains?: InputMaybe<Scalars['String']>;
  currentSystemState_contains_nocase?: InputMaybe<Scalars['String']>;
  currentSystemState_ends_with?: InputMaybe<Scalars['String']>;
  currentSystemState_ends_with_nocase?: InputMaybe<Scalars['String']>;
  currentSystemState_gt?: InputMaybe<Scalars['String']>;
  currentSystemState_gte?: InputMaybe<Scalars['String']>;
  currentSystemState_in?: InputMaybe<Array<Scalars['String']>>;
  currentSystemState_lt?: InputMaybe<Scalars['String']>;
  currentSystemState_lte?: InputMaybe<Scalars['String']>;
  currentSystemState_not?: InputMaybe<Scalars['String']>;
  currentSystemState_not_contains?: InputMaybe<Scalars['String']>;
  currentSystemState_not_contains_nocase?: InputMaybe<Scalars['String']>;
  currentSystemState_not_ends_with?: InputMaybe<Scalars['String']>;
  currentSystemState_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  currentSystemState_not_in?: InputMaybe<Array<Scalars['String']>>;
  currentSystemState_not_starts_with?: InputMaybe<Scalars['String']>;
  currentSystemState_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  currentSystemState_starts_with?: InputMaybe<Scalars['String']>;
  currentSystemState_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  liquidationCount?: InputMaybe<Scalars['Int']>;
  liquidationCount_gt?: InputMaybe<Scalars['Int']>;
  liquidationCount_gte?: InputMaybe<Scalars['Int']>;
  liquidationCount_in?: InputMaybe<Array<Scalars['Int']>>;
  liquidationCount_lt?: InputMaybe<Scalars['Int']>;
  liquidationCount_lte?: InputMaybe<Scalars['Int']>;
  liquidationCount_not?: InputMaybe<Scalars['Int']>;
  liquidationCount_not_in?: InputMaybe<Array<Scalars['Int']>>;
  numberOfLiquidatedTroves?: InputMaybe<Scalars['Int']>;
  numberOfLiquidatedTroves_gt?: InputMaybe<Scalars['Int']>;
  numberOfLiquidatedTroves_gte?: InputMaybe<Scalars['Int']>;
  numberOfLiquidatedTroves_in?: InputMaybe<Array<Scalars['Int']>>;
  numberOfLiquidatedTroves_lt?: InputMaybe<Scalars['Int']>;
  numberOfLiquidatedTroves_lte?: InputMaybe<Scalars['Int']>;
  numberOfLiquidatedTroves_not?: InputMaybe<Scalars['Int']>;
  numberOfLiquidatedTroves_not_in?: InputMaybe<Array<Scalars['Int']>>;
  numberOfOpenTroves?: InputMaybe<Scalars['Int']>;
  numberOfOpenTroves_gt?: InputMaybe<Scalars['Int']>;
  numberOfOpenTroves_gte?: InputMaybe<Scalars['Int']>;
  numberOfOpenTroves_in?: InputMaybe<Array<Scalars['Int']>>;
  numberOfOpenTroves_lt?: InputMaybe<Scalars['Int']>;
  numberOfOpenTroves_lte?: InputMaybe<Scalars['Int']>;
  numberOfOpenTroves_not?: InputMaybe<Scalars['Int']>;
  numberOfOpenTroves_not_in?: InputMaybe<Array<Scalars['Int']>>;
  numberOfRedeemedTroves?: InputMaybe<Scalars['Int']>;
  numberOfRedeemedTroves_gt?: InputMaybe<Scalars['Int']>;
  numberOfRedeemedTroves_gte?: InputMaybe<Scalars['Int']>;
  numberOfRedeemedTroves_in?: InputMaybe<Array<Scalars['Int']>>;
  numberOfRedeemedTroves_lt?: InputMaybe<Scalars['Int']>;
  numberOfRedeemedTroves_lte?: InputMaybe<Scalars['Int']>;
  numberOfRedeemedTroves_not?: InputMaybe<Scalars['Int']>;
  numberOfRedeemedTroves_not_in?: InputMaybe<Array<Scalars['Int']>>;
  numberOfTrovesClosedByOwner?: InputMaybe<Scalars['Int']>;
  numberOfTrovesClosedByOwner_gt?: InputMaybe<Scalars['Int']>;
  numberOfTrovesClosedByOwner_gte?: InputMaybe<Scalars['Int']>;
  numberOfTrovesClosedByOwner_in?: InputMaybe<Array<Scalars['Int']>>;
  numberOfTrovesClosedByOwner_lt?: InputMaybe<Scalars['Int']>;
  numberOfTrovesClosedByOwner_lte?: InputMaybe<Scalars['Int']>;
  numberOfTrovesClosedByOwner_not?: InputMaybe<Scalars['Int']>;
  numberOfTrovesClosedByOwner_not_in?: InputMaybe<Array<Scalars['Int']>>;
  rawTotalRedistributedCollateral?: InputMaybe<Scalars['BigInt']>;
  rawTotalRedistributedCollateral_gt?: InputMaybe<Scalars['BigInt']>;
  rawTotalRedistributedCollateral_gte?: InputMaybe<Scalars['BigInt']>;
  rawTotalRedistributedCollateral_in?: InputMaybe<Array<Scalars['BigInt']>>;
  rawTotalRedistributedCollateral_lt?: InputMaybe<Scalars['BigInt']>;
  rawTotalRedistributedCollateral_lte?: InputMaybe<Scalars['BigInt']>;
  rawTotalRedistributedCollateral_not?: InputMaybe<Scalars['BigInt']>;
  rawTotalRedistributedCollateral_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  rawTotalRedistributedDebt?: InputMaybe<Scalars['BigInt']>;
  rawTotalRedistributedDebt_gt?: InputMaybe<Scalars['BigInt']>;
  rawTotalRedistributedDebt_gte?: InputMaybe<Scalars['BigInt']>;
  rawTotalRedistributedDebt_in?: InputMaybe<Array<Scalars['BigInt']>>;
  rawTotalRedistributedDebt_lt?: InputMaybe<Scalars['BigInt']>;
  rawTotalRedistributedDebt_lte?: InputMaybe<Scalars['BigInt']>;
  rawTotalRedistributedDebt_not?: InputMaybe<Scalars['BigInt']>;
  rawTotalRedistributedDebt_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  redemptionCount?: InputMaybe<Scalars['Int']>;
  redemptionCount_gt?: InputMaybe<Scalars['Int']>;
  redemptionCount_gte?: InputMaybe<Scalars['Int']>;
  redemptionCount_in?: InputMaybe<Array<Scalars['Int']>>;
  redemptionCount_lt?: InputMaybe<Scalars['Int']>;
  redemptionCount_lte?: InputMaybe<Scalars['Int']>;
  redemptionCount_not?: InputMaybe<Scalars['Int']>;
  redemptionCount_not_in?: InputMaybe<Array<Scalars['Int']>>;
  systemStateCount?: InputMaybe<Scalars['Int']>;
  systemStateCount_gt?: InputMaybe<Scalars['Int']>;
  systemStateCount_gte?: InputMaybe<Scalars['Int']>;
  systemStateCount_in?: InputMaybe<Array<Scalars['Int']>>;
  systemStateCount_lt?: InputMaybe<Scalars['Int']>;
  systemStateCount_lte?: InputMaybe<Scalars['Int']>;
  systemStateCount_not?: InputMaybe<Scalars['Int']>;
  systemStateCount_not_in?: InputMaybe<Array<Scalars['Int']>>;
  tmpDepositUpdate?: InputMaybe<Scalars['BigInt']>;
  tmpDepositUpdate_gt?: InputMaybe<Scalars['BigInt']>;
  tmpDepositUpdate_gte?: InputMaybe<Scalars['BigInt']>;
  tmpDepositUpdate_in?: InputMaybe<Array<Scalars['BigInt']>>;
  tmpDepositUpdate_lt?: InputMaybe<Scalars['BigInt']>;
  tmpDepositUpdate_lte?: InputMaybe<Scalars['BigInt']>;
  tmpDepositUpdate_not?: InputMaybe<Scalars['BigInt']>;
  tmpDepositUpdate_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalBorrowingFeesPaidRBTC?: InputMaybe<Scalars['BigDecimal']>;
  totalBorrowingFeesPaidRBTC_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalBorrowingFeesPaidRBTC_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalBorrowingFeesPaidRBTC_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalBorrowingFeesPaidRBTC_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalBorrowingFeesPaidRBTC_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalBorrowingFeesPaidRBTC_not?: InputMaybe<Scalars['BigDecimal']>;
  totalBorrowingFeesPaidRBTC_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalBorrowingFeesPaidZUSD?: InputMaybe<Scalars['BigDecimal']>;
  totalBorrowingFeesPaidZUSD_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalBorrowingFeesPaidZUSD_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalBorrowingFeesPaidZUSD_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalBorrowingFeesPaidZUSD_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalBorrowingFeesPaidZUSD_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalBorrowingFeesPaidZUSD_not?: InputMaybe<Scalars['BigDecimal']>;
  totalBorrowingFeesPaidZUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalLiquidationCompensation?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidationCompensation_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidationCompensation_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidationCompensation_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalLiquidationCompensation_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidationCompensation_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidationCompensation_not?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidationCompensation_not_in?: InputMaybe<
    Array<Scalars['BigDecimal']>
  >;
  totalLiquidationVolume?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidationVolume_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidationVolume_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidationVolume_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalLiquidationVolume_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidationVolume_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidationVolume_not?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidationVolume_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalNumberOfTroves?: InputMaybe<Scalars['Int']>;
  totalNumberOfTroves_gt?: InputMaybe<Scalars['Int']>;
  totalNumberOfTroves_gte?: InputMaybe<Scalars['Int']>;
  totalNumberOfTroves_in?: InputMaybe<Array<Scalars['Int']>>;
  totalNumberOfTroves_lt?: InputMaybe<Scalars['Int']>;
  totalNumberOfTroves_lte?: InputMaybe<Scalars['Int']>;
  totalNumberOfTroves_not?: InputMaybe<Scalars['Int']>;
  totalNumberOfTroves_not_in?: InputMaybe<Array<Scalars['Int']>>;
  totalRedemptionFeesPaidRBTC?: InputMaybe<Scalars['BigDecimal']>;
  totalRedemptionFeesPaidRBTC_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalRedemptionFeesPaidRBTC_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalRedemptionFeesPaidRBTC_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalRedemptionFeesPaidRBTC_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalRedemptionFeesPaidRBTC_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalRedemptionFeesPaidRBTC_not?: InputMaybe<Scalars['BigDecimal']>;
  totalRedemptionFeesPaidRBTC_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalRedemptionFeesPaidZUSD?: InputMaybe<Scalars['BigDecimal']>;
  totalRedemptionFeesPaidZUSD_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalRedemptionFeesPaidZUSD_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalRedemptionFeesPaidZUSD_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalRedemptionFeesPaidZUSD_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalRedemptionFeesPaidZUSD_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalRedemptionFeesPaidZUSD_not?: InputMaybe<Scalars['BigDecimal']>;
  totalRedemptionFeesPaidZUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalStabilityPoolProfits?: InputMaybe<Scalars['BigDecimal']>;
  totalStabilityPoolProfits_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalStabilityPoolProfits_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalStabilityPoolProfits_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalStabilityPoolProfits_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalStabilityPoolProfits_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalStabilityPoolProfits_not?: InputMaybe<Scalars['BigDecimal']>;
  totalStabilityPoolProfits_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  transactionCount?: InputMaybe<Scalars['Int']>;
  transactionCount_gt?: InputMaybe<Scalars['Int']>;
  transactionCount_gte?: InputMaybe<Scalars['Int']>;
  transactionCount_in?: InputMaybe<Array<Scalars['Int']>>;
  transactionCount_lt?: InputMaybe<Scalars['Int']>;
  transactionCount_lte?: InputMaybe<Scalars['Int']>;
  transactionCount_not?: InputMaybe<Scalars['Int']>;
  transactionCount_not_in?: InputMaybe<Array<Scalars['Int']>>;
};

export enum Global_OrderBy {
  ChangeCount = 'changeCount',
  CurrentLiquidation = 'currentLiquidation',
  CurrentRedemption = 'currentRedemption',
  CurrentSystemState = 'currentSystemState',
  Id = 'id',
  LiquidationCount = 'liquidationCount',
  NumberOfLiquidatedTroves = 'numberOfLiquidatedTroves',
  NumberOfOpenTroves = 'numberOfOpenTroves',
  NumberOfRedeemedTroves = 'numberOfRedeemedTroves',
  NumberOfTrovesClosedByOwner = 'numberOfTrovesClosedByOwner',
  RawTotalRedistributedCollateral = 'rawTotalRedistributedCollateral',
  RawTotalRedistributedDebt = 'rawTotalRedistributedDebt',
  RedemptionCount = 'redemptionCount',
  SystemStateCount = 'systemStateCount',
  TmpDepositUpdate = 'tmpDepositUpdate',
  TotalBorrowingFeesPaidRbtc = 'totalBorrowingFeesPaidRBTC',
  TotalBorrowingFeesPaidZusd = 'totalBorrowingFeesPaidZUSD',
  TotalLiquidationCompensation = 'totalLiquidationCompensation',
  TotalLiquidationVolume = 'totalLiquidationVolume',
  TotalNumberOfTroves = 'totalNumberOfTroves',
  TotalRedemptionFeesPaidRbtc = 'totalRedemptionFeesPaidRBTC',
  TotalRedemptionFeesPaidZusd = 'totalRedemptionFeesPaidZUSD',
  TotalStabilityPoolProfits = 'totalStabilityPoolProfits',
  TransactionCount = 'transactionCount',
}

export type Liquidation = {
  __typename?: 'Liquidation';
  collGasCompensation: Scalars['BigDecimal'];
  id: Scalars['ID'];
  liquidatedCollateral: Scalars['BigDecimal'];
  liquidatedDebt: Scalars['BigDecimal'];
  liquidator: User;
  sequenceNumber: Scalars['Int'];
  tokenGasCompensation: Scalars['BigDecimal'];
  transaction: Transaction;
  troveChanges: Array<TroveChange>;
};

export type LiquidationTroveChangesArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TroveChange_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<TroveChange_Filter>;
};

export type Liquidation_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  collGasCompensation?: InputMaybe<Scalars['BigDecimal']>;
  collGasCompensation_gt?: InputMaybe<Scalars['BigDecimal']>;
  collGasCompensation_gte?: InputMaybe<Scalars['BigDecimal']>;
  collGasCompensation_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  collGasCompensation_lt?: InputMaybe<Scalars['BigDecimal']>;
  collGasCompensation_lte?: InputMaybe<Scalars['BigDecimal']>;
  collGasCompensation_not?: InputMaybe<Scalars['BigDecimal']>;
  collGasCompensation_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  liquidatedCollateral?: InputMaybe<Scalars['BigDecimal']>;
  liquidatedCollateral_gt?: InputMaybe<Scalars['BigDecimal']>;
  liquidatedCollateral_gte?: InputMaybe<Scalars['BigDecimal']>;
  liquidatedCollateral_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  liquidatedCollateral_lt?: InputMaybe<Scalars['BigDecimal']>;
  liquidatedCollateral_lte?: InputMaybe<Scalars['BigDecimal']>;
  liquidatedCollateral_not?: InputMaybe<Scalars['BigDecimal']>;
  liquidatedCollateral_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  liquidatedDebt?: InputMaybe<Scalars['BigDecimal']>;
  liquidatedDebt_gt?: InputMaybe<Scalars['BigDecimal']>;
  liquidatedDebt_gte?: InputMaybe<Scalars['BigDecimal']>;
  liquidatedDebt_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  liquidatedDebt_lt?: InputMaybe<Scalars['BigDecimal']>;
  liquidatedDebt_lte?: InputMaybe<Scalars['BigDecimal']>;
  liquidatedDebt_not?: InputMaybe<Scalars['BigDecimal']>;
  liquidatedDebt_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  liquidator?: InputMaybe<Scalars['String']>;
  liquidator_?: InputMaybe<User_Filter>;
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
  sequenceNumber?: InputMaybe<Scalars['Int']>;
  sequenceNumber_gt?: InputMaybe<Scalars['Int']>;
  sequenceNumber_gte?: InputMaybe<Scalars['Int']>;
  sequenceNumber_in?: InputMaybe<Array<Scalars['Int']>>;
  sequenceNumber_lt?: InputMaybe<Scalars['Int']>;
  sequenceNumber_lte?: InputMaybe<Scalars['Int']>;
  sequenceNumber_not?: InputMaybe<Scalars['Int']>;
  sequenceNumber_not_in?: InputMaybe<Array<Scalars['Int']>>;
  tokenGasCompensation?: InputMaybe<Scalars['BigDecimal']>;
  tokenGasCompensation_gt?: InputMaybe<Scalars['BigDecimal']>;
  tokenGasCompensation_gte?: InputMaybe<Scalars['BigDecimal']>;
  tokenGasCompensation_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  tokenGasCompensation_lt?: InputMaybe<Scalars['BigDecimal']>;
  tokenGasCompensation_lte?: InputMaybe<Scalars['BigDecimal']>;
  tokenGasCompensation_not?: InputMaybe<Scalars['BigDecimal']>;
  tokenGasCompensation_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
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
  troveChanges_?: InputMaybe<TroveChange_Filter>;
};

export enum Liquidation_OrderBy {
  CollGasCompensation = 'collGasCompensation',
  Id = 'id',
  LiquidatedCollateral = 'liquidatedCollateral',
  LiquidatedDebt = 'liquidatedDebt',
  Liquidator = 'liquidator',
  SequenceNumber = 'sequenceNumber',
  TokenGasCompensation = 'tokenGasCompensation',
  Transaction = 'transaction',
  TroveChanges = 'troveChanges',
}

/** Defines the order direction, either ascending or descending */
export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc',
}

export type PriceChange = Change & {
  __typename?: 'PriceChange';
  id: Scalars['ID'];
  priceChange: Scalars['BigDecimal'];
  sequenceNumber: Scalars['Int'];
  systemStateAfter?: Maybe<SystemState>;
  systemStateBefore: SystemState;
  transaction: Transaction;
};

export type PriceChange_Filter = {
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
  priceChange?: InputMaybe<Scalars['BigDecimal']>;
  priceChange_gt?: InputMaybe<Scalars['BigDecimal']>;
  priceChange_gte?: InputMaybe<Scalars['BigDecimal']>;
  priceChange_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  priceChange_lt?: InputMaybe<Scalars['BigDecimal']>;
  priceChange_lte?: InputMaybe<Scalars['BigDecimal']>;
  priceChange_not?: InputMaybe<Scalars['BigDecimal']>;
  priceChange_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  sequenceNumber?: InputMaybe<Scalars['Int']>;
  sequenceNumber_gt?: InputMaybe<Scalars['Int']>;
  sequenceNumber_gte?: InputMaybe<Scalars['Int']>;
  sequenceNumber_in?: InputMaybe<Array<Scalars['Int']>>;
  sequenceNumber_lt?: InputMaybe<Scalars['Int']>;
  sequenceNumber_lte?: InputMaybe<Scalars['Int']>;
  sequenceNumber_not?: InputMaybe<Scalars['Int']>;
  sequenceNumber_not_in?: InputMaybe<Array<Scalars['Int']>>;
  systemStateAfter?: InputMaybe<Scalars['String']>;
  systemStateAfter_?: InputMaybe<SystemState_Filter>;
  systemStateAfter_contains?: InputMaybe<Scalars['String']>;
  systemStateAfter_contains_nocase?: InputMaybe<Scalars['String']>;
  systemStateAfter_ends_with?: InputMaybe<Scalars['String']>;
  systemStateAfter_ends_with_nocase?: InputMaybe<Scalars['String']>;
  systemStateAfter_gt?: InputMaybe<Scalars['String']>;
  systemStateAfter_gte?: InputMaybe<Scalars['String']>;
  systemStateAfter_in?: InputMaybe<Array<Scalars['String']>>;
  systemStateAfter_lt?: InputMaybe<Scalars['String']>;
  systemStateAfter_lte?: InputMaybe<Scalars['String']>;
  systemStateAfter_not?: InputMaybe<Scalars['String']>;
  systemStateAfter_not_contains?: InputMaybe<Scalars['String']>;
  systemStateAfter_not_contains_nocase?: InputMaybe<Scalars['String']>;
  systemStateAfter_not_ends_with?: InputMaybe<Scalars['String']>;
  systemStateAfter_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  systemStateAfter_not_in?: InputMaybe<Array<Scalars['String']>>;
  systemStateAfter_not_starts_with?: InputMaybe<Scalars['String']>;
  systemStateAfter_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  systemStateAfter_starts_with?: InputMaybe<Scalars['String']>;
  systemStateAfter_starts_with_nocase?: InputMaybe<Scalars['String']>;
  systemStateBefore?: InputMaybe<Scalars['String']>;
  systemStateBefore_?: InputMaybe<SystemState_Filter>;
  systemStateBefore_contains?: InputMaybe<Scalars['String']>;
  systemStateBefore_contains_nocase?: InputMaybe<Scalars['String']>;
  systemStateBefore_ends_with?: InputMaybe<Scalars['String']>;
  systemStateBefore_ends_with_nocase?: InputMaybe<Scalars['String']>;
  systemStateBefore_gt?: InputMaybe<Scalars['String']>;
  systemStateBefore_gte?: InputMaybe<Scalars['String']>;
  systemStateBefore_in?: InputMaybe<Array<Scalars['String']>>;
  systemStateBefore_lt?: InputMaybe<Scalars['String']>;
  systemStateBefore_lte?: InputMaybe<Scalars['String']>;
  systemStateBefore_not?: InputMaybe<Scalars['String']>;
  systemStateBefore_not_contains?: InputMaybe<Scalars['String']>;
  systemStateBefore_not_contains_nocase?: InputMaybe<Scalars['String']>;
  systemStateBefore_not_ends_with?: InputMaybe<Scalars['String']>;
  systemStateBefore_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  systemStateBefore_not_in?: InputMaybe<Array<Scalars['String']>>;
  systemStateBefore_not_starts_with?: InputMaybe<Scalars['String']>;
  systemStateBefore_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  systemStateBefore_starts_with?: InputMaybe<Scalars['String']>;
  systemStateBefore_starts_with_nocase?: InputMaybe<Scalars['String']>;
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

export enum PriceChange_OrderBy {
  Id = 'id',
  PriceChange = 'priceChange',
  SequenceNumber = 'sequenceNumber',
  SystemStateAfter = 'systemStateAfter',
  SystemStateBefore = 'systemStateBefore',
  Transaction = 'transaction',
}

export type Query = {
  __typename?: 'Query';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  change?: Maybe<Change>;
  changes: Array<Change>;
  collSurplusChange?: Maybe<CollSurplusChange>;
  collSurplusChanges: Array<CollSurplusChange>;
  global?: Maybe<Global>;
  globals: Array<Global>;
  liquidation?: Maybe<Liquidation>;
  liquidations: Array<Liquidation>;
  priceChange?: Maybe<PriceChange>;
  priceChanges: Array<PriceChange>;
  redemption?: Maybe<Redemption>;
  redemptionRaw?: Maybe<RedemptionRaw>;
  redemptionRaws: Array<RedemptionRaw>;
  redemptions: Array<Redemption>;
  revenueDailies: Array<RevenueDaily>;
  revenueDaily?: Maybe<RevenueDaily>;
  revenueWeeklies: Array<RevenueWeekly>;
  revenueWeekly?: Maybe<RevenueWeekly>;
  sovdistribution?: Maybe<SovDistribution>;
  sovdistributions: Array<SovDistribution>;
  stabilityDeposit?: Maybe<StabilityDeposit>;
  stabilityDepositChange?: Maybe<StabilityDepositChange>;
  stabilityDepositChanges: Array<StabilityDepositChange>;
  stabilityDeposits: Array<StabilityDeposit>;
  systemState?: Maybe<SystemState>;
  systemStates: Array<SystemState>;
  tempDepositUpdate?: Maybe<TempDepositUpdate>;
  tempDepositUpdates: Array<TempDepositUpdate>;
  token?: Maybe<Token>;
  tokenAllowance?: Maybe<TokenAllowance>;
  tokenAllowances: Array<TokenAllowance>;
  tokenBalance?: Maybe<TokenBalance>;
  tokenBalances: Array<TokenBalance>;
  tokens: Array<Token>;
  transaction?: Maybe<Transaction>;
  transactions: Array<Transaction>;
  trove?: Maybe<Trove>;
  troveChange?: Maybe<TroveChange>;
  troveChanges: Array<TroveChange>;
  troves: Array<Trove>;
  user?: Maybe<User>;
  users: Array<User>;
};

export type Query_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};

export type QueryChangeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryChangesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Change_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Change_Filter>;
};

export type QueryCollSurplusChangeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryCollSurplusChangesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<CollSurplusChange_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<CollSurplusChange_Filter>;
};

export type QueryGlobalArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryGlobalsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Global_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Global_Filter>;
};

export type QueryLiquidationArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryLiquidationsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Liquidation_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Liquidation_Filter>;
};

export type QueryPriceChangeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryPriceChangesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<PriceChange_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PriceChange_Filter>;
};

export type QueryRedemptionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryRedemptionRawArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryRedemptionRawsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<RedemptionRaw_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<RedemptionRaw_Filter>;
};

export type QueryRedemptionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Redemption_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Redemption_Filter>;
};

export type QueryRevenueDailiesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<RevenueDaily_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<RevenueDaily_Filter>;
};

export type QueryRevenueDailyArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryRevenueWeekliesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<RevenueWeekly_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<RevenueWeekly_Filter>;
};

export type QueryRevenueWeeklyArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QuerySovdistributionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QuerySovdistributionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<SovDistribution_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<SovDistribution_Filter>;
};

export type QueryStabilityDepositArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryStabilityDepositChangeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryStabilityDepositChangesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<StabilityDepositChange_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<StabilityDepositChange_Filter>;
};

export type QueryStabilityDepositsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<StabilityDeposit_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<StabilityDeposit_Filter>;
};

export type QuerySystemStateArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QuerySystemStatesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<SystemState_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<SystemState_Filter>;
};

export type QueryTempDepositUpdateArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryTempDepositUpdatesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TempDepositUpdate_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TempDepositUpdate_Filter>;
};

export type QueryTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryTokenAllowanceArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryTokenAllowancesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TokenAllowance_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TokenAllowance_Filter>;
};

export type QueryTokenBalanceArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryTokenBalancesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TokenBalance_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TokenBalance_Filter>;
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

export type QueryTroveArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryTroveChangeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryTroveChangesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TroveChange_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TroveChange_Filter>;
};

export type QueryTrovesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Trove_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Trove_Filter>;
};

export type QueryUserArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
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

export type Redemption = {
  __typename?: 'Redemption';
  collateralRedeemed: Scalars['BigDecimal'];
  fee: Scalars['BigDecimal'];
  id: Scalars['ID'];
  partial: Scalars['Boolean'];
  redeemer: User;
  sequenceNumber: Scalars['Int'];
  tokensActuallyRedeemed: Scalars['BigDecimal'];
  tokensAttemptedToRedeem: Scalars['BigDecimal'];
  transaction: Transaction;
  troveChanges: Array<TroveChange>;
};

export type RedemptionTroveChangesArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TroveChange_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<TroveChange_Filter>;
};

export type RedemptionRaw = {
  __typename?: 'RedemptionRaw';
  _RBTCFee: Scalars['BigInt'];
  _RBTCSent: Scalars['BigInt'];
  _actualZUSDAmount: Scalars['BigInt'];
  _attemptedZUSDAmount: Scalars['BigInt'];
  id: Scalars['ID'];
};

export type RedemptionRaw_Filter = {
  _RBTCFee?: InputMaybe<Scalars['BigInt']>;
  _RBTCFee_gt?: InputMaybe<Scalars['BigInt']>;
  _RBTCFee_gte?: InputMaybe<Scalars['BigInt']>;
  _RBTCFee_in?: InputMaybe<Array<Scalars['BigInt']>>;
  _RBTCFee_lt?: InputMaybe<Scalars['BigInt']>;
  _RBTCFee_lte?: InputMaybe<Scalars['BigInt']>;
  _RBTCFee_not?: InputMaybe<Scalars['BigInt']>;
  _RBTCFee_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  _RBTCSent?: InputMaybe<Scalars['BigInt']>;
  _RBTCSent_gt?: InputMaybe<Scalars['BigInt']>;
  _RBTCSent_gte?: InputMaybe<Scalars['BigInt']>;
  _RBTCSent_in?: InputMaybe<Array<Scalars['BigInt']>>;
  _RBTCSent_lt?: InputMaybe<Scalars['BigInt']>;
  _RBTCSent_lte?: InputMaybe<Scalars['BigInt']>;
  _RBTCSent_not?: InputMaybe<Scalars['BigInt']>;
  _RBTCSent_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  _actualZUSDAmount?: InputMaybe<Scalars['BigInt']>;
  _actualZUSDAmount_gt?: InputMaybe<Scalars['BigInt']>;
  _actualZUSDAmount_gte?: InputMaybe<Scalars['BigInt']>;
  _actualZUSDAmount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  _actualZUSDAmount_lt?: InputMaybe<Scalars['BigInt']>;
  _actualZUSDAmount_lte?: InputMaybe<Scalars['BigInt']>;
  _actualZUSDAmount_not?: InputMaybe<Scalars['BigInt']>;
  _actualZUSDAmount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  _attemptedZUSDAmount?: InputMaybe<Scalars['BigInt']>;
  _attemptedZUSDAmount_gt?: InputMaybe<Scalars['BigInt']>;
  _attemptedZUSDAmount_gte?: InputMaybe<Scalars['BigInt']>;
  _attemptedZUSDAmount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  _attemptedZUSDAmount_lt?: InputMaybe<Scalars['BigInt']>;
  _attemptedZUSDAmount_lte?: InputMaybe<Scalars['BigInt']>;
  _attemptedZUSDAmount_not?: InputMaybe<Scalars['BigInt']>;
  _attemptedZUSDAmount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
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
};

export enum RedemptionRaw_OrderBy {
  RbtcFee = '_RBTCFee',
  RbtcSent = '_RBTCSent',
  ActualZusdAmount = '_actualZUSDAmount',
  AttemptedZusdAmount = '_attemptedZUSDAmount',
  Id = 'id',
}

export type Redemption_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  collateralRedeemed?: InputMaybe<Scalars['BigDecimal']>;
  collateralRedeemed_gt?: InputMaybe<Scalars['BigDecimal']>;
  collateralRedeemed_gte?: InputMaybe<Scalars['BigDecimal']>;
  collateralRedeemed_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  collateralRedeemed_lt?: InputMaybe<Scalars['BigDecimal']>;
  collateralRedeemed_lte?: InputMaybe<Scalars['BigDecimal']>;
  collateralRedeemed_not?: InputMaybe<Scalars['BigDecimal']>;
  collateralRedeemed_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  fee?: InputMaybe<Scalars['BigDecimal']>;
  fee_gt?: InputMaybe<Scalars['BigDecimal']>;
  fee_gte?: InputMaybe<Scalars['BigDecimal']>;
  fee_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  fee_lt?: InputMaybe<Scalars['BigDecimal']>;
  fee_lte?: InputMaybe<Scalars['BigDecimal']>;
  fee_not?: InputMaybe<Scalars['BigDecimal']>;
  fee_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  partial?: InputMaybe<Scalars['Boolean']>;
  partial_in?: InputMaybe<Array<Scalars['Boolean']>>;
  partial_not?: InputMaybe<Scalars['Boolean']>;
  partial_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  redeemer?: InputMaybe<Scalars['String']>;
  redeemer_?: InputMaybe<User_Filter>;
  redeemer_contains?: InputMaybe<Scalars['String']>;
  redeemer_contains_nocase?: InputMaybe<Scalars['String']>;
  redeemer_ends_with?: InputMaybe<Scalars['String']>;
  redeemer_ends_with_nocase?: InputMaybe<Scalars['String']>;
  redeemer_gt?: InputMaybe<Scalars['String']>;
  redeemer_gte?: InputMaybe<Scalars['String']>;
  redeemer_in?: InputMaybe<Array<Scalars['String']>>;
  redeemer_lt?: InputMaybe<Scalars['String']>;
  redeemer_lte?: InputMaybe<Scalars['String']>;
  redeemer_not?: InputMaybe<Scalars['String']>;
  redeemer_not_contains?: InputMaybe<Scalars['String']>;
  redeemer_not_contains_nocase?: InputMaybe<Scalars['String']>;
  redeemer_not_ends_with?: InputMaybe<Scalars['String']>;
  redeemer_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  redeemer_not_in?: InputMaybe<Array<Scalars['String']>>;
  redeemer_not_starts_with?: InputMaybe<Scalars['String']>;
  redeemer_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  redeemer_starts_with?: InputMaybe<Scalars['String']>;
  redeemer_starts_with_nocase?: InputMaybe<Scalars['String']>;
  sequenceNumber?: InputMaybe<Scalars['Int']>;
  sequenceNumber_gt?: InputMaybe<Scalars['Int']>;
  sequenceNumber_gte?: InputMaybe<Scalars['Int']>;
  sequenceNumber_in?: InputMaybe<Array<Scalars['Int']>>;
  sequenceNumber_lt?: InputMaybe<Scalars['Int']>;
  sequenceNumber_lte?: InputMaybe<Scalars['Int']>;
  sequenceNumber_not?: InputMaybe<Scalars['Int']>;
  sequenceNumber_not_in?: InputMaybe<Array<Scalars['Int']>>;
  tokensActuallyRedeemed?: InputMaybe<Scalars['BigDecimal']>;
  tokensActuallyRedeemed_gt?: InputMaybe<Scalars['BigDecimal']>;
  tokensActuallyRedeemed_gte?: InputMaybe<Scalars['BigDecimal']>;
  tokensActuallyRedeemed_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  tokensActuallyRedeemed_lt?: InputMaybe<Scalars['BigDecimal']>;
  tokensActuallyRedeemed_lte?: InputMaybe<Scalars['BigDecimal']>;
  tokensActuallyRedeemed_not?: InputMaybe<Scalars['BigDecimal']>;
  tokensActuallyRedeemed_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  tokensAttemptedToRedeem?: InputMaybe<Scalars['BigDecimal']>;
  tokensAttemptedToRedeem_gt?: InputMaybe<Scalars['BigDecimal']>;
  tokensAttemptedToRedeem_gte?: InputMaybe<Scalars['BigDecimal']>;
  tokensAttemptedToRedeem_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  tokensAttemptedToRedeem_lt?: InputMaybe<Scalars['BigDecimal']>;
  tokensAttemptedToRedeem_lte?: InputMaybe<Scalars['BigDecimal']>;
  tokensAttemptedToRedeem_not?: InputMaybe<Scalars['BigDecimal']>;
  tokensAttemptedToRedeem_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
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
  troveChanges_?: InputMaybe<TroveChange_Filter>;
};

export enum Redemption_OrderBy {
  CollateralRedeemed = 'collateralRedeemed',
  Fee = 'fee',
  Id = 'id',
  Partial = 'partial',
  Redeemer = 'redeemer',
  SequenceNumber = 'sequenceNumber',
  TokensActuallyRedeemed = 'tokensActuallyRedeemed',
  TokensAttemptedToRedeem = 'tokensAttemptedToRedeem',
  Transaction = 'transaction',
  TroveChanges = 'troveChanges',
}

export type RevenueDaily = {
  __typename?: 'RevenueDaily';
  borrowFeeRBTC: Scalars['BigDecimal'];
  borrowFeeZUSD: Scalars['BigDecimal'];
  id: Scalars['ID'];
  /**
   * The liquidation compensation is equal to 0.5% of the RBTC collateral liquidated in a given time period.
   *
   */
  liquidationCompensation: Scalars['BigDecimal'];
  /**
   * Liquidation volume is the total amount of RBTC collateral liquidated in the given time period.
   *
   */
  liquidationVolume: Scalars['BigDecimal'];
  periodStartUnix: Scalars['BigInt'];
  redemptionFeeRBTC: Scalars['BigDecimal'];
  redemptionFeeZUSD: Scalars['BigDecimal'];
  /**
   * Stability Pool profit is the sum of profits accrued to the SP in the given time period;
   * each profit event is calculated at the time of each liquidation transaction as:
   * amount of RBTC collateral sent to the SP at the time of the liquidation - (amount of ZUSD taken from the SP to service the liquidation / USD price of RBTC at the time of the liquidation)
   *
   */
  stabilityPoolProfit: Scalars['BigDecimal'];
};

export type RevenueDaily_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  borrowFeeRBTC?: InputMaybe<Scalars['BigDecimal']>;
  borrowFeeRBTC_gt?: InputMaybe<Scalars['BigDecimal']>;
  borrowFeeRBTC_gte?: InputMaybe<Scalars['BigDecimal']>;
  borrowFeeRBTC_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  borrowFeeRBTC_lt?: InputMaybe<Scalars['BigDecimal']>;
  borrowFeeRBTC_lte?: InputMaybe<Scalars['BigDecimal']>;
  borrowFeeRBTC_not?: InputMaybe<Scalars['BigDecimal']>;
  borrowFeeRBTC_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  borrowFeeZUSD?: InputMaybe<Scalars['BigDecimal']>;
  borrowFeeZUSD_gt?: InputMaybe<Scalars['BigDecimal']>;
  borrowFeeZUSD_gte?: InputMaybe<Scalars['BigDecimal']>;
  borrowFeeZUSD_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  borrowFeeZUSD_lt?: InputMaybe<Scalars['BigDecimal']>;
  borrowFeeZUSD_lte?: InputMaybe<Scalars['BigDecimal']>;
  borrowFeeZUSD_not?: InputMaybe<Scalars['BigDecimal']>;
  borrowFeeZUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  liquidationCompensation?: InputMaybe<Scalars['BigDecimal']>;
  liquidationCompensation_gt?: InputMaybe<Scalars['BigDecimal']>;
  liquidationCompensation_gte?: InputMaybe<Scalars['BigDecimal']>;
  liquidationCompensation_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  liquidationCompensation_lt?: InputMaybe<Scalars['BigDecimal']>;
  liquidationCompensation_lte?: InputMaybe<Scalars['BigDecimal']>;
  liquidationCompensation_not?: InputMaybe<Scalars['BigDecimal']>;
  liquidationCompensation_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  liquidationVolume?: InputMaybe<Scalars['BigDecimal']>;
  liquidationVolume_gt?: InputMaybe<Scalars['BigDecimal']>;
  liquidationVolume_gte?: InputMaybe<Scalars['BigDecimal']>;
  liquidationVolume_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  liquidationVolume_lt?: InputMaybe<Scalars['BigDecimal']>;
  liquidationVolume_lte?: InputMaybe<Scalars['BigDecimal']>;
  liquidationVolume_not?: InputMaybe<Scalars['BigDecimal']>;
  liquidationVolume_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  periodStartUnix?: InputMaybe<Scalars['BigInt']>;
  periodStartUnix_gt?: InputMaybe<Scalars['BigInt']>;
  periodStartUnix_gte?: InputMaybe<Scalars['BigInt']>;
  periodStartUnix_in?: InputMaybe<Array<Scalars['BigInt']>>;
  periodStartUnix_lt?: InputMaybe<Scalars['BigInt']>;
  periodStartUnix_lte?: InputMaybe<Scalars['BigInt']>;
  periodStartUnix_not?: InputMaybe<Scalars['BigInt']>;
  periodStartUnix_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  redemptionFeeRBTC?: InputMaybe<Scalars['BigDecimal']>;
  redemptionFeeRBTC_gt?: InputMaybe<Scalars['BigDecimal']>;
  redemptionFeeRBTC_gte?: InputMaybe<Scalars['BigDecimal']>;
  redemptionFeeRBTC_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  redemptionFeeRBTC_lt?: InputMaybe<Scalars['BigDecimal']>;
  redemptionFeeRBTC_lte?: InputMaybe<Scalars['BigDecimal']>;
  redemptionFeeRBTC_not?: InputMaybe<Scalars['BigDecimal']>;
  redemptionFeeRBTC_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  redemptionFeeZUSD?: InputMaybe<Scalars['BigDecimal']>;
  redemptionFeeZUSD_gt?: InputMaybe<Scalars['BigDecimal']>;
  redemptionFeeZUSD_gte?: InputMaybe<Scalars['BigDecimal']>;
  redemptionFeeZUSD_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  redemptionFeeZUSD_lt?: InputMaybe<Scalars['BigDecimal']>;
  redemptionFeeZUSD_lte?: InputMaybe<Scalars['BigDecimal']>;
  redemptionFeeZUSD_not?: InputMaybe<Scalars['BigDecimal']>;
  redemptionFeeZUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  stabilityPoolProfit?: InputMaybe<Scalars['BigDecimal']>;
  stabilityPoolProfit_gt?: InputMaybe<Scalars['BigDecimal']>;
  stabilityPoolProfit_gte?: InputMaybe<Scalars['BigDecimal']>;
  stabilityPoolProfit_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  stabilityPoolProfit_lt?: InputMaybe<Scalars['BigDecimal']>;
  stabilityPoolProfit_lte?: InputMaybe<Scalars['BigDecimal']>;
  stabilityPoolProfit_not?: InputMaybe<Scalars['BigDecimal']>;
  stabilityPoolProfit_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
};

export enum RevenueDaily_OrderBy {
  BorrowFeeRbtc = 'borrowFeeRBTC',
  BorrowFeeZusd = 'borrowFeeZUSD',
  Id = 'id',
  LiquidationCompensation = 'liquidationCompensation',
  LiquidationVolume = 'liquidationVolume',
  PeriodStartUnix = 'periodStartUnix',
  RedemptionFeeRbtc = 'redemptionFeeRBTC',
  RedemptionFeeZusd = 'redemptionFeeZUSD',
  StabilityPoolProfit = 'stabilityPoolProfit',
}

export type RevenueWeekly = {
  __typename?: 'RevenueWeekly';
  borrowFeeRBTC: Scalars['BigDecimal'];
  borrowFeeZUSD: Scalars['BigDecimal'];
  id: Scalars['ID'];
  /**
   * The liquidation compensation is equal to 0.5% of the RBTC collateral liquidated in a given time period.
   *
   */
  liquidationCompensation: Scalars['BigDecimal'];
  /**
   * Liquidation volume is the total amount of RBTC collateral liquidated in the given time period.
   *
   */
  liquidationVolume: Scalars['BigDecimal'];
  periodStartUnix: Scalars['BigInt'];
  redemptionFeeRBTC: Scalars['BigDecimal'];
  redemptionFeeZUSD: Scalars['BigDecimal'];
  /**
   * Stability Pool profit is the sum of profits accrued to the SP in the given time period;
   * each profit event is calculated at the time of each liquidation transaction as:
   * (USD price of RBTC at the time of the liquidation / amount of RBTC collateral sent to the SP at the time of the liquidation) - (amount of ZUSD taken from the SP to service the liquidation / USD price of RBTC at the time of the liquidation)
   *
   */
  stabilityPoolProfit: Scalars['BigDecimal'];
};

export type RevenueWeekly_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  borrowFeeRBTC?: InputMaybe<Scalars['BigDecimal']>;
  borrowFeeRBTC_gt?: InputMaybe<Scalars['BigDecimal']>;
  borrowFeeRBTC_gte?: InputMaybe<Scalars['BigDecimal']>;
  borrowFeeRBTC_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  borrowFeeRBTC_lt?: InputMaybe<Scalars['BigDecimal']>;
  borrowFeeRBTC_lte?: InputMaybe<Scalars['BigDecimal']>;
  borrowFeeRBTC_not?: InputMaybe<Scalars['BigDecimal']>;
  borrowFeeRBTC_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  borrowFeeZUSD?: InputMaybe<Scalars['BigDecimal']>;
  borrowFeeZUSD_gt?: InputMaybe<Scalars['BigDecimal']>;
  borrowFeeZUSD_gte?: InputMaybe<Scalars['BigDecimal']>;
  borrowFeeZUSD_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  borrowFeeZUSD_lt?: InputMaybe<Scalars['BigDecimal']>;
  borrowFeeZUSD_lte?: InputMaybe<Scalars['BigDecimal']>;
  borrowFeeZUSD_not?: InputMaybe<Scalars['BigDecimal']>;
  borrowFeeZUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  liquidationCompensation?: InputMaybe<Scalars['BigDecimal']>;
  liquidationCompensation_gt?: InputMaybe<Scalars['BigDecimal']>;
  liquidationCompensation_gte?: InputMaybe<Scalars['BigDecimal']>;
  liquidationCompensation_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  liquidationCompensation_lt?: InputMaybe<Scalars['BigDecimal']>;
  liquidationCompensation_lte?: InputMaybe<Scalars['BigDecimal']>;
  liquidationCompensation_not?: InputMaybe<Scalars['BigDecimal']>;
  liquidationCompensation_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  liquidationVolume?: InputMaybe<Scalars['BigDecimal']>;
  liquidationVolume_gt?: InputMaybe<Scalars['BigDecimal']>;
  liquidationVolume_gte?: InputMaybe<Scalars['BigDecimal']>;
  liquidationVolume_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  liquidationVolume_lt?: InputMaybe<Scalars['BigDecimal']>;
  liquidationVolume_lte?: InputMaybe<Scalars['BigDecimal']>;
  liquidationVolume_not?: InputMaybe<Scalars['BigDecimal']>;
  liquidationVolume_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  periodStartUnix?: InputMaybe<Scalars['BigInt']>;
  periodStartUnix_gt?: InputMaybe<Scalars['BigInt']>;
  periodStartUnix_gte?: InputMaybe<Scalars['BigInt']>;
  periodStartUnix_in?: InputMaybe<Array<Scalars['BigInt']>>;
  periodStartUnix_lt?: InputMaybe<Scalars['BigInt']>;
  periodStartUnix_lte?: InputMaybe<Scalars['BigInt']>;
  periodStartUnix_not?: InputMaybe<Scalars['BigInt']>;
  periodStartUnix_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  redemptionFeeRBTC?: InputMaybe<Scalars['BigDecimal']>;
  redemptionFeeRBTC_gt?: InputMaybe<Scalars['BigDecimal']>;
  redemptionFeeRBTC_gte?: InputMaybe<Scalars['BigDecimal']>;
  redemptionFeeRBTC_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  redemptionFeeRBTC_lt?: InputMaybe<Scalars['BigDecimal']>;
  redemptionFeeRBTC_lte?: InputMaybe<Scalars['BigDecimal']>;
  redemptionFeeRBTC_not?: InputMaybe<Scalars['BigDecimal']>;
  redemptionFeeRBTC_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  redemptionFeeZUSD?: InputMaybe<Scalars['BigDecimal']>;
  redemptionFeeZUSD_gt?: InputMaybe<Scalars['BigDecimal']>;
  redemptionFeeZUSD_gte?: InputMaybe<Scalars['BigDecimal']>;
  redemptionFeeZUSD_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  redemptionFeeZUSD_lt?: InputMaybe<Scalars['BigDecimal']>;
  redemptionFeeZUSD_lte?: InputMaybe<Scalars['BigDecimal']>;
  redemptionFeeZUSD_not?: InputMaybe<Scalars['BigDecimal']>;
  redemptionFeeZUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  stabilityPoolProfit?: InputMaybe<Scalars['BigDecimal']>;
  stabilityPoolProfit_gt?: InputMaybe<Scalars['BigDecimal']>;
  stabilityPoolProfit_gte?: InputMaybe<Scalars['BigDecimal']>;
  stabilityPoolProfit_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  stabilityPoolProfit_lt?: InputMaybe<Scalars['BigDecimal']>;
  stabilityPoolProfit_lte?: InputMaybe<Scalars['BigDecimal']>;
  stabilityPoolProfit_not?: InputMaybe<Scalars['BigDecimal']>;
  stabilityPoolProfit_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
};

export enum RevenueWeekly_OrderBy {
  BorrowFeeRbtc = 'borrowFeeRBTC',
  BorrowFeeZusd = 'borrowFeeZUSD',
  Id = 'id',
  LiquidationCompensation = 'liquidationCompensation',
  LiquidationVolume = 'liquidationVolume',
  PeriodStartUnix = 'periodStartUnix',
  RedemptionFeeRbtc = 'redemptionFeeRBTC',
  RedemptionFeeZusd = 'redemptionFeeZUSD',
  StabilityPoolProfit = 'stabilityPoolProfit',
}

export type SovDistribution = {
  __typename?: 'SOVDistribution';
  amount?: Maybe<Scalars['BigInt']>;
  /** ID is transaction hash */
  id: Scalars['ID'];
  timestamp: Scalars['Int'];
  user: Scalars['Bytes'];
};

export type SovDistribution_Filter = {
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
  timestamp?: InputMaybe<Scalars['Int']>;
  timestamp_gt?: InputMaybe<Scalars['Int']>;
  timestamp_gte?: InputMaybe<Scalars['Int']>;
  timestamp_in?: InputMaybe<Array<Scalars['Int']>>;
  timestamp_lt?: InputMaybe<Scalars['Int']>;
  timestamp_lte?: InputMaybe<Scalars['Int']>;
  timestamp_not?: InputMaybe<Scalars['Int']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Int']>>;
  user?: InputMaybe<Scalars['Bytes']>;
  user_contains?: InputMaybe<Scalars['Bytes']>;
  user_in?: InputMaybe<Array<Scalars['Bytes']>>;
  user_not?: InputMaybe<Scalars['Bytes']>;
  user_not_contains?: InputMaybe<Scalars['Bytes']>;
  user_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum SovDistribution_OrderBy {
  Amount = 'amount',
  Id = 'id',
  Timestamp = 'timestamp',
  User = 'user',
}

export type StabilityDeposit = {
  __typename?: 'StabilityDeposit';
  changes: Array<StabilityDepositChange>;
  depositedAmount: Scalars['BigDecimal'];
  /** Owner's ID + '-' + an incremented integer */
  id: Scalars['ID'];
  owner: User;
};

export type StabilityDepositChangesArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<StabilityDepositChange_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<StabilityDepositChange_Filter>;
};

export type StabilityDepositChange = Change & {
  __typename?: 'StabilityDepositChange';
  /**
   * Block number is needed internally to calculate gains per user
   *
   */
  blockNumber: Scalars['Int'];
  collateralGain?: Maybe<Scalars['BigDecimal']>;
  depositedAmountAfter: Scalars['BigDecimal'];
  depositedAmountBefore: Scalars['BigDecimal'];
  depositedAmountChange: Scalars['BigDecimal'];
  id: Scalars['ID'];
  sequenceNumber: Scalars['Int'];
  stabilityDeposit: StabilityDeposit;
  stabilityDepositOperation: StabilityDepositOperation;
  systemStateAfter?: Maybe<SystemState>;
  systemStateBefore: SystemState;
  transaction: Transaction;
};

export type StabilityDepositChange_Filter = {
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
  collateralGain?: InputMaybe<Scalars['BigDecimal']>;
  collateralGain_gt?: InputMaybe<Scalars['BigDecimal']>;
  collateralGain_gte?: InputMaybe<Scalars['BigDecimal']>;
  collateralGain_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  collateralGain_lt?: InputMaybe<Scalars['BigDecimal']>;
  collateralGain_lte?: InputMaybe<Scalars['BigDecimal']>;
  collateralGain_not?: InputMaybe<Scalars['BigDecimal']>;
  collateralGain_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  depositedAmountAfter?: InputMaybe<Scalars['BigDecimal']>;
  depositedAmountAfter_gt?: InputMaybe<Scalars['BigDecimal']>;
  depositedAmountAfter_gte?: InputMaybe<Scalars['BigDecimal']>;
  depositedAmountAfter_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  depositedAmountAfter_lt?: InputMaybe<Scalars['BigDecimal']>;
  depositedAmountAfter_lte?: InputMaybe<Scalars['BigDecimal']>;
  depositedAmountAfter_not?: InputMaybe<Scalars['BigDecimal']>;
  depositedAmountAfter_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  depositedAmountBefore?: InputMaybe<Scalars['BigDecimal']>;
  depositedAmountBefore_gt?: InputMaybe<Scalars['BigDecimal']>;
  depositedAmountBefore_gte?: InputMaybe<Scalars['BigDecimal']>;
  depositedAmountBefore_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  depositedAmountBefore_lt?: InputMaybe<Scalars['BigDecimal']>;
  depositedAmountBefore_lte?: InputMaybe<Scalars['BigDecimal']>;
  depositedAmountBefore_not?: InputMaybe<Scalars['BigDecimal']>;
  depositedAmountBefore_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  depositedAmountChange?: InputMaybe<Scalars['BigDecimal']>;
  depositedAmountChange_gt?: InputMaybe<Scalars['BigDecimal']>;
  depositedAmountChange_gte?: InputMaybe<Scalars['BigDecimal']>;
  depositedAmountChange_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  depositedAmountChange_lt?: InputMaybe<Scalars['BigDecimal']>;
  depositedAmountChange_lte?: InputMaybe<Scalars['BigDecimal']>;
  depositedAmountChange_not?: InputMaybe<Scalars['BigDecimal']>;
  depositedAmountChange_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  sequenceNumber?: InputMaybe<Scalars['Int']>;
  sequenceNumber_gt?: InputMaybe<Scalars['Int']>;
  sequenceNumber_gte?: InputMaybe<Scalars['Int']>;
  sequenceNumber_in?: InputMaybe<Array<Scalars['Int']>>;
  sequenceNumber_lt?: InputMaybe<Scalars['Int']>;
  sequenceNumber_lte?: InputMaybe<Scalars['Int']>;
  sequenceNumber_not?: InputMaybe<Scalars['Int']>;
  sequenceNumber_not_in?: InputMaybe<Array<Scalars['Int']>>;
  stabilityDeposit?: InputMaybe<Scalars['String']>;
  stabilityDepositOperation?: InputMaybe<StabilityDepositOperation>;
  stabilityDepositOperation_in?: InputMaybe<Array<StabilityDepositOperation>>;
  stabilityDepositOperation_not?: InputMaybe<StabilityDepositOperation>;
  stabilityDepositOperation_not_in?: InputMaybe<
    Array<StabilityDepositOperation>
  >;
  stabilityDeposit_?: InputMaybe<StabilityDeposit_Filter>;
  stabilityDeposit_contains?: InputMaybe<Scalars['String']>;
  stabilityDeposit_contains_nocase?: InputMaybe<Scalars['String']>;
  stabilityDeposit_ends_with?: InputMaybe<Scalars['String']>;
  stabilityDeposit_ends_with_nocase?: InputMaybe<Scalars['String']>;
  stabilityDeposit_gt?: InputMaybe<Scalars['String']>;
  stabilityDeposit_gte?: InputMaybe<Scalars['String']>;
  stabilityDeposit_in?: InputMaybe<Array<Scalars['String']>>;
  stabilityDeposit_lt?: InputMaybe<Scalars['String']>;
  stabilityDeposit_lte?: InputMaybe<Scalars['String']>;
  stabilityDeposit_not?: InputMaybe<Scalars['String']>;
  stabilityDeposit_not_contains?: InputMaybe<Scalars['String']>;
  stabilityDeposit_not_contains_nocase?: InputMaybe<Scalars['String']>;
  stabilityDeposit_not_ends_with?: InputMaybe<Scalars['String']>;
  stabilityDeposit_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  stabilityDeposit_not_in?: InputMaybe<Array<Scalars['String']>>;
  stabilityDeposit_not_starts_with?: InputMaybe<Scalars['String']>;
  stabilityDeposit_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  stabilityDeposit_starts_with?: InputMaybe<Scalars['String']>;
  stabilityDeposit_starts_with_nocase?: InputMaybe<Scalars['String']>;
  systemStateAfter?: InputMaybe<Scalars['String']>;
  systemStateAfter_?: InputMaybe<SystemState_Filter>;
  systemStateAfter_contains?: InputMaybe<Scalars['String']>;
  systemStateAfter_contains_nocase?: InputMaybe<Scalars['String']>;
  systemStateAfter_ends_with?: InputMaybe<Scalars['String']>;
  systemStateAfter_ends_with_nocase?: InputMaybe<Scalars['String']>;
  systemStateAfter_gt?: InputMaybe<Scalars['String']>;
  systemStateAfter_gte?: InputMaybe<Scalars['String']>;
  systemStateAfter_in?: InputMaybe<Array<Scalars['String']>>;
  systemStateAfter_lt?: InputMaybe<Scalars['String']>;
  systemStateAfter_lte?: InputMaybe<Scalars['String']>;
  systemStateAfter_not?: InputMaybe<Scalars['String']>;
  systemStateAfter_not_contains?: InputMaybe<Scalars['String']>;
  systemStateAfter_not_contains_nocase?: InputMaybe<Scalars['String']>;
  systemStateAfter_not_ends_with?: InputMaybe<Scalars['String']>;
  systemStateAfter_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  systemStateAfter_not_in?: InputMaybe<Array<Scalars['String']>>;
  systemStateAfter_not_starts_with?: InputMaybe<Scalars['String']>;
  systemStateAfter_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  systemStateAfter_starts_with?: InputMaybe<Scalars['String']>;
  systemStateAfter_starts_with_nocase?: InputMaybe<Scalars['String']>;
  systemStateBefore?: InputMaybe<Scalars['String']>;
  systemStateBefore_?: InputMaybe<SystemState_Filter>;
  systemStateBefore_contains?: InputMaybe<Scalars['String']>;
  systemStateBefore_contains_nocase?: InputMaybe<Scalars['String']>;
  systemStateBefore_ends_with?: InputMaybe<Scalars['String']>;
  systemStateBefore_ends_with_nocase?: InputMaybe<Scalars['String']>;
  systemStateBefore_gt?: InputMaybe<Scalars['String']>;
  systemStateBefore_gte?: InputMaybe<Scalars['String']>;
  systemStateBefore_in?: InputMaybe<Array<Scalars['String']>>;
  systemStateBefore_lt?: InputMaybe<Scalars['String']>;
  systemStateBefore_lte?: InputMaybe<Scalars['String']>;
  systemStateBefore_not?: InputMaybe<Scalars['String']>;
  systemStateBefore_not_contains?: InputMaybe<Scalars['String']>;
  systemStateBefore_not_contains_nocase?: InputMaybe<Scalars['String']>;
  systemStateBefore_not_ends_with?: InputMaybe<Scalars['String']>;
  systemStateBefore_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  systemStateBefore_not_in?: InputMaybe<Array<Scalars['String']>>;
  systemStateBefore_not_starts_with?: InputMaybe<Scalars['String']>;
  systemStateBefore_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  systemStateBefore_starts_with?: InputMaybe<Scalars['String']>;
  systemStateBefore_starts_with_nocase?: InputMaybe<Scalars['String']>;
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

export enum StabilityDepositChange_OrderBy {
  BlockNumber = 'blockNumber',
  CollateralGain = 'collateralGain',
  DepositedAmountAfter = 'depositedAmountAfter',
  DepositedAmountBefore = 'depositedAmountBefore',
  DepositedAmountChange = 'depositedAmountChange',
  Id = 'id',
  SequenceNumber = 'sequenceNumber',
  StabilityDeposit = 'stabilityDeposit',
  StabilityDepositOperation = 'stabilityDepositOperation',
  SystemStateAfter = 'systemStateAfter',
  SystemStateBefore = 'systemStateBefore',
  Transaction = 'transaction',
}

export enum StabilityDepositOperation {
  DepositTokens = 'depositTokens',
  WithdrawCollateralGain = 'withdrawCollateralGain',
  WithdrawGainToLineOfCredit = 'withdrawGainToLineOfCredit',
  WithdrawTokens = 'withdrawTokens',
}

export type StabilityDeposit_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  changes_?: InputMaybe<StabilityDepositChange_Filter>;
  depositedAmount?: InputMaybe<Scalars['BigDecimal']>;
  depositedAmount_gt?: InputMaybe<Scalars['BigDecimal']>;
  depositedAmount_gte?: InputMaybe<Scalars['BigDecimal']>;
  depositedAmount_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  depositedAmount_lt?: InputMaybe<Scalars['BigDecimal']>;
  depositedAmount_lte?: InputMaybe<Scalars['BigDecimal']>;
  depositedAmount_not?: InputMaybe<Scalars['BigDecimal']>;
  depositedAmount_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  owner?: InputMaybe<Scalars['String']>;
  owner_?: InputMaybe<User_Filter>;
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
};

export enum StabilityDeposit_OrderBy {
  Changes = 'changes',
  DepositedAmount = 'depositedAmount',
  Id = 'id',
  Owner = 'owner',
}

export type Subscription = {
  __typename?: 'Subscription';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  change?: Maybe<Change>;
  changes: Array<Change>;
  collSurplusChange?: Maybe<CollSurplusChange>;
  collSurplusChanges: Array<CollSurplusChange>;
  global?: Maybe<Global>;
  globals: Array<Global>;
  liquidation?: Maybe<Liquidation>;
  liquidations: Array<Liquidation>;
  priceChange?: Maybe<PriceChange>;
  priceChanges: Array<PriceChange>;
  redemption?: Maybe<Redemption>;
  redemptionRaw?: Maybe<RedemptionRaw>;
  redemptionRaws: Array<RedemptionRaw>;
  redemptions: Array<Redemption>;
  revenueDailies: Array<RevenueDaily>;
  revenueDaily?: Maybe<RevenueDaily>;
  revenueWeeklies: Array<RevenueWeekly>;
  revenueWeekly?: Maybe<RevenueWeekly>;
  sovdistribution?: Maybe<SovDistribution>;
  sovdistributions: Array<SovDistribution>;
  stabilityDeposit?: Maybe<StabilityDeposit>;
  stabilityDepositChange?: Maybe<StabilityDepositChange>;
  stabilityDepositChanges: Array<StabilityDepositChange>;
  stabilityDeposits: Array<StabilityDeposit>;
  systemState?: Maybe<SystemState>;
  systemStates: Array<SystemState>;
  tempDepositUpdate?: Maybe<TempDepositUpdate>;
  tempDepositUpdates: Array<TempDepositUpdate>;
  token?: Maybe<Token>;
  tokenAllowance?: Maybe<TokenAllowance>;
  tokenAllowances: Array<TokenAllowance>;
  tokenBalance?: Maybe<TokenBalance>;
  tokenBalances: Array<TokenBalance>;
  tokens: Array<Token>;
  transaction?: Maybe<Transaction>;
  transactions: Array<Transaction>;
  trove?: Maybe<Trove>;
  troveChange?: Maybe<TroveChange>;
  troveChanges: Array<TroveChange>;
  troves: Array<Trove>;
  user?: Maybe<User>;
  users: Array<User>;
};

export type Subscription_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};

export type SubscriptionChangeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionChangesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Change_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Change_Filter>;
};

export type SubscriptionCollSurplusChangeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionCollSurplusChangesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<CollSurplusChange_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<CollSurplusChange_Filter>;
};

export type SubscriptionGlobalArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionGlobalsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Global_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Global_Filter>;
};

export type SubscriptionLiquidationArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionLiquidationsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Liquidation_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Liquidation_Filter>;
};

export type SubscriptionPriceChangeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionPriceChangesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<PriceChange_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PriceChange_Filter>;
};

export type SubscriptionRedemptionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionRedemptionRawArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionRedemptionRawsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<RedemptionRaw_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<RedemptionRaw_Filter>;
};

export type SubscriptionRedemptionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Redemption_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Redemption_Filter>;
};

export type SubscriptionRevenueDailiesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<RevenueDaily_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<RevenueDaily_Filter>;
};

export type SubscriptionRevenueDailyArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionRevenueWeekliesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<RevenueWeekly_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<RevenueWeekly_Filter>;
};

export type SubscriptionRevenueWeeklyArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionSovdistributionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionSovdistributionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<SovDistribution_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<SovDistribution_Filter>;
};

export type SubscriptionStabilityDepositArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionStabilityDepositChangeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionStabilityDepositChangesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<StabilityDepositChange_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<StabilityDepositChange_Filter>;
};

export type SubscriptionStabilityDepositsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<StabilityDeposit_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<StabilityDeposit_Filter>;
};

export type SubscriptionSystemStateArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionSystemStatesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<SystemState_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<SystemState_Filter>;
};

export type SubscriptionTempDepositUpdateArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionTempDepositUpdatesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TempDepositUpdate_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TempDepositUpdate_Filter>;
};

export type SubscriptionTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionTokenAllowanceArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionTokenAllowancesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TokenAllowance_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TokenAllowance_Filter>;
};

export type SubscriptionTokenBalanceArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionTokenBalancesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TokenBalance_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TokenBalance_Filter>;
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

export type SubscriptionTroveArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionTroveChangeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionTroveChangesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TroveChange_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TroveChange_Filter>;
};

export type SubscriptionTrovesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Trove_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Trove_Filter>;
};

export type SubscriptionUserArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
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

export type SystemState = {
  __typename?: 'SystemState';
  cause?: Maybe<Change>;
  collSurplusPoolBalance: Scalars['BigDecimal'];
  /** Sequence number as an ID (string) */
  id: Scalars['ID'];
  price?: Maybe<Scalars['BigDecimal']>;
  /** Can be used to chronologically sort SystemStates */
  sequenceNumber: Scalars['Int'];
  tokensInStabilityPool: Scalars['BigDecimal'];
  totalCollateral: Scalars['BigDecimal'];
  totalCollateralRatio?: Maybe<Scalars['BigDecimal']>;
  totalDebt: Scalars['BigDecimal'];
};

export type SystemState_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  collSurplusPoolBalance?: InputMaybe<Scalars['BigDecimal']>;
  collSurplusPoolBalance_gt?: InputMaybe<Scalars['BigDecimal']>;
  collSurplusPoolBalance_gte?: InputMaybe<Scalars['BigDecimal']>;
  collSurplusPoolBalance_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  collSurplusPoolBalance_lt?: InputMaybe<Scalars['BigDecimal']>;
  collSurplusPoolBalance_lte?: InputMaybe<Scalars['BigDecimal']>;
  collSurplusPoolBalance_not?: InputMaybe<Scalars['BigDecimal']>;
  collSurplusPoolBalance_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  price?: InputMaybe<Scalars['BigDecimal']>;
  price_gt?: InputMaybe<Scalars['BigDecimal']>;
  price_gte?: InputMaybe<Scalars['BigDecimal']>;
  price_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  price_lt?: InputMaybe<Scalars['BigDecimal']>;
  price_lte?: InputMaybe<Scalars['BigDecimal']>;
  price_not?: InputMaybe<Scalars['BigDecimal']>;
  price_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  sequenceNumber?: InputMaybe<Scalars['Int']>;
  sequenceNumber_gt?: InputMaybe<Scalars['Int']>;
  sequenceNumber_gte?: InputMaybe<Scalars['Int']>;
  sequenceNumber_in?: InputMaybe<Array<Scalars['Int']>>;
  sequenceNumber_lt?: InputMaybe<Scalars['Int']>;
  sequenceNumber_lte?: InputMaybe<Scalars['Int']>;
  sequenceNumber_not?: InputMaybe<Scalars['Int']>;
  sequenceNumber_not_in?: InputMaybe<Array<Scalars['Int']>>;
  tokensInStabilityPool?: InputMaybe<Scalars['BigDecimal']>;
  tokensInStabilityPool_gt?: InputMaybe<Scalars['BigDecimal']>;
  tokensInStabilityPool_gte?: InputMaybe<Scalars['BigDecimal']>;
  tokensInStabilityPool_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  tokensInStabilityPool_lt?: InputMaybe<Scalars['BigDecimal']>;
  tokensInStabilityPool_lte?: InputMaybe<Scalars['BigDecimal']>;
  tokensInStabilityPool_not?: InputMaybe<Scalars['BigDecimal']>;
  tokensInStabilityPool_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalCollateral?: InputMaybe<Scalars['BigDecimal']>;
  totalCollateralRatio?: InputMaybe<Scalars['BigDecimal']>;
  totalCollateralRatio_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalCollateralRatio_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalCollateralRatio_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalCollateralRatio_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalCollateralRatio_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalCollateralRatio_not?: InputMaybe<Scalars['BigDecimal']>;
  totalCollateralRatio_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalCollateral_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalCollateral_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalCollateral_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalCollateral_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalCollateral_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalCollateral_not?: InputMaybe<Scalars['BigDecimal']>;
  totalCollateral_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalDebt?: InputMaybe<Scalars['BigDecimal']>;
  totalDebt_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalDebt_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalDebt_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalDebt_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalDebt_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalDebt_not?: InputMaybe<Scalars['BigDecimal']>;
  totalDebt_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
};

export enum SystemState_OrderBy {
  Cause = 'cause',
  CollSurplusPoolBalance = 'collSurplusPoolBalance',
  Id = 'id',
  Price = 'price',
  SequenceNumber = 'sequenceNumber',
  TokensInStabilityPool = 'tokensInStabilityPool',
  TotalCollateral = 'totalCollateral',
  TotalCollateralRatio = 'totalCollateralRatio',
  TotalDebt = 'totalDebt',
}

export type TempDepositUpdate = {
  __typename?: 'TempDepositUpdate';
  amount?: Maybe<Scalars['BigInt']>;
  /** ID is transaction hash */
  id: Scalars['ID'];
};

export type TempDepositUpdate_Filter = {
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
};

export enum TempDepositUpdate_OrderBy {
  Amount = 'amount',
  Id = 'id',
}

export type Token = {
  __typename?: 'Token';
  allowances?: Maybe<Array<TokenAllowance>>;
  balances?: Maybe<Array<TokenBalance>>;
  id: Scalars['ID'];
  name: Scalars['String'];
  symbol: Scalars['String'];
  totalSupply: Scalars['BigInt'];
};

export type TokenAllowancesArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TokenAllowance_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<TokenAllowance_Filter>;
};

export type TokenBalancesArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TokenBalance_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<TokenBalance_Filter>;
};

export type TokenAllowance = {
  __typename?: 'TokenAllowance';
  id: Scalars['ID'];
  owner: User;
  spender: User;
  token: Token;
  value: Scalars['BigInt'];
};

export type TokenAllowance_Filter = {
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
  owner?: InputMaybe<Scalars['String']>;
  owner_?: InputMaybe<User_Filter>;
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
  spender?: InputMaybe<Scalars['String']>;
  spender_?: InputMaybe<User_Filter>;
  spender_contains?: InputMaybe<Scalars['String']>;
  spender_contains_nocase?: InputMaybe<Scalars['String']>;
  spender_ends_with?: InputMaybe<Scalars['String']>;
  spender_ends_with_nocase?: InputMaybe<Scalars['String']>;
  spender_gt?: InputMaybe<Scalars['String']>;
  spender_gte?: InputMaybe<Scalars['String']>;
  spender_in?: InputMaybe<Array<Scalars['String']>>;
  spender_lt?: InputMaybe<Scalars['String']>;
  spender_lte?: InputMaybe<Scalars['String']>;
  spender_not?: InputMaybe<Scalars['String']>;
  spender_not_contains?: InputMaybe<Scalars['String']>;
  spender_not_contains_nocase?: InputMaybe<Scalars['String']>;
  spender_not_ends_with?: InputMaybe<Scalars['String']>;
  spender_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  spender_not_in?: InputMaybe<Array<Scalars['String']>>;
  spender_not_starts_with?: InputMaybe<Scalars['String']>;
  spender_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  spender_starts_with?: InputMaybe<Scalars['String']>;
  spender_starts_with_nocase?: InputMaybe<Scalars['String']>;
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
  value?: InputMaybe<Scalars['BigInt']>;
  value_gt?: InputMaybe<Scalars['BigInt']>;
  value_gte?: InputMaybe<Scalars['BigInt']>;
  value_in?: InputMaybe<Array<Scalars['BigInt']>>;
  value_lt?: InputMaybe<Scalars['BigInt']>;
  value_lte?: InputMaybe<Scalars['BigInt']>;
  value_not?: InputMaybe<Scalars['BigInt']>;
  value_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export enum TokenAllowance_OrderBy {
  Id = 'id',
  Owner = 'owner',
  Spender = 'spender',
  Token = 'token',
  Value = 'value',
}

export type TokenBalance = {
  __typename?: 'TokenBalance';
  balance: Scalars['BigInt'];
  id: Scalars['ID'];
  owner: User;
  token: Token;
};

export type TokenBalance_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  balance?: InputMaybe<Scalars['BigInt']>;
  balance_gt?: InputMaybe<Scalars['BigInt']>;
  balance_gte?: InputMaybe<Scalars['BigInt']>;
  balance_in?: InputMaybe<Array<Scalars['BigInt']>>;
  balance_lt?: InputMaybe<Scalars['BigInt']>;
  balance_lte?: InputMaybe<Scalars['BigInt']>;
  balance_not?: InputMaybe<Scalars['BigInt']>;
  balance_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  owner?: InputMaybe<Scalars['String']>;
  owner_?: InputMaybe<User_Filter>;
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

export enum TokenBalance_OrderBy {
  Balance = 'balance',
  Id = 'id',
  Owner = 'owner',
  Token = 'token',
}

export type Token_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  allowances_?: InputMaybe<TokenAllowance_Filter>;
  balances_?: InputMaybe<TokenBalance_Filter>;
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
  Allowances = 'allowances',
  Balances = 'balances',
  Id = 'id',
  Name = 'name',
  Symbol = 'symbol',
  TotalSupply = 'totalSupply',
}

export type Transaction = {
  __typename?: 'Transaction';
  blockNumber: Scalars['Int'];
  changes: Array<Change>;
  /**
   * The account that initiated this transaction. This must be an Account and not a Contract.
   *
   */
  from: Scalars['Bytes'];
  functionSignature: Scalars['String'];
  gasLimit: Scalars['BigInt'];
  gasPrice: Scalars['BigInt'];
  gasUsed?: Maybe<Scalars['BigInt']>;
  /** Transaction hash */
  id: Scalars['ID'];
  /**
   * The index of this transaction within the block
   *
   */
  index: Scalars['Int'];
  /** Can be used to correctly sort transactions even if they were mined in the same block */
  sequenceNumber: Scalars['Int'];
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

export type TransactionChangesArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Change_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Change_Filter>;
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
  from?: InputMaybe<Scalars['Bytes']>;
  from_contains?: InputMaybe<Scalars['Bytes']>;
  from_in?: InputMaybe<Array<Scalars['Bytes']>>;
  from_not?: InputMaybe<Scalars['Bytes']>;
  from_not_contains?: InputMaybe<Scalars['Bytes']>;
  from_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
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
  gasUsed?: InputMaybe<Scalars['BigInt']>;
  gasUsed_gt?: InputMaybe<Scalars['BigInt']>;
  gasUsed_gte?: InputMaybe<Scalars['BigInt']>;
  gasUsed_in?: InputMaybe<Array<Scalars['BigInt']>>;
  gasUsed_lt?: InputMaybe<Scalars['BigInt']>;
  gasUsed_lte?: InputMaybe<Scalars['BigInt']>;
  gasUsed_not?: InputMaybe<Scalars['BigInt']>;
  gasUsed_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
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
  sequenceNumber?: InputMaybe<Scalars['Int']>;
  sequenceNumber_gt?: InputMaybe<Scalars['Int']>;
  sequenceNumber_gte?: InputMaybe<Scalars['Int']>;
  sequenceNumber_in?: InputMaybe<Array<Scalars['Int']>>;
  sequenceNumber_lt?: InputMaybe<Scalars['Int']>;
  sequenceNumber_lte?: InputMaybe<Scalars['Int']>;
  sequenceNumber_not?: InputMaybe<Scalars['Int']>;
  sequenceNumber_not_in?: InputMaybe<Array<Scalars['Int']>>;
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
  Changes = 'changes',
  From = 'from',
  FunctionSignature = 'functionSignature',
  GasLimit = 'gasLimit',
  GasPrice = 'gasPrice',
  GasUsed = 'gasUsed',
  Id = 'id',
  Index = 'index',
  SequenceNumber = 'sequenceNumber',
  Timestamp = 'timestamp',
  To = 'to',
  Value = 'value',
}

export type Trove = {
  __typename?: 'Trove';
  changes: Array<TroveChange>;
  collateral: Scalars['BigDecimal'];
  collateralRatioSortKey?: Maybe<Scalars['BigDecimal']>;
  /** Ordering by this field will result in the same ordering as collateral ratio (except reversed) */
  collateralRatioSortKey_legacy?: Maybe<Scalars['BigInt']>;
  debt: Scalars['BigDecimal'];
  /** Owner's ID */
  id: Scalars['ID'];
  owner: User;
  rawCollateral: Scalars['BigInt'];
  rawDebt: Scalars['BigInt'];
  /** The value of total redistributed per-stake collateral the last time rewards were applied */
  rawSnapshotOfTotalRedistributedCollateral: Scalars['BigInt'];
  /** The value of total redistributed per-stake debt the last time rewards were applied */
  rawSnapshotOfTotalRedistributedDebt: Scalars['BigInt'];
  rawStake: Scalars['BigInt'];
  status: TroveStatus;
};

export type TroveChangesArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TroveChange_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<TroveChange_Filter>;
};

export type TroveChange = Change & {
  __typename?: 'TroveChange';
  borrowingFee?: Maybe<Scalars['BigDecimal']>;
  collateralAfter: Scalars['BigDecimal'];
  collateralBefore: Scalars['BigDecimal'];
  collateralChange: Scalars['BigDecimal'];
  collateralRatioAfter?: Maybe<Scalars['BigDecimal']>;
  collateralRatioBefore?: Maybe<Scalars['BigDecimal']>;
  debtAfter: Scalars['BigDecimal'];
  debtBefore: Scalars['BigDecimal'];
  debtChange: Scalars['BigDecimal'];
  id: Scalars['ID'];
  liquidation?: Maybe<Liquidation>;
  redemption?: Maybe<Redemption>;
  sequenceNumber: Scalars['Int'];
  systemStateAfter?: Maybe<SystemState>;
  systemStateBefore: SystemState;
  transaction: Transaction;
  trove: Trove;
  troveOperation: TroveOperation;
};

export type TroveChange_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  borrowingFee?: InputMaybe<Scalars['BigDecimal']>;
  borrowingFee_gt?: InputMaybe<Scalars['BigDecimal']>;
  borrowingFee_gte?: InputMaybe<Scalars['BigDecimal']>;
  borrowingFee_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  borrowingFee_lt?: InputMaybe<Scalars['BigDecimal']>;
  borrowingFee_lte?: InputMaybe<Scalars['BigDecimal']>;
  borrowingFee_not?: InputMaybe<Scalars['BigDecimal']>;
  borrowingFee_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  collateralAfter?: InputMaybe<Scalars['BigDecimal']>;
  collateralAfter_gt?: InputMaybe<Scalars['BigDecimal']>;
  collateralAfter_gte?: InputMaybe<Scalars['BigDecimal']>;
  collateralAfter_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  collateralAfter_lt?: InputMaybe<Scalars['BigDecimal']>;
  collateralAfter_lte?: InputMaybe<Scalars['BigDecimal']>;
  collateralAfter_not?: InputMaybe<Scalars['BigDecimal']>;
  collateralAfter_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  collateralBefore?: InputMaybe<Scalars['BigDecimal']>;
  collateralBefore_gt?: InputMaybe<Scalars['BigDecimal']>;
  collateralBefore_gte?: InputMaybe<Scalars['BigDecimal']>;
  collateralBefore_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  collateralBefore_lt?: InputMaybe<Scalars['BigDecimal']>;
  collateralBefore_lte?: InputMaybe<Scalars['BigDecimal']>;
  collateralBefore_not?: InputMaybe<Scalars['BigDecimal']>;
  collateralBefore_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  collateralChange?: InputMaybe<Scalars['BigDecimal']>;
  collateralChange_gt?: InputMaybe<Scalars['BigDecimal']>;
  collateralChange_gte?: InputMaybe<Scalars['BigDecimal']>;
  collateralChange_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  collateralChange_lt?: InputMaybe<Scalars['BigDecimal']>;
  collateralChange_lte?: InputMaybe<Scalars['BigDecimal']>;
  collateralChange_not?: InputMaybe<Scalars['BigDecimal']>;
  collateralChange_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  collateralRatioAfter?: InputMaybe<Scalars['BigDecimal']>;
  collateralRatioAfter_gt?: InputMaybe<Scalars['BigDecimal']>;
  collateralRatioAfter_gte?: InputMaybe<Scalars['BigDecimal']>;
  collateralRatioAfter_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  collateralRatioAfter_lt?: InputMaybe<Scalars['BigDecimal']>;
  collateralRatioAfter_lte?: InputMaybe<Scalars['BigDecimal']>;
  collateralRatioAfter_not?: InputMaybe<Scalars['BigDecimal']>;
  collateralRatioAfter_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  collateralRatioBefore?: InputMaybe<Scalars['BigDecimal']>;
  collateralRatioBefore_gt?: InputMaybe<Scalars['BigDecimal']>;
  collateralRatioBefore_gte?: InputMaybe<Scalars['BigDecimal']>;
  collateralRatioBefore_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  collateralRatioBefore_lt?: InputMaybe<Scalars['BigDecimal']>;
  collateralRatioBefore_lte?: InputMaybe<Scalars['BigDecimal']>;
  collateralRatioBefore_not?: InputMaybe<Scalars['BigDecimal']>;
  collateralRatioBefore_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  debtAfter?: InputMaybe<Scalars['BigDecimal']>;
  debtAfter_gt?: InputMaybe<Scalars['BigDecimal']>;
  debtAfter_gte?: InputMaybe<Scalars['BigDecimal']>;
  debtAfter_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  debtAfter_lt?: InputMaybe<Scalars['BigDecimal']>;
  debtAfter_lte?: InputMaybe<Scalars['BigDecimal']>;
  debtAfter_not?: InputMaybe<Scalars['BigDecimal']>;
  debtAfter_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  debtBefore?: InputMaybe<Scalars['BigDecimal']>;
  debtBefore_gt?: InputMaybe<Scalars['BigDecimal']>;
  debtBefore_gte?: InputMaybe<Scalars['BigDecimal']>;
  debtBefore_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  debtBefore_lt?: InputMaybe<Scalars['BigDecimal']>;
  debtBefore_lte?: InputMaybe<Scalars['BigDecimal']>;
  debtBefore_not?: InputMaybe<Scalars['BigDecimal']>;
  debtBefore_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  debtChange?: InputMaybe<Scalars['BigDecimal']>;
  debtChange_gt?: InputMaybe<Scalars['BigDecimal']>;
  debtChange_gte?: InputMaybe<Scalars['BigDecimal']>;
  debtChange_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  debtChange_lt?: InputMaybe<Scalars['BigDecimal']>;
  debtChange_lte?: InputMaybe<Scalars['BigDecimal']>;
  debtChange_not?: InputMaybe<Scalars['BigDecimal']>;
  debtChange_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  liquidation?: InputMaybe<Scalars['String']>;
  liquidation_?: InputMaybe<Liquidation_Filter>;
  liquidation_contains?: InputMaybe<Scalars['String']>;
  liquidation_contains_nocase?: InputMaybe<Scalars['String']>;
  liquidation_ends_with?: InputMaybe<Scalars['String']>;
  liquidation_ends_with_nocase?: InputMaybe<Scalars['String']>;
  liquidation_gt?: InputMaybe<Scalars['String']>;
  liquidation_gte?: InputMaybe<Scalars['String']>;
  liquidation_in?: InputMaybe<Array<Scalars['String']>>;
  liquidation_lt?: InputMaybe<Scalars['String']>;
  liquidation_lte?: InputMaybe<Scalars['String']>;
  liquidation_not?: InputMaybe<Scalars['String']>;
  liquidation_not_contains?: InputMaybe<Scalars['String']>;
  liquidation_not_contains_nocase?: InputMaybe<Scalars['String']>;
  liquidation_not_ends_with?: InputMaybe<Scalars['String']>;
  liquidation_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  liquidation_not_in?: InputMaybe<Array<Scalars['String']>>;
  liquidation_not_starts_with?: InputMaybe<Scalars['String']>;
  liquidation_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  liquidation_starts_with?: InputMaybe<Scalars['String']>;
  liquidation_starts_with_nocase?: InputMaybe<Scalars['String']>;
  redemption?: InputMaybe<Scalars['String']>;
  redemption_?: InputMaybe<Redemption_Filter>;
  redemption_contains?: InputMaybe<Scalars['String']>;
  redemption_contains_nocase?: InputMaybe<Scalars['String']>;
  redemption_ends_with?: InputMaybe<Scalars['String']>;
  redemption_ends_with_nocase?: InputMaybe<Scalars['String']>;
  redemption_gt?: InputMaybe<Scalars['String']>;
  redemption_gte?: InputMaybe<Scalars['String']>;
  redemption_in?: InputMaybe<Array<Scalars['String']>>;
  redemption_lt?: InputMaybe<Scalars['String']>;
  redemption_lte?: InputMaybe<Scalars['String']>;
  redemption_not?: InputMaybe<Scalars['String']>;
  redemption_not_contains?: InputMaybe<Scalars['String']>;
  redemption_not_contains_nocase?: InputMaybe<Scalars['String']>;
  redemption_not_ends_with?: InputMaybe<Scalars['String']>;
  redemption_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  redemption_not_in?: InputMaybe<Array<Scalars['String']>>;
  redemption_not_starts_with?: InputMaybe<Scalars['String']>;
  redemption_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  redemption_starts_with?: InputMaybe<Scalars['String']>;
  redemption_starts_with_nocase?: InputMaybe<Scalars['String']>;
  sequenceNumber?: InputMaybe<Scalars['Int']>;
  sequenceNumber_gt?: InputMaybe<Scalars['Int']>;
  sequenceNumber_gte?: InputMaybe<Scalars['Int']>;
  sequenceNumber_in?: InputMaybe<Array<Scalars['Int']>>;
  sequenceNumber_lt?: InputMaybe<Scalars['Int']>;
  sequenceNumber_lte?: InputMaybe<Scalars['Int']>;
  sequenceNumber_not?: InputMaybe<Scalars['Int']>;
  sequenceNumber_not_in?: InputMaybe<Array<Scalars['Int']>>;
  systemStateAfter?: InputMaybe<Scalars['String']>;
  systemStateAfter_?: InputMaybe<SystemState_Filter>;
  systemStateAfter_contains?: InputMaybe<Scalars['String']>;
  systemStateAfter_contains_nocase?: InputMaybe<Scalars['String']>;
  systemStateAfter_ends_with?: InputMaybe<Scalars['String']>;
  systemStateAfter_ends_with_nocase?: InputMaybe<Scalars['String']>;
  systemStateAfter_gt?: InputMaybe<Scalars['String']>;
  systemStateAfter_gte?: InputMaybe<Scalars['String']>;
  systemStateAfter_in?: InputMaybe<Array<Scalars['String']>>;
  systemStateAfter_lt?: InputMaybe<Scalars['String']>;
  systemStateAfter_lte?: InputMaybe<Scalars['String']>;
  systemStateAfter_not?: InputMaybe<Scalars['String']>;
  systemStateAfter_not_contains?: InputMaybe<Scalars['String']>;
  systemStateAfter_not_contains_nocase?: InputMaybe<Scalars['String']>;
  systemStateAfter_not_ends_with?: InputMaybe<Scalars['String']>;
  systemStateAfter_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  systemStateAfter_not_in?: InputMaybe<Array<Scalars['String']>>;
  systemStateAfter_not_starts_with?: InputMaybe<Scalars['String']>;
  systemStateAfter_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  systemStateAfter_starts_with?: InputMaybe<Scalars['String']>;
  systemStateAfter_starts_with_nocase?: InputMaybe<Scalars['String']>;
  systemStateBefore?: InputMaybe<Scalars['String']>;
  systemStateBefore_?: InputMaybe<SystemState_Filter>;
  systemStateBefore_contains?: InputMaybe<Scalars['String']>;
  systemStateBefore_contains_nocase?: InputMaybe<Scalars['String']>;
  systemStateBefore_ends_with?: InputMaybe<Scalars['String']>;
  systemStateBefore_ends_with_nocase?: InputMaybe<Scalars['String']>;
  systemStateBefore_gt?: InputMaybe<Scalars['String']>;
  systemStateBefore_gte?: InputMaybe<Scalars['String']>;
  systemStateBefore_in?: InputMaybe<Array<Scalars['String']>>;
  systemStateBefore_lt?: InputMaybe<Scalars['String']>;
  systemStateBefore_lte?: InputMaybe<Scalars['String']>;
  systemStateBefore_not?: InputMaybe<Scalars['String']>;
  systemStateBefore_not_contains?: InputMaybe<Scalars['String']>;
  systemStateBefore_not_contains_nocase?: InputMaybe<Scalars['String']>;
  systemStateBefore_not_ends_with?: InputMaybe<Scalars['String']>;
  systemStateBefore_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  systemStateBefore_not_in?: InputMaybe<Array<Scalars['String']>>;
  systemStateBefore_not_starts_with?: InputMaybe<Scalars['String']>;
  systemStateBefore_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  systemStateBefore_starts_with?: InputMaybe<Scalars['String']>;
  systemStateBefore_starts_with_nocase?: InputMaybe<Scalars['String']>;
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
  trove?: InputMaybe<Scalars['String']>;
  troveOperation?: InputMaybe<TroveOperation>;
  troveOperation_in?: InputMaybe<Array<TroveOperation>>;
  troveOperation_not?: InputMaybe<TroveOperation>;
  troveOperation_not_in?: InputMaybe<Array<TroveOperation>>;
  trove_?: InputMaybe<Trove_Filter>;
  trove_contains?: InputMaybe<Scalars['String']>;
  trove_contains_nocase?: InputMaybe<Scalars['String']>;
  trove_ends_with?: InputMaybe<Scalars['String']>;
  trove_ends_with_nocase?: InputMaybe<Scalars['String']>;
  trove_gt?: InputMaybe<Scalars['String']>;
  trove_gte?: InputMaybe<Scalars['String']>;
  trove_in?: InputMaybe<Array<Scalars['String']>>;
  trove_lt?: InputMaybe<Scalars['String']>;
  trove_lte?: InputMaybe<Scalars['String']>;
  trove_not?: InputMaybe<Scalars['String']>;
  trove_not_contains?: InputMaybe<Scalars['String']>;
  trove_not_contains_nocase?: InputMaybe<Scalars['String']>;
  trove_not_ends_with?: InputMaybe<Scalars['String']>;
  trove_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  trove_not_in?: InputMaybe<Array<Scalars['String']>>;
  trove_not_starts_with?: InputMaybe<Scalars['String']>;
  trove_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  trove_starts_with?: InputMaybe<Scalars['String']>;
  trove_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum TroveChange_OrderBy {
  BorrowingFee = 'borrowingFee',
  CollateralAfter = 'collateralAfter',
  CollateralBefore = 'collateralBefore',
  CollateralChange = 'collateralChange',
  CollateralRatioAfter = 'collateralRatioAfter',
  CollateralRatioBefore = 'collateralRatioBefore',
  DebtAfter = 'debtAfter',
  DebtBefore = 'debtBefore',
  DebtChange = 'debtChange',
  Id = 'id',
  Liquidation = 'liquidation',
  Redemption = 'redemption',
  SequenceNumber = 'sequenceNumber',
  SystemStateAfter = 'systemStateAfter',
  SystemStateBefore = 'systemStateBefore',
  Transaction = 'transaction',
  Trove = 'trove',
  TroveOperation = 'troveOperation',
}

export enum TroveOperation {
  AccrueRewards = 'accrueRewards',
  AdjustTrove = 'adjustTrove',
  CloseTrove = 'closeTrove',
  LiquidateInNormalMode = 'liquidateInNormalMode',
  LiquidateInRecoveryMode = 'liquidateInRecoveryMode',
  OpenTrove = 'openTrove',
  RedeemCollateral = 'redeemCollateral',
  TransferGainToLineOfCredit = 'transferGainToLineOfCredit',
}

export enum TroveStatus {
  ClosedByLiquidation = 'closedByLiquidation',
  ClosedByOwner = 'closedByOwner',
  ClosedByRedemption = 'closedByRedemption',
  Open = 'open',
}

export type Trove_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  changes_?: InputMaybe<TroveChange_Filter>;
  collateral?: InputMaybe<Scalars['BigDecimal']>;
  collateralRatioSortKey?: InputMaybe<Scalars['BigDecimal']>;
  collateralRatioSortKey_gt?: InputMaybe<Scalars['BigDecimal']>;
  collateralRatioSortKey_gte?: InputMaybe<Scalars['BigDecimal']>;
  collateralRatioSortKey_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  collateralRatioSortKey_legacy?: InputMaybe<Scalars['BigInt']>;
  collateralRatioSortKey_legacy_gt?: InputMaybe<Scalars['BigInt']>;
  collateralRatioSortKey_legacy_gte?: InputMaybe<Scalars['BigInt']>;
  collateralRatioSortKey_legacy_in?: InputMaybe<Array<Scalars['BigInt']>>;
  collateralRatioSortKey_legacy_lt?: InputMaybe<Scalars['BigInt']>;
  collateralRatioSortKey_legacy_lte?: InputMaybe<Scalars['BigInt']>;
  collateralRatioSortKey_legacy_not?: InputMaybe<Scalars['BigInt']>;
  collateralRatioSortKey_legacy_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  collateralRatioSortKey_lt?: InputMaybe<Scalars['BigDecimal']>;
  collateralRatioSortKey_lte?: InputMaybe<Scalars['BigDecimal']>;
  collateralRatioSortKey_not?: InputMaybe<Scalars['BigDecimal']>;
  collateralRatioSortKey_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  collateral_gt?: InputMaybe<Scalars['BigDecimal']>;
  collateral_gte?: InputMaybe<Scalars['BigDecimal']>;
  collateral_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  collateral_lt?: InputMaybe<Scalars['BigDecimal']>;
  collateral_lte?: InputMaybe<Scalars['BigDecimal']>;
  collateral_not?: InputMaybe<Scalars['BigDecimal']>;
  collateral_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  debt?: InputMaybe<Scalars['BigDecimal']>;
  debt_gt?: InputMaybe<Scalars['BigDecimal']>;
  debt_gte?: InputMaybe<Scalars['BigDecimal']>;
  debt_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  debt_lt?: InputMaybe<Scalars['BigDecimal']>;
  debt_lte?: InputMaybe<Scalars['BigDecimal']>;
  debt_not?: InputMaybe<Scalars['BigDecimal']>;
  debt_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  owner?: InputMaybe<Scalars['String']>;
  owner_?: InputMaybe<User_Filter>;
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
  rawCollateral?: InputMaybe<Scalars['BigInt']>;
  rawCollateral_gt?: InputMaybe<Scalars['BigInt']>;
  rawCollateral_gte?: InputMaybe<Scalars['BigInt']>;
  rawCollateral_in?: InputMaybe<Array<Scalars['BigInt']>>;
  rawCollateral_lt?: InputMaybe<Scalars['BigInt']>;
  rawCollateral_lte?: InputMaybe<Scalars['BigInt']>;
  rawCollateral_not?: InputMaybe<Scalars['BigInt']>;
  rawCollateral_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  rawDebt?: InputMaybe<Scalars['BigInt']>;
  rawDebt_gt?: InputMaybe<Scalars['BigInt']>;
  rawDebt_gte?: InputMaybe<Scalars['BigInt']>;
  rawDebt_in?: InputMaybe<Array<Scalars['BigInt']>>;
  rawDebt_lt?: InputMaybe<Scalars['BigInt']>;
  rawDebt_lte?: InputMaybe<Scalars['BigInt']>;
  rawDebt_not?: InputMaybe<Scalars['BigInt']>;
  rawDebt_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  rawSnapshotOfTotalRedistributedCollateral?: InputMaybe<Scalars['BigInt']>;
  rawSnapshotOfTotalRedistributedCollateral_gt?: InputMaybe<Scalars['BigInt']>;
  rawSnapshotOfTotalRedistributedCollateral_gte?: InputMaybe<Scalars['BigInt']>;
  rawSnapshotOfTotalRedistributedCollateral_in?: InputMaybe<
    Array<Scalars['BigInt']>
  >;
  rawSnapshotOfTotalRedistributedCollateral_lt?: InputMaybe<Scalars['BigInt']>;
  rawSnapshotOfTotalRedistributedCollateral_lte?: InputMaybe<Scalars['BigInt']>;
  rawSnapshotOfTotalRedistributedCollateral_not?: InputMaybe<Scalars['BigInt']>;
  rawSnapshotOfTotalRedistributedCollateral_not_in?: InputMaybe<
    Array<Scalars['BigInt']>
  >;
  rawSnapshotOfTotalRedistributedDebt?: InputMaybe<Scalars['BigInt']>;
  rawSnapshotOfTotalRedistributedDebt_gt?: InputMaybe<Scalars['BigInt']>;
  rawSnapshotOfTotalRedistributedDebt_gte?: InputMaybe<Scalars['BigInt']>;
  rawSnapshotOfTotalRedistributedDebt_in?: InputMaybe<Array<Scalars['BigInt']>>;
  rawSnapshotOfTotalRedistributedDebt_lt?: InputMaybe<Scalars['BigInt']>;
  rawSnapshotOfTotalRedistributedDebt_lte?: InputMaybe<Scalars['BigInt']>;
  rawSnapshotOfTotalRedistributedDebt_not?: InputMaybe<Scalars['BigInt']>;
  rawSnapshotOfTotalRedistributedDebt_not_in?: InputMaybe<
    Array<Scalars['BigInt']>
  >;
  rawStake?: InputMaybe<Scalars['BigInt']>;
  rawStake_gt?: InputMaybe<Scalars['BigInt']>;
  rawStake_gte?: InputMaybe<Scalars['BigInt']>;
  rawStake_in?: InputMaybe<Array<Scalars['BigInt']>>;
  rawStake_lt?: InputMaybe<Scalars['BigInt']>;
  rawStake_lte?: InputMaybe<Scalars['BigInt']>;
  rawStake_not?: InputMaybe<Scalars['BigInt']>;
  rawStake_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  status?: InputMaybe<TroveStatus>;
  status_in?: InputMaybe<Array<TroveStatus>>;
  status_not?: InputMaybe<TroveStatus>;
  status_not_in?: InputMaybe<Array<TroveStatus>>;
};

export enum Trove_OrderBy {
  Changes = 'changes',
  Collateral = 'collateral',
  CollateralRatioSortKey = 'collateralRatioSortKey',
  CollateralRatioSortKeyLegacy = 'collateralRatioSortKey_legacy',
  Debt = 'debt',
  Id = 'id',
  Owner = 'owner',
  RawCollateral = 'rawCollateral',
  RawDebt = 'rawDebt',
  RawSnapshotOfTotalRedistributedCollateral = 'rawSnapshotOfTotalRedistributedCollateral',
  RawSnapshotOfTotalRedistributedDebt = 'rawSnapshotOfTotalRedistributedDebt',
  RawStake = 'rawStake',
  Status = 'status',
}

export type User = {
  __typename?: 'User';
  allowances?: Maybe<Array<TokenAllowance>>;
  balances?: Maybe<Array<TokenBalance>>;
  collSurplus: Scalars['BigDecimal'];
  collSurplusChanges: Array<CollSurplusChange>;
  /** User's Ethereum address as a hex-string */
  id: Scalars['ID'];
  liquidations: Array<Liquidation>;
  redemptions: Array<Redemption>;
  stabilityDeposit?: Maybe<StabilityDeposit>;
  trove?: Maybe<Trove>;
};

export type UserAllowancesArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TokenAllowance_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<TokenAllowance_Filter>;
};

export type UserBalancesArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TokenBalance_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<TokenBalance_Filter>;
};

export type UserCollSurplusChangesArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<CollSurplusChange_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<CollSurplusChange_Filter>;
};

export type UserLiquidationsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Liquidation_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Liquidation_Filter>;
};

export type UserRedemptionsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Redemption_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Redemption_Filter>;
};

export type User_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  allowances_?: InputMaybe<TokenAllowance_Filter>;
  balances_?: InputMaybe<TokenBalance_Filter>;
  collSurplus?: InputMaybe<Scalars['BigDecimal']>;
  collSurplusChanges_?: InputMaybe<CollSurplusChange_Filter>;
  collSurplus_gt?: InputMaybe<Scalars['BigDecimal']>;
  collSurplus_gte?: InputMaybe<Scalars['BigDecimal']>;
  collSurplus_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  collSurplus_lt?: InputMaybe<Scalars['BigDecimal']>;
  collSurplus_lte?: InputMaybe<Scalars['BigDecimal']>;
  collSurplus_not?: InputMaybe<Scalars['BigDecimal']>;
  collSurplus_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  liquidations_?: InputMaybe<Liquidation_Filter>;
  redemptions_?: InputMaybe<Redemption_Filter>;
  stabilityDeposit?: InputMaybe<Scalars['String']>;
  stabilityDeposit_?: InputMaybe<StabilityDeposit_Filter>;
  stabilityDeposit_contains?: InputMaybe<Scalars['String']>;
  stabilityDeposit_contains_nocase?: InputMaybe<Scalars['String']>;
  stabilityDeposit_ends_with?: InputMaybe<Scalars['String']>;
  stabilityDeposit_ends_with_nocase?: InputMaybe<Scalars['String']>;
  stabilityDeposit_gt?: InputMaybe<Scalars['String']>;
  stabilityDeposit_gte?: InputMaybe<Scalars['String']>;
  stabilityDeposit_in?: InputMaybe<Array<Scalars['String']>>;
  stabilityDeposit_lt?: InputMaybe<Scalars['String']>;
  stabilityDeposit_lte?: InputMaybe<Scalars['String']>;
  stabilityDeposit_not?: InputMaybe<Scalars['String']>;
  stabilityDeposit_not_contains?: InputMaybe<Scalars['String']>;
  stabilityDeposit_not_contains_nocase?: InputMaybe<Scalars['String']>;
  stabilityDeposit_not_ends_with?: InputMaybe<Scalars['String']>;
  stabilityDeposit_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  stabilityDeposit_not_in?: InputMaybe<Array<Scalars['String']>>;
  stabilityDeposit_not_starts_with?: InputMaybe<Scalars['String']>;
  stabilityDeposit_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  stabilityDeposit_starts_with?: InputMaybe<Scalars['String']>;
  stabilityDeposit_starts_with_nocase?: InputMaybe<Scalars['String']>;
  trove?: InputMaybe<Scalars['String']>;
  trove_?: InputMaybe<Trove_Filter>;
  trove_contains?: InputMaybe<Scalars['String']>;
  trove_contains_nocase?: InputMaybe<Scalars['String']>;
  trove_ends_with?: InputMaybe<Scalars['String']>;
  trove_ends_with_nocase?: InputMaybe<Scalars['String']>;
  trove_gt?: InputMaybe<Scalars['String']>;
  trove_gte?: InputMaybe<Scalars['String']>;
  trove_in?: InputMaybe<Array<Scalars['String']>>;
  trove_lt?: InputMaybe<Scalars['String']>;
  trove_lte?: InputMaybe<Scalars['String']>;
  trove_not?: InputMaybe<Scalars['String']>;
  trove_not_contains?: InputMaybe<Scalars['String']>;
  trove_not_contains_nocase?: InputMaybe<Scalars['String']>;
  trove_not_ends_with?: InputMaybe<Scalars['String']>;
  trove_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  trove_not_in?: InputMaybe<Array<Scalars['String']>>;
  trove_not_starts_with?: InputMaybe<Scalars['String']>;
  trove_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  trove_starts_with?: InputMaybe<Scalars['String']>;
  trove_starts_with_nocase?: InputMaybe<Scalars['String']>;
};

export enum User_OrderBy {
  Allowances = 'allowances',
  Balances = 'balances',
  CollSurplus = 'collSurplus',
  CollSurplusChanges = 'collSurplusChanges',
  Id = 'id',
  Liquidations = 'liquidations',
  Redemptions = 'redemptions',
  StabilityDeposit = 'stabilityDeposit',
  Trove = 'trove',
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

export type GetCollSurplusChangesQueryVariables = Exact<{
  skip: Scalars['Int'];
  pageSize: Scalars['Int'];
  orderBy?: InputMaybe<CollSurplusChange_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  filters?: InputMaybe<CollSurplusChange_Filter>;
}>;

export type GetCollSurplusChangesQuery = {
  __typename?: 'Query';
  collSurplusChanges: Array<{
    __typename?: 'CollSurplusChange';
    id: string;
    sequenceNumber: number;
    collSurplusChange: string;
    user: { __typename?: 'User'; id: string };
    transaction: { __typename?: 'Transaction'; id: string; timestamp: number };
  }>;
};

export type GetRedemptionsQueryVariables = Exact<{
  skip: Scalars['Int'];
  pageSize: Scalars['Int'];
  orderBy?: InputMaybe<Redemption_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  filters?: InputMaybe<Redemption_Filter>;
}>;

export type GetRedemptionsQuery = {
  __typename?: 'Query';
  redemptions: Array<{
    __typename?: 'Redemption';
    id: string;
    fee: string;
    partial: boolean;
    sequenceNumber: number;
    collateralRedeemed: string;
    tokensActuallyRedeemed: string;
    tokensAttemptedToRedeem: string;
    transaction: { __typename?: 'Transaction'; id: string; timestamp: number };
  }>;
};

export type GetStabilityDepositChangesQueryVariables = Exact<{
  skip: Scalars['Int'];
  pageSize: Scalars['Int'];
  orderBy?: InputMaybe<StabilityDepositChange_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  filters?: InputMaybe<StabilityDepositChange_Filter>;
}>;

export type GetStabilityDepositChangesQuery = {
  __typename?: 'Query';
  stabilityDepositChanges: Array<{
    __typename?: 'StabilityDepositChange';
    sequenceNumber: number;
    depositedAmountChange: string;
    stabilityDepositOperation: StabilityDepositOperation;
    collateralGain?: string | null;
    transaction: { __typename?: 'Transaction'; id: string; timestamp: number };
  }>;
};

export type GetStabilityPoolQueryVariables = Exact<{
  user: Scalars['ID'];
  skip: Scalars['Int'];
  pageSize: Scalars['Int'];
  orderBy?: InputMaybe<StabilityDepositChange_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  filters?: InputMaybe<StabilityDepositChange_Filter>;
}>;

export type GetStabilityPoolQuery = {
  __typename?: 'Query';
  stabilityDeposits: Array<{
    __typename?: 'StabilityDeposit';
    changes: Array<{
      __typename?: 'StabilityDepositChange';
      depositedAmountChange: string;
      depositedAmountAfter: string;
      stabilityDepositOperation: StabilityDepositOperation;
      sequenceNumber: number;
      transaction: {
        __typename?: 'Transaction';
        id: string;
        timestamp: number;
      };
    }>;
  }>;
};

export type GetSubsidyQueryVariables = Exact<{
  user: Scalars['Bytes'];
  skip: Scalars['Int'];
  pageSize: Scalars['Int'];
  orderBy?: InputMaybe<SovDistribution_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
}>;

export type GetSubsidyQuery = {
  __typename?: 'Query';
  sovdistributions: Array<{
    __typename?: 'SOVDistribution';
    id: string;
    amount?: string | null;
    timestamp: number;
  }>;
};

export type GetGlobalsEntityQueryVariables = Exact<{ [key: string]: never }>;

export type GetGlobalsEntityQuery = {
  __typename?: 'Query';
  globals: Array<{
    __typename?: 'Global';
    rawTotalRedistributedDebt: string;
    rawTotalRedistributedCollateral: string;
  }>;
};

export type GetTroveQueryVariables = Exact<{
  user: Scalars['ID'];
  skip: Scalars['Int'];
  pageSize: Scalars['Int'];
  orderBy?: InputMaybe<TroveChange_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  filters?: InputMaybe<TroveChange_Filter>;
}>;

export type GetTroveQuery = {
  __typename?: 'Query';
  trove?: {
    __typename?: 'Trove';
    debt: string;
    id: string;
    collateralRatioSortKey?: string | null;
    collateral: string;
    status: TroveStatus;
    changes: Array<{
      __typename?: 'TroveChange';
      collateralBefore: string;
      collateralChange: string;
      collateralAfter: string;
      debtBefore: string;
      debtChange: string;
      debtAfter: string;
      borrowingFee?: string | null;
      troveOperation: TroveOperation;
      transaction: {
        __typename?: 'Transaction';
        id: string;
        timestamp: number;
      };
      redemption?: { __typename?: 'Redemption'; partial: boolean } | null;
    }>;
  } | null;
};

export type GetTrovesQueryVariables = Exact<{
  first: Scalars['Int'];
}>;

export type GetTrovesQuery = {
  __typename?: 'Query';
  troves: Array<{
    __typename?: 'Trove';
    id: string;
    collateral: string;
    debt: string;
    status: TroveStatus;
    collateralRatioSortKey?: string | null;
    collateralRatioSortKey_legacy?: string | null;
    rawCollateral: string;
    rawDebt: string;
    rawSnapshotOfTotalRedistributedCollateral: string;
    rawSnapshotOfTotalRedistributedDebt: string;
    rawStake: string;
  }>;
};

export type GetUserOpenTroveQueryVariables = Exact<{
  user: Scalars['ID'];
}>;

export type GetUserOpenTroveQuery = {
  __typename?: 'Query';
  trove?: {
    __typename?: 'Trove';
    id: string;
    collateral: string;
    debt: string;
    status: TroveStatus;
    collateralRatioSortKey?: string | null;
    collateralRatioSortKey_legacy?: string | null;
    rawCollateral: string;
    rawDebt: string;
    rawSnapshotOfTotalRedistributedCollateral: string;
    rawSnapshotOfTotalRedistributedDebt: string;
    rawStake: string;
    changes: Array<{
      __typename?: 'TroveChange';
      id: string;
      sequenceNumber: number;
      transaction: {
        __typename?: 'Transaction';
        id: string;
        sequenceNumber: number;
      };
      trove: {
        __typename?: 'Trove';
        id: string;
        collateralRatioSortKey?: string | null;
        collateral: string;
        debt: string;
        status: TroveStatus;
      };
    }>;
  } | null;
};

export const GetCollSurplusChangesDocument = gql`
  query getCollSurplusChanges(
    $skip: Int!
    $pageSize: Int!
    $orderBy: CollSurplusChange_orderBy
    $orderDirection: OrderDirection
    $filters: CollSurplusChange_filter
  ) {
    collSurplusChanges(
      first: $pageSize
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
      where: $filters
    ) {
      id
      sequenceNumber
      collSurplusChange
      user {
        id
      }
      transaction {
        id
        timestamp
      }
    }
  }
`;

/**
 * __useGetCollSurplusChangesQuery__
 *
 * To run a query within a React component, call `useGetCollSurplusChangesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCollSurplusChangesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCollSurplusChangesQuery({
 *   variables: {
 *      skip: // value for 'skip'
 *      pageSize: // value for 'pageSize'
 *      orderBy: // value for 'orderBy'
 *      orderDirection: // value for 'orderDirection'
 *      filters: // value for 'filters'
 *   },
 * });
 */
export function useGetCollSurplusChangesQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetCollSurplusChangesQuery,
    GetCollSurplusChangesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetCollSurplusChangesQuery,
    GetCollSurplusChangesQueryVariables
  >(GetCollSurplusChangesDocument, options);
}
export function useGetCollSurplusChangesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetCollSurplusChangesQuery,
    GetCollSurplusChangesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetCollSurplusChangesQuery,
    GetCollSurplusChangesQueryVariables
  >(GetCollSurplusChangesDocument, options);
}
export type GetCollSurplusChangesQueryHookResult = ReturnType<
  typeof useGetCollSurplusChangesQuery
>;
export type GetCollSurplusChangesLazyQueryHookResult = ReturnType<
  typeof useGetCollSurplusChangesLazyQuery
>;
export type GetCollSurplusChangesQueryResult = Apollo.QueryResult<
  GetCollSurplusChangesQuery,
  GetCollSurplusChangesQueryVariables
>;
export const GetRedemptionsDocument = gql`
  query getRedemptions(
    $skip: Int!
    $pageSize: Int!
    $orderBy: Redemption_orderBy
    $orderDirection: OrderDirection
    $filters: Redemption_filter
  ) {
    redemptions(
      first: $pageSize
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
      where: $filters
    ) {
      id
      fee
      partial
      sequenceNumber
      collateralRedeemed
      tokensActuallyRedeemed
      tokensAttemptedToRedeem
      transaction {
        id
        timestamp
      }
    }
  }
`;

/**
 * __useGetRedemptionsQuery__
 *
 * To run a query within a React component, call `useGetRedemptionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRedemptionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRedemptionsQuery({
 *   variables: {
 *      skip: // value for 'skip'
 *      pageSize: // value for 'pageSize'
 *      orderBy: // value for 'orderBy'
 *      orderDirection: // value for 'orderDirection'
 *      filters: // value for 'filters'
 *   },
 * });
 */
export function useGetRedemptionsQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetRedemptionsQuery,
    GetRedemptionsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetRedemptionsQuery, GetRedemptionsQueryVariables>(
    GetRedemptionsDocument,
    options,
  );
}
export function useGetRedemptionsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetRedemptionsQuery,
    GetRedemptionsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetRedemptionsQuery, GetRedemptionsQueryVariables>(
    GetRedemptionsDocument,
    options,
  );
}
export type GetRedemptionsQueryHookResult = ReturnType<
  typeof useGetRedemptionsQuery
>;
export type GetRedemptionsLazyQueryHookResult = ReturnType<
  typeof useGetRedemptionsLazyQuery
>;
export type GetRedemptionsQueryResult = Apollo.QueryResult<
  GetRedemptionsQuery,
  GetRedemptionsQueryVariables
>;
export const GetStabilityDepositChangesDocument = gql`
  query getStabilityDepositChanges(
    $skip: Int!
    $pageSize: Int!
    $orderBy: StabilityDepositChange_orderBy
    $orderDirection: OrderDirection
    $filters: StabilityDepositChange_filter
  ) {
    stabilityDepositChanges(
      first: $pageSize
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
      where: $filters
    ) {
      sequenceNumber
      transaction {
        id
        timestamp
      }
      depositedAmountChange
      stabilityDepositOperation
      collateralGain
    }
  }
`;

/**
 * __useGetStabilityDepositChangesQuery__
 *
 * To run a query within a React component, call `useGetStabilityDepositChangesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetStabilityDepositChangesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetStabilityDepositChangesQuery({
 *   variables: {
 *      skip: // value for 'skip'
 *      pageSize: // value for 'pageSize'
 *      orderBy: // value for 'orderBy'
 *      orderDirection: // value for 'orderDirection'
 *      filters: // value for 'filters'
 *   },
 * });
 */
export function useGetStabilityDepositChangesQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetStabilityDepositChangesQuery,
    GetStabilityDepositChangesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetStabilityDepositChangesQuery,
    GetStabilityDepositChangesQueryVariables
  >(GetStabilityDepositChangesDocument, options);
}
export function useGetStabilityDepositChangesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetStabilityDepositChangesQuery,
    GetStabilityDepositChangesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetStabilityDepositChangesQuery,
    GetStabilityDepositChangesQueryVariables
  >(GetStabilityDepositChangesDocument, options);
}
export type GetStabilityDepositChangesQueryHookResult = ReturnType<
  typeof useGetStabilityDepositChangesQuery
>;
export type GetStabilityDepositChangesLazyQueryHookResult = ReturnType<
  typeof useGetStabilityDepositChangesLazyQuery
>;
export type GetStabilityDepositChangesQueryResult = Apollo.QueryResult<
  GetStabilityDepositChangesQuery,
  GetStabilityDepositChangesQueryVariables
>;
export const GetStabilityPoolDocument = gql`
  query getStabilityPool(
    $user: ID!
    $skip: Int!
    $pageSize: Int!
    $orderBy: StabilityDepositChange_orderBy
    $orderDirection: OrderDirection
    $filters: StabilityDepositChange_filter
  ) {
    stabilityDeposits(where: { id: $user }) {
      changes(
        first: $pageSize
        skip: $skip
        orderBy: $orderBy
        orderDirection: $orderDirection
        where: $filters
      ) {
        depositedAmountChange
        depositedAmountAfter
        stabilityDepositOperation
        transaction {
          id
          timestamp
        }
        sequenceNumber
      }
    }
  }
`;

/**
 * __useGetStabilityPoolQuery__
 *
 * To run a query within a React component, call `useGetStabilityPoolQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetStabilityPoolQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetStabilityPoolQuery({
 *   variables: {
 *      user: // value for 'user'
 *      skip: // value for 'skip'
 *      pageSize: // value for 'pageSize'
 *      orderBy: // value for 'orderBy'
 *      orderDirection: // value for 'orderDirection'
 *      filters: // value for 'filters'
 *   },
 * });
 */
export function useGetStabilityPoolQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetStabilityPoolQuery,
    GetStabilityPoolQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetStabilityPoolQuery, GetStabilityPoolQueryVariables>(
    GetStabilityPoolDocument,
    options,
  );
}
export function useGetStabilityPoolLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetStabilityPoolQuery,
    GetStabilityPoolQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetStabilityPoolQuery,
    GetStabilityPoolQueryVariables
  >(GetStabilityPoolDocument, options);
}
export type GetStabilityPoolQueryHookResult = ReturnType<
  typeof useGetStabilityPoolQuery
>;
export type GetStabilityPoolLazyQueryHookResult = ReturnType<
  typeof useGetStabilityPoolLazyQuery
>;
export type GetStabilityPoolQueryResult = Apollo.QueryResult<
  GetStabilityPoolQuery,
  GetStabilityPoolQueryVariables
>;
export const GetSubsidyDocument = gql`
  query getSubsidy(
    $user: Bytes!
    $skip: Int!
    $pageSize: Int!
    $orderBy: SOVDistribution_orderBy
    $orderDirection: OrderDirection
  ) {
    sovdistributions(
      first: $pageSize
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
      where: { user: $user }
    ) {
      id
      amount
      timestamp
    }
  }
`;

/**
 * __useGetSubsidyQuery__
 *
 * To run a query within a React component, call `useGetSubsidyQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSubsidyQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSubsidyQuery({
 *   variables: {
 *      user: // value for 'user'
 *      skip: // value for 'skip'
 *      pageSize: // value for 'pageSize'
 *      orderBy: // value for 'orderBy'
 *      orderDirection: // value for 'orderDirection'
 *   },
 * });
 */
export function useGetSubsidyQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetSubsidyQuery,
    GetSubsidyQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetSubsidyQuery, GetSubsidyQueryVariables>(
    GetSubsidyDocument,
    options,
  );
}
export function useGetSubsidyLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetSubsidyQuery,
    GetSubsidyQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetSubsidyQuery, GetSubsidyQueryVariables>(
    GetSubsidyDocument,
    options,
  );
}
export type GetSubsidyQueryHookResult = ReturnType<typeof useGetSubsidyQuery>;
export type GetSubsidyLazyQueryHookResult = ReturnType<
  typeof useGetSubsidyLazyQuery
>;
export type GetSubsidyQueryResult = Apollo.QueryResult<
  GetSubsidyQuery,
  GetSubsidyQueryVariables
>;
export const GetGlobalsEntityDocument = gql`
  query getGlobalsEntity {
    globals {
      rawTotalRedistributedDebt
      rawTotalRedistributedCollateral
    }
  }
`;

/**
 * __useGetGlobalsEntityQuery__
 *
 * To run a query within a React component, call `useGetGlobalsEntityQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetGlobalsEntityQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetGlobalsEntityQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetGlobalsEntityQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetGlobalsEntityQuery,
    GetGlobalsEntityQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetGlobalsEntityQuery, GetGlobalsEntityQueryVariables>(
    GetGlobalsEntityDocument,
    options,
  );
}
export function useGetGlobalsEntityLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetGlobalsEntityQuery,
    GetGlobalsEntityQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetGlobalsEntityQuery,
    GetGlobalsEntityQueryVariables
  >(GetGlobalsEntityDocument, options);
}
export type GetGlobalsEntityQueryHookResult = ReturnType<
  typeof useGetGlobalsEntityQuery
>;
export type GetGlobalsEntityLazyQueryHookResult = ReturnType<
  typeof useGetGlobalsEntityLazyQuery
>;
export type GetGlobalsEntityQueryResult = Apollo.QueryResult<
  GetGlobalsEntityQuery,
  GetGlobalsEntityQueryVariables
>;
export const GetTroveDocument = gql`
  query getTrove(
    $user: ID!
    $skip: Int!
    $pageSize: Int!
    $orderBy: TroveChange_orderBy
    $orderDirection: OrderDirection
    $filters: TroveChange_filter
  ) {
    trove(id: $user) {
      debt
      id
      collateralRatioSortKey
      collateral
      status
      changes(
        first: $pageSize
        skip: $skip
        orderBy: $orderBy
        orderDirection: $orderDirection
        where: $filters
      ) {
        transaction {
          id
          timestamp
        }
        collateralBefore
        collateralChange
        collateralAfter
        debtBefore
        debtChange
        debtAfter
        borrowingFee
        troveOperation
        redemption {
          partial
        }
      }
    }
  }
`;

/**
 * __useGetTroveQuery__
 *
 * To run a query within a React component, call `useGetTroveQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTroveQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTroveQuery({
 *   variables: {
 *      user: // value for 'user'
 *      skip: // value for 'skip'
 *      pageSize: // value for 'pageSize'
 *      orderBy: // value for 'orderBy'
 *      orderDirection: // value for 'orderDirection'
 *      filters: // value for 'filters'
 *   },
 * });
 */
export function useGetTroveQuery(
  baseOptions: Apollo.QueryHookOptions<GetTroveQuery, GetTroveQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetTroveQuery, GetTroveQueryVariables>(
    GetTroveDocument,
    options,
  );
}
export function useGetTroveLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetTroveQuery,
    GetTroveQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetTroveQuery, GetTroveQueryVariables>(
    GetTroveDocument,
    options,
  );
}
export type GetTroveQueryHookResult = ReturnType<typeof useGetTroveQuery>;
export type GetTroveLazyQueryHookResult = ReturnType<
  typeof useGetTroveLazyQuery
>;
export type GetTroveQueryResult = Apollo.QueryResult<
  GetTroveQuery,
  GetTroveQueryVariables
>;
export const GetTrovesDocument = gql`
  query getTroves($first: Int!) {
    troves(
      first: $first
      where: { status: open }
      orderBy: collateralRatioSortKey_legacy
      orderDirection: desc
    ) {
      id
      collateral
      debt
      status
      collateralRatioSortKey
      collateralRatioSortKey_legacy
      rawCollateral
      rawDebt
      rawSnapshotOfTotalRedistributedCollateral
      rawSnapshotOfTotalRedistributedDebt
      rawStake
    }
  }
`;

/**
 * __useGetTrovesQuery__
 *
 * To run a query within a React component, call `useGetTrovesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTrovesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTrovesQuery({
 *   variables: {
 *      first: // value for 'first'
 *   },
 * });
 */
export function useGetTrovesQuery(
  baseOptions: Apollo.QueryHookOptions<GetTrovesQuery, GetTrovesQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetTrovesQuery, GetTrovesQueryVariables>(
    GetTrovesDocument,
    options,
  );
}
export function useGetTrovesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetTrovesQuery,
    GetTrovesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetTrovesQuery, GetTrovesQueryVariables>(
    GetTrovesDocument,
    options,
  );
}
export type GetTrovesQueryHookResult = ReturnType<typeof useGetTrovesQuery>;
export type GetTrovesLazyQueryHookResult = ReturnType<
  typeof useGetTrovesLazyQuery
>;
export type GetTrovesQueryResult = Apollo.QueryResult<
  GetTrovesQuery,
  GetTrovesQueryVariables
>;
export const GetUserOpenTroveDocument = gql`
  query getUserOpenTrove($user: ID!) {
    trove(id: $user) {
      id
      collateral
      debt
      status
      collateralRatioSortKey
      collateralRatioSortKey_legacy
      rawCollateral
      rawDebt
      rawSnapshotOfTotalRedistributedCollateral
      rawSnapshotOfTotalRedistributedDebt
      rawStake
      changes(
        where: { troveOperation: openTrove }
        orderBy: sequenceNumber
        orderDirection: desc
      ) {
        id
        sequenceNumber
        transaction {
          id
          sequenceNumber
        }
        trove {
          id
          collateralRatioSortKey
          collateral
          debt
          status
        }
      }
    }
  }
`;

/**
 * __useGetUserOpenTroveQuery__
 *
 * To run a query within a React component, call `useGetUserOpenTroveQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserOpenTroveQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserOpenTroveQuery({
 *   variables: {
 *      user: // value for 'user'
 *   },
 * });
 */
export function useGetUserOpenTroveQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetUserOpenTroveQuery,
    GetUserOpenTroveQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetUserOpenTroveQuery, GetUserOpenTroveQueryVariables>(
    GetUserOpenTroveDocument,
    options,
  );
}
export function useGetUserOpenTroveLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetUserOpenTroveQuery,
    GetUserOpenTroveQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetUserOpenTroveQuery,
    GetUserOpenTroveQueryVariables
  >(GetUserOpenTroveDocument, options);
}
export type GetUserOpenTroveQueryHookResult = ReturnType<
  typeof useGetUserOpenTroveQuery
>;
export type GetUserOpenTroveLazyQueryHookResult = ReturnType<
  typeof useGetUserOpenTroveLazyQuery
>;
export type GetUserOpenTroveQueryResult = Apollo.QueryResult<
  GetUserOpenTroveQuery,
  GetUserOpenTroveQueryVariables
>;
