export type CreateReverseSwapResponse = {
  id: string;
  invoice: string;
  lockupAddress: string;
  refundAddress: string;
  timeoutBlockHeight: number;
  onchainAmount: number;
};

export type ReverseSwap = CreateReverseSwapResponse & {
  asset: string;
  date: number;
  onchainAddress: string;
  preimage: string;
  preimageHash: string;
  receiveAmount: number;
  reverse: boolean;
  sendAmount: number;
};

export type CreateSwapResponse = {
  id: string;
  address: string;
  acceptZeroConf: boolean;
  claimAddress: string;
  timeoutBlockHeight: number;
  expectedAmount: number;
};

export type Swap = CreateSwapResponse & {
  invoice: string;
  asset: string;
  date: number;
  onchainAddress: string;
  reverse: boolean;
};

export type CheckSwapStatusResponse = {
  status: string;
};

export type GetContractsResponse = {
  [key: string]: {
    network: {
      chainId: number;
    };
    swapContracts: {
      EtherSwap: string;
      ERC20Swap: string;
    };
  };
};

export type BoltzPair = {
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
};
