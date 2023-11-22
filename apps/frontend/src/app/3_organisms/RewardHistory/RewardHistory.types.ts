export enum RewardHistoryType {
  liquidityMiningRewards = 'liquidityMiningRewards',
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
