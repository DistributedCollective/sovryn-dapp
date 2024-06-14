export interface PoolPositionIndexerResponse {
  positionId: string;
  chainId: string;
  askTick: number;
  bidTick: number;
  poolIdx: number;
  base: string;
  quote: string;
  user: string;
  ambientLiq: number;
  concLiq: number;
  rewardLiq: number;
  positionType: string;
  timeFirstMint: number;
  lastMintTx: string;
  firstMintTx: string;
  aprEst: number;
}

export type Position = {
  positionId: string;
  wallet: string;
  minPriceQuote: number;
  minPriceBase: number;
  maxPriceQuote: number;
  maxPriceBase: number;
  positionLiq: number;
  positionLiqBase: number;
  positionLiqQuote: number;
  positionType: string;
  baseTokenDecimals: number;
  quoteTokenDecimals: number;
  baseTokenSymbol: string;
  quoteTokenSymbol: string;
};
