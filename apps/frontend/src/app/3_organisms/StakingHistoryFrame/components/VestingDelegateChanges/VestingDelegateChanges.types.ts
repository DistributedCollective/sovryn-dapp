export type VestingDelegateChangeItem = {
  id: string;
  timestamp: number;
  delegatee: {
    id: string;
  };
  transaction: {
    id: string;
  };
  amount: string;
};
