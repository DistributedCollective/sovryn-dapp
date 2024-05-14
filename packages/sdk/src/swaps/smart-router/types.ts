import type { TransactionRequest } from '@ethersproject/abstract-provider';
import type { ChainId } from '@sovryn/ethers-provider';
import { PermitTransferFrom } from '@uniswap/permit2-sdk';

import type { BigNumber, BigNumberish, providers } from 'ethers';

export type SwapPairs = Map<string, string[]>;

export type Options = {
  slippage: BigNumberish;
};

export type SwapOptions = {
  /** @deprecated */
  permit?: PermitTransactionResponse;
  /** @deprecated */
  permitTransferFrom?: PermitTransferFrom;
  typedDataRequest?: TypedDataTransactionRequest['request'];
  typedDataSignature?: string;
} & Options;

export type SwapRoute = {
  name: string;
  chains: ChainId[];

  // List of token pairs available for swapping. Key is the base token, value is the list of quote tokens.
  // Example: { '0x': ['0x', '0x'] }
  pairs: () => Promise<SwapPairs>;

  // Get expected amount for swap.
  quote: (
    entry: string,
    destination: string,
    amount: BigNumberish,
    options?: Partial<Options>,
    overrides?: Partial<TransactionRequest>,
  ) => Promise<BigNumber>;

  // Build swap tx data.
  swap: (
    entry: string,
    destination: string,
    amount: BigNumberish,
    from: string,
    options?: Partial<SwapOptions>,
    overrides?: Partial<TransactionRequest>,
  ) => Promise<TransactionRequest>;

  // Build approval tx data.
  // If undefined is returned, token doesn't need to be approved.
  approve: (
    entry: string,
    destination: string,
    amount: BigNumberish,
    from: string,
    overrides?: Partial<TransactionRequest>,
  ) => Promise<TransactionRequest | undefined>;

  permit: (
    entry: string,
    destination: string,
    amount: BigNumberish,
    from: string,
    overrides?: Partial<TypedDataTransactionRequest>,
  ) => Promise<TypedDataTransactionRequest | undefined>;

  // todo: add functions overriding some values (like changing zero address with wrbtc)
  onPrepareTransaction?: (
    tx: TransactionRequest,
  ) => Promise<TransactionRequest>;
};

export type SwapRouteFunction = (provider: providers.Provider) => SwapRoute;

/**
 * @deprecated Use TypedDataTransactionRequest instead
 */
export type PermitTransactionRequest = {
  /**
   * @deprecated Use 'typedData' instead
   */
  token: string;
  spender: string;
  owner: string;
  value?: BigNumberish;
  deadline?: number;
  nonce?: number;
};

export type TypedDataTransactionRequest = {
  request: any;
  typedData: {
    domain: any;
    types: Record<string, any>;
    values: any;
  };
};

/**
 * @deprecated
 */
export type PermitTransactionResponse = {
  r: string;
  s: string;
  v: number;
  owner: string;
  spender: string;
  value: string | number;
  nonce: string | number;
  deadline: string | number;
};
