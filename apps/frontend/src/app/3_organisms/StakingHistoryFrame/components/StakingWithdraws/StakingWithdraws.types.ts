export type StakingWithdrawItem = {
  id: string;
  amount: string;
  timestamp: number;
  until: number;
  user: {
    id: string;
  };
  receiver: {
    id: string;
  };
};
