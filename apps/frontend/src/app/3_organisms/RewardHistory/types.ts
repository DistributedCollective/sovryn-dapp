export enum RewardHistoryType {
  stabilityPoolRewards = 'stabilityPoolRewards',
  stabilityPoolSubsidies = 'stabilityPoolSubsidies',
}

export type RewardHistoryProps = {
  selectedHistoryType: RewardHistoryType;
  onChangeRewardHistory: (value: RewardHistoryType) => void;
};
