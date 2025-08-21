export type LockedDataResult = {
  tvlLending:
    | {
        totalUsd: string;
      }
    | undefined;
  tvlAmm:
    | {
        totalUsd: string;
      }
    | undefined;
  tvlProtocol:
    | {
        totalUsd: string;
      }
    | undefined;
  tvlStaking:
    | {
        totalUsd: string;
      }
    | undefined;
  tvlSubprotocols:
    | {
        totalUsd: string;
      }
    | undefined;
  tvlZero:
    | {
        totalUsd: string;
      }
    | undefined;
  tvlMynt:
    | {
        totalUsd: string;
      }
    | undefined;
  tvlSdex:
    | {
        totalUsd: string;
      }
    | undefined;
  total_usd: string;
};

export type VolumeDataResult = {
  usd: number;
};
