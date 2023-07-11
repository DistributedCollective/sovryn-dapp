export type StakeItem = {
  stakedAmount: string;
  unlockDate: number;
  delegate: string;
};

export type StakingData = {
  dates: string[];
  stakes: string[];
};
