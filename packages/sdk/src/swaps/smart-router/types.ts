import type { TransactionRequest } from '@ethersproject/abstract-provider';

import type { BigNumber, BigNumberish, providers } from 'ethers';

export type SwapPairs = Map<string, string[]>;

export type SwapRoute = {
  name: string;

  // List of token pairs available for swapping. Key is the base token, value is the list of quote tokens.
  // Example: { '0x': ['0x', '0x'] }
  pairs: () => Promise<SwapPairs>;

  // Get expected amount for swap.
  quote: (
    entry: string,
    destination: string,
    amount: BigNumberish,
    slippage?: BigNumberish,
    overrides?: Partial<TransactionRequest>,
  ) => Promise<BigNumber>;

  // Build swap tx data.
  swap: (
    entry: string,
    destination: string,
    amount: BigNumberish,
    slippage?: BigNumberish,
    overrides?: Partial<TransactionRequest>,
  ) => Promise<TransactionRequest>;

  // Build approval tx data.
  // If undefined is returned, token doesn't need to be approved.
  approve: (
    entry: string,
    destination: string,
    amount?: BigNumberish,
    overrides?: Partial<TransactionRequest>,
  ) => Promise<TransactionRequest | undefined>;

  // todo: add functions overriding some values (like changing zero address with wrbtc)
  onPrepareTransaction?: (
    tx: TransactionRequest,
  ) => Promise<TransactionRequest>;
};

export type SwapRouteFunction = (provider: providers.Provider) => SwapRoute;
