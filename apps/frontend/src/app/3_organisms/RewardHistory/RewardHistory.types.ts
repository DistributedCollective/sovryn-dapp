export enum RewardHistoryType {
  stabilityPoolRewards = 'stabilityPoolRewards',
  stabilityPoolSubsidies = 'stabilityPoolSubsidies',
  stakingRevenue = 'stakingRevenue',
  stakingSubsidies = 'stakingSubsidies',
  vestingRewards = 'vestingRewards',
}

export type RewardHistoryProps = {
  selectedHistoryType: RewardHistoryType;
  onChangeRewardHistory: (value: RewardHistoryType) => void;
};
