export enum StakingHistoryType {
  increase = 'increase',
  unstake = 'unstake',
  extend = 'extend',
  delegate = 'delegate',
}

export type StakingHistoryProps = {
  selectedHistoryType: StakingHistoryType;
  onChangeHistoryType: (value: StakingHistoryType) => void;
};
