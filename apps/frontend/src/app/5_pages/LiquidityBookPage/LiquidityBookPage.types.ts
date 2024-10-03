import { Token } from '@sovryn/joe-core';

/** @deprecated */
export type LiquidityBookPool = {
  pair: Token[];
  liquidity: string[];
  contractAddress: string;
  activeBinId: number;
  binStep: number;
};

export type LiquidityBookProps = {
  pool: LiquidityBookPool;
};
