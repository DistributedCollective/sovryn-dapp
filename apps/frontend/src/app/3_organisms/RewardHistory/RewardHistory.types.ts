export enum RewardHistoryType {
  liquidityMiningRewards = 'liquidityMiningRewards',
  stabilityPoolRewards = 'stabilityPoolRewards',
  stabilityPoolSubsidies = 'stabilityPoolSubsidies',
  stakingRevenue = 'stakingRevenue',
  stakingSubsidies = 'stakingSubsidies',
  stakingVestingRewards = 'stakingVestingRewards',
  liquidityMiningVestingRewards = 'liquidityMiningVestingRewards',
}

export type RewardHistoryProps = {
  selectedHistoryType: RewardHistoryType;
  onChangeRewardHistory: (value: RewardHistoryType) => void;
};
