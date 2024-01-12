export enum URIType {
  BITCOIN = 'bitcoin:',
}

export enum ReceiveEvents {
  txAmount = 'txAmount',
  depositTx = 'depositTx',
  transferTx = 'transferTx',
  disconnect = 'disconnect',
  getDepositAddress = 'getDepositAddress',
  getDepositHistory = 'getDepositHistory',
}

export type BoltzFees = {
  percentage: number;
  percentageSwapIn: number;
  minerFees: {
    baseAsset: BoltzMinerFees;
    quoteAsset: BoltzMinerFees;
  };
};

export type BoltzMinerFees = {
  normal: number;
  reverse: {
    claim: number;
    lockup: number;
  };
};

export type BoltzLimits = {
  minimal: number;
  maximal: number;
  maximalZeroConf: {
    baseAsset: number;
    quoteAsset: number;
  };
};
