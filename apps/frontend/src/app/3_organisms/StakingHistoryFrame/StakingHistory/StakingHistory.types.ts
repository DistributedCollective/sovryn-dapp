export type V2StakingHistoryItem = {
  id: string;
  amount: string;
  totalStaked: string;
  timestamp: number;
  lockedUntil: number;
  user: {
    id: string;
  };
};
