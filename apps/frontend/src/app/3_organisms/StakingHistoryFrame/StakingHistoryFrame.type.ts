export enum StakingHistoryType {
  increase = 'increase',
  unstake = 'unstake',
  extend = 'extend',
  delegate = 'delegate',
  delegateVesting = 'delegateVesting',
}

export type StakingHistoryProps = {
  selectedHistoryType: StakingHistoryType;
  onChangeHistoryType: (value: StakingHistoryType) => void;
};
