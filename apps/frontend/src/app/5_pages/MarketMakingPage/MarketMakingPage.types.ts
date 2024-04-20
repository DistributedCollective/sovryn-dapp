import { SupportedTokens } from '@sovryn/contracts';
import { Decimal } from '@sovryn/utils';

import { AmmLiquidityPool } from './utils/AmmLiquidityPool';

export type UserInfo = {
  amount: Decimal;
  reward: Decimal;
};

export type PoolData = {
  pool_token: string;
  activity_date: string;
  APY_fees_pc: string;
  APY_rewards_pc: string;
  APY_pc: string;
};

export type PoolBalanceData = {
  activity_date: string;
  balance_btc: number;
  pool: string;
};

export type AmmHistory = {
  pool: string;
  data: {
    [key: string]: PoolData[];
  };
  balanceHistory: PoolBalanceData[];
};

export type PromotionData = {
  rewardAmount: number;
  type: 'AMM' | 'LENDING';
  poolTokenA: string;
  asset1: SupportedTokens;
  asset2: SupportedTokens;
  linkAsset?: string;
  ammData: AmmHistory;
  apy: string;
  pool?: AmmLiquidityPool;
};

export type PromotionsDataResponse = {
  data: PromotionData[];
  loading: boolean;
};

export enum PoolPositionType {
  ambient = 'ambient',
  concentrated = 'concentrated',
}
