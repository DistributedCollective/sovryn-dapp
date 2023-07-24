export type V2StakingDelegateChangeItem = {
  id: string;
  timestamp: number;
  lockedUntil: number;
  user: {
    id: string;
  };
  delegate: {
    id: string;
  };
  previousDelegate: {
    id: string;
  };
};
