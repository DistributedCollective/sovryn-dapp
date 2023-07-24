export enum StakingistoryType {
  increase = 'increase',
  unstake = 'unstake',
  extend = 'extend',
  delegate = 'delegate',
}

export type StakingHistoryProps = {
  selectedHistoryType: StakingistoryType;
  onChangeHistoryType: (value: StakingistoryType) => void;
};
