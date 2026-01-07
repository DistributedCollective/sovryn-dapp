import { PoolPositionType } from '../../MarketMakingPage.types';

export interface AmbientPosition {
  base: string;
  quote: string;
  ambientLiq: string;
  time: string;
  transactionHash: string;
  concLiq: string;
  rewardLiq: string;
  baseQty: string;
  quoteQty: string;
  aggregatedLiquidity: string;
  aggregatedBaseFlow: string;
  aggregatedQuoteFlow: string;
  positionType: PoolPositionType;
  bidTick: number;
  askTick: number;
  aprDuration: string;
  aprPostLiq: string;
  aprContributedLiq: string;
  aprEst: string;

  lpTokenAddress?: string;
  lpTokenBalance?: string;
}

export interface AmbientTransaction {
  blockNum: number;
  txHash: string;
  txTime: number;
  user: string;
  chainId: string;
  base: string;
  quote: string;
  poolIdx: number;
  baseFlow: number;
  quoteFlow: number;
  entityType: string;
  changeType: string;
  positionType: string;
  bidTick: number;
  askTick: number;
  isBuy: boolean;
  inBaseQty: boolean;
  txId: string;
}
export interface AmbientPoolCandle {
  priceOpen: number;
  priceClose: number;
  minPrice: number;
  maxPrice: number;
  volumeBase: number;
  volumeQuote: number;
  tvlBase: number;
  tvlQuote: number;
  feeRateOpen: number;
  feeRateClose: number;
  period: number;
  time: number;
}
export interface AmbientPoolStats {
  latestTime: number;
  baseTvl: number;
  quoteTvl: number;
  baseVolume: number;
  quoteVolume: number;
  baseFees: number;
  quoteFees: number;
  lastPriceSwap: number;
  lastPriceLiq: number;
  lastPriceIndic: number;
  feeRate: number;
}

export type BlockedAmbientPoolConfig = {
  poolAssetA: string;
  poolAssetB: string;
  message: string;
};
