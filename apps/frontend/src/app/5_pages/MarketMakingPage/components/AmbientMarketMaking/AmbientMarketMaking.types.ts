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
  positionType: string;
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
