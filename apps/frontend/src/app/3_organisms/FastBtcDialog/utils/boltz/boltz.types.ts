export enum BoltzTxStatus {
  set = 'invoice.set',
  pending = 'invoice.pending',
  paid = 'invoice.paid',
  settled = 'invoice.settled',
  expired = 'invoice.expired',
  failedToPay = 'invoice.failedToPay',
  swapCreated = 'swap.created',
  swapExpired = 'swap.expired',
  txMempool = 'transaction.mempool',
  txConfirmed = 'transaction.confirmed',
  txFailed = 'transaction.failed',
  txClaimed = 'transaction.claimed',
  txRefunded = 'transaction.refunded',
  txLockupFailed = 'transaction.lockupFailed',
  minerFeePaid = 'minerFee.paid',
}

export type Status = BoltzTxStatus | string;

export type SubmarineSwapPair = {
  hash: string;
  rate: number;
  limits: {
    maximal: number;
    minimal: number;
    maximalZeroConf: number;
  };
  fees: {
    percentage: number;
    minerFees: number;
  };
};

export type GetSubmarineSwapPairsResponse = Record<
  string,
  Record<string, SubmarineSwapPair>
>;

export type SubmarineSwapBody = {
  from: string;
  to: string;
  invoice: string;
  refundPublicKey: string;
  refundAddress: string;
  pairHash: string;
  referallId: string;
};

export type SubmarineSwapResponse = {
  id: string;
  bip21: string;
  address: string;
  swapTree: {
    claimLeaf: {
      version: number;
      output: string;
    };
    refundLeaf: {
      version: number;
      output: string;
    };
  };
  claimPublicKey: string;
  claimAddress: string;
  timeoutBlockHeight: number;
  acceptZeroConf: boolean;
  expectedAmount: number;
  blindingKey: string;
};

export type SwapResponse = {
  status: Status;
  zeroConfRejected: boolean;
  transaction: {
    id: string;
    hexh: string;
  };
};

export type SubmarineSwapTransactionResponse = {
  id: string;
  hex: string;
  timeoutBlockHeight: number;
  timeoutEta: number;
};

export type SubmarineRefundBody = {
  id: string;
  pubNonce: string;
  transaction: string;
  index: number;
};
export type SubmarineRefundResponse = {};

export type ReverseSwapPair = {
  hash: string;
  rate: number;
  limits: {
    maximal: number;
    minimal: number;
    maximalZeroConf: number;
  };
  fees: {
    percentage: number;
    minerFees: {
      claim: number;
      lockup: number;
    };
  };
};
export type GetReversePairsResponse = Record<
  string,
  Record<string, ReverseSwapPair>
>;

export type ReverseSwapBody = {
  from: string;
  to: string;
  preimageHash: string;
  claimPublicKey: string;
  claimAddress: string;
  invoiceAmount: number;
  onchainAmount: string;
  pairHash: string;
  referralId: string;
};
export type ReverseSwapResponse = {
  id: string;
  invoice: string;
  swapTree: {
    claimLeaf: {
      version: number;
      output: string;
    };
    refundLeaf: {
      version: number;
      output: string;
    };
  };
  lockupAddress: string;
  refundPublicKey: string;
  refundAddress: string;
  timeoutBlockHeight: number;
  onchainAmount: number;
  blindinKey: string;
};

export type ReverseSwapTransactionResponse = {
  id: string;
  hex: string;
  timeoutBlockHeight: number;
};

export type ClaimReverseSwapBody = {
  id: string;
  preimage: string;
  pubNonce: string;
  transaction: string;
  index: number;
};
export type ClaimReverseSwapResponse = {
  pubNonce: string;
  partialSignature: string;
};

export type BoltzListener = {
  status: (cb: (data: { id: string; status: Status }) => void) => () => void;
  close: () => void;
};

export type ContractsResponse = {
  [key: string]: {
    network: {
      chainId: number;
    };
    tokens: object;
    swapContracts: {
      EtherSwap: string;
      ERC20Swap: string;
    };
  };
};
