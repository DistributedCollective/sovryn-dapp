import { PoolPositionType } from '../../MarketMakingPage.types';

export interface AmbientPosition {
  chainId: string;
  base: string;
  quote: string;
  poolIdx: number;
  bidTick: number;
  askTick: number;
  isBid: boolean;
  user: string;
  timeFirstMint: number;
  latestUpdateTime: number;
  lastMintTx: string;
  firstMintTx: string;
  positionType: PoolPositionType;
  ambientLiq: number;
  concLiq: number;
  rewardLiq: number;
  liqRefreshTime: number;
  aprDuration: number;
  aprPostLiq: number;
  aprContributedLiq: number;
  aprEst: number;
  positionId: string;
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
