export type LockedDataResult = {
  tvlLending: {
    totalBtc: number;
    totalUsd: number;
  };
  tvlAmm: {
    totalBtc: number;
    totalUsd: number;
  };
  tvlProtocol: {
    totalBtc: number;
    totalUsd: number;
  };
  tvlStaking: {
    totalBtc: number;
    totalUsd: number;
  };
  tvlSubprotocols: {
    totalBtc: number;
    totalUsd: number;
  };
  tvlZero: {
    totalBtc: number;
    totalUsd: number;
  };
  tvlMynt: {
    totalBtc: number;
    totalUsd: number;
  };
  total_usd: number;
};

export type VolumeDataResult = {
  usd: number;
};
