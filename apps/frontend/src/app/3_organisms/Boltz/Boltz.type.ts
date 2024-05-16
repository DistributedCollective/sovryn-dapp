export interface CreateReverseSwapResponse {
  id: string;
  invoice: string;
  refundAddress: string;
  lockupAddress: string;
  timeoutBlockHeight: number;
  onchainAmount: number;
}

export interface CreateSwapResponse {
  id: string;
  invoice: string;
  claimAddress: string;
  timeoutBlockHeight: number;
  expectedAmount: number;
}

export interface CheckSwapStatusResponse {
  status: string;
}

export interface GetContractsResponse {
  [key: string]: {
    network: {
      chainId: number;
    };
    swapContracts: {
      EtherSwap: string;
      ERC20Swap: string;
    };
  };
}

export interface BoltzPair {
  hash: string;
  rate: number;
  limits: {
    maximal: number;
    minimal: number;
    maximalZeroConf: {
      baseAsset: number;
      quoteAsset: number;
    };
  };
  fees: {
    percentage: number;
    percentageSwapIn: number;
    minerFees: {
      baseAsset: {
        normal: number;
        reverse: {
          claim: number;
          lockup: number;
        };
      };
      quoteAsset: {
        normal: number;
        reverse: {
          claim: number;
          lockup: number;
        };
      };
    };
  };
}
