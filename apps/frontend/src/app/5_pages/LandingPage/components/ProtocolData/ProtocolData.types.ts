export type LockedDataResult = {
  tvlLending:
    | {
        totalBtc: string;
        totalUsd: string;
      }
    | undefined;
  tvlAmm:
    | {
        totalBtc: string;
        totalUsd: string;
      }
    | undefined;
  tvlProtocol:
    | {
        totalBtc: string;
        totalUsd: string;
      }
    | undefined;
  tvlStaking:
    | {
        totalBtc: string;
        totalUsd: string;
      }
    | undefined;
  tvlSubprotocols:
    | {
        totalBtc: string;
        totalUsd: string;
      }
    | undefined;
  tvlZero:
    | {
        totalBtc: string;
        totalUsd: string;
      }
    | undefined;
  tvlMynt:
    | {
        totalBtc: string;
        totalUsd: string;
      }
    | undefined;
  tvlSdex:
    | {
        totalBtc: string;
        totalUsd: string;
      }
    | undefined;
  total_usd: string;
  total_btc: string;
};

export type VolumeDataResult = {
  usd: number;
};
